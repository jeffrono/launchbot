"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
    sectionSlug?: string;
    sectionTitle?: string;
    sectionOrder?: number;
    moduleType?: string;
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

      // Start crawl polling if a crawl was triggered
      if (data.crawlJobId) {
        pollCrawlStatus();
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
          const data = await res.json();
          sendMessage(`I've uploaded: ${file.name}${data.url ? ` (${data.url})` : ""}`);
        }
      } catch {
        sendMessage(`I tried to upload ${file.name} but it failed.`);
      }
    }
  };

  const handleImagePaste = async (file: File) => {
    // Upload the screenshot
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      const imageUrl = data.url;
      // Send with image context so the LLM can analyze it
      sendMessage(
        `[Screenshot attached${imageUrl ? `: ${imageUrl}` : ""}] Can you help me understand what I'm looking at?`
      );
    } catch {
      sendMessage("I tried to paste a screenshot but the upload failed.");
    }
  };

  // Crawl status polling
  const [crawlStatus, setCrawlStatus] = useState<{
    status: string;
    total?: number;
    completed?: number;
    pagesFound?: number;
    currentPages?: { url: string; title: string }[];
    extractedData?: Record<string, unknown>;
  } | null>(null);

  const pollCrawlStatus = useCallback(async () => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/chat/${slug}/crawl-status`);
        if (!res.ok) return true; // stop polling
        const data = await res.json();
        setCrawlStatus(data);

        if (data.status === "completed") {
          // Refresh progress to show partially_complete dots
          const progressRes = await fetch(`/api/chat/${slug}`);
          if (progressRes.ok) {
            const progressData = await progressRes.json();
            if (progressData.progress) setProgress(progressData.progress);
          }

          // Add a summary message
          const summary = data.extractedData;
          const parts: string[] = ["Website scan complete!"];
          if (summary?.staff?.members?.length) parts.push(`Found ${summary.staff.members.length} staff members`);
          if (summary?.classes?.items?.length) parts.push(`Found ${summary.classes.items.length} classes`);
          if (summary?.pricing?.items?.length) parts.push(`Found ${summary.pricing.items.length} pricing options`);
          if (summary?.populatedModules?.length) parts.push(`Pre-filled ${summary.populatedModules.length} modules`);

          setMessages((prev) => [
            ...prev,
            {
              id: `crawl-${Date.now()}`,
              role: "assistant",
              content: parts.join(". ") + ".",
              richContent: [
                { type: "text" as const, content: parts.join(". ") + " Check the sidebar for orange dots — those modules already have data!" },
                { type: "buttons" as const, options: [
                  { label: "Continue", value: "The website crawl is complete. Let's continue to the next step.", recommended: true },
                ] },
              ],
              timestamp: new Date().toISOString(),
            },
          ]);
          setCrawlStatus(null);
          return true; // stop polling
        }

        return data.status === "failed" || data.status === "cancelled";
      } catch {
        return true; // stop on error
      }
    };

    // Poll every 3 seconds
    const interval = setInterval(async () => {
      const shouldStop = await poll();
      if (shouldStop) clearInterval(interval);
    }, 3000);

    // Initial poll immediately
    poll();

    // Cleanup after 5 minutes max
    setTimeout(() => clearInterval(interval), 300000);
  }, [slug]);

  // Find the latest recommended button for Enter-to-submit
  const latestRecommended = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.role === "assistant" && msg.richContent) {
        for (const rich of msg.richContent) {
          if (rich.type === "buttons" && "options" in rich) {
            const rec = rich.options.find((o: { recommended?: boolean }) => o.recommended);
            if (rec) return rec as { label: string; value: string };
          }
        }
      }
    }
    return null;
  }, [messages]);

  const handleEnterEmpty = () => {
    if (latestRecommended && !isLoading) {
      handleAction(latestRecommended.value, latestRecommended.label);
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

            {/* Crawl progress indicator */}
            {crawlStatus && crawlStatus.status !== "completed" && (
              <div className="flex items-start gap-2 sm:gap-3">
                <img src="/images/bot-avatar.png" alt="Bot" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex-shrink-0 mt-1" />
                <div className="bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3 max-w-[80%]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium text-blue-700">Scanning your website...</span>
                  </div>
                  {crawlStatus.total ? (
                    <div className="mb-2">
                      <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.round(((crawlStatus.completed || 0) / crawlStatus.total) * 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-blue-600 mt-1">
                        {crawlStatus.completed || 0} of {crawlStatus.total} pages processed
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-blue-600">Starting crawl...</p>
                  )}
                  {crawlStatus.currentPages && crawlStatus.currentPages.length > 0 && (
                    <div className="space-y-1 mt-2">
                      {crawlStatus.currentPages.map((page, i) => (
                        <p key={i} className="text-xs text-gray-500 truncate">
                          {page.title || page.url}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

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
          <ChatInput onSend={sendMessage} onImagePaste={handleImagePaste} onEnterEmpty={handleEnterEmpty} disabled={isLoading} />
        </div>

        {/* Right panel — Clippy tips (hidden on small screens) */}
        <div className="hidden lg:block">
          <ClippyPanel currentTip={currentTip} customerName={customerName} onFileUpload={handleFileUpload} />
        </div>
      </div>
    </ErrorBoundaryWrapper>
  );
}
