import type { CSSProperties, ReactNode } from "react";
import type { ThemeArtProps } from "../types";
import { FxStyles, svgUrl } from "../effects/styles";
import { k, r2 } from "../effects/random";
import { ring } from "../effects/shapes";
import { Marigold, Leaf, Rose, petalPath, Feather, FeatherGradient, useSvgId, HEART, STAR, Icon, SPARKLE } from "./parts";

type Corner = "tl" | "tr" | "bl" | "br";
const FLIP: Record<Corner, string> = { tl: "none", tr: "scaleX(-1)", bl: "scaleY(-1)", br: "scale(-1,-1)" };

function FrameRoot({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div aria-hidden className={`si-frame ${className}`}>
      <FxStyles />
      {children}
    </div>
  );
}

/** Draws the same top-left corner artwork into the requested corners, mirrored. */
function Corners({ size, inset = 0, which = ["tl", "tr", "bl", "br"], children }: { size: number; inset?: number; which?: Corner[]; children: ReactNode }) {
  return (
    <>
      {which.map((c) => {
        const style: CSSProperties = {
          position: "absolute",
          width: k(size),
          height: k(size),
          transform: FLIP[c],
          [c[0] === "t" ? "top" : "bottom"]: k(inset),
          [c[1] === "l" ? "left" : "right"]: k(inset),
        };
        return (
          <div key={c} style={style}>
            {children}
          </div>
        );
      })}
    </>
  );
}

function Border({ inset, color, width = 1, radius = 14, style = "solid", opacity = 1, extra }: { inset: number; color: string; width?: number; radius?: number; style?: "solid" | "dashed" | "dotted" | "double"; opacity?: number; extra?: CSSProperties }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: k(inset),
        border: `${style === "double" ? width * 3 : width}px ${style} ${color}`,
        borderRadius: k(radius),
        opacity,
        ...extra,
      }}
    />
  );
}

/** A full-width repeating band built from an SVG tile (scales with --si-k). */
function Band({ tile, height, top, bottom, inset = 0, flip, opacity = 1 }: { tile: string; height: number; top?: number; bottom?: number; inset?: number; flip?: boolean; opacity?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: k(inset),
        right: k(inset),
        height: k(height),
        ...(top !== undefined ? { top: k(top) } : {}),
        ...(bottom !== undefined ? { bottom: k(bottom) } : {}),
        backgroundImage: svgUrl(tile),
        backgroundRepeat: "repeat-x",
        backgroundSize: "auto 100%",
        backgroundPosition: "center",
        transform: flip ? "scaleY(-1)" : undefined,
        opacity,
      }}
    />
  );
}

/* ───────── Gold filigree corners ───────── */
export function FiligreeCorners({ className, c1 = "#c9971c", c2 = "#c9561a", size = 86 }: ThemeArtProps & { c1?: string; c2?: string; size?: number }) {
  return (
    <FrameRoot className={className}>
      <Corners size={size} inset={6}>
        <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" strokeLinecap="round">
          <path d="M4 96V28C4 14 14 4 28 4h68" stroke={c1} strokeWidth="2" />
          <path d="M11 80V32c0-12 9-21 21-21h48" stroke={c1} strokeWidth="1" />
          <path d="M22 48c0-16 10-26 26-26" stroke={c2} strokeWidth="1.2" />
          <circle cx="24" cy="24" r="7" stroke={c1} strokeWidth="1.3" />
          <circle cx="24" cy="24" r="2.6" fill={c2} />
          <path d="M32 11c8 9 18 9 26 3 4-4 10-2 8 3M11 32c9 8 9 18 3 26-4 4-2 10 3 8" stroke={c1} strokeWidth="1.2" />
          <path d="M40 22c6-2 10 2 8 6M22 40c-2 6 2 10 6 8" stroke={c2} strokeWidth="1" />
          <circle cx="96" cy="4" r="2.2" fill={c1} />
          <circle cx="4" cy="96" r="2.2" fill={c1} />
          <circle cx="80" cy="11" r="1.5" fill={c2} />
          <circle cx="11" cy="80" r="1.5" fill={c2} />
        </svg>
      </Corners>
    </FrameRoot>
  );
}

/* ───────── Marigold garland (toran) hanging across the top ───────── */
function marigoldTile(c1: string, alt: string, c2: string, c3: string) {
  const outer = ring(12, 4.6)
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.1" fill="C1"/>`)
    .join("");
  const inner = ring(8, 2.2, 0.3)
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.3" fill="${c2}"/>`)
    .join("");
  const flower = (x: number, col: string) => `<g transform="translate(${x} 8)">${outer.replace(/C1/g, col)}${inner}<circle r="1.4" fill="${c3}"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="16" viewBox="0 0 32 16">${flower(8, c1)}${flower(24, alt)}</svg>`;
}

function strandTile(c: string, c2: string) {
  const outer = ring(10, 4)
    .map(([x, y]) => `<circle cx="${r2(x + 7)}" cy="${r2(y + 7)}" r="3" fill="${c}"/>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">${outer}<circle cx="7" cy="7" r="2.6" fill="${c2}"/></svg>`;
}

export function MarigoldToran({
  className,
  c1 = "#f28c18",
  c2 = "#ffd23f",
  c3 = "#c2410c",
  leaf = "#2f7a2a",
  lengths = [70, 44, 26, 14, 26, 44, 70],
  corners,
}: ThemeArtProps & { c1?: string; c2?: string; c3?: string; leaf?: string; lengths?: number[]; corners?: { c1: string; c2: string } }) {
  const band = marigoldTile(c1, "#ffb627", c2, c3);
  const strandA = svgUrl(strandTile(c1, c2));
  const strandB = svgUrl(strandTile("#ffb627", "#fff0a8"));
  return (
    <FrameRoot className={className}>
      {corners && (
        <Corners size={70} inset={6} which={["bl", "br"]}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" strokeLinecap="round">
            <path d="M4 96V40C4 20 20 4 40 4" stroke={corners.c1} strokeWidth="1.6" />
            <path d="M12 76V44c0-18 14-32 32-32" stroke={corners.c1} strokeWidth=".9" />
            <circle cx="22" cy="22" r="5" fill={corners.c2} />
          </svg>
        </Corners>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: k(-4), display: "flex", justifyContent: "space-between", padding: `0 ${k(10)}` }}>
        {lengths.map((len, i) => (
          <div
            key={i}
            className="si-swing"
            style={{ display: "flex", flexDirection: "column", alignItems: "center", transformOrigin: "50% 0", animationDelay: `-${i * 0.7}s`, animationDuration: `${3.2 + (i % 3) * 0.6}s` }}
          >
            <div style={{ width: k(14), height: k(len), backgroundImage: i % 2 ? strandB : strandA, backgroundSize: "100% auto", backgroundRepeat: "repeat-y" }} />
            <svg viewBox="0 0 14 22" style={{ width: k(14), height: k(22) }}>
              <path d="M7 0c5 6 5 14 0 22C2 14 2 6 7 0Z" fill={leaf} />
              <path d="M7 2v18" stroke="#b7e07a" strokeWidth=".7" opacity=".7" />
            </svg>
          </div>
        ))}
      </div>
      <Band tile={band} height={16} top={-6} />
    </FrameRoot>
  );
}

/* ───────── Mango-leaf toran (bandhanwar) ───────── */
function mangoTile(l1: string, l2: string, flower: string, string: string) {
  const leaf = (x: number, c: string) =>
    `<path d="M${x} 4c6 8 6 20 0 30-6-10-6-22 0-30Z" fill="${c}"/><path d="M${x} 6v26" stroke="#d6f0a8" stroke-width=".7" opacity=".7"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="36" viewBox="0 0 48 36"><path d="M0 3.5h48" stroke="${string}" stroke-width="1.6"/>${leaf(12, l1)}${leaf(36, l2)}<circle cx="24" cy="5" r="4" fill="${flower}"/><circle cx="24" cy="5" r="1.8" fill="#fff3b0"/><circle cx="0" cy="5" r="4" fill="${flower}"/><circle cx="48" cy="5" r="4" fill="${flower}"/></svg>`;
}

export function MangoLeafToran({
  className,
  l1 = "#2f7a25",
  l2 = "#4ea33b",
  flower = "#ff9f1c",
  string = "#c98a00",
  bottom,
}: ThemeArtProps & { l1?: string; l2?: string; flower?: string; string?: string; bottom?: string }) {
  return (
    <FrameRoot className={className}>
      <Band tile={mangoTile(l1, l2, flower, string)} height={34} top={-2} />
      {bottom && <Border inset={8} color={bottom} width={1.2} radius={16} style="dashed" opacity={0.55} />}
      <Corners size={44} inset={8} which={["bl", "br"]}>
        <svg viewBox="0 0 60 60" width="100%" height="100%">
          <Marigold cx={14} cy={46} r={9} c1={flower} c2="#ffd23f" c3="#b45309" />
          <Leaf x={22} y={40} rot={-40} len={22} w={5} fill={l1} />
          <Leaf x={20} y={48} rot={-8} len={20} w={4.5} fill={l2} />
        </svg>
      </Corners>
    </FrameRoot>
  );
}

/* ───────── Mehndi lace border ───────── */
export function MehndiBorder({ className, color = "#a8572a", dark = "#5c3014" }: ThemeArtProps & { color?: string; dark?: string }) {
  const dots = Array.from({ length: 7 }, (_, i) => {
    const a = (i / 6) * (Math.PI / 2);
    return [r2(4 + Math.cos(a) * 40), r2(4 + Math.sin(a) * 40)] as const;
  });
  return (
    <FrameRoot className={className}>
      <Border inset={7} color={color} width={1.4} radius={18} opacity={0.75} />
      <Border inset={12} color={color} width={1.2} radius={14} style="dotted" opacity={0.6} />
      <Corners size={64} inset={7}>
        <svg viewBox="0 0 64 64" width="100%" height="100%" fill="none" stroke={color} strokeLinecap="round">
          <path d="M4 34A30 30 0 0 1 34 4" strokeWidth="1.3" />
          <path d="M4 22A18 18 0 0 1 22 4" strokeWidth="1.1" />
          {[0, 22.5, 45, 67.5, 90].map((a) => (
            <ellipse key={a} cx="4" cy="4" rx="3" ry="8" transform={`rotate(${-a} 4 4) translate(0 12)`} strokeWidth=".9" />
          ))}
          {dots.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.4" fill={dark} stroke="none" />
          ))}
          <path d="M34 4c4 6 10 6 14 2M4 34c6 4 6 10 2 14" strokeWidth="1" />
          <circle cx="50" cy="6" r="1.6" fill={dark} stroke="none" />
          <circle cx="6" cy="50" r="1.6" fill={dark} stroke="none" />
        </svg>
      </Corners>
    </FrameRoot>
  );
}

/* ───────── Kanjivaram zari border + kolam corners ───────── */
function zariTile(gold: string, maroon: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 20 14"><rect width="20" height="2.4" fill="${gold}"/><path d="M0 14 10 3.5 20 14Z" fill="${gold}"/><path d="M4.5 14 10 8 15.5 14Z" fill="${maroon}"/><circle cx="10" cy="11.6" r="1.1" fill="${gold}"/></svg>`;
}

export function TempleBorder({ className, gold = "#c9971c", maroon = "#7a1018" }: ThemeArtProps & { gold?: string; maroon?: string }) {
  return (
    <FrameRoot className={className}>
      <Band tile={zariTile(gold, maroon)} height={13} top={8} inset={10} />
      <Band tile={zariTile(gold, maroon)} height={13} bottom={8} inset={10} flip />
      <Corners size={40} inset={24}>
        <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none" stroke={maroon} strokeWidth="1.1">
          <path d="M20 4Q36 4 36 20T20 36 4 20 20 4Z" opacity=".7" />
          <path d="M20 11 29 20 20 29 11 20Z" stroke={gold} />
          {[
            [20, 0.5],
            [39.5, 20],
            [20, 39.5],
            [0.5, 20],
            [20, 20],
          ].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r="1.5" fill={gold} stroke="none" />
          ))}
        </svg>
      </Corners>
    </FrameRoot>
  );
}

/* ───────── Peacock feather corners ───────── */
export function PeacockCorners({ className, gold = "#c9a227" }: ThemeArtProps & { gold?: string }) {
  const id = useSvgId();
  return (
    <FrameRoot className={className}>
      <Border inset={7} color={gold} width={1.2} radius={18} opacity={0.8} />
      <Border inset={11} color={gold} width={0.8} radius={14} opacity={0.45} />
      <Corners size={96} inset={-4} which={["tl", "br"]}>
        <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: "visible" }}>
          <defs>
            <FeatherGradient id={id} />
          </defs>
          <g transform="translate(8 8) rotate(140)">
            <Feather id={id} scale={0.95} />
          </g>
          <g transform="translate(8 8) rotate(110)">
            <Feather id={id} scale={0.6} />
          </g>
          <circle cx="8" cy="8" r="3.4" fill={gold} />
        </svg>
      </Corners>
    </FrameRoot>
  );
}

/* ───────── Lotus corners ───────── */
export function LotusCorners({ className, line = "#d24f86", pink = "#ef87b0", light = "#fbd3e2", leaf = "#5e9c7a" }: ThemeArtProps & { line?: string; pink?: string; light?: string; leaf?: string }) {
  return (
    <FrameRoot className={className}>
      <Border inset={8} color={line} width={1} radius={20} opacity={0.4} />
      <Corners size={84} inset={0} which={["bl", "br"]}>
        <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ transform: "scaleY(-1)" }}>
          <ellipse cx="34" cy="90" rx="26" ry="6" fill={leaf} />
          <g transform="translate(30 86)">
            {[-50, 50].map((a) => (
              <path key={a} d={petalPath(26, 9)} transform={`rotate(${a})`} fill={pink} />
            ))}
            {[-22, 22].map((a) => (
              <path key={a} d={petalPath(28, 9)} transform={`rotate(${a})`} fill={light} stroke="#fff" strokeWidth=".6" />
            ))}
            <path d={petalPath(34, 10)} fill={pink} />
          </g>
          <path d="M62 92c2-14 6-22 12-28" stroke={leaf} strokeWidth="1.4" fill="none" />
          <g transform="translate(74 64) rotate(35)">
            <path d={petalPath(14, 5)} fill={pink} />
          </g>
          <path d="M6 70c-2-20 6-40 26-52" stroke={line} strokeWidth=".9" fill="none" opacity=".5" strokeDasharray="0 4" strokeLinecap="round" />
        </svg>
      </Corners>
    </FrameRoot>
  );
}

/* ───────── Hanging lanterns (kandils) ───────── */
const LANTERNS = [
  { left: "7%", len: 44, d: "0s" },
  { left: "21%", len: 22, d: "-1.4s" },
  { left: "79%", len: 22, d: "-.7s" },
  { left: "93%", len: 44, d: "-2s" },
];

export function HangingLanterns({ className, c1 = "#f5b942", c2 = "#ff8a3d", line = "#f5b942" }: ThemeArtProps & { c1?: string; c2?: string; line?: string }) {
  return (
    <FrameRoot className={className}>
      <Border inset={8} color={line} width={1} radius={18} opacity={0.5} />
      {LANTERNS.map((l, i) => (
        <div
          key={i}
          className="si-swing"
          style={{ position: "absolute", top: 0, left: l.left, marginLeft: k(-11), transformOrigin: "50% 0", animationDelay: l.d, display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          <div style={{ width: 1, height: k(l.len), background: line, opacity: 0.8 }} />
          <svg viewBox="0 0 24 46" style={{ width: k(22), height: k(42), filter: `drop-shadow(0 0 ${k(6)} ${c2})` }}>
            <path d="M9 2h6v4H9Z" fill={c1} />
            <path d="M12 6 22 18 12 34 2 18Z" fill={c1} />
            <path d="M12 9 18.5 18 12 29 5.5 18Z" fill={c2} />
            <ellipse cx="12" cy="18" rx="3" ry="5" fill="#fff4c9" />
            <path d="M12 34v4M9 38l-1 6M12 38v7M15 38l1 6" stroke={c1} strokeWidth="1" />
          </svg>
        </div>
      ))}
    </FrameRoot>
  );
}

/* ───────── Rose corners ───────── */
export function FloralCorners({ className, rose = ["#eaa2b0", "#d9798e", "#a8485e"], rose2 = ["#f6d0d6", "#efb4be", "#c97b8b"], leaf = "#8fae8b", line = "#c0657a" }: ThemeArtProps & { rose?: string[]; rose2?: string[]; leaf?: string; line?: string }) {
  return (
    <FrameRoot className={className}>
      <Border inset={8} color={line} width={1} radius={18} opacity={0.35} />
      <Corners size={110} inset={-6} which={["tl", "br"]}>
        <svg viewBox="0 0 120 120" width="100%" height="100%">
          <path d="M30 12c30-6 52 4 84-2M12 30c-6 30 4 52-2 84" stroke={leaf} strokeWidth="1.2" fill="none" />
          <Leaf x={40} y={14} rot={-12} len={26} w={6} fill={leaf} vein="#dce8d9" />
          <Leaf x={14} y={40} rot={102} len={26} w={6} fill={leaf} vein="#dce8d9" />
          <Leaf x={60} y={14} rot={20} len={18} w={4.5} fill="#a9c3a5" />
          <Leaf x={14} y={60} rot={70} len={18} w={4.5} fill="#a9c3a5" />
          <Leaf x={30} y={30} rot={45} len={26} w={6} fill="#7d9c79" />
          <Rose cx={22} cy={22} r={17} c1={rose[0]} c2={rose[1]} c3={rose[2]} />
          <Rose cx={50} cy={12} r={9} c1={rose2[0]} c2={rose2[1]} c3={rose2[2]} />
          <Rose cx={12} cy={50} r={9} c1={rose2[0]} c2={rose2[1]} c3={rose2[2]} />
          {[
            [82, 10],
            [10, 82],
            [70, 22],
            [22, 70],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="2.4" fill="#fff" stroke={rose[0]} strokeWidth=".8" />
          ))}
        </svg>
      </Corners>
    </FrameRoot>
  );
}

/* ───────── Art-deco stepped frame ───────── */
export function ArtDecoFrame({ className, color = "#d4af37" }: ThemeArtProps & { color?: string }) {
  return (
    <FrameRoot className={className}>
      <Border inset={8} color={color} width={1} radius={2} opacity={0.85} />
      <Border inset={13} color={color} width={0.6} radius={2} opacity={0.5} />
      <Corners size={58} inset={4}>
        <svg viewBox="0 0 60 60" width="100%" height="100%" fill="none" stroke={color} strokeLinecap="square">
          <path d="M2 34V2h32" strokeWidth="2" />
          <path d="M9 24V9h15" strokeWidth="1.2" />
          <path d="M22 9a13 13 0 0 1-13 13" strokeWidth="1" />
          <path d="M9 9 19 19M9 15l6 6M15 9l6 6" strokeWidth=".7" />
          <path d="M24 22l3 3-3 3-3-3Z" fill={color} strokeWidth=".5" />
          <path d="M40 2h8M2 40v8" strokeWidth="2" />
        </svg>
      </Corners>
    </FrameRoot>
  );
}

/* ───────── Minimal fine-line frame ───────── */
export function FineLineFrame({ className, color = "#a6874a" }: ThemeArtProps & { color?: string }) {
  const diamond = (
    <svg viewBox="0 0 40 14" style={{ width: k(40), height: k(14) }}>
      <path d="M0 7h13M27 7h13" stroke={color} strokeWidth=".8" />
      <path d="M20 1 26 7 20 13 14 7Z" fill="none" stroke={color} strokeWidth="1" />
      <circle cx="20" cy="7" r="1.6" fill={color} />
    </svg>
  );
  const wrap = (pos: CSSProperties) => (
    <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", ...pos, display: "flex" }}>{diamond}</div>
  );
  return (
    <FrameRoot className={className}>
      <Border inset={9} color={color} width={1} radius={4} opacity={0.75} />
      <Border inset={13} color={color} width={0.5} radius={2} opacity={0.5} />
      {wrap({ top: k(2) })}
      {wrap({ bottom: k(2) })}
      <Corners size={16} inset={5}>
        <svg viewBox="0 0 16 16" width="100%" height="100%">
          <circle cx="8" cy="8" r="2.2" fill={color} />
        </svg>
      </Corners>
    </FrameRoot>
  );
}

/* ───────── Party bunting ───────── */
function buntingTile(colors: string[], line: string) {
  const flags = colors
    .slice(0, 3)
    .map((c, i) => `<path d="M${2 + i * 24} 3h20l-10 22Z" fill="${c}"/><path d="M${6 + i * 24} 6h12" stroke="#fff" stroke-width="1" opacity=".55"/>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="28" viewBox="0 0 72 28"><path d="M0 2.5h72" stroke="${line}" stroke-width="1.4"/>${flags}</svg>`;
}

export function BuntingFrame({ className, colors = ["#ff3d7f", "#2ec4b6", "#ffb703"], line = "#2a1b4a", border }: ThemeArtProps & { colors?: string[]; line?: string; border?: string }) {
  const dots: [number, number, string][] = [
    [14, 20, colors[0]],
    [30, 40, colors[1]],
    [10, 56, colors[2]],
    [40, 18, colors[2]],
  ];
  return (
    <FrameRoot className={className}>
      {border && <Border inset={8} color={border} width={1.5} radius={18} style="dashed" opacity={0.45} />}
      <div className="si-float" style={{ position: "absolute", left: k(10), right: k(10), top: k(4) }}>
        <Band tile={buntingTile(colors, line)} height={28} top={0} />
      </div>
      <Corners size={60} inset={6} which={["bl", "br"]}>
        <svg viewBox="0 0 60 60" width="100%" height="100%">
          {dots.map(([x, y, c], i) =>
            i % 2 ? <circle key={i} cx={x} cy={60 - y} r="3" fill={c} /> : <rect key={i} x={x} y={60 - y} width="5" height="9" rx="1" fill={c} transform={`rotate(${i * 35} ${x} ${60 - y})`} />,
          )}
        </svg>
      </Corners>
    </FrameRoot>
  );
}

/* ───────── Balloon clusters on the top corners ───────── */
export function BalloonCorners({ className, colors = ["#ff5d8f", "#5b6cff", "#ffb703"], border }: ThemeArtProps & { colors?: string[]; border?: string }) {
  const B = [
    [22, 26, colors[0]],
    [46, 18, colors[1]],
    [34, 46, colors[2]],
  ] as const;
  return (
    <FrameRoot className={className}>
      {border && <Border inset={8} color={border} width={1.5} radius={20} style="dotted" opacity={0.5} />}
      <Corners size={74} inset={-14} which={["tl", "tr"]}>
        <svg viewBox="0 0 70 110" width="100%" height="148%" style={{ overflow: "visible" }}>
          {B.map(([x, y]) => (
            <path key={`s${x}`} d={`M${x} ${y + 15}Q${x + 4} ${y + 40} 36 104`} stroke="#8a8fb8" strokeWidth=".8" fill="none" />
          ))}
          {B.map(([x, y, c], i) => (
            <g key={x} className="si-float" style={{ animationDelay: `-${i * 0.9}s` }}>
              <ellipse cx={x} cy={y} rx="12" ry="14.5" fill={c} />
              <path d={`M${x - 2.5} ${y + 17}h5l-2.5-3Z`} fill={c} />
              <ellipse cx={x - 4} cy={y - 5} rx="2.8" ry="4.6" transform={`rotate(25 ${x - 4} ${y - 5})`} fill="#fff" opacity=".45" />
            </g>
          ))}
        </svg>
      </Corners>
    </FrameRoot>
  );
}

/* ───────── Clouds and hanging stars ───────── */
export function CloudFrame({ className, star = "#ffd36e", heart = "#f2a7c3", line = "#b9cdea" }: ThemeArtProps & { star?: string; heart?: string; line?: string }) {
  const hangers = [
    { left: "9%", len: 30, icon: "star" },
    { left: "18%", len: 14, icon: "heart" },
    { left: "82%", len: 14, icon: "star" },
    { left: "91%", len: 30, icon: "heart" },
  ];
  return (
    <FrameRoot className={className}>
      <Border inset={8} color={line} width={1.5} radius={22} style="dashed" opacity={0.7} />
      {hangers.map((h, i) => (
        <div
          key={i}
          className="si-swing"
          style={{ position: "absolute", top: 0, left: h.left, marginLeft: k(-8), transformOrigin: "50% 0", animationDelay: `-${i * 0.8}s`, display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          <div style={{ width: 1, height: k(h.len), background: line }} />
          <svg viewBox="0 0 24 24" style={{ width: k(16), height: k(16) }}>
            {h.icon === "star" ? <polygon points={STAR} fill={star} /> : <path d={HEART} fill={heart} />}
          </svg>
        </div>
      ))}
      {(["left", "right"] as const).map((side) => (
        <svg
          key={side}
          viewBox="0 0 120 62"
          style={{ position: "absolute", bottom: k(-10), [side]: k(-12), width: k(110), height: k(57), transform: side === "right" ? "scaleX(-1)" : undefined }}
        >
          <path d="M8 58c-10 0-10-16 2-16 0-12 16-16 22-6 4-14 26-14 30 0 8-6 22-2 20 10 12-2 16 12 6 12Z" fill="#fff" stroke="#cfe0f5" strokeWidth="1.4" />
          <circle cx="40" cy="48" r="2.6" fill={heart} opacity=".7" />
          <circle cx="58" cy="48" r="2.6" fill={heart} opacity=".7" />
        </svg>
      ))}
    </FrameRoot>
  );
}

/* ───────── Hearts & flourish corners ───────── */
export function HeartCorners({ className, c1 = "#b76e79", c2 = "#e8b4a0" }: ThemeArtProps & { c1?: string; c2?: string }) {
  return (
    <FrameRoot className={className}>
      <Border inset={8} color={c1} width={1} radius={20} opacity={0.4} />
      <Corners size={74} inset={4}>
        <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" strokeLinecap="round">
          <path d="M6 70V30C6 16 16 6 30 6h40" stroke={c1} strokeWidth="1.4" />
          <path d="M30 14c10 0 14 8 22 6M14 30c0 10 8 14 6 22" stroke={c2} strokeWidth="1.1" />
          <Icon d={HEART} x={20} y={20} size={14} fill={c1} />
          <Icon d={HEART} x={74} y={6} size={7} fill={c2} />
          <Icon d={HEART} x={6} y={74} size={7} fill={c2} />
          <Icon d={SPARKLE} x={40} y={30} size={7} fill={c2} className="si-blink" />
        </svg>
      </Corners>
    </FrameRoot>
  );
}

/* ───────── Laurel & stars (graduation) ───────── */
export function LaurelFrame({ className, gold = "#c9a227", line = "#0b1f4b" }: ThemeArtProps & { gold?: string; line?: string }) {
  const leaves = [
    [10, 66, 70],
    [12, 56, 60],
    [16, 46, 48],
    [22, 37, 36],
    [30, 30, 24],
    [40, 25, 12],
  ];
  return (
    <FrameRoot className={className}>
      <Border inset={8} color={line} width={1.2} radius={12} opacity={0.35} />
      <Border inset={12} color={gold} width={0.8} radius={9} opacity={0.6} />
      <Corners size={70} inset={2} which={["bl", "br"]}>
        <svg viewBox="0 0 80 80" width="100%" height="100%" style={{ transform: "scaleY(-1)" }}>
          <path d="M8 76C6 50 20 28 46 22" stroke={gold} strokeWidth="1.3" fill="none" />
          {leaves.map(([x, y, a]) => (
            <g key={`${x}`}>
              <ellipse cx={x - 3} cy={y} rx="6" ry="2.4" transform={`rotate(${a + 40} ${x - 3} ${y})`} fill={gold} />
              <ellipse cx={x + 3} cy={y + 1} rx="6" ry="2.4" transform={`rotate(${a - 20} ${x + 3} ${y + 1})`} fill="#e3c35a" />
            </g>
          ))}
        </svg>
      </Corners>
      <Corners size={26} inset={18} which={["tl", "tr"]}>
        <svg viewBox="0 0 24 24" width="100%" height="100%" className="si-blink">
          <polygon points={STAR} fill={gold} />
        </svg>
      </Corners>
    </FrameRoot>
  );
}

/* ───────── Neon tube frame ───────── */
export function NeonFrame({ className, c1 = "#39f3ff", c2 = "#ff2fd6" }: ThemeArtProps & { c1?: string; c2?: string }) {
  return (
    <FrameRoot className={className}>
      <div
        className="si-neon"
        style={{
          position: "absolute",
          inset: k(7),
          borderRadius: k(18),
          border: `2px solid ${c1}`,
          boxShadow: `0 0 ${k(8)} ${c1}, inset 0 0 ${k(8)} ${c1}`,
          opacity: 0.9,
        }}
      />
      <Corners size={44} inset={0} which={["tl", "br"]}>
        <svg viewBox="0 0 44 44" width="100%" height="100%" style={{ overflow: "visible", filter: `drop-shadow(0 0 3px ${c2}) drop-shadow(0 0 6px ${c2})` }}>
          <path d="M3 30V12a9 9 0 0 1 9-9h18" stroke={c2} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <circle cx="36" cy="3" r="2" fill={c2} />
          <circle cx="3" cy="36" r="2" fill={c2} />
        </svg>
      </Corners>
    </FrameRoot>
  );
}

/* ───────── Festoon string lights ───────── */
const LIGHT_POINTS = Array.from({ length: 17 }, (_, i) => {
  const t = i / 16;
  return { x: r2(t * 100), y: r2(12 + 58 * Math.abs(Math.sin(t * Math.PI * 2))) };
});

export function StringLights({ className, colors = ["#ffd25e", "#ff4fb8", "#7cf3ff", "#b388ff"], wire = "#e3b9e8", border }: ThemeArtProps & { colors?: string[]; wire?: string; border?: string }) {
  return (
    <FrameRoot className={className}>
      {border && <Border inset={8} color={border} width={1} radius={18} opacity={0.45} />}
      <div style={{ position: "absolute", left: k(6), right: k(6), top: k(-2), height: k(40) }}>
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {LIGHT_POINTS.slice(1).map((p, i) => (
            <line key={i} x1={`${LIGHT_POINTS[i].x}%`} y1={`${LIGHT_POINTS[i].y}%`} x2={`${p.x}%`} y2={`${p.y}%`} stroke={wire} strokeWidth="1.1" opacity=".8" />
          ))}
        </svg>
        {LIGHT_POINTS.map((p, i) =>
          i % 16 === 0 ? null : (
            <div
              key={i}
              className="si-blink"
              style={{
                position: "absolute",
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: k(7),
                height: k(10),
                marginLeft: k(-3.5),
                marginTop: k(1),
                borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
                background: colors[i % colors.length],
                boxShadow: `0 0 ${k(8)} ${k(2)} ${colors[i % colors.length]}`,
                animationDelay: `-${(i * 0.37) % 2.4}s`,
              }}
            />
          ),
        )}
      </div>
    </FrameRoot>
  );
}

/* re-export for theme files that compose their own */
export { Corners, Border, Band, FrameRoot };
