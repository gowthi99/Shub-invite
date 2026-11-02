import { get } from "@vercel/blob";
import { blobToken, PHOTO_PREFIX } from "@/lib/upload";

export const runtime = "nodejs";

/** Streams a photo from a private Blob store. Names carry random suffixes, so they're unguessable. */
export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const pathname = path.join("/");
  const token = blobToken();
  if (!token || !pathname.startsWith(PHOTO_PREFIX) || pathname.includes("..")) {
    return new Response("Not found", { status: 404 });
  }

  const res = await get(pathname, { access: "private", token }).catch(() => null);
  if (!res || res.statusCode !== 200) return new Response("Not found", { status: 404 });

  return new Response(res.stream, {
    headers: {
      "Content-Type": res.blob.contentType,
      // Uploaded files never change (each upload gets a new name), so cache hard.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
