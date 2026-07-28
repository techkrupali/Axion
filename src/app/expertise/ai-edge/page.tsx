"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bebas_Neue, DM_Sans, DM_Mono } from "next/font/google";

/* ─── Fonts ─── */
const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--f-display" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--f-sans" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--f-mono" });

/* ─── Theme ─── */
const T = {
  white: "#F7F6F3",
  ink: "#0D0D0B",
  ink2: "#151512",
  mid: "#7A7870",
  dim: "#B0AEA8",
  gold: "#A07830",
  gold2: "#C49848",
  goldAccent: "#C8A24A",
  rule: "rgba(247,246,243,0.10)",
};

/* ─── Nav ─── */
const NAV: [string, string][] = [
  ["Vision", "#frame-01"],
  ["Research", "#frame-05"],
  ["Frameworks", "#frame-08"],
  ["Assessments", "#frame-13"],
  ["About", "/about"],
];

function Header() {
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 200, height: 56,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 clamp(20px,4vw,52px)", background: "rgba(13,13,11,0.88)",
      backdropFilter: "blur(12px)", borderBottom: `1px solid ${T.rule}`,
    }}>
      <Link href="/expertise/ai-edge" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <svg viewBox="0 0 512 512" width="22" height="22" aria-hidden>
          <g transform="translate(-78,0)" fill={T.goldAccent}>
            <polygon points="120,392 234,120 270,120 156,392" />
            <polygon points="270,120 234,120 348,392 384,392" />
            <polygon points="398,120 434,120 548,392 512,392" />
          </g>
        </svg>
        <span style={{ fontFamily: "var(--f-display)", fontSize: 18, letterSpacing: ".06em", color: T.white }}>
          AI EDGE LAB<sup style={{ fontSize: 8, color: T.gold2 }}>™</sup>
        </span>
      </Link>
      <nav className="ael-nav" style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {NAV.map(([lbl, href]) => (
          <Link key={lbl} href={href}
            style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: T.dim }}>
            {lbl}
          </Link>
        ))}
      </nav>
      <Link href="/connect" style={{
        fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase",
        border: `1px solid ${T.gold}`, color: T.gold2, padding: "9px 16px", whiteSpace: "nowrap",
      }}>Find My AI Edge →</Link>
    </header>
  );
}

/* ─── Tokens ─── */
const kicker: React.CSSProperties = { fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".26em", textTransform: "uppercase", color: T.gold };
const rise = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-12%" } };
const bodyText: React.CSSProperties = { fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 15, lineHeight: 1.9, color: "rgba(247,246,243,0.7)", maxWidth: 460 };
const doctrine: React.CSSProperties = { marginTop: 34, paddingLeft: 18, borderLeft: `2px solid ${T.gold}`, fontFamily: "var(--f-display)", fontSize: "clamp(18px,2vw,24px)", lineHeight: 1.2, color: T.white, letterSpacing: ".01em" };
const h1: React.CSSProperties = { fontFamily: "var(--f-display)", fontSize: "clamp(40px,5.4vw,80px)", lineHeight: 0.98, letterSpacing: ".01em", margin: "22px 0 26px" };

/* ─── Split frame (45/55) ─── */
function SplitFrame({ id, index, left, right }: { id: string; index: string; left: React.ReactNode; right: React.ReactNode }) {
  return (
    <section id={id} className="ael-frame" style={{
      position: "relative", minHeight: "100vh", background: T.ink, color: T.white,
      display: "grid", gridTemplateColumns: "45% 55%", borderBottom: `1px solid ${T.rule}`,
    }}>
      <div style={{ padding: "clamp(64px,10vh,120px) clamp(28px,4vw,64px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>{left}</div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(40px,8vh,80px) clamp(28px,4vw,56px)", borderLeft: `1px solid ${T.rule}` }}>{right}</div>
      <span aria-hidden style={{ position: "absolute", right: "clamp(20px,4vw,52px)", top: 24, fontFamily: "var(--f-display)", fontSize: 40, color: "rgba(247,246,243,0.10)" }}>{index}</span>
    </section>
  );
}

/* Narrative left column helper */
function Narrative({ eye, title, paras, quote }: { eye: string; title: React.ReactNode; paras: React.ReactNode[]; quote: React.ReactNode }) {
  return (
    <>
      <motion.div {...rise} transition={{ duration: 0.6 }}>
        <span style={kicker}>{eye}</span>
        <h1 style={h1}>{title}</h1>
      </motion.div>
      <motion.div {...rise} transition={{ duration: 0.6, delay: 0.12 }} style={bodyText}>
        {paras.map((p, i) => <p key={i} style={{ marginBottom: i < paras.length - 1 ? 16 : 0 }}>{p}</p>)}
      </motion.div>
      <motion.div {...rise} transition={{ duration: 0.6, delay: 0.24 }} style={doctrine}>{quote}</motion.div>
    </>
  );
}

/* Full-width frame */
function FullFrame({ id, index, eye, title, children }: { id: string; index: string; eye: string; title: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} style={{ position: "relative", background: T.ink, color: T.white, borderBottom: `1px solid ${T.rule}`, padding: "clamp(64px,10vh,110px) clamp(24px,5vw,72px)" }}>
      <motion.div {...rise} transition={{ duration: 0.6 }} style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
          <span style={kicker}>{eye}</span>
          <span style={{ fontFamily: "var(--f-display)", fontSize: 32, color: "rgba(247,246,243,0.10)" }}>{index}</span>
        </div>
        <h2 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(36px,5vw,72px)", lineHeight: 0.98, letterSpacing: ".01em", marginBottom: 44 }}>{title}</h2>
        {children}
      </motion.div>
    </section>
  );
}

/* ══════════ FRAME 01 — THE WORK SHIFT ══════════ */
function FourActors() {
  const nodes = [
    { key: "Employee", cx: 200, cy: 72, ly: -46 },
    { key: "Leader", cx: 78, cy: 300, ly: 54 },
    { key: "Organisation", cx: 322, cy: 300, ly: 54 },
  ];
  const ai = { cx: 200, cy: 214 };
  return (
    <svg viewBox="0 0 400 400" width="100%" style={{ maxWidth: 460, margin: "0 auto" }} aria-hidden>
      {nodes.map((n, i) => (
        <motion.line key={n.key} x1={ai.cx} y1={ai.cy} x2={n.cx} y2={n.cy} stroke={T.gold} strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 0.55 }} viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.4 + i * 0.15, ease: [0.22, 1, 0.36, 1] }} />
      ))}
      {nodes.map((n, i) => (
        <motion.g key={n.key} initial={{ opacity: 0, scale: 0.6 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 + i * 0.35 }} style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}>
          <circle cx={n.cx} cy={n.cy} r="34" fill="none" stroke="rgba(247,246,243,0.55)" strokeWidth="1" />
          <circle cx={n.cx} cy={n.cy} r="3" fill={T.white} />
          <text x={n.cx} y={n.cy + n.ly} textAnchor="middle" style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", fill: T.dim }}>{n.key}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0, scale: 0.4 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 1.25 }} style={{ transformOrigin: `${ai.cx}px ${ai.cy}px` }}>
        <circle cx={ai.cx} cy={ai.cy} r="40" fill={T.gold2} opacity="0.08" />
        <circle cx={ai.cx} cy={ai.cy} r="40" fill="none" stroke={T.gold2} strokeWidth="1.5" />
        <text x={ai.cx} y={ai.cy + 7} textAnchor="middle" style={{ fontFamily: "var(--f-display)", fontSize: 26, letterSpacing: "0.06em", fill: T.gold2 }}>AI</text>
      </motion.g>
    </svg>
  );
}
function Frame01() {
  return <SplitFrame id="frame-01" index="01"
    left={<Narrative eye="The Work Shift"
      title={<>AI ENTERS AS<br /><span style={{ color: T.gold2 }}>THE FOURTH ACTOR.</span></>}
      paras={[
        "For centuries, work has been shaped by three actors — the Employee, the Leader, the Organisation. Every technology before made these three faster, stronger, more connected.",
        "AI is different. For the first time, work has a non-human participant capable of contributing to thinking, analysis, creation and decision. Work is no longer designed around three actors. It is designed around four.",
      ]}
      quote={<>&ldquo;When intelligence becomes abundant, <span style={{ color: T.gold2 }}>judgment</span> becomes the scarce source of advantage.&rdquo;</>} />}
    right={<div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}><FourActors /></div>} />;
}

/* ══════════ FRAME 02 — EVOLUTION OF VALUE ══════════ */
const ERAS = [
  { era: "Industrial Age", cap: "Muscle" },
  { era: "Knowledge Age", cap: "Expertise" },
  { era: "Digital Age", cap: "Information" },
  { era: "AI Era", cap: "Judgment" },
];
function Frame02() {
  return <SplitFrame id="frame-02" index="02"
    left={<Narrative eye="The Evolution of Value"
      title={<>EVERY ERA REDEFINES<br /><span style={{ color: T.gold2 }}>THE SOURCE OF VALUE.</span></>}
      paras={[
        <>Every technological shift has rewarded a different human capability. The Industrial Age rewarded physical labour. The Knowledge Age rewarded expertise. The Digital Age rewarded information.</>,
        <>The AI Era rewards <span style={{ color: T.gold2 }}>judgment</span>. Technology changes — and the capability that creates competitive advantage changes with it.</>,
      ]}
      quote={<>&ldquo;When intelligence becomes abundant, <span style={{ color: T.gold2 }}>judgment</span> becomes the new source of value.&rdquo;</>} />}
    right={<>{ERAS.map((e, i) => {
      const last = i === ERAS.length - 1;
      return (
        <motion.div key={e.era} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.25 }}
          style={{ display: "flex", alignItems: "baseline", gap: 20, padding: "18px 0", borderBottom: i < ERAS.length - 1 ? `1px solid ${T.rule}` : "none" }}>
          <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: T.dim, width: 130, flexShrink: 0 }}>{e.era}</span>
          <span style={{ color: T.gold, fontSize: 14 }}>→</span>
          <span style={{ fontFamily: "var(--f-display)", letterSpacing: ".02em", lineHeight: 0.9, fontSize: last ? "clamp(40px,5vw,68px)" : "clamp(28px,3vw,40px)", color: last ? T.gold2 : "rgba(247,246,243,0.55)" }}>{e.cap}</span>
        </motion.div>
      );
    })}</>} />;
}

/* ══════════ FRAME 03 — NEW DESIGN CHOICE ══════════ */
const STAGES = ["Customer Request", "Research", "Analysis", "Decision", "Execution", "Review"];
const PERFORMERS = ["Human", "AI", "Human + AI"];
function Frame03() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick((t) => t + 1), 1400); return () => clearInterval(id); }, []);
  return <SplitFrame id="frame-03" index="03"
    left={<Narrative eye="The New Design Choice"
      title={<>FOR THE FIRST TIME,<br /><span style={{ color: T.gold2 }}>WORK HAS A CHOICE.</span></>}
      paras={[
        <>Every technology before AI amplified human work. AI can now perform parts of the work itself — introducing a decision organisations have never had to make before.</>,
        <><span style={{ color: T.gold2 }}>Who should perform the work?</span> Every activity, every decision, every workflow. Every organisation is now making these choices — consciously or not. The quality of those choices will determine advantage.</>,
      ]}
      quote={<>&ldquo;The future will not belong to organisations with more AI. It will belong to those that make better decisions about <span style={{ color: T.gold2 }}>where AI should work</span>.&rdquo;</>} />}
    right={<>{STAGES.map((s, i) => {
      const active = PERFORMERS[(tick + i) % PERFORMERS.length];
      return (
        <motion.div key={s} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.45, delay: i * 0.1 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "16px 0", borderBottom: i < STAGES.length - 1 ? `1px solid ${T.rule}` : "none" }}>
          <span style={{ fontFamily: "var(--f-display)", fontSize: "clamp(20px,2.2vw,28px)", letterSpacing: ".02em" }}>{s}</span>
          <div style={{ display: "flex", gap: 8 }}>
            {PERFORMERS.map((p) => {
              const on = p === active;
              return <span key={p} style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: ".08em", textTransform: "uppercase", padding: "6px 10px", whiteSpace: "nowrap", border: `1px solid ${on ? T.gold2 : T.rule}`, color: on ? T.ink : T.dim, background: on ? T.gold2 : "transparent", transition: "all .35s ease" }}>{p}</span>;
            })}
          </div>
        </motion.div>
      );
    })}</>} />;
}

/* ══════════ FRAME 04 — THE PARADOX ══════════ */
const STATS = [
  { n: "23%", d: "of organisations have scaled AI across the enterprise.", s: "McKinsey 2024" },
  { n: "95%", d: "see no measurable P&L impact from AI.", s: "MIT NANDA 2025" },
  { n: "39%", d: "of core skills will change by 2030.", s: "World Economic Forum" },
];
function Frame04() {
  return <SplitFrame id="frame-04" index="04"
    left={<Narrative eye="The Paradox"
      title={<>THE PROMISE WAS EXTRAORDINARY.<br /><span style={{ color: T.gold2 }}>THE RESULTS WERE NOT.</span></>}
      paras={[
        <>Investment has never been higher. Adoption has never been broader. And yet, for most organisations, AI has not translated into measurable enterprise value.</>,
        <>If every organisation is making these choices, why are so few consistently creating value? That question launches the investigation.</>,
      ]}
      quote={<>&ldquo;Everyone was measuring AI. No one had explained why value <span style={{ color: T.gold2 }}>remained inconsistent</span>.&rdquo;</>} />}
    right={<>{STATS.map((st, i) => (
      <motion.div key={st.n} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.5, delay: i * 0.2 }}
        style={{ padding: "22px 0", borderBottom: i < STATS.length - 1 ? `1px solid ${T.rule}` : "none" }}>
        <div style={{ fontFamily: "var(--f-display)", fontSize: "clamp(48px,7vw,84px)", lineHeight: 0.85, color: T.gold2 }}>{st.n}</div>
        <div style={{ fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 14, color: "rgba(247,246,243,0.72)", marginTop: 10, maxWidth: 360 }}>{st.d}</div>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 8, letterSpacing: ".14em", textTransform: "uppercase", color: T.mid, marginTop: 8 }}>{st.s}</div>
      </motion.div>
    ))}</>} />;
}

/* ══════════ FRAME 05 — FOLLOWING THE EVIDENCE ══════════ */
const INSTITUTIONS = ["McKinsey & Company", "MIT Sloan", "World Economic Forum", "Microsoft Work Trend Index", "IBM Institute for Business Value", "BCG", "Gartner", "Stanford HAI", "RAND", "PwC", "Deloitte", "Accenture"];
function Frame05() {
  return <FullFrame id="frame-05" index="05" eye="Following the Evidence"
    title={<>WE DIDN&rsquo;T START WITH A FRAMEWORK.<br /><span style={{ color: T.gold2 }}>WE STARTED WITH A QUESTION.</span></>}>
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "clamp(32px,5vw,72px)", alignItems: "center" }} className="ael-2col">
      <div>
        <p style={{ ...bodyText, maxWidth: 560, marginBottom: 28 }}>
          If AI is improving capability, why isn&rsquo;t it consistently improving enterprise value? To answer, we examined the world&rsquo;s leading research on AI adoption, transformation and organisational change — across industries, geographies and independent institutions.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 1, background: T.rule, border: `1px solid ${T.rule}` }}>
          {INSTITUTIONS.map((n) => (
            <div key={n} style={{ background: T.ink, padding: "14px 16px", fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", color: T.dim }}>{n}</div>
          ))}
        </div>
      </div>
      <div style={{ textAlign: "center", border: `1px solid ${T.rule}`, padding: "48px 24px" }}>
        <div style={{ fontFamily: "var(--f-display)", fontSize: "clamp(56px,9vw,110px)", lineHeight: 0.85, color: T.gold2 }}>12+</div>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: T.dim, marginTop: 12 }}>Global research studies · 2023–2026</div>
        <div style={{ height: 1, background: T.rule, margin: "26px 0" }} />
        <div style={{ fontFamily: "var(--f-display)", fontSize: "clamp(22px,2.4vw,30px)", color: T.white }}>A Consistent Pattern</div>
        <p style={{ fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 13, color: "rgba(247,246,243,0.6)", marginTop: 12 }}>The evidence revealed a pattern. It did not yet reveal the cause.</p>
      </div>
    </div>
  </FullFrame>;
}

/* ══════════ FRAME 06 — THE HIDDEN FAULT LINE ══════════ */
function Frame06() {
  return <SplitFrame id="frame-06" index="06"
    left={<Narrative eye="The Hidden Fault Line"
      title={<>THE RESEARCH WASN&rsquo;T POINTING TO<br /><span style={{ color: T.gold2 }}>A TECHNOLOGY PROBLEM.</span></>}
      paras={[
        <>Every major study identified the symptoms. None fully explained the cause. When the patterns were laid side by side, they pointed in one direction.</>,
        <>It was not pointing to a technology problem. <span style={{ color: T.gold2 }}>It was pointing to a work-design problem.</span> The world was architected for three actors. AI entered as the fourth — and the architecture never changed.</>,
      ]}
      quote={<>&ldquo;The design wasn&rsquo;t updated. The fault line <span style={{ color: T.gold2 }}>remained hidden</span>.&rdquo;</>} />}
    right={<div style={{ display: "flex", flexDirection: "column", gap: 1, background: T.rule, border: `1px solid ${T.rule}` }}>
      {[
        ["The architecture", "never changed"],
        ["The design", "wasn't updated"],
        ["The fault line", "remained hidden"],
      ].map(([a, b], i) => (
        <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.2 }}
          style={{ background: T.ink, padding: "28px 26px" }}>
          <div style={{ fontFamily: "var(--f-display)", fontSize: "clamp(24px,3vw,34px)", letterSpacing: ".02em" }}>{a}</div>
          <div style={{ fontFamily: "var(--f-display)", fontSize: "clamp(24px,3vw,34px)", letterSpacing: ".02em", color: T.gold2 }}>{b}</div>
        </motion.div>
      ))}
    </div>} />;
}

/* ══════════ FRAME 07 — ADOPTION ≠ ASSIMILATION ══════════ */
function Frame07() {
  return <SplitFrame id="frame-07" index="07"
    left={<Narrative eye="Adoption Is Not the Answer"
      title={<>AI ADOPTION <span style={{ color: T.gold2 }}>≠</span><br />AI ASSIMILATION.</>}
      paras={[
        <>Most organisations treat AI as another tool to deploy. The technology changes. The work does not. The result is predictable — higher activity, more usage, incremental productivity, limited enterprise value.</>,
        <>AI delivers its true value only when it becomes part of the <span style={{ color: T.gold2 }}>architecture of work itself</span> — AI performs what AI does best, humans perform what humans do best, and both operate as one integrated system.</>,
      ]}
      quote={<>&ldquo;AI should not be added to work. Work should be <span style={{ color: T.gold2 }}>redesigned around AI</span>.&rdquo;</>} />}
    right={<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: T.rule, border: `1px solid ${T.rule}` }}>
      {[
        { h: "Adoption", s: "Incremental", items: ["AI added to existing work", "Tools change", "Work stays the same", "Outcomes plateau"], gold: false },
        { h: "Assimilation", s: "Transformational", items: ["Work redesigned around AI", "Work changes", "Outcomes transform", "Value compounds"], gold: true },
      ].map((c) => (
        <div key={c.h} style={{ background: c.gold ? T.ink2 : T.ink, padding: "28px 24px" }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: ".16em", textTransform: "uppercase", color: c.gold ? T.gold2 : T.mid, marginBottom: 8 }}>{c.s}</div>
          <div style={{ fontFamily: "var(--f-display)", fontSize: "clamp(26px,3vw,38px)", letterSpacing: ".02em", color: c.gold ? T.gold2 : T.white, marginBottom: 18 }}>{c.h}</div>
          {c.items.map((it) => (
            <div key={it} style={{ display: "flex", gap: 10, fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 12.5, color: "rgba(247,246,243,0.7)", padding: "9px 0", borderTop: `1px solid ${T.rule}` }}>
              <span style={{ color: T.gold }}>—</span>{it}
            </div>
          ))}
        </div>
      ))}
    </div>} />;
}

/* ══════════ FRAME 08 — UNIVERSAL WORK ARCHITECTURE ══════════ */
const DISCIPLINES = [
  ["Building", "Blueprint"],
  ["Software", "Architecture"],
  ["Manufacturing", "Process Design"],
  ["Work", "Universal Work Architecture™"],
];
const UWA_OUTCOMES = ["Redesign Work", "Integrate AI into Work Design", "Optimise the Human–AI Division", "Maximise Enterprise Value"];
function Frame08() {
  return <FullFrame id="frame-08" index="08" eye="The Universal Work Architecture™"
    title={<>BEFORE WORK CAN BE REDESIGNED,<br /><span style={{ color: T.gold2 }}>IT MUST FIRST BE DEFINED.</span></>}>
    <p style={{ ...bodyText, maxWidth: 720, marginBottom: 36 }}>
      Every engineering discipline begins with a universal architecture. Buildings have blueprints. Software has architecture. Manufacturing has process design. Work never had one — so organisations tried to transform work without first defining it.
    </p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: T.rule, border: `1px solid ${T.rule}`, marginBottom: 40 }} className="ael-4col">
      {DISCIPLINES.map(([d, b], i) => {
        const last = i === DISCIPLINES.length - 1;
        return (
          <div key={d} style={{ background: last ? T.ink2 : T.ink, padding: "30px 22px", minHeight: 170, display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: ".16em", textTransform: "uppercase", color: T.mid, marginBottom: 16 }}>{d}</div>
            <div style={{ fontFamily: "var(--f-display)", fontSize: "clamp(20px,2.2vw,28px)", letterSpacing: ".02em", color: last ? T.gold2 : T.white, marginTop: "auto", lineHeight: 1.05 }}>{b}</div>
          </div>
        );
      })}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 1, background: T.rule, border: `1px solid ${T.rule}` }}>
      {UWA_OUTCOMES.map((o) => (
        <div key={o} style={{ background: T.ink, padding: "18px 20px", display: "flex", gap: 12, alignItems: "center", fontFamily: "var(--f-sans)", fontSize: 13, color: "rgba(247,246,243,0.8)" }}>
          <span style={{ color: T.gold2 }}>✓</span>{o}
        </div>
      ))}
    </div>
  </FullFrame>;
}

/* ══════════ FRAME 09 — AI TRANSFORMATION ARCHITECTURE ══════════ */
const FLOW = ["Universal Work Architecture™", "Analyse Work", "Redesign Work", "Allocate Work", "Human + AI Operating Model", "Enterprise Value"];
function Frame09() {
  return <SplitFrame id="frame-09" index="09"
    left={<Narrative eye="The AI Transformation Architecture™"
      title={<>REDESIGNING WORK<br /><span style={{ color: T.gold2 }}>IS NOT ABOUT AI.</span></>}
      paras={[
        <>Once work is described through the Universal Work Architecture™, it can be systematically redesigned — every activity, decision, workflow and role.</>,
        <>The objective is simple: assign every part of work to the performer best equipped to create value. The result is not Human versus AI — it is a new operating model where both work as <span style={{ color: T.gold2 }}>one integrated enterprise system</span>.</>,
      ]}
      quote={<>&ldquo;AI transformation is not the implementation of AI. It is the <span style={{ color: T.gold2 }}>redesign of work</span>.&rdquo;</>} />}
    right={<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
      {FLOW.map((f, i) => {
        const last = i === FLOW.length - 1;
        return (
          <motion.div key={f} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.12 }} style={{ width: "100%", maxWidth: 440, textAlign: "center" }}>
            <div style={{ border: `1px solid ${last ? T.gold2 : T.rule}`, background: last ? "rgba(196,152,72,0.08)" : "transparent", padding: "16px 18px", fontFamily: "var(--f-display)", fontSize: last ? "clamp(24px,2.6vw,32px)" : "clamp(17px,2vw,22px)", letterSpacing: ".02em", color: last ? T.gold2 : T.white }}>{f}</div>
            {!last && <div style={{ color: T.gold, fontSize: 16, lineHeight: 1, padding: "6px 0" }}>↓</div>}
          </motion.div>
        );
      })}
    </div>} />;
}

/* ══════════ FRAME 10 — HUMAN–AI ORCHESTRATION ══════════ */
function Frame10() {
  const cols = [
    { h: "Human Anchored", s: "The side that governs", items: ["Problem Framing", "Strategic Thinking", "Judgment", "Ownership", "AI Validation"], gold: true },
    { h: "AI Leveraged", s: "The side that accelerates", items: ["Analysis", "Pattern Recognition", "Content Generation", "Simulation", "Optimisation & Execution"], gold: false },
  ];
  return <SplitFrame id="frame-10" index="10"
    left={<Narrative eye="Human–AI Orchestration™"
      title={<>AI SHOULD AMPLIFY VALUE,<br /><span style={{ color: T.gold2 }}>NOT REPLACE ACCOUNTABILITY.</span></>}
      paras={[
        <>The objective of AI is not to maximise automation — it is to maximise enterprise value. That requires a deliberate division of work between humans and AI.</>,
        <>AI is responsible for <span style={{ color: T.gold2 }}>capability</span>. Humans remain responsible for <span style={{ color: T.gold2 }}>accountability</span>. Capability can be delegated. Judgment cannot.</>,
      ]}
      quote={<>&ldquo;AI should enhance human impact. Humans should <span style={{ color: T.gold2 }}>govern AI impact</span>.&rdquo;</>} />}
    right={<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: T.rule, border: `1px solid ${T.rule}` }}>
      {cols.map((c) => (
        <div key={c.h} style={{ background: c.gold ? T.ink2 : T.ink, padding: "26px 22px" }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: c.gold ? T.gold2 : T.mid, marginBottom: 6 }}>{c.s}</div>
          <div style={{ fontFamily: "var(--f-display)", fontSize: "clamp(22px,2.6vw,30px)", color: c.gold ? T.gold2 : T.white, marginBottom: 16 }}>{c.h}</div>
          {c.items.map((it) => (
            <div key={it} style={{ fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 12.5, color: "rgba(247,246,243,0.72)", padding: "9px 0", borderTop: `1px solid ${T.rule}`, display: "flex", gap: 8 }}>
              <span style={{ color: T.gold }}>{c.gold ? "▲" : "▸"}</span>{it}
            </div>
          ))}
        </div>
      ))}
    </div>} />;
}

/* ══════════ FRAME 11 — AI READINESS ══════════ */
const ACTORS = [
  { a: "Employee", d: "Augmented capability and impact." },
  { a: "Leader", d: "Better decisions, greater leverage." },
  { a: "Organisation", d: "Adaptive, resilient, future-ready." },
  { a: "AI", d: "Reliable, aligned, improving." },
];
function Frame11() {
  return <FullFrame id="frame-11" index="11" eye="AI Readiness"
    title={<>AI CAPABILITY CAN BE PURCHASED.<br /><span style={{ color: T.gold2 }}>AI READINESS MUST BE BUILT.</span></>}>
    <p style={{ ...bodyText, maxWidth: 720, marginBottom: 36 }}>
      Transformation does not begin with technology. It begins with readiness — across four actors. A weakness in any one limits the value created by the entire system. Transformation succeeds only when all four evolve together.
    </p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: T.rule, border: `1px solid ${T.rule}` }} className="ael-4col">
      {ACTORS.map((x, i) => (
        <motion.div key={x.a} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.1 }}
          style={{ background: T.ink, padding: "30px 24px", minHeight: 180, display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: ".16em", color: T.gold, marginBottom: 16 }}>0{i + 1}</div>
          <div style={{ fontFamily: "var(--f-display)", fontSize: "clamp(24px,2.8vw,34px)", letterSpacing: ".02em" }}>{x.a}</div>
          <div style={{ fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 12.5, color: "rgba(247,246,243,0.6)", marginTop: "auto", lineHeight: 1.6 }}>{x.d}</div>
        </motion.div>
      ))}
    </div>
  </FullFrame>;
}

/* ══════════ FRAME 12 — EVOLUTION JOURNEY ══════════ */
const PATHWAYS = [
  { a: "Employee", steps: ["Learn", "Adapt", "Augment", "Lead"] },
  { a: "Leader", steps: ["Direct", "Orchestrate", "Transform", "Scale"] },
  { a: "Organisation", steps: ["Adopt", "Assimilate", "Integrate", "Evolve"] },
  { a: "AI", steps: ["Deploy", "Embed", "Collaborate", "Optimise"] },
];
function Frame12() {
  return <FullFrame id="frame-12" index="12" eye="The AI Edge Lab Evolution Journey™"
    title={<>EVERY ORGANISATION WANTS TO EVOLVE.<br /><span style={{ color: T.gold2 }}>VERY FEW KNOW HOW.</span></>}>
    <p style={{ ...bodyText, maxWidth: 720, marginBottom: 36 }}>
      AI transformation is not a single initiative — it is a coordinated evolution of every workplace actor. Each follows its own pathway, aligned to the same enterprise vision. Only when every actor progresses together does the organisation realise sustained enterprise value.
    </p>
    <div style={{ display: "flex", flexDirection: "column", gap: 1, background: T.rule, border: `1px solid ${T.rule}` }}>
      {PATHWAYS.map((p, i) => (
        <motion.div key={p.a} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.1 }}
          style={{ background: T.ink, padding: "22px 24px", display: "grid", gridTemplateColumns: "160px 1fr", gap: 20, alignItems: "center" }} className="ael-path">
          <div style={{ fontFamily: "var(--f-display)", fontSize: "clamp(22px,2.4vw,30px)", letterSpacing: ".02em", color: T.gold2 }}>{p.a}</div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
            {p.steps.map((s, j) => (
              <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: j === p.steps.length - 1 ? T.gold2 : "rgba(247,246,243,0.72)" }}>{s}</span>
                {j < p.steps.length - 1 && <span style={{ color: T.gold, fontSize: 12 }}>→</span>}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  </FullFrame>;
}

/* ══════════ FRAME 13 — MEASURE YOUR AI EDGE ══════════ */
const INSTRUMENTS = [
  { tag: "Aspiring", code: "AAI™", name: "AI Alignment Index", desc: "For those entering the workforce. Where your foundations stay relevant as AI absorbs executional work." },
  { tag: "Working", code: "ARI™", name: "AI Replaceability Index", desc: "For working professionals. Your structural position across the four E.D.G.E. dimensions." },
  { tag: "Leaders", code: "BDI™", name: "Business Leaders Index", desc: "For leaders. Measure leadership in the AI era and where your edge holds." },
  { tag: "Organisation", code: "ORG AI DARS™", name: "Organisation AI DARS", desc: "Assess and benchmark your organisation's readiness to operate with AI." },
];
function Frame13() {
  return <FullFrame id="frame-13" index="13" eye="Measure Your AI Edge"
    title={<>EVIDENCE-BASED ASSESSMENTS.<br /><span style={{ color: T.gold2 }}>BUILT FOR EVERY ACTOR.</span></>}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: T.rule, border: `1px solid ${T.rule}`, marginBottom: 36 }} className="ael-4col">
      {INSTRUMENTS.map((x, i) => (
        <motion.div key={x.code} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.1 }}
          style={{ background: T.ink, padding: "28px 22px", minHeight: 230, display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 8, letterSpacing: ".16em", textTransform: "uppercase", color: T.mid, marginBottom: 14 }}>{x.tag}</div>
          <div style={{ fontFamily: "var(--f-display)", fontSize: "clamp(22px,2.4vw,28px)", color: T.gold2 }}>{x.code}</div>
          <div style={{ fontFamily: "var(--f-display)", fontSize: 16, letterSpacing: ".02em", color: T.white, marginBottom: 12 }}>{x.name}</div>
          <div style={{ fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 12, color: "rgba(247,246,243,0.6)", lineHeight: 1.6, marginBottom: 16 }}>{x.desc}</div>
          <Link href="/connect" style={{ fontFamily: "var(--f-mono)", fontSize: 8, letterSpacing: ".16em", textTransform: "uppercase", color: T.gold, marginTop: "auto" }}>Start →</Link>
        </motion.div>
      ))}
    </div>
    <Link href="/connect" style={{ display: "inline-block", fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", background: T.gold2, color: T.ink, padding: "16px 30px", fontWeight: 500 }}>Start Your Assessment →</Link>
  </FullFrame>;
}

/* ══════════ CLOSING ══════════ */
function Closing() {
  return (
    <section id="closing" style={{ background: T.ink, color: T.white, padding: "clamp(80px,14vh,140px) clamp(24px,5vw,72px)", textAlign: "center", borderBottom: `1px solid ${T.rule}` }}>
      <motion.div {...rise} transition={{ duration: 0.7 }} style={{ maxWidth: 1000, margin: "0 auto" }}>
        <span style={kicker}>Find My AI Edge</span>
        <h2 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(44px,7vw,96px)", lineHeight: 0.95, letterSpacing: ".01em", margin: "24px 0 20px" }}>
          THE FUTURE OF WORK WILL BE ARCHITECTED.<br /><span style={{ color: T.gold2 }}>NOT ACCIDENTAL.</span>
        </h2>
        <p style={{ fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 15, color: "rgba(247,246,243,0.6)", maxWidth: 620, margin: "0 auto 36px", lineHeight: 1.8 }}>
          The question is not if you will transform. The question is how intentionally.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/connect" style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", background: T.gold2, color: T.ink, padding: "16px 30px" }}>Find My AI Edge →</Link>
          <Link href="#frame-05" style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", border: `1px solid ${T.rule}`, color: T.white, padding: "16px 30px" }}>Explore the Research →</Link>
        </div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: T.ink, color: T.dim, padding: "40px clamp(24px,5vw,52px)", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 16, borderTop: `1px solid ${T.rule}` }}>
      <span style={{ fontFamily: "var(--f-display)", fontSize: 16, letterSpacing: ".04em", color: "rgba(247,246,243,0.3)" }}>AI EDGE LAB™</span>
      <span style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase" }}>The Institute for the AI Architecture of Work</span>
      <span style={{ fontFamily: "var(--f-mono)", fontSize: 8, letterSpacing: ".06em", color: "rgba(247,246,243,0.25)" }}>© 2026 Axion Index · Private &amp; Confidential</span>
    </footer>
  );
}

/* ─── Page ─── */
export default function AIEdgeLabPage() {
  return (
    <div className={`${bebas.variable} ${dmSans.variable} ${dmMono.variable}`} style={{ background: T.ink, fontFamily: "var(--f-sans)" }}>
      <style>{`
        @media (max-width: 900px){
          .ael-frame{ grid-template-columns: 1fr !important; }
          .ael-frame > div:nth-child(2){ border-left: none !important; border-top: 1px solid ${T.rule}; }
          .ael-nav{ display: none !important; }
          .ael-2col{ grid-template-columns: 1fr !important; }
          .ael-4col{ grid-template-columns: 1fr 1fr !important; }
          .ael-path{ grid-template-columns: 1fr !important; gap: 10px !important; }
        }
        @media (max-width: 520px){ .ael-4col{ grid-template-columns: 1fr !important; } }
      `}</style>
      <Header />
      <Frame01 /><Frame02 /><Frame03 /><Frame04 /><Frame05 /><Frame06 />
      <Frame07 /><Frame08 /><Frame09 /><Frame10 /><Frame11 /><Frame12 /><Frame13 />
      <Closing />
      <Footer />
    </div>
  );
}
