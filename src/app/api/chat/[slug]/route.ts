import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { json, error } from "@/lib/api";
import { generateBotResponse } from "@/lib/llm";
import { composeSystemPrompt, getWelcomeBackPrompt } from "@/lib/prompts";
import { rateLimit } from "@/lib/rate-limit";
import { v4 as uuid } from "uuid";
import type { ConversationMessage, BotResponse } from "@/types/chat";
import type { ModuleStatus } from "@/generated/prisma/client";

interface Params {
  params: Promise<{ slug: string }>;
}

// Max messages to keep in conversation JSON (older ones are trimmed)
const MAX_STORED_MESSAGES = 200;
const LLM_CONTEXT_WINDOW = 40;

// POST /api/chat/[slug] — send a message
export async function POST(req: NextRequest, { params }: Params) {
  const { slug } = await params;

  // Rate limit: 20 messages per minute per workspace
  const { allowed } = rateLimit(`chat:${slug}`, 20, 60_000);
  if (!allowed) return error("Too many messages. Please slow down.", 429);

  const body = await req.json();
  const { message, buttonValue, imageUrl } = body;

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
      assignedSpecialist: true,
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
  const activeProgress = customer.progress.find((p) => p.status === "in_progress");
  const nextPending = customer.progress.find((p) => p.status === "not_started");
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
    specialist: customer.assignedSpecialist,
  });

  // Build conversation history for LLM (windowed)
  const recentMessages = existingMessages.slice(-LLM_CONTEXT_WINDOW);
  const chatHistory = recentMessages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.role === "assistant" && m.richContent
      ? JSON.stringify(m.richContent)
      : m.content,
  }));

  // Generate bot response
  let botResponse: BotResponse;
  try {
    botResponse = await generateBotResponse(systemPrompt, chatHistory, userText, imageUrl);
  } catch (e) {
    console.error("LLM error:", e);
    botResponse = {
      messages: [
        {
          type: "text",
          content: "I'm having a little trouble right now. Could you try again?",
        },
      ],
    };
  }

  // Build messages
  const userMsg: ConversationMessage = {
    id: uuid(),
    role: "user",
    content: userText,
    timestamp: new Date().toISOString(),
    ...(imageUrl && { imageUrl }),
  };

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

  // Trim old messages to prevent unbounded growth
  const allMessages = [...existingMessages, userMsg, assistantMsg];
  const trimmedMessages = allMessages.length > MAX_STORED_MESSAGES
    ? allMessages.slice(-MAX_STORED_MESSAGES)
    : allMessages;

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { messages: trimmedMessages as unknown as object[] },
  });

  // Handle module updates from LLM
  let updatedProgress = customer.progress;
  if (botResponse.moduleUpdate) {
    const { moduleSlug, status, collectedData } = botResponse.moduleUpdate as {
      moduleSlug?: string;
      status?: string;
      collectedData?: Record<string, unknown>;
    };

    const validStatuses = ["in_progress", "completed", "punted", "partially_complete"];
    if (moduleSlug && status && validStatuses.includes(status)) {
      const mod = await prisma.module.findUnique({ where: { slug: moduleSlug } });
      if (mod) {
        const progressRecord = await prisma.customerModuleProgress.findUnique({
          where: { customerId_moduleId: { customerId: customer.id, moduleId: mod.id } },
        });
        if (progressRecord) {
          await prisma.customerModuleProgress.update({
            where: { id: progressRecord.id },
            data: {
              status: status as ModuleStatus,
              ...(status === "completed" && { completedAt: new Date() }),
              ...(status === "punted" && { puntedAt: new Date() }),
              ...(collectedData && { collectedData: collectedData as object }),
            },
          });
        }
      }

      // Fetch updated progress to return to client
      updatedProgress = await prisma.customerModuleProgress.findMany({
        where: { customerId: customer.id },
        include: { module: true },
        orderBy: { module: { displayOrder: "asc" } },
      });
    }
  }

  // Return response with updated progress (no separate GET needed)
  return json({
    messages: botResponse.messages,
    sideTip: botResponse.sideTip,
    userMessage: userMsg,
    assistantMessage: assistantMsg,
    progress: updatedProgress,
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
      assignedSpecialist: true,
    },
  });

  if (!customer) return error("Workspace not found", 404);

  const conversation = customer.conversations[0];
  const messages = (conversation?.messages || []) as unknown as ConversationMessage[];

  // Generate welcome message only if no messages exist
  if (messages.length === 0) {
    const firstModule = customer.progress[0]?.module;
    const welcomePrompt = composeSystemPrompt({
      customerName: customer.name,
      activeModule: firstModule || null,
      progress: customer.progress,
      collectedData: customer.collectedData,
      metadata: (customer.metadata || {}) as Record<string, unknown>,
      specialist: customer.assignedSpecialist,
    });

    let welcomeResponse: BotResponse;
    try {
      welcomeResponse = await generateBotResponse(
        welcomePrompt,
        [],
        "Hi! I'm ready to get started."
      );
    } catch {
      welcomeResponse = {
        messages: [
          { type: "text", content: `Hi! I'm the Mindbody Launch Bot. Let's get your business set up.` },
          {
            type: "buttons",
            options: [
              { label: "Let's do this!", value: "Let's do this!", recommended: true },
              { label: "Tell me more first", value: "Tell me more first" },
            ],
          },
        ],
        sideTip: { content: "This usually takes about 30 minutes. You can pause and come back anytime!", icon: "clock" },
      };
    }

    const conv = conversation || await prisma.conversation.create({
      data: { customerId: customer.id, messages: [] },
    });

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
      data: { messages: [assistantMsg] as unknown as object[] },
    });

    if (customer.progress[0]) {
      await prisma.customerModuleProgress.update({
        where: { id: customer.progress[0].id },
        data: { status: "in_progress" },
      });
    }

    return json({
      customer: { id: customer.id, name: customer.name, workspaceSlug: customer.workspaceSlug },
      messages: [assistantMsg],
      progress: customer.progress,
    });
  }

  // Return existing conversation
  return json({
    customer: { id: customer.id, name: customer.name, workspaceSlug: customer.workspaceSlug },
    messages,
    progress: customer.progress,
  });
}
