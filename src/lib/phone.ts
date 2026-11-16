/**
 * Phone numbers (Fix Brief Part 4, item 16): optional, international, country code
 * picked from a list (default +91). Shared by the forms and the API routes.
 */
export const DEFAULT_COUNTRY_CODE = "+91";

/** Common codes for Axion Index's audience; "Other" lets the visitor type any code. */
export const COUNTRY_CODES: { code: string; label: string }[] = [
  { code: "+91", label: "India" },
  { code: "+971", label: "UAE" },
  { code: "+966", label: "Saudi Arabia" },
  { code: "+974", label: "Qatar" },
  { code: "+968", label: "Oman" },
  { code: "+965", label: "Kuwait" },
  { code: "+973", label: "Bahrain" },
  { code: "+65", label: "Singapore" },
  { code: "+60", label: "Malaysia" },
  { code: "+62", label: "Indonesia" },
  { code: "+66", label: "Thailand" },
  { code: "+63", label: "Philippines" },
  { code: "+84", label: "Vietnam" },
  { code: "+852", label: "Hong Kong" },
  { code: "+86", label: "China" },
  { code: "+81", label: "Japan" },
  { code: "+82", label: "South Korea" },
  { code: "+61", label: "Australia" },
  { code: "+64", label: "New Zealand" },
  { code: "+44", label: "United Kingdom" },
  { code: "+353", label: "Ireland" },
  { code: "+49", label: "Germany" },
  { code: "+33", label: "France" },
  { code: "+31", label: "Netherlands" },
  { code: "+41", label: "Switzerland" },
  { code: "+34", label: "Spain" },
  { code: "+39", label: "Italy" },
  { code: "+46", label: "Sweden" },
  { code: "+1", label: "USA / Canada" },
  { code: "+55", label: "Brazil" },
  { code: "+27", label: "South Africa" },
  { code: "+234", label: "Nigeria" },
  { code: "+254", label: "Kenya" },
  { code: "+20", label: "Egypt" },
  { code: "+94", label: "Sri Lanka" },
  { code: "+880", label: "Bangladesh" },
  { code: "+977", label: "Nepal" },
];

export const isCountryCode = (v: string) => /^\+\d{1,4}$/.test(v);

/** Keep the number to digits as the visitor types. For India a pasted "+91 98765 43210" or "098765 43210" becomes 10 digits. */
export function toPhoneDigits(v: string, code = DEFAULT_COUNTRY_CODE) {
  let d = v.replace(/\D/g, "");
  if (code === "+91") {
    if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
    else if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
    return d.slice(0, 10);
  }
  const cc = code.replace("+", "");
  if (cc && d.startsWith(cc) && d.length > cc.length + 6) d = d.slice(cc.length); // pasted with its code
  return d.slice(0, 14);
}

/** Empty is fine (the number is optional). India: exactly 10 digits. Elsewhere: 6 to 14 digits. */
export function phoneError(code: string, digits: string): string {
  if (!digits) return "";
  if (!isCountryCode(code)) return "Please choose a valid country code.";
  if (!/^\d+$/.test(digits)) return "Please use numbers only.";
  if (code === "+91" && digits.length !== 10) return "Indian mobile numbers have 10 digits.";
  if (digits.length < 6 || digits.length > 14) return "Please check the number.";
  return "";
}

/** "+91 9876543210", or "" when no number was given. */
export const formatPhone = (code: string, digits: string) => (digits ? `${code} ${digits}` : "");
