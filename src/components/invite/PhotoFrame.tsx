"use client";
import { useState } from "react";

/** Arched portrait with a double accent border and a slowly rotating dotted halo. */
export default function PhotoFrame({ src, alt, animate = true }: { src: string; alt: string; animate?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <div className="relative mx-auto w-[min(62cqw,240px)]" style={{ aspectRatio: "4 / 5" }}>
      {/* halo */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className="pointer-events-none absolute -inset-[9%] h-[118%] w-[118%]"
        style={{ animation: animate ? "invite-spin 40s linear infinite" : undefined }}
      >
        <circle cx="50" cy="50" r="48" fill="none" strokeWidth="0.8" strokeDasharray="0.5 3.2" strokeLinecap="round" style={{ stroke: "var(--c-accent2)" }} />
      </svg>
      {/* outer arch */}
      <div
        className="absolute -inset-2 rounded-t-full rounded-b-3xl"
        style={{ boxShadow: "inset 0 0 0 1.5px var(--c-accent2)" }}
      />
      {/* photo */}
      <div
        className="relative h-full w-full overflow-hidden rounded-t-full rounded-b-2xl"
        style={{
          boxShadow:
            "0 0 0 3px var(--c-card), 0 0 0 4.5px var(--c-accent), 0 24px 50px -20px color-mix(in srgb, var(--c-accent) 70%, transparent)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- user-uploaded remote image, any host */}
        <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" decoding="async" onError={() => setFailed(true)} />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(to top, color-mix(in srgb, var(--c-accent) 25%, transparent), transparent 40%)" }}
        />
      </div>
      <style>{`@keyframes invite-spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
