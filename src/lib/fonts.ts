import {
  Playfair_Display,
  Great_Vibes,
  Cormorant_Garamond,
  Poppins,
  Cinzel,
  Dancing_Script,
  Fredoka,
  Noto_Sans_Telugu,
  Noto_Sans_Devanagari,
} from "next/font/google";

// Each font exposes a CSS variable; themes reference them as e.g. "var(--font-great-vibes)".
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-great-vibes", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-cormorant", display: "swap" });
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-poppins", display: "swap" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel", display: "swap" });
const dancing = Dancing_Script({ subsets: ["latin"], variable: "--font-dancing", display: "swap" });
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka", display: "swap" });
const telugu = Noto_Sans_Telugu({ subsets: ["telugu"], variable: "--font-telugu", display: "swap" });
const devanagari = Noto_Sans_Devanagari({ subsets: ["devanagari"], variable: "--font-devanagari", display: "swap" });

export const fontVariables = [playfair, greatVibes, cormorant, poppins, cinzel, dancing, fredoka, telugu, devanagari]
  .map((f) => f.variable)
  .join(" ");

/** Available display/body families for themes. Telugu/Devanagari fallbacks are appended automatically. */
export const FONT = {
  playfair: "var(--font-playfair), serif",
  greatVibes: "var(--font-great-vibes), cursive",
  cormorant: "var(--font-cormorant), serif",
  poppins: "var(--font-poppins), sans-serif",
  cinzel: "var(--font-cinzel), serif",
  dancing: "var(--font-dancing), cursive",
  fredoka: "var(--font-fredoka), sans-serif",
} as const;

/** Appends the right Indic script fallback so Telugu/Hindi text renders beautifully in any theme font. */
export function withScript(family: string, lang: "en" | "te" | "hi") {
  if (lang === "te") return `${family.replace(/, (serif|sans-serif|cursive)$/, "")}, var(--font-telugu), sans-serif`;
  if (lang === "hi") return `${family.replace(/, (serif|sans-serif|cursive)$/, "")}, var(--font-devanagari), sans-serif`;
  return family;
}
