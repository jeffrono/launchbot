import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json, error } from "@/lib/api";

interface Params {
  params: Promise<{ id: string }>;
}

// PUT /api/staff/[id] — update a staff member
export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();

  const member = await prisma.staffMember.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.email !== undefined && { email: body.email }),
      ...(body.phone !== undefined && { phone: body.phone }),
      ...(body.role !== undefined && { role: body.role }),
      ...(body.bookingUrl !== undefined && { bookingUrl: body.bookingUrl }),
      ...(body.photoUrl !== undefined && { photoUrl: body.photoUrl }),
    },
  });

  return json(member);
}

// DELETE /api/staff/[id] — delete a staff member
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  await prisma.staffMember.delete({ where: { id } });
  return json({ deleted: true });
}
