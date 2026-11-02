"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Strings } from "@/lib/i18n";
import { IconPhone, IconShare, IconWhatsapp } from "./Icons";

interface ShareBarProps {
  contactPhone?: string;
  strings: Strings;
  shareTitle: string;
  shareText: string;
  preview?: boolean;
}

/** Digits for wa.me; bare 10-digit Indian mobiles get the 91 country code. */
export function whatsappDigits(phone: string) {
  let d = phone.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  if (d.length === 10) d = `91${d}`;
  return d;
}

export default function ShareBar({ contactPhone, strings, shareTitle, shareText, preview }: ShareBarProps) {
  const t = strings.ui;
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(false), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  const phone = contactPhone?.trim();
  const tel = phone ? phone.replace(/[^\d+]/g, "") : "";
  const wa = phone ? whatsappDigits(phone) : "";

  const share = async () => {
    if (preview) return;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url });
        return;
      } catch (e) {
        if ((e as Error)?.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* ignore */
      }
      ta.remove();
    }
    setToast(true);
  };

  const inertStyle = preview ? { pointerEvents: "none" as const } : undefined;
  const inert = preview ? { tabIndex: -1, "aria-disabled": true } : {};

  const pill =
    "flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition active:scale-[0.97]";

  return (
    <div className="relative flex flex-col gap-3">
      {phone && (
        <div className="flex gap-2.5">
          <a
            href={`tel:${tel}`}
            className={pill}
            style={{ color: "var(--c-accent)", boxShadow: "inset 0 0 0 1.5px var(--c-accent)", background: "var(--c-card)", ...inertStyle }}
            {...inert}
          >
            <IconPhone width={18} height={18} />
            {t.callHost}
          </a>
          {wa.length >= 8 && (
            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className={pill}
              style={{ background: "#25D366", color: "#fff", ...inertStyle }}
              {...inert}
            >
              <IconWhatsapp width={18} height={18} />
              {t.whatsappHost}
            </a>
          )}
        </div>
      )}
      <button
        type="button"
        onClick={share}
        disabled={preview}
        className={`${pill} disabled:cursor-default`}
        style={{ background: "var(--c-button)", color: "var(--c-button-text)", boxShadow: "0 12px 28px -14px var(--c-button)" }}
      >
        <IconShare width={18} height={18} />
        {t.share}
      </button>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-3 text-sm font-semibold shadow-xl"
            style={{ background: "var(--c-text)", color: "var(--c-bg)" }}
          >
            {t.copied}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
