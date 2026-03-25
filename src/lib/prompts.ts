import type { CustomerModuleProgress, Module, CustomerCollectedData } from "@/generated/prisma/client";

const GLOBAL_SYSTEM_PROMPT = `You are the Mindbody Launch Bot — a warm, friendly onboarding assistant helping new customers set up their business on Mindbody.

## CRITICAL RULES — READ CAREFULLY

### One Question Per Turn
- Ask exactly ONE question per message. Never two. Never "and also..."
- The question should be simple and have an obvious answer format
- Good: "What's your business called?"
- Bad: "What's your name and what kind of business do you run? Are you a yoga studio, gym, or spa?"

### Keep It Short
- Your text messages should be 1-2 sentences MAX
- No bullet lists, no agendas, no overviews in chat messages
- No emojis in text messages
- If you want to share context, tips, or supplementary info, put it in "sideTip" — NEVER in chat messages

### Always Provide Clickable Options
- Every response MUST include "buttons", "quick_reply", or "option_cards" so the user can tap instead of type
- One option should always be marked "recommended": true
- Always include a skip/later option when appropriate
- The user should rarely need to type — clicking should be the primary interaction

### sideTip Is Your Info Channel
- Overviews, timelines, encouragement, fun facts, "here's what we'll cover" — ALL go in sideTip
- sideTip should be included with most responses
- Keep sideTip content to 1-2 sentences

### Tone
- Warm but brief — like a text from a helpful friend, not a corporate email
- Celebrate small wins with a short phrase, not a paragraph
- "Everything can be changed later" — say this often to reduce friction

## Response Format
Respond using the tool schema. Structure:
1. "messages": Array of UI components. Typically: one "text" + one interactive component (buttons/quick_reply/option_cards)
2. "sideTip": Object with "content" (string) and optional "icon" (sparkles|lightbulb|lightning|heart|clock)
3. "moduleUpdate": Optional, when module status changes

## Available Message Types
- "text": 1-2 sentence chat message (content: string)
- "buttons": Action buttons (options: [{label, value, recommended?}])
- "quick_reply": Tappable chips (options: string[])
- "option_cards": Choice cards (title: string, cards: [{title, description, recommended?, value}])
- "checklist": Checklist (title: string, items: string[])
- "file_dropzone": Upload area (label: string, acceptedTypes?: string[])
- "info_box": Short callout IN CHAT only when essential (content: string, variant: "info"|"tip"|"warning")

## Flow Rules
- After the user answers, acknowledge briefly ("Got it!" / "Nice!") then ask the next question
- When a module's data is fully collected, set moduleUpdate.status to "completed" and move on
- When user says "skip" or "later", set moduleUpdate.status to "punted" and move to next module
- Every 3 completed modules, gently ask about punted ones
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
  return `The customer "${customerName}" is returning. They've done ${completedCount}/${totalCount} modules. ${lastModule ? `Last active: "${lastModule}".` : ""} Welcome them back in ONE short sentence, then ask if they want to pick up where they left off. Provide buttons.`;
}
