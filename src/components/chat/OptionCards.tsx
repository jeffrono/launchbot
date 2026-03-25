"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { Star } from "lucide-react";

interface OptionCard {
  title: string;
  description: string;
  recommended?: boolean;
  value: string;
}

interface OptionCardsProps {
  title: string;
  cards: OptionCard[];
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export function OptionCards({ title, cards, onSelect, disabled }: OptionCardsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mr-auto w-full max-w-[80%]"
    >
      <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {cards.map((card, i) => (
          <button
            key={i}
            onClick={() => onSelect(card.value)}
            disabled={disabled}
            className={cn(
              "relative rounded-xl border-2 p-4 text-left transition-all",
              "hover:scale-[1.01] active:scale-[0.99]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              card.recommended
                ? "border-blue-400 bg-blue-50 hover:border-blue-500"
                : "border-gray-200 bg-white hover:border-gray-300"
            )}
          >
            {card.recommended && (
              <div className="absolute -top-2 right-3 flex items-center gap-1 bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3" />
                Recommended
              </div>
            )}
            <h4 className="text-sm font-semibold text-gray-900">{card.title}</h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {card.description}
            </p>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
