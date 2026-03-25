"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface ButtonOption {
  label: string;
  value: string;
  recommended?: boolean;
}

interface ButtonGroupProps {
  options: ButtonOption[];
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export function ButtonGroup({ options, onSelect, disabled }: ButtonGroupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.1 }}
      className="flex flex-wrap gap-2 mr-auto"
    >
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={() => onSelect(opt.value)}
          disabled={disabled}
          className={cn(
            "rounded-xl px-5 py-2.5 text-sm font-medium transition-all",
            "hover:scale-[1.02] active:scale-[0.98]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            opt.recommended
              ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          )}
        >
          {opt.label}
          {opt.recommended && (
            <span className="ml-1.5 text-xs opacity-75">*</span>
          )}
        </button>
      ))}
    </motion.div>
  );
}
