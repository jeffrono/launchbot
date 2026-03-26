"use client";

import { useState, useRef } from "react";
import { Send, ImageIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface ChatInputProps {
  onSend: (message: string) => void;
  onImagePaste?: (file: File) => void;
  onEnterEmpty?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  onImagePaste,
  onEnterEmpty,
  disabled,
  placeholder = "Type your message... (paste screenshots with Ctrl+V)",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [pastedImage, setPastedImage] = useState<File | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (pastedImage && onImagePaste) {
      onImagePaste(pastedImage);
      setPastedImage(null);
      const trimmed = value.trim();
      if (trimmed) {
        onSend(trimmed);
        setValue("");
      }
      return;
    }

    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!value.trim() && !pastedImage && onEnterEmpty) {
        onEnterEmpty();
      } else {
        handleSubmit();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find((item) => item.type.startsWith("image/"));
    if (imageItem) {
      e.preventDefault();
      const file = imageItem.getAsFile();
      if (file) {
        setPastedImage(file);
      }
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-3 sm:p-4">
      {/* Pasted image preview */}
      {pastedImage && (
        <div className="max-w-3xl mx-auto mb-2 flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
          <ImageIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <span className="text-xs text-blue-700 flex-1">
            Screenshot ready to send: {pastedImage.name || "clipboard image"}
          </span>
          <button
            onClick={() => setPastedImage(null)}
            className="text-xs text-blue-500 hover:text-blue-700"
          >
            Remove
          </button>
        </div>
      )}

      <div className="flex items-end gap-2 sm:gap-3 max-w-3xl mx-auto">
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          aria-label="Chat message"
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
          disabled={disabled || (!value.trim() && !pastedImage)}
          aria-label="Send message"
          className={cn(
            "flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all",
            (value.trim() || pastedImage) && !disabled
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
