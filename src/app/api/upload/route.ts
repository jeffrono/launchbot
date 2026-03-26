import { NextRequest } from "next/server";
import { json, error } from "@/lib/api";

// POST /api/upload — upload a file via Vercel Blob + extract text content
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) return error("No file provided");

  let url: string | null = null;
  let textContent: string | null = null;

  // Upload to Vercel Blob
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (blobToken) {
    try {
      const { put } = await import("@vercel/blob");
      const blob = await put(file.name, file, {
        access: "public",
        token: blobToken,
      });
      url = blob.url;
    } catch (e) {
      console.error("Upload error:", e);
    }
  }

  // Extract text content from the file for LLM processing
  try {
    const ext = file.name.toLowerCase().split(".").pop() || "";
    const textTypes = ["csv", "txt", "json", "md", "tsv", "xml", "html", "htm"];
    const isImage = ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext);

    if (textTypes.includes(ext)) {
      textContent = await file.text();
      // Truncate very long files
      if (textContent.length > 20000) {
        textContent = textContent.slice(0, 20000) + "\n\n[... truncated, " + textContent.length + " total characters]";
      }
    } else if (ext === "pdf") {
      // For PDFs, we can't extract text server-side easily without a library
      // but the URL will be passed to Claude which can read it if it's an image-based message
      textContent = null;
    } else if (isImage) {
      // Images will be handled via vision — pass the URL
      textContent = null;
    }
  } catch (e) {
    console.error("Text extraction error:", e);
  }

  return json({
    url,
    filename: file.name,
    size: file.size,
    textContent,
    isImage: ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(
      (file.name.toLowerCase().split(".").pop() || "")
    ),
  });
}
