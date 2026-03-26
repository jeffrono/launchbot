import { prisma } from "@/lib/prisma";
import { json, error } from "@/lib/api";
import { MODULE_SEED_DATA } from "@/lib/seed-data";

// GET /api/seed — seed the database with modules
export async function GET() {
  try {
    let created = 0;
    for (const mod of MODULE_SEED_DATA) {
      const dependencyGroup = "dependencyGroup" in mod ? (mod.dependencyGroup as string) : null;
      const dependencyOrder = "dependencyOrder" in mod ? (mod.dependencyOrder as number) : 0;
      await prisma.module.upsert({
        where: { slug: mod.slug },
        update: {
          title: mod.title,
          description: mod.description,
          displayOrder: mod.displayOrder,
          systemPromptFragment: mod.systemPromptFragment,
          content: mod.content,
          dependencyGroup: dependencyGroup || null,
          dependencyOrder: dependencyOrder || 0,
          sectionSlug: mod.sectionSlug || "getting-started",
          sectionTitle: mod.sectionTitle || "Getting Started",
          sectionOrder: mod.sectionOrder || 0,
          moduleType: mod.moduleType || "action",
        },
        create: {
          slug: mod.slug,
          title: mod.title,
          description: mod.description,
          displayOrder: mod.displayOrder,
          systemPromptFragment: mod.systemPromptFragment,
          content: mod.content,
          dependencyGroup: dependencyGroup || null,
          dependencyOrder: dependencyOrder || 0,
          sectionSlug: mod.sectionSlug || "getting-started",
          sectionTitle: mod.sectionTitle || "Getting Started",
          sectionOrder: mod.sectionOrder || 0,
          moduleType: mod.moduleType || "action",
        },
      });
      created++;
    }
    return json({ success: true, modulesSeeded: created });
  } catch (e) {
    console.error("Seed error:", e);
    return error("Seed failed. Check server logs.", 500);
  }
}
