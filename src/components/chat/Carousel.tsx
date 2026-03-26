"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  onComplete?: (value: string) => void;
  continueLabel?: string;
}

const gradientColors = [
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-pink-600",
  "from-teal-500 to-emerald-600",
  "from-orange-400 to-rose-500",
  "from-cyan-500 to-blue-600",
];

function isHexColor(str: string): boolean {
  return /^#[0-9A-Fa-f]{3,8}$/.test(str);
}

export function Carousel({ slides, onComplete, continueLabel }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const next = useCallback(
    () => setCurrent((prev) => Math.min(prev + 1, slides.length - 1)),
    [slides.length]
  );
  const prev = useCallback(
    () => setCurrent((prev) => Math.max(prev - 1, 0)),
    []
  );

  // Keyboard navigation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { next(); e.preventDefault(); }
      if (e.key === "ArrowLeft") { prev(); e.preventDefault(); }
    };
    el.addEventListener("keydown", handleKey);
    return () => el.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  // Auto-focus for keyboard nav
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const slide = slides[current];
  const slideBgColor = slide.bgColor;
  const isHex = slideBgColor && isHexColor(slideBgColor);
  const useGradient = !isHex;
  const gradientClass = useGradient
    ? (slideBgColor || gradientColors[current % gradientColors.length])
    : "";
  const isLightBg = isHex; // hex colors from seed data are light pastels
  const isLastSlide = current === slides.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mr-auto w-full max-w-[85%]"
    >
      <div
        ref={containerRef}
        tabIndex={0}
        className={`relative rounded-2xl overflow-hidden shadow-lg outline-none ${
          useGradient ? `bg-gradient-to-br ${gradientClass} text-white` : ""
        }`}
        style={isHex ? { backgroundColor: slideBgColor } : undefined}
      >
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
                <h3 className={`text-lg font-bold mb-2 ${isLightBg ? "text-gray-900" : ""}`}>
                  {slide.title}
                </h3>
                <div
                  className={`text-sm leading-relaxed prose prose-sm max-w-none prose-p:my-1 prose-li:my-0 ${
                    isLightBg
                      ? "text-gray-700 prose-strong:text-gray-900"
                      : "text-white/95 prose-invert prose-strong:text-white"
                  }`}
                >
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
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                isLightBg
                  ? "bg-gray-900/10 hover:bg-gray-900/20"
                  : "bg-black/20 hover:bg-black/30 backdrop-blur-sm"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current
                      ? isLightBg ? "bg-gray-900 w-4" : "bg-white w-4"
                      : isLightBg ? "bg-gray-900/30" : "bg-white/40"
                  }`}
                />
              ))}
            </div>

            {isLastSlide && onComplete ? (
              <button
                onClick={() => onComplete("continue")}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-lg hover:bg-blue-700 transition-all active:scale-[0.95]"
              >
                {continueLabel || "Continue →"}
              </button>
            ) : (
              <button
                onClick={next}
                disabled={isLastSlide}
                aria-label="Next slide"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                  isLightBg
                    ? "bg-gray-900/10 hover:bg-gray-900/20"
                    : "bg-black/20 hover:bg-black/30 backdrop-blur-sm"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
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
