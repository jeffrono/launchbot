"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Lightbulb, Zap, Heart } from "lucide-react";
import { cn } from "@/lib/cn";
import type { SideTip } from "@/types/chat";

interface ClippyPanelProps {
  currentTip: SideTip | null;
  customerName: string;
}

const iconMap: Record<string, React.ReactNode> = {
  sparkles: <Sparkles className="w-5 h-5 text-purple-500" />,
  lightbulb: <Lightbulb className="w-5 h-5 text-amber-500" />,
  lightning: <Zap className="w-5 h-5 text-blue-500" />,
  heart: <Heart className="w-5 h-5 text-pink-500" />,
  clock: <Sparkles className="w-5 h-5 text-green-500" />,
};

const motivationalTips = [
  "You're doing great! Every step brings you closer to launch.",
  "Studios that complete onboarding in one session get their first booking faster!",
  "Remember: nothing is permanent. You can always come back and adjust.",
  "Your future clients are going to love booking with you!",
  "Need a break? Just come back anytime — we'll pick up right where you left off.",
];

export function ClippyPanel({ currentTip, customerName }: ClippyPanelProps) {
  const [visible, setVisible] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (currentTip) {
      setVisible(true);
      return;
    }
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % motivationalTips.length);
    }, 30000);
    return () => clearInterval(timer);
  }, [currentTip]);

  const displayTip = currentTip || {
    content: motivationalTips[tipIndex],
    icon: "sparkles",
  };

  return (
    <div className="w-72 h-full border-l border-gray-200 bg-gradient-to-b from-purple-50 to-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Launch Tips</p>
            <p className="text-xs text-gray-400">Here to help!</p>
          </div>
        </div>
      </div>

      {/* Tips area */}
      <div className="flex-1 p-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          {visible && (
            <motion.div
              key={currentTip?.content || tipIndex}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
            >
              <button
                onClick={() => setVisible(false)}
                aria-label="Dismiss tip"
                className="absolute top-2 right-2 text-gray-300 hover:text-gray-500"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {iconMap[displayTip.icon || "sparkles"] || iconMap.sparkles}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {displayTip.content}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Greeting */}
        <div className="mt-6">
          <p className="text-xs text-gray-400 text-center">
            Hi {customerName}! You&apos;ve got this.
          </p>
        </div>
      </div>
    </div>
  );
}
