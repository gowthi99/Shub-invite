"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** Absolute URL of the public invite page. Falls back to the relative path during SSR. */
export function useShareUrl(slug: string) {
  const origin = useSyncExternalStore(
    noop,
    () => window.location.origin,
    () => "",
  );
  return `${origin}/i/${slug}`;
}

export function whatsappShareHref(url: string, title?: string) {
  const text = `${title ? `${title}\n` : ""}You're invited! 💌 Open your invitation: ${url}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}
