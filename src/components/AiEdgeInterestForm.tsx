"use client";

import { useState } from "react";
import { Honeypot } from "@/components/Honeypot";
import FormPrivacyNote from "@/components/FormPrivacyNote";
import { isEmail } from "@/lib/contact";
import { COUNTRY_CODES } from "@/lib/phone";
import { track, useFormStarted, visitSource } from "@/lib/analytics";
import { ASSESSMENTS, EARLY_BIRD, HEADCOUNT_BANDS, ORG_ASSESSMENT, TRACKS, isTrackCode, type AssessmentCode, type TrackCode } from "@/config/aiEdgeLab";

/** Country suggestions (any country can still be typed). */
const COUNTRIES = COUNTRY_CODES.flatMap((c) => (c.label === "USA / Canada" ? ["United States", "Canada"] : [c.label]));

const empty = { name: "", email: "", organisation: "", role: "", country: "", website: "", consent: false };
const nameOf = (code: string) => ASSESSMENTS.find((a) => a.code === code)?.name ?? code;

type Done = { track: TrackCode; trackName: string; leader: boolean; orgToken?: string; needsOrganisation?: boolean; orgRegistered?: boolean; firstName: string };

/**
 * AI Edge Lab early access (Nitin, 16 Nov).
 * Step 1, the same for everyone: "Which describes you?" (one assessment by career stage), name,
 * email, organisation, role, country, consent. No mention of ORG AI DARS or organisations here.
 * Step 2, the confirmation: a thank-you; leaders also see an optional, unticked question about
 * ORG AI DARS for their organisation (headcount band and main question).
 * `initialAssessment`: the AAI, ARI and LLI buttons pre-select their stage; ORG AI DARS selects nothing.
 * Styled for the AI Edge Lab page (dark, square corners).
 */
export default function AiEdgeInterestForm({ idPrefix = "ael", initialAssessment }: { idPrefix?: string; initialAssessment?: AssessmentCode }) {
  const formStarted = useFormStarted("ai-edge-interest");
  const [form, setForm] = useState(empty);
  const [stage, setStage] = useState<TrackCode | "">(isTrackCode(initialAssessment) ? initialAssessment : "");
  const [touched, setTouched] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");
  const [done, setDone] = useState<Done | null>(null);

  const errs = {
    stage: !stage ? "Please choose which describes you." : "",
    name: form.name.trim().length < 2 ? "Please enter your name." : "",
    email: !isEmail(form.email) ? "Please enter a valid email address." : "",
    country: form.country.trim().length < 2 ? "Please enter your country." : "",
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
        body: JSON.stringify({ ...form, track: stage, sourcePage: window.location.pathname, cameFrom: visitSource() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      track("Form sent", { form: "ai-edge-interest", assessment: stage });
      setDone({
        track: stage as TrackCode,
        trackName: data.trackName || nameOf(stage),
        leader: !!data.leader,
        orgToken: data.orgToken,
        needsOrganisation: !!data.needsOrganisation,
        orgRegistered: !!data.orgRegistered,
        firstName: form.name.trim().split(/\s+/)[0] ?? "",
      });
      setState("idle");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setState("error");
    }
  }

  if (done) return <Confirmation done={done} idPrefix={idPrefix} />;

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
        <legend className="mb-2 font-mono text-[10px] tracking-[0.16em] uppercase text-[#B0AEA8]">Which describes you?</legend>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {TRACKS.map((t) => {
            const on = stage === t.code;
            return (
              <label key={t.code} className="flex items-start gap-2.5 px-3 py-3 cursor-pointer"
                style={{ border: `1px solid ${on ? "#C9A24A" : "rgba(247,246,243,0.14)"}`, background: on ? "rgba(201,162,74,0.08)" : "transparent" }}>
                <input
                  type="radio"
                  name={`${idPrefix}-stage`}
                  value={t.code}
                  checked={on}
                  onChange={() => { formStarted(); setStage(t.code); }}
                  className="mt-1 accent-[#C9A24A]"
                />
                <span className="min-w-0">
                  <span className="block text-[13.5px] leading-snug text-[#F7F6F3]">{t.stage}</span>
                  <span className="block text-[11.5px] leading-snug text-[#7A7870] mt-0.5">{nameOf(t.code)}</span>
                </span>
              </label>
            );
          })}
        </div>
        {show("stage") && <p className="mt-1.5 text-[12px] text-red-400">{show("stage")}</p>}
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
        {state === "sending" ? "Sending…" : "Register for early access"}
      </button>
      {state === "error" && error && <p className="text-[12px] text-red-400">{error}</p>}
      <FormPrivacyNote className="text-[#7A7870]" />
    </form>
  );
}

/** Step 2: the thank-you, and for leaders the optional ORG AI DARS question (never pre-ticked). */
function Confirmation({ done, idPrefix }: { done: Done; idPrefix: string }) {
  const [wantsOrg, setWantsOrg] = useState(false);
  const [org, setOrg] = useState({ organisation: "", headcount: "", question: "" });
  const [touched, setTouched] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "error" | "done">("idle");
  const [error, setError] = useState("");
  const [orgName, setOrgName] = useState("");

  const errs = {
    organisation: done.needsOrganisation && org.organisation.trim().length < 2 ? "Please enter your organisation's name." : "",
    headcount: !org.headcount ? "Please choose a headcount band." : "",
    question: org.question.trim().length < 3 ? "Please tell us the main question for your organisation." : "",
  };
  const show = (k: keyof typeof errs) => (touched ? errs[k] : "");

  async function registerOrg(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setTouched(true);
    if (Object.values(errs).some(Boolean)) return;
    setState("sending");
    try {
      const res = await fetch("/api/ai-edge-interest/organisation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: done.orgToken, ...org }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      track("Form sent", { form: "ai-edge-interest", assessment: ORG_ASSESSMENT.code });
      setOrgName(data.organisation || org.organisation);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setState("error");
    }
  }

  const field = "w-full px-4 py-3.5 text-[14px] text-[#F7F6F3] outline-none placeholder:text-[#7A7870] focus:border-[#C9A24A]";
  const box = (bad: string) => ({ background: "rgba(247,246,243,0.04)", border: `1px solid ${bad ? "rgba(224,82,82,0.6)" : "rgba(247,246,243,0.14)"}` });

  return (
    <div className="text-left" role="status" aria-live="polite">
      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#C9A24A]">Registered</p>
      <p className="mt-3 text-[22px] leading-snug text-[#F7F6F3]" style={{ fontFamily: "var(--font-cormorant-garamond), 'Cormorant Garamond', serif" }}>
        Thank you{done.firstName ? `, ${done.firstName}` : ""}.
      </p>
      <p className="mt-2 text-[14.5px] leading-[1.65] text-[#B0AEA8]">
        You&rsquo;re on the early-access list for the {done.trackName}. We&rsquo;ll be in touch before launch.
      </p>

      {done.leader && done.orgToken && (
        <div className="mt-7 pt-6" style={{ borderTop: "1px solid rgba(247,246,243,0.12)" }}>
          {done.orgRegistered && state !== "done" ? (
            <p className="text-[13.5px] leading-[1.6] text-[#B0AEA8]">Your organisation is already on the early-access list for {ORG_ASSESSMENT.name}.</p>
          ) : state === "done" ? (
            <p className="text-[14px] leading-[1.6] text-[#F7F6F3]">
              {orgName ? `${orgName} is` : "Your organisation is"} on the early-access list for {ORG_ASSESSMENT.name}. We&rsquo;ll be in touch before launch.
            </p>
          ) : (
            <form onSubmit={registerOrg} noValidate className="flex flex-col gap-3">
              <label className="flex items-start gap-3 cursor-pointer text-[14px] leading-snug text-[#F7F6F3]">
                {/* Never pre-selected (Nitin, 16 Nov) */}
                <input type="checkbox" checked={wantsOrg} onChange={(e) => setWantsOrg(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#C9A24A] cursor-pointer" />
                <span>Would you also like early access to {ORG_ASSESSMENT.name} for your organisation? <span className="text-[#7A7870]">(optional)</span></span>
              </label>
              {wantsOrg && (
                <div className="flex flex-col gap-3 mt-1">
                  {done.needsOrganisation && (
                    <div>
                      <label htmlFor={`${idPrefix}-org-name`} className="sr-only">Organisation name</label>
                      <input id={`${idPrefix}-org-name`} placeholder="Organisation name" autoComplete="organization" value={org.organisation}
                        onChange={(e) => setOrg((s) => ({ ...s, organisation: e.target.value }))} className={field} style={box(show("organisation"))} />
                      {show("organisation") && <p className="mt-1.5 text-[12px] text-red-400">{show("organisation")}</p>}
                    </div>
                  )}
                  <div>
                    <label htmlFor={`${idPrefix}-org-headcount`} className="block mb-1.5 font-mono text-[10px] tracking-[0.16em] uppercase text-[#B0AEA8]">Headcount</label>
                    <select id={`${idPrefix}-org-headcount`} value={org.headcount} onChange={(e) => setOrg((s) => ({ ...s, headcount: e.target.value }))}
                      className={field} style={{ ...box(show("headcount")), colorScheme: "dark" }}>
                      <option value="">Choose a band…</option>
                      {HEADCOUNT_BANDS.map((b) => <option key={b} value={b}>{b} people</option>)}
                    </select>
                    {show("headcount") && <p className="mt-1.5 text-[12px] text-red-400">{show("headcount")}</p>}
                  </div>
                  <div>
                    <label htmlFor={`${idPrefix}-org-question`} className="block mb-1.5 font-mono text-[10px] tracking-[0.16em] uppercase text-[#B0AEA8]">What&rsquo;s the main question for your organisation?</label>
                    <textarea id={`${idPrefix}-org-question`} rows={3} value={org.question} maxLength={1000}
                      onChange={(e) => setOrg((s) => ({ ...s, question: e.target.value }))} className={field} style={box(show("question"))} />
                    {show("question") && <p className="mt-1.5 text-[12px] text-red-400">{show("question")}</p>}
                  </div>
                  <button type="submit" disabled={state === "sending"} className="w-full py-3.5 font-mono text-[11px] tracking-[0.16em] uppercase font-medium disabled:opacity-60"
                    style={{ background: "#C9A24A", color: "#0D0D0B" }}>
                    {state === "sending" ? "Sending…" : "Register my organisation"}
                  </button>
                  {state === "error" && error && <p className="text-[12px] text-red-400">{error}</p>}
                </div>
              )}
              <p className="text-[12px] leading-snug text-[#7A7870]">Not now? You can simply close this page.</p>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
