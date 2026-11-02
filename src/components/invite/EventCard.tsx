"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { InviteEvent, Language } from "@/lib/types";
import { formatDate, formatTime, type Strings } from "@/lib/i18n";
import { directionsUrl } from "@/lib/maps";
import { buildIcs, downloadIcs, googleCalendarUrl, icsFileName, toCalendarItem } from "@/lib/calendar";
import { IconCalendar, IconClock, IconDownload, IconGoogle, IconNote, IconPin, IconShirt } from "./Icons";

interface EventCardProps {
  event: InviteEvent;
  index: number;
  total: number;
  lang: Language;
  strings: Strings;
  displayFont: string;
  /** Calendar entry title, e.g. "Haldi — Priya & Arjun". */
  calendarTitle: string;
  calendarDescription?: string;
  /** Hide the date (scratch card not yet revealed). */
  hideDate?: boolean;
  preview?: boolean;
}

function Row({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0" style={{ color: "var(--c-accent)" }}>
        {icon}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export default function EventCard({
  event,
  index,
  total,
  lang,
  strings,
  displayFont,
  calendarTitle,
  calendarDescription,
  hideDate,
  preview,
}: EventCardProps) {
  const t = strings.ui;
  const [calOpen, setCalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!calOpen) return;
    const close = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setCalOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setCalOpen(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [calOpen]);

  const directions = directionsUrl(event);
  const time = event.time
    ? `${formatTime(event.time, lang)}${event.endTime ? ` – ${formatTime(event.endTime, lang)}` : ""}`
    : "";

  const calItem = () =>
    toCalendarItem(event, {
      title: calendarTitle,
      description: calendarDescription,
      url: typeof window !== "undefined" ? window.location.href : undefined,
    });

  const multi = total > 1;
  const inert = preview ? { tabIndex: -1, "aria-disabled": true } : {};

  return (
    <article
      className="relative overflow-visible rounded-3xl p-5 backdrop-blur-md"
      style={{
        background: "var(--c-card)",
        boxShadow: "0 18px 40px -24px color-mix(in srgb, var(--c-accent) 60%, transparent), inset 0 0 0 1px color-mix(in srgb, var(--c-accent) 20%, transparent)",
      }}
    >
      {multi && (
        <span
          className="absolute -top-3 left-5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
          style={{ background: "var(--c-accent)", color: "var(--c-button-text)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      )}

      <h3 className="mb-4 pt-1 text-[clamp(1.5rem,7.5cqw,2rem)] leading-tight" style={{ fontFamily: displayFont, color: "var(--c-accent)" }}>
        {event.name}
      </h3>

      <div className="flex flex-col gap-3 text-[15px] leading-snug">
        {event.date && (
          <Row icon={<IconCalendar />}>
            {hideDate ? (
              <span
                className="inline-block rounded-md px-2 py-0.5 text-sm tracking-[0.3em]"
                style={{ background: "color-mix(in srgb, var(--c-scratch) 35%, transparent)", color: "var(--c-muted)" }}
                aria-label={t.scratchToReveal}
              >
                ✦ ✦ ✦ ✦
              </span>
            ) : (
              <span className="font-medium">{formatDate(event.date, lang)}</span>
            )}
          </Row>
        )}
        {time && (
          <Row icon={<IconClock />}>
            <span>{time}</span>
          </Row>
        )}
        {(event.venue || event.address) && (
          <Row icon={<IconPin />}>
            {event.venue && <p className="font-semibold">{event.venue}</p>}
            {event.address && (
              <p className="mt-0.5 text-sm" style={{ color: "var(--c-muted)" }}>
                {event.address}
              </p>
            )}
          </Row>
        )}
        {event.dressCode && (
          <Row icon={<IconShirt />}>
            <span className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--c-muted)" }}>
              {t.dressCode}
            </span>
            <p>{event.dressCode}</p>
          </Row>
        )}
        {event.notes && (
          <Row icon={<IconNote />}>
            <p className="whitespace-pre-line" style={{ color: "var(--c-muted)" }}>
              {event.notes}
            </p>
          </Row>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5">
        {directions ? (
          <a
            href={directions}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold transition active:scale-[0.97]"
            style={{
              background: "var(--c-button)",
              color: "var(--c-button-text)",
              pointerEvents: preview ? "none" : undefined,
            }}
            {...inert}
          >
            <IconPin width={18} height={18} />
            <span className="truncate">{t.getDirections}</span>
          </a>
        ) : (
          <span />
        )}
        {event.date && !hideDate ? (
          <div ref={menuRef} className="relative">
            <button
              type="button"
              disabled={preview}
              onClick={() => setCalOpen((o) => !o)}
              aria-expanded={calOpen}
              aria-haspopup="menu"
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold transition active:scale-[0.97] disabled:cursor-default"
              style={{
                color: "var(--c-accent)",
                boxShadow: "inset 0 0 0 1.5px var(--c-accent)",
                background: "color-mix(in srgb, var(--c-card) 60%, transparent)",
              }}
            >
              <IconCalendar width={18} height={18} />
              <span className="truncate">{t.addToCalendar}</span>
            </button>
            <AnimatePresence>
              {calOpen && (
                <motion.div
                  role="menu"
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className="absolute bottom-[calc(100%+8px)] right-0 z-20 w-56 overflow-hidden rounded-2xl p-1.5 shadow-xl backdrop-blur-xl"
                  style={{ background: "var(--c-bg)", color: "var(--c-text)", boxShadow: "0 20px 40px -12px rgba(0,0,0,.35), inset 0 0 0 1px color-mix(in srgb, var(--c-accent) 25%, transparent)" }}
                >
                  <a
                    role="menuitem"
                    href={googleCalendarUrl(calItem())}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setCalOpen(false)}
                    className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium hover:bg-black/5"
                  >
                    <IconGoogle width={18} height={18} style={{ color: "var(--c-accent)" }} />
                    Google Calendar
                  </a>
                  <button
                    role="menuitem"
                    type="button"
                    onClick={() => {
                      downloadIcs(icsFileName(`${event.name} ${calendarTitle}`), buildIcs([calItem()]));
                      setCalOpen(false);
                    }}
                    className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium hover:bg-black/5"
                  >
                    <IconDownload width={18} height={18} style={{ color: "var(--c-accent)" }} />
                    Apple / Outlook (.ics)
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : null}
      </div>
    </article>
  );
}
