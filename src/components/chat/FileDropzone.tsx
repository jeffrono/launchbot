"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/cn";

interface FileDropzoneProps {
  label: string;
  acceptedTypes?: string[];
  onUpload: (files: File[]) => void;
}

export function FileDropzone({ label, acceptedTypes, onUpload }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...droppedFiles]);
      onUpload(droppedFiles);
    },
    [onUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = Array.from(e.target.files || []);
      setFiles((prev) => [...prev, ...selected]);
      onUpload(selected);
    },
    [onUpload]
  );

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mr-auto w-full max-w-[80%]"
    >
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer",
          isDragging
            ? "border-blue-400 bg-blue-50"
            : "border-gray-200 bg-white hover:border-gray-300"
        )}
      >
        <label className="cursor-pointer">
          <Upload
            className={cn(
              "w-8 h-8 mx-auto mb-2",
              isDragging ? "text-blue-500" : "text-gray-400"
            )}
          />
          <p className="text-sm font-medium text-gray-700">{label}</p>
          <p className="text-xs text-gray-400 mt-1">
            Drag & drop or click to browse
          </p>
          {acceptedTypes && (
            <p className="text-xs text-gray-400 mt-0.5">
              Accepts: {acceptedTypes.join(", ")}
            </p>
          )}
          <input
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            multiple
            accept={acceptedTypes?.join(",")}
          />
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-2 space-y-1">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 text-sm"
            >
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700 flex-1 truncate">{file.name}</span>
              <span className="text-gray-400 text-xs">
                {(file.size / 1024).toFixed(0)}KB
              </span>
              <button onClick={() => removeFile(i)} className="text-gray-400 hover:text-red-500">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
