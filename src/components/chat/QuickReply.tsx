"use client";

import { motion } from "framer-motion";

interface QuickReplyProps {
  options: string[];
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export function QuickReply({ options, onSelect, disabled }: QuickReplyProps) {
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
          onClick={() => onSelect(opt)}
          disabled={disabled}
          className="rounded-full px-5 py-2 text-sm font-medium bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-50 hover:shadow-md hover:border-gray-300 transition-all active:scale-[0.95] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {opt}
        </button>
      ))}
    </motion.div>
  );
}
