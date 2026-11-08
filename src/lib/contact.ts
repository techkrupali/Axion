/**
 * Name / email / mobile that every public form collects at the top.
 * Used by the forms (live validation) and by the API routes (final check),
 * so both sides apply exactly the same rules.
 */

export type ContactInput = { name: string; email: string; phone: string };

export const cleanStr = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());

/** 7–15 digits; allows +, spaces, dashes, dots and brackets ("+91 98765 43210"). */
export const isPhone = (s: string) => {
  const digits = s.replace(/\D/g, "");
  return /^[+\d\s\-().]+$/.test(s.trim()) && digits.length >= 7 && digits.length <= 15;
};

export const contactErrors = (c: ContactInput) => ({
  name: c.name.trim().length < 2 ? "Please enter your name." : "",
  email: !isEmail(c.email) ? "Please enter a valid email address." : "",
  phone: !isPhone(c.phone) ? "Please enter a valid mobile number." : "",
});

export const isContactValid = (c: ContactInput) => Object.values(contactErrors(c)).every((e) => !e);

/** Server side: pull and validate the contact fields from a request body. */
export function readContact(data: Record<string, unknown>):
  | { ok: true; contact: ContactInput }
  | { ok: false; error: string } {
  const contact = {
    name: cleanStr(data.name, 120),
    email: cleanStr(data.email, 200).toLowerCase(),
    phone: cleanStr(data.phone, 30),
  };
  const errors = Object.values(contactErrors(contact)).filter(Boolean);
  return errors.length ? { ok: false, error: errors[0] } : { ok: true, contact };
}

/** Hidden "website" field: real people never see it, bots fill it in. */
export const HONEYPOT_FIELD = "website";
export const isBot = (data: Record<string, unknown>) => cleanStr(data[HONEYPOT_FIELD]).length > 0;
