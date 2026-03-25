import { NextRequest } from "next/server";
import { json, error } from "@/lib/api";

// POST /api/upload — upload a file via Vercel Blob
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) return error("No file provided");

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!blobToken) {
    // Fallback: just return the file name without storing
    return json({
      url: null,
      filename: file.name,
      size: file.size,
      message: "File storage not configured. File metadata saved.",
    });
  }

  try {
    const { put } = await import("@vercel/blob");
    const blob = await put(file.name, file, {
      access: "public",
      token: blobToken,
    });
    return json({ url: blob.url, filename: file.name, size: file.size });
  } catch (e) {
    console.error("Upload error:", e);
    return error("Upload failed", 500);
  }
}
