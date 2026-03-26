import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { MODULE_SEED_DATA } from "../src/lib/seed-data";
import "dotenv/config";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(`Seeding ${MODULE_SEED_DATA.length} modules...`);

  for (const mod of MODULE_SEED_DATA) {
    await prisma.module.upsert({
      where: { slug: mod.slug },
      update: {
        title: mod.title,
        description: mod.description,
        displayOrder: mod.displayOrder,
        systemPromptFragment: mod.systemPromptFragment,
        content: mod.content,
        dependencyGroup: mod.dependencyGroup || null,
        dependencyOrder: mod.dependencyOrder || 0,
      },
      create: {
        slug: mod.slug,
        title: mod.title,
        description: mod.description,
        displayOrder: mod.displayOrder,
        systemPromptFragment: mod.systemPromptFragment,
        content: mod.content,
        dependencyGroup: mod.dependencyGroup || null,
        dependencyOrder: mod.dependencyOrder || 0,
      },
    });
    console.log(`  ✓ ${mod.title}`);
  }

  // Seed a default staff member (Amir) if none exist
  const staffCount = await prisma.staffMember.count();
  if (staffCount === 0) {
    await prisma.staffMember.create({
      data: {
        name: "Amir Nematbakhsh",
        email: "amir.nematbakhsh@mindbodyonline.com",
        role: "Product Manager",
        phone: "",
        bookingUrl: "",
      },
    });
    console.log("  ✓ Default staff member: Amir Nematbakhsh");
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
