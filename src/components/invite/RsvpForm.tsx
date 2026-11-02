"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import type { InviteData, RsvpStatus } from "@/lib/types";
import { fill, formatDate, type Strings } from "@/lib/i18n";
import { todayInIndia } from "@/lib/calendar";
import Burst from "./Burst";
import { safeStorage, useMounted } from "./hooks";
import { IconCheck, IconHeart, IconMinus, IconPlus, IconRefresh } from "./Icons";

interface RsvpFormProps {
  data: InviteData;
  slug?: string;
  strings: Strings;
  displayFont: string;
  preview?: boolean;
}

interface StoredRsvp {
  name: string;
  phone?: string;
  status: RsvpStatus;
  guests: number;
  eventIds: string[];
  message?: string;
  at: string;
}

const MAX_GUESTS = 20;

const inputCls =
  "w-full min-h-12 rounded-2xl px-4 py-3 text-[16px] outline-none transition placeholder:opacity-60 focus:ring-2";

export default function RsvpForm({ data, slug, strings, displayFont, preview }: RsvpFormProps) {
  const t = strings.ui;
  const mounted = useMounted();
  const storageKey = slug ? `rsvp:${slug}` : null;
  const showEvents = data.mode === "multi" && data.events.length > 1;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<RsvpStatus | null>(null);
  const [guests, setGuests] = useState(1);
  const [eventIds, setEventIds] = useState<string[]>(() => data.events.map((e) => e.id));
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [done, setDone] = useState<StoredRsvp | null>(null);
  const [burst, setBurst] = useState(0);

  // Returning guests see their previous answer.
  useEffect(() => {
    if (preview || !storageKey) return;
    const saved = safeStorage.get<StoredRsvp>(storageKey);
    if (saved && saved.status) {
      setDone(saved);
    }
  }, [preview, storageKey]);

  const closed = mounted && !!data.rsvpDeadline && todayInIndia() > data.rsvpDeadline;
  const subtitle = data.rsvpDeadline
    ? fill(t.rsvpSubtitle, { date: formatDate(data.rsvpDeadline, data.language) })
    : t.rsvpSubtitleNoDeadline;

  const valid = name.trim().length > 0 && status !== null && (status === "no" || !showEvents || eventIds.length > 0);
  const canSubmit = valid && !submitting && !preview && !!slug;

  const respondAgain = () => {
    if (done) {
      setName(done.name);
      setPhone(done.phone ?? "");
      setStatus(done.status);
      setGuests(Math.max(1, done.guests || 1));
      setEventIds(done.eventIds?.length ? done.eventIds : data.events.map((e) => e.id));
      setMessage(done.message ?? "");
    }
    setDone(null);
    setError(false);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !status || !slug) return;
    setSubmitting(true);
    setError(false);
    const body = {
      slug,
      name: name.trim(),
      phone: phone.trim() || undefined,
      status,
      guests: status === "no" ? 0 : guests,
      eventIds: status === "no" ? [] : showEvents ? eventIds : data.events.map((ev) => ev.id),
      message: message.trim() || undefined,
    };
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "rsvp failed");
      const stored: StoredRsvp = {
        name: body.name,
        phone: body.phone,
        status,
        guests: body.guests,
        eventIds: body.eventIds,
        message: body.message,
        at: new Date().toISOString(),
      };
      if (storageKey) safeStorage.set(storageKey, stored);
      setDone(stored);
      if (status !== "no") setBurst((b) => b + 1);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const heading = (
    <div className="mb-5 text-center">
      <h2 className="text-[clamp(2rem,10cqw,2.75rem)] leading-tight" style={{ fontFamily: displayFont, color: "var(--c-accent)" }}>
        {t.rsvpTitle}
      </h2>
      <p className="mt-1 text-sm" style={{ color: "var(--c-muted)" }}>
        {closed ? t.rsvpClosed : subtitle}
      </p>
    </div>
  );

  const statusOptions: { value: RsvpStatus; label: string; emoji: string }[] = [
    { value: "yes", label: t.yes, emoji: "🎉" },
    { value: "maybe", label: t.maybe, emoji: "🤔" },
    { value: "no", label: t.no, emoji: "💌" },
  ];

  return (
    <div className="relative">
      <Burst trigger={burst} colors={["var(--c-accent)", "var(--c-accent2)", "var(--c-scratch)", "#ffffff", "#ffd86b"]} count={50} spread={220} />
      {heading}

      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div
            key="thanks"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="flex flex-col items-center gap-4 py-4 text-center"
            aria-live="polite"
          >
            <motion.span
              className="grid h-16 w-16 place-items-center rounded-full"
              style={{ background: "var(--c-button)", color: "var(--c-button-text)" }}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.1 }}
            >
              {done.status === "no" ? <IconHeart width={28} height={28} /> : <IconCheck width={30} height={30} strokeWidth={2.4} />}
            </motion.span>
            <p className="text-[clamp(1.3rem,6.5cqw,1.6rem)] leading-snug" style={{ fontFamily: displayFont, color: "var(--c-accent)" }}>
              {done.status === "no" ? t.rsvpThanksNo : t.rsvpThanksYes}
            </p>
            <p className="text-sm" style={{ color: "var(--c-muted)" }}>
              {done.name} · {statusOptions.find((o) => o.value === done.status)?.label}
              {done.status !== "no" && done.guests > 0 ? ` · ${t.numberOfGuests}: ${done.guests}` : ""}
            </p>
            {!closed && (
              <button
                type="button"
                onClick={respondAgain}
                className="mt-1 inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold"
                style={{ color: "var(--c-accent)", boxShadow: "inset 0 0 0 1.5px var(--c-accent)" }}
              >
                <IconRefresh width={16} height={16} />
                {t.respondAgain}
              </button>
            )}
          </motion.div>
        ) : closed ? null : (
          <motion.form
            key="form"
            onSubmit={submit}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex flex-col gap-5"
            noValidate
          >
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold">{t.yourName}</span>
              <input
                className={inputCls}
                style={fieldStyle}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                maxLength={100}
                required
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold">{t.phone}</span>
              <input
                className={inputCls}
                style={fieldStyle}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={30}
              />
            </label>

            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-sm font-semibold">{t.attending}</legend>
              <div className="flex flex-col gap-2" role="radiogroup">
                {statusOptions.map((o) => {
                  const active = status === o.value;
                  return (
                    <motion.button
                      key={o.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setStatus(o.value)}
                      whileTap={{ scale: 0.97 }}
                      className="relative flex min-h-12 items-center gap-3 overflow-hidden rounded-full px-5 text-left text-[15px] font-semibold transition-colors"
                      style={{
                        background: active ? "var(--c-button)" : "color-mix(in srgb, var(--c-card) 80%, transparent)",
                        color: active ? "var(--c-button-text)" : "var(--c-text)",
                        boxShadow: active
                          ? "0 10px 24px -12px var(--c-button)"
                          : "inset 0 0 0 1.5px color-mix(in srgb, var(--c-accent) 35%, transparent)",
                      }}
                    >
                      <span aria-hidden className="text-lg">
                        {o.emoji}
                      </span>
                      <span className="flex-1">{o.label}</span>
                      <AnimatePresence>
                        {active && (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                            <IconCheck width={18} height={18} strokeWidth={2.4} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>
            </fieldset>

            <AnimatePresence initial={false}>
              {status && status !== "no" && (
                <motion.div
                  key="extra"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-5 overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold">{t.numberOfGuests}</span>
                    <div className="flex items-center gap-1 rounded-full p-1" style={fieldStyle}>
                      <button
                        type="button"
                        aria-label="−"
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                        disabled={guests <= 1}
                        className="grid h-11 w-11 place-items-center rounded-full transition disabled:opacity-35"
                        style={{ color: "var(--c-accent)" }}
                      >
                        <IconMinus />
                      </button>
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={guests}
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 10, opacity: 0 }}
                          className="w-8 text-center text-lg font-semibold tabular-nums"
                          aria-live="polite"
                        >
                          {guests}
                        </motion.span>
                      </AnimatePresence>
                      <button
                        type="button"
                        aria-label="+"
                        onClick={() => setGuests((g) => Math.min(MAX_GUESTS, g + 1))}
                        disabled={guests >= MAX_GUESTS}
                        className="grid h-11 w-11 place-items-center rounded-full transition disabled:opacity-35"
                        style={{ color: "var(--c-accent)" }}
                      >
                        <IconPlus />
                      </button>
                    </div>
                  </div>

                  {showEvents && (
                    <fieldset className="flex flex-col gap-2">
                      <legend className="mb-2 text-sm font-semibold">{t.whichEvents}</legend>
                      {data.events.map((ev) => {
                        const on = eventIds.includes(ev.id);
                        return (
                          <label
                            key={ev.id}
                            className="flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl px-4 py-2 transition"
                            style={{
                              ...fieldStyle,
                              boxShadow: on ? "inset 0 0 0 1.5px var(--c-accent)" : fieldStyle.boxShadow,
                            }}
                          >
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={on}
                              onChange={() =>
                                setEventIds((ids) => (on ? ids.filter((i) => i !== ev.id) : [...ids, ev.id]))
                              }
                            />
                            <span
                              aria-hidden
                              className="grid h-6 w-6 shrink-0 place-items-center rounded-md transition"
                              style={{
                                background: on ? "var(--c-accent)" : "transparent",
                                color: "var(--c-button-text)",
                                boxShadow: on ? "none" : "inset 0 0 0 1.5px color-mix(in srgb, var(--c-accent) 50%, transparent)",
                              }}
                            >
                              {on && <IconCheck width={16} height={16} strokeWidth={2.6} />}
                            </span>
                            <span className="flex-1 text-[15px] font-medium">{ev.name}</span>
                            {ev.date && (
                              <span className="text-xs" style={{ color: "var(--c-muted)" }}>
                                {formatDate(ev.date, data.language).replace(/,? \d{4}$/, "")}
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </fieldset>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold">{t.messageForHosts}</span>
              <textarea
                className={`${inputCls} min-h-24 resize-none`}
                style={fieldStyle}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                maxLength={1000}
              />
            </label>

            {error && (
              <p role="alert" className="rounded-2xl px-4 py-3 text-sm font-medium" style={{ background: "rgba(220,38,38,.1)", color: "#b91c1c" }}>
                {t.rsvpError}
              </p>
            )}

            <motion.button
              type="submit"
              disabled={!canSubmit}
              whileTap={canSubmit ? { scale: 0.97 } : undefined}
              className="relative min-h-13 overflow-hidden rounded-full px-6 py-3.5 text-base font-semibold shadow-lg transition-opacity disabled:opacity-55"
              style={{ background: "var(--c-button)", color: "var(--c-button-text)" }}
            >
              <span className="relative z-10">{submitting ? t.submitting : t.submit}</span>
              {canSubmit && <span aria-hidden className="rsvp-sheen absolute inset-0" />}
            </motion.button>
            <style>{`
              .rsvp-sheen { background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,.35) 50%, transparent 70%); background-size: 250% 100%; animation: rsvp-sheen 3s ease-in-out infinite; }
              @keyframes rsvp-sheen { 0% { background-position: 120% 0 } 60%, 100% { background-position: -120% 0 } }
            `}</style>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

const fieldStyle = {
  background: "color-mix(in srgb, var(--c-card) 85%, white 15%)",
  color: "var(--c-text)",
  boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--c-accent) 25%, transparent)",
  ["--tw-ring-color" as string]: "color-mix(in srgb, var(--c-accent) 50%, transparent)",
} as CSSProperties;
