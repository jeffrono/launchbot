import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json, error } from "@/lib/api";

// GET /api/modules — list all modules
export async function GET() {
  const modules = await prisma.module.findMany({
    orderBy: { displayOrder: "asc" },
  });
  return json(modules);
}

// POST /api/modules — create a module
export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    slug,
    title,
    description,
    systemPromptFragment,
    content,
    displayOrder,
    dependencyGroup,
    dependencyOrder,
  } = body;

  if (!slug || !title) return error("Slug and title are required");

  const module = await prisma.module.create({
    data: {
      slug,
      title,
      description: description || "",
      systemPromptFragment: systemPromptFragment || "",
      content: content || {},
      displayOrder: displayOrder ?? 0,
      dependencyGroup: dependencyGroup || null,
      dependencyOrder: dependencyOrder ?? 0,
    },
  });

  return json(module, 201);
}
