"use client";

import { useState } from "react";
import { COUNTRY_CODES, toPhoneDigits } from "@/lib/phone";

const LISTED = new Set(COUNTRY_CODES.map((c) => c.code));

/**
 * Optional phone number with a country-code picker, default +91 (Fix Brief Part 4, item 16).
 * `code` is the picked code ("+91"); `digits` is the number without it.
 * Looks like the boxed inputs of the conversation form; pass `fieldStyle` to match another form.
 */
export default function PhoneField({
  code,
  digits,
  onCode,
  onDigits,
  onBlur,
  error,
  label = "Phone",
  fieldStyle,
  labelClassName = "block mb-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--fg-4)]",
  idPrefix = "phone",
}: {
  code: string;
  digits: string;
  onCode: (code: string) => void;
  onDigits: (digits: string) => void;
  onBlur?: () => void;
  error?: string;
  label?: string;
  fieldStyle?: React.CSSProperties;
  labelClassName?: string;
  idPrefix?: string;
}) {
  const [other, setOther] = useState(!LISTED.has(code));
  const base: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${error ? "rgba(224,82,82,0.6)" : "rgba(255,255,255,0.08)"}`,
    colorScheme: "dark",
    ...fieldStyle,
  };
  const box = "rounded-[12px] px-3 py-3 text-[14px] text-[var(--fg)] outline-none focus:border-[rgba(201,162,74,0.5)]";

  return (
    <div>
      <label htmlFor={`${idPrefix}-number`} className={labelClassName}>
        {label} <span className="opacity-50 normal-case tracking-normal">(optional)</span>
      </label>
      <div className="flex gap-2">
        <select
          id={`${idPrefix}-country`}
          aria-label="Country code"
          value={other ? "other" : code}
          onChange={(e) => {
            if (e.target.value === "other") { setOther(true); onCode("+"); }
            else { setOther(false); onCode(e.target.value); onDigits(toPhoneDigits(digits, e.target.value)); }
          }}
          className={`${box} w-[118px] shrink-0 cursor-pointer`}
          style={base}
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.code} value={c.code} style={{ background: "#0E1018", color: "#EDEBE3" }}>
              {c.code} {c.label}
            </option>
          ))}
          <option value="other" style={{ background: "#0E1018", color: "#EDEBE3" }}>Other code…</option>
        </select>
        {other && (
          <input
            aria-label="Country code"
            value={code}
            onChange={(e) => onCode("+" + e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="+44"
            inputMode="tel"
            className={`${box} w-[76px] shrink-0`}
            style={base}
          />
        )}
        <input
          id={`${idPrefix}-number`}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={digits}
          onChange={(e) => onDigits(toPhoneDigits(e.target.value, code))}
          onBlur={onBlur}
          placeholder={code === "+91" ? "Mobile number" : "Phone number"}
          className={`${box} min-w-0 flex-1 placeholder:text-[var(--fg-5)]`}
          style={base}
        />
      </div>
      {error && <p className="mt-1.5 text-[12px] text-red-400">{error}</p>}
    </div>
  );
}
