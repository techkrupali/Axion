"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import Link from "next/link";
import { INDEX_DEFINITIONS, IndexType, QUESTIONS, Question } from "@/config/diagnosticConfig";
import { Answers, Profile, scoreDiagnostic } from "@/engine/scoring";

// ─── PDF download (client-only) ───────────────────────────────────────────────
async function downloadPdf(indexType: IndexType, answers: Answers, profile: Profile) {
  const { buildReport } = await import("@/report/reportGenerator");
  const jsPDF = (await import("jspdf")).default;
  const report = buildReport(indexType, answers, profile);
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const left = 48; let y = 56;
  doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.text(report.meta.title, left, y);
  y += 28; doc.setFontSize(11); doc.setFont("helvetica", "normal"); doc.text(`${report.meta.index} · ${report.meta.audience}`, left, y);
  y += 42; doc.setFont("helvetica", "bold"); doc.setFontSize(34); doc.text(String(report.summary.score), left, y);
  doc.setFontSize(12); doc.text(`${report.summary.band} — ${report.summary.archetype}`, left + 90, y - 10); doc.text(`Range: ${report.summary.range}`, left + 90, y + 10);
  y += 42; doc.setFont("helvetica", "normal"); doc.setFontSize(11);
  doc.splitTextToSize(report.summary.narrative, 500).forEach((line: string, i: number) => doc.text(line, left, y + i * 15));
  y += 72; doc.setFont("helvetica", "bold"); doc.text("Component Scores", left, y); y += 20; doc.setFont("helvetica", "normal");
  Object.entries(report.components).slice(-5).forEach(([k, v]) => { doc.text(`${k.replace(/([A-Z])/g, " $1")}: ${v}`, left, y); y += 18; });
  y += 18; doc.setFont("helvetica", "bold"); doc.text("Cross-Signal", left, y); y += 20; doc.setFont("helvetica", "normal");
  doc.splitTextToSize(report.crossSignals.stoWork + " " + report.crossSignals.judgmentThinking, 500).forEach((line: string, i: number) => doc.text(line, left, y + i * 15));
  y += 60; doc.setFont("helvetica", "bold"); doc.text("90-Day Action Plan", left, y); y += 22; doc.setFont("helvetica", "normal");
  report.actionPlan.forEach((a: { priority: string; title: string; action: string }) => {
    doc.splitTextToSize(`${a.priority}: ${a.title} — ${a.action}`, 500).forEach((line: string, i: number) => doc.text(line, left, y + i * 15));
    y += 44;
  });
  doc.save(`${report.meta.index.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-report.pdf`);
}

// ─── Empty split helper ───────────────────────────────────────────────────────
const emptySplit = (qid: string) =>
  Object.fromEntries(QUESTIONS.find((q) => q.id === qid)!.options.map((o) => [o.id, 0]));

// ─── Band colours ─────────────────────────────────────────────────────────────
const BAND_COLOR: Record<string, string> = {
  "Edge Thinning": "#E05252",
  "Edge Holding": "#C9A84C",
  "Edge Accelerating": "#52C8A8",
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DiagnosticPage() {
  const [indexType, setIndexType] = useState<IndexType>("replaceability");
  const [step, setStep] = useState(0); // 0 = profile, 1..10 = questions, 11 = result
  const [profile, setProfile] = useState<Profile>({ name: "", role: "", experienceBand: "8-12" });
  const [answers, setAnswers] = useState<Answers>({});

  const question: Question | undefined = QUESTIONS[step - 1];
  const result = useMemo(() => scoreDiagnostic(indexType, answers, profile), [indexType, answers, profile]);

  const isSplit = question?.type === "split";
  const isValid = !question
    ? true
    : isSplit
    ? Object.values((answers[question.id] || {}) as Record<string, number>).reduce((a, b) => a + b, 0) === 100
    : Boolean(answers[question.id]);

  const totalSteps = QUESTIONS.length + 1; // profile + 10 questions
  const progress = Math.round((step / totalSteps) * 100);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "#050505" }}>
      {/* Grain */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[9998] opacity-[0.03]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "256px 256px" }} />

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-[70] flex items-center justify-between px-4 sm:px-8 py-4"
        style={{ background: "rgba(5,5,5,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Link href="/expertise/ai-edge" className="font-jetbrains text-[10px] tracking-[0.25em] uppercase text-[var(--fg-4)] hover:text-[var(--accent)] transition-colors flex items-center gap-2">
          <ArrowLeft size={11} /> AI Edge Lab
        </Link>
        <span className="font-jetbrains text-[10px] tracking-[0.25em] uppercase" style={{ color: "var(--accent)" }}>
          {INDEX_DEFINITIONS[indexType].name}
        </span>
        {step > 0 && step <= QUESTIONS.length && (
          <span className="font-jetbrains text-[10px] tracking-[0.2em] text-[var(--fg-5)]">{step} / {QUESTIONS.length}</span>
        )}
        {(step === 0 || step > QUESTIONS.length) && <span className="w-16" />}
      </div>

      {/* Progress bar */}
      {step > 0 && step <= QUESTIONS.length && (
        <div className="fixed top-[57px] left-0 right-0 z-[70] h-[2px]" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div className="h-full" style={{ background: "var(--accent)" }}
            animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} />
        </div>
      )}

      <div className="pt-[72px] min-h-screen flex flex-col">
        <AnimatePresence mode="wait">

          {/* ── STEP 0: Index selector + Profile ── */}
          {step === 0 && (
            <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col items-center justify-center px-4 py-12">
              <div className="w-full max-w-[680px]">

                {/* Header */}
                <div className="mb-10">
                  <span className="font-jetbrains text-[10px] tracking-[0.35em] uppercase mb-4 block" style={{ color: "var(--accent)" }}>
                    AI EDGE LAB · DIAGNOSTIC
                  </span>
                  <h1 className="font-serif font-normal leading-[1.0] tracking-[-0.025em] text-[var(--fg)] mb-4"
                    style={{ fontSize: "clamp(28px,4.5vw,56px)" }}>
                    Know where you stand.
                  </h1>
                  <p className="font-sans font-light text-[var(--fg-3)] leading-[1.65]" style={{ fontSize: "clamp(13px,1.1vw,16px)" }}>
                    Select your track, fill in your profile, and complete 10 questions. Results are instant.
                  </p>
                </div>

                {/* Index selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {(Object.entries(INDEX_DEFINITIONS) as [IndexType, typeof INDEX_DEFINITIONS[IndexType]][]).map(([k, v]) => (
                    <button key={k} onClick={() => setIndexType(k)}
                      className="text-left p-5 transition-all duration-250 group"
                      style={{
                        background: indexType === k ? "rgba(201,168,76,0.08)" : "rgba(18,18,18,0.8)",
                        border: indexType === k ? "1px solid rgba(201,168,76,0.5)" : "1px solid rgba(255,255,255,0.08)",
                      }}>
                      <span className="font-jetbrains text-[9px] tracking-[0.3em] uppercase block mb-2"
                        style={{ color: indexType === k ? "var(--accent)" : "rgba(255,255,255,0.3)" }}>
                        {v.audience}
                      </span>
                      <span className="font-serif font-normal text-[var(--fg)] leading-[1.1] block"
                        style={{ fontSize: "clamp(14px,1.3vw,17px)" }}>
                        {v.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Profile inputs */}
                <div className="flex flex-col gap-3 mb-8">
                  <input
                    placeholder="Your name"
                    value={profile.name}
                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-5 py-4 font-sans text-[var(--fg)] outline-none transition-all duration-250"
                    style={{ background: "rgba(18,18,18,0.8)", border: "1px solid rgba(255,255,255,0.1)", fontSize: "14px" }}
                  />
                  <input
                    placeholder="Your role / title"
                    value={profile.role}
                    onChange={e => setProfile({ ...profile, role: e.target.value })}
                    className="w-full px-5 py-4 font-sans text-[var(--fg)] outline-none transition-all duration-250"
                    style={{ background: "rgba(18,18,18,0.8)", border: "1px solid rgba(255,255,255,0.1)", fontSize: "14px" }}
                  />
                  <select
                    value={profile.experienceBand}
                    onChange={e => setProfile({ ...profile, experienceBand: e.target.value as Profile["experienceBand"] })}
                    className="w-full px-5 py-4 font-jetbrains text-[var(--fg-3)] outline-none transition-all duration-250"
                    style={{ background: "rgba(18,18,18,0.8)", border: "1px solid rgba(255,255,255,0.1)", fontSize: "11px" }}>
                    <option value="0-3">0–3 years experience</option>
                    <option value="4-7">4–7 years</option>
                    <option value="8-12">8–12 years</option>
                    <option value="13-20">13–20 years</option>
                    <option value="20+">20+ years</option>
                  </select>
                </div>

                <button onClick={() => setStep(1)}
                  className="w-full py-4 font-jetbrains text-[11px] tracking-[0.25em] uppercase flex items-center justify-center gap-3 transition-all duration-300"
                  style={{ background: "var(--accent)", color: "#080A0F" }}>
                  Begin Diagnostic <ArrowRight size={13} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEPS 1–10: Questions ── */}
          {step >= 1 && step <= QUESTIONS.length && question && (
            <motion.div key={`q-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col items-center justify-start px-4 py-10">
              <div className="w-full max-w-[680px]">

                {/* Question header */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-jetbrains text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(201,168,76,0.6)" }}>
                    Question {step}
                  </span>
                  <button onClick={() => setStep(step - 1)}
                    className="font-jetbrains text-[10px] tracking-[0.2em] uppercase text-[var(--fg-5)] hover:text-[var(--fg-3)] transition-colors flex items-center gap-1">
                    <ArrowLeft size={10} /> Back
                  </button>
                </div>

                <h2 className="font-serif font-normal text-[var(--fg)] leading-[1.15] tracking-[-0.015em] mb-2"
                  style={{ fontSize: "clamp(20px,2.8vw,32px)" }}>
                  {question.title}
                </h2>
                <p className="font-sans text-[var(--fg-4)] leading-[1.6] mb-8" style={{ fontSize: "13px" }}>
                  {question.subtitle}
                </p>

                {/* Split question */}
                {question.type === "split" && (
                  <SplitQuestion
                    question={question}
                    value={(answers[question.id] as Record<string, number>) || emptySplit(question.id)}
                    onChange={v => setAnswers({ ...answers, [question.id]: v })}
                  />
                )}

                {/* Single question */}
                {question.type === "single" && (
                  <SingleQuestion
                    question={question}
                    value={answers[question.id] as string}
                    onChange={v => setAnswers({ ...answers, [question.id]: v })}
                  />
                )}

                {/* Nav */}
                <div className="flex items-center justify-between mt-8">
                  <div className="flex gap-1">
                    {QUESTIONS.map((_, i) => (
                      <div key={i} className="rounded-full transition-all duration-300"
                        style={{ width: i + 1 === step ? "18px" : "6px", height: "6px", background: i + 1 < step ? "var(--accent)" : i + 1 === step ? "var(--accent)" : "rgba(255,255,255,0.1)", opacity: i + 1 < step ? 0.5 : 1 }} />
                    ))}
                  </div>
                  {step < QUESTIONS.length ? (
                    <button onClick={() => setStep(step + 1)} disabled={!isValid}
                      className="flex items-center gap-2 px-6 py-3 font-jetbrains text-[10px] tracking-[0.22em] uppercase transition-all duration-250"
                      style={{ background: isValid ? "var(--accent)" : "rgba(255,255,255,0.06)", color: isValid ? "#080A0F" : "rgba(255,255,255,0.2)", cursor: isValid ? "pointer" : "not-allowed" }}>
                      Next <ArrowRight size={11} />
                    </button>
                  ) : (
                    <button onClick={() => setStep(QUESTIONS.length + 1)} disabled={!isValid}
                      className="flex items-center gap-2 px-6 py-3 font-jetbrains text-[10px] tracking-[0.22em] uppercase transition-all duration-250"
                      style={{ background: isValid ? "var(--accent)" : "rgba(255,255,255,0.06)", color: isValid ? "#080A0F" : "rgba(255,255,255,0.2)", cursor: isValid ? "pointer" : "not-allowed" }}>
                      See Results <ArrowRight size={11} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── RESULT ── */}
          {step > QUESTIONS.length && (
            <ResultView key="result" result={result} indexType={indexType} answers={answers} profile={profile}
              onRestart={() => { setStep(0); setAnswers({}); }} />
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Split Question ───────────────────────────────────────────────────────────
function SplitQuestion({ question, value, onChange }: { question: Question; value: Record<string, number>; onChange: (v: Record<string, number>) => void }) {
  const total = Object.values(value || {}).reduce((a, b) => a + (b || 0), 0);
  const isComplete = total === 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-5 px-1">
        <span className="font-jetbrains text-[10px] tracking-[0.2em] uppercase text-[var(--fg-5)]">Allocate 100%</span>
        <span className="font-jetbrains text-[11px] font-semibold" style={{ color: isComplete ? "#52C8A8" : total > 100 ? "#E05252" : "var(--accent)" }}>
          {total}% / 100%
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {question.options.map(o => (
          <div key={o.id} className="p-4" style={{ background: "rgba(18,18,18,0.8)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-sans font-medium text-[var(--fg)]" style={{ fontSize: "14px" }}>{o.label}</span>
                  {o.badge && (
                    <span className="font-jetbrains text-[8px] tracking-[0.2em] px-2 py-0.5"
                      style={{ color: o.badge === "AI-PROOF" ? "#52C8A8" : o.badge === "AI-ASSISTED" ? "#C9A84C" : "#E05252", border: `1px solid currentColor`, opacity: 0.8 }}>
                      {o.badge}
                    </span>
                  )}
                </div>
                <span className="font-sans text-[var(--fg-4)]" style={{ fontSize: "12px" }}>{o.description}</span>
              </div>
              <span className="font-jetbrains text-[13px] font-semibold shrink-0" style={{ color: "var(--accent)", minWidth: "36px", textAlign: "right" }}>
                {value?.[o.id] || 0}%
              </span>
            </div>
            <input type="range" min="0" max="100" step="5"
              value={value?.[o.id] || 0}
              onChange={e => onChange({ ...value, [o.id]: Number(e.target.value) })}
              className="w-full h-1 appearance-none cursor-pointer"
              style={{ accentColor: "var(--accent)", background: `linear-gradient(to right, var(--accent) ${value?.[o.id] || 0}%, rgba(255,255,255,0.1) ${value?.[o.id] || 0}%)` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Single Question ──────────────────────────────────────────────────────────
function SingleQuestion({ question, value, onChange }: { question: Question; value?: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-3">
      {question.options.map((o, i) => {
        const isSelected = value === o.id;
        return (
          <motion.button key={o.id} onClick={() => onChange(o.id)} whileHover={{ x: 4 }} transition={{ duration: 0.2 }}
            className="w-full text-left px-5 py-4 flex items-start gap-4 transition-all duration-250"
            style={{ background: isSelected ? "rgba(201,168,76,0.08)" : "rgba(18,18,18,0.8)", border: isSelected ? "1px solid rgba(201,168,76,0.5)" : "1px solid rgba(255,255,255,0.08)" }}>
            <span className="font-jetbrains text-[10px] tracking-[0.2em] shrink-0 mt-0.5 w-4"
              style={{ color: isSelected ? "var(--accent)" : "rgba(255,255,255,0.2)" }}>
              {String.fromCharCode(65 + i)}
            </span>
            <div>
              <span className="font-sans font-medium text-[var(--fg)] block mb-1" style={{ fontSize: "14px" }}>{o.label}</span>
              <span className="font-sans text-[var(--fg-4)]" style={{ fontSize: "12px" }}>{o.description}</span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── Result View ──────────────────────────────────────────────────────────────
function ResultView({ result, indexType, answers, profile, onRestart }: {
  result: ReturnType<typeof scoreDiagnostic>;
  indexType: IndexType;
  answers: Answers;
  profile: Profile;
  onRestart: () => void;
}) {
  const bandColor = BAND_COLOR[result.band] || "var(--accent)";
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    try { await downloadPdf(indexType, answers, profile); } finally { setDownloading(false); }
  }

  const keyComponents = [
    { label: "Judgment Density", value: result.components.judgmentDensity },
    { label: "Output Exposure", value: result.components.outputExposure },
    { label: "Consequence Signal", value: result.components.consequenceSignal },
    { label: "Impact Score", value: result.components.impactScore },
    { label: "Growth Signal", value: result.components.growthSignal },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="flex-1 px-4 py-10">
      <div className="max-w-[720px] mx-auto">

        {/* Index + name */}
        <div className="mb-8">
          <span className="font-jetbrains text-[10px] tracking-[0.35em] uppercase mb-2 block" style={{ color: "var(--accent)" }}>
            {INDEX_DEFINITIONS[indexType].reportTitle}
          </span>
          {profile.name && (
            <p className="font-sans text-[var(--fg-3)] mb-1" style={{ fontSize: "13px" }}>
              {profile.name}{profile.role ? ` · ${profile.role}` : ""}
            </p>
          )}
        </div>

        {/* Score card */}
        <div className="p-7 mb-5" style={{ background: "rgba(18,18,18,0.9)", border: `1px solid ${bandColor}40` }}>
          <div className="flex items-end justify-between flex-wrap gap-4 mb-5">
            <div>
              <span className="font-jetbrains text-[10px] tracking-[0.3em] uppercase mb-2 block" style={{ color: "rgba(255,255,255,0.3)" }}>
                Edge Score
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif font-bold leading-none" style={{ fontSize: "clamp(52px,8vw,88px)", color: bandColor }}>
                  {result.score}
                </span>
                <span className="font-serif text-[var(--fg-4)]" style={{ fontSize: "clamp(18px,2vw,26px)" }}>/100</span>
              </div>
              <p className="font-jetbrains text-[10px] tracking-[0.2em] uppercase mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                Range: {result.range}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="px-4 py-2 font-jetbrains text-[10px] tracking-[0.2em] uppercase"
                style={{ border: `1px solid ${bandColor}60`, color: bandColor, background: `${bandColor}10` }}>
                {result.band}
              </span>
              <span className="font-jetbrains text-[10px] tracking-[0.2em] uppercase text-[var(--fg-4)]">
                {result.archetype}
              </span>
            </div>
          </div>
          {/* Score bar */}
          <div className="h-[3px] w-full rounded-full mb-5" style={{ background: "rgba(255,255,255,0.08)" }}>
            <motion.div className="h-full rounded-full" style={{ background: bandColor }}
              initial={{ width: 0 }} animate={{ width: `${result.score}%` }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }} />
          </div>
          <p className="font-sans text-[var(--fg-3)] leading-[1.65]" style={{ fontSize: "clamp(13px,1.1vw,15px)" }}>
            {INDEX_DEFINITIONS[indexType].framing} Your current structural reading is <strong style={{ color: "var(--fg)" }}>{result.band}</strong>, with the strongest signal around <strong style={{ color: "var(--fg)" }}>{result.archetype}</strong>.
          </p>
        </div>

        {/* Component scores */}
        <div className="p-6 mb-5" style={{ background: "rgba(12,12,12,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <span className="font-jetbrains text-[10px] tracking-[0.3em] uppercase mb-5 block" style={{ color: "rgba(255,255,255,0.3)" }}>
            Component Breakdown
          </span>
          <div className="flex flex-col gap-4">
            {keyComponents.map((c, i) => {
              const pct = Math.min(100, Math.max(0, c.value));
              const col = pct >= 65 ? "#52C8A8" : pct >= 40 ? "#C9A84C" : "#E05252";
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-sans text-[var(--fg-3)]" style={{ fontSize: "13px" }}>{c.label}</span>
                    <span className="font-jetbrains text-[11px]" style={{ color: col }}>{c.value}</span>
                  </div>
                  <div className="h-[2px] w-full rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <motion.div className="h-full rounded-full" style={{ background: col }}
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.4 + i * 0.08 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cross signals */}
        <div className="p-6 mb-5" style={{ background: "rgba(12,12,12,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <span className="font-jetbrains text-[10px] tracking-[0.3em] uppercase mb-4 block" style={{ color: "rgba(255,255,255,0.3)" }}>
            Cross-Signal Read
          </span>
          <p className="font-sans text-[var(--fg-3)] leading-[1.65] mb-3" style={{ fontSize: "13px" }}>
            {result.crossSignals.stoWork}
          </p>
          <p className="font-sans text-[var(--fg-3)] leading-[1.65]" style={{ fontSize: "13px" }}>
            {result.crossSignals.judgmentThinking}
          </p>
        </div>

        {/* Priority gaps */}
        <div className="p-6 mb-8" style={{ background: "rgba(12,12,12,0.8)", border: "1px solid rgba(201,168,76,0.2)" }}>
          <span className="font-jetbrains text-[10px] tracking-[0.3em] uppercase mb-5 block" style={{ color: "var(--accent)" }}>
            Priority Gaps — Where to Focus
          </span>
          <div className="flex flex-col gap-3">
            {result.gaps.slice(0, 3).map((gap, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="font-jetbrains text-[10px] tracking-[0.2em] shrink-0 mt-0.5" style={{ color: "rgba(201,168,76,0.5)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-sans text-[var(--fg-2)]" style={{ fontSize: "13px" }}>
                      {gap.dimension.replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase())}
                    </span>
                    <span className="font-jetbrains text-[11px]" style={{ color: "#E05252" }}>{gap.score}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={handleDownload} disabled={downloading}
            className="flex-1 flex items-center justify-center gap-2 py-4 font-jetbrains text-[10px] tracking-[0.25em] uppercase transition-all duration-300"
            style={{ background: "var(--accent)", color: "#080A0F", opacity: downloading ? 0.7 : 1 }}>
            <Download size={12} /> {downloading ? "Generating..." : "Download PDF Report"}
          </button>
          <Link href="/connect"
            className="flex-1 flex items-center justify-center gap-2 py-4 font-jetbrains text-[10px] tracking-[0.25em] uppercase transition-all duration-300"
            style={{ border: "1px solid rgba(201,168,76,0.3)", color: "var(--accent)", background: "transparent" }}>
            Talk to Axion Index <ArrowRight size={11} />
          </Link>
          <button onClick={onRestart}
            className="flex-1 py-4 font-jetbrains text-[10px] tracking-[0.25em] uppercase text-[var(--fg-4)] hover:text-[var(--fg-3)] transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.08)", background: "transparent" }}>
            Retake
          </button>
        </div>

      </div>
    </motion.div>
  );
}
