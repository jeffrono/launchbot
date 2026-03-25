"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import type { ConversationMessage, SideTip } from "@/types/chat";
import { TextBubble } from "./TextBubble";
import { MessageRenderer } from "./MessageRenderer";
import { TypingIndicator } from "./TypingIndicator";
import { ChatInput } from "./ChatInput";
import { ModuleSidebar } from "./ModuleSidebar";
import { ClippyPanel } from "./ClippyPanel";
import { ErrorBoundaryWrapper } from "./ErrorBoundary";

interface ModuleProgress {
  id: string;
  status: string;
  module: {
    id: string;
    slug: string;
    title: string;
    displayOrder: number;
  };
}

interface ChatWorkspaceProps {
  slug: string;
  initialMessages: ConversationMessage[];
  initialProgress: ModuleProgress[];
  customerName: string;
}

export function ChatWorkspace({
  slug,
  initialMessages,
  initialProgress,
  customerName,
}: ChatWorkspaceProps) {
  const [messages, setMessages] = useState<ConversationMessage[]>(initialMessages);
  const [progress, setProgress] = useState<ModuleProgress[]>(initialProgress);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTip, setCurrentTip] = useState<SideTip | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const initRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  // Auto-trigger welcome message on first load if no messages
  useEffect(() => {
    if (initRef.current || messages.length > 0 || isLoading) return;
    initRef.current = true;

    const initChat = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/chat/${slug}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.messages?.length > 0) setMessages(data.messages);
        if (data.progress) setProgress(data.progress);
      } catch {
        // Silent fail — user can type to start
      } finally {
        setIsLoading(false);
      }
    };
    initChat();
  }, [slug, messages.length, isLoading]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
  };

  const sendMessage = async (text: string, isButtonValue = false) => {
    const userMsg: ConversationMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/chat/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isButtonValue ? { buttonValue: text } : { message: text }
        ),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Request failed");
      }

      const data = await res.json();

      if (data.assistantMessage) {
        setMessages((prev) => [...prev, data.assistantMessage]);
      }

      if (data.sideTip) {
        setCurrentTip(data.sideTip);
      }

      // Use progress from POST response (no separate GET needed)
      if (data.progress) {
        setProgress(data.progress);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "Something went wrong. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (value: string, label?: string) => {
    sendMessage(label || value, true);
  };

  const handleFileUpload = async (files: File[]) => {
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (res.ok) {
          sendMessage(`I've uploaded: ${file.name}`);
        }
      } catch {
        sendMessage(`I tried to upload ${file.name} but it failed.`);
      }
    }
  };

  const handleModuleClick = (moduleSlug: string) => {
    sendMessage(`I'd like to work on the ${moduleSlug.replace(/-/g, " ")} module.`);
  };

  return (
    <ErrorBoundaryWrapper>
      <div className="flex h-screen bg-gray-50">
        {/* Left sidebar — module progress (hidden on small screens) */}
        <div className="hidden md:block">
          <ModuleSidebar progress={progress} onModuleClick={handleModuleClick} />
        </div>

        {/* Center — chat */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat header */}
          <div className="border-b border-gray-200 bg-white px-4 sm:px-6 py-3 flex items-center gap-3">
            <img
              src="/images/bot-avatar.png"
              alt="Mindbody Launch Bot"
              className="w-9 h-9 rounded-full"
            />
            <div>
              <h1 className="text-base sm:text-lg font-semibold text-gray-900">
                Mindbody Launch Bot
              </h1>
              <p className="text-xs text-gray-400">
                Setting up {customerName}&apos;s workspace
              </p>
            </div>
          </div>

          {/* Messages area */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-4"
          >
            {messages.map((msg, i) => {
              const isLatest = i === messages.length - 1;

              if (msg.role === "user") {
                return (
                  <TextBubble key={msg.id} content={msg.content} role="user" />
                );
              }

              if (msg.richContent && msg.richContent.length > 0) {
                return (
                  <div key={msg.id} className="flex items-start gap-2 sm:gap-3">
                    <img
                      src="/images/bot-avatar.png"
                      alt="Bot"
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex-shrink-0 mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <MessageRenderer
                        messages={msg.richContent}
                        onAction={handleAction}
                        onFileUpload={handleFileUpload}
                        isLatest={isLatest}
                      />
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className="flex items-start gap-2 sm:gap-3">
                  <img
                    src="/images/bot-avatar.png"
                    alt="Bot"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex-shrink-0 mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <TextBubble content={msg.content} role="assistant" />
                  </div>
                </div>
              );
            })}

            <AnimatePresence>{isLoading && <TypingIndicator />}</AnimatePresence>
          </div>

          {/* Scroll to bottom */}
          {showScrollBtn && (
            <button
              onClick={scrollToBottom}
              aria-label="Scroll to bottom"
              className="absolute bottom-24 right-1/2 translate-x-1/2 bg-white border border-gray-200 shadow-md rounded-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Scroll to bottom
            </button>
          )}

          {/* Input */}
          <ChatInput onSend={sendMessage} disabled={isLoading} />
        </div>

        {/* Right panel — Clippy tips (hidden on small screens) */}
        <div className="hidden lg:block">
          <ClippyPanel currentTip={currentTip} customerName={customerName} />
        </div>
      </div>
    </ErrorBoundaryWrapper>
  );
}
