"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bebas_Neue, DM_Sans, DM_Mono, Cormorant_Garamond } from "next/font/google";

/* ─── Fonts ─── */
const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--f-display" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--f-sans" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--f-mono" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--f-serif" });

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
  ["Why AI Edge Lab", "#frame-01"],
  ["Doctrine", "#frame-07"],
  ["Framework", "#frame-08"],
  ["Assessments", "#frame-13"],
  ["Insights", "#frame-05"],
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
        <span style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <span style={{ fontFamily: "var(--f-display)", fontSize: 18, letterSpacing: ".06em", color: T.white }}>AI EDGE LAB</span>
          <span style={{ fontFamily: "var(--f-mono)", fontSize: 7.5, letterSpacing: ".14em", textTransform: "uppercase", color: T.mid, marginTop: 3 }}>Architecture. Not Automation.</span>
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

/* ══════════ FRAME 01 — HERO / THE WORK SHIFT ══════════ */
function HeroArcs() {
  return (
    <svg viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice" aria-hidden
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <defs>
        <radialGradient id="ael-glow" cx="52%" cy="60%" r="42%">
          <stop offset="0%" stopColor="#C8A24A" stopOpacity="0.34" />
          <stop offset="55%" stopColor="#C8A24A" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#C8A24A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="800" fill="url(#ael-glow)" />
      {[130, 195, 260, 325, 390, 455].map((r, i) => (
        <circle key={r} cx="410" cy="500" r={r} fill="none" stroke="#C8A24A" strokeWidth="1" strokeOpacity={0.3 - i * 0.035} />
      ))}
    </svg>
  );
}
function HeroSkyline() {
  return (
    <div aria-hidden style={{
      position: "absolute", bottom: 0, left: 0, right: 0, height: "34%", background: "#050506",
      clipPath: "polygon(0% 100%,0% 55%,4% 55%,4% 40%,6% 40%,6% 55%,10% 55%,10% 30%,12% 30%,12% 55%,16% 55%,16% 45%,19% 45%,19% 25%,21% 25%,21% 55%,26% 55%,26% 38%,29% 38%,29% 55%,34% 55%,34% 20%,36% 20%,36% 55%,41% 55%,41% 42%,44% 42%,44% 30%,46% 30%,46% 55%,52% 55%,52% 22%,54% 22%,54% 55%,60% 55%,60% 40%,63% 40%,63% 28%,65% 28%,65% 55%,70% 55%,70% 34%,73% 34%,73% 55%,79% 55%,79% 24%,81% 24%,81% 55%,86% 55%,86% 44%,89% 44%,89% 30%,91% 30%,91% 55%,96% 55%,96% 48%,100% 48%,100% 100%)",
    }} />
  );
}
function Frame01() {
  return (
    <>
      <section id="frame-01" style={{ position: "relative", minHeight: "auto", background: "#0A0A0B", overflow: "hidden", display: "flex", alignItems: "center" }}>
        {/* placeholder visual (arcs + skyline) — shows until hero photo is added */}
        <div style={{ position: "absolute", inset: 0 }}><HeroArcs /><HeroSkyline /></div>
        {/* hero photo — 4-actor silhouettes + sunset skyline */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/aiedgelab.png')", backgroundSize: "cover", backgroundPosition: "0% center", backgroundRepeat: "no-repeat" }} />
        {/* left legibility gradient */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,#0A0A0B 0%,#0A0A0B 26%,rgba(10,10,11,0.72) 46%,rgba(10,10,11,0.15) 70%,transparent 88%)" }} />
        {/* content */}
        <div style={{ position: "relative", zIndex: 3, maxWidth: 1280, width: "100%", margin: "0 auto", padding: "clamp(40px,8vh,80px) clamp(24px,5vw,64px)" }}>
          <div style={{ maxWidth: 580 }}>
            <motion.span {...rise} transition={{ duration: 0.6 }} style={{ ...kicker, display: "block", marginBottom: 22 }}>The Work Shift</motion.span>
            <motion.h1 {...rise} transition={{ duration: 0.7, delay: 0.05 }}
              style={{ fontFamily: "var(--f-serif)", fontWeight: 500, fontSize: "clamp(44px,6vw,86px)", lineHeight: 1.02, color: T.white, marginBottom: 24 }}>
              AI has entered the workplace as <span style={{ color: T.gold2 }}>the fourth actor.</span>
            </motion.h1>
            <motion.p {...rise} transition={{ duration: 0.6, delay: 0.14 }}
              style={{ fontFamily: "var(--f-sans)", fontSize: 17, color: "rgba(247,246,243,0.9)", marginBottom: 22 }}>
              It has redefined the value of work.
            </motion.p>
            <motion.div {...rise} transition={{ duration: 0.6, delay: 0.2 }}
              style={{ fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 14.5, lineHeight: 1.85, color: "rgba(247,246,243,0.62)", maxWidth: 440 }}>
              <p style={{ marginBottom: 18 }}>As AI commoditises execution, the premium shifts to <span style={{ color: T.gold2 }}>intelligence</span>, <span style={{ color: T.gold2 }}>judgment</span> and <span style={{ color: T.gold2 }}>Human&ndash;AI orchestration</span>.</p>
              <p>Do you know where your edge stands&mdash; and how long it will hold?</p>
            </motion.div>
            <motion.div {...rise} transition={{ duration: 0.6, delay: 0.28 }} style={{ marginTop: 34 }}>
              <Link href="/connect" style={{ display: "inline-flex", alignItems: "center", gap: 12, fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", background: T.gold2, color: T.ink, padding: "16px 26px", fontWeight: 500 }}>
                Find My AI Edge <span aria-hidden>→</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      {/* cream transition band */}
      <div style={{ background: "#F2F0EA", color: T.ink, textAlign: "center", padding: "clamp(30px,4.5vh,52px) clamp(24px,5vw,64px) clamp(20px,3vh,30px)", borderBottom: "1px solid rgba(13,13,11,0.08)" }}>
        <motion.p {...rise} transition={{ duration: 0.7 }}
          style={{ fontFamily: "var(--f-serif)", fontWeight: 500, fontSize: "clamp(22px,3vw,34px)", lineHeight: 1.35, color: "#2A2A28", maxWidth: 760, margin: "0 auto" }}>
          The equation of value creation has changed&mdash;<br />for employees, leaders and organisations alike.
        </motion.p>
        <div style={{ marginTop: 26, color: T.gold, fontSize: 22 }} aria-hidden>⌄</div>
      </div>
    </>
  );
}

/* ══════════ FRAME 02 — THE EVOLUTION OF VALUE CREATION (light) ══════════ */
const EV_ERAS = [
  { name: "Industrial", year: "~1900s" },
  { name: "Knowledge", year: "~1950s" },
  { name: "Digital", year: "~2000s" },
  { name: "AI-First", year: "~2020s+", gold: true },
];
const EV_ROWS = [
  { role: "Employee", sub: "What creates value for me", cells: ["Physical effort and time", "Knowledge and expertise", "Information and access", "Intelligence and judgment"] },
  { role: "Leader", sub: "What I must do to create value", cells: ["Direct and control", "Guide and develop", "Empower and align", "Orchestrate and amplify"] },
  { role: "Organisation", sub: "What drives organisational value", cells: ["Assets and efficiency", "Processes and capabilities", "Platforms and scale", "Human–AI systems and adaptability"] },
];
const LT = { bg: "#F5F3ED", ink: "#1A1A18", ink2: "#2E2E2C", mid: "#7A7870", line: "rgba(13,13,11,0.12)", gold: "#A07830" };

function RoleIcon({ i }: { i: number }) {
  return (
    <span style={{ display: "inline-flex", width: 30, height: 30, border: `1px solid ${LT.line}`, borderRadius: "50%", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={LT.gold} strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
        {i === 0 && (<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>)}
        {i === 1 && (<><circle cx="8" cy="9" r="3" /><circle cx="16" cy="9" r="3" /><path d="M2 20c0-3 3-5 6-5M22 20c0-3-3-5-6-5" /></>)}
        {i === 2 && (<><rect x="5" y="4" width="14" height="17" /><path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h2M13 16h2" /></>)}
      </svg>
    </span>
  );
}

function Frame02() {
  return (
    <section id="frame-02" style={{ background: LT.bg, color: LT.ink, padding: "clamp(44px,6vh,72px) clamp(20px,4vw,52px)", borderBottom: `1px solid ${LT.line}` }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", display: "grid", gridTemplateColumns: "clamp(104px,9vw,124px) 1fr", gap: "clamp(14px,3vw,36px)" }}>
        {/* index rail */}
        <div style={{ borderRight: `1px solid ${LT.line}`, paddingRight: 8 }}>
          <div style={{ fontFamily: "var(--f-display)", fontSize: 34, color: LT.gold, lineHeight: 1 }}>02</div>
          <div style={{ width: 20, height: 1, background: LT.gold, margin: "10px 0 14px" }} />
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 8.5, letterSpacing: ".1em", textTransform: "uppercase", color: LT.mid, lineHeight: 1.9, paddingRight: 6 }}>The Evolution of Value Creation</div>
        </div>
        {/* main (scrolls horizontally on small screens) */}
        <div style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 820 }}>
            {/* headline + timeline */}
            <div style={{ display: "grid", gridTemplateColumns: "32% 1fr", gap: 24, alignItems: "start", marginBottom: 8 }}>
              <div>
                <motion.h2 {...rise} transition={{ duration: 0.6 }}
                  style={{ fontFamily: "var(--f-serif)", fontWeight: 500, fontSize: "clamp(32px,3.4vw,50px)", lineHeight: 1.05, color: LT.ink }}>
                  Value creation has <span style={{ color: LT.gold }}>evolved.</span> The <span style={{ color: LT.gold }}>sources</span> have <span style={{ color: LT.gold }}>shifted.</span>
                </motion.h2>
                <div style={{ width: 40, height: 2, background: LT.gold, margin: "20px 0 14px" }} />
                <p style={{ fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 13.5, lineHeight: 1.7, color: LT.mid, maxWidth: 220 }}>Every era rewards a different source of value.</p>
              </div>
              <div style={{ position: "relative", height: 300 }}>
                {/* fallback golden glow (AI-First) — visible if imagery not yet added */}
                <div aria-hidden style={{ position: "absolute", right: 0, bottom: 0, width: "38%", height: "76%", background: "radial-gradient(ellipse at bottom right, rgba(196,152,72,0.26), transparent 72%)", pointerEvents: "none" }} />
                {/* era imagery — save the eras photo to public/ai-edge-eras.png (factory · book · network · golden mountain) */}
                <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "url('/ai-edge-eras.png')", backgroundSize: "cover", backgroundPosition: "center bottom", backgroundRepeat: "no-repeat", WebkitMaskImage: "linear-gradient(to bottom, transparent 6%, #000 34%)", maskImage: "linear-gradient(to bottom, transparent 6%, #000 34%)", pointerEvents: "none" }} />
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden>
                  <defs>
                    <linearGradient id="ev-line" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#C7C2B6" />
                      <stop offset="55%" stopColor="#A07830" />
                      <stop offset="100%" stopColor="#C49848" />
                    </linearGradient>
                    <linearGradient id="ev-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C49848" stopOpacity="0.26" />
                      <stop offset="100%" stopColor="#C49848" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* area fill under the curve */}
                  <motion.path d="M0,80 C6,77 9,74 12.5,72 C20,69 30,64 37.5,60 C45,56 55,51 62.5,46 C70,40 80,30 87.5,22 C92,18 97,14 100,12 L100,100 L0,100 Z"
                    fill="url(#ev-area)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} />
                  {/* vertical guides from labels to dots */}
                  {[[12.5, 72], [37.5, 60], [62.5, 46], [87.5, 22]].map(([gx, gy], gi) => (
                    <line key={gi} x1={gx} y1="16" x2={gx} y2={gy} stroke="rgba(13,13,11,0.12)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                  ))}
                  {/* the growth curve (passes exactly through each era dot) */}
                  <motion.path d="M0,80 C6,77 9,74 12.5,72 C20,69 30,64 37.5,60 C45,56 55,51 62.5,46 C70,40 80,30 87.5,22 C92,18 97,14 100,12"
                    fill="none" stroke="url(#ev-line)" strokeWidth="2.4" strokeLinecap="round" vectorEffect="non-scaling-stroke"
                    initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: "easeOut" }} />
                </svg>
                {EV_ERAS.map((e, i) => {
                  const x = 12.5 + i * 25;
                  const y = [72, 60, 46, 22][i];
                  return (
                    <div key={e.name}>
                      <div style={{ position: "absolute", left: `${x}%`, top: 0, transform: "translateX(-50%)", textAlign: "center", whiteSpace: "nowrap" }}>
                        <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: e.gold ? LT.gold : LT.ink2, fontWeight: 500 }}>{e.name}</div>
                        <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: ".06em", color: LT.mid, marginTop: 4 }}>{e.year}</div>
                      </div>
                      <motion.div initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.7 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
                        style={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)", width: e.gold ? 18 : 10, height: e.gold ? 18 : 10, borderRadius: "50%", background: LT.gold, border: e.gold ? "2px solid #FBFAF6" : "none", boxShadow: e.gold ? "0 0 0 6px rgba(196,152,72,0.22), 0 0 18px rgba(196,152,72,0.55)" : "0 0 0 3px rgba(196,152,72,0.14)" }} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* matrix */}
            <div style={{ display: "grid", gridTemplateColumns: "32% repeat(4,1fr)", borderTop: `1px solid ${LT.line}` }}>
              {EV_ROWS.map((row, ri) => (
                <Fragment key={row.role}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "20px 16px 20px 0", borderBottom: `1px solid ${LT.line}` }}>
                    <RoleIcon i={ri} />
                    <div>
                      <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: LT.ink, fontWeight: 500 }}>{row.role}</div>
                      <div style={{ fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 12, color: LT.mid, marginTop: 4, lineHeight: 1.4 }}>{row.sub}</div>
                    </div>
                  </div>
                  {row.cells.map((c, ci) => {
                    const gold = ci === row.cells.length - 1;
                    return (
                      <div key={ci} style={{ padding: "20px 18px", borderBottom: `1px solid ${LT.line}`, borderLeft: `1px solid ${LT.line}`, fontFamily: "var(--f-sans)", fontWeight: gold ? 400 : 300, fontSize: 13.5, lineHeight: 1.5, color: gold ? LT.gold : LT.ink2 }}>
                        {c}
                      </div>
                    );
                  })}
                </Fragment>
              ))}
            </div>

            {/* bottom */}
            <div style={{ textAlign: "center", padding: "34px 0 6px" }}>
              <div style={{ fontFamily: "var(--f-serif)", fontSize: "clamp(18px,2.2vw,26px)", color: LT.ink }}>The tools change. The source of value changes.</div>
              <div style={{ fontFamily: "var(--f-serif)", fontStyle: "italic", fontSize: "clamp(18px,2.2vw,26px)", color: LT.gold, marginTop: 4 }}>The equation changes.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════ FRAME 03 — THE NEW DESIGN CHOICE ══════════ */
const STAGES = ["Customer Request", "Research", "Analysis", "Decision", "Execution", "Review"];
const PERFORMERS = ["Human", "AI", "Human + AI"];
function Frame03() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick((t) => t + 1), 1400); return () => clearInterval(id); }, []);
  return (
    <section id="frame-03" style={{ background: T.ink, color: T.white, padding: "clamp(44px,6vh,72px) clamp(20px,4vw,52px)", borderBottom: `1px solid ${T.rule}` }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", display: "grid", gridTemplateColumns: "clamp(104px,9vw,124px) 1fr", gap: "clamp(14px,3vw,36px)" }}>
        {/* rail */}
        <div style={{ borderRight: `1px solid ${T.rule}`, paddingRight: 8 }}>
          <div style={{ fontFamily: "var(--f-display)", fontSize: 34, color: T.gold, lineHeight: 1 }}>03</div>
          <div style={{ width: 20, height: 1, background: T.gold, margin: "10px 0 14px" }} />
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 8.5, letterSpacing: ".1em", textTransform: "uppercase", color: T.mid, lineHeight: 1.9, paddingRight: 6 }}>The New Design Choice</div>
        </div>
        {/* main */}
        <div style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 900 }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(260px,30%) 1fr", gap: "clamp(20px,3vw,44px)", alignItems: "stretch" }}>
              <div>
                <motion.h2 {...rise} transition={{ duration: 0.6 }} style={{ fontFamily: "var(--f-serif)", fontWeight: 500, fontSize: "clamp(40px,4.4vw,64px)", lineHeight: 1.04, color: T.white }}>
                  For the first time,<br /><span style={{ color: T.gold2 }}>work has a choice.</span>
                </motion.h2>
                <div style={{ width: 40, height: 2, background: T.gold, margin: "22px 0 16px" }} />
                <p style={{ fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 15, lineHeight: 1.85, color: "rgba(247,246,243,0.62)", maxWidth: 400 }}>
                  Every technology before AI amplified human work. AI can now perform parts of the work itself — a decision organisations have never had to make before. <span style={{ color: T.gold2 }}>Who should perform the work?</span> Every activity, every decision, every workflow. The quality of those choices will increasingly determine productivity, capability and competitive advantage.
                </p>
              </div>
              {/* workflow — vertical rows, spread to fill the full height */}
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 6, paddingTop: 8 }}>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: T.dim, marginBottom: 4 }}>The workflow · who performs each step</div>
                {STAGES.map((s, i) => {
                  const active = PERFORMERS[(tick + i) % PERFORMERS.length];
                  return (
                    <div key={s} style={{ display: "grid", gridTemplateColumns: "26px 1fr 300px", gap: 16, alignItems: "center", padding: "12px 0", borderTop: `1px solid ${T.rule}` }}>
                      <span style={{ fontFamily: "var(--f-display)", fontSize: 20, color: T.gold, lineHeight: 1 }}>0{i + 1}</span>
                      <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: T.white }}>{s}</span>
                      <div style={{ display: "flex", gap: 8 }}>
                        {PERFORMERS.map((p) => {
                          const on = p === active;
                          return <span key={p} style={{ flex: 1, fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: ".05em", textTransform: "uppercase", textAlign: "center", padding: "9px 4px", border: `1px solid ${on ? T.gold2 : T.rule}`, color: on ? T.ink : T.dim, background: on ? T.gold2 : "transparent", transition: "all .35s ease", whiteSpace: "nowrap" }}>{p}</span>;
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* bottom */}
            <div style={{ textAlign: "center", padding: "56px 0 6px" }}>
              <div style={{ fontFamily: "var(--f-serif)", fontSize: "clamp(18px,2.2vw,28px)", color: T.white }}>The future will not belong to organisations with more AI &mdash;</div>
              <div style={{ fontFamily: "var(--f-serif)", fontSize: "clamp(18px,2.2vw,28px)", color: T.gold2, marginTop: 2 }}>it will belong to those who make better decisions about where AI should work.</div>
              <div style={{ marginTop: 22, color: T.gold, fontSize: 22 }} aria-hidden>⌄</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════ FRAME 04 — THE OUTCOME GAP ══════════ */
const OG_STAGES = ["Investment", "Adoption", "Capability", "Integration", "Scale"];
const OG_ORGS = [
  { name: "Organisation A", tag: "Compounding value", filled: 6, gold: true },
  { name: "Organisation B", tag: "Isolated gains", filled: 5, gold: false },
  { name: "Organisation C", tag: "Activity without impact", filled: 2, gold: false },
];
function StageIcon({ i, cx, cy }: { i: number; cx: number; cy: number }) {
  const p = (d: string) => <path d={d} />;
  return (
    <g stroke={LT.gold} strokeWidth={1.2} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {i === 0 && (<>{p(`M${cx - 6},${cy + 6} L${cx + 6},${cy - 6}`)}{p(`M${cx - 6},${cy - 6} L${cx + 6},${cy + 6}`)}<circle cx={cx - 6} cy={cy - 6} r="2" /><circle cx={cx + 6} cy={cy + 6} r="2" /></>)}
      {i === 1 && (<><circle cx={cx - 4} cy={cy - 3} r="2.4" /><circle cx={cx + 4} cy={cy - 3} r="2.4" />{p(`M${cx - 9},${cy + 6} q4,-6 5,-1`)}{p(`M${cx + 9},${cy + 6} q-4,-6 -5,-1`)}</>)}
      {i === 2 && (<>{p(`M${cx - 8},${cy - 1} L${cx},${cy - 5} L${cx + 8},${cy - 1} L${cx},${cy + 3} Z`)}{p(`M${cx + 6},${cy} L${cx + 6},${cy + 5}`)}</>)}
      {i === 3 && (<><rect x={cx - 6} y={cy - 6} width="4.5" height="4.5" /><rect x={cx + 1.5} y={cy - 6} width="4.5" height="4.5" /><rect x={cx - 6} y={cy + 1.5} width="4.5" height="4.5" /><rect x={cx + 1.5} y={cy + 1.5} width="4.5" height="4.5" /></>)}
      {i === 4 && (<><rect x={cx - 7} y={cy} width="3" height="6" /><rect x={cx - 1.5} y={cy - 4} width="3" height="10" /><rect x={cx + 4} y={cy - 7} width="3" height="13" /></>)}
    </g>
  );
}
function OutcomeDiagram() {
  const stageX = [120, 205, 290, 375, 460];
  // one path per organisation — same origin, same journey, different outcome
  const rows = [
    { y: 155, end: 108, color: LT.gold,   w: 2.4, op: 0.95 }, // A — compounding (up)
    { y: 205, end: 205, color: "#8C887E", w: 1.4, op: 0.6 },  // B — isolated gains (flat)
    { y: 255, end: 302, color: "#9A968C", w: 1.1, op: 0.4 },  // C — activity without impact (down)
  ];
  return (
    <svg viewBox="0 0 640 320" width="100%" style={{ display: "block" }} aria-hidden>
      {/* top labels */}
      <text x="290" y="16" textAnchor="middle" style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: "0.14em", fill: LT.mid }}>SAME INVESTMENT. SAME JOURNEY.</text>
      <text x="565" y="16" textAnchor="middle" style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: "0.14em", fill: LT.gold }}>DIFFERENT OUTCOMES.</text>
      {/* stage icons + labels + column guides */}
      {stageX.map((x, i) => (
        <g key={i}>
          <line x1={x} y1="72" x2={x} y2="150" stroke={LT.line} strokeWidth="1" />
          <circle cx={x} cy="50" r="20" fill="none" stroke={LT.gold} strokeWidth="1" opacity="0.85" />
          <StageIcon i={i} cx={x} cy={50} />
          <text x={x} y="92" textAnchor="middle" style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: "0.08em", fill: LT.mid }}>{OG_STAGES[i]}</text>
        </g>
      ))}
      {rows.map((row, r) => (
        <g key={r}>
          {/* fan-in from origin */}
          <motion.path d={`M40,205 C86,205 96,${row.y} 120,${row.y}`} fill="none" stroke={row.color} strokeWidth={row.w} strokeOpacity={row.op}
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} />
          {/* rail through the shared journey */}
          <line x1="120" y1={row.y} x2="460" y2={row.y} stroke={row.color} strokeWidth={row.w} strokeOpacity={row.op} />
          {/* fan-out — the divergence */}
          <motion.path d={`M460,${row.y} C540,${row.y} 566,${row.end} 620,${row.end}`} fill="none" stroke={row.color} strokeWidth={row.w} strokeOpacity={row.op}
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.6 }} />
          {/* outcome end node */}
          <motion.circle cx="620" cy={row.end} r={r === 0 ? 5.5 : 4} fill={row.color}
            initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: row.op, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 1.3 }} />
          {/* dots at each stage */}
          {stageX.map((x, c) => (
            <motion.circle key={c} cx={x} cy={row.y} r="4.5" fill={row.color}
              initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: Math.min(1, row.op + 0.2), scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: 0.3 + c * 0.06 }} />
          ))}
        </g>
      ))}
      {/* gold particle spray near the compounding (A) outcome */}
      {[[596, 100], [610, 92], [622, 86], [588, 110]].map(([px, py], k) => (
        <circle key={"p" + k} cx={px} cy={py} r={1.6} fill={LT.gold} opacity={0.75 - k * 0.1} />
      ))}
      {/* origin */}
      <circle cx="40" cy="205" r="6" fill={LT.gold} />
      <circle cx="40" cy="205" r="11" fill="none" stroke={LT.gold} strokeWidth="1" opacity="0.4" />
    </svg>
  );
}
function Frame04() {
  return (
    <section id="frame-04" style={{ background: LT.bg, color: LT.ink, padding: "clamp(44px,6vh,72px) clamp(20px,4vw,52px)", borderBottom: `1px solid ${LT.line}` }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", display: "grid", gridTemplateColumns: "clamp(104px,9vw,124px) 1fr", gap: "clamp(14px,3vw,36px)" }}>
        {/* rail */}
        <div style={{ borderRight: `1px solid ${LT.line}`, paddingRight: 8 }}>
          <div style={{ fontFamily: "var(--f-display)", fontSize: 34, color: LT.gold, lineHeight: 1 }}>04</div>
          <div style={{ width: 20, height: 1, background: LT.gold, margin: "10px 0 14px" }} />
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 8.5, letterSpacing: ".1em", textTransform: "uppercase", color: LT.mid, lineHeight: 1.9, paddingRight: 6 }}>The Outcome Gap</div>
        </div>
        {/* main */}
        <div style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 960 }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(200px,22%) 1fr minmax(180px,20%)", gap: "clamp(20px,3vw,44px)", alignItems: "center" }}>
              {/* text */}
              <div>
                <motion.h2 {...rise} transition={{ duration: 0.6 }} style={{ fontFamily: "var(--f-serif)", fontWeight: 500, fontSize: "clamp(30px,3.2vw,44px)", lineHeight: 1.06, color: LT.ink }}>
                  Same start.<br />Same investment.<br /><span style={{ color: LT.gold }}>Different outcomes.</span>
                </motion.h2>
                <div style={{ width: 40, height: 2, background: LT.gold, margin: "20px 0 14px" }} />
                <p style={{ fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 13.5, lineHeight: 1.8, color: LT.mid, maxWidth: 220 }}>Every visible signal looks similar. Yet outcomes are radically different.</p>
              </div>
              {/* diagram */}
              <div><OutcomeDiagram /></div>
              {/* org bars */}
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {OG_ORGS.map((o, oi) => (
                  <motion.div key={o.name} initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 + oi * 0.15 }}>
                    <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: o.gold ? LT.gold : LT.ink }}>{o.name}</div>
                    <div style={{ fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 12, color: LT.mid, margin: "4px 0 10px" }}>{o.tag}</div>
                    <div style={{ display: "flex", gap: 3 }}>
                      {Array.from({ length: 10 }).map((_, b) => {
                        const on = b < o.filled;
                        return <span key={b} style={{ flex: 1, height: 18, background: on ? (o.gold ? LT.gold : "#6E6B63") : "transparent", border: on ? "none" : `1px solid ${LT.line}` }} />;
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            {/* bottom */}
            <div style={{ textAlign: "center", padding: "6px 0" }}>
              <div style={{ fontFamily: "var(--f-serif)", fontSize: "clamp(20px,2.4vw,30px)", color: LT.ink }}>If every organisation starts from the same place,</div>
              <div style={{ fontFamily: "var(--f-serif)", fontSize: "clamp(20px,2.4vw,30px)", color: LT.gold, marginTop: 2 }}>what determines who creates advantage?</div>
              <div style={{ marginTop: 22, color: LT.gold, fontSize: 22 }} aria-hidden>⌄</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════ FRAME 05 — FOLLOWING THE EVIDENCE ══════════ */
const INSTITUTIONS = ["McKinsey & Company", "MIT Sloan", "World Economic Forum", "Microsoft Work Trend Index", "IBM Institute for Business Value", "BCG", "Gartner", "Stanford HAI", "RAND", "PwC", "Deloitte", "Accenture"];
function Frame05() {
  return (
    <section id="frame-05" style={{ background: T.ink, color: T.white, padding: "clamp(44px,6vh,72px) clamp(20px,4vw,52px)", borderBottom: `1px solid ${T.rule}` }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", display: "grid", gridTemplateColumns: "clamp(104px,9vw,124px) 1fr", gap: "clamp(14px,3vw,36px)" }}>
        {/* rail */}
        <div style={{ borderRight: `1px solid ${T.rule}`, paddingRight: 8 }}>
          <div style={{ fontFamily: "var(--f-display)", fontSize: 34, color: T.gold2, lineHeight: 1 }}>05</div>
          <div style={{ width: 20, height: 1, background: T.gold2, margin: "10px 0 14px" }} />
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 8.5, letterSpacing: ".1em", textTransform: "uppercase", color: T.mid, lineHeight: 1.9, paddingRight: 6 }}>Following the Evidence</div>
        </div>
        {/* main */}
        <div style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 820 }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(300px,44%) 1fr", gap: "clamp(24px,4vw,56px)", alignItems: "start" }}>
              {/* left */}
              <div>
                <motion.h2 {...rise} transition={{ duration: 0.6 }} style={{ fontFamily: "var(--f-serif)", fontWeight: 500, fontSize: "clamp(32px,3.6vw,52px)", lineHeight: 1.05, color: T.white }}>
                  We didn&rsquo;t start with a framework.<br /><span style={{ color: T.gold2 }}>We started with a question.</span>
                </motion.h2>
                <div style={{ width: 40, height: 2, background: T.gold2, margin: "22px 0 16px" }} />
                <p style={{ fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 14.5, lineHeight: 1.85, color: T.mid, maxWidth: 400 }}>
                  If AI is improving capability, why isn&rsquo;t it consistently improving enterprise value? To answer, we examined the world&rsquo;s leading research on AI adoption, transformation and organisational change — across industries, geographies and independent institutions. Different research, different methodologies, different conclusions. Yet a remarkably consistent pattern emerged.
                </p>
                <div style={{ marginTop: 26, paddingLeft: 18, borderLeft: `2px solid ${T.gold2}` }}>
                  <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: ".16em", textTransform: "uppercase", color: T.gold2 }}>12+ studies · 2023–2026</div>
                  <div style={{ fontFamily: "var(--f-display)", fontSize: "clamp(24px,2.6vw,34px)", letterSpacing: ".02em", color: T.white, marginTop: 6 }}>A Consistent Pattern</div>
                  <p style={{ fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 13, color: T.mid, marginTop: 8, maxWidth: 360 }}>The evidence revealed a pattern. It did not yet reveal the cause.</p>
                </div>
              </div>
              {/* right: research landscape */}
              <div>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: ".16em", textTransform: "uppercase", color: T.mid, marginBottom: 14 }}>The Research Landscape</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: T.rule, border: `1px solid ${T.rule}` }}>
                  {INSTITUTIONS.map((n, i) => (
                    <motion.div key={n} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.04 }}
                      style={{ background: T.ink, padding: "14px 16px", fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".06em", textTransform: "uppercase", color: "rgba(247,246,243,0.72)" }}>{n}</motion.div>
                  ))}
                </div>
                {/* question — directly under the research landscape box */}
                <div style={{ marginTop: 26 }}>
                  <div style={{ fontFamily: "var(--f-serif)", fontSize: "clamp(18px,2vw,26px)", color: T.white, lineHeight: 1.25 }}>If every major study identified the symptoms &mdash;</div>
                  <div style={{ fontFamily: "var(--f-serif)", fontStyle: "italic", fontSize: "clamp(18px,2vw,26px)", color: T.gold2, marginTop: 2 }}>what were they all missing?</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════ FRAME 06 — THE HIDDEN FAULT LINE ══════════ */
function Frame06() {
  const actors = ["Employee", "Leader", "Organisation"];
  return (
    <section id="frame-06" style={{ background: LT.bg, color: LT.ink, padding: "clamp(44px,6vh,72px) clamp(20px,4vw,52px)", borderBottom: `1px solid ${LT.line}` }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", display: "grid", gridTemplateColumns: "clamp(104px,9vw,124px) 1fr", gap: "clamp(14px,3vw,36px)" }}>
        {/* rail */}
        <div style={{ borderRight: `1px solid ${LT.line}`, paddingRight: 8 }}>
          <div style={{ fontFamily: "var(--f-display)", fontSize: 34, color: LT.gold, lineHeight: 1 }}>06</div>
          <div style={{ width: 20, height: 1, background: LT.gold, margin: "10px 0 14px" }} />
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 8.5, letterSpacing: ".1em", textTransform: "uppercase", color: LT.mid, lineHeight: 1.9, paddingRight: 6 }}>The Hidden Fault Line</div>
        </div>
        {/* main */}
        <div style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 820 }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(300px,44%) 1fr", gap: "clamp(24px,4vw,56px)", alignItems: "center" }}>
              {/* left */}
              <div>
                <motion.h2 {...rise} transition={{ duration: 0.6 }} style={{ fontFamily: "var(--f-serif)", fontWeight: 500, fontSize: "clamp(32px,3.6vw,54px)", lineHeight: 1.05, color: LT.ink }}>
                  The research wasn&rsquo;t pointing to<br /><span style={{ color: LT.gold }}>a technology problem.</span>
                </motion.h2>
                <div style={{ width: 40, height: 2, background: LT.gold, margin: "22px 0 16px" }} />
                <p style={{ fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 14.5, lineHeight: 1.85, color: LT.mid, maxWidth: 400 }}>
                  Every major study identified the symptoms. None fully explained the cause. Laid side by side, they pointed in one direction — <span style={{ color: LT.gold }}>it was pointing to a work-design problem</span>. The world was architected for three actors. AI entered as the fourth, and the architecture never changed.
                </p>
              </div>
              {/* right: three actors + fault line + AI fourth */}
              <div>
                <svg viewBox="0 0 520 336" width="100%" style={{ display: "block" }} aria-hidden>
                  {/* top label */}
                  <text x="260" y="14" textAnchor="middle" style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: "0.14em", fill: LT.mid }}>THE WORLD WAS DESIGNED FOR THREE ACTORS</text>
                  {/* shared architecture beam connecting the three actors */}
                  <line x1="90" y1="40" x2="430" y2="40" stroke={LT.line} strokeWidth="1.5" />
                  {actors.map((a, i) => {
                    const x = [90, 260, 430][i];
                    return (
                      <motion.g key={a} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.12 }}>
                        <line x1={x} y1="40" x2={x} y2="54" stroke={LT.line} strokeWidth="1.5" />
                        <rect x={x - 74} y="54" width="148" height="48" rx="2" fill="#FBFAF6" stroke={LT.line} strokeWidth="1" />
                        <text x={x} y="83" textAnchor="middle" style={{ fontFamily: "var(--f-display)", fontSize: 18, letterSpacing: "0.03em", fill: LT.ink }}>{a}</text>
                        {/* connector reaching down — stops at the fault line */}
                        <line x1={x} y1="102" x2={x} y2="156" stroke={LT.gold} strokeWidth="1" strokeDasharray="3 4" opacity="0.5" />
                      </motion.g>
                    );
                  })}
                  {/* THE FAULT LINE — architectural break; the two sides are offset */}
                  <path d="M0,176 L70,176 L96,162 L122,188 L172,164 L214,186 L258,166 L302,188 L346,166 L392,188 L440,170 L520,170" fill="none" stroke="rgba(13,13,11,0.10)" strokeWidth="1.4" transform="translate(0,6)" />
                  <motion.path d="M0,170 L70,170 L96,156 L122,182 L172,158 L214,180 L258,160 L302,182 L346,160 L392,182 L440,164 L520,164"
                    fill="none" stroke={LT.gold} strokeWidth="2.6" strokeLinejoin="round" vectorEffect="non-scaling-stroke"
                    initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: "easeOut" }} />
                  {/* bottom label */}
                  <text x="260" y="224" textAnchor="middle" style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: "0.14em", fill: LT.gold }}>AI ENTERED AS THE FOURTH ACTOR</text>
                  {/* AI connector reaching up — also stops at the fault line (never bridged) */}
                  <line x1="260" y1="250" x2="260" y2="196" stroke={LT.gold} strokeWidth="1" strokeDasharray="3 4" opacity="0.5" />
                  {/* AI node — the fourth actor, stranded on the other side */}
                  <motion.g initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.7 }}>
                    <rect x="204" y="250" width="112" height="66" rx="2" fill="rgba(160,120,48,0.1)" stroke={LT.gold} strokeWidth="1.6" />
                    <text x="260" y="291" textAnchor="middle" style={{ fontFamily: "var(--f-display)", fontSize: 26, letterSpacing: "0.06em", fill: LT.gold }}>AI</text>
                  </motion.g>
                </svg>
              </div>
            </div>
            {/* bottom */}
            <div style={{ textAlign: "center", padding: "14px 0 6px" }}>
              <div style={{ fontFamily: "var(--f-serif)", fontSize: "clamp(18px,2.2vw,28px)", color: LT.ink }}>The design wasn&rsquo;t updated —</div>
              <div style={{ fontFamily: "var(--f-serif)", fontStyle: "italic", fontSize: "clamp(18px,2.2vw,28px)", color: LT.gold, marginTop: 2 }}>the fault line remained hidden.</div>
              <div style={{ marginTop: 8, color: LT.gold, fontSize: 22 }} aria-hidden>⌄</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════ FRAME 07 — ADOPTION ≠ ASSIMILATION (cream) ══════════ */
function Frame07() {
  const cols = [
    { h: "Adoption", s: "Incremental", items: ["AI added to existing work", "Tools change", "Work stays the same", "Outcomes plateau"], gold: false },
    { h: "Assimilation", s: "Transformational", items: ["Work redesigned around AI", "Work changes", "Outcomes transform", "Value compounds"], gold: true },
  ];
  return (
    <section id="frame-07" style={{ background: T.ink, color: T.white, padding: "clamp(44px,6vh,72px) clamp(20px,4vw,52px)", borderBottom: `1px solid ${T.rule}` }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", display: "grid", gridTemplateColumns: "clamp(104px,9vw,124px) 1fr", gap: "clamp(14px,3vw,36px)" }}>
        {/* rail */}
        <div style={{ borderRight: `1px solid ${T.rule}`, paddingRight: 8 }}>
          <div style={{ fontFamily: "var(--f-display)", fontSize: 34, color: T.gold2, lineHeight: 1 }}>07</div>
          <div style={{ width: 20, height: 1, background: T.gold2, margin: "10px 0 14px" }} />
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 8.5, letterSpacing: ".1em", textTransform: "uppercase", color: T.mid, lineHeight: 1.9, paddingRight: 6 }}>Adoption Is Not the Answer</div>
        </div>
        {/* main */}
        <div style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 820 }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(280px,40%) 1fr", gap: "clamp(24px,4vw,56px)", alignItems: "center" }}>
              {/* left */}
              <div>
                <motion.h2 {...rise} transition={{ duration: 0.6 }} style={{ fontFamily: "var(--f-serif)", fontWeight: 500, fontSize: "clamp(34px,3.8vw,58px)", lineHeight: 1.04, color: T.white }}>
                  AI adoption <span style={{ color: T.gold2 }}>≠</span><br />AI assimilation.
                </motion.h2>
                <div style={{ width: 40, height: 2, background: T.gold2, margin: "22px 0 16px" }} />
                <p style={{ fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 15, lineHeight: 1.85, color: T.mid, maxWidth: 380 }}>
                  Most organisations treat AI as another tool to be deployed. The technology changes; the work does not. People work the same way, only with AI added to the process. The result is predictable — higher activity, more usage, incremental productivity, but only limited enterprise value. AI delivers its true value only when it becomes part of the <span style={{ color: T.gold2 }}>architecture of work itself</span>.
                </p>
              </div>
              {/* right: comparison */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: T.rule, border: `1px solid ${T.rule}` }}>
                {cols.map((c, ci) => (
                  <motion.div key={c.h} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: ci * 0.15 }}
                    style={{ background: c.gold ? "rgba(196,152,72,0.08)" : T.ink, padding: "26px 22px" }}>
                    <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: ".16em", textTransform: "uppercase", color: c.gold ? T.gold2 : T.mid, marginBottom: 8 }}>{c.s}</div>
                    <div style={{ fontFamily: "var(--f-display)", fontSize: "clamp(24px,2.8vw,36px)", letterSpacing: ".02em", color: c.gold ? T.gold2 : T.white, marginBottom: 16 }}>{c.h}</div>
                    {c.items.map((it) => (
                      <div key={it} style={{ display: "flex", gap: 10, fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 12.5, color: c.gold ? T.white : "rgba(247,246,243,0.72)", padding: "9px 0", borderTop: `1px solid ${T.rule}` }}>
                        <span style={{ color: T.gold2 }}>—</span>{it}
                      </div>
                    ))}
                  </motion.div>
                ))}
              </div>
            </div>
            {/* bottom */}
            <div style={{ textAlign: "center", padding: "36px 0 6px" }}>
              <div style={{ fontFamily: "var(--f-serif)", fontSize: "clamp(18px,2.2vw,28px)", color: T.white }}>AI should not be added to work —</div>
              <div style={{ fontFamily: "var(--f-serif)", fontStyle: "italic", fontSize: "clamp(18px,2.2vw,28px)", color: T.gold2, marginTop: 2 }}>work should be redesigned around AI.</div>
              <div style={{ marginTop: 22, color: T.gold2, fontSize: 22 }} aria-hidden>⌄</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
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
  return (
    <section id="frame-08" style={{ background: LT.bg, color: LT.ink, padding: "clamp(44px,6vh,72px) clamp(20px,4vw,52px)", borderBottom: `1px solid ${LT.line}` }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", display: "grid", gridTemplateColumns: "clamp(104px,9vw,124px) 1fr", gap: "clamp(14px,3vw,36px)" }}>
        {/* rail */}
        <div style={{ borderRight: `1px solid ${LT.line}`, paddingRight: 8 }}>
          <div style={{ fontFamily: "var(--f-display)", fontSize: 34, color: LT.gold, lineHeight: 1 }}>08</div>
          <div style={{ width: 20, height: 1, background: LT.gold, margin: "10px 0 14px" }} />
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 8.5, letterSpacing: ".1em", textTransform: "uppercase", color: LT.mid, lineHeight: 1.9, paddingRight: 6 }}>The Universal Work Architecture</div>
        </div>
        {/* main */}
        <div style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 860 }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(300px,42%) 1fr", gap: "clamp(24px,4vw,56px)", alignItems: "center" }}>
              {/* left */}
              <div>
                <motion.h2 {...rise} transition={{ duration: 0.6 }} style={{ fontFamily: "var(--f-serif)", fontWeight: 500, fontSize: "clamp(32px,3.6vw,54px)", lineHeight: 1.05, color: LT.ink }}>
                  Before work can be redesigned,<br /><span style={{ color: LT.gold }}>it must first be defined.</span>
                </motion.h2>
                <div style={{ width: 40, height: 2, background: LT.gold, margin: "22px 0 16px" }} />
                <p style={{ fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 14.5, lineHeight: 1.85, color: LT.mid, maxWidth: 400 }}>
                  Every engineering discipline begins with a universal architecture. Buildings have blueprints. Software has architecture. Manufacturing has process design. <span style={{ color: LT.gold }}>Work never had one</span> — so organisations tried to transform work without first defining it. Without a common architecture, work cannot be understood, measured, or systematically redesigned.
                </p>
              </div>
              {/* right: disciplines → their architecture */}
              <div style={{ display: "flex", flexDirection: "column", gap: 1, background: LT.line, border: `1px solid ${LT.line}` }}>
                {DISCIPLINES.map(([d, b], i) => {
                  const last = i === DISCIPLINES.length - 1;
                  return (
                    <motion.div key={d} initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.12 }}
                      style={{ background: last ? "rgba(160,120,48,0.09)" : LT.bg, padding: "18px 22px", display: "grid", gridTemplateColumns: "120px 18px 1fr", gap: 12, alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: last ? LT.gold : LT.mid }}>{d}</span>
                      <span style={{ color: LT.gold, fontSize: 13 }}>→</span>
                      <span style={{ fontFamily: "var(--f-display)", fontSize: last ? "clamp(22px,2.4vw,30px)" : "clamp(18px,2vw,24px)", letterSpacing: ".02em", color: last ? LT.gold : LT.ink, lineHeight: 1.05 }}>{b}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
            {/* outcomes */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: LT.line, border: `1px solid ${LT.line}`, marginTop: 28 }} className="ael-4col">
              {UWA_OUTCOMES.map((o) => (
                <div key={o} style={{ background: LT.bg, padding: "16px 18px", display: "flex", gap: 10, alignItems: "center", fontFamily: "var(--f-sans)", fontSize: 12.5, color: LT.ink2 }}>
                  <span style={{ color: LT.gold }}>✓</span>{o}
                </div>
              ))}
            </div>
            {/* bottom */}
            <div style={{ textAlign: "center", padding: "36px 0 6px" }}>
              <div style={{ fontFamily: "var(--f-serif)", fontSize: "clamp(18px,2.2vw,28px)", color: LT.ink }}>Before organisations can redesign work —</div>
              <div style={{ fontFamily: "var(--f-serif)", fontStyle: "italic", fontSize: "clamp(18px,2.2vw,28px)", color: LT.gold, marginTop: 2 }}>they must first learn how to describe it.</div>
              <div style={{ marginTop: 22, color: LT.gold, fontSize: 22 }} aria-hidden>⌄</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════ FRAME 09 — THE AI TRANSFORMATION ARCHITECTURE (cream) ══════════ */
const FLOW = ["Universal Work Architecture™", "Analyse Work", "Redesign Work", "Allocate Work", "Human + AI Operating Model", "Enterprise Value"];
function Frame09() {
  const last = FLOW.length - 1;
  return (
    <section id="frame-09" style={{ background: T.ink, color: T.white, padding: "clamp(44px,6vh,72px) clamp(20px,4vw,52px)", borderBottom: `1px solid ${T.rule}` }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", display: "grid", gridTemplateColumns: "clamp(104px,9vw,124px) 1fr", gap: "clamp(14px,3vw,36px)" }}>
        {/* rail */}
        <div style={{ borderRight: `1px solid ${T.rule}`, paddingRight: 8 }}>
          <div style={{ fontFamily: "var(--f-display)", fontSize: 34, color: T.gold2, lineHeight: 1 }}>09</div>
          <div style={{ width: 20, height: 1, background: T.gold2, margin: "10px 0 14px" }} />
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 8.5, letterSpacing: ".1em", textTransform: "uppercase", color: T.mid, lineHeight: 1.9, paddingRight: 6 }}>The AI Transformation Architecture</div>
        </div>
        {/* main */}
        <div style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 820 }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(300px,44%) 1fr", gap: "clamp(24px,4vw,56px)", alignItems: "center" }}>
              <div>
                <motion.h2 {...rise} transition={{ duration: 0.6 }} style={{ fontFamily: "var(--f-serif)", fontWeight: 500, fontSize: "clamp(34px,3.8vw,56px)", lineHeight: 1.04, color: T.white }}>
                  Redesigning work<br /><span style={{ color: T.gold2 }}>is not about AI.</span>
                </motion.h2>
                <div style={{ width: 40, height: 2, background: T.gold2, margin: "22px 0 16px" }} />
                <p style={{ fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 15, lineHeight: 1.85, color: T.mid, maxWidth: 400 }}>
                  Once work is described through the Universal Work Architecture™, it can be systematically redesigned — every activity, decision, workflow and role. The objective: <span style={{ color: T.gold2 }}>assign every part of work to the performer best equipped to create value</span>. Not Human versus AI, but one integrated enterprise system.
                </p>
              </div>
              {/* vertical flow */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {FLOW.map((f, i) => {
                  const isLast = i === last;
                  return (
                    <motion.div key={f} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }} style={{ width: "100%", maxWidth: 380, textAlign: "center" }}>
                      <div style={{ border: `1px solid ${isLast ? T.gold2 : T.rule}`, background: isLast ? "rgba(196,152,72,0.08)" : T.ink, padding: "15px 18px", fontFamily: "var(--f-display)", fontSize: isLast ? "clamp(24px,2.6vw,32px)" : "clamp(17px,2vw,22px)", letterSpacing: ".02em", color: isLast ? T.gold2 : "rgba(247,246,243,0.72)" }}>{f}</div>
                      {!isLast && <div style={{ color: T.gold2, fontSize: 16, lineHeight: 1, padding: "6px 0" }}>↓</div>}
                    </motion.div>
                  );
                })}
              </div>
            </div>
            {/* bottom */}
            <div style={{ textAlign: "center", padding: "36px 0 6px" }}>
              <div style={{ fontFamily: "var(--f-serif)", fontSize: "clamp(18px,2.2vw,28px)", color: T.white }}>AI transformation is not the implementation of AI &mdash;</div>
              <div style={{ fontFamily: "var(--f-serif)", fontStyle: "italic", fontSize: "clamp(18px,2.2vw,28px)", color: T.gold2, marginTop: 2 }}>it is the redesign of work.</div>
              <div style={{ marginTop: 22, color: T.gold2, fontSize: 22 }} aria-hidden>⌄</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════ FRAME 10 — HUMAN–AI ORCHESTRATION ══════════ */
function Frame10() {
  const cols = [
    { h: "Human Anchored", s: "The side that governs", items: ["Problem Framing", "Strategic Thinking", "Judgment", "Ownership", "AI Validation"], gold: true },
    { h: "AI Leveraged", s: "The side that accelerates", items: ["Analysis", "Pattern Recognition", "Content Generation", "Simulation", "Optimisation & Execution"], gold: false },
  ];
  return (
    <section id="frame-10" style={{ background: LT.bg, color: LT.ink, padding: "clamp(44px,6vh,72px) clamp(20px,4vw,52px)", borderBottom: `1px solid ${LT.line}` }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", display: "grid", gridTemplateColumns: "clamp(104px,9vw,124px) 1fr", gap: "clamp(14px,3vw,36px)" }}>
        {/* rail */}
        <div style={{ borderRight: `1px solid ${LT.line}`, paddingRight: 8 }}>
          <div style={{ fontFamily: "var(--f-display)", fontSize: 34, color: LT.gold, lineHeight: 1 }}>10</div>
          <div style={{ width: 20, height: 1, background: LT.gold, margin: "10px 0 14px" }} />
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 8.5, letterSpacing: ".1em", textTransform: "uppercase", color: LT.mid, lineHeight: 1.9, paddingRight: 6 }}>Human–AI Orchestration</div>
        </div>
        {/* main */}
        <div style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 820 }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(280px,40%) 1fr", gap: "clamp(24px,4vw,56px)", alignItems: "center" }}>
              {/* left */}
              <div>
                <motion.h2 {...rise} transition={{ duration: 0.6 }} style={{ fontFamily: "var(--f-serif)", fontWeight: 500, fontSize: "clamp(32px,3.6vw,54px)", lineHeight: 1.05, color: LT.ink }}>
                  AI should amplify value,<br /><span style={{ color: LT.gold }}>not replace accountability.</span>
                </motion.h2>
                <div style={{ width: 40, height: 2, background: LT.gold, margin: "22px 0 16px" }} />
                <p style={{ fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 14.5, lineHeight: 1.85, color: LT.mid, maxWidth: 380 }}>
                  The objective of AI is not to maximise automation — it is to maximise enterprise value. AI is responsible for <span style={{ color: LT.gold }}>capability</span>; humans remain responsible for <span style={{ color: LT.gold }}>accountability</span>. Capability can be delegated. Judgment cannot.
                </p>
              </div>
              {/* right: human anchored vs ai leveraged */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: LT.line, border: `1px solid ${LT.line}` }}>
                {cols.map((c, ci) => (
                  <motion.div key={c.h} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: ci * 0.15 }}
                    style={{ background: c.gold ? "rgba(160,120,48,0.09)" : LT.bg, padding: "26px 22px" }}>
                    <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: c.gold ? LT.gold : LT.mid, marginBottom: 6 }}>{c.s}</div>
                    <div style={{ fontFamily: "var(--f-display)", fontSize: "clamp(22px,2.6vw,30px)", color: c.gold ? LT.gold : LT.ink, marginBottom: 16 }}>{c.h}</div>
                    {c.items.map((it) => (
                      <div key={it} style={{ fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 12.5, color: LT.ink2, padding: "9px 0", borderTop: `1px solid ${LT.line}`, display: "flex", gap: 8 }}>
                        <span style={{ color: LT.gold }}>{c.gold ? "▲" : "▸"}</span>{it}
                      </div>
                    ))}
                  </motion.div>
                ))}
              </div>
            </div>
            {/* bottom */}
            <div style={{ textAlign: "center", padding: "36px 0 6px" }}>
              <div style={{ fontFamily: "var(--f-serif)", fontSize: "clamp(18px,2.2vw,28px)", color: LT.ink }}>AI should enhance human impact —</div>
              <div style={{ fontFamily: "var(--f-serif)", fontStyle: "italic", fontSize: "clamp(18px,2.2vw,28px)", color: LT.gold, marginTop: 2 }}>humans should govern AI impact.</div>
              <div style={{ marginTop: 22, color: LT.gold, fontSize: 22 }} aria-hidden>⌄</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════ FRAME 11 — AI READINESS ══════════ */
const ACTORS = [
  { a: "Employee", d: "Augmented capability and impact." },
  { a: "Leader", d: "Better decisions, greater leverage." },
  { a: "Organisation", d: "Adaptive, resilient, future-ready." },
  { a: "AI", d: "Reliable, aligned, improving." },
];
function Frame11() {
  return (
    <section id="frame-11" style={{ background: T.ink, color: T.white, padding: "clamp(44px,6vh,72px) clamp(20px,4vw,52px)", borderBottom: `1px solid ${T.rule}` }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", display: "grid", gridTemplateColumns: "clamp(104px,9vw,124px) 1fr", gap: "clamp(14px,3vw,36px)" }}>
        {/* rail */}
        <div style={{ borderRight: `1px solid ${T.rule}`, paddingRight: 8 }}>
          <div style={{ fontFamily: "var(--f-display)", fontSize: 34, color: T.gold2, lineHeight: 1 }}>11</div>
          <div style={{ width: 20, height: 1, background: T.gold2, margin: "10px 0 14px" }} />
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 8.5, letterSpacing: ".1em", textTransform: "uppercase", color: T.mid, lineHeight: 1.9, paddingRight: 6 }}>AI Readiness</div>
        </div>
        {/* main */}
        <div style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 820 }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(280px,40%) 1fr", gap: "clamp(24px,4vw,56px)", alignItems: "center" }}>
              {/* left */}
              <div>
                <motion.h2 {...rise} transition={{ duration: 0.6 }} style={{ fontFamily: "var(--f-serif)", fontWeight: 500, fontSize: "clamp(32px,3.6vw,54px)", lineHeight: 1.05, color: T.white }}>
                  AI capability can be purchased.<br /><span style={{ color: T.gold2 }}>AI readiness must be built.</span>
                </motion.h2>
                <div style={{ width: 40, height: 2, background: T.gold2, margin: "22px 0 16px" }} />
                <p style={{ fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 15, lineHeight: 1.85, color: T.mid, maxWidth: 380 }}>
                  Transformation does not begin with technology — it begins with readiness, across <span style={{ color: T.gold2 }}>four actors</span>. A weakness in any one limits the value created by the whole. It succeeds only when all four evolve together.
                </p>
              </div>
              {/* right: four actors */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: T.rule, border: `1px solid ${T.rule}` }}>
                {ACTORS.map((x, i) => (
                  <motion.div key={x.a} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.1 }}
                    style={{ background: T.ink, padding: "24px 22px", minHeight: 150, display: "flex", flexDirection: "column" }}>
                    <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: ".16em", color: T.gold2, marginBottom: 14 }}>0{i + 1}</div>
                    <div style={{ fontFamily: "var(--f-display)", fontSize: "clamp(22px,2.6vw,32px)", letterSpacing: ".02em", color: T.white }}>{x.a}</div>
                    <div style={{ fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 12.5, color: T.mid, marginTop: "auto", lineHeight: 1.6 }}>{x.d}</div>
                  </motion.div>
                ))}
              </div>
            </div>
            {/* bottom */}
            <div style={{ textAlign: "center", padding: "36px 0 6px" }}>
              <div style={{ fontFamily: "var(--f-serif)", fontSize: "clamp(18px,2.2vw,28px)", color: T.white }}>A weakness in any one actor —</div>
              <div style={{ fontFamily: "var(--f-serif)", fontStyle: "italic", fontSize: "clamp(18px,2.2vw,28px)", color: T.gold2, marginTop: 2 }}>limits the value of the entire system.</div>
              <div style={{ marginTop: 22, color: T.gold2, fontSize: 22 }} aria-hidden>⌄</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════ FRAME 12 — EVOLUTION JOURNEY ══════════ */
const PATHWAYS = [
  { a: "Employee", steps: ["Learn", "Adapt", "Augment", "Lead"] },
  { a: "Leader", steps: ["Direct", "Orchestrate", "Transform", "Scale"] },
  { a: "Organisation", steps: ["Adopt", "Assimilate", "Integrate", "Evolve"] },
  { a: "AI", steps: ["Deploy", "Embed", "Collaborate", "Optimise"] },
];
function Frame12() {
  return (
    <section id="frame-12" style={{ background: LT.bg, color: LT.ink, padding: "clamp(44px,6vh,72px) clamp(20px,4vw,52px)", borderBottom: `1px solid ${LT.line}` }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", display: "grid", gridTemplateColumns: "clamp(104px,9vw,124px) 1fr", gap: "clamp(14px,3vw,36px)" }}>
        {/* rail */}
        <div style={{ borderRight: `1px solid ${LT.line}`, paddingRight: 8 }}>
          <div style={{ fontFamily: "var(--f-display)", fontSize: 34, color: LT.gold, lineHeight: 1 }}>12</div>
          <div style={{ width: 20, height: 1, background: LT.gold, margin: "10px 0 14px" }} />
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 8.5, letterSpacing: ".1em", textTransform: "uppercase", color: LT.mid, lineHeight: 1.9, paddingRight: 6 }}>The AI Edge Lab Evolution Journey</div>
        </div>
        {/* main */}
        <div style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 900 }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(280px,38%) 1fr", gap: "clamp(24px,4vw,56px)", alignItems: "center" }}>
              {/* left */}
              <div>
                <motion.h2 {...rise} transition={{ duration: 0.6 }} style={{ fontFamily: "var(--f-serif)", fontWeight: 500, fontSize: "clamp(32px,3.6vw,54px)", lineHeight: 1.05, color: LT.ink }}>
                  Every organisation wants to evolve.<br /><span style={{ color: LT.gold }}>Very few know how.</span>
                </motion.h2>
                <div style={{ width: 40, height: 2, background: LT.gold, margin: "22px 0 16px" }} />
                <p style={{ fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 14.5, lineHeight: 1.85, color: LT.mid, maxWidth: 380 }}>
                  AI transformation is not a single initiative — it is a coordinated evolution of every workplace actor. Each follows its own pathway, aligned to the same vision. Value compounds only when <span style={{ color: LT.gold }}>every actor progresses together</span>.
                </p>
              </div>
              {/* right: pathways */}
              <div style={{ display: "flex", flexDirection: "column", gap: 1, background: LT.line, border: `1px solid ${LT.line}` }}>
                {PATHWAYS.map((p, i) => (
                  <motion.div key={p.a} initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.1 }}
                    style={{ background: LT.bg, padding: "18px 22px", display: "grid", gridTemplateColumns: "118px 1fr", gap: 16, alignItems: "center" }}>
                    <div style={{ fontFamily: "var(--f-display)", fontSize: "clamp(20px,2.2vw,28px)", letterSpacing: ".02em", color: LT.gold }}>{p.a}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                      {p.steps.map((s, j) => (
                        <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, letterSpacing: ".07em", textTransform: "uppercase", color: j === p.steps.length - 1 ? LT.gold : LT.ink2 }}>{s}</span>
                          {j < p.steps.length - 1 && <span style={{ color: LT.gold, fontSize: 12 }}>→</span>}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            {/* bottom */}
            <div style={{ textAlign: "center", padding: "36px 0 6px" }}>
              <div style={{ fontFamily: "var(--f-serif)", fontSize: "clamp(18px,2.2vw,28px)", color: LT.ink }}>Transformation succeeds when every actor evolves together —</div>
              <div style={{ fontFamily: "var(--f-serif)", fontStyle: "italic", fontSize: "clamp(18px,2.2vw,28px)", color: LT.gold, marginTop: 2 }}>not independently.</div>
              <div style={{ marginTop: 22, color: LT.gold, fontSize: 22 }} aria-hidden>⌄</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════ FRAME 13 — MEASURE YOUR AI EDGE ══════════ */
const INSTRUMENTS = [
  { tag: "Aspiring", code: "AAI™", name: "AI Alignment Index", desc: "For those entering the workforce. Where your foundations stay relevant as AI absorbs executional work." },
  { tag: "Working", code: "ARI™", name: "AI Replaceability Index", desc: "For working professionals. Your structural position across the four E.D.G.E. dimensions." },
  { tag: "Leaders", code: "BDI™", name: "Business Leaders Index", desc: "For leaders. Measure leadership in the AI era and where your edge holds." },
  { tag: "Organisation", code: "ORG AI DARS™", name: "Organisation AI DARS", desc: "Assess and benchmark your organisation's readiness to operate with AI." },
];
function Frame13() {
  return (
    <section id="frame-13" style={{ background: T.ink, color: T.white, padding: "clamp(44px,6vh,72px) clamp(20px,4vw,52px)", borderBottom: `1px solid ${T.rule}` }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", display: "grid", gridTemplateColumns: "clamp(104px,9vw,124px) 1fr", gap: "clamp(14px,3vw,36px)" }}>
        {/* rail */}
        <div style={{ borderRight: `1px solid ${T.rule}`, paddingRight: 8 }}>
          <div style={{ fontFamily: "var(--f-display)", fontSize: 34, color: T.gold2, lineHeight: 1 }}>13</div>
          <div style={{ width: 20, height: 1, background: T.gold2, margin: "10px 0 14px" }} />
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 8.5, letterSpacing: ".1em", textTransform: "uppercase", color: T.mid, lineHeight: 1.9, paddingRight: 6 }}>Measure Your AI Edge</div>
        </div>
        {/* main */}
        <div style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 860 }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(260px,34%) 1fr", gap: "clamp(24px,4vw,56px)", alignItems: "center" }}>
              {/* left */}
              <div>
                <motion.h2 {...rise} transition={{ duration: 0.6 }} style={{ fontFamily: "var(--f-serif)", fontWeight: 500, fontSize: "clamp(32px,3.6vw,54px)", lineHeight: 1.05, color: T.white }}>
                  Evidence-based assessments.<br /><span style={{ color: T.gold2 }}>Built for every actor.</span>
                </motion.h2>
                <div style={{ width: 40, height: 2, background: T.gold2, margin: "22px 0 16px" }} />
                <p style={{ fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 15, lineHeight: 1.85, color: T.mid, maxWidth: 340, marginBottom: 26 }}>
                  Every organisation begins at a different point — some need clarity, some readiness, some redesign. One evidence-based instrument for every actor in the system, from the individual to the enterprise.
                </p>
                <Link href="/connect" style={{ display: "inline-block", fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", background: T.gold2, color: T.ink, padding: "15px 26px", fontWeight: 500 }}>Start Your Assessment →</Link>
              </div>
              {/* right: instruments */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: T.rule, border: `1px solid ${T.rule}` }}>
                {INSTRUMENTS.map((x, i) => (
                  <motion.div key={x.code} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.1 }}
                    style={{ background: T.ink, padding: "24px 22px", minHeight: 210, display: "flex", flexDirection: "column" }}>
                    <div style={{ fontFamily: "var(--f-mono)", fontSize: 8, letterSpacing: ".16em", textTransform: "uppercase", color: T.mid, marginBottom: 12 }}>{x.tag}</div>
                    <div style={{ fontFamily: "var(--f-display)", fontSize: "clamp(22px,2.4vw,28px)", color: T.gold2 }}>{x.code}</div>
                    <div style={{ fontFamily: "var(--f-display)", fontSize: 16, letterSpacing: ".02em", color: T.white, marginBottom: 10 }}>{x.name}</div>
                    <div style={{ fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 12, color: T.mid, lineHeight: 1.6, marginBottom: 14 }}>{x.desc}</div>
                    <Link href="/connect" style={{ fontFamily: "var(--f-mono)", fontSize: 8, letterSpacing: ".16em", textTransform: "uppercase", color: T.gold2, marginTop: "auto" }}>Start →</Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════ CLOSING ══════════ */
function Closing() {
  return (
    <section id="closing" style={{ background: LT.bg, color: LT.ink, padding: "clamp(80px,14vh,140px) clamp(24px,5vw,72px)", textAlign: "center", borderBottom: `1px solid ${LT.line}` }}>
      <motion.div {...rise} transition={{ duration: 0.7 }} style={{ maxWidth: 1000, margin: "0 auto" }}>
        <span style={{ ...kicker, color: LT.gold }}>Find My AI Edge</span>
        <h2 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(44px,7vw,96px)", lineHeight: 0.95, letterSpacing: ".01em", margin: "24px 0 20px", color: LT.ink }}>
          THE FUTURE OF WORK WILL BE ARCHITECTED.<br /><span style={{ color: LT.gold }}>NOT ACCIDENTAL.</span>
        </h2>
        <p style={{ fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 15, color: LT.mid, maxWidth: 620, margin: "0 auto 36px", lineHeight: 1.8 }}>
          The question is not if you will transform. The question is how intentionally.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/connect" style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", background: LT.gold, color: "#FBFAF6", padding: "16px 30px" }}>Find My AI Edge →</Link>
          <Link href="#frame-05" style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", border: `1px solid ${LT.line}`, color: LT.ink, padding: "16px 30px" }}>Explore the Research →</Link>
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
    <div className={`${bebas.variable} ${dmSans.variable} ${dmMono.variable} ${cormorant.variable}`} style={{ background: T.ink, fontFamily: "var(--f-sans)" }}>
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
