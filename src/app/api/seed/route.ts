import { prisma } from "@/lib/prisma";
import { json, error } from "@/lib/api";

const modules = [
  { slug: "welcome", title: "Welcome & Introduction", description: "Introduce the onboarding process, set expectations, and build rapport.", displayOrder: 1, systemPromptFragment: "You are beginning the onboarding conversation. Welcome the customer warmly, introduce yourself as the Mindbody Launch Bot, and explain that you'll be guiding them through setting up their business on Mindbody. Be enthusiastic but not overwhelming. Ask them their name and a bit about their business to personalize the experience. Emphasize this will be easy, fun, and they can always change things later.", content: {} },
  { slug: "onboarding-team", title: "Meet Your Onboarding Team", description: "Introduce the customer's dedicated onboarding specialist and set communication preferences.", displayOrder: 2, systemPromptFragment: "Introduce the customer to their dedicated onboarding team. Let them know they have a real human they can reach out to. Ask about their preferred communication method (email, phone, text). Collect their preferred contact info. Make them feel supported.", content: {} },
  { slug: "website-crawl", title: "Website Crawl", description: "Crawl the customer's website to pre-fill business information.", displayOrder: 3, dependencyGroup: "data-collection", dependencyOrder: 1, systemPromptFragment: "Ask the customer for their website URL. When they provide it, trigger a website crawl. While the crawl is running, keep the conversation going. When crawl results come back, present the extracted data and ask the customer to confirm or correct each item.", content: {} },
  { slug: "business-basics", title: "Business Basics", description: "Collect core business information: name, type, location.", displayOrder: 4, dependencyGroup: "data-collection", dependencyOrder: 2, systemPromptFragment: "Collect the customer's basic business information. If data was pre-filled from a website crawl, present it for confirmation. Otherwise, collect manually: business name, business type, address/location, whether this is a new or existing business.", content: {} },
  { slug: "payment-setup", title: "Payment Setup", description: "Guide the customer through payment processing setup.", displayOrder: 5, systemPromptFragment: "Guide the customer through setting up payment processing. Present a checklist of what they'll need. Walk through each item one at a time. Be encouraging. If they don't have everything ready, offer to punt and come back.", content: { checklist: ["Business information (name, EIN/tax ID)", "Owner information (name, SSN, DOB)", "Government-issued ID", "Website URL", "Bank account details"] } },
  { slug: "class-collection", title: "Class Collection", description: "Gather class/service offerings.", displayOrder: 6, dependencyGroup: "services", dependencyOrder: 1, systemPromptFragment: "Help the customer catalog their classes/group services. If data was pre-filled from a website crawl, present it for review. Otherwise, ask them to describe their classes or upload a spreadsheet.", content: { suggestedCategories: ["Yoga", "Pilates", "HIIT", "Cycling", "Barre", "Strength", "Cardio", "Dance", "Martial Arts", "Swimming", "Meditation", "Other"] } },
  { slug: "appointment-collection", title: "Appointment Collection", description: "Collect appointment/service types.", displayOrder: 7, dependencyGroup: "services", dependencyOrder: 2, systemPromptFragment: "Help the customer define their one-on-one or small-group appointment types. Collect: service name, description, duration, pricing, and which staff members can perform each service.", content: {} },
  { slug: "staff-details", title: "Staff Details", description: "Collect staff/instructor information.", displayOrder: 8, systemPromptFragment: "Help the customer add their staff members. For each staff member, collect: full name, role/title, bio, email, phone, and which services they teach/provide.", content: {} },
  { slug: "pricing-options", title: "Pricing Options", description: "Define pricing tiers and packages.", displayOrder: 9, dependencyGroup: "pricing", dependencyOrder: 1, systemPromptFragment: "Help the customer set up their pricing structure. Ask about their pricing model: drop-in rates, class packs, monthly memberships, or a combination.", content: {} },
  { slug: "memberships-contracts", title: "Memberships & Contracts", description: "Set up membership types and terms.", displayOrder: 10, dependencyGroup: "pricing", dependencyOrder: 2, systemPromptFragment: "Help the customer define their membership and contract offerings. Collect: membership name, type, billing frequency, price, included services, contract length, and cancellation policy.", content: {} },
  { slug: "branding-logo", title: "Branding & Logo", description: "Upload logo and set brand colors.", displayOrder: 11, systemPromptFragment: "Help the customer set up their brand identity on Mindbody. Ask them to upload their logo. Collect preferred brand colors.", content: {} },
  { slug: "marketplace", title: "Mindbody Marketplace", description: "Explain the Marketplace and help get listed.", displayOrder: 12, systemPromptFragment: "Explain the Mindbody Marketplace — how it helps new customers discover their business. Ask if they're interested in being listed.", content: {} },
  { slug: "classpass", title: "ClassPass Integration", description: "Explain ClassPass integration and guide setup.", displayOrder: 13, systemPromptFragment: "Explain what ClassPass is and how the Mindbody + ClassPass integration works. Present the pros and considerations. Ask if they're interested.", content: {} },
  { slug: "kickoff-call", title: "Kickoff Call Booking", description: "Schedule a kickoff call with the onboarding team.", displayOrder: 14, systemPromptFragment: "This is the final module! Congratulate the customer on completing their onboarding setup. Summarize what they've accomplished. Help them schedule a kickoff call with their onboarding specialist.", content: {} },
];

// GET /api/seed — seed the database with modules
export async function GET() {
  try {
    let created = 0;
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
      created++;
    }
    return json({ success: true, modulesSeeded: created });
  } catch (e) {
    console.error("Seed error:", e);
    return error(`Seed failed: ${e}`, 500);
  }
}
