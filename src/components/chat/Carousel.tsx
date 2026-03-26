"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface CarouselSlide {
  title: string;
  content: string;
  emoji?: string;
  bgColor?: string;
  imageUrl?: string;
}

interface CarouselProps {
  slides: CarouselSlide[];
}

const bgColors = [
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-pink-600",
  "from-teal-500 to-emerald-600",
  "from-orange-400 to-rose-500",
  "from-cyan-500 to-blue-600",
];

export function Carousel({ slides }: CarouselProps) {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => Math.min(prev + 1, slides.length - 1));
  const prev = () => setCurrent((prev) => Math.max(prev - 1, 0));

  const slide = slides[current];
  const bg = slide.bgColor || bgColors[current % bgColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mr-auto w-full max-w-[85%]"
    >
      <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${bg} text-white shadow-lg`}>
        {/* Slide content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
            className="p-6 min-h-[200px]"
          >
            {slide.imageUrl && (
              <div className="mb-4 rounded-xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={slide.imageUrl} alt="" className="w-full h-32 object-cover" />
              </div>
            )}
            <div className="flex items-start gap-3">
              {slide.emoji && (
                <span className="text-3xl flex-shrink-0">{slide.emoji}</span>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold mb-2">{slide.title}</h3>
                <div className="text-sm leading-relaxed opacity-95 prose prose-sm prose-invert max-w-none prose-p:my-1 prose-li:my-0 prose-strong:text-white">
                  <ReactMarkdown>{slide.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {slides.length > 1 && (
          <div className="flex items-center justify-between px-4 pb-4">
            <button
              onClick={prev}
              disabled={current === 0}
              aria-label="Previous slide"
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? "bg-white w-4" : "bg-white/40"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              disabled={current === slides.length - 1}
              aria-label="Next slide"
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Slide counter */}
      <p className="text-xs text-gray-400 mt-2 text-center">
        {current + 1} of {slides.length}
      </p>
    </motion.div>
  );
}
