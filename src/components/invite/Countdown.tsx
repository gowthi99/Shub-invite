"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Strings } from "@/lib/i18n";
import { istToEpoch, todayInIndia } from "@/lib/calendar";
import { useMounted, useNow } from "./hooks";

interface CountdownProps {
  date: string; // YYYY-MM-DD (first event)
  time: string; // HH:mm or ""
  /** Last event's date, so multi-day celebrations count as "today" until they're over. */
  lastDate?: string;
  strings: Strings;
  displayFont: string;
  /** Static (no ticking) – builder preview. */
  frozen?: boolean;
}

function Digit({ value, label }: { value: number; label: string }) {
  const reduce = useReducedMotion();
  const text = String(value).padStart(2, "0");
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
      <div
        className="relative flex h-[clamp(3.5rem,17cqw,4.75rem)] w-full items-center justify-center overflow-hidden rounded-2xl"
        style={{
          background: "var(--c-card)",
          boxShadow: "0 8px 24px -12px color-mix(in srgb, var(--c-accent) 55%, transparent), inset 0 0 0 1px color-mix(in srgb, var(--c-accent) 25%, transparent)",
        }}
      >
        {/* fold line */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 h-px"
          style={{ background: "color-mix(in srgb, var(--c-accent) 18%, transparent)" }}
        />
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            className="block text-[clamp(1.6rem,8.5cqw,2.25rem)] font-semibold tabular-nums leading-none"
            style={{ color: "var(--c-accent)" }}
            initial={reduce ? { opacity: 0 } : { y: "-70%", opacity: 0, rotateX: 70 }}
            animate={{ y: "0%", opacity: 1, rotateX: 0 }}
            exit={reduce ? { opacity: 0 } : { y: "70%", opacity: 0, rotateX: -70 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[11px] font-medium uppercase tracking-[0.14em]" style={{ color: "var(--c-muted)" }}>
        {label}
      </span>
    </div>
  );
}

export default function Countdown({ date, time, lastDate, strings, displayFont, frozen }: CountdownProps) {
  const mounted = useMounted();
  const now = useNow(frozen ? null : 1000);
  const t = strings.ui;

  const title = (
    <h2 className="text-center text-[clamp(1.6rem,8cqw,2.1rem)] leading-tight" style={{ fontFamily: displayFont, color: "var(--c-accent)" }}>
      {t.countdownTitle}
    </h2>
  );

  if (!date) return null;

  // Placeholder until mounted to keep SSR and client markup identical.
  if (!mounted) {
    return (
      <div className="flex flex-col gap-4" aria-hidden>
        {title}
        <div className="flex gap-2.5">
          {[t.days, t.hours, t.minutes, t.seconds].map((l) => (
            <div key={l} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="h-[clamp(3.5rem,17cqw,4.75rem)] w-full rounded-2xl" style={{ background: "var(--c-card)" }} />
              <span className="text-[11px] uppercase tracking-[0.14em]" style={{ color: "var(--c-muted)" }}>
                {l}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const target = istToEpoch(date, time || "00:00");
  const diff = target - now;
  const today = todayInIndia(now);
  const isToday = today >= date && today <= (lastDate && lastDate > date ? lastDate : date);

  if (diff <= 0) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <motion.p
          className="text-[clamp(1.8rem,9cqw,2.4rem)] leading-tight"
          style={{ fontFamily: displayFont, color: "var(--c-accent)" }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {isToday ? t.itsToday : t.eventOver}
        </motion.p>
      </div>
    );
  }

  const s = Math.floor(diff / 1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;

  return (
    <div className="flex flex-col gap-4">
      {title}
      {isToday && (
        <p className="text-center text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--c-accent2)" }}>
          {t.itsToday}
        </p>
      )}
      <div className="flex gap-2.5" role="timer" aria-live="off" style={{ perspective: 400 }}>
        <Digit value={days} label={t.days} />
        <Digit value={hours} label={t.hours} />
        <Digit value={minutes} label={t.minutes} />
        <Digit value={seconds} label={t.seconds} />
      </div>
    </div>
  );
}
