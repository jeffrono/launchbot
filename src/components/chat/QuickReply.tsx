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
          className="rounded-full px-4 py-1.5 text-sm bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {opt}
        </button>
      ))}
    </motion.div>
  );
}
