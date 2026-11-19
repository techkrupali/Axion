"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { track, useFormStarted, visitSource } from "@/lib/analytics";
import { Honeypot } from "@/components/Honeypot";
import { isEmail } from "@/lib/contact";
import { MAIN_BUTTON_SHAPE } from "@/components/Button";
import ReportShare from "@/components/reports/ReportShare";

type Text = {
  heading: string; text: string; optIn: string; button: string; smallPrint: string;
  thanksHeading: string; thanksText: string;
};

/**
 * The report download (Nitin, 19 Nov): name and work email required, organisation optional, an
 * unticked opt-in. On submit the PDF starts downloading at once (the reader never waits for the
 * email); the details are saved and the email is sent in the background; the form becomes a
 * thank-you with share buttons. GA4: download_form_open, download_form_submit, pdf_download.
 */
export default function ReportDownloadForm({ report, pdf, fileName, pageUrl, shareText, t }: {
  report: string; pdf: string; fileName: string; pageUrl: string; shareText: string; t: Text;
}) {
  const formStarted = useFormStarted("report", { report });
  const [form, setForm] = useState({ name: "", email: "", organisation: "", website: "", journal: false });
  const [touched, setTouched] = useState({ name: false, email: false });
  const [state, setState] = useState<"idle" | "done">("idle");
  const [emailFailed, setEmailFailed] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  // "Download form shown": once, when the form scrolls into view (or the hero button brings it there)
  useEffect(() => {
    const el = box.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { track("download_form_open", { report }); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [report]);

  const errs = {
    name: form.name.trim().length < 2 ? "Please enter your name." : "",
    email: !isEmail(form.email) ? "Please enter a valid work email." : "",
  };

  function startDownload() {
    const a = document.createElement("a");
    a.href = pdf;
    a.download = fileName;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (errs.name || errs.email) { setTouched({ name: true, email: true }); return; }
    // 1. The download starts now, inside the click, so no browser blocks it
    startDownload();
    track("download_form_submit", { report, journal: form.journal });
    track("pdf_download", { report });
    track("Form sent", { form: "report", report });
    if (form.journal) track("Newsletter sign-up", { source: "report" });
    setState("done");
    // 2. Save the details and send the email in the background
    fetch("/api/report-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, report, download: true, sourcePage: window.location.pathname, cameFrom: visitSource() }),
    })
      .then((r) => r.json().catch(() => ({})).then((d) => { if (!r.ok || !d.ok) setEmailFailed(true); }))
      .catch(() => setEmailFailed(true));
  }

  const input = (bad: boolean) =>
    `bg-transparent border-b px-0 py-3 text-[var(--fg)] text-[16px] outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--fg-5)] w-full ${bad ? "border-red-400/70" : "border-[var(--line-strong)]"}`;
  const label = "font-mono text-[10px] tracking-widest uppercase text-[var(--fg-4)]";

  return (
    <div ref={box} className="w-full max-w-[560px] mx-auto rounded-[24px] border border-[var(--line-gold)] bg-[rgba(201,162,74,0.03)] p-7 sm:p-10">
      {state === "done" ? (
        <div role="status" aria-live="polite">
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--accent)]">Thank you</span>
          <h2 className="font-display font-medium text-[clamp(32px,3.4vw,42px)] leading-tight text-[var(--fg)] mt-3">{t.thanksHeading}</h2>
          <p className="text-[16px] leading-[1.7] text-[var(--fg-3)] mt-4">{t.thanksText}</p>
          {emailFailed && (
            <p className="text-[14px] leading-[1.6] text-[var(--fg-4)] mt-3">
              We couldn&apos;t send the email copy just now, but your download has started. If it didn&apos;t, <a href={pdf} download={fileName} className="text-[var(--accent)] underline underline-offset-2">download it here</a>.
            </p>
          )}
          <div className="mt-7">
            <ReportShare url={pageUrl} text={shareText} channels={["LinkedIn", "WhatsApp"]} report={report} size="lg" />
          </div>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="flex flex-col gap-6">
          <div>
            <h2 className="font-display font-medium text-[clamp(32px,3.4vw,42px)] leading-tight text-[var(--fg)]">{t.heading}</h2>
            <p className="text-[15.5px] leading-[1.7] text-[var(--fg-3)] mt-3">{t.text}</p>
          </div>

          <div className="flex flex-col gap-2.5">
            <label htmlFor="report-name" className={label}>Name</label>
            <input id="report-name" type="text" autoComplete="name" placeholder="Your full name" required
              value={form.name} onChange={(e) => { formStarted(); setForm((s) => ({ ...s, name: e.target.value })); }}
              onBlur={() => setTouched((x) => ({ ...x, name: true }))} className={input(!!(touched.name && errs.name))} />
            {touched.name && errs.name && <p className="text-[12px] text-red-400">{errs.name}</p>}
          </div>
          <div className="flex flex-col gap-2.5">
            <label htmlFor="report-email" className={label}>Work email</label>
            <input id="report-email" type="email" autoComplete="email" inputMode="email" placeholder="you@company.com" required
              value={form.email} onChange={(e) => { formStarted(); setForm((s) => ({ ...s, email: e.target.value })); }}
              onBlur={() => setTouched((x) => ({ ...x, email: true }))} className={input(!!(touched.email && errs.email))} />
            {touched.email && errs.email && <p className="text-[12px] text-red-400">{errs.email}</p>}
          </div>
          <div className="flex flex-col gap-2.5">
            <label htmlFor="report-org" className={label}>Organisation <span className="normal-case tracking-normal opacity-70">(optional)</span></label>
            <input id="report-org" type="text" autoComplete="organization" placeholder="Your organisation"
              value={form.organisation} onChange={(e) => setForm((s) => ({ ...s, organisation: e.target.value }))} className={input(false)} />
          </div>
          <Honeypot value={form.website} onChange={(v) => setForm((s) => ({ ...s, website: v }))} />

          {/* Unticked by default: only those who tick it join the Journal list */}
          <label className="flex items-start gap-3 cursor-pointer text-[14.5px] leading-snug text-[var(--fg-3)]">
            <input type="checkbox" checked={form.journal} onChange={(e) => setForm((s) => ({ ...s, journal: e.target.checked }))}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#C9A24A] cursor-pointer" />
            <span>{t.optIn}</span>
          </label>

          <button type="submit" className={`inline-flex items-center justify-center gap-3 px-8 py-4 min-h-[52px] font-mono text-[11px] tracking-[0.24em] uppercase font-semibold ${MAIN_BUTTON_SHAPE} bg-[#C9A24A] text-[#0A0A0B] hover:bg-[#d6b25c] transition-colors active:scale-[0.98]`}>
            {t.button} <span aria-hidden>↓</span>
          </button>
          <p className="text-[13px] leading-[1.6] text-[var(--fg-4)]">
            {t.smallPrint}{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-[var(--accent)]">Privacy policy</Link>.
          </p>
        </form>
      )}
    </div>
  );
}
