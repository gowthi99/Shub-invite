import type { ReactNode } from "react";
import type { Theme, ThemeArtProps } from "./types";
import { FONT } from "@/lib/fonts";
import { makeBackdrop } from "./effects/Particles";
import { patternDecor } from "./effects/patterns";
import * as O from "./art/ornaments";
import * as F from "./art/frames";

const art = <P extends ThemeArtProps>(C: (p: P) => ReactNode, extra: Omit<P, keyof ThemeArtProps>) => {
  function Art(p: ThemeArtProps) {
    return C({ ...(extra as P), ...p });
  }
  return Art;
};

/* ═════════════════════════ INDIAN WEDDING & FESTIVE ═════════════════════════ */

const royalMarigold: Theme = {
  id: "royal-marigold",
  name: "Royal Marigold",
  description: "Saffron and gold with swaying marigold garlands and a sacred kalash",
  occasions: ["wedding", "haldi", "engagement", "housewarming"],
  palette: {
    bg: "#fff4e0",
    bgGradient: "radial-gradient(120% 80% at 50% 0%,#fff8ea 0%,#ffe2b0 55%,#ffc77a 100%)",
    card: "rgba(255,251,242,0.84)",
    text: "#5a1e0b",
    muted: "#8a4b2a",
    accent: "#b8460f",
    accent2: "#c99316",
    button: "#c9561a",
    buttonText: "#ffffff",
    scratch: "#d4a017",
  },
  fonts: { display: FONT.greatVibes, body: FONT.cormorant },
  effect: "marigold",
  Backdrop: makeBackdrop({
    seed: 11,
    overlay: "radial-gradient(60% 40% at 50% 10%,rgba(255,255,255,.55),transparent 70%)",
    decor: patternDecor("jaali", "#c9561a", { opacity: 0.06 }),
    layers: [
      { shapes: ["marigold"], colors: ["#f28c18", "#ffb627", "#e8590c"], colors2: ["#ffd23f", "#ffe680"], count: 14, motion: "fall", size: [14, 24], duration: [11, 18], sway: 28, turn: "spin" },
      { shapes: ["petal"], colors: ["#ff9f1c", "#ffc93c", "#e8590c"], colors2: ["#fff"], count: 12, motion: "fall", size: [8, 13], duration: [9, 15], sway: 36, turn: "flutter", opacity: [0.7, 0.95] },
    ],
  }),
  Ornament: O.KalashOrnament,
  Frame: art(F.MarigoldToran, { corners: { c1: "#c9971c", c2: "#c9561a" } }),
};

const haldiSunshine: Theme = {
  id: "haldi-sunshine",
  name: "Haldi Sunshine",
  description: "Turmeric yellow, mango-leaf toran and showers of marigold petals",
  occasions: ["haldi", "mehndi", "housewarming", "party"],
  palette: {
    bg: "#fff7cc",
    bgGradient: "linear-gradient(170deg,#fffbe0 0%,#ffe873 55%,#ffcf33 100%)",
    card: "rgba(255,253,242,0.88)",
    text: "#4a3200",
    muted: "#7a5a12",
    accent: "#c25e00",
    accent2: "#3f8f2f",
    button: "#e07a00",
    buttonText: "#ffffff",
    scratch: "#f2b705",
  },
  fonts: { display: FONT.dancing, body: FONT.poppins },
  effect: "petals",
  Backdrop: makeBackdrop({
    seed: 23,
    overlay: "radial-gradient(70% 45% at 50% 0%,rgba(255,255,255,.7),transparent 70%)",
    decor: patternDecor("dots", "#c98a00", { opacity: 0.18 }),
    layers: [
      { shapes: ["petal"], colors: ["#ffb627", "#ff9f1c", "#ffd23f"], colors2: ["#fff"], count: 16, motion: "fall", size: [9, 15], duration: [9, 15], sway: 34, turn: "flutter" },
      { shapes: ["mangoLeaf", "marigold"], colors: ["#3c8d2f", "#4ea33b", "#ff9f1c"], colors2: ["#d6f0a8", "#ffd23f"], count: 8, motion: "fall", size: [8, 14], duration: [12, 18], sway: 40, turn: "spin" },
    ],
  }),
  Ornament: O.HaldiOrnament,
  Frame: art(F.MangoLeafToran, { bottom: "#c98a00" }),
};

const mehndiGreen: Theme = {
  id: "mehndi-green",
  name: "Mehndi Green",
  description: "Henna paisleys and lace in deep green with burnished copper",
  occasions: ["mehndi", "sangeet", "engagement", "haldi"],
  palette: {
    bg: "#0f3d2e",
    bgGradient: "radial-gradient(110% 70% at 50% 0%,#2a6b4c 0%,#14492f 50%,#0b2e20 100%)",
    card: "rgba(255,248,235,0.94)",
    text: "#2b1d0e",
    muted: "#6b4a2e",
    accent: "#a0481f",
    accent2: "#2f6b3a",
    button: "#1f5c3d",
    buttonText: "#fff8eb",
    scratch: "#b8732f",
  },
  fonts: { display: FONT.dancing, body: FONT.cormorant },
  effect: "leaves",
  Backdrop: makeBackdrop({
    seed: 37,
    decor: patternDecor("paisley", "#e2b07a", { opacity: 0.1 }),
    layers: [
      { shapes: ["leaf"], colors: ["#6fae5f", "#4f8f43", "#a3cf7d"], colors2: ["#e4f5c9"], count: 14, motion: "fall", size: [8, 13], duration: [11, 18], sway: 34, turn: "flutter", opacity: [0.6, 0.9] },
      { shapes: ["sparkle"], colors: ["#e2b07a", "#f3d3a2"], count: 12, motion: "twinkle", size: [6, 11], duration: [2.5, 5] },
    ],
  }),
  Ornament: O.PaisleyOrnament,
  Frame: F.MehndiBorder,
};

const sangeetNights: Theme = {
  id: "sangeet-nights",
  name: "Sangeet Nights",
  description: "Magenta and violet dance-floor glow with dhol beats and string lights",
  occasions: ["sangeet", "party", "reception", "engagement"],
  palette: {
    bg: "#1a0633",
    bgGradient: "radial-gradient(120% 80% at 50% 0%,#7a1060 0%,#3d0a55 45%,#14042a 100%)",
    card: "rgba(32,8,52,0.72)",
    text: "#fff4fb",
    muted: "#e3b9e8",
    accent: "#ff6fc4",
    accent2: "#ffd25e",
    button: "#ff3fae",
    buttonText: "#ffffff",
    scratch: "#c2188f",
  },
  fonts: { display: FONT.greatVibes, body: FONT.poppins },
  effect: "stars",
  Backdrop: makeBackdrop({
    seed: 41,
    overlay:
      "radial-gradient(40% 30% at 15% 20%,rgba(255,79,184,.25),transparent 70%),radial-gradient(40% 30% at 85% 35%,rgba(124,243,255,.15),transparent 70%)",
    layers: [
      { shapes: ["star", "sparkle"], colors: ["#ffd25e", "#fff4fb", "#ff9be0"], colors2: ["#ffd25e"], count: 22, motion: "twinkle", size: [5, 12], duration: [2, 4.5], glow: 4 },
      { shapes: ["note"], colors: ["#ff6fc4", "#ffd25e", "#b388ff"], count: 8, motion: "rise", size: [12, 18], duration: [14, 22], sway: 22, turn: "rock", opacity: [0.5, 0.8] },
    ],
  }),
  Ornament: O.DholOrnament,
  Frame: art(F.StringLights, { border: "#ff6fc4" }),
};

const templeGold: Theme = {
  id: "temple-gold",
  name: "Temple Gold",
  description: "South Indian temple splendour: maroon silk, zari borders, brass lamp and jasmine",
  occasions: ["wedding", "engagement", "reception", "housewarming"],
  palette: {
    bg: "#5c0f14",
    bgGradient: "radial-gradient(110% 70% at 50% 0%,#8a1a20 0%,#5c0f14 50%,#2e0508 100%)",
    card: "rgba(255,246,228,0.96)",
    text: "#4a0d10",
    muted: "#7d3b2b",
    accent: "#8f1d1d",
    accent2: "#a77b0a",
    button: "#7a1018",
    buttonText: "#ffe9a8",
    scratch: "#b8860b",
  },
  fonts: { display: FONT.cinzel, body: FONT.cormorant },
  effect: "petals",
  Backdrop: makeBackdrop({
    seed: 53,
    decor: patternDecor("kolam", "#e7c66b", { opacity: 0.1 }),
    layers: [
      { shapes: ["jasmine"], colors: ["#fffdf5", "#fff6dd"], colors2: ["#e3c35a", "#c9e07a"], count: 16, motion: "fall", size: [10, 16], duration: [11, 18], sway: 26, turn: "spin" },
      { shapes: ["sparkle"], colors: ["#ffd56b", "#ffe9a8"], count: 10, motion: "twinkle", size: [6, 10], duration: [2.5, 5], glow: 3 },
    ],
  }),
  Ornament: O.TempleLampOrnament,
  Frame: F.TempleBorder,
};

const peacockRoyale: Theme = {
  id: "peacock-royale",
  name: "Peacock Royale",
  description: "Jewel-tone teal and sapphire with shimmering peacock feathers",
  occasions: ["wedding", "reception", "engagement", "sangeet", "mehndi"],
  palette: {
    bg: "#04363d",
    bgGradient: "radial-gradient(120% 80% at 50% 0%,#0f6b73 0%,#06404a 45%,#101d4f 100%)",
    card: "rgba(255,250,240,0.94)",
    text: "#06343b",
    muted: "#3e6468",
    accent: "#0b6e78",
    accent2: "#a8841a",
    button: "#0b6e78",
    buttonText: "#fffaf0",
    scratch: "#0e7c86",
  },
  fonts: { display: FONT.playfair, body: FONT.cormorant },
  effect: "sparkles",
  Backdrop: makeBackdrop({
    seed: 61,
    overlay: "radial-gradient(50% 35% at 50% 0%,rgba(201,162,39,.22),transparent 70%)",
    decor: patternDecor("jaali", "#c9a227", { opacity: 0.07 }),
    layers: [
      { shapes: ["sparkle"], colors: ["#e6c656", "#9fe8d8", "#ffffff"], count: 22, motion: "twinkle", size: [6, 12], duration: [2.4, 5], glow: 3 },
      { shapes: ["dot"], colors: ["#3dbb8c", "#e6c656"], count: 8, motion: "rise", size: [5, 8], duration: [16, 24], sway: 20, opacity: [0.4, 0.7] },
    ],
  }),
  Ornament: O.PeacockOrnament,
  Frame: F.PeacockCorners,
};

const lotusPond: Theme = {
  id: "lotus-pond",
  name: "Lotus Pond",
  description: "Soft pink lotuses floating on a pastel pond",
  occasions: ["wedding", "engagement", "babyshower", "mehndi", "haldi", "anniversary"],
  palette: {
    bg: "#fde8ef",
    bgGradient: "linear-gradient(180deg,#fff2f6 0%,#fbdbe7 50%,#dff0e7 100%)",
    card: "rgba(255,255,255,0.82)",
    text: "#5b2142",
    muted: "#8b5672",
    accent: "#c23a72",
    accent2: "#4f8a68",
    button: "#d24f86",
    buttonText: "#ffffff",
    scratch: "#ef87b0",
  },
  fonts: { display: FONT.greatVibes, body: FONT.cormorant },
  effect: "petals",
  Backdrop: makeBackdrop({
    seed: 71,
    overlay: "radial-gradient(80% 40% at 50% 100%,rgba(127,181,154,.25),transparent 70%)",
    layers: [
      { shapes: ["petal"], colors: ["#f7a8c8", "#ef87b0", "#fbd3e2"], colors2: ["#fff"], count: 16, motion: "fall", size: [10, 16], duration: [12, 19], sway: 36, turn: "flutter", opacity: [0.65, 0.95] },
      { shapes: ["bubble"], colors: ["#7fb59a", "#d24f86"], colors2: ["#fff"], count: 6, motion: "rise", size: [10, 18], duration: [16, 24], sway: 14, opacity: [0.4, 0.7] },
    ],
  }),
  Ornament: O.LotusOrnament,
  Frame: F.LotusCorners,
};

const midnightDiya: Theme = {
  id: "midnight-diya",
  name: "Midnight Diya",
  description: "Navy night sky aglow with floating diyas and lanterns",
  occasions: ["wedding", "reception", "sangeet", "housewarming", "anniversary", "party"],
  palette: {
    bg: "#0b1736",
    bgGradient: "radial-gradient(120% 80% at 50% 100%,#3a2156 0%,#14214f 45%,#070f26 100%)",
    card: "rgba(12,20,52,0.74)",
    text: "#fff7e6",
    muted: "#cfc8e6",
    accent: "#f5b942",
    accent2: "#ff8a3d",
    button: "#f5b942",
    buttonText: "#1a1230",
    scratch: "#e0a030",
  },
  fonts: { display: FONT.cinzel, body: FONT.cormorant },
  effect: "lanterns",
  Backdrop: makeBackdrop({
    seed: 83,
    layers: [
      { shapes: ["sparkle", "dot"], colors: ["#fff7e6", "#ffe3a3"], count: 20, motion: "twinkle", size: [3, 8], duration: [2, 5], band: [2, 60] },
      { shapes: ["lantern"], colors: ["#ff8a3d", "#f5b942", "#e8590c"], colors2: ["#fff1b8"], count: 9, motion: "rise", size: [16, 26], duration: [18, 28], sway: 18, turn: "rock", glow: 6, opacity: [0.75, 1] },
      { shapes: ["diya"], colors: ["#c2410c", "#9a3412"], colors2: ["#ffc53d"], count: 5, motion: "rise", size: [18, 24], duration: [22, 30], sway: 12, glow: 5 },
    ],
  }),
  Ornament: O.DiyaOrnament,
  Frame: F.HangingLanterns,
};

/* ═════════════════════════ WESTERN / ELEGANT ═════════════════════════ */

const blushFloral: Theme = {
  id: "blush-floral",
  name: "Blush Floral",
  description: "Romantic blush roses, sage leaves and drifting petals",
  occasions: ["wedding", "engagement", "anniversary", "reception", "babyshower"],
  palette: {
    bg: "#fff5f3",
    bgGradient: "linear-gradient(165deg,#fffaf8 0%,#fde9e7 50%,#f6d3d6 100%)",
    card: "rgba(255,255,255,0.84)",
    text: "#4a2a2e",
    muted: "#85606a",
    accent: "#b0506a",
    accent2: "#6f8f6b",
    button: "#c0657a",
    buttonText: "#ffffff",
    scratch: "#e8a1ae",
  },
  fonts: { display: FONT.greatVibes, body: FONT.playfair },
  effect: "petals",
  Backdrop: makeBackdrop({
    seed: 97,
    overlay: "radial-gradient(60% 40% at 50% 0%,rgba(255,255,255,.6),transparent 70%)",
    layers: [
      { shapes: ["petal"], colors: ["#f3c2c9", "#e8a1ae", "#f9dde0", "#d9798e"], colors2: ["#fff"], count: 18, motion: "fall", size: [10, 16], duration: [11, 18], sway: 40, turn: "flutter", opacity: [0.7, 0.95] },
      { shapes: ["leaf"], colors: ["#a9c3a5", "#8fae8b"], colors2: ["#fff"], count: 5, motion: "fall", size: [7, 10], duration: [14, 20], sway: 30, turn: "flutter", opacity: [0.6, 0.85] },
    ],
  }),
  Ornament: O.FloralSwagOrnament,
  Frame: F.FloralCorners,
};

const emeraldElegance: Theme = {
  id: "emerald-elegance",
  name: "Emerald Elegance",
  description: "Gatsby-style emerald and gold art-deco glamour",
  occasions: ["reception", "wedding", "anniversary", "graduation", "party"],
  palette: {
    bg: "#022c22",
    bgGradient: "radial-gradient(120% 80% at 50% 0%,#0b5d48 0%,#04392c 50%,#011a14 100%)",
    card: "rgba(2,30,24,0.8)",
    text: "#f4ecd8",
    muted: "#bccbbb",
    accent: "#e0bd52",
    accent2: "#9fd8bf",
    button: "#d4af37",
    buttonText: "#062a20",
    scratch: "#c9a227",
  },
  fonts: { display: FONT.cinzel, body: FONT.cormorant },
  effect: "sparkles",
  Backdrop: makeBackdrop({
    seed: 101,
    decor: patternDecor("deco", "#d4af37", { opacity: 0.08 }),
    layers: [
      { shapes: ["sparkle"], colors: ["#f3d77a", "#d4af37", "#fff6d8"], count: 22, motion: "twinkle", size: [5, 12], duration: [2.2, 4.8], glow: 3 },
      { shapes: ["confettiDot"], colors: ["#d4af37", "#f3d77a"], count: 10, motion: "fall", size: [3, 5], duration: [14, 22], sway: 18, opacity: [0.5, 0.8] },
    ],
  }),
  Ornament: O.ArtDecoOrnament,
  Frame: F.ArtDecoFrame,
};

const classicIvory: Theme = {
  id: "classic-ivory",
  name: "Classic Ivory",
  description: "Minimal luxury: ivory paper, fine gold lines and timeless type",
  occasions: "all",
  palette: {
    bg: "#faf7f0",
    bgGradient: "linear-gradient(180deg,#fcfaf5 0%,#f3ede0 100%)",
    card: "rgba(255,253,248,0.96)",
    text: "#2d2a26",
    muted: "#6f675c",
    accent: "#8a6d33",
    accent2: "#2d2a26",
    button: "#2d2a26",
    buttonText: "#faf7f0",
    scratch: "#b89b5e",
  },
  fonts: { display: FONT.playfair, body: FONT.cormorant },
  effect: "sparkles",
  Backdrop: makeBackdrop({
    seed: 113,
    decor: patternDecor("grid", "#a6874a", { opacity: 0.05 }),
    layers: [{ shapes: ["sparkle"], colors: ["#c9ab6a", "#e2cf9f"], count: 12, motion: "twinkle", size: [5, 9], duration: [3, 6], opacity: [0.6, 0.9] }],
  }),
  Ornament: O.FlourishOrnament,
  Frame: F.FineLineFrame,
};

const roseGoldHearts: Theme = {
  id: "rose-gold-hearts",
  name: "Rose Gold Hearts",
  description: "Rose-gold rings and floating hearts for love stories",
  occasions: ["anniversary", "engagement", "wedding", "reception"],
  palette: {
    bg: "#fff1ee",
    bgGradient: "linear-gradient(160deg,#fff6f3 0%,#f9dfd8 50%,#ecc3bb 100%)",
    card: "rgba(255,255,255,0.82)",
    text: "#5a2e33",
    muted: "#8f6266",
    accent: "#a5535f",
    accent2: "#c58a5c",
    button: "#b76e79",
    buttonText: "#ffffff",
    scratch: "#d4a373",
  },
  fonts: { display: FONT.greatVibes, body: FONT.playfair },
  effect: "hearts",
  Backdrop: makeBackdrop({
    seed: 127,
    decor: patternDecor("hearts", "#b76e79", { opacity: 0.06 }),
    layers: [
      { shapes: ["heart"], colors: ["#d98a96", "#e8b4a0", "#b76e79", "#f3c6c0"], colors2: ["#fff"], count: 16, motion: "rise", size: [10, 18], duration: [13, 20], sway: 22, turn: "rock", opacity: [0.55, 0.9] },
      { shapes: ["sparkle"], colors: ["#e8b4a0", "#fff"], count: 10, motion: "twinkle", size: [5, 9], duration: [2.5, 5] },
    ],
  }),
  Ornament: O.RingsOrnament,
  Frame: F.HeartCorners,
};

/* ═════════════════════════ CELEBRATIONS ═════════════════════════ */

const confettiPop: Theme = {
  id: "confetti-pop",
  name: "Confetti Pop",
  description: "Bright confetti, bunting and a candle-lit cake",
  occasions: ["birthday", "party", "graduation", "babyshower"],
  palette: {
    bg: "#fff8e7",
    bgGradient: "linear-gradient(160deg,#fffbef 0%,#ffeef6 55%,#e9f9f7 100%)",
    card: "rgba(255,255,255,0.9)",
    text: "#2a1b4a",
    muted: "#6b5b8a",
    accent: "#e0216a",
    accent2: "#139c90",
    button: "#ff3d7f",
    buttonText: "#ffffff",
    scratch: "#7b5cff",
  },
  fonts: { display: FONT.fredoka, body: FONT.poppins },
  effect: "confetti",
  Backdrop: makeBackdrop({
    seed: 131,
    layers: [
      { shapes: ["confetti", "confetti", "confettiDot", "streamer"], colors: ["#ff3d7f", "#2ec4b6", "#ffb703", "#7b5cff", "#ff8a00"], count: 28, motion: "fall", size: [6, 11], duration: [7, 13], sway: 30, turn: "flutter" },
    ],
  }),
  Ornament: O.CakeOrnament,
  Frame: art(F.BuntingFrame, { border: "#7b5cff" }),
};

const balloonFiesta: Theme = {
  id: "balloon-fiesta",
  name: "Balloon Fiesta",
  description: "Playful balloons drifting up a candy-sky backdrop",
  occasions: ["birthday", "babyshower", "party", "graduation"],
  palette: {
    bg: "#e0f4ff",
    bgGradient: "linear-gradient(180deg,#d9f1ff 0%,#eef4ff 50%,#ffeef6 100%)",
    card: "rgba(255,255,255,0.9)",
    text: "#1f2a5a",
    muted: "#55608c",
    accent: "#4453e6",
    accent2: "#e86f00",
    button: "#5b6cff",
    buttonText: "#ffffff",
    scratch: "#ff5d8f",
  },
  fonts: { display: FONT.fredoka, body: FONT.poppins },
  effect: "balloons",
  Backdrop: makeBackdrop({
    seed: 149,
    layers: [
      { shapes: ["balloon"], colors: ["#ff5d8f", "#5b6cff", "#ffb703", "#2ec4b6", "#9b5de5"], colors2: ["#8a8fb8"], count: 12, motion: "rise", size: [20, 32], duration: [14, 22], sway: 20, turn: "rock", opacity: [0.75, 0.95] },
      { shapes: ["confettiDot", "star"], colors: ["#ffb703", "#ff5d8f", "#5b6cff"], colors2: ["#fff"], count: 10, motion: "twinkle", size: [5, 9], duration: [2.5, 5] },
    ],
  }),
  Ornament: O.BalloonsOrnament,
  Frame: art(F.BalloonCorners, { border: "#5b6cff" }),
};

const babyClouds: Theme = {
  id: "baby-clouds",
  name: "Baby Clouds",
  description: "Dreamy pastel clouds, bubbles and twinkling stars",
  occasions: ["babyshower", "birthday", "housewarming"],
  palette: {
    bg: "#e8f3ff",
    bgGradient: "linear-gradient(180deg,#e3f0ff 0%,#f3f0ff 50%,#fdeef6 100%)",
    card: "rgba(255,255,255,0.86)",
    text: "#34445f",
    muted: "#6b7b99",
    accent: "#4f7fc0",
    accent2: "#d9729b",
    button: "#6e9bd8",
    buttonText: "#ffffff",
    scratch: "#a9c6ef",
  },
  fonts: { display: FONT.dancing, body: FONT.fredoka },
  effect: "bubbles",
  Backdrop: makeBackdrop({
    seed: 157,
    overlay:
      "radial-gradient(35% 18% at 15% 20%,rgba(255,255,255,.9),transparent 70%),radial-gradient(40% 18% at 85% 60%,rgba(255,255,255,.8),transparent 70%),radial-gradient(30% 14% at 30% 88%,rgba(255,255,255,.8),transparent 70%)",
    layers: [
      { shapes: ["bubble"], colors: ["#8db8ec", "#f2a7c3", "#b9a7f2"], colors2: ["#fff"], count: 16, motion: "rise", size: [12, 26], duration: [12, 20], sway: 18, opacity: [0.6, 0.95] },
      { shapes: ["star", "sparkle"], colors: ["#ffd36e", "#ffe8a8"], colors2: ["#ffd36e"], count: 10, motion: "twinkle", size: [6, 11], duration: [2.5, 5] },
    ],
  }),
  Ornament: O.CloudOrnament,
  Frame: F.CloudFrame,
};

const homeSweetHome: Theme = {
  id: "home-sweet-home",
  name: "Home Sweet Home",
  description: "Griha pravesh warmth: terracotta, toran, rangoli and diyas",
  occasions: ["housewarming", "party", "anniversary"],
  palette: {
    bg: "#fff6e9",
    bgGradient: "linear-gradient(170deg,#fffaf2 0%,#ffe9cf 55%,#fbd2a8 100%)",
    card: "rgba(255,252,246,0.9)",
    text: "#4b2e16",
    muted: "#85613f",
    accent: "#b23a0b",
    accent2: "#15803d",
    button: "#c2410c",
    buttonText: "#ffffff",
    scratch: "#e07a2e",
  },
  fonts: { display: FONT.playfair, body: FONT.poppins },
  effect: "leaves",
  Backdrop: makeBackdrop({
    seed: 167,
    decor: patternDecor("kolam", "#c2410c", { opacity: 0.06 }),
    layers: [
      { shapes: ["mangoLeaf", "marigold", "petal"], colors: ["#2f7a25", "#ff9f1c", "#f59e0b", "#db2777"], colors2: ["#ffd23f", "#d6f0a8"], count: 14, motion: "fall", size: [8, 15], duration: [11, 18], sway: 30, turn: "spin", opacity: [0.7, 0.95] },
      { shapes: ["sparkle"], colors: ["#f59e0b"], count: 8, motion: "twinkle", size: [5, 9], duration: [2.5, 5] },
    ],
  }),
  Ornament: O.HouseOrnament,
  Frame: art(F.MangoLeafToran, { flower: "#f59e0b", string: "#b45309", bottom: "#c2410c" }),
};

const graduationCap: Theme = {
  id: "graduation-cap",
  name: "Graduation Cap",
  description: "Navy and gold with tossed caps, laurels and stars",
  occasions: ["graduation", "party", "birthday"],
  palette: {
    bg: "#0b1f4b",
    bgGradient: "radial-gradient(120% 80% at 50% 0%,#1d3f8a 0%,#13306e 45%,#071431 100%)",
    card: "rgba(255,255,255,0.95)",
    text: "#0b1f4b",
    muted: "#4b5b80",
    accent: "#13306e",
    accent2: "#a77d12",
    button: "#0b1f4b",
    buttonText: "#f5d27a",
    scratch: "#c9a227",
  },
  fonts: { display: FONT.cinzel, body: FONT.poppins },
  effect: "stars",
  Backdrop: makeBackdrop({
    seed: 173,
    layers: [
      { shapes: ["star", "sparkle"], colors: ["#f5d27a", "#ffffff", "#e3c35a"], colors2: ["#f5d27a"], count: 18, motion: "twinkle", size: [5, 11], duration: [2.2, 4.8], glow: 3 },
      { shapes: ["cap"], colors: ["#020a1f", "#0b1f4b"], colors2: ["#f5d27a"], count: 7, motion: "fall", size: [18, 26], duration: [12, 18], sway: 26, turn: "spin", opacity: [0.85, 1] },
      { shapes: ["confetti"], colors: ["#f5d27a", "#e3c35a", "#ffffff"], count: 10, motion: "fall", size: [4, 7], duration: [9, 14], sway: 24, turn: "flutter", opacity: [0.6, 0.9] },
    ],
  }),
  Ornament: O.GradCapOrnament,
  Frame: F.LaurelFrame,
};

const neonParty: Theme = {
  id: "neon-party",
  name: "Neon Party",
  description: "Electric neon glow for farewells, birthdays and late-night parties",
  occasions: ["party", "birthday", "sangeet", "graduation"],
  palette: {
    bg: "#07030f",
    bgGradient: "radial-gradient(100% 70% at 50% 0%,#2a0f52 0%,#12072a 50%,#05020b 100%)",
    card: "rgba(16,8,32,0.78)",
    text: "#f5f3ff",
    muted: "#bdb4e0",
    accent: "#39f3ff",
    accent2: "#ff4fe0",
    button: "#ff2fd6",
    buttonText: "#ffffff",
    scratch: "#7c3aed",
  },
  fonts: { display: FONT.dancing, body: FONT.poppins },
  effect: "confetti",
  Backdrop: makeBackdrop({
    seed: 181,
    overlay:
      "radial-gradient(40% 30% at 10% 80%,rgba(255,47,214,.18),transparent 70%),radial-gradient(40% 30% at 90% 20%,rgba(57,243,255,.16),transparent 70%)",
    decor: patternDecor("grid", "#7c3aed", { opacity: 0.12 }),
    layers: [
      { shapes: ["ring", "sparkle", "dot"], colors: ["#39f3ff", "#ff2fd6", "#fff35c", "#7cff6b"], count: 16, motion: "twinkle", size: [6, 12], duration: [1.8, 4], glow: 5 },
      { shapes: ["confetti", "streamer"], colors: ["#39f3ff", "#ff2fd6", "#fff35c"], count: 14, motion: "fall", size: [5, 9], duration: [8, 14], sway: 26, turn: "flutter", glow: 3, opacity: [0.7, 1] },
    ],
  }),
  Ornament: O.NeonOrnament,
  Frame: F.NeonFrame,
};

/* ═════════════════════════ EXTRA VARIANTS ═════════════════════════ */

const jasmineMoon: Theme = {
  id: "jasmine-moon",
  name: "Jasmine Moonlight",
  description: "Moonlit plum and silver with falling jasmine blossoms",
  occasions: ["engagement", "mehndi", "reception", "anniversary", "wedding"],
  palette: {
    bg: "#2a1838",
    bgGradient: "radial-gradient(120% 80% at 50% 0%,#5a3a73 0%,#34204a 45%,#160c22 100%)",
    card: "rgba(255,252,248,0.94)",
    text: "#2f1b3d",
    muted: "#6a5379",
    accent: "#7a3f8f",
    accent2: "#7d8aa3",
    button: "#5e2f73",
    buttonText: "#fdf8ff",
    scratch: "#9b7bb3",
  },
  fonts: { display: FONT.greatVibes, body: FONT.cormorant },
  effect: "petals",
  Backdrop: makeBackdrop({
    seed: 191,
    overlay: "radial-gradient(22% 14% at 80% 12%,rgba(255,250,230,.35),transparent 70%)",
    layers: [
      { shapes: ["jasmine"], colors: ["#ffffff", "#fbf6ff"], colors2: ["#f0d98a", "#c9e07a"], count: 16, motion: "fall", size: [10, 16], duration: [12, 19], sway: 30, turn: "spin", opacity: [0.75, 1] },
      { shapes: ["sparkle"], colors: ["#e8e2f5", "#ffffff"], count: 12, motion: "twinkle", size: [4, 8], duration: [2.5, 5], band: [2, 50] },
    ],
  }),
  Ornament: art(O.PaisleyOrnament, { color: "#8a5aa3", dark: "#4b2a5c" }),
  Frame: art(F.MehndiBorder, { color: "#8a5aa3", dark: "#4b2a5c" }),
};

const fiestaBrights: Theme = {
  id: "fiesta-brights",
  name: "Fiesta Brights",
  description: "Hot pink, sunshine and teal with confetti bunting",
  occasions: ["birthday", "party", "sangeet", "haldi"],
  palette: {
    bg: "#ff5d8f",
    bgGradient: "linear-gradient(150deg,#ff6f91 0%,#ff9671 45%,#ffc75f 100%)",
    card: "rgba(255,255,255,0.92)",
    text: "#3a1030",
    muted: "#7a4060",
    accent: "#d6246e",
    accent2: "#0f8f86",
    button: "#0f8f86",
    buttonText: "#ffffff",
    scratch: "#ff9671",
  },
  fonts: { display: FONT.dancing, body: FONT.poppins },
  effect: "confetti",
  Backdrop: makeBackdrop({
    seed: 199,
    decor: patternDecor("dots", "#ffffff", { opacity: 0.25 }),
    layers: [
      { shapes: ["confetti", "confettiDot", "streamer"], colors: ["#ffffff", "#2ec4b6", "#fff35c", "#7b5cff"], count: 24, motion: "fall", size: [6, 10], duration: [8, 13], sway: 30, turn: "flutter" },
    ],
  }),
  Ornament: art(O.NeonOrnament, { c1: "#d6246e", c2: "#0f8f86", c3: "#ffb703" }),
  Frame: art(F.BuntingFrame, { colors: ["#d6246e", "#0f8f86", "#ffb703"], line: "#3a1030" }),
};

export const ALL_THEMES: Theme[] = [
  royalMarigold,
  haldiSunshine,
  mehndiGreen,
  sangeetNights,
  templeGold,
  peacockRoyale,
  lotusPond,
  midnightDiya,
  jasmineMoon,
  blushFloral,
  emeraldElegance,
  classicIvory,
  roseGoldHearts,
  confettiPop,
  balloonFiesta,
  babyClouds,
  homeSweetHome,
  graduationCap,
  neonParty,
  fiestaBrights,
];
