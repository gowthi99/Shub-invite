import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export class UploadError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

/** Checks the file signature so a renamed non-image can't slip through on its MIME type alone. */
function sniff(buf: Buffer): string | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.length >= 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
    return "image/png";
  if (buf.length >= 6 && /^GIF8[79]a$/.test(buf.subarray(0, 6).toString("latin1"))) return "image/gif";
  if (buf.length >= 12 && buf.subarray(0, 4).toString("latin1") === "RIFF" && buf.subarray(8, 12).toString("latin1") === "WEBP")
    return "image/webp";
  return null;
}

/**
 * Stores an uploaded image and returns its public URL.
 * - With BLOB_READ_WRITE_TOKEN: Vercel Blob (public, random suffix).
 * - Without (local dev): public/uploads/<random>.<ext>, served at /uploads/<file>.
 */
export async function saveUpload(file: File): Promise<string> {
  if (!EXT[file.type]) throw new UploadError("Only JPG, PNG, WebP or GIF images are allowed", 415);
  if (file.size === 0) throw new UploadError("The file is empty", 400);
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadError("Image must be 5 MB or smaller", 413);

  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length > MAX_UPLOAD_BYTES) throw new UploadError("Image must be 5 MB or smaller", 413);
  const actual = sniff(buf);
  if (!actual) throw new UploadError("That file doesn't look like a valid image", 415);

  const ext = EXT[actual];
  const name = `${randomBytes(12).toString("hex")}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`invites/${name}`, buf, {
      access: "public",
      addRandomSuffix: true,
      contentType: actual,
    });
    return blob.url;
  }

  if (process.env.VERCEL) {
    // The deployed filesystem is read-only; a Blob store is required in production.
    throw new UploadError("Uploads are not configured (add a Vercel Blob store)", 503);
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), buf);
  return `/uploads/${name}`;
}
