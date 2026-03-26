"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { cn } from "@/lib/cn";

interface TextInputProps {
  label: string;
  placeholder?: string;
  validation?: "url" | "email" | "phone" | "none";
  submitLabel?: string;
  onSubmit: (value: string) => void;
  disabled?: boolean;
}

function validate(value: string, type?: string): string | null {
  if (!value.trim()) return "This field is required";
  if (type === "url") {
    try {
      const url = value.startsWith("http") ? value : `https://${value}`;
      new URL(url);
      return null;
    } catch {
      return "Please enter a valid URL";
    }
  }
  if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Please enter a valid email";
  }
  return null;
}

export function TextInput({
  label,
  placeholder,
  validation,
  submitLabel = "Submit",
  onSubmit,
  disabled,
}: TextInputProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (disabled) return;
    const err = validate(value, validation);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    // Normalize URLs
    const normalized = validation === "url" && !value.startsWith("http")
      ? `https://${value}`
      : value;
    onSubmit(normalized);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.1 }}
      className="mr-auto w-full max-w-[80%]"
    >
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="flex gap-2">
          <input
            type={validation === "url" ? "url" : validation === "email" ? "email" : "text"}
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(null); }}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "flex-1 rounded-lg border px-3 py-2.5 text-sm",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error ? "border-red-300 bg-red-50" : "border-gray-200"
            )}
            autoFocus
          />
          <button
            onClick={handleSubmit}
            disabled={disabled || !value.trim()}
            className={cn(
              "px-5 py-2.5 rounded-lg text-sm font-semibold transition-all inline-flex items-center gap-1.5",
              "active:scale-[0.95]",
              value.trim() && !disabled
                ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            {submitLabel}
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        {error && (
          <p className="text-xs text-red-500 mt-1.5">{error}</p>
        )}
      </div>
    </motion.div>
  );
}
