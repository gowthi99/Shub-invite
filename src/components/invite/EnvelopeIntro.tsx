"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ComponentType, type CSSProperties } from "react";
import type { ThemeArtProps } from "@/themes/types";

interface EnvelopeIntroProps {
  invitedLabel: string; // strings.ui.youAreInvited
  tapLabel: string; // strings.ui.tapToOpen
  names: string;
  initials: string;
  occasionLabel: string;
  displayFont: string;
  bodyFont: string;
  background: string; // palette.bgGradient
  Backdrop: ComponentType<ThemeArtProps>;
  /** Fired synchronously inside the tap (so audio can start within the user gesture). */
  onOpen: () => void;
  /** Fired when the cover starts parting (content underneath may begin animating). */
  onLeave?: () => void;
  /** Fired when the exit animation has finished. */
  onDone: () => void;
}

type Phase = "closed" | "opening" | "leaving";

/**
 * Full-screen themed cover with an envelope. Tap → the flap swings open, the letter rises, then the
 * envelope halves part like doors to reveal the invitation underneath.
 */
export default function EnvelopeIntro({
  invitedLabel,
  tapLabel,
  names,
  initials,
  occasionLabel,
  displayFont,
  bodyFont,
  background,
  Backdrop,
  onOpen,
  onLeave,
  onDone,
}: EnvelopeIntroProps) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("closed");

  // Lock page scroll while the cover is up.
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    if (phase === "opening") {
      const id = setTimeout(() => setPhase("leaving"), reduce ? 150 : 1300);
      return () => clearTimeout(id);
    }
    if (phase === "leaving") {
      onLeave?.();
      const id = setTimeout(onDone, reduce ? 250 : 1080);
      return () => clearTimeout(id);
    }
  }, [phase, reduce, onDone, onLeave]);

  const open = () => {
    if (phase !== "closed") return;
    onOpen();
    setPhase("opening");
  };

  const opening = phase !== "closed";
  const leaving = phase === "leaving";
  const ease = [0.65, 0, 0.35, 1] as const;

  return (
    <motion.div
      className="fixed inset-0 z-[60] overflow-hidden"
      style={{ fontFamily: bodyFont }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: reduce ? 0.2 : 0.6, delay: leaving && !reduce ? 0.45 : 0, ease: "easeOut" }}
    >
      {/* Curtain halves – part sideways when leaving */}
      {(["left", "right"] as const).map((side) => (
        <motion.div
          key={side}
          aria-hidden
          className="absolute inset-y-0 w-1/2 overflow-hidden"
          style={{ [side]: 0 } as CSSProperties}
          animate={leaving && !reduce ? { x: side === "left" ? "-100%" : "100%" } : { x: 0 }}
          transition={{ duration: 0.95, ease }}
        >
          <div className="absolute inset-y-0 w-[200%]" style={{ [side]: 0, background } as CSSProperties}>
            <Backdrop className="absolute inset-0 h-full w-full" />
          </div>
          <div
            className="absolute inset-y-0 w-px"
            style={{ [side === "left" ? "right" : "left"]: 0, background: "color-mix(in srgb, var(--c-accent) 40%, transparent)" } as CSSProperties}
          />
        </motion.div>
      ))}

      {/* soft glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 45% at 50% 45%, color-mix(in srgb, var(--c-accent2) 30%, transparent), transparent 70%)",
        }}
      />

      <button
        type="button"
        onClick={open}
        aria-label={`${invitedLabel} — ${tapLabel}`}
        className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-6 text-center outline-none"
        style={{ color: "var(--c-text)" }}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: leaving ? 0 : 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.35em]" style={{ color: "var(--c-muted)" }}>
            {occasionLabel}
          </span>
          <span className="text-[clamp(2.2rem,11vw,3.5rem)] leading-tight" style={{ fontFamily: displayFont, color: "var(--c-accent)" }}>
            {invitedLabel}
          </span>
        </motion.div>

        {/* Envelope */}
        <motion.div
          className="relative w-[min(78vw,340px)]"
          style={{ aspectRatio: "1.45 / 1", perspective: 900 }}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={
            leaving && !reduce
              ? { opacity: 0, y: 40, scale: 1.08 }
              : opening || reduce
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 1, y: [0, -6, 0], scale: 1 }
          }
          transition={
            opening || reduce
              ? { duration: 0.6, ease: "easeInOut" }
              : { opacity: { duration: 0.8 }, scale: { duration: 0.8 }, y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }
          }
        >
          {/* back */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              background: "color-mix(in srgb, var(--c-accent) 82%, black 18%)",
              boxShadow: "0 30px 60px -25px rgba(0,0,0,.45)",
            }}
          />
          {/* letter */}
          <motion.div
            className="absolute inset-x-[7%] top-[8%] flex h-[84%] flex-col items-center justify-center gap-1 rounded-lg px-3 text-center"
            style={{ background: "var(--c-bg)", boxShadow: "0 4px 16px rgba(0,0,0,.15)", zIndex: 1 }}
            initial={false}
            animate={opening && !reduce ? { y: "-58%" } : { y: "0%" }}
            transition={{ duration: 0.9, delay: opening ? 0.45 : 0, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--c-muted)" }}>
              {occasionLabel}
            </span>
            <span className="line-clamp-2 text-[clamp(1.2rem,6vw,1.7rem)] leading-tight" style={{ fontFamily: displayFont, color: "var(--c-accent)" }}>
              {names}
            </span>
          </motion.div>
          {/* front pocket (two side flaps + bottom flap) */}
          <svg viewBox="0 0 145 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" style={{ zIndex: 2 }} aria-hidden>
            <path d="M0 0 L72.5 56 L0 100 Z" style={{ fill: "color-mix(in srgb, var(--c-accent) 92%, white 8%)" }} />
            <path d="M145 0 L72.5 56 L145 100 Z" style={{ fill: "color-mix(in srgb, var(--c-accent) 92%, white 8%)" }} />
            <path d="M0 100 L72.5 48 L145 100 Z" style={{ fill: "var(--c-accent)" }} />
            <path d="M0 100 L72.5 48 L145 100" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="0.6" />
          </svg>
          {/* top flap */}
          <motion.div
            className="absolute inset-x-0 top-0 h-[58%] origin-top"
            style={{ zIndex: opening ? 0 : 4, transformStyle: "preserve-3d" }}
            initial={false}
            animate={{ rotateX: opening && !reduce ? 180 : 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <svg viewBox="0 0 145 58" preserveAspectRatio="none" className="h-full w-full drop-shadow-md" aria-hidden>
              <path d="M0 0 H145 L72.5 58 Z" style={{ fill: "color-mix(in srgb, var(--c-accent) 88%, black 12%)" }} />
              <path d="M0 0 L72.5 58 L145 0" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="0.6" />
            </svg>
          </motion.div>
          {/* wax seal */}
          <motion.div
            className="absolute left-1/2 top-[58%] grid h-[30%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
            style={{
              aspectRatio: "1",
              zIndex: 5,
              background: "radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--c-accent2) 70%, white 30%), var(--c-accent2) 55%, color-mix(in srgb, var(--c-accent2) 70%, black 30%))",
              boxShadow: "0 4px 10px rgba(0,0,0,.3), inset 0 0 0 3px rgba(255,255,255,.18)",
            }}
            animate={opening ? { scale: 0, opacity: 0, rotate: 45 } : { scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.35 }}
          >
            <span className="text-[clamp(0.95rem,4.5vw,1.3rem)] font-semibold text-white/95" style={{ fontFamily: displayFont }}>
              {initials}
            </span>
          </motion.div>
        </motion.div>

        <motion.span
          className="flex min-h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold uppercase tracking-[0.25em]"
          style={{ background: "var(--c-button)", color: "var(--c-button-text)", boxShadow: "0 12px 30px -12px var(--c-button)" }}
          animate={opening ? { opacity: 0, y: 10 } : reduce ? { opacity: 1 } : { opacity: [0.75, 1, 0.75], scale: [1, 1.05, 1] }}
          transition={opening ? { duration: 0.3 } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {tapLabel}
        </motion.span>
      </button>
    </motion.div>
  );
}
