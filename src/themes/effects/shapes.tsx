import { r2 } from "./random";

export type ShapeName =
  | "petal"
  | "marigold"
  | "jasmine"
  | "confetti"
  | "confettiDot"
  | "streamer"
  | "sparkle"
  | "star"
  | "heart"
  | "bubble"
  | "balloon"
  | "leaf"
  | "mangoLeaf"
  | "diya"
  | "lantern"
  | "note"
  | "cap"
  | "dot"
  | "ring";

export interface ShapeProps {
  name: ShapeName;
  size: number;
  color: string;
  color2?: string;
}

/** Points on a circle, rounded so server and client produce identical markup. */
export function ring(n: number, radius: number, offset = 0) {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + offset;
    return [r2(Math.cos(a) * radius), r2(Math.sin(a) * radius)] as const;
  });
}

const MARIGOLD_OUTER = ring(12, 7.4);
const MARIGOLD_INNER = ring(9, 4, 0.3);

/** Small, cheap SVG particle shapes used by the particle field. */
export function Shape({ name, size, color, color2 = "#ffffff" }: ShapeProps) {
  switch (name) {
    case "petal":
      return (
        <svg width={size} height={r2(size * 1.2)} viewBox="0 0 20 24" aria-hidden>
          <path d="M10 23C2 18 0 8 5 3c2-2 4-1 5 1 1-2 3-3 5-1 5 5 3 15-5 20Z" fill={color} />
          <path d="M10 21C6.5 16 5.5 10 7.5 5" stroke={color2} strokeWidth="1" fill="none" opacity=".45" />
        </svg>
      );
    case "marigold":
      return (
        <svg width={size} height={size} viewBox="-12 -12 24 24" aria-hidden>
          {MARIGOLD_OUTER.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3.6" fill={color} />
          ))}
          {MARIGOLD_INNER.map(([x, y], i) => (
            <circle key={`i${i}`} cx={x} cy={y} r="3" fill={color2} />
          ))}
          <circle r="2.2" fill={color} opacity=".85" />
        </svg>
      );
    case "jasmine":
      return (
        <svg width={size} height={size} viewBox="-12 -12 24 24" aria-hidden>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} rx="3.2" ry="6.4" transform={`rotate(${a}) translate(0 -5.2)`} fill={color} />
          ))}
          <circle r="2.2" fill={color2} />
        </svg>
      );
    case "confetti":
      return (
        <svg width={size} height={r2(size * 1.6)} viewBox="0 0 10 16" aria-hidden>
          <rect width="10" height="16" rx="1.6" fill={color} />
        </svg>
      );
    case "confettiDot":
      return (
        <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden>
          <circle cx="5" cy="5" r="5" fill={color} />
        </svg>
      );
    case "streamer":
      return (
        <svg width={size} height={r2(size * 2.8)} viewBox="0 0 10 28" aria-hidden>
          <path d="M3 1c6 4-4 8 2 13s-4 8 2 13" stroke={color} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        </svg>
      );
    case "sparkle":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
          <path d="M12 0c1 8 4 11 12 12-8 1-11 4-12 12-1-8-4-11-12-12 8-1 11-4 12-12Z" fill={color} />
        </svg>
      );
    case "star":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
          <polygon
            points="12,1 14.9,8.6 23,9 16.7,14.1 18.9,22 12,17.5 5.1,22 7.3,14.1 1,9 9.1,8.6"
            fill={color}
            stroke={color2}
            strokeWidth=".6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "heart":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
          <path
            d="M12 21C5 15 1 11.5 1 7.5 1 4.4 3.4 2 6.4 2c2.2 0 4.2 1.3 5.6 3.2C13.4 3.3 15.4 2 17.6 2 20.6 2 23 4.4 23 7.5c0 4-4 7.5-11 13.5Z"
            fill={color}
          />
          <path d="M5.5 5.5c-1.5 1-1.8 3-1 4.3" stroke={color2} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity=".6" />
        </svg>
      );
    case "bubble":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="11" fill={color} fillOpacity=".18" stroke={color} strokeOpacity=".7" strokeWidth="1" />
          <path d="M6 9.5a7 7 0 0 1 5-5" stroke={color2} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity=".9" />
          <circle cx="16.5" cy="16" r="1.2" fill={color2} opacity=".6" />
        </svg>
      );
    case "balloon":
      return (
        <svg width={size} height={r2(size * 1.75)} viewBox="0 0 24 42" aria-hidden>
          <path d="M12 41c-3-5 3-8 0-14" stroke={color2} strokeWidth=".8" fill="none" opacity=".7" />
          <ellipse cx="12" cy="12.5" rx="10.5" ry="12.5" fill={color} />
          <path d="M10 26.5h4L12 24Z" fill={color} />
          <ellipse cx="8" cy="8" rx="2.6" ry="4" transform="rotate(25 8 8)" fill="#fff" opacity=".45" />
        </svg>
      );
    case "leaf":
      return (
        <svg width={size} height={size * 2} viewBox="0 0 12 24" aria-hidden>
          <path d="M6 0c6 6 6 16 0 24C0 16 0 6 6 0Z" fill={color} />
          <path d="M6 2v20" stroke={color2} strokeWidth=".8" opacity=".55" />
        </svg>
      );
    case "mangoLeaf":
      return (
        <svg width={size} height={size * 3} viewBox="0 0 10 30" aria-hidden>
          <path d="M5 0c5 8 5 20 0 30C0 20 0 8 5 0Z" fill={color} />
          <path d="M5 2v26" stroke={color2} strokeWidth=".7" opacity=".6" />
        </svg>
      );
    case "diya":
      return (
        <svg width={size} height={size} viewBox="0 0 30 30" aria-hidden>
          <circle cx="15" cy="13" r="12" fill={color2} opacity=".22" />
          <path className="si-flame" d="M15 3c3.5 4.5 4.5 9 0 13.5C10.5 12 11.5 7.5 15 3Z" fill={color2} />
          <path d="M15 8c1.5 2.2 2 4.4 0 7-2-2.6-1.5-4.8 0-7Z" fill="#fff8d0" />
          <path d="M3 17.5c2 9.5 22 9.5 24 0Z" fill={color} />
          <ellipse cx="15" cy="17.5" rx="12" ry="2" fill={color2} opacity=".6" />
        </svg>
      );
    case "lantern":
      return (
        <svg width={size} height={r2(size * 1.4)} viewBox="0 0 24 34" aria-hidden>
          <ellipse cx="12" cy="18" rx="12" ry="15" fill={color2} opacity=".2" />
          <path d="M5 4h14l3 21c0 3-20 3-20 0Z" fill={color} />
          <ellipse cx="12" cy="22" rx="6" ry="4.5" fill={color2} opacity=".85" />
          <path d="M5 4h14" stroke={color2} strokeWidth="1.4" />
        </svg>
      );
    case "note":
      return (
        <svg width={size} height={r2(size * 1.2)} viewBox="0 0 20 24" aria-hidden>
          <ellipse cx="7" cy="19" rx="5" ry="3.8" transform="rotate(-20 7 19)" fill={color} />
          <rect x="10.6" y="2" width="1.9" height="17" fill={color} />
          <path d="M12.5 2c3 3 7 4 5.5 10-1-3-3-4-5.5-4Z" fill={color} />
        </svg>
      );
    case "cap":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
          <path d="M6 9.5V14c0 2.5 12 2.5 12 0V9.5L12 12Z" fill={color} />
          <path d="M12 3l11 5-11 5L1 8Z" fill={color} />
          <path d="M12 8l7 2v6" stroke={color2} strokeWidth="1" fill="none" />
          <rect x="18.2" y="15.5" width="1.6" height="3.5" fill={color2} />
        </svg>
      );
    case "dot":
      return (
        <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden>
          <circle cx="5" cy="5" r="5" fill={color} opacity=".35" />
          <circle cx="5" cy="5" r="2.6" fill={color} />
        </svg>
      );
    case "ring":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="9.5" fill="none" stroke={color} strokeWidth="2.2" />
        </svg>
      );
  }
}
