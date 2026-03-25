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

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  // Auto-trigger welcome message on first load if no messages
  useEffect(() => {
    if (messages.length === 0 && !isLoading) {
      const initChat = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/chat/${slug}`);
          const data = await res.json();
          if (data.messages && data.messages.length > 0) {
            setMessages(data.messages);
          }
          if (data.progress) {
            setProgress(data.progress);
          }
        } catch (err) {
          console.error("Failed to init chat:", err);
        } finally {
          setIsLoading(false);
        }
      };
      initChat();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

      const data = await res.json();

      if (data.assistantMessage) {
        setMessages((prev) => [...prev, data.assistantMessage]);
      }

      if (data.sideTip) {
        setCurrentTip(data.sideTip);
      }

      // Refresh progress
      const progressRes = await fetch(`/api/chat/${slug}`);
      const progressData = await progressRes.json();
      if (progressData.progress) {
        setProgress(progressData.progress);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "Oops! Something went wrong. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (value: string) => {
    sendMessage(value, true);
  };

  const handleFileUpload = (files: File[]) => {
    // TODO: Upload to storage, then send reference in chat
    const fileNames = files.map((f) => f.name).join(", ");
    sendMessage(`I've uploaded: ${fileNames}`);
  };

  const handleModuleClick = (moduleSlug: string) => {
    sendMessage(`I'd like to work on the ${moduleSlug.replace(/-/g, " ")} module.`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left sidebar — module progress */}
      <ModuleSidebar progress={progress} onModuleClick={handleModuleClick} />

      {/* Center — chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="border-b border-gray-200 bg-white px-6 py-3">
          <h1 className="text-lg font-semibold text-gray-900">
            Mindbody Launch Bot
          </h1>
          <p className="text-xs text-gray-400">
            Setting up {customerName}&apos;s workspace
          </p>
        </div>

        {/* Messages area */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
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
                <MessageRenderer
                  key={msg.id}
                  messages={msg.richContent}
                  onAction={handleAction}
                  onFileUpload={handleFileUpload}
                  isLatest={isLatest}
                />
              );
            }

            return (
              <TextBubble
                key={msg.id}
                content={msg.content}
                role="assistant"
              />
            );
          })}

          <AnimatePresence>{isLoading && <TypingIndicator />}</AnimatePresence>
        </div>

        {/* Scroll to bottom */}
        {showScrollBtn && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-24 right-1/2 translate-x-1/2 bg-white border border-gray-200 shadow-md rounded-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Scroll to bottom
          </button>
        )}

        {/* Input */}
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>

      {/* Right panel — Clippy tips */}
      <div className="hidden lg:block">
        <ClippyPanel currentTip={currentTip} customerName={customerName} />
      </div>
    </div>
  );
}
