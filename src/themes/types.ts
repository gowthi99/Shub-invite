import type { ComponentType } from "react";
import type { Occasion } from "@/lib/types";

export type ThemeEffect =
  | "petals" // falling rose/marigold petals
  | "marigold" // swaying marigold garlands + falling flowers
  | "confetti"
  | "sparkles" // twinkling gold sparkles
  | "lanterns" // floating diyas / sky lanterns
  | "bubbles"
  | "balloons"
  | "hearts"
  | "stars"
  | "leaves"
  | "none";

export interface ThemePalette {
  bg: string; // page background base colour
  bgGradient: string; // full CSS background value (gradients allowed)
  card: string; // card surface (may be rgba for glass)
  text: string; // primary text
  muted: string; // secondary text
  accent: string; // headings, borders, highlights
  accent2: string; // secondary accent
  button: string; // primary button background
  buttonText: string;
  scratch: string; // scratch-card cover colour/gradient start (solid CSS colour)
}

export interface ThemeFonts {
  display: string; // CSS font-family for names/headline (must be one of the families in fonts.ts)
  body: string; // CSS font-family for body
}

export interface ThemeArtProps {
  className?: string;
}

export interface Theme {
  id: string; // kebab-case, stable – stored in InviteData.themeId
  name: string; // "Royal Marigold"
  description: string; // one line for the gallery
  occasions: Occasion[] | "all"; // where this theme is offered first
  palette: ThemePalette;
  fonts: ThemeFonts;
  effect: ThemeEffect;
  /** Full-bleed animated background layer (absolutely positioned, pointer-events none). */
  Backdrop: ComponentType<ThemeArtProps>;
  /** Ornament drawn above/below the names (SVG; e.g. ganesha-style motif, floral swag, balloons). */
  Ornament: ComponentType<ThemeArtProps>;
  /** Corner/frame decoration around the main card. */
  Frame: ComponentType<ThemeArtProps>;
}
