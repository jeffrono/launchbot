import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json, error } from "@/lib/api";

// Settings are stored as customer_collected_data with a special "system" customer
// For simplicity, we use a key-value approach in the metadata of a sentinel record

async function getSettingsCustomer() {
  let customer = await prisma.customer.findUnique({
    where: { workspaceSlug: "__system_settings__" },
  });
  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        name: "System Settings",
        workspaceSlug: "__system_settings__",
        metadata: {},
      },
    });
  }
  return customer;
}

// GET /api/settings — get global settings
export async function GET() {
  const customer = await getSettingsCustomer();
  return json(customer.metadata || {});
}

// PUT /api/settings — update global settings
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const customer = await getSettingsCustomer();

  const updated = await prisma.customer.update({
    where: { id: customer.id },
    data: {
      metadata: { ...((customer.metadata || {}) as object), ...body },
    },
  });

  return json(updated.metadata);
}
