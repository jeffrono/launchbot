import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json, error } from "@/lib/api";

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/customers/[id]/export — export all collected data for Mindbody import
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      collectedData: true,
      progress: {
        include: { module: true },
        orderBy: { module: { displayOrder: "asc" } },
      },
    },
  });

  if (!customer) return error("Customer not found", 404);

  // Build export object keyed by data type
  const exportData: Record<string, unknown> = {
    exportedAt: new Date().toISOString(),
    customer: {
      name: customer.name,
      studioId: customer.studioId,
      metadata: customer.metadata,
    },
    onboardingProgress: {
      totalModules: customer.progress.length,
      completed: customer.progress.filter((p) => p.status === "completed").length,
      punted: customer.progress.filter((p) => p.status === "punted").length,
      modules: customer.progress.map((p) => ({
        module: p.module.slug,
        title: p.module.title,
        status: p.status,
        completedAt: p.completedAt,
        collectedData: p.collectedData,
      })),
    },
    collectedData: {},
  };

  // Organize collected data by type
  for (const cd of customer.collectedData) {
    (exportData.collectedData as Record<string, unknown>)[cd.dataType] = cd.data;
  }

  return json(exportData);
}
