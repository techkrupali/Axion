"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Honeypot } from "@/components/Honeypot";
import FormPrivacyNote from "@/components/FormPrivacyNote";
import { isEmail } from "@/lib/contact";
import { COUNTRY_CODES } from "@/lib/phone";
import { track, useFormStarted, visitSource } from "@/lib/analytics";
import { ASSESSMENTS, EARLY_BIRD, type AssessmentCode } from "@/config/aiEdgeLab";

/** Country suggestions (any country can still be typed). */
const COUNTRIES = COUNTRY_CODES.flatMap((c) => (c.label === "USA / Canada" ? ["United States", "Canada"] : [c.label]));

const empty = { name: "", email: "", organisation: "", role: "", country: "", website: "", consent: false };

/**
 * AI Edge Lab early-bird registration (Fix Brief Part 5, item 23): name, email, organisation,
 * role, country, which assessment, and a consent box. Saved to the separate AI Edge Lab list.
 * Styled for the AI Edge Lab page (dark, square corners).
 */
export default function AiEdgeInterestForm({ idPrefix = "ael", initialAssessment }: { idPrefix?: string; initialAssessment?: AssessmentCode }) {
  const router = useRouter();
  const formStarted = useFormStarted("ai-edge-interest");
  const [form, setForm] = useState(empty);
  const [assessment, setAssessment] = useState<AssessmentCode | "">(initialAssessment ?? "");
  const [touched, setTouched] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  const errs = {
    name: form.name.trim().length < 2 ? "Please enter your name." : "",
    email: !isEmail(form.email) ? "Please enter a valid email address." : "",
    country: form.country.trim().length < 2 ? "Please enter your country." : "",
    assessment: !assessment ? "Please choose an assessment." : "",
    consent: !form.consent ? "Please tick the box to register." : "",
  };
  const show = (k: keyof typeof errs) => (touched ? errs[k] : "");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setTouched(true);
    if (Object.values(errs).some(Boolean)) return;
    setState("sending");
    try {
      const res = await fetch("/api/ai-edge-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, assessment, sourcePage: window.location.pathname, cameFrom: visitSource() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      track("Form sent", { form: "ai-edge-interest", assessment });
      router.push("/thank-you?form=ai-edge");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setState("error");
    }
  }

  const input = (bad: string) => ({
    className: "w-full px-4 py-3.5 text-[14px] text-[#F7F6F3] outline-none placeholder:text-[#7A7870] focus:border-[#C9A24A]",
    style: { background: "rgba(247,246,243,0.04)", border: `1px solid ${bad ? "rgba(224,82,82,0.6)" : "rgba(247,246,243,0.14)"}` },
  });
  const text = (k: "name" | "email" | "organisation" | "role" | "country", ph: string, type = "text", ac?: string) => {
    const bad = k === "name" || k === "email" || k === "country" ? show(k) : "";
    return (
      <div className="min-w-0">
        <label htmlFor={`${idPrefix}-${k}`} className="sr-only">{ph}</label>
        <input
          id={`${idPrefix}-${k}`}
          type={type}
          autoComplete={ac}
          placeholder={ph}
          value={form[k]}
          list={k === "country" ? `${idPrefix}-countries` : undefined}
          onChange={(e) => { formStarted(); setForm((s) => ({ ...s, [k]: e.target.value })); }}
          {...input(bad)}
        />
        {bad && <p className="mt-1.5 text-[12px] text-red-400">{bad}</p>}
      </div>
    );
  };

  return (
    <form onSubmit={submit} noValidate className="relative flex flex-col gap-3 text-left">
      <p className="text-[13.5px] leading-[1.65] text-[#C9A24A]">{EARLY_BIRD.offer}</p>

      <fieldset className="mt-1">
        <legend className="mb-2 font-mono text-[10px] tracking-[0.16em] uppercase text-[#B0AEA8]">Which assessment?</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ASSESSMENTS.map((a) => {
            const on = assessment === a.code;
            return (
              <label key={a.code} className="flex items-start gap-2.5 px-3 py-2.5 cursor-pointer"
                style={{ border: `1px solid ${on ? "#C9A24A" : "rgba(247,246,243,0.14)"}`, background: on ? "rgba(201,162,74,0.08)" : "transparent" }}>
                <input
                  type="radio"
                  name={`${idPrefix}-assessment`}
                  value={a.code}
                  checked={on}
                  onChange={() => { formStarted(); setAssessment(a.code); }}
                  className="mt-1 accent-[#C9A24A]"
                />
                <span className="min-w-0">
                  <span className="block text-[13px] leading-snug text-[#F7F6F3]">{a.name}</span>
                  <span className="block text-[11.5px] leading-snug text-[#7A7870] mt-0.5">{a.audience}</span>
                </span>
              </label>
            );
          })}
        </div>
        {show("assessment") && <p className="mt-1.5 text-[12px] text-red-400">{show("assessment")}</p>}
      </fieldset>

      {text("name", "Your name", "text", "name")}
      {text("email", "you@company.com", "email", "email")}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {text("organisation", "Organisation (optional)", "text", "organization")}
        {text("role", "Role (optional)", "text", "organization-title")}
      </div>
      {text("country", "Country", "text", "country-name")}
      <datalist id={`${idPrefix}-countries`}>
        {COUNTRIES.map((c) => <option key={c} value={c} />)}
      </datalist>
      <Honeypot value={form.website} onChange={(v) => setForm((s) => ({ ...s, website: v }))} />

      <div>
        <label className="flex items-start gap-3 cursor-pointer text-[13px] leading-snug text-[#B0AEA8]">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => { formStarted(); setForm((s) => ({ ...s, consent: e.target.checked })); }}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#C9A24A] cursor-pointer"
          />
          <span>{EARLY_BIRD.consent}</span>
        </label>
        {show("consent") && <p className="mt-1.5 text-[12px] text-red-400">{show("consent")}</p>}
      </div>

      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-1 w-full py-3.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium disabled:opacity-60"
        style={{ background: "#C9A24A", color: "#0D0D0B" }}
      >
        {state === "sending" ? "Sending…" : "Register for early-bird access"}
      </button>
      {state === "error" && error && <p className="text-[12px] text-red-400">{error}</p>}
      <FormPrivacyNote className="text-[#7A7870]" />
    </form>
  );
}
