"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ─── Types ─── */
type Cur = "inr" | "usd";
type ArchKey = "aspiring" | "working" | "leader" | "org";

/* ─── Persona Router Data ─── */
const INST: Record<ArchKey, {
  tag: string; name: string; body: string;
  tiers: { n: string; d: string; p: string; u: string; wait?: boolean; enq?: boolean }[];
  note: string;
}> = {
  aspiring: {
    tag: "AAI© · AI Alignment Index", name: "AI Alignment Index",
    body: "For those entering the workforce. Maps whether the foundations you're building stay relevant as AI absorbs executional and analytical work — and where to concentrate so your edge compounds from the start.",
    tiers: [
      { n: "AAI© Report", d: "Full alignment report, delivered within 48h", p: "₹799", u: "$24" },
      { n: "AAI© + Consultation", d: "Report plus a foundation-building session", p: "₹2,499", u: "$75" },
    ],
    note: "Payment is taken before the diagnostic begins. Your report is prepared and delivered within 48 hours.",
  },
  working: {
    tag: "ARI© · AI Replaceability Index", name: "AI Replaceability Index",
    body: "For working professionals. A complete structural position assessment across all four E.D.G.E. dimensions — Edge Score, band, Role Composition Map, Salary Sustainability Index, and a personalised structural roadmap.",
    tiers: [
      { n: "ARI© Report", d: "Full structural report, delivered within 48h", p: "₹1,499", u: "$44" },
      { n: "ARI© + Consultation", d: "The report plus a 45-min structural debrief", p: "₹4,499", u: "$129" },
    ],
    note: "Payment is taken before the diagnostic begins. Your report is prepared and delivered within 48 hours.",
  },
  leader: {
    tag: "BDI© · Brainpower Density Index", name: "Brainpower Density Index",
    body: "For leaders and CXOs. Measures the ratio of judgment work to intelligence work across your leadership layer — whether your senior people sit in AI-compressible territory, and where to redesign decision architecture.",
    tiers: [
      { n: "BDI© Report", d: "Brainpower Density report for your layer", p: "₹5,999", u: "$179" },
      { n: "BDI© + Consultation", d: "The report plus a 60-min leadership debrief", p: "₹9,999", u: "$299" },
    ],
    note: "Payment is taken before the diagnostic begins. Your report is prepared and delivered within 48 hours.",
  },
  org: {
    tag: "ORG AI DARS© · Enterprise", name: "ORG AI DARS",
    body: "For organisations. The Organisational Decision Architecture Realignment System redesigns roles, decision rights, and leadership layers using Brainpower Density data at population scale. An enterprise engagement, scoped to your organisation.",
    tiers: [{ n: "Enterprise engagement", d: "Scoped to your organisation", p: "Enquiry", u: "", enq: true }],
    note: "Enterprise engagements begin with a scoping conversation. Contact nitin@axionindex.org.",
  },
};

/* ─── Micro-Diagnostic Data ─── */
const ARCH_QUIZ: Record<ArchKey, {
  label: string; instrument: string; price: string;
  questions: { anchor: string; q: string; opts: { t: string; s: number }[] }[];
}> = {
  aspiring: { label: "Aspiring Professional", instrument: "AAI©", price: "₹799",
    questions: [
      { anchor: "Q1 · Role Composition Map", q: "Do you know what element of your current learning or work falls under AI Dominant, AI Assisted, and AI Proof?", opts: [{ t: "No idea — I don't think about my learning in these terms", s: 25 }, { t: "Vague sense — but haven't mapped it", s: 50 }, { t: "Partial — I can name some, not all", s: 75 }, { t: "Clear — I can name the proportion in each zone", s: 100 }] },
      { anchor: "Q2 · Judgment Ownership", q: "Within the judgment skills you are being trained for, what is structurally at risk from AI?", opts: [{ t: "I haven't considered judgment separately from execution skills", s: 25 }, { t: "I assumed judgment training was safe — AI handles tasks", s: 50 }, { t: "I see specific risks but haven't named them", s: 75 }, { t: "I can identify which judgment areas AI is already encroaching on", s: 100 }] },
      { anchor: "Q3 · Thinking Ownership", q: "How much can your learning path evolve to build thinking ownership AI cannot compress?", opts: [{ t: "My path is fixed — limited room to evolve", s: 25 }, { t: "Some optional choices possible", s: 50 }, { t: "Active room to evolve — I am exploring it", s: 75 }, { t: "I am restructuring my path around thinking ownership", s: 100 }] },
      { anchor: "Q4 · Personal Dividend", q: "What concretely can you do to leverage AI to BUILD (not undermine) your foundations?", opts: [{ t: "I see AI as a threat, not a leverage tool", s: 25 }, { t: "Some sense but no clarity", s: 50 }, { t: "I can name 1-2 specific ways", s: 75 }, { t: "I have a concrete plan and am already acting on it", s: 100 }] },
      { anchor: "Q5 · Work Redesign", q: "If you redesigned your career preparation today around AI as a colleague — not a threat — what would you actually do differently?", opts: [{ t: "No clear answer", s: 25 }, { t: "Vague idea", s: 50 }, { t: "Some specifics", s: 75 }, { t: "Clear redesign — parts of it are already underway", s: 100 }] },
    ]
  },
  working: { label: "Working Professional", instrument: "ARI©", price: "₹1,499",
    questions: [
      { anchor: "Q1 · Role Composition Map", q: "Do you know what element of your work falls under AI Dominant, AI Assisted, and AI Proof?", opts: [{ t: "No idea — I don't think about my work in these terms", s: 25 }, { t: "Vague sense — but haven't mapped it", s: 50 }, { t: "Partial — I can name some, not all", s: 75 }, { t: "Clear — I can name the proportion in each zone", s: 100 }] },
      { anchor: "Q2 · Judgment Ownership", q: "Within your judgment area — the decisions and framing only you can do — what is structurally at risk from AI?", opts: [{ t: "I haven't considered judgment separately from execution", s: 25 }, { t: "I assumed judgment was safe — AI only handles the tasks", s: 50 }, { t: "I see specific risks but haven't named them", s: 75 }, { t: "I can identify which judgment domains AI is encroaching on", s: 100 }] },
      { anchor: "Q3 · Thinking Ownership", q: "How much has — or can — your role's thinking ownership evolve to mitigate AI's impact?", opts: [{ t: "My role's thinking depth is static or declining", s: 25 }, { t: "Limited movement possible given the structure", s: 50 }, { t: "Some movement happening or possible", s: 75 }, { t: "Role is actively moving up the thinking ownership ladder", s: 100 }] },
      { anchor: "Q4 · Personal Dividend", q: "What concretely can you do to leverage AI to improve your overall impact critical to the organisation?", opts: [{ t: "I don't yet see a personal benefit — only organisational", s: 25 }, { t: "Some possibility but no clarity", s: 50 }, { t: "I can name 1-2 specific ways", s: 75 }, { t: "I have a concrete plan and am already acting on it", s: 100 }] },
      { anchor: "Q5 · Work Redesign", q: "If you redesigned your role today around AI as a colleague — not a tool — what would you actually be doing differently?", opts: [{ t: "No clear answer", s: 25 }, { t: "Vague idea", s: 50 }, { t: "Some specifics", s: 75 }, { t: "Clear redesign — parts of it are already underway", s: 100 }] },
    ]
  },
  leader: { label: "Leader / CXO", instrument: "BDI©", price: "₹5,999",
    questions: [
      { anchor: "Q1 · Role Composition Map", q: "Do you know what element of your WEEK falls under AI Dominant, AI Assisted, and AI Proof?", opts: [{ t: "No idea — I don't audit my week this way", s: 25 }, { t: "Vague sense — but haven't mapped it", s: 50 }, { t: "Partial — I know some categories, not all", s: 75 }, { t: "Clear — I can name the proportion in each zone", s: 100 }] },
      { anchor: "Q2 · Judgment Ownership", q: "Within your leadership judgment — strategy, architecture, consequence-bearing calls — what is structurally at risk from AI?", opts: [{ t: "I have not considered leadership judgment as separable from operational work", s: 25 }, { t: "I assumed leadership judgment was safe by definition", s: 50 }, { t: "I see specific risks but haven't mapped them", s: 75 }, { t: "I can identify which leadership domains AI is already encroaching on", s: 100 }] },
      { anchor: "Q3 · Thinking Ownership", q: "How much has — or can — your leadership thinking ownership evolve given AI's compression?", opts: [{ t: "My leadership work is largely operational pull — limited evolution possible", s: 25 }, { t: "Limited movement possible given organisational demands", s: 50 }, { t: "Active movement — I am protecting framing and decision time", s: 75 }, { t: "Leadership role substantially restructured around AI compression", s: 100 }] },
      { anchor: "Q4 · Personal Dividend", q: "What concretely can you do to leverage AI to amplify your leadership impact for the organisation?", opts: [{ t: "I view AI as a tool for my team, not my own work", s: 25 }, { t: "Some sense of personal leverage but no clarity", s: 50 }, { t: "I can name 1-2 specific leverage moves", s: 75 }, { t: "Concrete plan and acting on it", s: 100 }] },
      { anchor: "Q5 · Work Redesign", q: "If you redesigned your role today around AI as a colleague — not a tool — what would you actually be doing differently?", opts: [{ t: "No clear answer", s: 25 }, { t: "Vague idea", s: 50 }, { t: "Some specifics", s: 75 }, { t: "Clear redesign — parts of it are already underway", s: 100 }] },
    ]
  },
  org: { label: "Organisation", instrument: "ORG AI DARS©", price: "Enquire",
    questions: [
      { anchor: "Q1 · Role Composition Map", q: "Do you know what proportion of your organisation's WORKING HOURS fall under AI Dominant, AI Assisted, and AI Proof?", opts: [{ t: "No — we have not mapped working hours this way", s: 25 }, { t: "Anecdotal sense, not measured", s: 50 }, { t: "Partially mapped — selected functions", s: 75 }, { t: "Mapped across the organisation with proportions", s: 100 }] },
      { anchor: "Q2 · Judgment Ownership", q: "Within the judgment work of your senior layers, what is structurally at risk from AI?", opts: [{ t: "We have not separated judgment work from execution at senior layers", s: 25 }, { t: "We assumed senior judgment was structurally safe", s: 50 }, { t: "We see specific risks at senior layers but haven't named them", s: 75 }, { t: "We can identify which senior judgment domains AI is encroaching on", s: 100 }] },
      { anchor: "Q3 · Thinking Ownership", q: "How much has — or can — your organisation's thinking ownership evolve to mitigate AI's compression of intelligence work?", opts: [{ t: "Organisation's thinking depth is static or declining", s: 25 }, { t: "Limited movement possible given current structure", s: 50 }, { t: "Active redesign happening or planned", s: 75 }, { t: "Substantial restructuring underway", s: 100 }] },
      { anchor: "Q4 · Personal Dividend", q: "What concretely can the organisation do to leverage AI to multiply judgment density (not just productivity)?", opts: [{ t: "We see AI mainly as productivity, not judgment", s: 25 }, { t: "We see the possibility but have no clarity", s: 50 }, { t: "We can name 1-2 leverage strategies", s: 75 }, { t: "We have a concrete plan and are executing on it", s: 100 }] },
      { anchor: "Q5 · Work Redesign", q: "If you redesigned your organisation's work architecture today around AI as a colleague — not a tool — what would change?", opts: [{ t: "No clear answer", s: 25 }, { t: "Vague direction", s: 50 }, { t: "Some specifics", s: 75 }, { t: "Clear redesign — already underway", s: 100 }] },
    ]
  },
};

/* ─── Persona Router Modal ─── */
function PersonaModal({ open, onClose, initialKey }: { open: boolean; onClose: () => void; initialKey?: string }) {
  const [view, setView] = useState<"gate" | "detail">("gate");
  const [key, setKey] = useState<string>(initialKey || "");
  const [cur, setCur] = useState<Cur>("inr");

  useEffect(() => {
    if (open) { setView(initialKey ? "detail" : "gate"); setKey(initialKey || ""); }
  }, [open, initialKey]);

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      setCur(tz.includes("Kolkata") || tz.includes("Calcutta") || tz.includes("Asia") ? "inr" : "usd");
    } catch { setCur("inr"); }
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;
  const I = key ? INST[key as ArchKey] : null;

  const handleCta = (t: typeof INST[ArchKey]["tiers"][number]) => {
    if (t.enq) {
      window.location.href = "mailto:nitin@axionindex.org?subject=ORG%20AI%20DARS%20enquiry";
    } else {
      const subject = `AI Edge Diagnostic — ${I?.name} — ${t.n} (${cur === "inr" ? t.p : t.u})`;
      const body = `Hi Nitin,%0D%0A%0D%0AI would like to begin the ${I?.name} diagnostic — ${t.n} tier (${cur === "inr" ? t.p : t.u}).%0D%0A%0D%0APlease share payment details and next steps.%0D%0A%0D%0AThanks,%0D%0A`;
      window.location.href = `mailto:nitin@axionindex.org?subject=${encodeURIComponent(subject)}&body=${body}`;
    }
  };

  const S = {
    white: "#F7F6F3", white2: "#EEECEA", ink: "#0D0D0B", ink2: "#1A1A18",
    mid: "#7A7870", dim: "#B0AEA8", gold: "#A07830", gold2: "#C49848",
    rule: "rgba(13,13,11,0.1)", rule2: "rgba(13,13,11,0.18)",
    mono: "'DM Mono','Courier New',monospace", display: "'Bebas Neue',sans-serif",
  };

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(13,13,11,0.55)", backdropFilter: "blur(6px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px", overflowY: "auto" }}>
      <div style={{ background: S.white, width: "100%", maxWidth: "680px", border: `1px solid ${S.rule2}`, animation: "prUp .5s cubic-bezier(.2,.7,.2,1)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px", borderBottom: `1px solid ${S.rule}`, background: S.white2 }}>
          <span style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.mid }}>AI Edge Diagnostic · Find where your edge is measured</span>
          <button onClick={onClose} style={{ fontFamily: S.mono, fontSize: "14px", color: S.mid, cursor: "pointer", background: "none", border: "none" }}>✕ Close</button>
        </div>
        <div style={{ padding: "44px 40px 40px" }}>
          {view === "gate" && (
            <>
              <div style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.24em", textTransform: "uppercase", color: S.gold, marginBottom: "16px" }}>Step 01 · Who are you in the AI economy?</div>
              <div style={{ fontFamily: S.display, fontSize: "clamp(30px,5vw,46px)", lineHeight: 1, color: S.ink, marginBottom: "10px" }}>Where is your edge?</div>
              <p style={{ fontSize: "13px", color: S.mid, lineHeight: 1.7, marginBottom: "34px" }}>Each actor in the AI workplace faces a different structural challenge — and a different instrument. Choose where you stand.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {(["aspiring","working","leader","org"] as ArchKey[]).map((p, i) => (
                  <button key={p} onClick={() => { setKey(p); setView("detail"); }}
                    style={{ textAlign: "left", width: "100%", border: `1px solid ${S.rule2}`, background: S.white, padding: "22px 24px", cursor: "pointer", display: "flex", alignItems: "center", gap: "22px" }}>
                    <span style={{ fontFamily: S.mono, fontSize: "10px", color: S.gold, letterSpacing: "0.1em", flexShrink: 0, width: "22px" }}>0{i+1}</span>
                    <span style={{ flex: 1 }}>
                      <span style={{ display: "block", fontFamily: S.display, fontSize: "26px", color: S.ink, lineHeight: 1, marginBottom: "7px" }}>
                        {["Aspiring Professional","Working Professional","Leader · CXO","Organisation"][i]}
                      </span>
                      <span style={{ display: "block", fontSize: "12.5px", color: S.mid, lineHeight: 1.6, fontStyle: "italic" }}>
                        {['"Am I building the right foundations — or skills AI has already absorbed?"','"Am I structurally positioned — or in the compression zone without knowing it?"','"My advantage was informational. AI eliminated it. What is my new structural role?"','"We invest in AI at scale. Why don\'t outcomes match — and what are we measuring wrong?"'][i]}
                      </span>
                    </span>
                    <span style={{ fontFamily: S.mono, fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: S.dim, textAlign: "right", lineHeight: 1.5, flexShrink: 0 }}>
                      {["AAI©\nAlignment Index","ARI©\nReplaceability Index","BDI©\nBrainpower Density","ORG AI DARS©\nEnterprise"][i]}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
          {view === "detail" && I && (
            <>
              <button onClick={() => setView("gate")} style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: S.mid, cursor: "pointer", background: "none", border: "none", marginBottom: "24px" }}>← All actors</button>
              <div style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: S.gold, marginBottom: "12px" }}>{I.tag}</div>
              <div style={{ fontFamily: S.display, fontSize: "clamp(34px,6vw,54px)", lineHeight: 0.95, color: S.ink, marginBottom: "14px" }}>{I.name}</div>
              <p style={{ fontSize: "13.5px", color: S.ink2, lineHeight: 1.7, marginBottom: "26px", maxWidth: "560px" }}>{I.body}</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
                {["01 · Choose tier","02 · Secure payment","03 · Complete diagnostic","04 · Report within 48h"].map((s, i) => (
                  <span key={i} style={{ fontFamily: S.mono, fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: i === 0 ? S.gold : S.mid, border: `1px solid ${i === 0 ? S.gold : S.rule}`, padding: "6px 10px" }}>{s}</span>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: S.rule, border: `1px solid ${S.rule}`, marginBottom: "24px" }}>
                {I.tiers.map((t, i) => (
                  <div key={i} style={{ background: S.white, padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                    <span style={{ flex: 1, minWidth: "180px" }}>
                      <span style={{ display: "block", fontSize: "14px", color: S.ink, marginBottom: "4px" }}>{t.n}</span>
                      <span style={{ display: "block", fontSize: "11.5px", color: S.mid, lineHeight: 1.5 }}>{t.d}</span>
                    </span>
                    <span style={{ fontFamily: S.display, fontSize: "26px", color: S.ink, lineHeight: 1 }}>{cur === "inr" ? t.p : (t.u || t.p)}</span>
                    {t.enq ? (
                      <button onClick={() => handleCta(t)} style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", padding: "13px 22px", background: S.ink, color: S.white, border: `1px solid ${S.ink}`, cursor: "pointer" }}>Enquire →</button>
                    ) : t.wait ? (
                      <button disabled style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", padding: "13px 22px", background: "none", color: S.ink, border: `1px solid ${S.rule2}`, cursor: "default" }}>Waitlist</button>
                    ) : (
                      <button onClick={() => handleCta(t)} style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", padding: "13px 22px", background: S.ink, color: S.white, border: `1px solid ${S.ink}`, cursor: "pointer" }}>Begin · {cur === "inr" ? t.p : t.u} →</button>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.gold, padding: "14px 0", borderTop: `1px solid ${S.rule}`, borderBottom: `1px solid ${S.rule}`, textAlign: "center" }}>
                Private · Confidential · Not shared with your employer
              </div>
              <p style={{ fontFamily: S.mono, fontSize: "11px", color: S.dim, letterSpacing: "0.06em", marginTop: "20px", lineHeight: 1.8 }}>{I.note}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Micro-Diagnostic Component ─── */
function MicroDiagnostic({ S, onOpenModal }: { S: Record<string, string>; onOpenModal: (key: ArchKey) => void }) {
  const [stage, setStage] = useState<"picker" | "quiz" | "result">("picker");
  const [arch, setArch] = useState<ArchKey | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState("");

  const startQuiz = (a: ArchKey) => { setArch(a); setQIdx(0); setScores([]); setStage("quiz"); };
  const answer = (s: number) => {
    const next = [...scores, s];
    if (qIdx < 4) { setScores(next); setQIdx(qIdx + 1); }
    else { setScores(next); setStage("result"); }
  };
  const reset = () => { setStage("picker"); setArch(null); setQIdx(0); setScores([]); setEmail(""); setSubStatus(""); };

  const total = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const band = total >= 75 ? "accelerating" : total >= 50 ? "holding" : "thinning";
  const bandLabel = band === "accelerating" ? "Edge Accelerating" : band === "holding" ? "Edge Holding" : "Edge Thinning";
  const bandColor = band === "accelerating" ? "#5FA67A" : band === "holding" ? S.gold2 : "#C76060";

  const bandNarrative = (a: ArchKey) => {
    const d = ARCH_QUIZ[a];
    if (band === "accelerating") return `Your structural position is above the AI compression line. The risk you face is drift over the next 24 months, not displacement. The full ${d.instrument}${d.price !== "Enquire" ? " · " + d.price : ""} confirms the band and identifies exactly what composition is producing it.`;
    if (band === "holding") return `Your structural position is intact but sensitive. A meaningful share of your work sits inside AI's active compression zone. The next 12-24 months are decisive. The full ${d.instrument}${d.price !== "Enquire" ? " · " + d.price : ""} maps exactly which work types are compressing and what the upstream move looks like.`;
    return `Majority of your work sits in AI's active compression zone. This is not a verdict — it is a starting point. The full ${d.instrument}${d.price !== "Enquire" ? " · " + d.price : ""} maps exactly where the compression hits, what compounds your exposure, and what upstream repositioning actually changes the trajectory.`;
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) { setSubStatus("Please enter a valid email."); return; }
    setSubStatus("✓ Subscribed. First read within the week.");
    setEmail("");
  };

  const archCards = [
    { key: "aspiring" as ArchKey, num: "01", name: "Aspiring", desc: "Student or entering the workforce. Building foundations for an AI-era career.", inst: "AAI© · AI Alignment Index" },
    { key: "working" as ArchKey, num: "02", name: "Working", desc: "In a role being reshaped by AI in real time. Mid-career professional.", inst: "ARI© · AI Replaceability Index" },
    { key: "leader" as ArchKey, num: "03", name: "Leader · CXO", desc: "Accountable for the structural outcomes of a team, function, or organisation.", inst: "BDI© · Brainpower Density Index" },
    { key: "org" as ArchKey, num: "04", name: "Organisation", desc: "CHRO, CEO, founder — reading the org's structural position at population scale.", inst: "ORG AI DARS©" },
  ];

  return (
    <section id="micro-diagnostic" style={{ padding: "80px 52px", background: "#EFEEEA", borderTop: `1px solid ${S.rule}`, borderBottom: `1px solid ${S.rule}` }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto 48px" }}>
        <div style={{ fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", color: S.gold, marginBottom: "18px" }}>30-Second Structural Read · Free</div>
        <h2 style={{ fontFamily: S.display, fontSize: "clamp(36px,5vw,60px)", lineHeight: 0.96, letterSpacing: "0.005em", color: S.ink, textTransform: "uppercase", marginBottom: "22px" }}>Take a <span style={{ color: S.gold }}>5-question</span> read on where your edge sits.</h2>
        <p style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: "17px", fontStyle: "italic", lineHeight: 1.6, color: "#2E2E2C", maxWidth: "780px", paddingLeft: "18px", borderLeft: `3px solid ${S.gold}` }}>Five questions. Each maps to a canonical doctrine concept. Score lands you in one of three structural bands — Edge Accelerating, Edge Holding, or Edge Thinning.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "18px", marginTop: "24px", paddingTop: "20px", borderTop: `1px solid ${S.rule}` }}>
          {["Q1 · Role Composition Map","Q2 · Judgment Ownership","Q3 · Thinking Ownership","Q4 · Personal Dividend","Q5 · Work Redesign"].map(p => (
            <span key={p} style={{ fontFamily: S.mono, fontSize: "9px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#2E2E2C", padding: "5px 11px", background: "rgba(160,120,48,0.08)", border: "1px solid rgba(160,120,48,0.18)" }}>{p}</span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
        {/* PICKER */}
        {stage === "picker" && (
          <>
            <div style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.mid, marginBottom: "20px", textAlign: "center" }}>Begin · Which describes you?</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4" style={{ gap: "1px", background: S.rule, border: `1px solid ${S.rule}` }}>
              {archCards.map(c => (
                <button key={c.key} onClick={() => startQuiz(c.key)}
                  style={{ background: S.white, border: "none", padding: "34px 26px", textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: "12px", transition: "background .25s ease", borderTop: `3px solid ${S.gold}`, fontFamily: "inherit" }}
                  onMouseEnter={e => (e.currentTarget.style.background = S.ink)}
                  onMouseLeave={e => (e.currentTarget.style.background = S.white)}>
                  <div style={{ fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.22em", color: S.gold }}>{c.num}</div>
                  <div style={{ fontFamily: S.display, fontSize: "28px", lineHeight: 1, color: S.ink, textTransform: "uppercase", letterSpacing: "0.005em" }}>{c.name}</div>
                  <div style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: "14px", fontStyle: "italic", color: "#2E2E2C", lineHeight: 1.5, minHeight: "64px" }}>{c.desc}</div>
                  <div style={{ fontFamily: S.mono, fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: S.mid, paddingTop: "14px", borderTop: `1px solid ${S.rule}` }}>{c.inst}</div>
                  <div style={{ fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: S.gold }}>Begin →</div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* QUIZ */}
        {stage === "quiz" && arch && (
          <div style={{ background: S.white, border: `1px solid ${S.rule}`, padding: "44px 48px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "36px", paddingBottom: "22px", borderBottom: `1px solid ${S.rule}`, flexWrap: "wrap", gap: "24px" }}>
              <button onClick={reset} style={{ background: "none", border: "none", fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: S.mid, cursor: "pointer" }}>← Change archetype</button>
              <div style={{ fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.16em", color: S.ink, textTransform: "uppercase", display: "flex", alignItems: "center", gap: "14px" }}>
                Question {qIdx + 1} of 5 · {ARCH_QUIZ[arch].label}
                <div style={{ width: "120px", height: "3px", background: S.rule, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, height: "100%", background: S.gold, width: `${((qIdx + 1) / 5) * 100}%`, transition: "width .4s ease" }} />
                </div>
              </div>
            </div>
            <div style={{ fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", color: S.gold, marginBottom: "14px" }}>{ARCH_QUIZ[arch].questions[qIdx].anchor}</div>
            <h3 style={{ fontFamily: S.display, fontSize: "clamp(24px,3.2vw,36px)", lineHeight: 1.14, letterSpacing: "0.005em", color: S.ink, marginBottom: "30px" }}>{ARCH_QUIZ[arch].questions[qIdx].q}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: S.rule, border: `1px solid ${S.rule}` }}>
              {ARCH_QUIZ[arch].questions[qIdx].opts.map((o, i) => (
                <button key={i} onClick={() => answer(o.s)}
                  style={{ background: S.white, border: "none", padding: "18px 22px", textAlign: "left", cursor: "pointer", fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: "14px", color: "#1A1A18", lineHeight: 1.55, transition: "background .2s ease,padding-left .2s ease", borderLeft: "3px solid transparent", display: "flex", alignItems: "flex-start", gap: "18px" }}
                  onMouseEnter={e => { e.currentTarget.style.background = S.ink; e.currentTarget.style.color = S.white; e.currentTarget.style.paddingLeft = "30px"; e.currentTarget.style.borderLeftColor = S.gold; }}
                  onMouseLeave={e => { e.currentTarget.style.background = S.white; e.currentTarget.style.color = "#1A1A18"; e.currentTarget.style.paddingLeft = "22px"; e.currentTarget.style.borderLeftColor = "transparent"; }}>
                  <span style={{ fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.18em", color: S.gold, textTransform: "uppercase", flexShrink: 0, width: "16px", paddingTop: "2px" }}>{["A","B","C","D"][i]}</span>
                  <span>{o.t}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* RESULT */}
        {stage === "result" && arch && (
          <div style={{ background: S.ink, color: S.white, padding: "56px 52px" }}>
            <div style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.24em", textTransform: "uppercase", color: S.gold, marginBottom: "24px" }}>Your Indicative Band</div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "24px", flexWrap: "wrap", marginBottom: "18px" }}>
              <div style={{ fontFamily: S.display, fontSize: "clamp(48px,8vw,92px)", lineHeight: 0.9, letterSpacing: "0.005em", color: bandColor, textTransform: "uppercase" }}>{bandLabel}</div>
              <div style={{ fontFamily: S.display, fontSize: "48px", lineHeight: 0.9, color: S.gold }}>
                {Math.round(total)}<span style={{ fontFamily: S.mono, fontSize: "11px", color: S.dim, letterSpacing: "0.18em", marginLeft: "4px" }}>/100</span>
              </div>
            </div>
            <div style={{ height: "1px", background: "rgba(160,120,48,0.4)", margin: "28px 0" }} />
            <p style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: "17px", lineHeight: 1.65, color: "rgba(247,246,243,0.85)", marginBottom: "34px", maxWidth: "820px" }}>{bandNarrative(arch)}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap", marginBottom: "28px" }}>
              <button onClick={() => onOpenModal(arch)} style={{ display: "inline-block", padding: "16px 30px", background: S.gold, color: S.ink, fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500, cursor: "pointer", border: "none" }}>
                {ARCH_QUIZ[arch].price === "Enquire" ? "Enquire about " : "Take the full "}{ARCH_QUIZ[arch].instrument} →
              </button>
              <button onClick={reset} style={{ background: "none", border: "none", fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(247,246,243,0.5)", cursor: "pointer" }}>↺ Try a different archetype</button>
            </div>
            <div style={{ paddingTop: "32px", marginTop: "32px", borderTop: "1px solid rgba(160,120,48,0.18)" }}>
              <div style={{ fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.gold, marginBottom: "10px" }}>Or get a structural read in your inbox monthly</div>
              <p style={{ fontFamily: "'EB Garamond',Georgia,serif", fontSize: "14px", lineHeight: 1.6, color: "rgba(247,246,243,0.65)", marginBottom: "18px", maxWidth: "680px", fontStyle: "italic" }}>Subscribe to One Structural Read A Month — published when there is something to say.</p>
              <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "1px", background: "rgba(255,255,255,0.08)", maxWidth: "580px", border: "1px solid rgba(160,120,48,0.3)" }}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your email" required style={{ flex: 1, background: "transparent", border: "none", padding: "14px 18px", fontFamily: S.mono, fontSize: "13px", color: S.white, outline: "none", letterSpacing: "0.04em" }} />
                <button type="submit" style={{ background: S.gold, color: S.ink, border: "none", padding: "14px 22px", fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", cursor: "pointer", fontWeight: 500 }}>Subscribe →</button>
              </form>
              {subStatus && <div style={{ fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.06em", color: S.gold2, marginTop: "10px" }}>{subStatus}</div>}
            </div>
            <div style={{ fontFamily: S.mono, fontSize: "9px", letterSpacing: "0.06em", color: "rgba(247,246,243,0.4)", fontStyle: "italic", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.08)", lineHeight: 1.6, marginTop: "24px" }}>Indicative read only. The full diagnostic for your archetype measures across 13+ dimensions, produces score and band with confidence interval, and delivers a structural action roadmap.</div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── DiagCards helper ─── */
function DiagCards({ cur, tiers, S }: {
  cur: Cur;
  tiers: { tier: string; name: string; inr: string; usd: string; time: string; feats: string[]; dark: boolean; waitlist?: boolean; onCta: () => void }[];
  S: Record<string, string>;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "1px", background: S.rule }}>
      {tiers.map((t, i) => (
        <div key={i} style={{ background: t.dark ? S.ink : S.white, padding: "30px 26px", display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase", color: t.dark ? S.gold2 : S.mid, marginBottom: "14px" }}>{t.tier}</div>
          <div style={{ fontFamily: S.display, fontSize: "30px", letterSpacing: "0.02em", color: t.dark ? S.white : S.ink, lineHeight: 1, marginBottom: "10px" }}>{t.name}</div>
          <div style={{ fontFamily: S.display, fontSize: "40px", color: t.dark ? S.white : S.ink, lineHeight: 1, marginBottom: "5px" }}>{cur === "inr" ? t.inr : t.usd}</div>
          <div style={{ fontFamily: "'EB Garamond',Georgia,serif", fontStyle: "italic", fontSize: "12px", color: S.gold, marginBottom: "14px", letterSpacing: "0.01em" }}>Priced to filter, not to fund.</div>
          <div style={{ fontSize: "14px", color: t.dark ? S.dim : S.mid, lineHeight: 1.6, marginBottom: "16px", minHeight: "34px" }}>{t.time}</div>
          <div style={{ marginBottom: "26px", flex: 1 }}>
            {t.feats.map((f, j) => (
              <div key={j} style={{ fontSize: "14px", color: t.dark ? S.white2 : S.ink2, padding: "7px 0", borderBottom: `1px solid ${t.dark ? "rgba(247,246,243,0.12)" : S.rule}`, lineHeight: 1.5 }}>{f}</div>
            ))}
          </div>
          {t.waitlist ? (
            <button disabled style={{ fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase", padding: "12px 24px", background: "none", color: t.dark ? S.white : S.ink, border: `1px solid ${t.dark ? "rgba(247,246,243,0.2)" : S.rule2}`, cursor: "default", opacity: 0.5 }}>Waitlist</button>
          ) : (
            <button onClick={t.onCta} style={{ fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase", padding: "12px 24px", background: t.dark ? S.white : "none", color: t.dark ? S.ink : S.ink, border: `1px solid ${t.dark ? "none" : S.rule2}`, cursor: "pointer", transition: "all .2s" }}>Begin my assessment →</button>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Main Page ─── */
export default function AIEdgeLab() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState<string | undefined>(undefined);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cur, setCur] = useState<Cur>("inr");
  const [scrollPct, setScrollPct] = useState(0);
  const [enquiryForm, setEnquiryForm] = useState({ name: "", email: "", org: "", role: "", message: "" });
  const [enquiryStatus, setEnquiryStatus] = useState("");
  const [mlEmail, setMlEmail] = useState("");
  const [mlStatus, setMlStatus] = useState("");

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      setCur(tz.includes("Kolkata") || tz.includes("Calcutta") || tz.includes("Asia") ? "inr" : "usd");
    } catch { setCur("inr"); }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      setScrollPct(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openModal = (key?: string) => { setModalKey(key); setModalOpen(true); };
  const price = (inr: string, usd: string) => cur === "inr" ? inr : usd;

  const handleEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, org, role, message } = enquiryForm;
    const subject = `ORG AI DARS© Enquiry — ${org} (${name}, ${role})`;
    const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0AOrganisation: ${org}%0D%0ARole: ${role}%0D%0A%0D%0AContext:%0D%0A${encodeURIComponent(message)}`;
    window.location.href = `mailto:nitin@axionindex.org?subject=${encodeURIComponent(subject)}&body=${body}`;
    setEnquiryStatus("Opening your mail client — send the message to complete the enquiry.");
  };

  const handleMlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mlEmail || !mlEmail.includes("@")) { setMlStatus("Please enter a valid email."); return; }
    setMlStatus("✓ Subscribed. First read within the week.");
    setMlEmail("");
  };

  const S = {
    white: "#F7F6F3", white2: "#EEECEA", white3: "#E2E0DC",
    ink: "#0D0D0B", ink2: "#1A1A18", ink3: "#2E2E2C",
    mid: "#7A7870", dim: "#B0AEA8", gold: "#A07830", gold2: "#C49848",
    rule: "rgba(13,13,11,0.1)", rule2: "rgba(13,13,11,0.18)",
    mono: "'DM Mono','Courier New',monospace",
    display: "'Bebas Neue',sans-serif",
    sans: "'DM Sans',system-ui,sans-serif",
    serif: "'EB Garamond',Georgia,serif",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,200;0,300;0,400;0,500;1,300&family=DM+Mono:wght@300;400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
        @keyframes prUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes edgeRuleDraw { from { transform:scaleX(0); } to { transform:scaleX(1); } }
        .law-row:hover { background:${S.white2}; padding-left:62px; }
        .law-row:hover .law-body { max-height:200px !important; opacity:1 !important; margin-top:18px !important; }
        .law-row:hover .law-arrow { opacity:1 !important; transform:translateX(0) !important; }
        .jcard:hover { background:${S.ink} !important; transform:translateY(-8px) !important; box-shadow:0 16px 40px rgba(0,0,0,0.18) !important; }
        .jcard:hover .jcard-who { color:${S.white} !important; }
        .jcard:hover .jcard-n { color:${S.gold2} !important; }
        .jcard:hover .jcard-inst { color:${S.dim} !important; }
        .jcard:hover .jcard-price { color:${S.white} !important; }
        .jcard:hover .jcard-from { color:${S.dim} !important; }
        .jcard:hover .jcard-go { color:${S.gold2} !important; gap:12px !important; }
        .actor:hover { background:${S.white2}; }
        .explore-link:hover { gap:18px; color:${S.gold}; border-color:${S.gold}; }
        .framework-link:hover { gap:18px; color:${S.gold}; border-color:${S.gold}; }
        .ev:hover .ev-stat { color:${S.gold}; }
        .ev:hover .ev-src { color:${S.gold}; }
        .ev:nth-child(even) { background:${S.ink}; }
        .ev:nth-child(even) .ev-stat { color:${S.white}; }
        .ev:nth-child(even) .ev-label { color:${S.white2}; }
        .ev:nth-child(even) .ev-body { color:rgba(247,246,243,0.55); }
        .ev:nth-child(even) .ev-src { color:rgba(247,246,243,0.4); }
        .ev:nth-child(even):hover { background:${S.ink2}; }
        .ev:nth-child(even):hover .ev-stat { color:${S.gold2}; }
        .ev:nth-child(even):hover .ev-src { color:${S.gold2}; }
        .closing-btn-inv:hover { background:${S.white2}; }
        .closing-btn-out:hover { border-color:rgba(247,246,243,0.5); color:${S.white}; }
        .ft-link:hover { color:${S.gold2}; }
        .hdr-link:hover { color:${S.ink}; }
        .ec:hover { background:${S.white2}; }
        .wyg-sample:hover { color:${S.gold}; gap:14px; }
        .wyg-sample:hover::after { transform:translateX(4px); }
        @media(max-width:768px){
          .law-row { padding:28px 32px; }
          .law-row:hover { padding-left:38px; }
          .law-body { max-height:none !important; opacity:1 !important; margin-top:14px !important; }
        }
      `}</style>

      {/* Progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "2px", background: S.gold, width: `${scrollPct}%`, zIndex: 9999, transition: "width 0.1s" }} />

      <PersonaModal open={modalOpen} onClose={() => setModalOpen(false)} initialKey={modalKey} />

      <div style={{ background: S.white, color: S.ink, fontFamily: S.sans, fontWeight: 300, overflowX: "hidden" }}>

        {/* ── HEADER ── */}
        <header style={{ position: "sticky", top: 0, zIndex: 200, height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 52px", background: "rgba(247,246,243,0.94)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${S.rule}` }}>
          <div style={{ fontFamily: S.mono, fontSize: "13px", letterSpacing: "0.24em", textTransform: "uppercase" }}>AI Edge Lab · <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Axionindex</Link></div>
          <nav className="hidden md:flex" style={{ alignItems: "center", gap: "28px" }}>
            {[["the-evidence-wall","The Evidence Wall"],["#actors","Workplace"],["#framework","Framework"],["doctrine","Doctrine"],["#research","Research"],["methodology","Methodology"],["#micro-diagnostic","Diagnostic"],["#about","About"]].map(([href, label]) => (
              <a key={href as string} href={href as string} className="hdr-link" style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: S.mid, textDecoration: "none", transition: "color .2s" }}>{label as string}</a>
            ))}
            <button onClick={() => openModal("working")} style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", background: S.ink, color: S.white, padding: "9px 20px", border: "none", cursor: "pointer" }}>Find My AI Edge</button>
          </nav>
          <div className="hidden md:block" style={{ fontFamily: S.mono, fontSize: "11px", color: S.dim, letterSpacing: "0.08em" }}>axionindex.org · 2026</div>
          <button className="flex md:hidden" onClick={() => setMobileOpen(!mobileOpen)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: S.ink }}>
            {mobileOpen ? "✕" : "☰"}
          </button>
        </header>
        {mobileOpen && (
          <div style={{ background: "rgba(247,246,243,0.98)", borderBottom: `1px solid ${S.rule}`, zIndex: 199, position: "sticky", top: "56px" }}>
            {[["#actors","Workplace"],["#framework","Framework"],["#micro-diagnostic","Diagnostic"],["#research","Research"],["#about","About"]].map(([href, label]) => (
              <a key={href as string} href={href as string} onClick={() => setMobileOpen(false)} style={{ display: "block", fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: S.mid, textDecoration: "none", padding: "12px 32px", borderBottom: `1px solid ${S.rule}` }}>{label as string}</a>
            ))}
          </div>
        )}

        {/* ── HERO ── */}
        <section>
          <div style={{ width: "100%", height: "300px", background: "linear-gradient(160deg,#1A1C20 0%,#282C32 35%,#353830 65%,#1E1E1A 100%)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg,transparent 0px,transparent 2px,rgba(255,255,255,0.008) 2px,rgba(255,255,255,0.008) 4px)" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "55%", background: "linear-gradient(to top,#0A0B0E 0%,#0E1014 20%,transparent 100%)" }} />
            <div className="hidden md:block" style={{ position: "absolute", right: "44px", top: "50%", transform: "translateY(-50%) rotate(90deg)", transformOrigin: "center center", fontFamily: S.display, fontSize: "48px", letterSpacing: "0.12em", color: "#FFFFFF", whiteSpace: "nowrap" }}>AI EDGE LAB</div>
            <div style={{ position: "absolute", bottom: "32px", left: "52px", fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#FFFFFF" }}>The Architecture of Work in the Post-AI Era · 2026</div>
          </div>
          {/* Hero two-col */}
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ borderBottom: `1px solid ${S.rule}` }}>
            <div style={{ padding: "52px", borderRight: `1px solid ${S.rule}` }}>
              <div style={{ fontFamily: S.mono, fontSize: "13px", letterSpacing: "0.24em", textTransform: "uppercase", color: S.mid, marginBottom: "20px" }}>AI Edge Lab · Four Actors · One Transformation</div>
              <h1 style={{ fontFamily: S.display, fontSize: "clamp(64px,9vw,110px)", lineHeight: 0.95, letterSpacing: "0.01em", color: S.ink }}>THE<br />WORK<br /><span style={{ color: S.gold }}>SHIFT.</span></h1>
              <p style={{ fontFamily: S.display, fontSize: "clamp(20px,2.2vw,30px)", color: S.ink, lineHeight: 1.15, letterSpacing: "0.015em", textTransform: "uppercase", marginTop: "28px", maxWidth: "520px" }}>
                Measure where you stand in the AI Era — and how long your <span style={{ color: S.gold }}>edge will hold.</span>
              </p>
              <button onClick={() => openModal("working")} className="explore-link" style={{ display: "inline-flex", alignItems: "center", gap: "12px", fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.ink, paddingBottom: "10px", transition: "gap .25s ease,color .25s ease,border-color .25s ease", marginTop: "36px", background: "none", border: "none", borderBottom: `1px solid ${S.ink}`, cursor: "pointer" }}>
                Find My AI Edge <span style={{ fontSize: "18px", fontFamily: S.display }}>→</span>
              </button>
              <div style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: S.mid, marginTop: "16px" }}>Private · Confidential · Not shared with your employer</div>
            </div>
            <div style={{ padding: "52px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <p style={{ fontSize: "16px", color: S.mid, lineHeight: 1.9, fontWeight: 300, marginBottom: "32px", maxWidth: "400px" }}>The workplace now has four actors: the Employee, the CXO, the Organisation — and AI. Each is being reshaped by a different kind of pressure. AI Edge Lab maps that pressure, measures your exposure, and shows where judgment still creates advantage.</p>
              <div style={{ display: "flex", gap: "32px", marginBottom: "32px", flexWrap: "wrap" }}>
                {[{ n: "39%", l: "Skills change by 2030 · WEF", href: "https://www.weforum.org/publications/the-future-of-jobs-report-2025/" },{ n: "23%", l: "Scaled AI · McKinsey", href: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai" },{ n: "95%", l: "No P&L impact · MIT NANDA", href: "https://mlq.ai/media/quarterly_decks/v0.1_State_of_AI_in_Business_2025_Report.pdf" }].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener" style={{ borderLeft: `1px solid ${S.rule2}`, paddingLeft: "16px", textDecoration: "none" }}>
                    <div style={{ fontFamily: S.display, fontSize: "36px", color: S.ink, lineHeight: 1 }}>{s.n}</div>
                    <div style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: S.mid, marginTop: "4px" }}>{s.l}</div>
                  </a>
                ))}
              </div>
              <button onClick={() => openModal()} className="framework-link" style={{ display: "inline-flex", alignItems: "center", gap: "12px", fontFamily: S.mono, fontSize: "14px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.ink, paddingBottom: "10px", transition: "gap .25s ease,color .25s ease,border-color .25s ease", background: "none", border: "none", borderBottom: `1px solid ${S.ink}`, cursor: "pointer" }}>
                Explore the Framework <span style={{ fontSize: "20px", fontFamily: S.display }}>→</span>
              </button>
            </div>
          </div>
          {/* Hero Mini-Cards · Four Actors */}
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ borderTop: `1px solid ${S.rule}`, borderBottom: `1px solid ${S.rule}` }}>
            {[
              { num: "01 · Aspiring", who: "Aspiring\nProfessional", inst: "AI Alignment Index©", bg: "#F2F0EA", color: S.ink, goldColor: S.gold, href: "#micro-diagnostic" },
              { num: "02 · Working", who: "Working\nProfessional", inst: "AI Replaceability Index©", bg: "#D8D2C5", color: S.ink, goldColor: "#5A4218", href: "#micro-diagnostic" },
              { num: "03 · Leader · CXO", who: "Leader", inst: "Brainpower Density Index©", bg: "#7A7468", color: S.white, goldColor: S.gold2, href: "#micro-diagnostic" },
              { num: "04 · Organisation", who: "Organisation", inst: "ORG AI DARS©", bg: S.ink, color: S.white, goldColor: S.gold, href: "#micro-diagnostic" },
            ].map((c, i) => (
              <a key={i} href={c.href} style={{ padding: "36px 32px 28px", display: "flex", flexDirection: "column", gap: "14px", transition: "transform .25s ease,box-shadow .25s ease", borderRight: i < 3 ? `1px solid ${S.rule}` : "none", textDecoration: "none", background: c.bg }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: c.color, opacity: 0.65 }}>{c.num}</div>
                <div style={{ fontFamily: S.display, fontSize: "22px", lineHeight: 1, letterSpacing: "0.01em", textTransform: "uppercase", color: c.color, whiteSpace: "pre-line" }}>{c.who}</div>
                <div style={{ fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: c.color, opacity: 0.55, marginTop: "auto" }}>{c.inst}</div>
                <div style={{ fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: c.goldColor, display: "inline-flex", alignItems: "center", gap: "6px" }}>Read →</div>
              </a>
            ))}
          </div>
        </section>

        {/* ── EVIDENCE WALL TEASER ── */}
        <section style={{ padding: "80px 52px", background: S.ink, color: S.white, borderTop: "1px solid rgba(160,120,48,0.22)", borderBottom: "1px solid rgba(160,120,48,0.22)" }}>
          <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "18px", paddingBottom: "18px", marginBottom: "32px", borderBottom: "1px solid rgba(213,210,201,0.18)" }}>
              <div style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.gold, flex: 1 }}>The Evidence Wall · Why This Doctrine Was Built</div>
              <div style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.14em", color: "#9C978C" }}>01.5 / 06</div>
            </div>
            <h2 style={{ fontFamily: S.display, fontSize: "clamp(40px,5.4vw,72px)", lineHeight: 0.96, textTransform: "uppercase", color: S.white, letterSpacing: "0.005em", marginBottom: "18px", maxWidth: "980px" }}>Twelve Reports. Seven Institutions.<br />One <span style={{ color: S.gold }}>Structural Diagnosis</span>.</h2>
            <p style={{ fontFamily: S.serif, fontStyle: "italic", fontSize: "18px", lineHeight: 1.6, color: "#9C978C", maxWidth: "780px", marginBottom: "36px" }}>Six months of synthesis across every major AI transformation report — MIT NANDA, McKinsey, Gartner, RAND, BCG, IBM, S&P Global, WEF, and others. The findings converge with unusual clarity.</p>
            <div className="grid grid-cols-2 md:grid-cols-5" style={{ gap: "1px", background: "rgba(213,210,201,0.18)", marginBottom: "36px" }}>
              {[["12","Reports analysed"],["7","Institutions"],["15K+","Executives surveyed"],["$665B","Invested in AI"],["95%","Zero P&L impact"]].map(([v, l]) => (
                <div key={l} style={{ background: S.ink, padding: "24px 22px" }}>
                  <div style={{ fontFamily: S.display, fontSize: "44px", lineHeight: 1, color: S.gold, letterSpacing: "0.005em", marginBottom: "6px" }}>{v}</div>
                  <div style={{ fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#9C978C" }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "18px" }}>
              <p style={{ fontFamily: S.serif, fontStyle: "italic", fontSize: "17px", color: "#E8E6E0", maxWidth: "640px", lineHeight: 1.55 }}><strong style={{ color: S.white, fontStyle: "normal", fontWeight: 500 }}>The technology works. The architecture does not.</strong> Naming the new problem is the precondition for solving it.</p>
              <a href="#research" style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: S.gold, border: `1px solid ${S.gold}`, padding: "14px 22px", textDecoration: "none", transition: "all .2s ease", whiteSpace: "nowrap" }}
                onMouseEnter={e => { e.currentTarget.style.background = S.gold; e.currentTarget.style.color = S.white; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = S.gold; }}>
                Read The Evidence Wall →
              </a>
            </div>
          </div>
        </section>

        {/* ── MICRO-DIAGNOSTIC ── */}
        <MicroDiagnostic S={S} onOpenModal={(key) => openModal(key)} />

        {/* ── FOUR ACTORS ── */}
        <section id="actors" style={{ borderBottom: `1px solid ${S.rule}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 52px", borderBottom: `1px solid ${S.rule}`, background: S.white2 }}>
            <span style={{ fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.mid }}>The Four Actors of the AI Workplace</span>
            <span style={{ fontFamily: S.mono, fontSize: "12px", color: S.dim }}>02 / 06</span>
          </div>
          <div style={{ padding: "28px 52px" }}>
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ marginBottom: "28px" }}>
              <div style={{ borderRight: `1px solid ${S.rule}`, paddingRight: "52px" }}>
                <h2 style={{ fontFamily: S.display, fontSize: "clamp(52px,7vw,88px)", lineHeight: 0.95, letterSpacing: "0.01em", color: S.ink, marginBottom: "28px" }}>THE<br />FOUR<br /><span style={{ color: S.gold }}>ACTORS.</span></h2>
              </div>
              <div style={{ paddingLeft: "52px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <p style={{ fontSize: "16px", color: S.mid, lineHeight: 1.9, fontWeight: 300, maxWidth: "460px" }}>For decades, three actors shaped work: the employee, the leader, and the organisation. AI has entered as a fourth — not as a tool in the org chart, but as an actor that absorbs work, reprices what humans do, and forces every other actor to reckon with their structural position.</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4" style={{ gap: "1px", background: S.rule }}>
            {[
              { num: "01", badge: "Individual", name: "THE ", accent: "EMPLOYEE.", q: '"Am I structurally positioned for the AI era — or in the compression zone without knowing it?"', arrow: "Read for Professionals →", href: "#micro-diagnostic" },
              { num: "02", badge: "Leadership", name: "THE ", accent: "CXO.", q: '"My informational advantage is gone. What is my new structural role?"', arrow: "Read for Leaders →", href: "#micro-diagnostic" },
              { num: "03", badge: "The New Entrant", name: "ARTIFICIAL ", accent: "INTELLIGENCE.", q: '"AI is not a tool in the org chart. It is an actor that absorbs work — predictably."', arrow: "See the compression framework →", href: "#framework" },
              { num: "04", badge: "The System", name: "THE ", accent: "ORGANISATION.", q: '"We are investing in AI at scale. Why aren\'t outcomes matching investment?"', arrow: "Read for Organisations →", href: "#micro-diagnostic" },
            ].map((a, i) => (
              <div key={i} className="actor" style={{ background: S.white, padding: "36px 28px", display: "flex", flexDirection: "column", gap: "14px", transition: "background .25s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontFamily: S.display, fontSize: "48px", lineHeight: 0.9, color: "rgba(13,13,11,0.07)" }}>{a.num}</div>
                  <div style={{ fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: S.gold, border: `1px solid ${S.gold}`, padding: "4px 10px" }}>{a.badge}</div>
                </div>
                <div style={{ fontFamily: S.display, fontSize: "clamp(28px,3vw,38px)", letterSpacing: "0.02em", color: S.ink, lineHeight: 1 }}>{a.name}<span style={{ color: S.gold }}>{a.accent}</span></div>
                <div style={{ fontSize: "14px", fontStyle: "italic", color: S.mid, lineHeight: 1.75, borderLeft: `2px solid ${S.rule2}`, paddingLeft: "14px", fontWeight: 300 }}>{a.q}</div>
                <a href={a.href} style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: S.gold, textDecoration: "none", marginTop: "auto" }}>{a.arrow}</a>
              </div>
            ))}
          </div>
        </section>

        {/* ── AUDIENCE JOURNEY ── */}
        <section id="start" style={{ borderTop: `1px solid ${S.rule}`, borderBottom: `1px solid ${S.rule}`, background: S.white2 }}>
          <div style={{ padding: "56px 52px 0" }}>
            <div style={{ fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", color: S.gold, marginBottom: "16px" }}>START HERE · WHERE DO YOU STAND?</div>
            <h2 style={{ fontFamily: S.display, fontSize: "clamp(48px,7vw,96px)", letterSpacing: "0.01em", color: S.ink, lineHeight: 0.95, marginBottom: "14px", textTransform: "uppercase" }}>FIND YOUR <span style={{ color: S.gold }}>EDGE.</span></h2>
            <p style={{ fontSize: "14px", color: S.mid, lineHeight: 1.65, maxWidth: "620px" }}>Four actors, four instruments. Choose where you stand — your assessment is built for it, and your report lands within 48 hours.</p>
            <p style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: S.mid, maxWidth: "920px", marginTop: "14px" }}>Calibrated against the four E.D.G.E. dimensions <span style={{ color: S.gold }}>·</span> Exposure <span style={{ color: S.gold }}>·</span> Decision Density <span style={{ color: S.gold }}>·</span> Growth of Boundary <span style={{ color: S.gold }}>·</span> Economic Anchoring</p>
          </div>
          <div style={{ margin: "56px 52px 0" }}>
            <div style={{ fontFamily: S.display, fontSize: "clamp(28px,3.6vw,52px)", lineHeight: 1, letterSpacing: "0.015em", color: S.ink, marginBottom: "18px" }}>MEASURE YOUR HUMAN ADVANTAGE IN THE <span style={{ color: S.gold }}>AI ERA.</span></div>
            <div style={{ height: "1px", background: S.gold, width: "100%", animation: "edgeRuleDraw 1.3s 0.35s cubic-bezier(.2,.7,.2,1) both", transformOrigin: "left" }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4" style={{ gap: "1px", background: S.rule, marginTop: "40px" }}>
            {[
              { key: "aspiring", n: "01 · Student", who: "Aspiring Professional", inst: "AI Alignment Index©", inr: "₹799", usd: "$24", go: "See where I'm building →" },
              { key: "working", n: "02 · Professional", who: "Working Professional", inst: "AI Replaceability Index©", inr: "₹1,499", usd: "$44", go: "See my compression risk →" },
              { key: "leader", n: "03 · Leader · CXO", who: "Leader", inst: "Brainpower Density Index©", inr: "₹5,999", usd: "$179", go: "Measure my leadership edge →" },
              { key: "org", n: "04 · Organisation", who: "Organisation", inst: "ORG AI DARS©", inr: "Invite", usd: "Invite", go: "Map our AI decision architecture →" },
            ].map((c) => (
              <button key={c.key} onClick={() => openModal(c.key)} className="jcard"
                style={{ background: S.white, padding: "32px 26px", display: "flex", flexDirection: "column", cursor: "pointer", transition: "background .25s ease, transform .25s ease, box-shadow .25s ease", border: "none", textAlign: "left" }}>
                <div className="jcard-n" style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: S.gold, marginBottom: "18px", transition: "color .25s" }}>{c.n}</div>
                <div className="jcard-who" style={{ fontFamily: S.display, fontSize: "clamp(24px,2.4vw,32px)", letterSpacing: "0.02em", color: S.ink, lineHeight: 1.04, marginBottom: "10px", transition: "color .25s" }}>{c.who}</div>
                <div className="jcard-inst" style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: S.mid, marginBottom: "18px", lineHeight: 1.5, transition: "color .25s" }}>{c.inst}</div>
                <div className="jcard-price" style={{ fontFamily: S.display, fontSize: "42px", color: S.ink, lineHeight: 1, marginTop: "auto", transition: "color .25s" }}>
                  {c.inr !== "Invite" && <span className="jcard-from" style={{ fontFamily: S.mono, fontSize: "12px", color: S.mid, letterSpacing: "0.06em", display: "block", marginBottom: "4px", transition: "color .25s" }}>From</span>}
                  {price(c.inr, c.usd)}
                </div>
                <div className="jcard-go" style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: S.gold, marginTop: "16px", display: "flex", alignItems: "center", gap: "6px", transition: "gap .25s ease,color .25s" }}>{c.go}</div>
              </button>
            ))}
          </div>
        </section>

        {/* ── DIAGNOSTIC JOURNEY ── */}
        <section style={{ borderBottom: `1px solid ${S.rule}` }}>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ padding: "56px 52px 36px", gap: 0 }}>
            <div style={{ borderRight: `1px solid ${S.rule}`, paddingRight: "52px" }}>
              <div style={{ fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.gold, marginBottom: "12px" }}>The Diagnostic Journey · 12 minutes · 48 hours</div>
              <h2 style={{ fontFamily: S.display, fontSize: "clamp(36px,5vw,60px)", letterSpacing: "0.02em", color: S.ink, lineHeight: 1 }}>Measure. <span style={{ color: S.gold }}>Decode.</span><br />Reposition.</h2>
            </div>
            <div style={{ paddingLeft: "52px", display: "flex", alignItems: "center" }}>
              <p style={{ fontSize: "16px", color: S.ink2, lineHeight: 1.7, maxWidth: "480px" }}>What happens between choosing your instrument and acting on the result. Three steps. One report. A practical direction for what to do next.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 0, background: S.rule }}>
            {[
              { n: "§ 01 · Measure", verb: "Measure", body: "Understand your AI exposure, your work compression risk, and your judgment density. The starting position — measured, not guessed.", bg: S.white, verbColor: S.ink, bodyColor: S.mid },
              { n: "§ 02 · Decode", verb: "Decode", body: "See which parts of your work are AI-dominant, AI-assisted, or AI-resistant. The structural read across all four E.D.G.E. dimensions.", bg: "#8C8983", verbColor: S.white, bodyColor: "rgba(247,246,243,0.88)" },
              { n: "§ 03 · Reposition", verb: "Reposition", body: "A practical 12-month direction — what to protect, what to shift, what to build. The action, not just the diagnosis.", bg: S.ink, verbColor: S.gold, bodyColor: "rgba(247,246,243,0.65)" },
            ].map((step, i) => (
              <div key={i} style={{ padding: "44px 36px", position: "relative", minHeight: "240px", display: "flex", flexDirection: "column", background: step.bg }}>
                <div style={{ fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.gold2, marginBottom: "22px" }}>{step.n}</div>
                <div style={{ fontFamily: S.display, fontSize: "clamp(38px,4.5vw,56px)", letterSpacing: "0.02em", lineHeight: 0.95, marginBottom: "18px", color: step.verbColor }}>{step.verb}</div>
                <p style={{ fontSize: "15px", lineHeight: 1.7, marginTop: "auto", color: step.bodyColor }}>{step.body}</p>
                {i < 2 && <span style={{ position: "absolute", right: "-10px", top: "50%", transform: "translateY(-50%)", fontSize: "18px", color: S.gold, zIndex: 2 }} className="hidden md:block">→</span>}
              </div>
            ))}
          </div>
        </section>

        {/* ── DOCTRINE ── */}
        <section id="doctrine" style={{ borderBottom: `1px solid ${S.rule}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 52px", borderBottom: `1px solid ${S.rule}`, background: S.white2 }}>
            <span style={{ fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.mid }}>The AI Edge Doctrine — Three Laws</span>
            <span style={{ fontFamily: S.mono, fontSize: "12px", color: S.dim }}>03 / 06</span>
          </div>
          <div style={{ padding: "52px" }}>
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ marginBottom: "40px" }}>
              <div style={{ borderRight: `1px solid ${S.rule}`, paddingRight: "52px" }}>
                <h2 style={{ fontFamily: S.display, fontSize: "clamp(52px,7vw,88px)", lineHeight: 0.95, color: S.ink, marginBottom: "28px" }}>THE<br />THREE<br /><span style={{ color: S.gold }}>LAWS.</span></h2>
              </div>
              <div style={{ paddingLeft: "52px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <p style={{ fontSize: "16px", color: S.mid, lineHeight: 1.9, fontWeight: 300, maxWidth: "460px" }}>These are not predictions. They are structural observations about what is already happening — in the data, in organisations, in the careers of professionals who feel the compression without yet having a name for it.</p>
              </div>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${S.rule}` }}>
            {[
              { num: "Law I · Intelligence Abundance", title: <>As intelligence approaches <span style={{ color: S.gold }}>zero cost</span>, its value in work declines.</>, body: "Research synthesis, data modelling, report generation — now accessible at marginal cost. Roles that derived value from producing structured intelligence face direct structural repricing. This is not a future risk. It is a present economic condition." },
              { num: "Law II · Judgment Scarcity", title: <>As intelligence becomes cheap, <span style={{ color: S.gold }}>judgment</span> becomes the scarce resource.</>, body: "Judgment operates where inputs are ambiguous, stakes are high, and consequences are owned by a person. AI can be directed by judgment. It cannot exercise it. The economic premium migrates from intelligence to judgment." },
              { num: "Law III · The Compression Curve", title: <>AI compresses work from execution upward until <span style={{ color: S.gold }}>judgment becomes the boundary</span>.</>, body: "Compression moves in predictable sequence: execution first, analysis next, insight partially, judgment last. This creates a structural line: above it, human value compounds; below it, it compresses." },
            ].map((law, i) => (
              <div key={i} className="law-row" style={{ borderBottom: `1px solid ${S.rule}`, padding: "38px 52px", cursor: "default", position: "relative", transition: "background .3s ease,padding-left .3s ease", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "20px", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.gold, flexShrink: 0 }}>{law.num}</span>
                  <span className="law-arrow" style={{ fontFamily: S.sans, fontSize: "18px", color: S.gold, opacity: 0, transform: "translateX(-8px)", transition: "opacity .3s ease,transform .3s ease", marginLeft: "auto" }}>→</span>
                </div>
                <div style={{ fontFamily: S.display, fontSize: "clamp(26px,3vw,40px)", lineHeight: 1.05, color: S.ink, letterSpacing: "0.02em", marginTop: "8px" }}>{law.title}</div>
                <div className="law-body" style={{ fontSize: "15px", color: S.mid, lineHeight: 1.85, fontWeight: 300, maxWidth: "760px", marginTop: 0, maxHeight: 0, opacity: 0, transition: "max-height .45s ease,opacity .4s ease,margin-top .4s ease", overflow: "hidden" }}>{law.body}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 0, background: S.rule, marginTop: "1px" }}>
            {[
              { label: "Industrial Age", resource: "Physical Labour", desc: "Organisations built for efficiency of physical execution. Headcount = capacity. Management = coordination of effort.", bg: S.white, resourceColor: S.ink, descColor: S.mid, labelColor: S.dim },
              { label: "Knowledge Economy", resource: "Analytical Intelligence", desc: "Organisations built for production of structured thinking. Talent = premium intelligence. Management = analysis to decisions.", bg: "#8C8983", resourceColor: S.white, descColor: "rgba(247,246,243,0.85)", labelColor: "rgba(247,246,243,0.65)" },
              { label: "AI Era · Present", resource: "Judgment", desc: "Organisations built for consequence-bearing decision ownership. Advantage = framing, deciding, being accountable. Architecture = concentration of judgment.", bg: S.ink, resourceColor: S.gold2, descColor: "rgba(247,246,243,0.55)", labelColor: "rgba(247,246,243,0.4)", now: true },
            ].map((era, i) => (
              <div key={i} style={{ padding: "36px 28px", position: "relative", background: era.bg }}>
                {era.now && <div style={{ position: "absolute", top: "16px", right: "16px", fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", background: S.gold, color: S.white, padding: "6px 14px" }}>Now</div>}
                <div style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: era.labelColor, marginBottom: "16px" }}>{era.label}</div>
                <div style={{ fontFamily: S.display, fontSize: "clamp(24px,2.5vw,32px)", letterSpacing: "0.02em", color: era.resourceColor, marginBottom: "10px" }}>{era.resource}</div>
                <p style={{ fontSize: "14px", color: era.descColor, lineHeight: 1.75, fontWeight: 300 }}>{era.desc}</p>
              </div>
            ))}
          </div>
          {/* Logic Table */}
          <div style={{ marginTop: "1px", borderTop: `1px solid ${S.rule}`, background: S.white }}>
            <div className="grid" style={{ gridTemplateColumns: "1fr 60px 1fr", padding: "18px 52px", borderBottom: `1px solid ${S.rule}`, background: S.white2 }}>
              <span style={{ fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.mid }}>The old career logic</span>
              <span />
              <span style={{ fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.gold }}>The AI-era career logic</span>
            </div>
            {[["Skill accumulation","Judgment density"],["More output","Better decisions"],["Role security","Work defensibility"],["Experience years","Consequence ownership"],["Functional expertise","Decision architecture"]].map(([old, neo], i) => (
              <div key={i} className="grid" style={{ gridTemplateColumns: "1fr 60px 1fr", padding: "20px 52px", borderBottom: i < 4 ? `1px solid ${S.rule}` : "none", alignItems: "center" }}>
                <div style={{ fontFamily: S.display, fontSize: "clamp(20px,2.4vw,28px)", letterSpacing: "0.02em", color: S.mid, lineHeight: 1.1 }}>{old}</div>
                <div style={{ fontFamily: S.sans, fontSize: "18px", color: S.gold, textAlign: "center", fontWeight: 300 }}>→</div>
                <div style={{ fontFamily: S.display, fontSize: "clamp(22px,2.6vw,30px)", letterSpacing: "0.02em", color: S.ink, lineHeight: 1.1 }}>{neo}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PULLQUOTE ── */}
        <div style={{ padding: "52px", background: S.ink, borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.26em", textTransform: "uppercase", color: S.gold, marginBottom: "24px" }}>The Doctrine in One Sentence · AI Edge Lab · 2026</div>
          <div style={{ fontFamily: S.display, fontSize: "clamp(28px,4vw,56px)", lineHeight: 1.05, letterSpacing: "0.02em", color: S.white, maxWidth: "1200px" }}>
            AI DOES NOT ELIMINATE WORK FIRST.<br /><span style={{ whiteSpace: "nowrap" }}>IT ELIMINATES THE <span style={{ color: S.gold2 }}>STRUCTURAL PREMIUM</span> ON INTELLIGENCE INSIDE WORK.</span>
          </div>
          <div style={{ fontFamily: S.mono, fontSize: "12px", color: S.gold, marginTop: "24px", letterSpacing: "0.12em", textTransform: "uppercase" }}>Nitin Nahata · CHRO, Gameskraft · Founder, Axionindex</div>
        </div>

        {/* ── WHAT YOU GET ── */}
        <section id="whatyouget" style={{ borderBottom: `1px solid ${S.rule}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 52px", borderBottom: `1px solid ${S.rule}`, background: S.white2 }}>
            <span style={{ fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.mid }}>What Your Report Gives You</span>
            <span style={{ fontFamily: S.mono, fontSize: "12px", color: S.dim }}>03.5 / 06</span>
          </div>
          <div style={{ padding: "52px 52px 0" }}>
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ marginBottom: "36px" }}>
              <div style={{ borderRight: `1px solid ${S.rule}`, paddingRight: "52px" }}>
                <h2 style={{ fontFamily: S.display, fontSize: "clamp(40px,5.5vw,64px)", lineHeight: 0.95, color: S.ink, marginBottom: "28px" }}>NOT A<br />SCORE.<br /><span style={{ color: S.gold }}>A MAP.</span></h2>
              </div>
              <div style={{ paddingLeft: "52px", display: "flex", alignItems: "center" }}>
                <p style={{ fontSize: "16px", color: S.mid, lineHeight: 1.9, fontWeight: 300, maxWidth: "460px" }}>
                  Every diagnostic produces a structural report, not a number. Here is what lands in your inbox within 48 hours — built for who you are.{" "}
                  <span style={{ color: S.mid }}>·</span>{" "}
                  See samples:{" "}
                  {[["sample-report-aai.html","AAI©"],["sample-report.html","ARI©"],["sample-report-bdi.html","BDI©"],["sample-report-dars.html","DARS©"]].map(([href, label]) => (
                    <a key={href} href={href} target="_blank" rel="noopener" style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: S.gold, borderBottom: `1px solid ${S.gold}`, paddingBottom: "2px", marginLeft: "6px", textDecoration: "none" }}>{label}</a>
                  ))}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "1px", background: S.rule, marginTop: "8px" }}>
            {[
              { aud: "For Individuals · ARI© / AAI©", inst: "Your structural position", items: ["Your AI exposure profile — what share of your work is compressible","Your work compression risk, by the six work types","Your judgment density score","Your AI-proof / AI-assisted / AI-dominant work map","Your 12-month repositioning plan"], sample: "See ARI© sample", sampleHref: "sample-report.html" },
              { aud: "For Leaders · BDI©", inst: "Your leadership architecture", items: ["Your Brainpower Density score","Your decision-leverage profile","Your AI-era leadership risk","Where your leadership value is expanding — or eroding","Decision-architecture redesign signals"], sample: "See BDI© sample", sampleHref: "sample-report-bdi.html" },
              { aud: "For Organisations · ORG AI DARS©", inst: "Your organisational readiness", items: ["Your AI maturity stage (Leveraged → Born)","Your decision-architecture gaps","Your talent heat map","Function-level redesign priorities","The two unanswered questions, answered"], sample: "See DARS© sample", sampleHref: "sample-report-dars.html" },
            ].map((col, i) => (
              <div key={i} style={{ background: S.white, padding: "36px 30px", display: "flex", flexDirection: "column" }}>
                <div style={{ fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase", color: S.gold, marginBottom: "8px" }}>{col.aud}</div>
                <div style={{ fontFamily: S.display, fontSize: "26px", letterSpacing: "0.02em", color: S.ink, lineHeight: 1, marginBottom: "22px" }}>{col.inst}</div>
                {col.items.map((item, j) => (
                  <div key={j} style={{ display: "flex", gap: "10px", fontSize: "13px", color: S.ink2, lineHeight: 1.55, padding: "11px 0", borderBottom: j < col.items.length - 1 ? `1px solid ${S.rule}` : "none" }}>
                    <span style={{ width: "5px", height: "5px", background: S.gold, borderRadius: "50%", flexShrink: 0, marginTop: "7px" }} />
                    {item}
                  </div>
                ))}
                <a href={col.sampleHref} target="_blank" rel="noopener" className="wyg-sample" style={{ marginTop: "auto", paddingTop: "20px", borderTop: `1px solid ${S.rule}`, fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: S.ink, transition: "color .25s ease,gap .25s ease", display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                  {col.sample} <span style={{ fontFamily: S.display, fontSize: "14px", transition: "transform .25s ease" }}>→</span>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ── DIAGNOSTIC SUITE ── */}
        <section id="diagnostic" style={{ borderBottom: `1px solid ${S.rule}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 52px", borderBottom: `1px solid ${S.rule}`, background: S.white2 }}>
            <span style={{ fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.mid }}>Assessment Suite — ARI© · BDI© · ORG AI DARS©</span>
            <span style={{ fontFamily: S.mono, fontSize: "12px", color: S.dim }}>04 / 06</span>
          </div>
          <div style={{ padding: "52px" }}>
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ marginBottom: "40px" }}>
              <div style={{ borderRight: `1px solid ${S.rule}`, paddingRight: "52px" }}>
                <h2 style={{ fontFamily: S.display, fontSize: "clamp(44px,6vw,72px)", lineHeight: 0.95, color: S.ink }}>MEASURE<br />YOUR<br /><span style={{ color: S.gold }}>POSITION.</span></h2>
              </div>
              <div style={{ paddingLeft: "52px", display: "flex", alignItems: "center" }}>
                <p style={{ fontSize: "16px", color: S.mid, lineHeight: 1.9, fontWeight: 300, maxWidth: "460px" }}>You cannot redesign what you cannot see. The AI Edge assessment suite makes structural position visible — for individuals, leaders, and organisations.</p>
              </div>
            </div>
            <div style={{ display: "inline-flex", border: `1px solid ${S.rule2}`, marginBottom: "8px", overflow: "hidden" }}>
              {(["inr","usd"] as Cur[]).map((c) => (
                <button key={c} onClick={() => setCur(c)} style={{ fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", padding: "9px 18px", background: cur === c ? S.ink : S.white, color: cur === c ? S.white : S.mid, border: "none", cursor: "pointer", transition: "background .2s,color .2s" }}>
                  {c === "inr" ? "₹ India (INR)" : "$ Global (USD)"}
                </button>
              ))}
            </div>
            <div style={{ fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.06em", color: S.dim, marginBottom: "24px" }}>
              {cur === "inr" ? "Showing INR — India pricing. Tap to switch." : "Showing USD — global pricing. Tap to switch."}
            </div>

            {/* AAI */}
            <div style={{ marginBottom: "22px" }}>
              <div style={{ fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.mid, marginBottom: "8px" }}>01 · For Aspiring Professionals</div>
              <div style={{ fontFamily: S.display, fontSize: "clamp(28px,3.4vw,44px)", letterSpacing: "0.02em", color: S.gold, lineHeight: 1.02 }}>AI Alignment Index©<span style={{ color: S.ink, display: "block", fontSize: "0.62em", marginTop: "4px" }}>Am I building the right foundations?</span></div>
            </div>
            <DiagCards cur={cur} tiers={[
              { tier: "Pure Report", name: "AAI© Report", inr: "₹799", usd: "$24", time: "Full alignment report · delivered within 48 hours", feats: ["Foundation alignment across four E.D.G.E. dimensions","Which skills stay relevant vs compressible","Dominant work-type signal","Personalised development roadmap"], dark: false, onCta: () => openModal("aspiring") },
              { tier: "With Consultation", name: "AAI© + Consultation", inr: "₹2,499", usd: "$75", time: "The full report plus a foundation-building session", feats: ["Everything in the Report","Analyst validation pass","30-minute mentoring session","Skill-sequencing plan"], dark: true, onCta: () => openModal("aspiring") },
            ]} S={S} />

            {/* ARI */}
            <div style={{ marginTop: "64px", marginBottom: "22px" }}>
              <div style={{ fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.mid, marginBottom: "8px" }}>02 · For Working Professionals</div>
              <div style={{ fontFamily: S.display, fontSize: "clamp(28px,3.4vw,44px)", letterSpacing: "0.02em", color: S.gold, lineHeight: 1.02 }}>AI Replaceability Index©<span style={{ color: S.ink, display: "block", fontSize: "0.62em", marginTop: "4px" }}>Where am I structurally positioned?</span></div>
            </div>
            <DiagCards cur={cur} tiers={[
              { tier: "Pure Report", name: "ARI© Report", inr: "₹1,499", usd: "$44", time: "Full structural report · delivered within 48 hours", feats: ["Full E.D.G.E. score — all four dimensions","Edge band: Accelerating / Holding / Thinning","Role Composition Map — six work types","Salary Sustainability Index (SSI)","Personalised structural roadmap"], dark: false, onCta: () => openModal("working") },
              { tier: "With Consultation", name: "ARI© + Consultation", inr: "₹4,499", usd: "$129", time: "The full report plus a 45-minute structural debrief", feats: ["Everything in the Report","Analyst validation pass","45-minute structural debrief","Personalised action sequencing"], dark: true, onCta: () => openModal("working") },
            ]} S={S} />

            {/* BDI */}
            <div style={{ marginTop: "64px", marginBottom: "22px" }}>
              <div style={{ fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.mid, marginBottom: "8px" }}>03 · For Leaders · CXO</div>
              <div style={{ fontFamily: S.display, fontSize: "clamp(28px,3.4vw,44px)", letterSpacing: "0.02em", color: S.gold, lineHeight: 1.02 }}>Brainpower Density Index©<span style={{ color: S.ink, display: "block", fontSize: "0.62em", marginTop: "4px" }}>What is my new structural role?</span></div>
            </div>
            <DiagCards cur={cur} tiers={[
              { tier: "Pure Report", name: "BDI© Report", inr: "₹5,999", usd: "$179", time: "Brainpower Density report for your leadership layer", feats: ["Judgment-to-intelligence ratio by layer","Compression exposure of senior roles","Decision-velocity-per-head read","Layer redesign signals"], dark: false, onCta: () => openModal("leader") },
              { tier: "With Consultation", name: "BDI© + Consultation", inr: "₹9,999", usd: "$299", time: "The full report plus a 60-minute leadership debrief", feats: ["Everything in the Report","Analyst validation pass","60-minute leadership debrief","Decision-architecture redesign notes"], dark: true, onCta: () => openModal("leader") },
            ]} S={S} />

            {/* ORG */}
            <div style={{ marginTop: "64px", marginBottom: "22px" }}>
              <div style={{ fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.mid, marginBottom: "8px" }}>04 · For Organisations</div>
              <div style={{ fontFamily: S.display, fontSize: "clamp(28px,3.4vw,44px)", letterSpacing: "0.02em", color: S.gold, lineHeight: 1.02 }}>ORG AI DARS©<span style={{ color: S.ink, display: "block", fontSize: "0.62em", marginTop: "4px" }}>Map our AI decision architecture</span></div>
            </div>
            <div style={{ background: S.ink, color: S.white, padding: "36px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
              <div style={{ flex: 1, minWidth: "300px", maxWidth: "680px" }}>
                <div style={{ fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: S.gold, marginBottom: "10px" }}>Enterprise engagement · By invitation</div>
                <div style={{ fontFamily: S.serif, fontSize: "15.5px", lineHeight: 1.65, color: S.dim }}>ORG AI DARS© is a workforce-scale diagnostic and redesign engagement for CHROs, CXOs, and founder-CEOs. Each engagement is scoped to your organisation. <strong style={{ color: S.white, fontWeight: 500 }}>Begin with a scoping conversation.</strong></div>
              </div>
              <a href="#enquire" style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", padding: "16px 28px", background: S.gold, color: S.white, border: `1px solid ${S.gold}`, textDecoration: "none", transition: "all .2s ease", whiteSpace: "nowrap" }}
                onMouseEnter={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = S.gold; }}
                onMouseLeave={e => { e.currentTarget.style.background = S.gold; e.currentTarget.style.color = S.white; }}>
                Share Interest →
              </a>
            </div>
          </div>
        </section>

        {/* ── RESEARCH ESSAYS ── */}
        <section id="research" style={{ padding: "96px 52px 80px", background: S.white, borderTop: `1px solid ${S.rule}` }}>
          <div style={{ maxWidth: "1240px", margin: "0 auto 56px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "18px", paddingBottom: "18px", marginBottom: "36px", borderBottom: `1px solid ${S.rule}` }}>
              <div style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.gold, flex: 1 }}>AI Edge Lab · Research</div>
              <div style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.18em", color: S.mid }}>05.5 / 06</div>
            </div>
            <h2 style={{ fontFamily: S.display, fontSize: "clamp(48px,6vw,84px)", lineHeight: 0.96, letterSpacing: "0.005em", textTransform: "uppercase", color: S.ink, marginBottom: "24px", maxWidth: "880px" }}>Four <span style={{ color: S.gold }}>Essays</span>. One Pattern.</h2>
            <p style={{ fontFamily: S.serif, fontStyle: "italic", fontSize: "19px", lineHeight: 1.55, color: "#2E2E2C", maxWidth: "760px", paddingLeft: "18px", borderLeft: `3px solid ${S.gold}` }}>"The conviction before action is as important as the assessment of position. Each essay is calibrated to one archetype — read the one written for you."</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ maxWidth: "1240px", margin: "0 auto", gap: "1px", background: S.rule, border: `1px solid ${S.rule}` }}>
            {[
              { tag: "Essay 01 · For Aspiring Professionals", title: <>Where to Begin When the <span style={{ color: S.gold }}>Ladder</span> Is Repricing</>, prev: "The career ladder built by the Knowledge Economy was a pedagogy — the bottom rungs were the school. AI now does the work that constituted the school. The standard advice given to graduates in 2026 is calibrated to a labour market that no longer exists. This essay describes what aspiring professionals should optimise for instead.", meta: "2,100 words · 10 min", href: "research-essay-01-aspiring.html" },
              { tag: "Essay 02 · For Working Professionals", title: <>The <span style={{ color: S.gold }}>AI Repricing</span> of Mid-Career Work</>, prev: "A 42-year-old Director's job description has not changed. Her performance reviews remain strong. Her composition of work has quietly drifted toward what AI now does competently. She is being repriced — invisibly, quarterly, without anyone yet naming the pattern. This essay names it.", meta: "2,000 words · 10 min", href: "research-repricing-mid-career-work.html" },
              { tag: "Essay 03 · For Leaders · CXO", title: <>The Leader's <span style={{ color: S.gold }}>Exposure</span> Is Greater Than Their Team's</>, prev: "It is convenient for senior leaders to frame the AI transition as a workforce problem. The convenience is precisely what makes it dangerous. Senior careers were built on the analytical excellence AI now compresses fastest — making the leader's exposure structurally higher than the workforce she is trying to manage.", meta: "2,200 words · 11 min", href: "research-essay-03-leaders.html" },
              { tag: "Essay 04 · For Organisations", title: <><span style={{ color: S.gold }}>Brainpower Density</span> — The Productivity Metric the AI Era Demands</>, prev: "An organisation can report record productivity in 2026 by every metric its board sees, and be structurally fragile by 2028. The metrics are not lying. They are answering yesterday's question. This essay describes the productivity metric the AI era structurally requires.", meta: "2,200 words · 11 min", href: "research-essay-04-organisations.html" },
            ].map((e, i) => (
              <a key={i} href={e.href} className="ec" style={{ background: S.white, padding: "40px 40px", display: "flex", flexDirection: "column", gap: "14px", textDecoration: "none", color: "inherit", transition: "background .2s ease" }}>
                <div style={{ fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", color: S.gold, marginBottom: "6px" }}>{e.tag}</div>
                <h3 style={{ fontFamily: S.display, fontSize: "clamp(26px,3vw,34px)", lineHeight: 1.04, letterSpacing: "0.005em", textTransform: "uppercase", color: S.ink, marginBottom: "6px" }}>{e.title}</h3>
                <p style={{ fontFamily: S.serif, fontSize: "15.5px", lineHeight: 1.7, color: "#2E2E2C", marginBottom: "14px" }}>{e.prev}</p>
                <div style={{ fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: S.mid, marginTop: "auto", paddingTop: "14px", borderTop: `1px solid ${S.rule}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{e.meta}</span><span style={{ color: S.gold }}>Read essay →</span>
                </div>
              </a>
            ))}
          </div>
          <div style={{ maxWidth: "1240px", margin: "36px auto 0", padding: "20px 24px", border: `1px dashed ${S.rule}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "18px" }}>
            <div style={{ fontFamily: S.serif, fontStyle: "italic", fontSize: "14.5px", color: "#2E2E2C", maxWidth: "560px" }}>A monthly research note from the AI Edge Lab on how AI is repricing work, leadership, and organisations. Published when there is something to say.</div>
            <a href="#mailinglist" style={{ fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: S.gold, border: `1px solid ${S.gold}`, padding: "11px 18px", textDecoration: "none", transition: "all .2s ease" }}
              onMouseEnter={e => { e.currentTarget.style.background = S.gold; e.currentTarget.style.color = S.white; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = S.gold; }}>
              Subscribe →
            </a>
          </div>
        </section>

        {/* ── FRAMEWORK ── */}
        <section id="framework" style={{ borderBottom: `1px solid ${S.rule}`, borderTop: `1px solid ${S.rule}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 52px", borderBottom: `1px solid ${S.rule}`, background: S.white2 }}>
            <span style={{ fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.mid }}>The E.D.G.E. Framework — The Six Work Types</span>
            <span style={{ fontFamily: S.mono, fontSize: "12px", color: S.dim }}>04.75 / 06</span>
          </div>
          <div style={{ padding: "52px" }}>
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 0 }}>
              <div style={{ borderRight: `1px solid ${S.rule}`, paddingRight: "52px" }}>
                <h3 style={{ fontFamily: S.display, fontSize: "clamp(28px,3vw,38px)", letterSpacing: "0.02em", color: S.ink, lineHeight: 1, marginBottom: "8px" }}>Your structural position.</h3>
                <p style={{ fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.1em", color: S.dim, marginBottom: 0, textTransform: "uppercase" }}>Four dimensions · the measurement architecture</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: S.rule, marginTop: "24px" }}>
                  {[
                    { letter: "E", name: "Exposure", desc: "Proportion of work that is AI-compressible.", dir: "Lower = structurally stronger" },
                    { letter: "D", name: "Decision Density", desc: "Consequence-bearing judgment owned per unit of work.", dir: "Higher = compounding position" },
                    { letter: "G", name: "Growth of Boundary", desc: "Whether decision authority is expanding or contracting over 24 months.", dir: "Expanding = widening advantage" },
                    { letter: "E", name: "Economic Anchoring", desc: "Whether compensation is tied to scarce contribution.", dir: "Anchored = salary structurally durable" },
                  ].map((item, i) => (
                    <div key={i} style={{ background: S.white, padding: "20px 24px", display: "grid", gridTemplateColumns: "36px 1fr", gap: 0, alignItems: "start" }}>
                      <div style={{ fontFamily: S.display, fontSize: "28px", color: S.gold, lineHeight: 1, marginTop: "2px" }}>{item.letter}</div>
                      <div style={{ paddingLeft: "12px" }}>
                        <div style={{ fontSize: "14px", fontWeight: 500, color: S.ink, marginBottom: "4px" }}>{item.name}</div>
                        <div style={{ fontSize: "13px", color: S.mid, lineHeight: 1.6, fontWeight: 300 }}>{item.desc}</div>
                        <div style={{ fontFamily: S.mono, fontSize: "11px", color: S.gold, marginTop: "5px", letterSpacing: "0.06em" }}>{item.dir}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ paddingLeft: "52px" }}>
                <h3 style={{ fontFamily: S.display, fontSize: "clamp(28px,3vw,38px)", letterSpacing: "0.02em", color: S.ink, lineHeight: 1, marginBottom: "8px" }}>The six work types.</h3>
                <p style={{ fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.1em", color: S.dim, marginBottom: 0, textTransform: "uppercase" }}>AI compression coefficients by work type</p>
                <div style={{ marginTop: "22px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 60px", padding: "8px 0", borderBottom: `1px solid ${S.rule2}` }}>
                    {["Work Type","Compression","%"].map((h, i) => (
                      <span key={i} style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: S.dim, textAlign: i === 2 ? "right" : "left" }}>{h}</span>
                    ))}
                  </div>
                  {[
                    { name: "Framing & Problem Definition", pct: 5, color: "#5A9E7A" },
                    { name: "Deciding & Directing", pct: 8, color: "#5A9E7A" },
                    { name: "Influencing & Convening", pct: 20, color: S.gold },
                    { name: "Synthesising & Interpreting", pct: 45, color: S.gold },
                    { name: "Researching & Analysing", pct: 75, color: "#B84040" },
                    { name: "Executing & Coordinating", pct: 85, color: "#B84040" },
                  ].map((row, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 60px", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${S.rule}` }}>
                      <div style={{ fontSize: "14px", color: S.ink, fontWeight: 300 }}>{row.name}</div>
                      <div style={{ position: "relative", height: "3px", background: S.white3, borderRadius: "2px", overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: "2px", background: row.color, width: `${row.pct}%` }} />
                      </div>
                      <div style={{ fontFamily: S.mono, fontSize: "12px", textAlign: "right", color: row.color }}>~{row.pct}%</div>
                    </div>
                  ))}
                </div>
                <p style={{ fontFamily: S.mono, fontSize: "11px", color: S.dim, marginTop: "12px", letterSpacing: "0.06em" }}>AI Edge Lab methodology, 2026. Coefficients represent the proportion of work type deliverables that AI can produce at comparable quality.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── ORGANISATION LAYER ── */}
        <section id="organisation" style={{ borderBottom: `1px solid ${S.rule}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 52px", borderBottom: `1px solid ${S.rule}`, background: S.white2 }}>
            <span style={{ fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.mid }}>The Organisation — ORG AI DARS© · Readiness Framework</span>
            <span style={{ fontFamily: S.mono, fontSize: "12px", color: S.dim }}>05.5 / 06</span>
          </div>
          <div style={{ padding: "52px" }}>
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ marginBottom: "40px" }}>
              <div style={{ borderRight: `1px solid ${S.rule}`, paddingRight: "52px" }}>
                <h2 style={{ fontFamily: S.display, fontSize: "clamp(40px,5.5vw,64px)", lineHeight: 0.95, color: S.ink }}>THE<br />ORGANISATION<br /><span style={{ color: S.gold }}>LAYER.</span></h2>
              </div>
              <div style={{ paddingLeft: "52px", display: "flex", alignItems: "center" }}>
                <p style={{ fontSize: "16px", color: S.mid, lineHeight: 1.9, fontWeight: 300, maxWidth: "460px" }}>Individuals and leaders can read their own position. The organisation needs a different instrument — one that places it on a maturity curve and redesigns its decision architecture at population scale.</p>
              </div>
            </div>
            <div style={{ fontFamily: S.mono, fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.gold, marginBottom: "18px" }}>ORG AI Readiness Framework — Four-Stage Maturity Model</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4" style={{ gap: "1px", background: S.rule }}>
              {[
                { n: "01", name: "AI Leveraged", desc: "Tools deployed onto existing structure. Productivity gains are local; the architecture is unchanged.", bg: S.white, nameColor: S.ink, descColor: S.mid, nColor: S.gold },
                { n: "02", name: "AI Enabled", desc: "Workflows adapt around AI. Some roles shift, but decision rights and the org chart still reflect the old premium on intelligence.", bg: S.white2, nameColor: S.ink, descColor: S.mid, nColor: S.gold },
                { n: "03", name: "AI First", desc: "Decision architecture is redesigned around judgment. Roles are defined by consequence owned, not output produced.", bg: "#8C8983", nameColor: S.white, descColor: "rgba(247,246,243,0.85)", nColor: S.gold2 },
                { n: "04", name: "AI Born", desc: "Structure assumes abundant intelligence from the start. Judgment density is the organising principle, not a retrofit.", bg: S.ink, nameColor: S.gold2, descColor: "rgba(247,246,243,0.65)", nColor: S.gold2 },
              ].map((s, i) => (
                <div key={i} style={{ background: s.bg, padding: "32px 26px" }}>
                  <div style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: s.nColor, marginBottom: "14px" }}>{s.n}</div>
                  <div style={{ fontFamily: S.display, fontSize: "clamp(22px,2.4vw,28px)", letterSpacing: "0.02em", color: s.nameColor, lineHeight: 1, marginBottom: "12px" }}>{s.name}</div>
                  <p style={{ fontSize: "13px", color: s.descColor, lineHeight: 1.7, fontWeight: 300 }}>{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "1px", background: S.rule, marginTop: "48px" }}>
              {[
                { tag: "Placement · Coming 2026", name: "8-Signal Org Diagnostic", body: "The organisational equivalent of ARI©. Places your organisation on the Four-Stage Maturity Model using eight structural signals, read in two groups.", details: [["Architecture Signals","How decision rights, role design, and reporting structure are built — whether the org chart still prices intelligence over judgment."],["People & Measurement Signals","How talent, incentives, and metrics behave — whether people are measured on output produced or consequence owned."],["Output","A maturity placement (Leveraged → Enabled → First → Born) and the specific signals holding the organisation back."]], price: "Readiness audit", status: "In Development" },
                { tag: "Redesign · Enterprise", name: "ORG AI DARS©", body: "Organisational Decision Architecture Realignment System. Where the diagnostic reads, DARS© rebuilds — at population scale.", details: [["Input","Brainpower Density data across the population — the judgment-to-intelligence ratio of every layer, function, and senior role."],["The redesign","Roles redefined by consequence owned; decision rights reallocated to where judgment sits; leadership layers collapsed or deepened to match."],["Outcome","The organisation moves up the maturity curve — structurally, not cosmetically. Measured by band movement, not tool adoption."]], price: "By engagement", status: "Enquiry" },
                { tag: "The two questions", name: "Why redesign fails", body: "Most AI transformations run organisation-design projects inside a technology frame. Two questions never get answered — and a technology project cannot answer either.", details: [["The Personal Dividend Question",'"Why should I support this?" Until an employee can see what they gain, adoption is compliance, not commitment.'],["The Work Redesign Question",'"What should I actually be doing differently?" Without a redesigned role, AI just adds tools to an unchanged job.'],["The gap","Both are structural questions. DARS© answers them by redesign; a rollout plan cannot."]], price: "The structural gap", status: "DARS© closes it" },
              ].map((c, i) => (
                <div key={i} style={{ background: S.white, padding: "36px 30px", display: "flex", flexDirection: "column" }}>
                  <div style={{ fontFamily: S.mono, fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: S.gold, marginBottom: "10px" }}>{c.tag}</div>
                  <div style={{ fontFamily: S.display, fontSize: "clamp(22px,2.4vw,28px)", letterSpacing: "0.02em", color: S.ink, lineHeight: 1, marginBottom: "14px" }}>{c.name}</div>
                  <p style={{ fontSize: "13px", color: S.mid, lineHeight: 1.7, marginBottom: "18px", fontWeight: 300 }}>{c.body}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px", flex: 1 }}>
                    {c.details.map(([k, v], j) => (
                      <div key={j} style={{ borderTop: `1px solid ${S.rule}`, paddingTop: "12px" }}>
                        <div style={{ fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.14em", textTransform: "uppercase", color: S.gold, marginBottom: "4px" }}>{k}</div>
                        <div style={{ fontSize: "12px", color: S.ink2, lineHeight: 1.6 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "16px", flexWrap: "wrap", gap: "12px" }}>
                    <span style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.08em", color: S.ink }}>{c.price}</span>
                    <span style={{ fontFamily: S.mono, fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: S.gold, border: `1px solid ${S.gold}`, padding: "4px 10px" }}>{c.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── EVIDENCE ── */}
        <section id="evidence" style={{ borderBottom: `1px solid ${S.rule}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 52px", borderBottom: `1px solid ${S.rule}`, background: S.white2 }}>
            <span style={{ fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.mid }}>The Evidence — 12 Reports · 6 Months</span>
            <span style={{ fontFamily: S.mono, fontSize: "12px", color: S.dim }}>05.7 / 06</span>
          </div>
          <div style={{ padding: "52px 52px 0" }}>
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ paddingBottom: "40px" }}>
              <div style={{ borderRight: `1px solid ${S.rule}`, paddingRight: "52px" }}>
                <h2 style={{ fontFamily: S.display, fontSize: "clamp(44px,6vw,72px)", lineHeight: 0.95, color: S.ink, marginBottom: "28px" }}>NOT A<br />PREDICTION.<br /><span style={{ color: S.gold }}>A PATTERN.</span></h2>
              </div>
              <div style={{ paddingLeft: "52px", display: "flex", alignItems: "center" }}>
                <p style={{ fontSize: "16px", color: S.mid, lineHeight: 1.9, fontWeight: 300, maxWidth: "460px" }}>Six anchor reports — published in the last six months by McKinsey, MIT, WEF, BCG, PwC and EY — confirm what the AI Edge doctrine has been mapping. The convergence is now unmistakable.</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3" style={{ gap: 0, background: S.rule }}>
            {[
              { stat: "95%", label: "Of GenAI pilots show no P&L impact", body: "After $30–40B invested, the vast majority of enterprise GenAI initiatives deliver no measurable return. The gap is structural, not technical.", src: "MIT · NANDA, State of AI in Business 2025 ↗", href: "https://mlq.ai/media/quarterly_decks/v0.1_State_of_AI_in_Business_2025_Report.pdf" },
              { stat: "23%", label: "Have actually scaled AI", body: "88% of organisations now use AI somewhere. Only 23% have scaled it. Investment is not transformation — and the gap is widening.", src: "McKinsey · The State of AI, 2025 ↗", href: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai" },
              { stat: "39%", label: "Of skills will change by 2030", body: "Core skills churn accelerates as AI reshapes roles. Judgment-weighted skills hold; executional skills compress.", src: "WEF · Future of Jobs Report 2025 ↗", href: "https://www.weforum.org/publications/the-future-of-jobs-report-2025/" },
              { stat: "CEO", label: "Now leads AI — not CTO", body: "72% of CEOs are now the primary AI decision-maker. AI investment doubling in 2026. The governance of AI has moved from engineering to executive.", src: "BCG · AI Radar 2026 ↗", href: "https://www.prnewswire.com/news-releases/as-ai-investments-surge-ceos-take-the-lead-on-decision-making-and-upskilling-themselves-302661849.html" },
              { stat: "HR", label: "Primary agentic AI landing zone", body: "Finance and HR are where agentic AI lands first — ahead of IT and all other functions. The work redesign question gets answered here or nowhere.", src: "PwC · 2026 AI Business Predictions ↗", href: "https://www.pwc.com/gx/en/issues/technology/ai-predictions.html" },
              { stat: "96%", label: "Report productivity gains — fewer scale impact", body: "Productivity from AI is now widespread; transformational impact is not. Governance, structure, and judgment architecture remain the bottleneck.", src: "EY · AI Pulse Survey 2025 ↗", href: "https://www.ey.com/en_us/insights/emerging-technologies/pulse-ai-survey" },
            ].map((ev, i) => (
              <a key={i} href={ev.href} target="_blank" rel="noopener" className="ev" style={{ display: "block", padding: "32px 28px", textDecoration: "none", transition: "background .3s ease" }}>
                <div className="ev-stat" style={{ fontFamily: S.display, fontSize: "clamp(44px,5vw,64px)", lineHeight: 0.9, marginBottom: "12px", letterSpacing: "0.01em", transition: "color .2s" }}>{ev.stat}</div>
                <div className="ev-label" style={{ fontSize: "14px", fontWeight: 500, marginBottom: "8px", lineHeight: 1.35 }}>{ev.label}</div>
                <div className="ev-body" style={{ fontSize: "13px", color: S.mid, lineHeight: 1.75, marginBottom: "12px", fontWeight: 300 }}>{ev.body}</div>
                <div className="ev-src" style={{ fontFamily: S.mono, fontSize: "11px", color: S.dim, letterSpacing: "0.08em", transition: "color .2s" }}>{ev.src}</div>
              </a>
            ))}
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section id="about" style={{ borderBottom: `1px solid ${S.rule}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 52px", borderBottom: `1px solid ${S.rule}`, background: S.white2 }}>
            <span style={{ fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.mid }}>About the AI Edge Lab — Nitin Nahata</span>
            <span style={{ fontFamily: S.mono, fontSize: "12px", color: S.dim }}>06 / 06</span>
          </div>
          <div style={{ padding: "52px" }}>
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]" style={{ gap: 0 }}>
              <div style={{ borderRight: `1px solid ${S.rule}`, paddingRight: "52px" }}>
                <div style={{ width: "100%", aspectRatio: "3/4", marginBottom: "24px", position: "relative", overflow: "hidden" }}>
                  <img src="/nitishcolorfull.png" alt="Nitin Nahata" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
                  <span style={{ position: "absolute", bottom: "20px", left: "20px", fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(247,246,243,0.35)" }}>Nitin Nahata · CHRO · Founder</span>
                </div>
                <div style={{ fontFamily: S.display, fontSize: "32px", letterSpacing: "0.02em", color: S.ink, marginBottom: "4px" }}>NITIN NAHATA</div>
                <div style={{ fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.18em", color: S.gold, textTransform: "uppercase", marginBottom: "20px" }}>CHRO · Organisational Architect · Founder</div>
                {[["CHRO","Gameskraft"],["Founder","Axionindex"],["Creator","AI Edge Diagnostic©"],["Founder","HROS"]].map(([role, org], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: S.mono, fontSize: "12px", color: S.mid, padding: "8px 0", borderBottom: `1px solid ${S.rule}`, letterSpacing: "0.04em" }}>
                    <span>{role}</span><span>{org}</span>
                  </div>
                ))}
                <div style={{ fontFamily: S.mono, fontSize: "12px", color: S.gold, marginTop: "16px", letterSpacing: "0.06em" }}>nitin@axionindex.org</div>
              </div>
              <div style={{ paddingLeft: "52px" }}>
                {["Nitin Nahata is a CHRO and organisational architect whose work centres on a single structural question: how do organisations and the people inside them evolve when intelligence becomes abundant?","Twenty-three years of organisational design across Tata · Starbucks India · Udaan · Gameskraft — through growth, hypergrowth, and consequence — have shaped his thinking on the architecture of decision-making, the future structure of work, and how organisations redesign talent systems in the AI era.","As CHRO of Gameskraft, he sees firsthand how AI is changing the structure of work inside a fast-scaling organisation. As Founder of Axionindex, he is building the frameworks and instruments to measure and redesign those changes at scale."].map((p, i) => (
                  <p key={i} style={{ fontSize: "15px", color: S.mid, lineHeight: 1.9, marginBottom: "14px", fontWeight: 300 }}>{p}</p>
                ))}
                <div style={{ background: S.white2, padding: "28px 32px", marginTop: "8px", borderLeft: `2px solid ${S.gold}` }}>
                  <div style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: S.mid, marginBottom: "14px" }}>The Conviction</div>
                  <div style={{ fontFamily: S.display, fontSize: "clamp(18px,2.5vw,26px)", lineHeight: 1.1, letterSpacing: "0.02em", color: S.ink }}>
                    "THE QUESTION IS NOT WHETHER AI WILL CHANGE YOUR WORK. IT IS WHETHER YOU UNDERSTAND THE <span style={{ color: S.gold }}>STRUCTURE</span> OF THAT CHANGE."
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── UNIFIED CLOSING · Two-Door ── */}
        <section id="enquire" style={{ background: S.ink, color: S.white, padding: "96px 52px 80px", position: "relative", overflow: "hidden" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto 56px", textAlign: "center" }}>
            <div style={{ fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", color: S.gold, marginBottom: "20px" }}>AI Edge Diagnostic© · Available Now · axionindex.org</div>
            <h2 style={{ fontFamily: S.display, fontSize: "clamp(48px,7.5vw,108px)", lineHeight: 0.95, textTransform: "uppercase", letterSpacing: "0.005em", color: S.white }}>Where Is Your<br /><span style={{ color: S.gold }}>Structural Position</span> Today?</h2>
            <p style={{ fontFamily: S.serif, fontStyle: "italic", fontSize: "17px", lineHeight: 1.55, color: S.dim, maxWidth: "760px", margin: "24px auto 0" }}>The AI Edge Diagnostic measures your position relative to the compression line — across six work types, four E.D.G.E. dimensions, and two ownership signals. A full structural report, prepared and delivered within 48 hours. Private.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "1px", background: "rgba(160,120,48,0.2)", maxWidth: "1200px", margin: "0 auto", border: "1px solid rgba(160,120,48,0.2)" }}>
            {/* Door 1 · Individuals */}
            <div style={{ background: S.ink, padding: "48px 44px", display: "flex", flexDirection: "column", gap: "18px" }}>
              <div style={{ fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", color: S.gold, marginBottom: "8px" }}>For Individuals</div>
              <h3 style={{ fontFamily: S.display, fontSize: "clamp(28px,3.4vw,40px)", lineHeight: 1.02, textTransform: "uppercase", letterSpacing: "0.005em", color: S.white, marginBottom: "8px" }}>Begin Your <span style={{ color: S.gold }}>Diagnostic</span>.</h3>
              <p style={{ fontFamily: S.serif, fontSize: "15px", lineHeight: 1.65, color: S.dim, marginBottom: "14px" }}>Three personal diagnostics — <strong style={{ color: S.white, fontWeight: 500 }}>AAI©</strong> for aspiring professionals, <strong style={{ color: S.white, fontWeight: 500 }}>ARI©</strong> for working professionals, <strong style={{ color: S.white, fontWeight: 500 }}>BDI©</strong> for leaders. Your structural read in 48 hours.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "auto" }}>
                <button onClick={() => openModal("working")} style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", padding: "18px 28px", background: S.gold, color: S.white, border: `1px solid ${S.gold}`, textDecoration: "none", textAlign: "center", cursor: "pointer", transition: "all .2s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = S.gold; }}
                  onMouseLeave={e => { e.currentTarget.style.background = S.gold; e.currentTarget.style.color = S.white; }}>
                  Find My AI Edge →
                </button>
                <button onClick={() => openModal()} style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", padding: "18px 28px", background: "transparent", color: S.dim, border: "1px solid rgba(213,210,201,0.25)", cursor: "pointer", transition: "all .2s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.color = S.white; e.currentTarget.style.borderColor = S.white; }}
                  onMouseLeave={e => { e.currentTarget.style.color = S.dim; e.currentTarget.style.borderColor = "rgba(213,210,201,0.25)"; }}>
                  See all assessments →
                </button>
              </div>
              <div style={{ fontFamily: S.mono, fontSize: "9px", letterSpacing: "0.16em", textTransform: "uppercase", color: S.mid, lineHeight: 1.9, paddingTop: "14px", borderTop: "1px solid rgba(213,210,201,0.12)" }}>
                From <span style={{ color: S.gold }}>₹799</span> · Private <span style={{ color: S.gold }}>·</span> Confidential <span style={{ color: S.gold }}>·</span> Not shared with your employer
              </div>
            </div>
            {/* Door 2 · Organisations */}
            <div style={{ background: S.ink, padding: "48px 44px", display: "flex", flexDirection: "column", gap: "18px" }}>
              <div style={{ fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", color: S.gold, marginBottom: "8px" }}>For Organisations · ORG AI DARS©</div>
              <h3 style={{ fontFamily: S.display, fontSize: "clamp(28px,3.4vw,40px)", lineHeight: 1.02, textTransform: "uppercase", letterSpacing: "0.005em", color: S.white, marginBottom: "8px" }}>Map Your <span style={{ color: S.gold }}>Structural Position</span>.</h3>
              <p style={{ fontFamily: S.serif, fontSize: "15px", lineHeight: 1.65, color: S.dim, marginBottom: "14px" }}>For CHROs, CXOs, and founder-CEOs leading organisations through the AI shift. Maps workforce-scale compression risk, decision-architecture gaps, and the redesign moves available to you.</p>
              <form onSubmit={handleEnquiry} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "12px" }}>
                  {[["Name","name","text","name"],["Email","email","email","email"],["Organisation","org","text","organization"],["Role","role","text","organization-title"]].map(([label, field, type, auto]) => (
                    <div key={field} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontFamily: S.mono, fontSize: "9px", letterSpacing: "0.16em", textTransform: "uppercase", color: S.mid }}>{label}</label>
                      <input type={type} value={(enquiryForm as any)[field]} onChange={e => setEnquiryForm({ ...enquiryForm, [field]: e.target.value })} required autoComplete={auto}
                        style={{ background: "transparent", border: "none", borderBottom: "1px solid rgba(213,210,201,0.25)", padding: "10px 0", fontFamily: S.mono, fontSize: "13px", color: S.white, outline: "none", transition: "border-color .2s ease", letterSpacing: "0.02em" }}
                        onFocus={e => (e.target.style.borderColor = S.gold)}
                        onBlur={e => (e.target.style.borderColor = "rgba(213,210,201,0.25)")} />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontFamily: S.mono, fontSize: "9px", letterSpacing: "0.16em", textTransform: "uppercase", color: S.mid }}>Brief context — what triggered the enquiry</label>
                  <textarea value={enquiryForm.message} onChange={e => setEnquiryForm({ ...enquiryForm, message: e.target.value })} required rows={2}
                    style={{ background: "transparent", border: "none", borderBottom: "1px solid rgba(213,210,201,0.25)", padding: "10px 0", fontFamily: S.sans, fontSize: "13.5px", color: S.white, outline: "none", resize: "vertical", minHeight: "60px", lineHeight: 1.55 }}
                    onFocus={e => (e.target.style.borderColor = S.gold)}
                    onBlur={e => (e.target.style.borderColor = "rgba(213,210,201,0.25)")} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px", marginTop: "8px" }}>
                  <button type="submit" style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", padding: "14px 24px", background: S.gold, color: S.white, border: `1px solid ${S.gold}`, cursor: "pointer", transition: "all .2s ease" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = S.gold; }}
                    onMouseLeave={e => { e.currentTarget.style.background = S.gold; e.currentTarget.style.color = S.white; }}>
                    Send Enquiry →
                  </button>
                  <div style={{ fontFamily: S.mono, fontSize: "9px", letterSpacing: "0.16em", textTransform: "uppercase", color: S.mid }}>Private · NDA-led</div>
                </div>
                {enquiryStatus && <div style={{ fontFamily: S.mono, fontSize: "11px", color: S.gold, marginTop: "8px" }}>{enquiryStatus}</div>}
              </form>
              <div style={{ fontFamily: S.mono, fontSize: "9px", letterSpacing: "0.16em", textTransform: "uppercase", color: S.mid, lineHeight: 1.9, paddingTop: "14px", borderTop: "1px solid rgba(213,210,201,0.12)", marginTop: "auto" }}>
                Engagement scope <span style={{ color: S.gold }}>4–12 weeks</span> · Deliverables <span style={{ color: S.gold }}>Diagnostic + Redesign Brief</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── MAILING LIST ── */}
        <section id="mailinglist" style={{ background: S.ink, color: S.white, padding: "72px 52px", borderBottom: "1px solid rgba(160,120,48,0.18)" }}>
          <div style={{ maxWidth: "920px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "start" }} className="grid grid-cols-1 md:grid-cols-2">
            <div>
              <div style={{ fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", color: S.gold, marginBottom: "18px" }}>The AI Edge Lab</div>
              <h3 style={{ fontFamily: S.display, fontSize: "clamp(36px,4.4vw,56px)", lineHeight: 0.96, textTransform: "uppercase", letterSpacing: "0.005em", color: S.white, marginBottom: "18px" }}>One <span style={{ color: S.gold }}>Structural</span> Read A Month</h3>
              <p style={{ fontFamily: S.serif, fontStyle: "italic", fontSize: "16px", lineHeight: 1.6, color: S.dim, maxWidth: "480px" }}>A monthly research note from the AI Edge Lab on how AI is repricing work, leadership, and organisations. Published when there is something to say.</p>
            </div>
            <div style={{ paddingTop: "8px" }}>
              <form onSubmit={handleMlSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <input type="email" value={mlEmail} onChange={e => setMlEmail(e.target.value)} placeholder="your email" required
                  style={{ background: "transparent", border: "none", borderBottom: "1px solid rgba(213,210,201,0.3)", padding: "14px 0", fontFamily: S.mono, fontSize: "14px", color: S.white, outline: "none", letterSpacing: "0.04em" }}
                  onFocus={e => (e.target.style.borderColor = S.gold)}
                  onBlur={e => (e.target.style.borderColor = "rgba(213,210,201,0.3)")} />
                <button type="submit" style={{ background: S.gold, color: S.white, border: `1px solid ${S.gold}`, padding: "14px 22px", fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", transition: "all .2s ease", alignSelf: "flex-start" }}
                  onMouseEnter={e => { e.currentTarget.style.background = S.gold2; }}
                  onMouseLeave={e => { e.currentTarget.style.background = S.gold; }}>
                  Subscribe →
                </button>
                {mlStatus && <div style={{ fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.06em", color: S.gold, minHeight: "14px", marginTop: "4px" }}>{mlStatus}</div>}
              </form>
              <p style={{ fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.06em", color: S.mid, lineHeight: 1.6, marginTop: "18px" }}>No marketing. No automation sequences. Unsubscribe in one click. The first read lands within the week of subscribing.</p>
            </div>
          </div>
        </section>

        {/* ── GLOBAL FOOTER ── */}
        <footer style={{ background: S.ink, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1px", background: "rgba(255,255,255,0.06)", padding: "48px 52px" }} className="grid grid-cols-2 md:grid-cols-4 p-6 md:p-[52px]">
            {[
              { h: "For Whom", links: [["for-students.html","Aspiring Professional · AAI©"],["for-professionals.html","Working Professional · ARI©"],["for-leaders.html","Leader / CXO · BDI©"],["for-organisations.html","Organisation · ORG AI DARS©"]] },
              { h: "The Institution", links: [["the-evidence-wall.html","The Evidence Wall · 12 reports"],["doctrine.html","The Doctrine · 4 statements"],["lexicon.html","The Lexicon · 19 terms"],["methodology.html","Methodology"],["#research","Research · 4 essays"],["#about","About Nitin Nahata"],["mailto:nitin@axionindex.org","nitin@axionindex.org"]] },
              { h: "The Framework", links: [["#framework","E.D.G.E. Framework"],["#framework","Six Work Types"],["lexicon.html","Brainpower Density"],["lexicon.html","Edge Score"],["lexicon.html","Judgment Ownership"]] },
              { h: "The Instruments", links: [["sample-report.html","ARI© · Working Professionals"],["sample-report-bdi.html","BDI© · Leaders"],["sample-report-dars.html","ORG AI DARS© · Organisations"],["#diagnostic","Begin a Diagnostic →"],["#enquire","Request an Engagement →"]] },
            ].map((col, i) => (
              <div key={i}>
                <div style={{ fontFamily: S.mono, fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.gold, marginBottom: "18px" }}>{col.h}</div>
                {col.links.map(([href, label]) => (
                  <a key={href} href={href} className="ft-link" style={{ display: "block", fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.1em", color: S.dim, textDecoration: "none", padding: "5px 0", transition: "color .2s", lineHeight: 1.6 }}>{label}</a>
                ))}
              </div>
            ))}
          </div>
          <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0 52px" }} />
          <div style={{ padding: "24px 52px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "14px" }}>
            <div style={{ fontFamily: S.display, fontSize: "20px", letterSpacing: "0.04em", color: S.white }}>The <span style={{ color: S.gold }}>AI Edge Lab</span>
              <div style={{ fontFamily: S.mono, fontSize: "9px", letterSpacing: "0.18em", color: S.mid, marginTop: "6px", textTransform: "none" }}>an Axionindex initiative</div>
            </div>
            <div style={{ fontFamily: S.mono, fontSize: "11px", color: S.dim, letterSpacing: "0.06em" }}>© 2026 Axionindex · axionindex.org · Private. Confidential.</div>
          </div>
        </footer>

      </div>
    </>
  );
}
