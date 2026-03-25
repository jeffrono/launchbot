import Anthropic from "@anthropic-ai/sdk";
import type { BotResponse } from "@/types/chat";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const RESPONSE_TOOL = {
  name: "respond_to_customer" as const,
  description:
    "Generate a structured response to the customer with rich UI components",
  input_schema: {
    type: "object" as const,
    properties: {
      messages: {
        type: "array" as const,
        items: {
          type: "object" as const,
          properties: {
            type: {
              type: "string" as const,
              enum: [
                "text",
                "buttons",
                "checklist",
                "step_guide",
                "option_cards",
                "file_dropzone",
                "progress_widget",
                "video_embed",
                "image_display",
                "info_box",
                "quick_reply",
              ],
            },
            content: { type: "string" as const },
            title: { type: "string" as const },
            items: { type: "array" as const, items: { type: "string" as const } },
            options: {
              type: "array" as const,
              items: {
                type: "object" as const,
                properties: {
                  label: { type: "string" as const },
                  value: { type: "string" as const },
                  recommended: { type: "boolean" as const },
                },
              },
            },
            steps: {
              type: "array" as const,
              items: {
                type: "object" as const,
                properties: {
                  title: { type: "string" as const },
                  description: { type: "string" as const },
                },
              },
            },
            cards: {
              type: "array" as const,
              items: {
                type: "object" as const,
                properties: {
                  title: { type: "string" as const },
                  description: { type: "string" as const },
                  recommended: { type: "boolean" as const },
                  value: { type: "string" as const },
                },
              },
            },
            label: { type: "string" as const },
            acceptedTypes: {
              type: "array" as const,
              items: { type: "string" as const },
            },
            status: {
              type: "string" as const,
              enum: ["loading", "complete", "error"],
            },
            url: { type: "string" as const },
            caption: { type: "string" as const },
            variant: {
              type: "string" as const,
              enum: ["info", "tip", "warning"],
            },
          },
          required: ["type"],
        },
      },
      sideTip: {
        type: "object" as const,
        properties: {
          content: { type: "string" as const },
          icon: { type: "string" as const },
        },
      },
      moduleUpdate: {
        type: "object" as const,
        properties: {
          moduleSlug: { type: "string" as const },
          status: {
            type: "string" as const,
            enum: ["in_progress", "completed", "punted"],
          },
          collectedData: { type: "object" as const },
        },
      },
    },
    required: ["messages"],
  },
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function generateBotResponse(
  systemPrompt: string,
  conversationHistory: ChatMessage[],
  userMessage: string
): Promise<BotResponse> {
  const messages: Anthropic.MessageParam[] = [
    ...conversationHistory.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user" as const, content: userMessage },
  ];

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    messages,
    tools: [RESPONSE_TOOL],
    tool_choice: { type: "tool", name: "respond_to_customer" },
  });

  // Extract the tool use result
  const toolUse = response.content.find((block) => block.type === "tool_use");
  if (toolUse && toolUse.type === "tool_use") {
    const input = toolUse.input as Record<string, unknown>;
    return {
      messages: (input.messages as BotResponse["messages"]) || [
        { type: "text", content: "I'm here to help! What would you like to work on?" },
      ],
      sideTip: input.sideTip as BotResponse["sideTip"],
      moduleUpdate: input.moduleUpdate as BotResponse["moduleUpdate"],
    };
  }

  // Fallback: extract text content
  const textBlock = response.content.find((block) => block.type === "text");
  return {
    messages: [
      {
        type: "text",
        content:
          textBlock && textBlock.type === "text"
            ? textBlock.text
            : "I'm here to help! What would you like to work on?",
      },
    ],
  };
}
