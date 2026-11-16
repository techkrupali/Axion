/**
 * Name / email / phone that every public form collects.
 * Used by the forms (live validation) and by the API routes (final check),
 * so both sides apply exactly the same rules.
 *
 * Phone (Fix Brief Part 4, item 16): optional and international. `phoneCountry` is the
 * code picked from the list (default +91); `phone` is the digits only.
 */
import { DEFAULT_COUNTRY_CODE, formatPhone, phoneError } from "@/lib/phone";

export type ContactInput = { name: string; email: string; phone: string; phoneCountry?: string };

export const cleanStr = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());

export const contactErrors = (c: ContactInput) => ({
  name: c.name.trim().length < 2 ? "Please enter your name." : "",
  email: !isEmail(c.email) ? "Please enter a valid email address." : "",
  phone: phoneError(c.phoneCountry || DEFAULT_COUNTRY_CODE, c.phone),
});

export const isContactValid = (c: ContactInput) => Object.values(contactErrors(c)).every((e) => !e);

/** Server side: pull and validate the contact fields. `phone` comes back formatted ("+91 9876543210") or "". */
export function readContact(data: Record<string, unknown>):
  | { ok: true; contact: { name: string; email: string; phone: string } }
  | { ok: false; error: string } {
  const code = cleanStr(data.phoneCountry, 6) || DEFAULT_COUNTRY_CODE;
  const digits = cleanStr(data.phone, 30).replace(/[\s-]/g, "");
  const input = { name: cleanStr(data.name, 120), email: cleanStr(data.email, 200).toLowerCase(), phone: digits, phoneCountry: code };
  const errors = Object.values(contactErrors(input)).filter(Boolean);
  if (errors.length) return { ok: false, error: errors[0] };
  return { ok: true, contact: { name: input.name, email: input.email, phone: formatPhone(code, digits) } };
}

/** Hidden "website" field: real people never see it, bots fill it in. */
export const HONEYPOT_FIELD = "website";
export const isBot = (data: Record<string, unknown>) => cleanStr(data[HONEYPOT_FIELD]).length > 0;
