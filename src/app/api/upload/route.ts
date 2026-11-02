import { NextResponse } from "next/server";
import { saveUpload, UploadError, MAX_UPLOAD_BYTES } from "@/lib/upload";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, jsonError, safe } from "../_lib/http";

export const runtime = "nodejs";

export const POST = safe(async (req: Request) => {
  const len = Number(req.headers.get("content-length") || 0);
  if (len > MAX_UPLOAD_BYTES + 64 * 1024) return jsonError("Image must be 5 MB or smaller", 413);

  if (!rateLimit(`upload:${clientIp(req)}`, 20, 60_000)) {
    return jsonError("Too many uploads. Please wait a minute and try again.", 429);
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return jsonError("Expected a multipart form upload", 400);
  }
  const file = form.get("file");
  if (!file || typeof file === "string") return jsonError("No file uploaded", 400);

  try {
    const url = await saveUpload(file);
    return NextResponse.json({ url });
  } catch (err) {
    if (err instanceof UploadError) return jsonError(err.message, err.status);
    throw err;
  }
});
