import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json, error } from "@/lib/api";

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

    // If complete, extract and store data
    if (statusData.status === "completed" && customerId && statusData.data) {
      const extractedData = extractBusinessData(statusData.data);

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

      // Pre-fill collected data
      if (extractedData.businessInfo) {
        await prisma.customerCollectedData.upsert({
          where: {
            customerId_dataType: {
              customerId,
              dataType: "business_info",
            },
          },
          update: { data: extractedData.businessInfo as object },
          create: {
            customerId,
            dataType: "business_info",
            data: extractedData.businessInfo as object,
          },
        });
      }

      return json({ status: "completed", data: extractedData });
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

function extractBusinessData(pages: CrawlPage[]) {
  const allText = pages.map((p) => p.markdown || "").join("\n\n");
  const firstPage = pages[0];

  return {
    businessInfo: {
      name: firstPage?.metadata?.title || null,
      description: firstPage?.metadata?.description || null,
      logoUrl: firstPage?.metadata?.ogImage || null,
    },
    rawContent: allText.slice(0, 10000), // Truncate for storage
    pageCount: pages.length,
  };
}
