"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Burst from "./Burst";

interface ScratchCardProps {
  /** Content hidden under the foil. */
  children: ReactNode;
  coverColor: string; // palette.scratch
  accent: string;
  accent2: string;
  hint: string; // strings.ui.scratchToReveal
  /** Builder preview: static, non-interactive foil cover. */
  preview?: boolean;
  onReveal?: () => void;
  className?: string;
}

const BRUSH = 22; // radius in CSS px
const THRESHOLD = 0.5;

export default function ScratchCard({
  children,
  coverColor,
  accent,
  accent2,
  hint,
  preview,
  onReveal,
  className = "",
}: ScratchCardProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const moves = useRef(0);
  const revealedRef = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const [touched, setTouched] = useState(false);
  const [burst, setBurst] = useState(0);
  const [painted, setPainted] = useState(false);

  // Paint the foil, sized to the container (and re-painted on resize until revealed).
  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap || revealedRef.current) return;
    const { width, height } = wrap.getBoundingClientRect();
    if (!width || !height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = coverColor;
    ctx.fillRect(0, 0, width, height);
    // metallic sheen
    const sheen = ctx.createLinearGradient(0, 0, width, height);
    sheen.addColorStop(0, "rgba(255,255,255,0.45)");
    sheen.addColorStop(0.35, "rgba(255,255,255,0.05)");
    sheen.addColorStop(0.5, "rgba(255,255,255,0.4)");
    sheen.addColorStop(0.65, "rgba(0,0,0,0.08)");
    sheen.addColorStop(1, "rgba(0,0,0,0.22)");
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, width, height);
    // brushed-foil streaks
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    for (let x = -height; x < width; x += 6) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + height, height);
      ctx.stroke();
    }
    // glitter speckles
    ctx.globalAlpha = 1;
    const n = Math.round((width * height) / 90);
    for (let i = 0; i < n; i++) {
      const light = Math.random() > 0.45;
      ctx.fillStyle = light ? `rgba(255,255,255,${0.25 + Math.random() * 0.6})` : `rgba(0,0,0,${0.06 + Math.random() * 0.1})`;
      const s = Math.random() * 1.6 + 0.4;
      ctx.fillRect(Math.random() * width, Math.random() * height, s, s);
    }
    // inner border
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(8, 8, width - 16, height - 16);
    ctx.setLineDash([]);
    setPainted(true);
  }, [coverColor]);

  useEffect(() => {
    if (preview) return;
    paint();
    const wrap = wrapRef.current;
    if (!wrap || typeof ResizeObserver === "undefined") return;
    let w = wrap.getBoundingClientRect().width;
    const ro = new ResizeObserver(() => {
      const nw = wrap.getBoundingClientRect().width;
      if (Math.abs(nw - w) > 1 && !moves.current) {
        w = nw;
        paint();
      }
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [paint, preview]);

  const reveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setRevealed(true);
    setBurst((b) => b + 1);
    try {
      navigator.vibrate?.(30);
    } catch {
      /* ignore */
    }
    onReveal?.();
  }, [onReveal]);

  const measure = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx || !canvas.width) return;
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const step = 16; // sample every 16th pixel (RGBA = 4 bytes each)
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += step * 4) {
      total++;
      if (data[i] < 64) clear++;
    }
    if (total && clear / total >= THRESHOLD) reveal();
  }, [reveal]);

  const scratchAt = (x: number, y: number) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = BRUSH * 2;
    ctx.beginPath();
    const from = last.current ?? { x: x - 0.1, y };
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    last.current = { x, y };
    if (++moves.current % 12 === 0) measure();
  };

  const point = (e: React.PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (revealedRef.current) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setTouched(true);
    last.current = null;
    const p = point(e);
    scratchAt(p.x, p.y);
  };
  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (revealedRef.current || !last.current) return;
    e.preventDefault();
    const p = point(e);
    scratchAt(p.x, p.y);
  };
  const onUp = () => {
    if (!last.current) return;
    last.current = null;
    measure();
  };

  return (
    <div ref={wrapRef} className={`relative select-none overflow-visible ${className}`}>
      <div
        className="transition-[filter,transform] duration-700"
        style={{
          filter: revealed || preview ? "none" : "blur(2px)",
          opacity: preview || revealed || painted ? 1 : 0,
        }}
        aria-hidden={!revealed && !preview}
      >
        {children}
      </div>

      {preview ? (
        <div
          className="absolute inset-0 grid place-items-center overflow-hidden rounded-2xl"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,.45), rgba(255,255,255,0) 40%, rgba(255,255,255,.35) 55%, rgba(0,0,0,.18)), ${coverColor}`,
          }}
        >
          <span className="scratch-shimmer px-4 text-center text-sm font-semibold tracking-wide text-white drop-shadow">
            {hint}
          </span>
        </div>
      ) : (
        <AnimatePresence>
          {!revealed && (
            <motion.div
              key="foil"
              className="absolute inset-0 overflow-hidden rounded-2xl shadow-[inset_0_0_0_1px_rgba(255,255,255,.4)]"
              exit={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }}
              transition={{ duration: 0.7 }}
            >
              <canvas
                ref={canvasRef}
                className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing"
                style={{ touchAction: "none" }}
                role="button"
                tabIndex={0}
                aria-label={hint}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    reveal();
                  }
                }}
                onPointerDown={onDown}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerCancel={onUp}
                onPointerLeave={onUp}
              />
              <motion.div
                className="pointer-events-none absolute inset-0 grid place-items-center"
                animate={{ opacity: touched ? 0 : 1 }}
                transition={{ duration: 0.4 }}
              >
                <span className="scratch-shimmer flex items-center gap-2 px-4 text-center text-sm font-semibold tracking-wide text-white drop-shadow-[0_1px_2px_rgba(0,0,0,.35)]">
                  <motion.svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    animate={{ x: [-6, 6, -6], rotate: [-8, 8, -8] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5a1.5 1.5 0 0 1 3 0V11m0-.5a1.5 1.5 0 0 1 3 0v3.5a6 6 0 0 1-6 6h-.6a6 6 0 0 1-4.6-2.2L4.6 15a1.5 1.5 0 0 1 2.3-1.9L9 15" />
                  </motion.svg>
                  {hint}
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <Burst trigger={burst} colors={[accent, accent2, coverColor, "#ffffff", "#ffd86b"]} />

      <style>{`
        .scratch-shimmer {
          background: linear-gradient(100deg, #fff 30%, rgba(255,255,255,.55) 50%, #fff 70%);
          background-size: 250% 100%;
          -webkit-background-clip: text; background-clip: text;
          color: transparent;
          animation: scratch-shimmer 2.4s linear infinite;
          text-shadow: none;
          filter: drop-shadow(0 1px 1.5px rgba(0,0,0,.35));
        }
        .scratch-shimmer svg { color: #fff; }
        @keyframes scratch-shimmer { from { background-position: 100% 0 } to { background-position: -150% 0 } }
      `}</style>
    </div>
  );
}
