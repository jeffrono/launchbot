import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json, error } from "@/lib/api";
import { generateSlug } from "@/lib/slug";

// GET /api/customers — list all customers
export async function GET() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      progress: { select: { status: true } },
    },
  });
  return json(customers);
}

// POST /api/customers — create a new customer
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, studioId, metadata } = body;

  if (!name) return error("Name is required");

  const workspaceSlug = generateSlug(name);

  const customer = await prisma.customer.create({
    data: {
      name,
      studioId: studioId || null,
      workspaceSlug,
      metadata: metadata || {},
    },
  });

  // Initialize progress records for all modules
  const modules = await prisma.module.findMany({ select: { id: true } });
  if (modules.length > 0) {
    await prisma.customerModuleProgress.createMany({
      data: modules.map((m: { id: string }) => ({
        customerId: customer.id,
        moduleId: m.id,
      })),
    });
  }

  return json(customer, 201);
}
