import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * A short signed note that "this email just registered" (AI Edge Lab Step 1 → Step 2), so the
 * organisation question can only be answered by the person who registered. Signed with AUTH_SECRET.
 */
const key = () => {
  const s = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set");
  return s;
};
const b64 = (s: string) => Buffer.from(s, "utf8").toString("base64url");
const mac = (body: string) => createHmac("sha256", key()).update(`ael-org:${body}`).digest("base64url");

export function signEmail(email: string, now = Date.now()): string {
  const body = `${b64(email)}.${now}`;
  return `${body}.${mac(body)}`;
}

/** The email, if the token is genuine and younger than maxAgeMs (default 24 hours). */
export function verifyEmail(token: unknown, maxAgeMs = 24 * 60 * 60 * 1000, now = Date.now()): string | null {
  if (typeof token !== "string" || token.length > 600) return null;
  const [e, ts, sig] = token.split(".");
  if (!e || !ts || !sig) return null;
  const expected = Buffer.from(mac(`${e}.${ts}`));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  const at = Number(ts);
  if (!Number.isFinite(at) || now - at > maxAgeMs || at - now > 60_000) return null;
  return Buffer.from(e, "base64url").toString("utf8");
}
