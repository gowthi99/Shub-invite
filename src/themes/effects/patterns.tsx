import type { ComponentType } from "react";
import { svgUrl } from "./styles";

/** Faint repeating background tiles used beneath particles for texture. */
export const tiles = {
  paisley: (c: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72" fill="none" stroke="${c}" stroke-width="1.1"><path d="M14 40c6 0 11 3 17 2 7-1 10-7 7-12-3-5-11-4-12 1-2 5 3 8 6 6"/><path d="M50 4c4 0 7 2 11 1"/><circle cx="58" cy="52" r="5"/><circle cx="58" cy="52" r="1.6" fill="${c}"/><path d="M58 40v-4M58 64v4M46 52h-4M70 52h4"/><circle cx="8" cy="10" r="1.3" fill="${c}"/><circle cx="34" cy="62" r="1.3" fill="${c}"/></svg>`,
  kolam: (c: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none" stroke="${c}" stroke-width="1"><circle cx="14" cy="14" r="1.6" fill="${c}"/><circle cx="42" cy="14" r="1.6" fill="${c}"/><circle cx="14" cy="42" r="1.6" fill="${c}"/><circle cx="42" cy="42" r="1.6" fill="${c}"/><circle cx="28" cy="28" r="1.6" fill="${c}"/><path d="M28 18c6 0 10 4 10 10s-4 10-10 10-10-4-10-10 4-10 10-10Z"/><path d="M4 14c0-6 4-10 10-10s10 4 10 10M32 14c0-6 4-10 10-10s10 4 10 10M4 42c0 6 4 10 10 10s10-4 10-10M32 42c0 6 4 10 10 10s10-4 10-10"/></svg>`,
  jaali: (c: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="${c}" stroke-width="1"><path d="M20 0 40 20 20 40 0 20Z"/><circle cx="20" cy="20" r="4"/><circle cx="0" cy="0" r="2" fill="${c}"/><circle cx="40" cy="40" r="2" fill="${c}"/><circle cx="40" cy="0" r="2" fill="${c}"/><circle cx="0" cy="40" r="2" fill="${c}"/></svg>`,
  deco: (c: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="40" viewBox="0 0 64 40" fill="none" stroke="${c}" stroke-width="1"><path d="M0 40a32 32 0 0 1 64 0M10 40a22 22 0 0 1 44 0M20 40a12 12 0 0 1 24 0"/><path d="M32 8v32"/></svg>`,
  dots: (c: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><circle cx="4" cy="4" r="1.6" fill="${c}"/><circle cx="18" cy="18" r="1.2" fill="${c}"/></svg>`,
  hearts: (c: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="${c}"><path transform="translate(8 8) scale(.5)" d="M12 21C5 15 1 11.5 1 7.5 1 4.4 3.4 2 6.4 2c2.2 0 4.2 1.3 5.6 3.2C13.4 3.3 15.4 2 17.6 2 20.6 2 23 4.4 23 7.5c0 4-4 7.5-11 13.5Z"/><path transform="translate(38 36) scale(.36)" d="M12 21C5 15 1 11.5 1 7.5 1 4.4 3.4 2 6.4 2c2.2 0 4.2 1.3 5.6 3.2C13.4 3.3 15.4 2 17.6 2 20.6 2 23 4.4 23 7.5c0 4-4 7.5-11 13.5Z"/></svg>`,
  grid: (c: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="${c}" stroke-width=".8"><path d="M36 0H0v36"/></svg>`,
};

export type TileName = keyof typeof tiles;

/** A static full-bleed tiled pattern with optional vignette. */
export function patternDecor(tile: TileName, color: string, opts: { opacity?: number; size?: number; vignette?: string } = {}): ComponentType {
  const { opacity = 0.12, size, vignette } = opts;
  const bg = svgUrl(tiles[tile](color));
  function Decor() {
    return (
      <>
        <div
          className="absolute inset-0"
          style={{ backgroundImage: bg, backgroundSize: size ? `${size}px auto` : undefined, opacity }}
        />
        {vignette && <div className="absolute inset-0" style={{ background: vignette }} />}
      </>
    );
  }
  return Decor;
}
