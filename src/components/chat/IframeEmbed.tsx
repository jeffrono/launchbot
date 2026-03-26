"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Check } from "lucide-react";

interface IframeEmbedProps {
  url: string;
  title: string;
  height?: number;
  onComplete: (value: string) => void;
}

export function IframeEmbed({ url, title, height = 500, onComplete }: IframeEmbedProps) {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    onComplete(`I've completed: ${title}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mr-auto w-full max-w-[90%]"
    >
      <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-700">{title}</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
            aria-label="Open in new tab"
          >
            <ExternalLink className="w-3 h-3" /> Open in new tab
          </a>
        </div>

        {/* Iframe */}
        <div style={{ height: `${height}px` }} className="relative">
          <iframe
            src={url}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            title={title}
          />
        </div>

        {/* Completion button */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          {completed ? (
            <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
              <Check className="w-4 h-4" /> Completed
            </div>
          ) : (
            <button
              onClick={handleComplete}
              className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              I&apos;ve completed this
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
