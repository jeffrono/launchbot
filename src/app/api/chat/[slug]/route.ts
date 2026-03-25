import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json, error } from "@/lib/api";
import { generateBotResponse } from "@/lib/llm";
import { composeSystemPrompt, getWelcomeBackPrompt } from "@/lib/prompts";
import { v4 as uuid } from "uuid";
import type { ConversationMessage, BotResponse } from "@/types/chat";
import type { ModuleStatus } from "@/generated/prisma/client";

interface Params {
  params: Promise<{ slug: string }>;
}

// POST /api/chat/[slug] — send a message in a customer's chat
export async function POST(req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const body = await req.json();
  const { message, buttonValue } = body;

  const userText = buttonValue || message;
  if (!userText) return error("Message is required");

  const customer = await prisma.customer.findUnique({
    where: { workspaceSlug: slug },
    include: {
      progress: {
        include: { module: true },
        orderBy: { module: { displayOrder: "asc" } },
      },
      collectedData: true,
      conversations: { orderBy: { updatedAt: "desc" }, take: 1 },
    },
  });

  if (!customer) return error("Workspace not found", 404);

  // Get or create conversation
  let conversation = customer.conversations[0];
  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { customerId: customer.id, messages: [] },
    });
  }

  const existingMessages = (conversation.messages || []) as unknown as ConversationMessage[];

  // Determine active module
  const activeProgress = customer.progress.find(
    (p) => p.status === "in_progress"
  );
  const nextPending = customer.progress.find(
    (p) => p.status === "not_started"
  );
  const activeModule = activeProgress?.module || nextPending?.module || null;

  // If starting a new module, mark it as in_progress
  if (!activeProgress && nextPending) {
    await prisma.customerModuleProgress.update({
      where: { id: nextPending.id },
      data: { status: "in_progress" },
    });
  }

  // Compose system prompt
  const systemPrompt = composeSystemPrompt({
    customerName: customer.name,
    activeModule,
    progress: customer.progress,
    collectedData: customer.collectedData,
    metadata: (customer.metadata || {}) as Record<string, unknown>,
  });

  // Build conversation history for LLM (windowed to last 40 messages)
  const recentMessages = existingMessages.slice(-40);
  const chatHistory = recentMessages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.role === "assistant" && m.richContent
      ? JSON.stringify(m.richContent)
      : m.content,
  }));

  // Generate bot response
  let botResponse: BotResponse;
  try {
    botResponse = await generateBotResponse(systemPrompt, chatHistory, userText);
  } catch (e) {
    console.error("LLM error:", e);
    botResponse = {
      messages: [
        {
          type: "text",
          content:
            "I'm having a little trouble right now. Let me try again — could you repeat what you said?",
        },
      ],
    };
  }

  // Save user message
  const userMsg: ConversationMessage = {
    id: uuid(),
    role: "user",
    content: userText,
    timestamp: new Date().toISOString(),
  };

  // Save assistant message
  const assistantMsg: ConversationMessage = {
    id: uuid(),
    role: "assistant",
    content: botResponse.messages
      .filter((m) => m.type === "text")
      .map((m) => ("content" in m ? m.content : ""))
      .join("\n"),
    richContent: botResponse.messages,
    sideTip: botResponse.sideTip,
    timestamp: new Date().toISOString(),
  };

  // Update conversation
  const updatedMessages = [...existingMessages, userMsg, assistantMsg];
  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { messages: updatedMessages as unknown as object[] },
  });

  // Handle module updates from LLM
  if (botResponse.moduleUpdate) {
    const { moduleSlug, status, collectedData } = botResponse.moduleUpdate as {
      moduleSlug?: string;
      status?: string;
      collectedData?: Record<string, unknown>;
    };

    const validStatuses = ["in_progress", "completed", "punted"];
    if (moduleSlug && status && validStatuses.includes(status)) {
      const module = await prisma.module.findUnique({
        where: { slug: moduleSlug },
      });
      if (module) {
        const progressRecord = await prisma.customerModuleProgress.findUnique({
          where: {
            customerId_moduleId: {
              customerId: customer.id,
              moduleId: module.id,
            },
          },
        });
        if (progressRecord) {
          await prisma.customerModuleProgress.update({
            where: { id: progressRecord.id },
            data: {
              status: status as ModuleStatus,
              ...(status === "completed" && { completedAt: new Date() }),
              ...(status === "punted" && { puntedAt: new Date() }),
              ...(collectedData && {
                collectedData: collectedData as object,
              }),
            },
          });
        }
      }
    }
  }

  return json({
    messages: botResponse.messages,
    sideTip: botResponse.sideTip,
    userMessage: userMsg,
    assistantMessage: assistantMsg,
  });
}

// GET /api/chat/[slug] — get conversation history and state
export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const customer = await prisma.customer.findUnique({
    where: { workspaceSlug: slug },
    include: {
      conversations: { orderBy: { updatedAt: "desc" }, take: 1 },
      progress: {
        include: { module: true },
        orderBy: { module: { displayOrder: "asc" } },
      },
      collectedData: true,
    },
  });

  if (!customer) return error("Workspace not found", 404);

  const conversation = customer.conversations[0];
  const messages = (conversation?.messages || []) as unknown as ConversationMessage[];

  // If no messages yet, generate a welcome message
  if (messages.length === 0) {
    const firstModule = customer.progress[0]?.module;
    const welcomePrompt = composeSystemPrompt({
      customerName: customer.name,
      activeModule: firstModule || null,
      progress: customer.progress,
      collectedData: customer.collectedData,
      metadata: (customer.metadata || {}) as Record<string, unknown>,
    });

    let welcomeResponse: BotResponse;
    try {
      welcomeResponse = await generateBotResponse(
        welcomePrompt,
        [],
        "Hi! I'm ready to get started with setting up my Mindbody account."
      );
    } catch {
      welcomeResponse = {
        messages: [
          {
            type: "text",
            content: `Hi ${customer.name}! Welcome to the Mindbody Launch Bot. I'm here to help you get your business set up on Mindbody. Let's get started!`,
          },
          {
            type: "buttons",
            options: [
              { label: "Let's do this!", value: "start", recommended: true },
              { label: "Tell me more first", value: "info" },
            ],
          },
        ],
        sideTip: {
          content:
            "This process takes about 30-45 minutes, but you can stop and come back anytime!",
          icon: "clock",
        },
      };
    }

    // Save the initial exchange
    const conv =
      conversation ||
      (await prisma.conversation.create({
        data: { customerId: customer.id, messages: [] },
      }));

    const userMsg: ConversationMessage = {
      id: uuid(),
      role: "user",
      content: "Hi! I'm ready to get started with setting up my Mindbody account.",
      timestamp: new Date().toISOString(),
    };

    const assistantMsg: ConversationMessage = {
      id: uuid(),
      role: "assistant",
      content: welcomeResponse.messages
        .filter((m) => m.type === "text")
        .map((m) => ("content" in m ? m.content : ""))
        .join("\n"),
      richContent: welcomeResponse.messages,
      sideTip: welcomeResponse.sideTip,
      timestamp: new Date().toISOString(),
    };

    await prisma.conversation.update({
      where: { id: conv.id },
      data: { messages: [userMsg, assistantMsg] as unknown as object[] },
    });

    // Mark first module as in_progress
    if (customer.progress[0]) {
      await prisma.customerModuleProgress.update({
        where: { id: customer.progress[0].id },
        data: { status: "in_progress" },
      });
    }

    return json({
      customer: {
        id: customer.id,
        name: customer.name,
        workspaceSlug: customer.workspaceSlug,
      },
      messages: [userMsg, assistantMsg],
      progress: customer.progress,
    });
  }

  // Check if returning after being away
  const lastMsgTime = messages[messages.length - 1]?.timestamp;
  const hoursSinceLastMsg = lastMsgTime
    ? (Date.now() - new Date(lastMsgTime).getTime()) / (1000 * 60 * 60)
    : 0;

  let welcomeBack = null;
  if (hoursSinceLastMsg > 24) {
    const completed = customer.progress.filter(
      (p) => p.status === "completed"
    );
    const lastActive = customer.progress.find(
      (p) => p.status === "in_progress"
    );
    welcomeBack = getWelcomeBackPrompt(
      customer.name,
      completed.length,
      customer.progress.length,
      lastActive?.module.title || null
    );
  }

  return json({
    customer: {
      id: customer.id,
      name: customer.name,
      workspaceSlug: customer.workspaceSlug,
    },
    messages,
    progress: customer.progress,
    welcomeBack,
  });
}
