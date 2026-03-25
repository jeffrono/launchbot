"use client";

import { motion } from "framer-motion";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface ProgressWidgetProps {
  label: string;
  status: "loading" | "complete" | "error";
}

export function ProgressWidget({ label, status }: ProgressWidgetProps) {
  const icons = {
    loading: <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />,
    complete: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
  };

  const colors = {
    loading: "border-blue-200 bg-blue-50",
    complete: "border-green-200 bg-green-50",
    error: "border-red-200 bg-red-50",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`mr-auto flex items-center gap-3 rounded-2xl border px-4 py-3 ${colors[status]}`}
    >
      {icons[status]}
      <span className="text-sm text-gray-700">{label}</span>
    </motion.div>
  );
}
