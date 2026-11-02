"use client";

import { useEffect, useRef } from "react";

interface Props {
  open: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  busy?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Accessible modal confirm built on the native <dialog> element. */
export function ConfirmDialog({ open, title, body, confirmLabel = "Delete", busy, error, onConfirm, onCancel }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onCancel();
      }}
      onClick={(e) => {
        if (e.target === ref.current && !busy) onCancel();
      }}
      className="m-auto w-[min(92vw,26rem)] rounded-3xl border border-gold/30 bg-white p-0 text-brand-dark shadow-2xl backdrop:bg-brand-dark/40 backdrop:backdrop-blur-sm"
    >
      <div className="p-6">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red-50 text-2xl" aria-hidden>
          🗑️
        </div>
        <h2 className="mt-3 text-center font-display text-xl font-bold">{title}</h2>
        <p className="mt-2 text-center text-sm text-brand-dark/65">{body}</p>
        {error && (
          <p role="alert" className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-center text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-2xl border border-brand/15 px-4 py-3 font-semibold text-brand-dark transition hover:bg-cream disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="rounded-2xl bg-red-600 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-red-700 disabled:opacity-60"
          >
            {busy ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
