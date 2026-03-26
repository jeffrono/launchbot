"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

interface ButtonOption {
  label: string;
  value: string;
  recommended?: boolean;
}

interface ButtonGroupProps {
  options: ButtonOption[];
  onSelect: (value: string, label?: string) => void;
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
          onClick={() => onSelect(opt.value, opt.label)}
          disabled={disabled}
          className={cn(
            "rounded-xl px-6 py-3 text-sm font-semibold transition-all inline-flex items-center gap-1.5",
            "hover:scale-[1.02] active:scale-[0.95]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            opt.recommended
              ? "bg-blue-600 text-white shadow-lg ring-2 ring-blue-400/30 hover:bg-blue-700 hover:shadow-xl"
              : "bg-white text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50 hover:shadow-md hover:border-gray-300"
          )}
        >
          {opt.label}
          {opt.recommended && (
            <>
              <ChevronRight className="w-4 h-4 opacity-70" />
              <span className="text-[10px] opacity-60 font-normal ml-0.5">↵</span>
            </>
          )}
        </button>
      ))}
    </motion.div>
  );
}
