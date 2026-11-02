import type { ComponentType, CSSProperties, ReactNode } from "react";
import type { ThemeArtProps } from "../types";
import { seeded, range, pick, r2 } from "./random";
import { Shape, type ShapeName } from "./shapes";
import { FxStyles } from "./styles";

export type ParticleMotion = "fall" | "rise" | "twinkle" | "bob";

export interface ParticleLayer {
  shapes: ShapeName[];
  colors: string[];
  /** Secondary colours (highlights, flames, centres). Picked independently. */
  colors2?: string[];
  count: number;
  motion: ParticleMotion;
  size: [number, number];
  /** Seconds for one full pass (fall/rise) or one twinkle/bob cycle. */
  duration: [number, number];
  /** Horizontal sway amplitude in px (fall/rise/bob). */
  sway?: number;
  /** Rotation style applied to each particle. */
  turn?: "flutter" | "spin" | "rock" | "none";
  opacity?: [number, number];
  /** Soft glow (drop-shadow blur in px) using the particle colour. Use sparingly. */
  glow?: number;
  /** Vertical band (percent of height) for twinkle/bob particles. */
  band?: [number, number];
  seed?: number;
}

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** A deterministic, CSS-animated particle field. Safe to render on the server. */
export function Particles({ layer, seed = 1 }: { layer: ParticleLayer; seed?: number }) {
  const rand = seeded((layer.seed ?? 0) * 7919 + seed * 104729 + layer.count);
  const {
    shapes,
    colors,
    colors2 = ["#ffffff"],
    count,
    motion,
    size,
    duration,
    sway = 0,
    turn = "none",
    opacity = [0.85, 1],
    glow,
    band = [4, 92],
  } = layer;

  const items: ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    // Spread x evenly with jitter so particles never clump.
    const x = r2(((i + 0.15 + rand() * 0.7) / count) * 100);
    const s = Math.round(range(rand, size));
    const d = range(rand, duration);
    const delay = r2(rand() * d);
    const name = pick(rand, shapes);
    const color = pick(rand, colors);
    const color2 = pick(rand, colors2);
    const op = range(rand, opacity);
    const swayPx = r2(sway * (0.5 + rand() * 0.5));
    const swayDur = r2(2.5 + rand() * 3);
    const rot = Math.round(rand() * 360);
    const turnDur = r2(3 + rand() * 5);
    const y = range(rand, band);

    const inner: Vars = {
      opacity: op,
      ...(glow ? { filter: `drop-shadow(0 0 ${glow}px ${color})` } : {}),
    };
    let shape: ReactNode = <Shape name={name} size={s} color={color} color2={color2} />;
    if (turn !== "none") {
      const cls = turn === "flutter" ? "si-fl" : turn === "spin" ? "si-sp" : "si-rock";
      shape = (
        <div className={cls} style={{ "--si-r": `${rot}deg`, animationDuration: `${turnDur}s`, animationDelay: `-${r2(rand() * turnDur)}s` } as Vars}>
          {shape}
        </div>
      );
    }
    if (sway > 0 && motion !== "twinkle") {
      shape = (
        <div className="si-sw" style={{ "--si-sw": `${swayPx}px`, animationDuration: `${swayDur}s`, animationDelay: `-${r2(rand() * swayDur)}s` } as Vars}>
          {shape}
        </div>
      );
    }

    if (motion === "fall" || motion === "rise") {
      items.push(
        <div
          key={i}
          className={motion === "rise" ? "si-col si-up" : "si-col"}
          style={{
            left: `${x}%`,
            width: s,
            marginLeft: -s / 2,
            animationDuration: `${d}s`,
            animationDelay: `-${delay}s`,
            "--si-y": `${y}%`,
          } as Vars}
        >
          <div style={inner}>{shape}</div>
        </div>,
      );
    } else {
      items.push(
        <div
          key={i}
          className={motion === "twinkle" ? "si-tw" : "si-bob"}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            animationDuration: `${d}s`,
            animationDelay: `-${delay}s`,
          }}
        >
          <div style={inner}>{shape}</div>
        </div>,
      );
    }
  }
  return <>{items}</>;
}

export interface BackdropConfig {
  layers: ParticleLayer[];
  /** Extra CSS background painted over the page gradient (e.g. radial glows). */
  overlay?: string;
  /** Optional static decoration (pattern, vignette...) rendered beneath the particles. */
  decor?: ComponentType;
  seed?: number;
}

/** Builds a theme Backdrop component from a declarative particle config. */
export function makeBackdrop(config: BackdropConfig): ComponentType<ThemeArtProps> {
  const Decor = config.decor;
  function Backdrop({ className = "" }: ThemeArtProps) {
    return (
      <div aria-hidden className={`si-fx absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        <FxStyles />
        {config.overlay && <div className="absolute inset-0" style={{ background: config.overlay }} />}
        {Decor && <Decor />}
        {config.layers.map((layer, i) => (
          <Particles key={i} layer={layer} seed={(config.seed ?? 1) + i * 31} />
        ))}
      </div>
    );
  }
  return Backdrop;
}
