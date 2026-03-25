import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json, error } from "@/lib/api";

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/customers/[id] — get a single customer with progress
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      progress: { include: { module: true } },
      collectedData: true,
    },
  });

  if (!customer) return error("Customer not found", 404);
  return json(customer);
}

// PUT /api/customers/[id] — update a customer
export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const { name, studioId, metadata } = body;

  const customer = await prisma.customer.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(studioId !== undefined && { studioId }),
      ...(metadata !== undefined && { metadata }),
    },
  });

  return json(customer);
}

// DELETE /api/customers/[id] — delete a customer
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  await prisma.customer.delete({ where: { id } });
  return json({ deleted: true });
}
