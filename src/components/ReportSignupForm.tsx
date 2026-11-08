"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Honeypot } from "@/components/Honeypot";
import { isEmail } from "@/lib/contact";

const empty = { name: "", email: "", organisation: "", website: "" };

/** Name / email / organisation sign-up for the Global AI Report. No login. */
export default function ReportSignupForm({ releaseLong, published }: { releaseLong: string; published: boolean }) {
  const [form, setForm] = useState(empty);
  const [touched, setTouched] = useState({ name: false, email: false, organisation: false });
  const [state, setState] = useState<"idle" | "sending" | "done" | "already" | "error">("idle");
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
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setState(data.already ? "already" : "done");
      setForm(empty);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setState("error");
    }
  }

  if (state === "done" || state === "already") {
    return (
      <div className="text-center py-6">
        <div className="w-14 h-14 rounded-2xl bg-[#C9A24A]/10 border border-[#C9A24A]/25 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-7 h-7 text-[#C9A24A]" />
        </div>
        <h3 className="font-serif text-[26px] leading-tight text-[var(--fg)] mb-3">
          {state === "already" ? "You're already on the list." : "You're on the list."}
        </h3>
        <p className="text-[15px] leading-[1.7] text-[var(--fg-4)]">
          {published
            ? "We'll send you future editions as they're published."
            : <>We&apos;ll send the report to your inbox on <span className="text-[#C9A24A]">{releaseLong}</span>.</>}
        </p>
      </div>
    );
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
              onChange={(e) => setForm((s) => ({ ...s, [f.k]: e.target.value }))}
              onBlur={() => setTouched((t) => ({ ...t, [f.k]: true }))}
              className={`bg-transparent border-b px-0 py-3 text-[var(--fg)] text-[16px] outline-none focus:border-[var(--accent)] transition-colors duration-300 placeholder:text-[var(--fg-5)] w-full ${showErr ? "border-red-400/70" : "border-[var(--line-strong)]"}`}
            />
            {showErr && <p className="text-[12px] text-red-400">{errs[f.k]}</p>}
          </div>
        );
      })}
      <Honeypot value={form.website} onChange={(v) => setForm((s) => ({ ...s, website: v }))} />

      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-2 inline-flex items-center justify-center gap-3 px-8 py-4 font-mono text-[11px] tracking-[0.26em] uppercase rounded-full font-semibold bg-[#C9A24A] text-[#0A0A0B] disabled:opacity-60 transition-transform active:scale-[0.98]"
      >
        {state === "sending" ? "Sending…" : published ? "Get future editions" : "Send it to me on release"}
        {state !== "sending" && <ArrowRight size={13} />}
      </button>
      {state === "error" && error && <p className="font-mono text-[11px] tracking-wide text-red-400">{error}</p>}
      <p className="text-[12px] leading-relaxed text-[var(--fg-5)]">No login, no spam. We only use your details to send you the report.</p>
    </form>
  );
}
