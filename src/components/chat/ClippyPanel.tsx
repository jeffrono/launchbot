"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Lightbulb, Zap, Heart, Upload, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { cn } from "@/lib/cn";
import type { SideTip } from "@/types/chat";

interface ClippyPanelProps {
  currentTip: SideTip | null;
  customerName: string;
  onFileUpload?: (files: File[]) => void;
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

export function ClippyPanel({ currentTip, customerName, onFileUpload }: ClippyPanelProps) {
  const [visible, setVisible] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);
  const [uploadExpanded, setUploadExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: number; status: "uploading" | "processing" | "done" }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;
    // Add files with "uploading" status, then mark as "processing" after upload
    const newFiles = fileArray.map((f) => ({ name: f.name, size: f.size, status: "uploading" as const }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
    onFileUpload?.(fileArray);
    // Mark as processing after a brief delay (upload is async in parent)
    setTimeout(() => {
      setUploadedFiles((prev) =>
        prev.map((f) => newFiles.some((nf) => nf.name === f.name && f.status === "uploading")
          ? { ...f, status: "processing" }
          : f
        )
      );
    }, 500);
    // Mark as done after processing (rough estimate)
    setTimeout(() => {
      setUploadedFiles((prev) =>
        prev.map((f) => f.status === "processing" ? { ...f, status: "done" } : f)
      );
    }, 8000);
  }, [onFileUpload]);

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

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

      {/* Persistent file upload section */}
      {onFileUpload && (
        <div className="border-t border-gray-100">
          <button
            onClick={() => setUploadExpanded(!uploadExpanded)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Upload Files</span>
              {uploadedFiles.length > 0 && (
                <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">
                  {uploadedFiles.length}
                </span>
              )}
            </div>
            {uploadExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            )}
          </button>

          <AnimatePresence>
            {uploadExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4">
                  {/* Drop zone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all",
                      isDragging
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                    )}
                  >
                    <Upload className={cn(
                      "w-6 h-6 mx-auto mb-2",
                      isDragging ? "text-blue-500" : "text-gray-400"
                    )} />
                    <p className="text-xs text-gray-500">
                      {isDragging ? "Drop files here!" : "Drag & drop or click to browse"}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      PDFs, spreadsheets, images, docs
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => e.target.files && handleFiles(e.target.files)}
                    />
                  </div>

                  {/* Uploaded file list */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      {uploadedFiles.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs bg-gray-50 rounded-lg px-2.5 py-1.5 group">
                          {f.status === "uploading" ? (
                            <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                          ) : f.status === "processing" ? (
                            <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                          ) : (
                            <FileText className="w-3 h-3 text-green-500 flex-shrink-0" />
                          )}
                          <span className="truncate flex-1 text-gray-600">{f.name}</span>
                          <span className="text-gray-400 text-[10px]">
                            {f.status === "uploading" ? "Uploading..." : f.status === "processing" ? "Processing..." : `${(f.size / 1024).toFixed(0)}KB`}
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                            aria-label="Remove file"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
