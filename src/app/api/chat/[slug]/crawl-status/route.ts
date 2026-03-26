import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json, error } from "@/lib/api";
import Anthropic from "@anthropic-ai/sdk";
import type { DataType, ModuleStatus } from "@/generated/prisma/client";

interface Params {
  params: Promise<{ slug: string }>;
}

// GET /api/chat/[slug]/crawl-status — poll crawl progress
export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;

  const customer = await prisma.customer.findUnique({
    where: { workspaceSlug: slug },
    select: { id: true, metadata: true },
  });

  if (!customer) return error("Workspace not found", 404);

  const metadata = (customer.metadata || {}) as Record<string, unknown>;
  const jobId = metadata.crawlJobId as string | undefined;

  if (!jobId) return error("No crawl in progress", 404);

  const firecrawlKey = process.env.FIRECRAWL_API_KEY;
  if (!firecrawlKey) return error("Firecrawl not configured", 503);

  try {
    const statusResponse = await fetch(
      `https://api.firecrawl.dev/v1/crawl/${jobId}`,
      { headers: { Authorization: `Bearer ${firecrawlKey}` } }
    );

    if (!statusResponse.ok) {
      return error("Failed to check crawl status", 502);
    }

    const statusData = await statusResponse.json();

    // Return progress info for the frontend
    const result: Record<string, unknown> = {
      status: statusData.status,
      total: statusData.total || 0,
      completed: statusData.completed || 0,
      creditsUsed: statusData.creditsUsed || 0,
    };

    // If there's partial data, show what's been found so far
    if (statusData.data && Array.isArray(statusData.data)) {
      const pages = statusData.data as { metadata?: { sourceURL?: string; title?: string } }[];
      result.pagesFound = pages.length;
      result.currentPages = pages.slice(-3).map((p) => ({
        url: p.metadata?.sourceURL || "unknown",
        title: p.metadata?.title || "",
      }));
    }

    // If completed, extract data with Claude and update modules
    if (statusData.status === "completed" && statusData.data) {
      const extractedData = await extractAndStoreData(
        customer.id,
        statusData.data,
        metadata
      );
      result.extractedData = extractedData;
      result.status = "completed";
    }

    return json(result);
  } catch (e) {
    console.error("Crawl status error:", e);
    return error("Failed to check crawl status", 500);
  }
}

interface CrawlPage {
  markdown?: string;
  metadata?: { title?: string; description?: string; ogImage?: string; sourceURL?: string };
}

async function extractAndStoreData(
  customerId: string,
  pages: CrawlPage[],
  existingMetadata: Record<string, unknown>
) {
  const allText = pages.map((p) => p.markdown || "").join("\n\n").slice(0, 30000);
  const firstPage = pages[0];

  let extractedData: Record<string, unknown> = {
    businessInfo: {
      name: firstPage?.metadata?.title || null,
      description: firstPage?.metadata?.description || null,
      logoUrl: firstPage?.metadata?.ogImage || null,
    },
    rawContent: allText.slice(0, 10000),
    pageCount: pages.length,
  };

  // Try Claude-powered extraction
  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: "Extract structured business data from website content. Only include data you can find.",
      messages: [{ role: "user", content: `Extract business data:\n\n${allText}` }],
      tools: [{
        name: "extract_business_data",
        description: "Extract structured business data",
        input_schema: {
          type: "object" as const,
          properties: {
            businessInfo: { type: "object" as const, properties: { name: { type: "string" as const }, description: { type: "string" as const }, address: { type: "string" as const }, phone: { type: "string" as const }, email: { type: "string" as const }, logoUrl: { type: "string" as const } } },
            staff: { type: "object" as const, properties: { members: { type: "array" as const, items: { type: "object" as const, properties: { name: { type: "string" as const }, role: { type: "string" as const }, bio: { type: "string" as const } } } } } },
            classes: { type: "object" as const, properties: { items: { type: "array" as const, items: { type: "object" as const, properties: { name: { type: "string" as const }, description: { type: "string" as const }, schedule: { type: "string" as const } } } } } },
            pricing: { type: "object" as const, properties: { items: { type: "array" as const, items: { type: "object" as const, properties: { name: { type: "string" as const }, price: { type: "string" as const }, description: { type: "string" as const } } } } } },
            branding: { type: "object" as const, properties: { primaryColor: { type: "string" as const }, logoUrl: { type: "string" as const } } },
          },
        },
      }],
      tool_choice: { type: "tool", name: "extract_business_data" },
    });

    const toolUse = response.content.find((b) => b.type === "tool_use");
    if (toolUse && toolUse.type === "tool_use") {
      extractedData = { ...(toolUse.input as Record<string, unknown>), rawContent: allText.slice(0, 10000), pageCount: pages.length };
    }
  } catch (e) {
    console.error("Claude extraction error:", e);
  }

  // Update customer metadata
  await prisma.customer.update({
    where: { id: customerId },
    data: {
      metadata: {
        ...existingMetadata,
        crawlStatus: "completed",
        crawlResults: extractedData as object,
      } as object,
    },
  });

  // Pre-fill collected data types
  const dataTypeMapping: { key: string; dataType: DataType; moduleSlug: string }[] = [
    { key: "businessInfo", dataType: "business_info", moduleSlug: "business-basics" },
    { key: "staff", dataType: "staff", moduleSlug: "staff-details" },
    { key: "classes", dataType: "classes", moduleSlug: "class-collection" },
    { key: "pricing", dataType: "pricing", moduleSlug: "pricing-options" },
    { key: "branding", dataType: "branding", moduleSlug: "branding-logo" },
  ];

  const populatedSlugs: string[] = [];
  for (const { key, dataType, moduleSlug } of dataTypeMapping) {
    const data = extractedData[key] as Record<string, unknown> | undefined;
    if (data && Object.keys(data).length > 0) {
      await prisma.customerCollectedData.upsert({
        where: { customerId_dataType: { customerId, dataType } },
        update: { data: data as object },
        create: { customerId, dataType, data: data as object },
      });
      populatedSlugs.push(moduleSlug);
    }
  }

  // Mark modules as partially_complete
  if (populatedSlugs.length > 0) {
    const modules = await prisma.module.findMany({ where: { slug: { in: populatedSlugs } } });
    for (const mod of modules) {
      await prisma.customerModuleProgress.updateMany({
        where: { customerId, moduleId: mod.id, status: "not_started" as ModuleStatus },
        data: { status: "partially_complete" as ModuleStatus },
      });
    }
  }

  return { ...extractedData, populatedModules: populatedSlugs };
}
