"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import FormPrivacyNote from "@/components/FormPrivacyNote";
import { track, useFormStarted, visitSource } from "@/lib/analytics";
import { JOURNAL } from "@/config/contact";
import { Honeypot } from "@/components/Honeypot";
import { isEmail } from "@/lib/contact";
import { MAIN_BUTTON_SHAPE } from "@/components/Button";

const empty = { name: "", email: "", organisation: "", website: "", journal: false };

/**
 * Name / email / organisation sign-up for one report. No login.
 *  • published + readable on the site → "Get future editions"
 *  • otherwise → "Send it to me" (on release, if it has a date)
 */
export default function ReportSignupForm({
  report,
  releaseLong,
  published,
  download = false,
}: {
  report: string;          // library slug, e.g. "make-or-break"
  releaseLong?: string;    // e.g. "20 November 2026"; empty when not yet dated
  published: boolean;      // true once the report can be read on the site
  download?: boolean;      // the report is out and has a PDF: "Download the report" (D7)
}) {
  const router = useRouter();
  const formStarted = useFormStarted("report", { report });
  const [form, setForm] = useState(empty);
  const [touched, setTouched] = useState({ name: false, email: false, organisation: false });
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  const errs = {
    name: form.name.trim().length < 2 ? "Please enter your name." : "",
    email: !isEmail(form.email) ? "Please enter a valid email address." : "",
    organisation: form.organisation.trim().length < 2 ? "Please enter your organisation." : "",
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (Object.values(errs).some(Boolean)) {
      setTouched({ name: true, email: true, organisation: true });
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/report-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, report, sourcePage: window.location.pathname, cameFrom: visitSource() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      track("Form sent", { form: "report", report });
      track("Report requested", { report });
      if (form.journal) track("Newsletter sign-up", { source: "report" });
      router.push(`/thank-you?form=report&report=${encodeURIComponent(report)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setState("error");
    }
  }

  const fields = [
    { k: "name", label: "Name", type: "text", ac: "name", ph: "Your full name" },
    { k: "email", label: "Work email", type: "email", ac: "email", ph: "you@company.com" },
    { k: "organisation", label: "Organisation", type: "text", ac: "organization", ph: "Your organisation" },
  ] as const;

  return (
    <form onSubmit={submit} noValidate className="relative flex flex-col gap-6">
      {fields.map((f) => {
        const showErr = touched[f.k] && errs[f.k];
        return (
          <div key={f.k} className="flex flex-col gap-2.5">
            <label className="font-mono text-[10px] tracking-widest uppercase text-[var(--fg-4)]">{f.label}</label>
            <input
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
      <Honeypot value={form.website} onChange={(v) => setForm((s) => ({ ...s, website: v }))} />

      {/* Unticked by default (Fix Brief Part 4, step 3) */}
      <label className="flex items-start gap-3 cursor-pointer text-[14px] leading-snug text-[var(--fg-3)]">
        <input
          type="checkbox"
          checked={form.journal}
          onChange={(e) => setForm((s) => ({ ...s, journal: e.target.checked }))}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#C9A24A] cursor-pointer"
        />
        <span>Also send me the monthly {JOURNAL.name}.</span>
      </label>

      <button
        type="submit"
        disabled={state === "sending"}
        className={`mt-2 inline-flex items-center justify-center gap-3 px-8 py-4 font-mono text-[11px] tracking-[0.26em] uppercase ${MAIN_BUTTON_SHAPE} font-semibold bg-[#C9A24A] text-[#0A0A0B] disabled:opacity-60 transition-transform active:scale-[0.98]`}
      >
        {state === "sending" ? "Sending…" : download ? "Download the report" : published ? "Get future editions" : releaseLong ? "Send it to me on release" : "Send it to me"}
        {state !== "sending" && <ArrowRight size={13} />}
      </button>
      {state === "error" && error && <p className="font-mono text-[11px] tracking-wide text-red-400">{error}</p>}
      <FormPrivacyNote />
    </form>
  );
}
