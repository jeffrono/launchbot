"use client";

import { useState, useRef } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/cn";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled,
  placeholder = "Type your message...",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="flex items-end gap-3 max-w-3xl mx-auto">
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            "flex-1 resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed",
            "max-h-32"
          )}
          style={{ minHeight: "44px" }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className={cn(
            "flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all",
            value.trim() && !disabled
              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
              : "bg-gray-100 text-gray-300 cursor-not-allowed"
          )}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
