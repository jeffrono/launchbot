"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

interface ChecklistProps {
  title: string;
  items: string[];
}

export function Checklist({ title, items }: ChecklistProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (index: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mr-auto w-full max-w-[80%] rounded-2xl bg-white border border-gray-200 p-4"
    >
      <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i}>
            <button
              onClick={() => toggle(i)}
              className="flex items-center gap-3 w-full text-left group"
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                  checked.has(i)
                    ? "bg-green-500 border-green-500"
                    : "border-gray-300 group-hover:border-gray-400"
                )}
              >
                {checked.has(i) && <Check className="w-3 h-3 text-white" />}
              </div>
              <span
                className={cn(
                  "text-sm transition-all",
                  checked.has(i) ? "text-gray-400 line-through" : "text-gray-700"
                )}
              >
                {item}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-3 text-xs text-gray-400">
        {checked.size}/{items.length} complete
      </div>
    </motion.div>
  );
}
