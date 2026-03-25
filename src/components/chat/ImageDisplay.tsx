"use client";

import { motion } from "framer-motion";

interface ImageDisplayProps {
  url: string;
  caption?: string;
}

function isAllowedImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function ImageDisplay({ url, caption }: ImageDisplayProps) {
  if (!isAllowedImageUrl(url)) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mr-auto w-full max-w-[80%] rounded-2xl overflow-hidden border border-gray-200"
    >
      <div className="relative w-full h-48">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={caption || "Image"}
          className="w-full h-full object-cover"
        />
      </div>
      {caption && (
        <p className="px-4 py-2 text-xs text-gray-500 bg-gray-50">{caption}</p>
      )}
    </motion.div>
  );
}
