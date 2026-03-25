"use client";

import { motion } from "framer-motion";
import { Info, Lightbulb, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/cn";

interface InfoBoxProps {
  content: string;
  variant?: "info" | "tip" | "warning";
}

const variants = {
  info: {
    bg: "bg-blue-50 border-blue-200",
    icon: <Info className="w-4 h-4 text-blue-500" />,
    text: "text-blue-800",
  },
  tip: {
    bg: "bg-amber-50 border-amber-200",
    icon: <Lightbulb className="w-4 h-4 text-amber-500" />,
    text: "text-amber-800",
  },
  warning: {
    bg: "bg-red-50 border-red-200",
    icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
    text: "text-red-800",
  },
};

export function InfoBox({ content, variant = "info" }: InfoBoxProps) {
  const v = variants[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "mr-auto max-w-[80%] rounded-2xl border px-4 py-3 flex items-start gap-3",
        v.bg
      )}
    >
      <div className="flex-shrink-0 mt-0.5">{v.icon}</div>
      <p className={cn("text-sm leading-relaxed", v.text)}>{content}</p>
    </motion.div>
  );
}
