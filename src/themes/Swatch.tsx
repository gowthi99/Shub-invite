import type { CSSProperties } from "react";
import type { Theme } from "./types";

/**
 * Static thumbnail of a theme for gallery grids: page gradient, card surface,
 * the theme's frame (scaled down via --si-k) and ornament. No particle backdrop.
 */
export function ThemeSwatch({ theme, className = "" }: { theme: Theme; className?: string }) {
  const { palette, fonts, Ornament, Frame } = theme;
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{ background: palette.bgGradient, aspectRatio: "3 / 4", containerType: "inline-size", ["--si-k" as string]: 0.42 } as CSSProperties}
      aria-label={`${theme.name} theme preview`}
      role="img"
    >
      <div
        className="absolute inset-[9%] flex flex-col items-center justify-center gap-[6%] rounded-xl px-[8%] text-center shadow-sm"
        style={{ background: palette.card }}
      >
        <Frame />
        <Ornament className="w-[86%]" />
        <div className="w-full truncate leading-tight" style={{ fontFamily: fonts.display, color: palette.accent, fontSize: "clamp(12px, 9cqw, 22px)" }}>
          {theme.name}
        </div>
        <div className="flex w-[60%] flex-col items-center gap-[5px]" aria-hidden>
          <span className="block h-[3px] w-full rounded-full" style={{ background: palette.muted, opacity: 0.35 }} />
          <span className="block h-[3px] w-[70%] rounded-full" style={{ background: palette.muted, opacity: 0.25 }} />
        </div>
        <span className="block h-[10%] max-h-5 w-[48%] rounded-full" style={{ background: palette.button }} aria-hidden />
      </div>
    </div>
  );
}
