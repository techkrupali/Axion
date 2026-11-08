/**
 * Tiny in-memory rate limit for the public forms, so a bot can't flood the
 * owner's inbox. Works for the single `next start` process on the VPS
 * (it resets on restart, which is fine for this purpose).
 */
const hits = new Map<string, number[]>();

export function isRateLimited(req: Request, bucket: string, limit = 6, windowMs = 10 * 60_000): boolean {
  const ip =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);

  // Keep memory bounded
  if (hits.size > 5000) {
    for (const [k, times] of hits) if (!times.some((t) => now - t < windowMs)) hits.delete(k);
  }
  return false;
}
