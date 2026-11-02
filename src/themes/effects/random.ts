/** Deterministic PRNG (mulberry32). Same seed => same sequence on server and client. */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Round to 2 decimals so serialized styles are short and stable. */
export const r2 = (n: number) => Math.round(n * 100) / 100;

export function range(rand: () => number, [min, max]: readonly [number, number]) {
  return r2(min + rand() * (max - min));
}

export function pick<T>(rand: () => number, list: readonly T[]): T {
  return list[Math.floor(rand() * list.length) % list.length];
}

/** Frame sizes scale with the CSS variable --si-k (default 1) so frames can shrink inside thumbnails. */
export const k = (px: number) => `calc(${px}px * var(--si-k, 1))`;
