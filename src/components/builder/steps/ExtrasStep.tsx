"use client";
import { useRef, useState } from "react";
import type { InviteData } from "@/lib/types";
import { uploadImage } from "../image";
import { SectionCard, TextField, Toggle } from "../ui";

export default function ExtrasStep({
  data,
  update,
  errors,
  onUploadingChange,
}: {
  data: InviteData;
  update: (p: Partial<InviteData>) => void;
  errors: Record<string, string>;
  onUploadingChange?: (busy: boolean) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const onFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file.");
      return;
    }
    setUploadError("");
    setUploading(true);
    onUploadingChange?.(true);
    try {
      const url = await uploadImage(file);
      update({ photoUrl: url });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const today = new Date().toISOString().slice(0, 10);
  const firstDate = data.events.map((e) => e.date).filter(Boolean).sort()[0];

  return (
    <div className="space-y-5">
      <SectionCard title="Photo">
        <p className="-mt-2 text-sm text-stone-500">Optional — a favourite photo makes the invitation feel personal.</p>
        <input
          ref={fileRef}
          id="photo-input"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        {data.photoUrl ? (
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.photoUrl} alt="Uploaded photo" className="size-28 rounded-2xl object-cover shadow-md ring-4 ring-white" />
            <div className="flex flex-col gap-2">
              <label
                htmlFor="photo-input"
                className="cursor-pointer rounded-full border border-stone-300 bg-white px-4 py-2.5 text-center text-sm font-medium text-stone-800 hover:border-brand"
              >
                {uploading ? "Uploading…" : "Replace"}
              </label>
              <button
                type="button"
                onClick={() => update({ photoUrl: "" })}
                className="rounded-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <label
            htmlFor="photo-input"
            className={`flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gold/60 bg-cream/60 p-6 text-center transition hover:border-brand ${
              uploading ? "pointer-events-none opacity-70" : ""
            }`}
          >
            {uploading ? (
              <>
                <span aria-hidden className="size-8 animate-spin rounded-full border-4 border-brand/20 border-t-brand" />
                <span className="font-medium text-stone-700">Uploading your photo…</span>
              </>
            ) : (
              <>
                <span aria-hidden className="text-4xl">📷</span>
                <span className="font-medium text-stone-800">Add a photo</span>
                <span className="text-xs text-stone-500">JPG, PNG or HEIC · we&apos;ll resize it for fast loading</span>
              </>
            )}
          </label>
        )}
        {(uploadError || errors.photoUrl) && (
          <p role="alert" className="text-sm text-red-600">
            {uploadError || errors.photoUrl}
          </p>
        )}
      </SectionCard>

      <SectionCard title="Guest experience">
        <Toggle
          icon="✨"
          label="Scratch to reveal the date"
          description="Guests scratch a golden card to discover the date."
          checked={data.scratchReveal}
          onChange={(v) => update({ scratchReveal: v })}
        />
        <Toggle
          icon="💌"
          label="Collect RSVPs"
          description="Guests can reply yes / no / maybe with headcount."
          checked={data.rsvpEnabled}
          onChange={(v) => update({ rsvpEnabled: v })}
        />
        {data.rsvpEnabled && (
          <div className="pl-2 sm:pl-15">
            <TextField
              label="RSVP deadline"
              optional
              type="date"
              min={today}
              max={firstDate}
              value={data.rsvpDeadline}
              onChange={(v) => update({ rsvpDeadline: v })}
              error={errors.rsvpDeadline}
              hint="Leave blank to accept replies any time."
            />
          </div>
        )}
        <Toggle
          icon="🎵"
          label="Background music"
          description="A gentle tune guests can switch on."
          checked={!!data.musicEnabled}
          onChange={(v) => update({ musicEnabled: v })}
        />
      </SectionCard>
    </div>
  );
}
