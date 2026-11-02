// Best-effort, in-memory fixed-window rate limiter.
// NOTE: state lives in the memory of a single server instance. On Vercel each serverless /
// fluid-compute instance keeps its own counters, so this only slows down naive abuse; use a
// shared store (e.g. Upstash Redis) if you need a strict global limit.

interface Bucket {
  count: number;
  resetAt: number;
}

const g = globalThis as unknown as { __rateLimit?: Map<string, Bucket> };
const buckets = (g.__rateLimit ??= new Map<string, Bucket>());
const MAX_KEYS = 10_000;

function prune(now: number) {
  for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
}

/** Returns true if the action identified by `key` is allowed (and records it). */
export function rateLimit(key: string, limit = 10, windowMs = 60_000): boolean {
  const now = Date.now();
  if (buckets.size > MAX_KEYS) prune(now);
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (b.count >= limit) return false;
  b.count++;
  return true;
}
