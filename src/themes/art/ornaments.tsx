import type { ReactNode } from "react";
import type { ThemeArtProps } from "../types";
import { FxStyles } from "../effects/styles";
import { r2 } from "../effects/random";
import { ring } from "../effects/shapes";
import {
  useSvgId,
  Mirror,
  Marigold,
  Leaf,
  Rose,
  petalPath,
  flamePath,
  Icon,
  SPARKLE,
  HEART,
  STAR,
  Feather,
  FeatherGradient,
} from "./parts";

function Orn({ className = "", viewBox, children }: { className?: string; viewBox: string; children: ReactNode }) {
  return (
    <>
      <FxStyles />
      <svg className={`si-orn ${className}`} viewBox={viewBox} aria-hidden fill="none">
        {children}
      </svg>
    </>
  );
}

/* ───────────── Royal Marigold: kalash with mango leaves & coconut, marigold scrolls ───────────── */
export function KalashOrnament({ className }: ThemeArtProps) {
  const id = useSvgId();
  const gold = `url(#${id}g)`;
  return (
    <Orn className={className} viewBox="0 0 280 96">
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe79a" />
          <stop offset=".5" stopColor="#e0a82e" />
          <stop offset="1" stopColor="#a86b0c" />
        </linearGradient>
      </defs>
      <Mirror w={280}>
        <g stroke={gold} strokeWidth="1.6" strokeLinecap="round">
          <path d="M112 66c-16 0-20-12-32-12-14 0-14 16-28 14-12-2-12-14-22-12-8 2-10 10-16 10" />
          <path d="M80 54c-2-10 8-14 12-8 3 5-3 8-5 5" />
          <path d="M52 68c-2 10 8 14 11 8 2-4-3-6-5-3" />
          <path d="M30 56c-2-8 6-12 9-7" />
          <path d="M98 66v7M40 62v8" strokeWidth="1" />
        </g>
        <circle cx="66" cy="60.5" r="1.7" fill="#c9561a" />
        <circle cx="104" cy="62" r="1.5" fill="#c9561a" />
        <Marigold cx={98} cy={77} r={4} />
        <Marigold cx={40} cy={73} r={3.4} c1="#ffb627" c2="#ffe07a" />
        <Marigold cx={12} cy={66} r={7} />
      </Mirror>
      {[-150, -120, -90, -60, -30].map((a, i) => (
        <Leaf key={a} x={140} y={34} rot={a} len={i === 2 ? 30 : 26} w={6} fill={i % 2 ? "#2f7a2a" : "#3f8f34"} vein="#b7e07a" />
      ))}
      <ellipse cx="140" cy="24" rx="9" ry="11" fill="#8a5524" />
      <path d="M140 13c-2-5-6-7-10-7m10 7c2-5 6-7 10-7" stroke="#5e3613" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M135 20c1-3 3-4 5-4" stroke="#c48a52" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="126" y="33" width="28" height="6" rx="3" fill={gold} />
      <rect x="130" y="38" width="20" height="5" fill="#b9831c" />
      <path d="M130 42c-18 4-20 24-8 32 6 4 30 4 36 0 12-8 10-28-8-32Z" fill={gold} />
      <path d="M116 58c12 5 36 5 48 0" stroke="#b3261e" strokeWidth="2.6" />
      {[128, 140, 152].map((x, i) => (
        <circle key={x} cx={x} cy={i === 1 ? 63 : 61.5} r="1.5" fill="#fff3c4" />
      ))}
      <circle cx="140" cy="51" r="3.2" fill="#b3261e" />
      <circle cx="140" cy="51" r="1.2" fill="#ffe79a" />
      <path d="M124 49c-4 8-2 16 2 20" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity=".5" />
      <path d="M128 76h24l4 8h-32Z" fill={gold} />
    </Orn>
  );
}

/* ───────────── Haldi: sunburst marigold with mango leaves & turmeric bead strings ───────────── */
const SUN_RAYS = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2;
  const a1 = a - 0.09;
  const a2 = a + 0.09;
  const R = i % 2 ? 33 : 38;
  const p = (ang: number, rad: number) => `${r2(140 + Math.cos(ang) * rad)},${r2(45 + Math.sin(ang) * rad)}`;
  return `${p(a1, 22)} ${p(a, R)} ${p(a2, 22)}`;
});

export function HaldiOrnament({ className }: ThemeArtProps) {
  return (
    <Orn className={className} viewBox="0 0 280 92">
      <g className="si-rot">
        {SUN_RAYS.map((pts, i) => (
          <polygon key={i} points={pts} fill={i % 2 ? "#ffcf3f" : "#f59e0b"} opacity=".9" />
        ))}
      </g>
      <Mirror w={280}>
        <path d="M10 46c28 14 58 14 84 4" stroke="#c98a00" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="0 6.5" />
        <Leaf x={116} y={47} rot={168} len={36} w={7} fill="#3c8d2f" vein="#bfe58c" />
        <Leaf x={116} y={47} rot={192} len={30} w={6} fill="#2a7524" vein="#bfe58c" />
        <Leaf x={114} y={52} rot={214} len={22} w={5} fill="#4ea33b" vein="#d6f0a8" />
        <Marigold cx={10} cy={46} r={6} c1="#ff9f1c" c2="#ffd23f" c3="#c25e00" />
        <Marigold cx={52} cy={55} r={4.5} c1="#ffb627" c2="#ffe680" c3="#c25e00" />
      </Mirror>
      <Marigold cx={140} cy={45} r={20} c1="#ff9f1c" c2="#ffd23f" c3="#c25e00" />
      <circle cx="140" cy="45" r="3" fill="#7a2e00" />
    </Orn>
  );
}

/* ───────────── Mehndi: mirrored henna paisleys around a lace mandala ───────────── */
export function PaisleyOrnament({ className, color = "#a8572a", dark = "#5c3014" }: ThemeArtProps & { color?: string; dark?: string }) {
  const dots = ring(16, 30);
  return (
    <Orn className={className} viewBox="0 0 280 92">
      <Mirror w={280}>
        <g stroke={color} strokeWidth="1.5" strokeLinecap="round">
          <path d="M56 52c16 2 28 6 40 4 14-2 20-14 14-23-7-9-22-7-26 3-6 10-16 14-28 16Z" />
          <path d="M68 51c10 0 18 2 27 0 9-2 13-9 9-15-4-5-12-4-14 2-2 6 6 8 8 3" strokeWidth="1" />
          <path d="M56 52c-12-2-20-10-32-8-8 2-10 10-4 12" />
          <path d="M40 46c-2-6 2-10 6-8" strokeWidth="1" />
          <path d="M30 55c0 5-4 8-8 7" strokeWidth="1" />
        </g>
        <circle cx="99" cy="42" r="2.6" fill={color} />
        {[
          [115, 40],
          [113, 30],
          [105, 23],
          [95, 22],
          [86, 27],
          [81, 37],
        ].map(([x, y]) => (
          <circle key={`${x}`} cx={x} cy={y} r="1.3" fill={dark} />
        ))}
        <path d="M18 56c-6 0-10 0-14 0" stroke={color} strokeWidth="1" strokeDasharray="0 4" strokeLinecap="round" />
      </Mirror>
      <g transform="translate(140 46)">
        <g className="si-rot">
          {Array.from({ length: 12 }, (_, i) => (
            <ellipse key={i} rx="4.2" ry="10.5" transform={`rotate(${i * 30}) translate(0 -17)`} stroke={color} strokeWidth="1.2" />
          ))}
          {dots.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.3" fill={dark} />
          ))}
        </g>
        <circle r="10" stroke={color} strokeWidth="1.3" />
        <circle r="6.5" stroke={dark} strokeWidth="1" strokeDasharray="1.5 2" />
        <circle r="3.4" fill={color} />
      </g>
    </Orn>
  );
}

/* ───────────── Sangeet: dhol with crossed sticks, music notes and sound waves ───────────── */
export function DholOrnament({ className }: ThemeArtProps) {
  const id = useSvgId();
  return (
    <Orn className={className} viewBox="0 0 280 96">
      <defs>
        <linearGradient id={`${id}d`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff6fc4" />
          <stop offset=".55" stopColor="#c2188f" />
          <stop offset="1" stopColor="#6a0d6e" />
        </linearGradient>
        <filter id={`${id}glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <Mirror w={280}>
        <path
          d="M104 54c-8-8-14 8-22 0s-14 8-22 0-14 8-22 0-14 8-22 0"
          stroke="#ff4fb8"
          strokeWidth="1.7"
          strokeLinecap="round"
          filter={`url(#${id}glow)`}
        />
        <circle cx="12" cy="54" r="2.4" fill="#ffd25e" />
        <g className="si-float">
          <g transform="translate(62 14) scale(.95)">
            <ellipse cx="7" cy="19" rx="5" ry="3.8" transform="rotate(-20 7 19)" fill="#ffd25e" />
            <rect x="10.6" y="2" width="1.9" height="17" fill="#ffd25e" />
            <path d="M12.5 2c3 3 7 4 5.5 10-1-3-3-4-5.5-4Z" fill="#ffd25e" />
          </g>
        </g>
        <Icon d={SPARKLE} x={96} y={20} size={10} fill="#fff4fb" className="si-blink" />
        <Icon d={SPARKLE} x={30} y={30} size={7} fill="#ff9be0" className="si-blink" />
      </Mirror>
      <g strokeLinecap="round">
        <path d="M120 33 150 5" stroke="#f6d7a7" strokeWidth="3" />
        <path d="M160 33 130 5" stroke="#f6d7a7" strokeWidth="3" />
        <circle cx="150" cy="5" r="2.6" fill="#ffd25e" />
        <path d="M130 5c-3-1-5 1-5 3" stroke="#f6d7a7" strokeWidth="3" />
      </g>
      <path d="M114 38q26-8 52 0v28q-26 8-52 0Z" fill={`url(#${id}d)`} />
      <path d="M118 37l6 30 6-32 6 33 6-33 6 33 6-33 6 32" stroke="#ffd25e" strokeWidth="1.1" strokeLinejoin="round" />
      <ellipse cx="114" cy="52" rx="6.5" ry="14.5" fill="#ffd25e" />
      <ellipse cx="114" cy="52" rx="4.2" ry="11.5" fill="#fff2c6" />
      <ellipse cx="166" cy="52" rx="6.5" ry="14.5" fill="#ffd25e" />
      <ellipse cx="166" cy="52" rx="4.2" ry="11.5" fill="#fff2c6" />
      <path d="M118 74c10 4 34 4 44 0" stroke="#ff4fb8" strokeWidth="1" strokeDasharray="0 4" strokeLinecap="round" />
    </Orn>
  );
}

/* ───────────── Temple Gold: brass kuthu vilakku lamp, temple bells, kolam ───────────── */
function Bell({ x, y, len, c }: { x: number; y: number; len: number; c: string }) {
  const b = y + len;
  return (
    <g className="si-swing">
      <path d={`M${x} ${y}V${b}`} stroke={c} strokeWidth="1" />
      <path d={`M${x - 5} ${b + 10}c0-8 10-8 10 0l1.5 2.5h-13Z`} fill={c} />
      <circle cx={x} cy={b + 14} r="1.8" fill={c} />
    </g>
  );
}

export function TempleLampOrnament({ className }: ThemeArtProps) {
  const id = useSvgId();
  const gold = `url(#${id}g)`;
  return (
    <Orn className={className} viewBox="0 0 280 100">
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset=".5" stopColor="#d4a017" />
          <stop offset="1" stopColor="#9a6a06" />
        </linearGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff7c2" />
          <stop offset=".5" stopColor="#ffb300" />
          <stop offset="1" stopColor="#e2470f" />
        </linearGradient>
        <radialGradient id={`${id}r`}>
          <stop offset="0" stopColor="#ffd56b" stopOpacity=".7" />
          <stop offset="1" stopColor="#ffd56b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <Mirror w={280}>
        <path d="M6 18q22 16 44 0t44 0" stroke={gold} strokeWidth="1.6" />
        <Bell x={28} y={25} len={6} c="#c9971c" />
        <Bell x={72} y={25} len={14} c="#c9971c" />
        <g transform="translate(58 72)" stroke="#7a1018" strokeWidth="1.2">
          <path d="M0-13Q13-13 13 0T0 13-13 0 0-13Z" />
          <path d="M0-7 7 0 0 7-7 0Z" />
          <circle cx="0" cy="-20" r="1.5" fill="#7a1018" />
          <circle cx="20" cy="0" r="1.5" fill="#7a1018" />
          <circle cx="0" cy="20" r="1.5" fill="#7a1018" />
          <circle cx="-20" cy="0" r="1.5" fill="#7a1018" />
          <circle r="1.6" fill="#7a1018" />
        </g>
        <path d="M84 86H18" stroke={gold} strokeWidth="1.2" strokeDasharray="0 5" strokeLinecap="round" />
      </Mirror>
      <circle cx="140" cy="26" r="30" fill={`url(#${id}r)`} className="si-pulse" />
      <path d="M140 6c3 6 6 8 0 14-6-6-3-8 0-14Z" fill={gold} />
      <rect x="138" y="19" width="4" height="15" fill={gold} />
      <path d={flamePath(122, 32, 15)} fill={`url(#${id}f)`} className="si-flame" />
      <path d={flamePath(158, 32, 15)} fill={`url(#${id}f)`} className="si-flame" style={{ animationDelay: "-.6s" }} />
      <path d="M114 34c4 11 48 11 52 0Z" fill={gold} />
      <ellipse cx="140" cy="34" rx="26" ry="3" fill="#ffe08a" />
      <rect x="137" y="42" width="6" height="34" fill={gold} />
      <ellipse cx="140" cy="50" rx="6.5" ry="3" fill={gold} />
      <ellipse cx="140" cy="63" rx="5.5" ry="2.6" fill={gold} />
      <path d="M128 78c4-7 20-7 24 0Z" fill={gold} />
      <path d="M118 88c4-11 40-11 44 0Z" fill={gold} />
      <ellipse cx="140" cy="88" rx="23" ry="3" fill="#9a6a06" />
    </Orn>
  );
}

/* ───────────── Peacock Royale: crossed peacock feathers ───────────── */
export function PeacockOrnament({ className }: ThemeArtProps) {
  const id = useSvgId();
  return (
    <Orn className={className} viewBox="0 0 280 100">
      <defs>
        <FeatherGradient id={id} />
      </defs>
      <Mirror w={280}>
        <path d="M112 84c-22 0-32-14-52-10-16 3-22 14-40 10" stroke="#c9a227" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M60 74c-2-8 6-12 10-8" stroke="#c9a227" strokeWidth="1.2" strokeLinecap="round" />
        <Leaf x={36} y={80} rot={-140} len={14} w={3.6} fill="#0e7c86" />
        <Leaf x={84} y={78} rot={-120} len={12} w={3} fill="#1fa38f" />
        <circle cx="16" cy="84" r="2.4" fill="#c9a227" />
        <Icon d={SPARKLE} x={96} y={40} size={9} fill="#e6c656" className="si-blink" />
      </Mirror>
      <g transform="translate(140 92) rotate(-30)">
        <Feather id={id} />
      </g>
      <g transform="translate(140 92) rotate(30)">
        <Feather id={id} />
      </g>
      <g transform="translate(140 94)">
        <Feather id={id} scale={0.9} />
      </g>
      <circle cx="140" cy="91" r="3.4" fill="#c9a227" />
    </Orn>
  );
}

/* ───────────── Lotus Pond: blooming lotus on water with buds ───────────── */
export function LotusOrnament({ className }: ThemeArtProps) {
  const id = useSvgId();
  return (
    <Orn className={className} viewBox="0 0 280 96">
      <defs>
        <linearGradient id={`${id}p`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#fbd3e2" />
          <stop offset="1" stopColor="#e05a8f" />
        </linearGradient>
        <linearGradient id={`${id}q`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#fff0f5" />
          <stop offset="1" stopColor="#f08cb3" />
        </linearGradient>
      </defs>
      <Mirror w={280}>
        <ellipse cx="86" cy="80" rx="22" ry="5.5" fill="#5e9c7a" />
        <path d="M86 80 70 76" stroke="#3f7a5c" strokeWidth="1" />
        <ellipse cx="44" cy="84" rx="14" ry="3.6" fill="#7bb595" />
        <path d="M60 82c-2-10-6-18-10-24" stroke="#4f8a68" strokeWidth="1.4" />
        <g transform="translate(50 60)">
          <path d={petalPath(20, 7)} fill={`url(#${id}p)`} />
          <path d={petalPath(16, 6)} transform="rotate(-24)" fill={`url(#${id}q)`} opacity=".9" />
        </g>
        <path d="M110 88c-30 0-60 2-96 0" stroke="#7fb59a" strokeWidth="1" strokeLinecap="round" />
        <path d="M100 92c-18 0-36 1-56 0" stroke="#a7d2bb" strokeWidth=".8" strokeLinecap="round" />
      </Mirror>
      <g transform="translate(140 74)">
        {[-66, -33, 33, 66].map((a) => (
          <path key={a} d={petalPath(44, 14)} transform={`rotate(${a})`} fill={`url(#${id}p)`} />
        ))}
        <path d={petalPath(56, 16)} fill={`url(#${id}p)`} />
        {[-22, 22].map((a) => (
          <path key={a} d={petalPath(42, 14)} transform={`rotate(${a})`} fill={`url(#${id}q)`} stroke="#fff" strokeWidth=".6" />
        ))}
        <path d={petalPath(36, 12)} fill={`url(#${id}q)`} stroke="#fff" strokeWidth=".6" />
        <path d="M0-4V-30" stroke="#e05a8f" strokeWidth=".7" opacity=".5" />
        <ellipse rx="20" ry="4.5" fill="#f7c3d7" />
        {[-10, -5, 0, 5, 10].map((x) => (
          <circle key={x} cx={x} cy={-3} r="1.5" fill="#e3b341" />
        ))}
      </g>
    </Orn>
  );
}

/* ───────────── Midnight Diya: glowing clay lamp with sparkles ───────────── */
export function DiyaOrnament({ className }: ThemeArtProps) {
  const id = useSvgId();
  return (
    <Orn className={className} viewBox="0 0 280 92">
      <defs>
        <radialGradient id={`${id}r`}>
          <stop offset="0" stopColor="#ffcf6b" stopOpacity=".6" />
          <stop offset="1" stopColor="#ffcf6b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffbe0" />
          <stop offset=".45" stopColor="#ffc53d" />
          <stop offset="1" stopColor="#ff5e1a" />
        </linearGradient>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e88a3a" />
          <stop offset="1" stopColor="#8a2c0c" />
        </linearGradient>
      </defs>
      <Mirror w={280}>
        <path d="M106 66H58" stroke="#f5b942" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M52 66H12" stroke="#f5b942" strokeWidth="1.6" strokeDasharray="0 5" strokeLinecap="round" />
        <path d="M58 62 62 66 58 70 54 66Z" fill="#f5b942" />
        <Icon d={SPARKLE} x={88} y={36} size={12} fill="#ffe3a3" className="si-blink" />
        <Icon d={SPARKLE} x={50} y={44} size={8} fill="#f5b942" className="si-blink" />
        <Icon d={SPARKLE} x={22} y={30} size={6} fill="#ffe3a3" className="si-blink" />
      </Mirror>
      <circle cx="140" cy="44" r="36" fill={`url(#${id}r)`} className="si-pulse" />
      <g className="si-flame">
        <path d="M140 22c9 12 11 24 0 36-11-12-9-24 0-36Z" fill={`url(#${id}f)`} />
        <path d="M140 36c4 6 5 12 0 19-5-7-4-13 0-19Z" fill="#fffbe6" />
      </g>
      <path d="M110 60c4 22 56 22 60 0-8 5-52 5-60 0Z" fill={`url(#${id}c)`} />
      <ellipse cx="140" cy="60" rx="30" ry="4.5" fill="#f5b942" />
      {[124, 140, 156].map((x, i) => (
        <circle key={x} cx={x} cy={i === 1 ? 72 : 69} r="1.8" fill="#ffe2a0" />
      ))}
      <path d="M118 66c4 2 8 3 12 3m20 0c4 0 8-1 12-3" stroke="#ffe2a0" strokeWidth=".8" opacity=".7" />
    </Orn>
  );
}

/* ───────────── Blush Floral: rose cluster with sage swag ───────────── */
export function FloralSwagOrnament({ className }: ThemeArtProps) {
  return (
    <Orn className={className} viewBox="0 0 280 90">
      <Mirror w={280}>
        <path d="M124 42c-24 26-64 26-106 2" stroke="#8fae8b" strokeWidth="1.4" strokeLinecap="round" />
        <Leaf x={104} y={57} rot={150} len={16} w={4.5} fill="#8fae8b" />
        <Leaf x={92} y={62} rot={200} len={14} w={4} fill="#a9c3a5" />
        <Leaf x={70} y={64} rot={160} len={14} w={4} fill="#8fae8b" />
        <Leaf x={50} y={60} rot={215} len={12} w={3.6} fill="#a9c3a5" />
        <Leaf x={32} y={53} rot={170} len={12} w={3.4} fill="#8fae8b" />
        <circle cx="82" cy="64" r="3.2" fill="#f3c2c9" />
        <circle cx="60" cy="63" r="2.6" fill="#e8a1ae" />
        <circle cx="40" cy="57" r="2.2" fill="#f3c2c9" />
        <circle cx="18" cy="44" r="2.4" fill="#c0657a" />
        <Leaf x={128} y={52} rot={150} len={24} w={6} fill="#7d9c79" vein="#cfe1cb" />
        <Rose cx={116} cy={45} r={9} c1="#f6d0d6" c2="#efb4be" c3="#c97b8b" />
      </Mirror>
      <Leaf x={140} y={52} rot={90} len={18} w={5} fill="#8fae8b" vein="#cfe1cb" />
      <Rose cx={140} cy={40} r={15} c1="#eaa2b0" c2="#d9798e" c3="#a8485e" />
      {[
        [124, 26],
        [158, 24],
        [150, 58],
        [130, 58],
      ].map(([x, y]) => (
        <g key={`${x}`}>
          <circle cx={x} cy={y} r="2.2" fill="#fff" stroke="#e8a1ae" strokeWidth=".8" />
          <circle cx={x} cy={y} r=".8" fill="#e3b341" />
        </g>
      ))}
    </Orn>
  );
}

/* ───────────── Emerald Elegance: art-deco sunburst fan ───────────── */
const DECO_RAYS = Array.from({ length: 15 }, (_, i) => {
  const a = Math.PI + ((i + 0.5) / 15) * Math.PI;
  const L = i % 2 ? 30 : 38;
  return {
    x1: r2(140 + Math.cos(a) * 18),
    y1: r2(62 + Math.sin(a) * 18),
    x2: r2(140 + Math.cos(a) * L),
    y2: r2(62 + Math.sin(a) * L),
  };
});

export function ArtDecoOrnament({ className, color = "#d4af37" }: ThemeArtProps & { color?: string }) {
  return (
    <Orn className={className} viewBox="0 0 280 82">
      <g stroke={color} strokeLinecap="square">
        <Mirror w={280}>
          <path d="M100 62H14M98 56H50M98 68H50" strokeWidth="1.1" />
          <path d="M14 58 18 62 14 66 10 62Z" fill={color} strokeWidth=".5" />
          <path d="M50 53v6M50 65v6" strokeWidth="1" />
          <path d="M70 50h8l4-4" strokeWidth="1" />
        </Mirror>
        <path d="M124 62a16 16 0 0 1 32 0" strokeWidth="1.4" />
        <path d="M100 62a40 40 0 0 1 80 0" strokeWidth="1.4" />
        <path d="M94 62a46 46 0 0 1 92 0" strokeWidth=".7" />
        {DECO_RAYS.map((r, i) => (
          <line key={i} {...r} strokeWidth={i % 2 ? 0.8 : 1.4} />
        ))}
        <path d="M140 67 146 73 140 79 134 73Z" fill={color} />
        <path d="M140 52v-6" strokeWidth="1.2" />
      </g>
      <circle cx="140" cy="62" r="5" fill={color} />
      {DECO_RAYS.filter((_, i) => i % 2 === 0).map((r, i) => (
        <circle key={i} cx={r.x2} cy={r.y2} r="1.6" fill={color} />
      ))}
    </Orn>
  );
}

/* ───────────── Classic Ivory: fine calligraphic flourish ───────────── */
export function FlourishOrnament({ className, color = "#a6874a" }: ThemeArtProps & { color?: string }) {
  return (
    <Orn className={className} viewBox="0 0 280 50">
      <g stroke={color} strokeLinecap="round">
        <Mirror w={280}>
          <path d="M130 25c-12 0-16-10-26-8-8 2-8 12 0 13 6 1 7-7 2-7" strokeWidth="1.3" />
          <path d="M104 30c-12 3-32-4-44-5" strokeWidth="1.1" />
          <path d="M60 25H16" strokeWidth=".7" />
          <path d="M118 23c-6-11-18-15-28-13" strokeWidth=".9" />
          <path d="M96 33c-6 6-16 8-24 6" strokeWidth=".8" />
        </Mirror>
        <path d="M140 14 149 25 140 36 131 25Z" strokeWidth="1.2" />
      </g>
      <circle cx="140" cy="25" r="2.4" fill={color} />
      <circle cx="12" cy="25" r="1.6" fill={color} />
      <circle cx="268" cy="25" r="1.6" fill={color} />
    </Orn>
  );
}

/* ───────────── Confetti Pop: two-tier cake with candles & confetti ───────────── */
const CAKE_CONFETTI: [number, number, string, number][] = [
  [62, 30, "#ff3d7f", 20],
  [84, 14, "#2ec4b6", -30],
  [92, 58, "#ffb703", 50],
  [40, 54, "#7b5cff", 10],
  [24, 24, "#ffb703", -40],
  [196, 18, "#ff3d7f", 35],
  [214, 44, "#7b5cff", -20],
  [188, 62, "#2ec4b6", 70],
  [238, 26, "#2ec4b6", 15],
  [252, 58, "#ff3d7f", -50],
];

export function CakeOrnament({ className }: ThemeArtProps) {
  return (
    <Orn className={className} viewBox="0 0 280 110">
      {CAKE_CONFETTI.map(([x, y, c, rot], i) =>
        i % 3 === 0 ? (
          <circle key={i} cx={x} cy={y} r="3" fill={c} />
        ) : (
          <rect key={i} x={x - 2.5} y={y - 4.5} width="5" height="9" rx="1" fill={c} transform={`rotate(${rot} ${x} ${y})`} />
        ),
      )}
      <Mirror w={280}>
        <path d="M30 86c6-6 14 2 20-4s14 2 20-4 14 2 20-4" stroke="#ff3d7f" strokeWidth="2" strokeLinecap="round" opacity=".7" />
        <Icon d={SPARKLE} x={104} y={28} size={10} fill="#ffb703" className="si-blink" />
      </Mirror>
      <ellipse cx="140" cy="100" rx="50" ry="5" fill="#e7defa" />
      <rect x="100" y="66" width="80" height="33" rx="6" fill="#ff7aa8" />
      <path
        d="M100 72c0-6 4-8 10-8h60c6 0 10 2 10 8-4 6-8 0-12 6s-8-4-14 0-10-6-16 0-10-4-16 0-10-6-16 0-8-2-6-6Z"
        fill="#fff3f8"
      />
      {[
        [112, 88, "#2ec4b6", 30],
        [126, 92, "#ffb703", -20],
        [146, 88, "#7b5cff", 40],
        [162, 92, "#2ec4b6", -30],
        [170, 84, "#ffb703", 10],
      ].map(([x, y, c, r], i) => (
        <rect key={i} x={Number(x)} y={Number(y)} width="5" height="1.8" rx=".9" fill={String(c)} transform={`rotate(${r} ${x} ${y})`} />
      ))}
      <rect x="116" y="40" width="48" height="27" rx="5" fill="#2ec4b6" />
      <path d="M116 46c0-5 3-7 7-7h34c4 0 7 2 7 7-4 6-8 0-12 5s-8-5-12 0-8-5-12 0-8-3-12-5Z" fill="#fffbea" />
      {[128, 140, 152].map((x, i) => (
        <g key={x}>
          <rect x={x - 2} y="24" width="4" height="16" rx="1" fill={["#ffb703", "#ff3d7f", "#7b5cff"][i]} />
          <path d={`M${x - 2} 28l4-2M${x - 2} 33l4-2M${x - 2} 38l4-2`} stroke="#fff" strokeWidth=".8" opacity=".7" />
          <path d={flamePath(x, 23, 9)} fill="#ffb020" className="si-flame" style={{ animationDelay: `-${i * 0.4}s` }} />
          <path d={flamePath(x, 22, 4)} fill="#fff6c8" />
        </g>
      ))}
    </Orn>
  );
}

/* ───────────── Balloon Fiesta: bouquet of balloons with a bow ───────────── */
const BALLOONS: [number, number, string, string][] = [
  [104, 46, "#2ec4b6", "0s"],
  [178, 48, "#ffb703", "-1.2s"],
  [128, 30, "#ff5d8f", "-2.1s"],
  [154, 32, "#5b6cff", "-.6s"],
  [141, 56, "#9b5de5", "-1.7s"],
];

export function BalloonsOrnament({ className }: ThemeArtProps) {
  return (
    <Orn className={className} viewBox="0 0 280 118">
      <Mirror w={280}>
        <Icon d={STAR} poly x={70} y={30} size={12} fill="#ffb703" className="si-blink" />
        <Icon d={SPARKLE} x={46} y={62} size={9} fill="#5b6cff" className="si-blink" />
        <circle cx="84" cy="80" r="2.4" fill="#ff5d8f" />
        <circle cx="30" cy="40" r="2" fill="#2ec4b6" />
      </Mirror>
      {BALLOONS.map(([x, y, c]) => (
        <path key={`s${x}`} d={`M${x} ${y + 20}Q${r2((x + 140) / 2 + (x < 140 ? 6 : -6))} ${r2((y + 106) / 2)} 140 104`} stroke="#8a8fb8" strokeWidth=".8" />
      ))}
      {BALLOONS.map(([x, y, c, delay]) => (
        <g key={x} className="si-float" style={{ animationDelay: delay }}>
          <ellipse cx={x} cy={y} rx="14" ry="17" fill={c} />
          <path d={`M${x - 3} ${y + 20}h6l-3-4Z`} fill={c} />
          <ellipse cx={x - 5} cy={y - 6} rx="3.4" ry="5.6" transform={`rotate(25 ${x - 5} ${y - 6})`} fill="#fff" opacity=".45" />
        </g>
      ))}
      <path d="M140 104c-8-6-14-2-12 2s8 2 12-2c8-6 14-2 12 2s-8 2-12-2Z" fill="#ff5d8f" />
      <path d="M140 104l-6 10M140 104l6 10" stroke="#ff5d8f" strokeWidth="2" strokeLinecap="round" />
      <circle cx="140" cy="104" r="2.2" fill="#d63d6c" />
    </Orn>
  );
}

/* ───────────── Baby Clouds: sleepy cloud, crescent moon and hanging stars ───────────── */
export function CloudOrnament({ className }: ThemeArtProps) {
  return (
    <Orn className={className} viewBox="0 0 280 104">
      <Mirror w={280}>
        <path d="M80 70H18" stroke="#b9cdea" strokeWidth="1.6" strokeDasharray="0 6" strokeLinecap="round" />
        <Icon d={STAR} poly x={64} y={40} size={11} fill="#ffd36e" className="si-blink" />
        <Icon d={SPARKLE} x={36} y={54} size={8} fill="#f2a7c3" className="si-blink" />
        <circle cx="12" cy="70" r="3" fill="#f2a7c3" />
      </Mirror>
      <path d="M186 14c-14 0-20 16-14 26 6 8 18 8 24 2-12 0-18-10-14-20 1-4 3-6 4-8Z" fill="#ffe08a" />
      <g className="si-swing">
        <path d="M112 74v14" stroke="#b9cdea" strokeWidth="1" />
        <Icon d={STAR} poly x={112} y={93} size={12} fill="#ffd36e" />
      </g>
      <g className="si-swing" style={{ animationDelay: "-1.5s" }}>
        <path d="M140 76v18" stroke="#b9cdea" strokeWidth="1" />
        <Icon d={HEART} x={140} y={98} size={11} fill="#f2a7c3" />
      </g>
      <g className="si-swing" style={{ animationDelay: "-.8s" }}>
        <path d="M168 74v10" stroke="#b9cdea" strokeWidth="1" />
        <Icon d={STAR} poly x={168} y={89} size={10} fill="#ffd36e" />
      </g>
      <g className="si-float">
        <path
          d="M96 76c-12 0-16-14-4-18-2-14 16-20 24-10 4-16 30-18 36-2 8-8 26-4 24 10 14 0 16 20 2 20Z"
          fill="#fff"
          stroke="#cfe0f5"
          strokeWidth="1.6"
        />
        <path d="M128 62q4 4 8 0M148 62q4 4 8 0" stroke="#7a8db0" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="124" cy="68" r="3.4" fill="#f2a7c3" opacity=".6" />
        <circle cx="160" cy="68" r="3.4" fill="#f2a7c3" opacity=".6" />
        <path d="M139 69q3 2 6 0" stroke="#7a8db0" strokeWidth="1.3" strokeLinecap="round" />
      </g>
    </Orn>
  );
}

/* ───────────── Rose Gold Hearts: interlocked rings, solitaire and floating hearts ───────────── */
export function RingsOrnament({ className }: ThemeArtProps) {
  const id = useSvgId();
  const rg = `url(#${id}rg)`;
  return (
    <Orn className={className} viewBox="0 0 280 90">
      <defs>
        <linearGradient id={`${id}rg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f7d1c4" />
          <stop offset=".5" stopColor="#b76e79" />
          <stop offset="1" stopColor="#e8b4a0" />
        </linearGradient>
      </defs>
      <Mirror w={280}>
        <path d="M104 54c-20 0-24-12-38-10-12 2-10 16-22 14-10-2-14-8-26-4" stroke={rg} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M66 44c-2-8 6-12 9-7" stroke={rg} strokeWidth="1.1" strokeLinecap="round" />
        <Icon d={HEART} x={12} y={54} size={10} fill="#b76e79" />
        <circle cx="44" cy="58" r="1.8" fill="#d4a373" />
      </Mirror>
      <circle cx="128" cy="54" r="18" stroke={rg} strokeWidth="5" />
      <circle cx="152" cy="54" r="18" stroke={rg} strokeWidth="5" />
      <path d="M138.6 39.2a18 18 0 0 1 5.6 8.6" stroke={rg} strokeWidth="5" />
      <path d="M146 33l3-5h6l3 5-6 7Z" fill="#fff" stroke="#d9a7b0" strokeWidth="1" />
      <path d="M146 33h12M152 28v12" stroke="#e9c6cc" strokeWidth=".6" />
      <Icon d={SPARKLE} x={164} y={24} size={8} fill="#fff" className="si-blink" />
      <g className="si-float">
        <Icon d={HEART} x={112} y={20} size={11} fill="#d98a96" />
      </g>
      <g className="si-float" style={{ animationDelay: "-1.6s" }}>
        <Icon d={HEART} x={176} y={12} size={8} fill="#e8b4a0" />
      </g>
      <g className="si-float" style={{ animationDelay: "-.8s" }}>
        <Icon d={HEART} x={136} y={10} size={7} fill="#b76e79" />
      </g>
    </Orn>
  );
}

/* ───────────── Home Sweet Home: house with toran, diyas and rangoli ───────────── */
function MiniRangoli({ x, y, c1, c2, c3 }: { x: number; y: number; c1: string; c2: string; c3: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse key={i} rx="3.4" ry="7.5" transform={`rotate(${i * 45}) translate(0 -7)`} fill={i % 2 ? c1 : c2} />
      ))}
      <circle r="4.5" fill={c3} />
      <circle r="1.8" fill="#fff6e0" />
    </g>
  );
}

export function HouseOrnament({ className }: ThemeArtProps) {
  return (
    <Orn className={className} viewBox="0 0 280 108">
      <Mirror w={280}>
        <path d="M76 92H14" stroke="#c2410c" strokeWidth="1.4" strokeDasharray="0 5" strokeLinecap="round" />
        <MiniRangoli x={84} y={80} c1="#f59e0b" c2="#db2777" c3="#15803d" />
        <MiniRangoli x={30} y={70} c1="#db2777" c2="#f59e0b" c3="#7c3aed" />
        <g transform="translate(104 92)">
          <path d="M-8 0c1 6 15 6 16 0Z" fill="#b45309" />
          <path d={flamePath(0, -1, 8)} fill="#f59e0b" className="si-flame" />
        </g>
      </Mirror>
      <rect x="154" y="26" width="9" height="18" fill="#9a3412" />
      <rect x="114" y="50" width="52" height="42" fill="#fff1dc" stroke="#c2410c" strokeWidth="1.4" />
      <path d="M106 53 140 22l34 31Z" fill="#c2410c" />
      <path d="M112 50 140 25l28 25" stroke="#fbbf24" strokeWidth="1.2" />
      <path d="M132 92V73c0-10 16-10 16 0v19Z" fill="#15803d" />
      <circle cx="145" cy="83" r="1.2" fill="#fbbf24" />
      {[118, 152].map((x) => (
        <g key={x}>
          <rect x={x} y="62" width="10" height="10" fill="#fbbf24" stroke="#c2410c" strokeWidth="1" />
          <path d={`M${x + 5} 62v10M${x} 67h10`} stroke="#c2410c" strokeWidth=".8" />
        </g>
      ))}
      <path d="M115 55h50" stroke="#92400e" strokeWidth=".8" />
      {[119, 125, 131, 137, 143, 149, 155, 161].map((x, i) => (
        <path key={x} d={`M${x} 55c2 3 2 6 0 9-2-3-2-6 0-9Z`} fill={i % 2 ? "#15803d" : "#22a04b"} />
      ))}
      {[122, 134, 146, 158].map((x) => (
        <circle key={x} cx={x} cy={55.5} r="1.8" fill="#f59e0b" />
      ))}
      <path d="M108 92h64" stroke="#c2410c" strokeWidth="1.4" />
    </Orn>
  );
}

/* ───────────── Graduation: mortarboard with swinging tassel and laurels ───────────── */
const LAUREL = [
  [114, 86, -8],
  [104, 83, -18],
  [95, 78, -30],
  [87, 71, -45],
  [81, 62, -60],
  [78, 52, -75],
] as const;

export function GradCapOrnament({ className }: ThemeArtProps) {
  return (
    <Orn className={className} viewBox="0 0 280 100">
      <Mirror w={280}>
        <path d="M120 88c-22-2-38-16-42-38" stroke="#c9a227" strokeWidth="1.4" />
        {LAUREL.map(([x, y, a]) => (
          <g key={x}>
            <ellipse cx={x} cy={y - 4} rx="6" ry="2.4" transform={`rotate(${a - 30} ${x} ${y - 4})`} fill="#c9a227" />
            <ellipse cx={x + 3} cy={y + 2} rx="6" ry="2.4" transform={`rotate(${a + 40} ${x + 3} ${y + 2})`} fill="#e3c35a" />
          </g>
        ))}
        <Icon d={STAR} poly x={44} y={30} size={11} fill="#e3c35a" className="si-blink" />
        <Icon d={SPARKLE} x={22} y={58} size={8} fill="#c9a227" className="si-blink" />
      </Mirror>
      <Icon d={STAR} poly x={140} y={8} size={10} fill="#e3c35a" className="si-blink" />
      <path d="M114 46v16c0 9 52 9 52 0V46l-26 9Z" fill="#13306e" />
      <path d="M140 22l44 16-44 16-44-16Z" fill="#0b1f4b" stroke="#2b4c9b" strokeWidth="1" />
      <path d="M140 38l32 6" stroke="#e3c35a" strokeWidth="1.8" />
      <circle cx="140" cy="38" r="2.6" fill="#e3c35a" />
      <g className="si-swing">
        <path d="M172 44v18" stroke="#e3c35a" strokeWidth="1.8" />
        <path d="M169 62h6l2 12h-10Z" fill="#e3c35a" />
      </g>
    </Orn>
  );
}

/* ───────────── Neon Party: glowing neon starburst ───────────── */
export function NeonOrnament({ className, c1 = "#39f3ff", c2 = "#ff2fd6", c3 = "#fff35c" }: ThemeArtProps & { c1?: string; c2?: string; c3?: string }) {
  const id = useSvgId();
  return (
    <Orn className={className} viewBox="0 0 280 80">
      <defs>
        <filter id={`${id}n`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter={`url(#${id}n)`} strokeLinecap="round" strokeLinejoin="round" className="si-neon">
        <Mirror w={280}>
          <path d="M114 40H62" stroke={c2} strokeWidth="2.2" />
          <path d="M52 40H40" stroke={c2} strokeWidth="2.2" />
          <circle cx="28" cy="40" r="3.4" stroke={c1} strokeWidth="2" />
          <path d="M84 20l6 6-6 6-6-6Z" stroke={c3} strokeWidth="1.8" />
          <circle cx="96" cy="60" r="5" stroke={c1} strokeWidth="1.8" />
        </Mirror>
        <path d="M140 14c2 16 8 24 24 26-16 2-22 10-24 26-2-16-8-24-24-26 16-2 22-10 24-26Z" stroke={c1} strokeWidth="2.4" />
        <circle cx="140" cy="40" r="3" fill={c3} />
      </g>
    </Orn>
  );
}
