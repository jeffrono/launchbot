"use client";

import { motion } from "framer-motion";

interface GifEmbedProps {
  url: string;
  alt?: string;
}

export function GifEmbed({ url, alt }: GifEmbedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mr-auto max-w-[60%] rounded-2xl overflow-hidden"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={alt || "GIF"}
        className="w-full rounded-2xl"
      />
    </motion.div>
  );
}
