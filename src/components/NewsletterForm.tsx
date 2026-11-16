"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Honeypot } from "@/components/Honeypot";
import FormPrivacyNote from "@/components/FormPrivacyNote";
import { isEmail } from "@/lib/contact";
import { track, useFormStarted, visitSource } from "@/lib/analytics";
import { JOURNAL } from "@/config/contact";

const empty = { name: "", email: "", website: "", consent: false };

/**
 * Sign-up for the Axion Index Journal, once a month (Fix Brief Part 4, step 2). No login.
 * The email joins the list only when the consent box is ticked.
 * `compact` puts name and email side by side, for the end of reading pages.
 */
export default function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const uid = useId();
  const formStarted = useFormStarted("newsletter");
  const [form, setForm] = useState(empty);
  const [touched, setTouched] = useState({ name: false, email: false, consent: false });
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  const errs = {
    name: form.name.trim().length < 2 ? "Please enter your name." : "",
    email: !isEmail(form.email) ? "Please enter a valid email address." : "",
    consent: !form.consent ? `Please tick the box to receive the ${JOURNAL.name}.` : "",
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (errs.name || errs.email || errs.consent) { setTouched({ name: true, email: true, consent: true }); return; }
    setState("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sourcePage: window.location.pathname, cameFrom: visitSource() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      track("Form sent", { form: "newsletter" });
      track("Newsletter sign-up", { source: "journal" });
      router.push("/thank-you?form=journal");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setState("error");
    }
  }

  const fields = [
    { k: "name", label: "Name", type: "text", ac: "name", ph: "Your full name" },
    { k: "email", label: "Email", type: "email", ac: "email", ph: "you@company.com" },
  ] as const;

  return (
    <form onSubmit={submit} noValidate className={`relative flex flex-col ${compact ? "gap-5" : "gap-6"}`}>
      <div className={compact ? "grid grid-cols-1 sm:grid-cols-2 gap-5" : "flex flex-col gap-6"}>
        {fields.map((f) => {
          const showErr = touched[f.k] && errs[f.k];
          const id = `journal-${uid}-${f.k}`;
          return (
            <div key={f.k} className="flex flex-col gap-2.5 min-w-0">
              <label htmlFor={id} className="font-mono text-[10px] tracking-widest uppercase text-[var(--fg-4)]">{f.label}</label>
              <input
                id={id}
                type={f.type}
                autoComplete={f.ac}
                placeholder={f.ph}
                value={form[f.k]}
                onChange={(e) => { formStarted(); setForm((s) => ({ ...s, [f.k]: e.target.value })); }}
                onBlur={() => setTouched((t) => ({ ...t, [f.k]: true }))}
                className={`bg-transparent border-b px-0 py-3 text-[var(--fg)] text-[16px] outline-none focus:border-[var(--accent)] transition-colors duration-300 placeholder:text-[var(--fg-5)] w-full ${showErr ? "border-red-400/70" : "border-[var(--line-strong)]"}`}
              />
              {showErr && <p className="text-[12px] text-red-400">{errs[f.k]}</p>}
            </div>
          );
        })}
      </div>
      <Honeypot value={form.website} onChange={(v) => setForm((s) => ({ ...s, website: v }))} />

      {/* Consent (Fix Brief Part 4, step 2): nobody joins the list without it */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer text-[14px] leading-snug text-[var(--fg-3)]">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => { formStarted(); setForm((s) => ({ ...s, consent: e.target.checked })); }}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#C9A24A] cursor-pointer"
          />
          <span>Yes, send me the {JOURNAL.name} by email, {JOURNAL.cadence}. I can unsubscribe at any time.</span>
        </label>
        {touched.consent && errs.consent && <p className="mt-1.5 text-[12px] text-red-400">{errs.consent}</p>}
      </div>

      <button
        type="submit"
        disabled={state === "sending"}
        className="self-start inline-flex items-center justify-center gap-3 px-8 py-4 font-mono text-[11px] tracking-[0.26em] uppercase font-semibold bg-[#C9A24A] text-[#0A0A0B] disabled:opacity-60 transition-transform active:scale-[0.98]"
      >
        {state === "sending" ? "Sending…" : "Sign up"}
        {state !== "sending" && <ArrowRight size={13} />}
      </button>
      {state === "error" && error && <p className="font-mono text-[11px] tracking-wide text-red-400">{error}</p>}
      <FormPrivacyNote />
    </form>
  );
}
