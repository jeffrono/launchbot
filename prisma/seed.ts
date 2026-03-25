import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const modules = [
  {
    slug: "welcome",
    title: "Welcome & Introduction",
    description:
      "Introduce the onboarding process, set expectations, and build rapport.",
    displayOrder: 1,
    systemPromptFragment: `You are beginning the onboarding conversation. Welcome the customer warmly, introduce yourself as the Mindbody Launch Bot, and explain that you'll be guiding them through setting up their business on Mindbody. Be enthusiastic but not overwhelming. Ask them their name and a bit about their business to personalize the experience. Emphasize this will be easy, fun, and they can always change things later.`,
    content: {},
  },
  {
    slug: "onboarding-team",
    title: "Meet Your Onboarding Team",
    description:
      "Introduce the customer's dedicated onboarding specialist and set communication preferences.",
    displayOrder: 2,
    systemPromptFragment: `Introduce the customer to their dedicated onboarding team. Let them know they have a real human they can reach out to. Ask about their preferred communication method (email, phone, text). Collect their preferred contact info. Make them feel supported — they're not doing this alone.`,
    content: {},
  },
  {
    slug: "website-crawl",
    title: "Website Crawl",
    description:
      "Crawl the customer's website to pre-fill business information, classes, staff, and more.",
    displayOrder: 3,
    dependencyGroup: "data-collection",
    dependencyOrder: 1,
    systemPromptFragment: `Ask the customer for their website URL. When they provide it, trigger a website crawl. While the crawl is running, keep the conversation going — ask about their business, what services they offer, how long they've been open. When crawl results come back, present the extracted data (business name, classes, staff, pricing) and ask the customer to confirm or correct each item. This data will pre-fill many of the following modules.`,
    content: {},
  },
  {
    slug: "business-basics",
    title: "Business Basics",
    description:
      "Collect core business information: name, type, location, new vs. existing business.",
    displayOrder: 4,
    dependencyGroup: "data-collection",
    dependencyOrder: 2,
    systemPromptFragment: `Collect the customer's basic business information. If data was pre-filled from a website crawl, present it for confirmation. Otherwise, collect manually: business name, business type (yoga studio, gym, salon, etc.), address/location, whether this is a new or existing business, and any other key details. Use the info_box component to explain why each piece of info matters.`,
    content: {},
  },
  {
    slug: "payment-setup",
    title: "Payment Setup",
    description:
      "Guide the customer through payment processing setup with a clear checklist.",
    displayOrder: 5,
    systemPromptFragment: `Guide the customer through setting up payment processing. Present a checklist of what they'll need: business information, owner information, government-issued ID, website URL, and bank account details. Walk through each item one at a time. Be encouraging — this is often the most daunting part for new users. Emphasize they can always update this later. If they don't have everything ready, offer to punt and come back.`,
    content: {
      checklist: [
        "Business information (name, EIN/tax ID)",
        "Owner information (name, SSN, DOB)",
        "Government-issued ID (for verification)",
        "Website URL",
        "Bank account details (routing + account number)",
      ],
    },
  },
  {
    slug: "class-collection",
    title: "Class Collection",
    description:
      "Gather class/service offerings including names, descriptions, schedules, and categories.",
    displayOrder: 6,
    dependencyGroup: "services",
    dependencyOrder: 1,
    systemPromptFragment: `Help the customer catalog their classes/group services. If data was pre-filled from a website crawl, present it for review. Otherwise, ask them to describe their classes or upload a spreadsheet. For each class, collect: name, description, duration, instructor, schedule, capacity, and category. Suggest Mindbody service categories that best fit. Use option_cards to present category suggestions. Offer file upload as an alternative to manual entry.`,
    content: {
      suggestedCategories: [
        "Yoga",
        "Pilates",
        "HIIT",
        "Cycling",
        "Barre",
        "Strength",
        "Cardio",
        "Dance",
        "Martial Arts",
        "Swimming",
        "Meditation",
        "Other",
      ],
    },
  },
  {
    slug: "appointment-collection",
    title: "Appointment Collection",
    description:
      "Collect appointment/service types with durations, pricing, and availability.",
    displayOrder: 7,
    dependencyGroup: "services",
    dependencyOrder: 2,
    systemPromptFragment: `Help the customer define their one-on-one or small-group appointment types. Collect: service name, description, duration, pricing, and which staff members can perform each service. Present common appointment types for their business category as suggestions. Use option_cards for common service types and quick_reply for yes/no confirmations.`,
    content: {},
  },
  {
    slug: "staff-details",
    title: "Staff Details",
    description:
      "Collect staff/instructor information including names, roles, bios, and contact info.",
    displayOrder: 8,
    systemPromptFragment: `Help the customer add their staff members. If names were extracted from the website crawl, present them for confirmation. For each staff member, collect: full name, role/title, bio (optional), email, phone (optional), and which services they teach/provide. Offer spreadsheet upload as an alternative. Make it easy — they can always add more staff later.`,
    content: {},
  },
  {
    slug: "pricing-options",
    title: "Pricing Options",
    description:
      "Define pricing tiers, drop-in rates, and package options for services.",
    displayOrder: 9,
    dependencyGroup: "pricing",
    dependencyOrder: 1,
    systemPromptFragment: `Help the customer set up their pricing structure. Ask about their pricing model: drop-in rates, class packs, monthly memberships, or a combination. For each pricing option, collect: name, price, what it includes, and any restrictions. Suggest common pricing structures based on their business type. Use step_guide to walk through pricing setup methodically.`,
    content: {},
  },
  {
    slug: "memberships-contracts",
    title: "Memberships & Contracts",
    description:
      "Set up membership types, terms, auto-renewal, and contract details.",
    displayOrder: 10,
    dependencyGroup: "pricing",
    dependencyOrder: 2,
    systemPromptFragment: `Help the customer define their membership and contract offerings. Collect: membership name, type (recurring/one-time), billing frequency, price, included services, contract length, and cancellation policy. Explain the difference between memberships and contracts clearly. Use option_cards to present common membership structures. Emphasize flexibility — they can always adjust terms later.`,
    content: {},
  },
  {
    slug: "branding-logo",
    title: "Branding & Logo",
    description: "Upload logo, set brand colors, and configure visual identity.",
    displayOrder: 11,
    systemPromptFragment: `Help the customer set up their brand identity on Mindbody. Ask them to upload their logo (provide a file_dropzone). Collect preferred brand colors (hex codes or descriptions). If a logo was found during website crawl, present it for confirmation. Keep it fun — this is where their personality shines through!`,
    content: {},
  },
  {
    slug: "marketplace",
    title: "Mindbody Marketplace",
    description:
      "Explain the Mindbody Marketplace and help the customer get listed.",
    displayOrder: 12,
    systemPromptFragment: `Explain the Mindbody Marketplace — how it helps new customers discover their business, how listings work, and the benefits. Ask if they're interested in being listed. If yes, collect any additional info needed for their listing. Use info_box to highlight key benefits and statistics about marketplace visibility.`,
    content: {},
  },
  {
    slug: "classpass",
    title: "ClassPass Integration",
    description:
      "Explain ClassPass integration and guide setup if interested.",
    displayOrder: 13,
    systemPromptFragment: `Explain what ClassPass is and how the Mindbody + ClassPass integration works. Present the pros and considerations of ClassPass. Ask if they're interested. If yes, guide them through the setup requirements. If unsure, provide enough info for them to make a decision later. Use buttons for clear yes/no/maybe responses.`,
    content: {},
  },
  {
    slug: "kickoff-call",
    title: "Kickoff Call Booking",
    description:
      "Schedule a kickoff call with the onboarding team to review everything and go live.",
    displayOrder: 14,
    systemPromptFragment: `This is the final module! Congratulate the customer on completing their onboarding setup. Summarize what they've accomplished and what data has been collected. Help them schedule a kickoff call with their onboarding specialist to review everything and plan their go-live date. Be celebratory — they've done great work! Provide next steps and what to expect.`,
    content: {},
  },
];

async function main() {
  console.log("Seeding modules...");

  for (const mod of modules) {
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
