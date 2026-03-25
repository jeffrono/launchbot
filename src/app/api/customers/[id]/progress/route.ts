import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json, error } from "@/lib/api";

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/customers/[id]/progress — get module progress for a customer
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const progress = await prisma.customerModuleProgress.findMany({
    where: { customerId: id },
    include: { module: true },
    orderBy: { module: { displayOrder: "asc" } },
  });

  if (progress.length === 0) {
    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) return error("Customer not found", 404);
  }

  return json(progress);
}
