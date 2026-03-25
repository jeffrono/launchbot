"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface ImageDisplayProps {
  url: string;
  caption?: string;
}

export function ImageDisplay({ url, caption }: ImageDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mr-auto w-full max-w-[80%] rounded-2xl overflow-hidden border border-gray-200"
    >
      <div className="relative w-full h-48">
        <Image
          src={url}
          alt={caption || "Image"}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      {caption && (
        <p className="px-4 py-2 text-xs text-gray-500 bg-gray-50">{caption}</p>
      )}
    </motion.div>
  );
}
