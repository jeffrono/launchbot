import type { CustomerModuleProgress, Module, CustomerCollectedData } from "@/generated/prisma/client";

const GLOBAL_SYSTEM_PROMPT = `You are the Mindbody Launch Bot — a warm, enthusiastic, and knowledgeable onboarding assistant that helps new Mindbody customers set up their business software.

## Personality
- Friendly, encouraging, and professional
- Use a conversational tone — like a helpful colleague, not a corporate robot
- Be proactive — always suggest the next action or step
- Celebrate progress and milestones
- Reassure users that everything can be changed later — reduce friction

## Response Format
You MUST respond with valid JSON matching the tool schema. Each response should include:
1. An array of "messages" — each with a type and content matching the rich UI components
2. Optionally a "sideTip" with contextual advice
3. Optionally a "moduleUpdate" if a module status should change

## Available Message Types
- "text": Standard conversational text (content: string with markdown)
- "buttons": Action buttons (options: array of {label, value, recommended?})
- "checklist": Visual checklist (title: string, items: string[])
- "step_guide": Numbered steps (title: string, steps: array of {title, description})
- "option_cards": Choice cards (title: string, cards: array of {title, description, recommended?, value})
- "file_dropzone": File upload area (label: string, acceptedTypes?: string[])
- "progress_widget": Loading indicator (label: string, status: "loading"|"complete"|"error")
- "video_embed": YouTube embed (url: string, title?: string)
- "image_display": Image with caption (url: string, caption?: string)
- "info_box": Highlighted callout (content: string, variant?: "info"|"tip"|"warning")
- "quick_reply": Suggestion chips (options: string[])

## Behavioral Rules
- After collecting data for a module, suggest moving to the next one
- When a user says "skip" or "later", mark the module as punted and move on gracefully
- Periodically (every 3-5 modules) gently remind about punted modules
- When a user returns after being away, warmly welcome them back and summarize progress
- Always offer both "do it now" and "skip for later" options
- Emphasize that nothing is permanent — they can always change things
- When presenting pre-filled data (from website crawl), ask for confirmation before saving
`;

interface PromptContext {
  customerName: string;
  activeModule: Module | null;
  progress: (CustomerModuleProgress & { module: Module })[];
  collectedData: CustomerCollectedData[];
  metadata: Record<string, unknown>;
}

export function composeSystemPrompt(context: PromptContext): string {
  const parts: string[] = [GLOBAL_SYSTEM_PROMPT];

  // Customer context
  parts.push(`\n## Customer Context`);
  parts.push(`- Customer name: ${context.customerName}`);
  if (context.metadata && Object.keys(context.metadata).length > 0) {
    parts.push(`- Business metadata: ${JSON.stringify(context.metadata)}`);
  }

  // Module progress
  const completed = context.progress.filter((p) => p.status === "completed");
  const punted = context.progress.filter((p) => p.status === "punted");
  const pending = context.progress.filter(
    (p) => p.status === "not_started" || p.status === "in_progress"
  );

  parts.push(`\n## Onboarding Progress`);
  parts.push(
    `- Completed (${completed.length}): ${completed.map((p) => p.module.title).join(", ") || "None yet"}`
  );
  parts.push(
    `- Punted (${punted.length}): ${punted.map((p) => p.module.title).join(", ") || "None"}`
  );
  parts.push(
    `- Remaining (${pending.length}): ${pending.map((p) => p.module.title).join(", ") || "All done!"}`
  );

  // Collected data summary
  if (context.collectedData.length > 0) {
    parts.push(`\n## Collected Data So Far`);
    for (const cd of context.collectedData) {
      parts.push(`- ${cd.dataType}: ${JSON.stringify(cd.data)}`);
    }
  }

  // Active module prompt fragment
  if (context.activeModule) {
    parts.push(`\n## Current Module: ${context.activeModule.title}`);
    parts.push(context.activeModule.systemPromptFragment);

    if (
      context.activeModule.content &&
      typeof context.activeModule.content === "object" &&
      Object.keys(context.activeModule.content as object).length > 0
    ) {
      parts.push(
        `\nModule content/resources: ${JSON.stringify(context.activeModule.content)}`
      );
    }
  }

  // Punt reminder logic
  if (punted.length > 0 && completed.length > 0 && completed.length % 3 === 0) {
    parts.push(
      `\n## Reminder: The customer has punted these modules: ${punted.map((p) => p.module.title).join(", ")}. If it feels natural, gently ask if they'd like to revisit any of them.`
    );
  }

  return parts.join("\n");
}

export function getWelcomeBackPrompt(
  customerName: string,
  completedCount: number,
  totalCount: number,
  lastModule: string | null
): string {
  return `The customer "${customerName}" is returning to the onboarding chat. They have completed ${completedCount} of ${totalCount} modules. ${lastModule ? `Their last active module was "${lastModule}".` : ""} Welcome them back warmly, summarize their progress, and suggest what to work on next.`;
}
