"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface Step {
  title: string;
  description: string;
}

interface StepGuideProps {
  title: string;
  steps: Step[];
}

export function StepGuide({ title, steps }: StepGuideProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mr-auto w-full max-w-[80%] rounded-2xl bg-white border border-gray-200 p-4"
    >
      <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="space-y-2">
        {steps.map((step, i) => (
          <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
            <button
              onClick={() => setExpandedStep(expandedStep === i ? null : i)}
              className="flex items-center gap-3 w-full p-3 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span className="text-sm font-medium text-gray-800 flex-1">
                {step.title}
              </span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-gray-400 transition-transform",
                  expandedStep === i && "rotate-180"
                )}
              />
            </button>
            <AnimatePresence>
              {expandedStep === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden"
                >
                  <p className="px-3 pb-3 pl-12 text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
