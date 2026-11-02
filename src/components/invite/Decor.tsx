"use client";
import type { ReactNode } from "react";

/** Ornamental divider (line – diamond – line) in the theme accent colours. */
export function Divider({ small = false }: { small?: boolean }) {
  return (
    <div aria-hidden className={`mx-auto flex items-center justify-center gap-2 ${small ? "w-32" : "w-56 max-w-full"}`}>
      <span className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, var(--c-accent2))" }} />
      <svg width={small ? 12 : 18} height={small ? 12 : 18} viewBox="0 0 24 24" aria-hidden>
        <path d="M12 2 15 9 22 12 15 15 12 22 9 15 2 12 9 9Z" style={{ fill: "var(--c-accent2)" }} />
        <circle cx="12" cy="12" r="2.2" style={{ fill: "var(--c-accent)" }} />
      </svg>
      <span className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, var(--c-accent2))" }} />
    </div>
  );
}

export function SectionTitle({ children, font }: { children: ReactNode; font: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <h2 className="text-[clamp(1.9rem,9.5cqw,2.6rem)] leading-tight" style={{ fontFamily: font, color: "var(--c-accent)" }}>
        {children}
      </h2>
      <Divider small />
    </div>
  );
}

/**
 * Soft drifting colour glows behind everything. Keeps the page lively even when a theme's Backdrop
 * is minimal. CSS-only (transform/opacity) for smooth 60fps; disabled under reduced motion by globals.css.
 */
export function Aura({ animate = true }: { animate?: boolean }) {
  return (
    <>
      <div
        className="invite-aura absolute -left-1/4 -top-1/4 h-[70%] w-[90%] rounded-full opacity-50 blur-3xl"
        style={{
          background: "radial-gradient(closest-side, color-mix(in srgb, var(--c-accent2) 55%, transparent), transparent)",
          animation: animate ? "invite-drift-a 18s ease-in-out infinite alternate" : undefined,
        }}
      />
      <div
        className="invite-aura absolute -bottom-1/4 -right-1/4 h-[70%] w-[90%] rounded-full opacity-40 blur-3xl"
        style={{
          background: "radial-gradient(closest-side, color-mix(in srgb, var(--c-accent) 45%, transparent), transparent)",
          animation: animate ? "invite-drift-b 22s ease-in-out infinite alternate" : undefined,
        }}
      />
      <style>{`
        @keyframes invite-drift-a { from { transform: translate3d(0,0,0) scale(1) } to { transform: translate3d(12%,10%,0) scale(1.15) } }
        @keyframes invite-drift-b { from { transform: translate3d(0,0,0) scale(1.1) } to { transform: translate3d(-10%,-12%,0) scale(0.95) } }
      `}</style>
    </>
  );
}
