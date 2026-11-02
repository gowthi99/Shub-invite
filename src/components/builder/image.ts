/** Client-side resize + JPEG compress. Max edge 1600px, quality ~0.85. */
export async function compressImage(file: File, maxEdge = 1600, quality = 0.85): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("Couldn't read that image. Try a JPG or PNG."));
      i.src = url;
    });
    const ratio = Math.min(1, maxEdge / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.max(1, Math.round(img.naturalWidth * ratio));
    const h = Math.max(1, Math.round(img.naturalHeight * ratio));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser couldn't process the image.");
    ctx.fillStyle = "#fff"; // flatten transparent PNGs
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (!blob) throw new Error("Couldn't compress the image.");
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** POST multipart `file` to /api/upload → { url } | { error }. */
export async function uploadImage(file: File): Promise<string> {
  const blob = await compressImage(file);
  const fd = new FormData();
  const base = file.name.replace(/\.[^.]+$/, "") || "photo";
  fd.append("file", blob, `${base}.jpg`);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  let json: { url?: string; error?: string } = {};
  try {
    json = await res.json();
  } catch {
    /* non-JSON */
  }
  if (!res.ok || !json.url) throw new Error(json.error || "Upload failed. Please try again.");
  return json.url;
}
