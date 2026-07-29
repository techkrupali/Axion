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
        {/* hero photo — drop the 4-silhouette image at public/ai-edge-hero.png to match the design */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/ai-edge-hero.png')", backgroundSize: "cover", backgroundPosition: "center right", backgroundRepeat: "no-repeat" }} />
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
                      <stop offset="65%" stopColor="#A07830" />
                      <stop offset="100%" stopColor="#C49848" />
                    </linearGradient>
                  </defs>
                  <motion.path d="M0,84 C10,78 20,76 25,72 C40,64 45,62 50,60 C58,55 60,50 62,46 C74,36 80,32 87,22 C94,14 98,11 100,8"
                    fill="none" stroke="url(#ev-line)" strokeWidth="2" vectorEffect="non-scaling-stroke"
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
                      <motion.div initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.6 + i * 0.2 }}
                        style={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)", width: e.gold ? 16 : 9, height: e.gold ? 16 : 9, borderRadius: "50%", background: LT.gold, boxShadow: e.gold ? "0 0 0 5px rgba(160,120,48,0.18)" : "none" }} />
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
            <div style={{ display: "grid", gridTemplateColumns: "minmax(260px,30%) 1fr", gap: "clamp(20px,3vw,44px)", alignItems: "center" }}>
              <div>
                <motion.h2 {...rise} transition={{ duration: 0.6 }} style={{ fontFamily: "var(--f-serif)", fontWeight: 500, fontSize: "clamp(40px,4.4vw,64px)", lineHeight: 1.04, color: T.white }}>
                  For the first time,<br /><span style={{ color: T.gold2 }}>work has a choice.</span>
                </motion.h2>
                <div style={{ width: 40, height: 2, background: T.gold, margin: "22px 0 16px" }} />
                <p style={{ fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 16.5, lineHeight: 1.8, color: "rgba(247,246,243,0.62)", maxWidth: 340 }}>
                  Every technology before AI amplified human work. AI can now perform parts of it. For every activity — <span style={{ color: T.gold2 }}>who should perform the work?</span>
                </p>
              </div>
              {/* workflow — each stage cycles its performer */}
              <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
                {STAGES.map((s, i) => {
                  const active = PERFORMERS[(tick + i) % PERFORMERS.length];
                  return (
                    <Fragment key={s}>
                      <div style={{ flex: 1, minWidth: 118 }}>
                        <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: T.dim, marginBottom: 12, minHeight: 26, lineHeight: 1.3 }}>{s}</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {PERFORMERS.map((p) => {
                            const on = p === active;
                            return <span key={p} style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: ".05em", textTransform: "uppercase", textAlign: "center", padding: "8px 4px", border: `1px solid ${on ? T.gold2 : T.rule}`, color: on ? T.ink : T.dim, background: on ? T.gold2 : "transparent", transition: "all .35s ease", whiteSpace: "nowrap" }}>{p}</span>;
                          })}
                        </div>
                      </div>
                      {i < STAGES.length - 1 && <div style={{ display: "flex", alignItems: "flex-start", color: T.gold, padding: "26px 5px 0", fontSize: 13 }}>→</div>}
                    </Fragment>
                  );
                })}
              </div>
            </div>
            {/* bottom */}
            <div style={{ textAlign: "center", padding: "36px 0 6px" }}>
              <div style={{ fontFamily: "var(--f-serif)", fontSize: "clamp(18px,2.2vw,28px)", color: T.white }}>The future won&rsquo;t belong to organisations with more AI &mdash;</div>
              <div style={{ fontFamily: "var(--f-serif)", fontSize: "clamp(18px,2.2vw,28px)", color: T.gold2, marginTop: 2 }}>but to those who decide where AI should work.</div>
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
    <g stroke={T.gold2} strokeWidth={1.2} fill="none" strokeLinecap="round" strokeLinejoin="round">
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
  const rowY = [135, 178, 221, 264];
  const ends = [78, 150, 215, 300];
  const goldRow = [true, true, false, false];
  return (
    <svg viewBox="0 0 640 340" width="100%" style={{ display: "block" }} aria-hidden>
      {/* top labels */}
      <text x="290" y="16" textAnchor="middle" style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: "0.14em", fill: "rgba(247,246,243,0.55)" }}>SAME INVESTMENT. SAME JOURNEY.</text>
      <text x="560" y="16" textAnchor="middle" style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: "0.14em", fill: T.gold2 }}>DIFFERENT OUTCOMES.</text>
      {/* stage icons + labels + column guides */}
      {stageX.map((x, i) => (
        <g key={i}>
          <line x1={x} y1="72" x2={x} y2="130" stroke={T.rule} strokeWidth="1" />
          <circle cx={x} cy="50" r="20" fill="none" stroke={T.gold} strokeWidth="1" opacity="0.85" />
          <StageIcon i={i} cx={x} cy={50} />
          <text x={x} y="92" textAnchor="middle" style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: "0.08em", fill: T.dim }}>{OG_STAGES[i]}</text>
        </g>
      ))}
      {/* fan-in from origin */}
      {rowY.map((y, r) => (
        <motion.path key={"in" + r} d={`M36,200 C80,200 90,${y} 120,${y}`} fill="none" stroke={T.gold} strokeWidth="1.2" strokeOpacity="0.6"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} />
      ))}
      {/* horizontal rails */}
      {rowY.map((y, r) => (
        <line key={"h" + r} x1="120" y1={y} x2="460" y2={y} stroke={T.gold} strokeWidth="1.2" strokeOpacity="0.55" />
      ))}
      {/* fan-out diverging */}
      {rowY.map((y, r) => (
        <motion.path key={"out" + r} d={`M460,${y} C540,${y} 560,${ends[r]} 632,${ends[r]}`} fill="none"
          stroke={goldRow[r] ? T.gold2 : "#8C887E"} strokeWidth={goldRow[r] ? 1.6 : 1} strokeOpacity={goldRow[r] ? (r === 0 ? 0.95 : 0.7) : 0.4}
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.6 }} />
      ))}
      {/* particle spray hints */}
      {[[600, 66], [615, 60], [625, 55], [590, 74], [608, 90], [618, 138]].map(([px, py], k) => (
        <circle key={"pg" + k} cx={px} cy={py} r={1.6} fill={T.gold2} opacity={0.8 - k * 0.08} />
      ))}
      {[[600, 300], [615, 306], [590, 292], [608, 312]].map(([px, py], k) => (
        <circle key={"pgr" + k} cx={px} cy={py} r={1.4} fill="#8C887E" opacity={0.35} />
      ))}
      {/* origin */}
      <circle cx="36" cy="200" r="6" fill={T.gold2} />
      <circle cx="36" cy="200" r="11" fill="none" stroke={T.gold2} strokeWidth="1" opacity="0.4" />
      {/* grid dots */}
      {rowY.map((y, r) => stageX.map((x, c) => (
        <motion.circle key={`d${r}-${c}`} cx={x} cy={y} r="4.5" fill={T.gold2}
          initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: 0.3 + c * 0.06 }} />
      )))}
    </svg>
  );
}
function Frame04() {
  return (
    <section id="frame-04" style={{ background: T.ink, color: T.white, padding: "clamp(44px,6vh,72px) clamp(20px,4vw,52px)", borderBottom: `1px solid ${T.rule}` }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", display: "grid", gridTemplateColumns: "clamp(104px,9vw,124px) 1fr", gap: "clamp(14px,3vw,36px)" }}>
        {/* rail */}
        <div style={{ borderRight: `1px solid ${T.rule}`, paddingRight: 8 }}>
          <div style={{ fontFamily: "var(--f-display)", fontSize: 34, color: T.gold, lineHeight: 1 }}>04</div>
          <div style={{ width: 20, height: 1, background: T.gold, margin: "10px 0 14px" }} />
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 8.5, letterSpacing: ".1em", textTransform: "uppercase", color: T.mid, lineHeight: 1.9, paddingRight: 6 }}>The Outcome Gap</div>
        </div>
        {/* main */}
        <div style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 960 }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(200px,22%) 1fr minmax(180px,20%)", gap: "clamp(20px,3vw,44px)", alignItems: "center" }}>
              {/* text */}
              <div>
                <motion.h2 {...rise} transition={{ duration: 0.6 }} style={{ fontFamily: "var(--f-serif)", fontWeight: 500, fontSize: "clamp(30px,3.2vw,44px)", lineHeight: 1.06, color: T.white }}>
                  Same start.<br />Same investment.<br /><span style={{ color: T.gold2 }}>Different outcomes.</span>
                </motion.h2>
                <div style={{ width: 40, height: 2, background: T.gold, margin: "20px 0 14px" }} />
                <p style={{ fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 13.5, lineHeight: 1.8, color: "rgba(247,246,243,0.6)", maxWidth: 220 }}>Every visible signal looks similar. Yet outcomes are radically different.</p>
              </div>
              {/* diagram */}
              <div><OutcomeDiagram /></div>
              {/* org bars */}
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {OG_ORGS.map((o, oi) => (
                  <motion.div key={o.name} initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 + oi * 0.15 }}>
                    <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: o.gold ? T.gold2 : T.white }}>{o.name}</div>
                    <div style={{ fontFamily: "var(--f-sans)", fontWeight: 300, fontSize: 12, color: T.dim, margin: "4px 0 10px" }}>{o.tag}</div>
                    <div style={{ display: "flex", gap: 3 }}>
                      {Array.from({ length: 10 }).map((_, b) => {
                        const on = b < o.filled;
                        return <span key={b} style={{ flex: 1, height: 18, background: on ? (o.gold ? T.gold2 : "#6E6B63") : "transparent", border: on ? "none" : `1px solid ${T.rule}` }} />;
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            {/* bottom */}
            <div style={{ textAlign: "center", padding: "36px 0 6px" }}>
              <div style={{ fontFamily: "var(--f-serif)", fontSize: "clamp(20px,2.4vw,30px)", color: T.white }}>If every organisation starts from the same place,</div>
              <div style={{ fontFamily: "var(--f-serif)", fontSize: "clamp(20px,2.4vw,30px)", color: T.gold2, marginTop: 2 }}>what determines who creates advantage?</div>
              <div style={{ marginTop: 22, color: T.gold, fontSize: 22 }} aria-hidden>⌄</div>
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
