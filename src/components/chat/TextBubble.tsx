"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/cn";

interface TextBubbleProps {
  content: string;
  role: "user" | "assistant";
}

function sanitizeUrl(url: string): string {
  if (url.startsWith("javascript:") || url.startsWith("data:")) return "";
  return url;
}

export function TextBubble({ content, role }: TextBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
        role === "user"
          ? "ml-auto bg-blue-600 text-white"
          : "mr-auto bg-gray-100 text-gray-900"
      )}
    >
      {role === "assistant" ? (
        <div className="prose prose-sm max-w-none prose-p:my-1 prose-strong:text-gray-900 prose-ul:my-1 prose-li:my-0">
          <ReactMarkdown
            urlTransform={sanitizeUrl}
          >
            {content}
          </ReactMarkdown>
        </div>
      ) : (
        content.split("\n").map((line, i) => (
          <p key={i} className={i > 0 ? "mt-2" : ""}>
            {line}
          </p>
        ))
      )}
    </motion.div>
  );
}
