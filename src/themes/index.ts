import type { Occasion } from "@/lib/types";
import type { Theme } from "./types";
import { ALL_THEMES } from "./catalog";

export type { Theme, ThemeEffect, ThemePalette, ThemeFonts, ThemeArtProps } from "./types";
export { ThemeSwatch } from "./Swatch";
/** Building blocks, exported for custom previews. */
export { makeBackdrop, Particles, type ParticleLayer } from "./effects/Particles";
export { FxStyles } from "./effects/styles";

export const THEMES: Theme[] = ALL_THEMES;

const BY_ID = new Map(THEMES.map((t) => [t.id, t]));

export function getTheme(id: string): Theme {
  return BY_ID.get(id) ?? THEMES[0];
}

/** Themes recommended for an occasion first, then the rest. */
export function themesFor(occasion: Occasion): Theme[] {
  const match = (t: Theme) => t.occasions === "all" || t.occasions.includes(occasion);
  return [...THEMES.filter(match), ...THEMES.filter((t) => !match(t))];
}
