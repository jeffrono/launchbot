import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json, error } from "@/lib/api";

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/modules/[id] — get a single module
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const module = await prisma.module.findUnique({ where: { id } });
  if (!module) return error("Module not found", 404);
  return json(module);
}

// PUT /api/modules/[id] — update a module
export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();

  const module = await prisma.module.update({
    where: { id },
    data: {
      ...(body.slug !== undefined && { slug: body.slug }),
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.systemPromptFragment !== undefined && {
        systemPromptFragment: body.systemPromptFragment,
      }),
      ...(body.content !== undefined && { content: body.content }),
      ...(body.displayOrder !== undefined && {
        displayOrder: body.displayOrder,
      }),
      ...(body.dependencyGroup !== undefined && {
        dependencyGroup: body.dependencyGroup,
      }),
      ...(body.dependencyOrder !== undefined && {
        dependencyOrder: body.dependencyOrder,
      }),
    },
  });

  return json(module);
}

// DELETE /api/modules/[id] — delete a module
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  await prisma.module.delete({ where: { id } });
  return json({ deleted: true });
}
