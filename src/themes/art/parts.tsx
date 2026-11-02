import { useId, type ReactNode } from "react";
import { r2 } from "../effects/random";
import { ring } from "../effects/shapes";

/** A unique, url()-safe id for SVG gradients/filters (stable across SSR + hydration). */
export function useSvgId(prefix = "si") {
  return prefix + useId().replace(/[^a-zA-Z0-9_-]/g, "");
}

/** Renders children once and mirrored horizontally around the centre of a viewBox of width `w`. */
export function Mirror({ w, children }: { w: number; children: ReactNode }) {
  return (
    <>
      {children}
      <g transform={`translate(${w} 0) scale(-1 1)`}>{children}</g>
    </>
  );
}

export function Marigold({
  cx,
  cy,
  r,
  c1 = "#f28c18",
  c2 = "#ffc93c",
  c3 = "#b85a00",
}: {
  cx: number;
  cy: number;
  r: number;
  c1?: string;
  c2?: string;
  c3?: string;
}) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      {ring(12, r * 0.62).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={r2(r * 0.42)} fill={c1} />
      ))}
      {ring(9, r * 0.32, 0.3).map(([x, y], i) => (
        <circle key={`b${i}`} cx={x} cy={y} r={r2(r * 0.36)} fill={c2} />
      ))}
      <circle r={r2(r * 0.2)} fill={c3} />
    </g>
  );
}

/** Leaf pointing along +x from (x,y), rotated by `rot` degrees. */
export function Leaf({
  x,
  y,
  rot,
  len,
  w,
  fill,
  vein,
}: {
  x: number;
  y: number;
  rot: number;
  len: number;
  w: number;
  fill: string;
  vein?: string;
}) {
  const L = len;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M0 0C${r2(L * 0.3)} ${-w} ${r2(L * 0.7)} ${-w} ${L} 0C${r2(L * 0.7)} ${w} ${r2(L * 0.3)} ${w} 0 0Z`} fill={fill} />
      {vein && <path d={`M1 0L${r2(L * 0.9)} 0`} stroke={vein} strokeWidth=".7" opacity=".7" />}
    </g>
  );
}

export function Rose({ cx, cy, r, c1, c2, c3 }: { cx: number; cy: number; r: number; c1: string; c2: string; c3: string }) {
  const s = (n: number) => r2(n * r);
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <circle r={r} fill={c1} />
      <path d={`M${s(-0.82)} ${s(0.2)}C${s(-0.7)} ${s(-0.85)} ${s(0.75)} ${s(-0.85)} ${s(0.8)} ${s(0.1)}`} stroke={c3} strokeWidth={s(0.07)} fill="none" opacity=".5" />
      <circle r={s(0.64)} fill={c2} />
      <path
        d={`M${s(-0.34)} 0C${s(-0.34)} ${s(-0.42)} ${s(0.36)} ${s(-0.42)} ${s(0.33)} ${s(0.05)}C${s(0.3)} ${s(0.36)} ${s(-0.12)} ${s(0.36)} ${s(-0.13)} ${s(0.05)}C${s(-0.13)} ${s(-0.12)} ${s(0.1)} ${s(-0.14)} ${s(0.1)} ${s(0.02)}`}
        stroke={c3}
        strokeWidth={s(0.08)}
        fill="none"
        strokeLinecap="round"
      />
      <path d={`M${s(-0.6)} ${s(0.3)}C${s(-0.3)} ${s(0.62)} ${s(0.3)} ${s(0.62)} ${s(0.6)} ${s(0.3)}`} stroke={c3} strokeWidth={s(0.06)} fill="none" opacity=".45" />
    </g>
  );
}

/** Lotus-style petal pointing up from the origin. */
export function petalPath(h: number, w: number) {
  return `M0 0C${-w} ${r2(-h * 0.35)} ${r2(-w * 0.6)} ${r2(-h * 0.8)} 0 ${-h}C${r2(w * 0.6)} ${r2(-h * 0.8)} ${w} ${r2(-h * 0.35)} 0 0Z`;
}

/** Teardrop flame whose base sits at (x,y). */
export function flamePath(x: number, y: number, h = 14) {
  const w = r2(h * 0.36);
  return `M${x} ${y - h}C${x + w} ${r2(y - h * 0.55)} ${r2(x + w * 1.2)} ${r2(y - h * 0.2)} ${x} ${y}C${r2(x - w * 1.2)} ${r2(y - h * 0.2)} ${x - w} ${r2(y - h * 0.55)} ${x} ${y - h}Z`;
}

export const SPARKLE = "M12 0c1 8 4 11 12 12-8 1-11 4-12 12-1-8-4-11-12-12 8-1 11-4 12-12Z";
export const HEART =
  "M12 21C5 15 1 11.5 1 7.5 1 4.4 3.4 2 6.4 2c2.2 0 4.2 1.3 5.6 3.2C13.4 3.3 15.4 2 17.6 2 20.6 2 23 4.4 23 7.5c0 4-4 7.5-11 13.5Z";
export const STAR = "12,1 14.9,8.6 23,9 16.7,14.1 18.9,22 12,17.5 5.1,22 7.3,14.1 1,9 9.1,8.6";

/** Places a 24x24 icon path centred on (x,y) at a given pixel size. */
export function Icon({ d, x, y, size, fill, className, poly }: { d: string; x: number; y: number; size: number; fill: string; className?: string; poly?: boolean }) {
  const s = r2(size / 24);
  return (
    <g transform={`translate(${r2(x - size / 2)} ${r2(y - size / 2)}) scale(${s})`}>
      {poly ? <polygon points={d} fill={fill} className={className} /> : <path d={d} fill={fill} className={className} />}
    </g>
  );
}

/** Peacock feather pointing up from the origin. */
export function Feather({ id, scale = 1 }: { id: string; scale?: number }) {
  const barbs = Array.from({ length: 11 }, (_, i) => {
    const y = -8 - i * 5.4;
    const w = r2(3 + (i / 10) * 11);
    return (
      <g key={i}>
        <path d={`M0 ${y}Q${r2(-w * 0.6)} ${y - 2} ${-w} ${y - 7}`} />
        <path d={`M0 ${y}Q${r2(w * 0.6)} ${y - 2} ${w} ${y - 7}`} />
      </g>
    );
  });
  return (
    <g transform={`scale(${scale})`}>
      <path d="M0 0C-4-18-16-40-14-56-12-70-4-76 0-76 4-76 12-70 14-56 16-40 4-18 0 0Z" fill={`url(#${id}f)`} opacity=".92" />
      <g stroke="#c9e98a" strokeWidth=".55" fill="none" opacity=".55">
        {barbs}
      </g>
      <path d="M0 6V-70" stroke="#e8d38f" strokeWidth="1.1" />
      <ellipse cy="-56" rx="10" ry="12.5" fill="#b9c43a" />
      <ellipse cy="-55.5" rx="7.4" ry="9.6" fill="#11908f" />
      <ellipse cy="-55" rx="4.8" ry="6.6" fill="#1f3592" />
      <ellipse cy="-54" rx="2.2" ry="3.2" fill="#0a1236" />
    </g>
  );
}

export function FeatherGradient({ id }: { id: string }) {
  return (
    <linearGradient id={`${id}f`} x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stopColor="#0b5f4f" />
      <stop offset=".6" stopColor="#13897a" />
      <stop offset="1" stopColor="#3dbb8c" />
    </linearGradient>
  );
}
