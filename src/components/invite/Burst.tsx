"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

interface BurstProps {
  colors: string[];
  /** Change this value to fire a new burst. 0 = nothing. */
  trigger: number;
  count?: number;
  /** Spread radius in px. */
  spread?: number;
}

// Deterministic pseudo-random so the particle set is stable per trigger.
function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

/** Confetti + sparkle burst radiating from the centre of its (relative) parent. */
export default function Burst({ colors, trigger, count = 42, spread = 190 }: BurstProps) {
  const reduce = useReducedMotion();
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const s = trigger * 1000 + i;
        const angle = (i / count) * Math.PI * 2 + rand(s) * 0.6;
        const dist = spread * (0.45 + rand(s + 1) * 0.7);
        const kind = i % 3; // 0 strip, 1 dot, 2 sparkle
        return {
          id: i,
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 30,
          fall: 60 + rand(s + 2) * 90,
          rot: (rand(s + 3) - 0.5) * 720,
          color: colors[i % colors.length],
          kind,
          size: kind === 1 ? 6 + rand(s + 4) * 5 : kind === 0 ? 5 : 12,
          delay: rand(s + 5) * 0.12,
        };
      }),
    [trigger, count, spread, colors],
  );

  if (!trigger || reduce) return null;

  return (
    <div key={trigger} aria-hidden className="pointer-events-none absolute inset-0 z-30 overflow-visible">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute left-1/2 top-1/2 block"
          style={{
            width: p.kind === 0 ? p.size : p.size,
            height: p.kind === 0 ? p.size * 2.4 : p.size,
            marginLeft: -p.size / 2,
            marginTop: -p.size / 2,
            background: p.kind === 2 ? "transparent" : p.color,
            borderRadius: p.kind === 1 ? "999px" : "2px",
            color: p.color,
          }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.4 }}
          animate={{
            x: p.x,
            y: [0, p.y, p.y + p.fall],
            opacity: [1, 1, 0],
            rotate: p.rot,
            scale: [0.4, 1, 0.8],
          }}
          transition={{ duration: 1.6, delay: p.delay, ease: [0.16, 1, 0.3, 1], times: [0, 0.45, 1] }}
        >
          {p.kind === 2 && (
            <svg viewBox="0 0 24 24" width={p.size} height={p.size} fill="currentColor">
              <path d="M12 0c.8 6.4 4.8 10.6 12 12-7.2 1.4-11.2 5.6-12 12-.8-6.4-4.8-10.6-12-12C7.2 10.6 11.2 6.4 12 0Z" />
            </svg>
          )}
        </motion.span>
      ))}
    </div>
  );
}
