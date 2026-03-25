import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ChatWorkspace } from "@/components/chat/ChatWorkspace";
import type { ConversationMessage } from "@/types/chat";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ChatPage({ params }: PageProps) {
  const { slug } = await params;

  const customer = await prisma.customer.findUnique({
    where: { workspaceSlug: slug },
    include: {
      conversations: { orderBy: { updatedAt: "desc" }, take: 1 },
      progress: {
        include: { module: true },
        orderBy: { module: { displayOrder: "asc" } },
      },
    },
  });

  if (!customer) notFound();

  const conversation = customer.conversations[0];
  const messages = (conversation?.messages || []) as unknown as ConversationMessage[];

  const progress = customer.progress.map((p) => ({
    id: p.id,
    status: p.status,
    module: {
      id: p.module.id,
      slug: p.module.slug,
      title: p.module.title,
      displayOrder: p.module.displayOrder,
    },
  }));

  return (
    <ChatWorkspace
      slug={slug}
      initialMessages={messages}
      initialProgress={progress}
      customerName={customer.name}
    />
  );
}
