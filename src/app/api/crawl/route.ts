import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json, error } from "@/lib/api";
import Anthropic from "@anthropic-ai/sdk";
import type { DataType, ModuleStatus } from "@/generated/prisma/client";

// POST /api/crawl — trigger a website crawl via Firecrawl
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { url, customerId } = body;

  if (!url) return error("URL is required");
  if (!customerId) return error("Customer ID is required");

  // Validate URL to prevent SSRF
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return error("URL must use http or https");
    }
    const blockedHosts = ["localhost", "127.0.0.1", "0.0.0.0", "[::1]"];
    if (
      blockedHosts.includes(parsed.hostname) ||
      parsed.hostname.startsWith("169.254.") ||
      parsed.hostname.startsWith("10.") ||
      parsed.hostname.startsWith("192.168.") ||
      parsed.hostname.startsWith("172.16.")
    ) {
      return error("Internal URLs are not allowed");
    }
  } catch {
    return error("Invalid URL format");
  }

  const firecrawlKey = process.env.FIRECRAWL_API_KEY;
  if (!firecrawlKey) {
    return error("Firecrawl API key not configured", 503);
  }

  try {
    // Start Firecrawl crawl job
    const crawlResponse = await fetch("https://api.firecrawl.dev/v1/crawl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${firecrawlKey}`,
      },
      body: JSON.stringify({
        url,
        limit: 20,
        scrapeOptions: {
          formats: ["markdown"],
        },
      }),
    });

    if (!crawlResponse.ok) {
      const err = await crawlResponse.text();
      console.error("Firecrawl error:", err);
      return error("Failed to start website crawl", 502);
    }

    const crawlData = await crawlResponse.json();

    // Store crawl job ID in customer metadata
    await prisma.customer.update({
      where: { id: customerId },
      data: {
        metadata: {
          ...(
            (await prisma.customer.findUnique({
              where: { id: customerId },
              select: { metadata: true },
            }))?.metadata as object || {}
          ),
          crawlJobId: crawlData.id,
          crawlUrl: url,
          crawlStatus: "running",
        },
      },
    });

    return json({ jobId: crawlData.id, status: "running" });
  } catch (e) {
    console.error("Crawl error:", e);
    return error("Failed to initiate crawl", 500);
  }
}

// GET /api/crawl?jobId=xxx&customerId=yyy — check crawl status
export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get("jobId");
  const customerId = req.nextUrl.searchParams.get("customerId");

  if (!jobId) return error("Job ID is required");

  const firecrawlKey = process.env.FIRECRAWL_API_KEY;
  if (!firecrawlKey) return error("Firecrawl API key not configured", 503);

  try {
    const statusResponse = await fetch(
      `https://api.firecrawl.dev/v1/crawl/${jobId}`,
      {
        headers: { Authorization: `Bearer ${firecrawlKey}` },
      }
    );

    if (!statusResponse.ok) {
      return error("Failed to check crawl status", 502);
    }

    const statusData = await statusResponse.json();

    // If complete, extract and store data using Claude
    if (statusData.status === "completed" && customerId && statusData.data) {
      const extractedData = await extractBusinessDataWithClaude(statusData.data);

      // Update customer metadata with extracted data
      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
        select: { metadata: true },
      });

      await prisma.customer.update({
        where: { id: customerId },
        data: {
          metadata: {
            ...((customer?.metadata as object) || {}),
            crawlStatus: "completed",
            crawlResults: extractedData,
          },
        },
      });

      // Pre-fill collected data for each extracted data type
      const dataTypeMapping: { key: string; dataType: DataType; moduleSlug: string }[] = [
        { key: "businessInfo", dataType: "business_info", moduleSlug: "business-basics" },
        { key: "staff", dataType: "staff", moduleSlug: "staff-details" },
        { key: "classes", dataType: "classes", moduleSlug: "class-collection" },
        { key: "appointments", dataType: "appointments", moduleSlug: "appointment-collection" },
        { key: "pricing", dataType: "pricing", moduleSlug: "pricing-options" },
        { key: "branding", dataType: "branding", moduleSlug: "branding-logo" },
        { key: "waiver", dataType: "waiver", moduleSlug: "liability-waiver" },
      ];

      const populatedModuleSlugs: string[] = [];

      for (const { key, dataType, moduleSlug } of dataTypeMapping) {
        const data = (extractedData as Record<string, unknown>)[key] as Record<string, unknown> | undefined;
        if (data && Object.keys(data).length > 0) {
          await prisma.customerCollectedData.upsert({
            where: { customerId_dataType: { customerId, dataType } },
            update: { data: data as object },
            create: { customerId, dataType, data: data as object },
          });
          populatedModuleSlugs.push(moduleSlug);
        }
      }

      // Mark pre-populated modules as partially_complete
      if (populatedModuleSlugs.length > 0) {
        const modules = await prisma.module.findMany({
          where: { slug: { in: populatedModuleSlugs } },
        });
        for (const mod of modules) {
          await prisma.customerModuleProgress.updateMany({
            where: {
              customerId,
              moduleId: mod.id,
              status: "not_started" as ModuleStatus,
            },
            data: { status: "partially_complete" as ModuleStatus },
          });
        }
      }

      return json({ status: "completed", data: extractedData, populatedModules: populatedModuleSlugs });
    }

    return json({ status: statusData.status, progress: statusData.total });
  } catch (e) {
    console.error("Crawl status error:", e);
    return error("Failed to check crawl status", 500);
  }
}

interface CrawlPage {
  markdown?: string;
  metadata?: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
}

const EXTRACTION_TOOL = {
  name: "extract_business_data" as const,
  description: "Extract structured business data from website content",
  input_schema: {
    type: "object" as const,
    properties: {
      businessInfo: {
        type: "object" as const,
        properties: {
          name: { type: "string" as const },
          description: { type: "string" as const },
          address: { type: "string" as const },
          phone: { type: "string" as const },
          email: { type: "string" as const },
          logoUrl: { type: "string" as const },
        },
      },
      staff: {
        type: "object" as const,
        properties: {
          members: {
            type: "array" as const,
            items: {
              type: "object" as const,
              properties: {
                name: { type: "string" as const },
                role: { type: "string" as const },
                bio: { type: "string" as const },
                photoUrl: { type: "string" as const },
              },
            },
          },
        },
      },
      classes: {
        type: "object" as const,
        properties: {
          items: {
            type: "array" as const,
            items: {
              type: "object" as const,
              properties: {
                name: { type: "string" as const },
                description: { type: "string" as const },
                schedule: { type: "string" as const },
                duration: { type: "string" as const },
                instructor: { type: "string" as const },
                category: { type: "string" as const },
              },
            },
          },
        },
      },
      appointments: {
        type: "object" as const,
        properties: {
          items: {
            type: "array" as const,
            items: {
              type: "object" as const,
              properties: {
                name: { type: "string" as const },
                description: { type: "string" as const },
                duration: { type: "string" as const },
                price: { type: "string" as const },
              },
            },
          },
        },
      },
      pricing: {
        type: "object" as const,
        properties: {
          items: {
            type: "array" as const,
            items: {
              type: "object" as const,
              properties: {
                name: { type: "string" as const },
                price: { type: "string" as const },
                description: { type: "string" as const },
                type: { type: "string" as const },
              },
            },
          },
        },
      },
      branding: {
        type: "object" as const,
        properties: {
          primaryColor: { type: "string" as const },
          secondaryColor: { type: "string" as const },
          logoUrl: { type: "string" as const },
        },
      },
      waiver: {
        type: "object" as const,
        properties: {
          text: { type: "string" as const },
        },
      },
    },
  },
};

async function extractBusinessDataWithClaude(pages: CrawlPage[]) {
  const allText = pages.map((p) => p.markdown || "").join("\n\n").slice(0, 30000);
  const firstPage = pages[0];

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: "You are a data extraction specialist. Extract structured business information from website content. Only include data you can actually find — leave fields empty if not present. Be thorough but accurate.",
      messages: [{ role: "user", content: `Extract all business data from this website content:\n\n${allText}` }],
      tools: [EXTRACTION_TOOL],
      tool_choice: { type: "tool", name: "extract_business_data" },
    });

    const toolUse = response.content.find((block) => block.type === "tool_use");
    if (toolUse && toolUse.type === "tool_use") {
      const data = toolUse.input as Record<string, unknown>;
      return {
        ...data,
        rawContent: allText.slice(0, 10000),
        pageCount: pages.length,
      };
    }
  } catch (e) {
    console.error("Claude extraction error:", e);
  }

  // Fallback to basic extraction if Claude fails
  return {
    businessInfo: {
      name: firstPage?.metadata?.title || null,
      description: firstPage?.metadata?.description || null,
      logoUrl: firstPage?.metadata?.ogImage || null,
    },
    rawContent: allText.slice(0, 10000),
    pageCount: pages.length,
  };
}
