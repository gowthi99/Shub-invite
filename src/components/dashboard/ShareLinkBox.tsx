"use client";

import { useState, useSyncExternalStore } from "react";
import { copyText, useShareUrl, whatsappShareHref } from "./useShareUrl";

const subscribeNoop = () => () => {};

export function ShareLinkBox({ slug, title }: { slug: string; title?: string }) {
  const url = useShareUrl(slug);
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (await copyText(url)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title: title || "You're invited!", url });
    } catch {
      /* cancelled */
    }
  }

  const canNativeShare = useSyncExternalStore(
    subscribeNoop,
    () => typeof navigator.share === "function",
    () => false,
  );

  return (
    <section aria-labelledby="share-link" className="rounded-3xl border border-gold/30 bg-white/85 p-5 shadow-sm">
      <h2 id="share-link" className="flex items-center gap-2 font-semibold text-brand-dark">
        <span aria-hidden>🔗</span> Share your invitation
      </h2>
      <div className="mt-3 flex items-stretch gap-2">
        <input
          readOnly
          value={url}
          aria-label="Invitation link"
          onFocus={(e) => e.currentTarget.select()}
          className="min-w-0 flex-1 rounded-2xl border border-brand/15 bg-cream/60 px-4 py-3 text-sm text-brand-dark outline-none focus:border-brand"
        />
        <button
          type="button"
          onClick={copy}
          className="shrink-0 rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
          aria-live="polite"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={whatsappShareHref(url, title)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-2xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
        >
          <WhatsAppIcon /> Share on WhatsApp
        </a>
        <a
          href={`/i/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-brand-dark ring-1 ring-brand/20 transition hover:bg-cream"
        >
          Open invitation ↗
        </a>
        {canNativeShare && (
          <button
            type="button"
            onClick={nativeShare}
            className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-brand-dark ring-1 ring-brand/20 transition hover:bg-cream"
          >
            More…
          </button>
        )}
      </div>
    </section>
  );
}

export function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.44 9.45-9.44 2.52 0 4.9.99 6.68 2.77a9.37 9.37 0 0 1 2.76 6.68c0 5.21-4.24 9.44-9.45 9.44m8.04-17.48A11.3 11.3 0 0 0 12.04.7C5.77.7.66 5.8.66 12.08c0 2 .52 3.96 1.52 5.69L.57 23.7l6.06-1.59a11.4 11.4 0 0 0 5.42 1.38h.01c6.27 0 11.38-5.1 11.38-11.38 0-3.04-1.18-5.9-3.33-8.05" />
    </svg>
  );
}
