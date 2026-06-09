"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import DiagnosticModal from "@/components/DiagnosticModal";

/* ─── DESIGN TOKENS — mirror landing page exactly ──────────────────────────── */
const T = {
  white:   "#F7F6F3",
  white2:  "#EEECEA",
  white3:  "#E2E0DC",
  ink:     "#0D0D0B",
  ink2:    "#1A1A18",
  ink3:    "#2E2E2C",
  mid:     "#7A7870",
  dim:     "#B0AEA8",
  gold:    "#A07830",
  gold2:   "#C49848",
  rule:    "rgba(13,13,11,0.10)",
  rule2:   "rgba(13,13,11,0.18)",
  display: "var(--font-cormorant-garamond),'Cormorant Garamond',serif",
  mono:    "var(--font-geist-mono),'JetBrains Mono',ui-monospace,monospace",
};

/* ─── DATA ──────────────────────────────────────────────────────────────────── */

const COMPANIES = [
  { tag: "Institution",   name: "Wipro" },
  { tag: "Banking",       name: "Standard Chartered" },
  { tag: "Banking",       name: "HSBC" },
  { tag: "Group",         name: "Tata" },
  { tag: "Real Estate",   name: "Lodha" },
  { tag: "FMCG",          name: "Marico" },
  { tag: "Startup",       name: "Udaan" },
  { tag: "Gaming & Tech", name: "Gameskraft" },
];

const ORIGINS = [
  {
    num: "I",
    place: "Delhi · Marwari household",
    title: "The Origins",
    body: "Born into a world where the script was laid out early: commerce, CA, business, respectability. Responsibility was absorbed before it was explained.",
    take: "The first operating system is not designed. It is absorbed.",
  },
  {
    num: "II",
    place: "Delhi · 2002",
    title: "The First Collision",
    body: "SRCC represented certainty. Bangalore represented duty. Choosing the harder path became the first proof that accountability can override script.",
    take: "The choices that arrive at the worst time form identity.",
  },
  {
    num: "III",
    place: "Bangalore · 2002–2005",
    title: "The Anonymous Years",
    body: "Bangalore removed inherited validation. Anonymity created a discipline: work without applause, learn without witnesses, build without borrowed identity.",
    take: "Momentum has to be generated before it is recognised.",
  },
  {
    num: "IV",
    place: "Mumbai · TISS",
    title: "The Dual Instinct",
    body: "HR was not a fallback. It was the place where people instinct and business instinct finally became one lens.",
    take: "Solve people problems with a business mind. Solve business problems with a people heart.",
  },
];

const CHAPTERS = [
  { year: "2003–2004", company: "Wipro",            context: "Greenfield manufacturing · Plant HR",          body: "At twenty-three, the work was unglamorous and real: production hiring, training coordination, post-acquisition integration, and voice in a plant where every worker was older.",                                             installed: "Voice Architecture" },
  { year: "2004–2008", company: "Standard Chartered",context: "Captive finance · Data-led HR",               body: "The room changed when evidence entered. The lesson was permanent: argument persuades only after proof earns the right to be heard.",                                                                                      installed: "Evidence before argument" },
  { year: "2008–2009", company: "HSBC",              context: "Reward architecture · Talent redesign",       body: "Constraint forced clarity. Authority was not enough; alignment came from making choices, rules, and consequences legible.",                                                                                              installed: "Clarity before authority" },
  { year: "2009–2019", company: "Tata",              context: "Global HR · M&A · Starbucks India JV",        body: "A decade across scale, integration, culture, and global operating systems. Starbucks India belongs here as a Tata/JV mandate.",                                                                                        installed: "Culture as systems" },
  { year: "2019",      company: "Lodha",             context: "Real estate · Operating context shift",       body: "A short, intense context shift where the plan and reality diverged. It compressed the need to read conditions before applying frameworks.",                                                                            installed: "Context reading" },
  { year: "2019–2021", company: "Marico",            context: "Consumer organisation · Deliberate reset",    body: "A mature, consumer-first organisation where the work was not just building systems, but refining and sustaining them with focus.",                                                                                     installed: "Focus as architecture" },
  { year: "2021–2022", company: "Udaan",             context: "Startup hypergrowth · National scale",        body: "There was no inherited architecture at startup velocity. The work was to design before the organisation knew what it would become.",                                                                                   installed: "Pre-institutional design" },
  { year: "2022–Present", company: "Gameskraft",     context: "Gaming & tech · Crisis-tested scale",         body: "The proof of architecture is the moment it is tested. Crisis revealed which commitments were real because they had been built before the shock arrived.",                                                              installed: "Crisis architecture" },
];

const SYNTHESIS = [
  { source: "From the soil",            quote: "The first operating system is not designed. It is absorbed." },
  { source: "From Wipro",               quote: "Effort without system leverage becomes invisible. Architecture beats activity." },
  { source: "From Standard Chartered",  quote: "Evidence converts where argument fails." },
  { source: "From HSBC",                quote: "Authority rarely creates alignment. Clarity does." },
  { source: "From Tata",                quote: "Culture is what your systems enforce, not what you declare." },
  { source: "From Udaan",               quote: "Design for the organisation you are becoming." },
  { source: "From Gameskraft",          quote: "The proof of architecture is the moment it is tested." },
];

const BEDROCK = [
  { num: "01", k: "The Thesis",    v: "People Systems Fail Before Strategy Does",  sub: "Every strategic failure has a people-system failure upstream of it. The org chart breaks before the plan does." },
  { num: "02", k: "The Framework", v: "Belief → Conviction → Rhythm",             sub: "From what one person holds, to what the whole organisation runs on. Three stages. One arc.",                       isGold: true },
  { num: "03", k: "The Credo",     v: "Humanity Over Hierarchy",                  sub: "Structure serves people. When it stops doing that, the structure is wrong — not the people." },
];

const PATTERNS_THRESHOLD = [
  { num: "01", name: "Operating Rhythm",      hook: "Cadence, memory, ownership, enforcement.",            desc: "The recurring rituals through which work is reviewed, decisions remembered, and standards enforced." },
  { num: "02", name: "Decision Architecture", hook: "One owner. One deadline. One escalation path.",       desc: "How decisions get made, owned, and escalated by design rather than left to volume or seniority." },
  { num: "03", name: "Credibility Stack",     hook: "Evidence before argument.",                           desc: "The sequence by which HR earns strategic authority: proof before persuasion, results before claims." },
  { num: "04", name: "Voice Architecture",    hook: "Dissent before silent failure.",                      desc: "Designed channels through which people can speak — and a system obligated to respond." },
];

const PATTERNS_SIGNATURE = [
  { num: "05", name: "Pre-Institutional Design", hook: "Design before the organisation knows it needs design.", desc: "Building the architecture for the organisation that is coming, not only the one that exists today." },
  { num: "06", name: "Rhythm Matching",           hook: "Cadence fit before commitment.",                       desc: "Reading the operating tempo a role and a person actually run at before the hire is made." },
  { num: "07", name: "Belief Translation",        hook: "Founder conviction into organisational rhythm.",       desc: "Turning what a founder believes into what the organisation reliably does when the founder is not in the room." },
  { num: "08", name: "Crisis Architecture",       hook: "Readiness as design, not improvisation.",              desc: "The commitments and trust built in calm that decide whether the organisation survives the shock." },
];

const NOTES = [
  { no: "F·01", title: "Should AI Replace Empathy?",  body: "Hiring is not a process problem. It is a judgment architecture problem.",          status: "Publishing through 2026" },
  { no: "01",   title: "HR in Start-Ups",             body: "Startup physics is not slower institutional physics. It is a different machine.",  status: "Read →" },
  { no: "02",   title: "The Art of Being Relevant",   body: "HR earns the seat when the business cannot decide without it.",                    status: "Read →" },
];

const VISION_CARDS = [
  { n: "01 · Lived",   title: "The Practice",   desc: "Twenty-three years of collisions — the evidence that became raw material." },
  { n: "02 · Written", title: "The Philosophy", desc: "Books and essays codifying the patterns into a body of work." },
  { n: "03 · Applied", title: "The Loop",       desc: "Axion Index and HROS applying the doctrine into operating systems and advisory work." },
];

/* ─── SCROLL REVEAL ─────────────────────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── SECTION LABEL (mirrors landing page "How we do it" / "01 / 05") ───────── */
function SectionHead({ label, index, total }: { label: string; index: number; total?: number }) {
  return (
    <div className="flex items-baseline justify-between mb-14 gap-6">
      <span className="font-mono text-[17px] uppercase" style={{ letterSpacing: "0.24em", color: T.mid }}>{label}</span>
      {total && <span className="font-mono text-[10px]" style={{ letterSpacing: "0.14em", color: T.dim }}>{String(index).padStart(2,"0")} / {String(total).padStart(2,"0")}</span>}
    </div>
  );
}

/* ─── PAGE ──────────────────────────────────────────────────────────────────── */
export default function FounderPage() {
  const [navScrolled,   setNavScrolled]   = useState(false);
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [activeSection, setActiveSection] = useState("story");
  const [diagOpen,      setDiagOpen]      = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = ["story","soil","timeline","synthesis","patterns","writing","vision"];
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }); },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const NAV_LINKS = [
    { href: "#story",    label: "Story" },
    { href: "#soil",     label: "Origins" },
    { href: "#timeline", label: "Roots" },
    { href: "#patterns", label: "Patterns" },
    { href: "#writing",  label: "Field Notes" },
    { href: "#vision",   label: "Vision" },
  ];

  /* ── Root background — cream grid, same as landing ── */
  return (
    <div
      style={{
        background: T.white,
        backgroundImage: "linear-gradient(rgba(13,13,11,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(13,13,11,.045) 1px,transparent 1px)",
        backgroundSize: "52px 52px",
        minHeight: "100vh",
      }}
    >
      <style>{`
        /* ── scoped nav + strip ── */
        .fn-nav {
          position:fixed; top:0; left:0; right:0; height:70px; z-index:900;
          display:flex; align-items:center;
          background:transparent;
          transition:all 0.45s cubic-bezier(0.22,1,0.36,1);
        }
        .fn-nav.s {
          background:rgba(13,13,11,.95); backdrop-filter:blur(18px);
          border-bottom:1px solid rgba(247,246,243,.06);
          height:62px;
        }
        .fn-nav-inner { width:100%; padding:0 32px; display:flex; align-items:center; justify-content:space-between; }
        /* Brand — serif, cream */
        .fn-brand { font-family:var(--font-cormorant-garamond),'Cormorant Garamond',serif; font-size:21px; font-weight:500; color:#F7F6F3; letter-spacing:.04em; text-decoration:none; text-transform:uppercase; display:flex; align-items:baseline; gap:6px; transition:opacity .3s; letter-spacing:.18em; }
        .fn-brand:hover { opacity:.8; }
        /* Center links */
        .fn-nl { display:flex; align-items:center; gap:32px; }
        .fn-nl a { font-family:var(--font-geist-mono),ui-monospace,monospace; font-size:10px; font-weight:500; letter-spacing:.24em; text-transform:uppercase; color:rgba(247,246,243,.55); transition:color .25s; padding:5px 0; position:relative; text-decoration:none; }
        .fn-nl a:hover, .fn-nl a.on { color:rgba(247,246,243,.9); }
        .fn-nl a.on::after { content:""; position:absolute; left:0; right:0; bottom:-2px; height:1px; background:#A07830; }
        /* CTA button — dark solid */
        .fn-btn {
          color:#F7F6F3 !important; background:#0D0D0B !important;
          border:none; padding:10px 22px; font-weight:600 !important;
          font-family:var(--font-geist-mono),ui-monospace,monospace !important;
          font-size:10px !important; letter-spacing:.22em !important;
          text-transform:uppercase !important; white-space:nowrap;
          transition:background .25s !important;
        }
        .fn-btn:hover { background:#A07830 !important; }
        .fn-hamb { display:none; background:none; border:1px solid rgba(247,246,243,.2); color:#F7F6F3; width:42px; height:38px; border-radius:2px; cursor:pointer; align-items:center; justify-content:center; }
        /* Company strip */
        .co-strip { overflow:hidden; white-space:nowrap; -webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent); mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent); }
        .co-track { display:inline-flex; gap:0; animation:co-scroll 30s linear infinite; }
        @keyframes co-scroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .co-track:hover { animation-play-state:paused; }
        /* Pattern / origin card hover */
        .fn-card { transition:border-color .25s, transform .25s, background .25s; }
        .fn-card:hover { border-color:rgba(160,120,48,.45) !important; }
        /* Chapter row hover */
        .ch-row:hover .ch-badge { opacity:1 !important; }
        .ch-row:hover .ch-company { color:#0D0D0B !important; }
        /* Synthesis hover */
        .syn-row:hover .syn-q { color:#0D0D0B !important; }
        /* Reduced motion */
        @media (prefers-reduced-motion:reduce) { *,*::before,*::after { animation-duration:.01ms !important; transition-duration:.01ms !important; } }
        /* Responsive */
        @media (max-width:960px) {
          .fn-nl { position:fixed; inset:62px 0 auto 0; flex-direction:column; gap:0; background:rgba(13,13,11,.97); border-bottom:1px solid rgba(247,246,243,.07); max-height:0; overflow:hidden; transition:max-height .35s; padding:0 32px; }
          .fn-nl.open { max-height:560px; padding:12px 32px 28px; }
          .fn-nl a { padding:14px 0; width:100%; border-bottom:1px solid rgba(247,246,243,.06); font-size:13px; color:rgba(247,246,243,.55) !important; }
          .fn-btn { margin-top:12px; text-align:center; }
          .fn-hamb { display:inline-flex; }
        }
        @media (max-width:768px) {
          .hero-split { grid-template-columns:1fr !important; }
          .origin-grid { grid-template-columns:1fr 1fr !important; }
          .intro-grid  { grid-template-columns:1fr !important; }
          .synth-grid  { grid-template-columns:1fr !important; }
          .notes-grid  { grid-template-columns:1fr !important; }
          .ch-row      { grid-template-columns:1fr !important; gap:8px !important; }
          .ch-badge    { display:none !important; }
        }
        @media (max-width:480px) {
          .origin-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      {/* ══ FIXED NAV ══════════════════════════════════════════════════════════ */}
      <nav className={`fn-nav${navScrolled ? " s" : ""}`} aria-label="Founder page navigation">
        <div className="fn-nav-inner">
          {/* Brand — "AXION INDEX" serif wordmark as in photo */}
          <a className="fn-brand" href="/">
            AX<em style={{ fontStyle:"italic" }}>I</em>ON&nbsp;INDEX
          </a>
          <button className="fn-hamb" aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width:20, height:20 }} aria-hidden="true">
              {mobileOpen
                ? <><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></>
                : <><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></>}
            </svg>
          </button>
          {/* Center nav links */}
          <div className={`fn-nl${mobileOpen ? " open" : ""}`} id="fn-nl">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href}
                className={activeSection === l.href.slice(1) ? "on" : ""}
                onClick={() => setMobileOpen(false)}>{l.label}</a>
            ))}
            {/* Dark CTA button matching photo */}
            <a className="fn-btn" href="/connect" onClick={() => setMobileOpen(false)}>
              Start Conversation
            </a>
          </div>
        </div>
      </nav>

      {/* ══ S1 — HERO ════════════════════════════════════════════════════════════
           Exact match to photo:
           • Full-viewport dark background with subtle architectural texture
           • Portrait (nitishhh.png) anchored left, fades into bg at right
           • Headline stacked: The / Making / of the / [gold italic] Operating / Architect.
           • Kicker top, name + body text below headline
           • Vertical "FOUNDER" text on far right edge
      ═══════════════════════════════════════════════════════════════════════════ */}
      <header
        id="story"
        style={{
          position: "relative",
          minHeight: "100vh",
          background: "#0e0e0c",
          overflow: "hidden",
          display: "flex",
          alignItems: "stretch",
        }}
      >
        {/* ── Dark architectural texture overlay ── */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)",
          backgroundSize: "52px 52px",
          opacity: 0.6,
        }} />

        {/* ── Subtle radial warm glow center-right ── */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 70% at 65% 45%, rgba(30,26,18,0.9) 0%, transparent 70%)",
        }} />

        {/* ── PORTRAIT — left-anchored, bleeds from bottom, fades right ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "clamp(300px, 42%, 560px)",
            height: "100%",
            zIndex: 2,
          }}
        >
          <Image
            src="/nitishhh.png"
            alt="Nitin Nahata — Founder, Axion Index"
            fill
            style={{
              objectFit: "cover",
              objectPosition: "top center",
            }}
            priority
          />
          {/* Fade portrait into dark bg — right edge */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, transparent 40%, #0e0e0c 92%)",
          }} />
          {/* Fade portrait at bottom */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "30%",
            background: "linear-gradient(to top, #0e0e0c, transparent)",
          }} />
          {/* Very slight fade at top */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "18%",
            background: "linear-gradient(to bottom, #0e0e0c 0%, transparent 100%)",
          }} />
        </motion.div>

        {/* ── CONTENT — sits over the right portion ── */}
        <div
          style={{
            position: "relative",
            zIndex: 3,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "clamp(100px,14vh,160px) clamp(56px,8vw,120px) clamp(60px,8vh,100px) clamp(280px,46%,640px)",
          }}
        >
          {/* Kicker */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="font-mono"
            style={{
              fontSize: 10,
              letterSpacing: ".38em",
              textTransform: "uppercase",
              color: "rgba(196,152,72,.7)",
              marginBottom: 28,
            }}
          >
            Founder Doctrine&nbsp;&nbsp;·&nbsp;&nbsp;Axion Index
          </motion.div>

          {/* Main headline — stacked, large serif */}
          <motion.h1
            className="font-serif"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: T.display,
              fontWeight: 400,
              fontSize: "clamp(52px, 7.5vw, 108px)",
              lineHeight: 0.96,
              letterSpacing: "-0.02em",
              color: "rgba(247,246,243,0.93)",
              marginBottom: 20,
            }}
          >
            <span style={{ display: "block" }}>The</span>
            <span style={{ display: "block" }}>Making</span>
            <span style={{ display: "block" }}>of the</span>
            <em style={{ display: "block", fontStyle: "italic", color: T.gold2 }}>Operating</em>
            <em style={{ display: "block", fontStyle: "italic", color: T.gold2 }}>Architect.</em>
          </motion.h1>

          {/* Name */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-mono"
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: ".28em",
              textTransform: "uppercase",
              color: "rgba(247,246,243,.55)",
              marginBottom: 16,
            }}
          >
            Nitin Nahata
          </motion.p>

          {/* Body text */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif"
            style={{
              fontFamily: T.display,
              fontStyle: "italic",
              fontSize: "clamp(15px, 1.45vw, 18px)",
              lineHeight: 1.65,
              color: "rgba(176,174,168,.75)",
              maxWidth: "34ch",
              fontWeight: 300,
            }}
          >
            A 23-year journey through institutions, scale, crisis, and unfinished organisations.
          </motion.p>
        </div>

        {/* ── Vertical "FOUNDER" text — far right ── */}
        <div
          style={{
            position: "absolute",
            right: 20,
            top: "50%",
            transform: "translateY(-50%) rotate(180deg)",
            writingMode: "vertical-rl",
            zIndex: 4,
          }}
        >
          <span
            className="font-mono"
            style={{
              fontSize: 10,
              letterSpacing: ".35em",
              textTransform: "uppercase",
              color: "rgba(247,246,243,.22)",
            }}
          >
            Founder
          </span>
        </div>

        {/* ── "Not a biography" sub-note — below body text, visible in photo ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            bottom: "clamp(120px,16vh,180px)",
            left: "clamp(280px,46%,640px)",
            zIndex: 4,
          }}
        >
          <p
            className="font-mono"
            style={{
              fontSize: 10,
              letterSpacing: ".18em",
              color: "rgba(247,246,243,.32)",
              maxWidth: "44ch",
            }}
          >
            Not a biography. The operating evidence behind Axion Index.
          </p>
        </motion.div>

        {/* ── Bottom meta bar — company list left + SCROLL right ── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 clamp(20px,3vw,48px)",
            height: 48,
            borderTop: "1px solid rgba(247,246,243,.07)",
            background: "rgba(8,8,6,0.6)",
          }}
        >
          {/* Left — "FOUNDER" tag */}
          <span
            className="font-mono"
            style={{ fontSize: 9, letterSpacing: ".32em", textTransform: "uppercase", color: "rgba(247,246,243,.28)" }}
          >
            Founder
          </span>

          {/* Center — company list separated by / */}
          <div
            className="font-mono"
            style={{
              fontSize: 9,
              letterSpacing: ".16em",
              textTransform: "uppercase",
              color: "rgba(247,246,243,.28)",
              display: "flex",
              alignItems: "center",
              gap: 0,
              flexWrap: "nowrap",
              overflow: "hidden",
            }}
          >
            {COMPANIES.map((c, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                {c.name}
                {i < COMPANIES.length - 1 && (
                  <span style={{ margin: "0 10px", color: "rgba(247,246,243,.14)" }}>/</span>
                )}
              </span>
            ))}
          </div>

          {/* Right — SCROLL + line */}
          <span
            className="font-mono"
            style={{
              fontSize: 9,
              letterSpacing: ".32em",
              textTransform: "uppercase",
              color: "rgba(247,246,243,.28)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexShrink: 0,
            }}
          >
            Scroll
            <span style={{ display: "inline-block", width: 32, height: 1, background: "rgba(247,246,243,.25)" }} />
          </span>
        </div>

        {/* ── Bottom fade — hero → dark ticker (no white fade) ── */}
        <div style={{
          position: "absolute", bottom: 48, left: 0, right: 0,
          height: "8vh",
          background: "linear-gradient(to top, rgba(8,8,6,0.6), transparent)",
          pointerEvents: "none",
          zIndex: 5,
        }} />
      </header>

      {/* ══ COMPANY TICKER — dark strip matching photo ══════════════════════════
           Dark background, cream serif company names, gold diamond separators,
           small category labels — exactly as shown in the bottom of the photo
      ═══════════════════════════════════════════════════════════════════════════ */}
      <div
        aria-hidden="true"
        style={{
          background: "#0D0D0B",
          borderTop: "1px solid rgba(247,246,243,.06)",
          borderBottom: "1px solid rgba(247,246,243,.06)",
          padding: "20px 0",
          overflow: "hidden",
          WebkitMaskImage: "linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent)",
          maskImage: "linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent)",
        }}
      >
        <div className="co-track">
          {[...COMPANIES, ...COMPANIES].map((c, i) => (
            <span
              key={i}
              style={{ display: "inline-flex", alignItems: "baseline", gap: 6, padding: "0 28px" }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: 8,
                  letterSpacing: ".28em",
                  textTransform: "uppercase",
                  color: "rgba(160,120,48,.5)",
                  marginRight: 6,
                }}
              >
                {c.tag}
              </span>
              <span
                className="font-serif"
                style={{
                  fontSize: "clamp(17px,1.6vw,22px)",
                  color: "rgba(247,246,243,.82)",
                  fontWeight: 400,
                }}
              >
                {c.name}
              </span>
              {/* Gold diamond separator */}
              <span
                style={{
                  display: "inline-block",
                  width: 5,
                  height: 5,
                  background: T.gold,
                  opacity: 0.35,
                  transform: "rotate(45deg)",
                  margin: "0 6px",
                  flexShrink: 0,
                  alignSelf: "center",
                }}
              />
            </span>
          ))}
        </div>
      </div>

      {/* ══ S2 — WHAT THIS PAGE IS ═══════════════════════════════════════════════ */}
      <section style={{ borderBottom:`1px solid ${T.rule}` }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-12 py-24">
          <div className="intro-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1.45fr", gap:"clamp(40px,6vw,96px)", alignItems:"start" }}>
            <FadeUp>
              <div>
                <span className="font-mono text-[17px] uppercase block mb-6" style={{ letterSpacing:"0.24em", color:T.mid }}>What this page is</span>
                <h2 className="font-serif font-medium" style={{ fontFamily:T.display, fontSize:"clamp(34px,4.8vw,58px)", lineHeight:1.04, color:T.ink }}>
                  How a career became{" "}
                  <em style={{ fontStyle:"italic", color:T.gold }}>doctrine.</em>
                </h2>
              </div>
            </FadeUp>
            <div>
              <FadeUp delay={0.12}>
                <p style={{ fontFamily:T.display, fontSize:"clamp(17px,1.6vw,20px)", lineHeight:1.75, color:T.ink3, marginBottom:22, fontWeight:300 }}>
                  This is not a full biography. It is the operating evidence behind Axion Index: the institutions, shocks, scale transitions, and unfinished organisations that shaped a way of reading how companies actually hold.
                </p>
              </FadeUp>
              <FadeUp delay={0.2}>
                <p style={{ fontFamily:T.display, fontSize:"clamp(17px,1.6vw,20px)", lineHeight:1.75, color:T.ink3, marginBottom:28, fontWeight:300 }}>
                  The pattern is simple: when organisations grow faster than their operating architecture, people carry the system in their heads. Axion exists to codify what should never depend on one person.
                </p>
              </FadeUp>
              <FadeUp delay={0.28}>
                <div style={{ background:T.ink, padding:"28px 32px", position:"relative" }}>
                  <div className="absolute top-0 left-0 w-10 h-0.5" style={{ background:T.gold }} />
                  <p className="font-serif" style={{ fontFamily:T.display, fontStyle:"italic", fontSize:"clamp(16px,1.55vw,19px)", lineHeight:1.65, color:"rgba(247,246,243,.9)", margin:0 }}>
                    A bamboo plant spends years building roots underground. When it finally rises, the speed is not sudden. It was always happening, invisibly, structurally, below the surface.
                  </p>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ══ S3 — THE SOIL ═══════════════════════════════════════════════════════ */}
      <section id="soil" style={{ borderBottom:`1px solid ${T.rule}` }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-12 py-24">
          <SectionHead label="The soil before 2003" index={1} total={5} />
          <FadeUp delay={0.05}>
            <h2 className="font-serif font-medium mb-14"
              style={{ fontFamily:T.display, fontSize:"clamp(34px,4.8vw,58px)", lineHeight:1.04, color:T.ink }}>
              Where the operating system<br />
              <em style={{ fontStyle:"italic", color:T.gold }}>began writing itself.</em>
            </h2>
          </FadeUp>

          {/* 4-cell grid — mirrors landing Method section grid */}
          <div className="origin-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, background:T.rule, border:`1px solid ${T.rule}` }}>
            {ORIGINS.map((item,i) => {
              const bgMap = [T.white, T.white2, "#D8D5CF", T.ink];
              const isDark = i === 3;
              return (
                <motion.div key={i} initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true, margin:"-8%" }}
                  transition={{ duration:0.65, delay:i*0.1, ease:[0.22,1,0.36,1] }}
                  className="relative p-8 pb-10 fn-card cursor-default"
                  style={{ background:bgMap[i], border:"none" }}>
                  {/* Gold top rule */}
                  <div className="absolute top-0 left-0 w-10 h-0.5" style={{ background:T.gold }} />

                  <span className="font-serif italic block mb-5" style={{ fontSize:"clamp(36px,4vw,52px)", color:isDark ? "rgba(196,152,72,.2)" : "rgba(160,120,48,.14)", lineHeight:1 }}>
                    {item.num}
                  </span>
                  <div className="font-mono mb-3" style={{ fontSize:9, letterSpacing:".3em", textTransform:"uppercase", color:isDark ? "rgba(196,152,72,.55)" : T.gold }}>
                    {item.place}
                  </div>
                  <h3 className="font-serif font-medium mb-4" style={{ fontFamily:T.display, fontSize:"clamp(19px,1.8vw,23px)", color:isDark ? T.white : T.ink, lineHeight:1.15 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontFamily:T.display, fontSize:15, color:isDark ? T.dim : T.ink3, lineHeight:1.7, marginBottom:16 }}>
                    {item.body}
                  </p>
                  <div style={{ borderTop:`1px solid ${isDark ? "rgba(247,246,243,.1)" : T.rule2}`, paddingTop:14 }}>
                    <p className="font-serif italic" style={{ fontSize:13, color:isDark ? T.gold2 : T.gold, lineHeight:1.6 }}>
                      {item.take}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ S4 — TIMELINE / ROOTS ════════════════════════════════════════════════ */}
      <section id="timeline" style={{ borderBottom:`1px solid ${T.rule}` }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-12 py-24">
          <SectionHead label="The roots · 2003 to present" index={2} total={5} />
          <FadeUp delay={0.05}>
            <h2 className="font-serif font-medium mb-6" style={{ fontFamily:T.display, fontSize:"clamp(34px,4.8vw,58px)", lineHeight:1.04, color:T.ink }}>
              Chapters that installed <em style={{ fontStyle:"italic", color:T.gold }}>patterns.</em>
            </h2>
          </FadeUp>
          <FadeUp delay={0.14}>
            <p style={{ fontFamily:T.display, fontSize:18, color:T.ink3, maxWidth:"60ch", marginBottom:56, lineHeight:1.7, fontWeight:300 }}>
              Not a résumé. Each chapter shows the operating pattern it installed — from institutional discipline to startup physics and crisis architecture.
            </p>
          </FadeUp>

          {/* Chapter rows */}
          <div>
            {CHAPTERS.map((ch,i) => (
              <FadeUp key={i} delay={i*0.05}>
                <div className="ch-row" style={{ display:"grid", gridTemplateColumns:"140px 1fr 180px", gap:"clamp(16px,3vw,40px)", alignItems:"start", borderTop:`1px solid ${T.rule}`, padding:"clamp(24px,3vw,36px) 0", cursor:"default" }}>
                  {/* Year */}
                  <div className="font-mono" style={{ fontSize:13, letterSpacing:".08em", color:T.mid, paddingTop:4 }}>
                    {ch.year}
                  </div>
                  {/* Body */}
                  <div>
                    <div className="font-serif font-medium ch-company" style={{ fontFamily:T.display, fontSize:"clamp(22px,2.4vw,30px)", color:T.mid, marginBottom:5, lineHeight:1.1, transition:"color .3s" }}>
                      {ch.company}
                    </div>
                    <div className="font-mono mb-3" style={{ fontSize:9.5, letterSpacing:".22em", textTransform:"uppercase", color:T.dim }}>
                      {ch.context}
                    </div>
                    <p style={{ fontFamily:T.display, fontSize:16, color:T.ink3, lineHeight:1.7, maxWidth:"52ch" }}>
                      {ch.body}
                    </p>
                  </div>
                  {/* Badge */}
                  <div style={{ paddingTop:4, textAlign:"right" }}>
                    <span className="font-mono ch-badge" style={{ fontSize:9.5, letterSpacing:".2em", textTransform:"uppercase", color:T.gold, padding:"5px 12px", border:`1px solid rgba(160,120,48,.35)`, display:"inline-block", opacity:.5, transition:"opacity .3s", whiteSpace:"nowrap" }}>
                      Installed → {ch.installed}
                    </span>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══ S5 — SYNTHESIS ═══════════════════════════════════════════════════════ */}
      <section id="synthesis" style={{ background:T.ink, borderBottom:`1px solid ${T.ink}` }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-12 py-24">
          {/* Top gold rule */}
          <div style={{ height:1, background:`linear-gradient(90deg, ${T.gold}, transparent 60%)`, marginBottom:56 }} />

          <div className="synth-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1.6fr", gap:"clamp(40px,6vw,96px)", alignItems:"start" }}>
            {/* Left sticky */}
            <div style={{ position:"sticky", top:90 }}>
              <FadeUp>
                <span className="font-mono block mb-4" style={{ fontSize:10, letterSpacing:".38em", textTransform:"uppercase", color:T.gold2, opacity:.7 }}>
                  The synthesis
                </span>
                <h2 className="font-serif font-medium" style={{ fontFamily:T.display, fontSize:"clamp(32px,4.5vw,56px)", lineHeight:1.04, color:T.white }}>
                  The chapters became a{" "}
                  <em style={{ fontStyle:"italic", color:T.gold2 }}>method.</em>
                </h2>
              </FadeUp>
            </div>

            {/* Right list */}
            <div>
              {SYNTHESIS.map((item,i) => (
                <FadeUp key={i} delay={i*0.07}>
                  <div className="syn-row" style={{ borderTop:`1px solid rgba(247,246,243,.08)`, padding:"22px 0", cursor:"default" }}>
                    <div className="font-mono mb-2" style={{ fontSize:9, letterSpacing:".32em", textTransform:"uppercase", color:T.gold, opacity:.55 }}>
                      {item.source}
                    </div>
                    <p className="font-serif syn-q" style={{ fontFamily:T.display, fontSize:"clamp(17px,1.9vw,22px)", lineHeight:1.45, color:"rgba(247,246,243,.6)", transition:"color .3s" }}>
                      {item.quote}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>

          <div style={{ height:1, background:`linear-gradient(90deg, transparent, ${T.gold}, transparent)`, marginTop:56 }} />
        </div>
      </section>

      {/* ══ S6 — BEDROCK (3-cell grid, mirrors landing Logic section) ══════════ */}
      <section style={{ borderBottom:`1px solid ${T.rule}` }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-12 py-24">
          <FadeUp>
            <span className="font-mono text-[17px] uppercase block mb-14" style={{ letterSpacing:"0.24em", color:T.mid }}>Bedrock</span>
          </FadeUp>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, background:T.rule, border:`1px solid ${T.rule}` }}>
            {BEDROCK.map((row,i) => {
              const bgMap = [T.white, T.ink2, T.white2];
              const isDark = i === 1;
              return (
                <motion.div key={i} initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true, margin:"-8%" }}
                  transition={{ duration:0.65, delay:i*0.1, ease:[0.22,1,0.36,1] }}
                  className="relative p-8 sm:p-11 fn-card cursor-default"
                  style={{ background:bgMap[i] }}>
                  {isDark && <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background:`linear-gradient(90deg, ${T.gold}, transparent)` }} />}
                  <div className="absolute top-0 left-0 w-10 h-0.5" style={{ background:T.gold, opacity:isDark?0:1 }} />

                  <span className="font-mono block mb-4" style={{ fontSize:16, color:T.gold2, letterSpacing:".14em" }}>{row.num}</span>
                  <span className="font-mono text-[13px] uppercase block mb-5" style={{ letterSpacing:".2em", color:isDark ? "rgba(247,246,243,.45)" : T.mid }}>
                    {row.k}
                  </span>
                  <h3 className="font-serif italic font-medium mb-5" style={{ fontFamily:T.display, fontSize:"clamp(28px,2.8vw,42px)", lineHeight:1.1, color:isDark ? T.white : (i===0 ? T.ink : T.ink) }}>
                    {row.v}
                  </h3>
                  <p style={{ fontFamily:T.display, fontSize:16, lineHeight:1.65, color:isDark ? T.dim : T.ink3 }}>
                    {row.sub}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ S7 — OPERATING PATTERNS ══════════════════════════════════════════════ */}
      <section id="patterns" style={{ borderBottom:`1px solid ${T.rule}` }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-12 py-24">
          <SectionHead label="The operating patterns" index={3} total={5} />
          <FadeUp delay={0.05}>
            <h2 className="font-serif font-medium mb-6" style={{ fontFamily:T.display, fontSize:"clamp(34px,4.8vw,58px)", lineHeight:1.04, color:T.ink }}>
              What an organisation actually <em style={{ fontStyle:"italic", color:T.gold }}>runs on.</em>
            </h2>
          </FadeUp>
          <FadeUp delay={0.14}>
            <p style={{ fontFamily:T.display, fontSize:18, color:T.ink3, maxWidth:"60ch", marginBottom:56, lineHeight:1.7, fontWeight:300 }}>
              Eight patterns. Two tiers. The difference between a system that depends on individuals and one that holds when attention moves elsewhere.
            </p>
          </FadeUp>

          {/* Threshold tier */}
          <FadeUp>
            <div className="font-mono mb-5" style={{ fontSize:11, letterSpacing:".32em", textTransform:"uppercase", color:T.gold }}>
              Threshold — the floor
            </div>
          </FadeUp>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, background:T.rule, border:`1px solid ${T.rule}`, marginBottom:32 }}>
            {PATTERNS_THRESHOLD.map((p,i) => (
              <motion.div key={i} initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true, margin:"-8%" }}
                transition={{ duration:0.65, delay:i*0.09, ease:[0.22,1,0.36,1] }}
                className="fn-card relative p-8 pb-10 cursor-default"
                style={{ background:i%2===0?T.white:T.white2 }}>
                <div className="absolute top-0 left-0 w-10 h-0.5" style={{ background:T.gold }} />
                <span className="font-mono block mb-6" style={{ fontSize:16, color:T.gold, letterSpacing:".14em" }}>{p.num}</span>
                <h3 className="font-serif font-medium mb-3" style={{ fontFamily:T.display, fontSize:"clamp(19px,1.8vw,24px)", lineHeight:1.15, color:T.ink }}>
                  {p.name}
                </h3>
                <p className="font-mono mb-4" style={{ fontSize:10.5, letterSpacing:".12em", color:T.gold, lineHeight:1.6 }}>
                  {p.hook}
                </p>
                <p style={{ fontFamily:T.display, fontSize:15, color:T.ink3, lineHeight:1.7 }}>{p.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Signature tier */}
          <FadeUp>
            <div className="font-mono mb-5" style={{ fontSize:11, letterSpacing:".32em", textTransform:"uppercase", color:T.gold }}>
              Signature — the ceiling
            </div>
          </FadeUp>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, background:T.rule, border:`1px solid ${T.rule}` }}>
            {PATTERNS_SIGNATURE.map((p,i) => (
              <motion.div key={i} initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true, margin:"-8%" }}
                transition={{ duration:0.65, delay:i*0.09, ease:[0.22,1,0.36,1] }}
                className="fn-card relative p-8 pb-10 cursor-default"
                style={{ background:i<=1?T.ink:(i===2?"#6E695E":T.white2) }}>
                {i<=1 && <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background:`linear-gradient(90deg, ${T.gold}, transparent)` }} />}
                {i>1  && <div className="absolute top-0 left-0 w-10 h-0.5" style={{ background:T.gold }} />}
                <span className="font-mono block mb-6" style={{ fontSize:16, color:T.gold2, letterSpacing:".14em" }}>{p.num}</span>
                <h3 className="font-serif font-medium mb-3" style={{ fontFamily:T.display, fontSize:"clamp(19px,1.8vw,24px)", lineHeight:1.15, color:i<=2?T.white:T.ink }}>
                  {p.name}
                </h3>
                <p className="font-mono mb-4" style={{ fontSize:10.5, letterSpacing:".12em", color:T.gold2, lineHeight:1.6 }}>
                  {p.hook}
                </p>
                <p style={{ fontFamily:T.display, fontSize:15, color:i<=2?T.dim:T.ink3, lineHeight:1.7 }}>{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ S8 — WRITING & MEDIA ═════════════════════════════════════════════════ */}
      <section id="writing" style={{ borderBottom:`1px solid ${T.rule}` }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-12 py-24">
          <SectionHead label="Writing & media" index={4} total={5} />
          <div className="notes-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1.5fr", gap:"clamp(40px,6vw,96px)", alignItems:"start" }}>
            {/* Left */}
            <div>
              <FadeUp>
                <h2 className="font-serif font-medium mb-8" style={{ fontFamily:T.display, fontSize:"clamp(30px,4.4vw,54px)", lineHeight:1.04, color:T.ink }}>
                  The thinking, <em style={{ fontStyle:"italic", color:T.gold }}>in the open.</em>
                </h2>
              </FadeUp>
              <FadeUp delay={0.1}>
                <p style={{ fontFamily:T.display, fontSize:18, color:T.ink3, maxWidth:"34ch", lineHeight:1.7, marginBottom:28, fontWeight:300 }}>
                  Essays, frameworks, and field notes written from inside organisations that are still figuring it out. Not thought leadership. Thought in progress.
                </p>
              </FadeUp>
              <FadeUp delay={0.18}>
                <a href="#"
                  className="inline-flex items-center gap-3 font-mono text-[10px] uppercase px-7 py-4 transition-all duration-250"
                  style={{ letterSpacing:".18em", background:T.ink, color:T.white, textDecoration:"none" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.gold; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = T.ink; }}>
                  Read Field Notes
                  <span style={{ display:"inline-block", width:16, height:1, background:"currentColor" }} />
                </a>
              </FadeUp>
            </div>

            {/* Right — note rows */}
            <div>
              {NOTES.map((note,i) => (
                <FadeUp key={i} delay={i*0.09}>
                  <div style={{ borderTop:`1px solid ${T.rule2}`, padding:"clamp(20px,2.5vw,28px) 0", display:"flex", alignItems:"flex-start", gap:20, cursor:"default" }}>
                    <span className="font-mono" style={{ fontSize:10, letterSpacing:".26em", color:T.gold, flexShrink:0, paddingTop:3, minWidth:36 }}>
                      {note.no}
                    </span>
                    <div style={{ flex:1 }}>
                      <h3 className="font-serif font-medium" style={{ fontFamily:T.display, fontSize:"clamp(18px,1.8vw,22px)", color:T.ink, marginBottom:6, lineHeight:1.2 }}>
                        {note.title}
                      </h3>
                      <p style={{ fontFamily:T.display, fontSize:15, color:T.ink3, lineHeight:1.65 }}>
                        {note.body}
                      </p>
                    </div>
                    <span className="font-mono" style={{ fontSize:9.5, letterSpacing:".2em", color:T.gold, flexShrink:0, paddingTop:3, opacity:.7 }}>
                      {note.status}
                    </span>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ S9 — VISION / ARC ════════════════════════════════════════════════════ */}
      <section id="vision" style={{ borderBottom:`1px solid ${T.rule}` }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-12 py-24">
          <SectionHead label="The arc continues" index={5} total={5} />
          <FadeUp delay={0.05}>
            <h2 className="font-serif font-medium mb-14" style={{ fontFamily:T.display, fontSize:"clamp(34px,4.8vw,58px)", lineHeight:1.04, color:T.ink }}>
              Lived. Written. <em style={{ fontStyle:"italic", color:T.gold }}>Applied.</em>
            </h2>
          </FadeUp>

          {/* 3-cell grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, background:T.rule, border:`1px solid ${T.rule}`, marginBottom:56 }}>
            {VISION_CARDS.map((card,i) => (
              <motion.div key={i} initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true, margin:"-8%" }}
                transition={{ duration:0.65, delay:i*0.1, ease:[0.22,1,0.36,1] }}
                className="fn-card relative p-8 sm:p-10 cursor-default"
                style={{ background:i===2?T.ink:i===1?T.white2:T.white }}>
                {i===2 && <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background:`linear-gradient(90deg, ${T.gold}, transparent)` }} />}
                {i<2 && <div className="absolute top-0 left-0 w-10 h-0.5" style={{ background:T.gold }} />}
                <span className="font-mono block mb-5" style={{ fontSize:10, letterSpacing:".3em", textTransform:"uppercase", color:i===2?T.gold2:T.gold, opacity:.7 }}>
                  {card.n}
                </span>
                <h3 className="font-serif italic font-medium mb-5" style={{ fontFamily:T.display, fontSize:"clamp(28px,3vw,44px)", lineHeight:1.1, color:i===2?T.white:T.ink }}>
                  {card.title}
                </h3>
                <p style={{ fontFamily:T.display, fontSize:16, color:i===2?T.dim:T.ink3, lineHeight:1.7 }}>
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Closing */}
          <FadeUp delay={0.2}>
            <p className="font-serif italic" style={{ fontFamily:T.display, fontSize:"clamp(18px,2vw,24px)", color:T.ink3, maxWidth:"58ch", lineHeight:1.65, marginBottom:36 }}>
              Organisations do not break at the strategy layer. They break at the operating layer — quietly, before anyone names it.
            </p>
          </FadeUp>
          <FadeUp delay={0.28}>
            <Link href="/connect"
              className="inline-flex items-center gap-3 font-mono text-[10px] uppercase px-7 py-4 transition-all duration-250"
              style={{ letterSpacing:".18em", background:T.gold, color:T.ink, textDecoration:"none" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.gold2; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = T.gold; }}>
              Start the conversation
              <span style={{ display:"inline-block", width:16, height:1, background:"currentColor" }} />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════════════════════ */}
      <footer style={{ background:T.ink, color:T.dim, paddingTop:"clamp(40px,8vw,80px)", paddingBottom:40 }}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-12">
          <div className="grid gap-12 pb-14"
            style={{ gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", borderBottom:"1px solid rgba(247,246,243,0.14)" }}>
            {/* Brand */}
            <div className="col-span-full lg:col-span-1">
              <img src="/axion-index-lockup-gold-on-black.svg" alt="Axion Index"
                style={{ width:"clamp(140px,30vw,200px)", maxWidth:"100%", height:"auto", display:"block" }} />
              <p className="mt-4" style={{ fontFamily:T.display, fontSize:14, color:T.mid, maxWidth:"34ch", lineHeight:1.6 }}>
                Architecture is read, not pitched.
              </p>
            </div>

            {/* Practices */}
            <div>
              <h4 className="font-mono text-[9px] uppercase mb-5 pb-3"
                style={{ letterSpacing:".22em", color:T.gold2, borderBottom:"1px solid rgba(196,152,72,.25)" }}>Practices</h4>
              {[["People Architecture","/expertise/people"],["Labour Codes","/expertise/labour"],["AI Edge Lab","/expertise/ai-edge"],["Family Business","/expertise/family"]].map(([label,href]) => (
                <Link key={href} href={href} className="block transition-all duration-200 py-1.5"
                  style={{ fontSize:13, color:T.dim, textDecoration:"none" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color=T.white; (e.currentTarget as HTMLElement).style.paddingLeft="5px"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color=T.dim; (e.currentTarget as HTMLElement).style.paddingLeft="0"; }}>
                  {label}
                </Link>
              ))}
            </div>

            {/* Index */}
            <div>
              <h4 className="font-mono text-[9px] uppercase mb-5 pb-3"
                style={{ letterSpacing:".22em", color:T.gold2, borderBottom:"1px solid rgba(196,152,72,.25)" }}>Index</h4>
              {[["Axion Index","/"],["Operating Patterns","#patterns"],["Story","#story"],["About","/about"]].map(([label,href]) => (
                <Link key={label} href={href} className="block transition-all duration-200 py-1.5"
                  style={{ fontSize:13, color:T.dim, textDecoration:"none" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color=T.white; (e.currentTarget as HTMLElement).style.paddingLeft="5px"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color=T.dim; (e.currentTarget as HTMLElement).style.paddingLeft="0"; }}>
                  {label}
                </Link>
              ))}
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-mono text-[9px] uppercase mb-5 pb-3"
                style={{ letterSpacing:".22em", color:T.gold2, borderBottom:"1px solid rgba(196,152,72,.25)" }}>Contact</h4>
              <span className="block py-1.5" style={{ fontSize:13, color:T.dim }}>Bengaluru, India</span>
              <a href="mailto:office@axionindex.org" className="block py-1.5 transition-colors duration-200 hover:text-white"
                style={{ fontSize:13, color:T.dim, textDecoration:"none" }}>office@axionindex.org</a>
              <a href="https://linkedin.com/company/axionindex" target="_blank" rel="noopener noreferrer"
                className="block py-1.5 transition-colors duration-200 hover:text-white"
                style={{ fontSize:13, color:T.dim, textDecoration:"none" }}>LinkedIn</a>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-wrap justify-between items-center gap-4 pt-8 font-mono text-[10px] uppercase"
            style={{ letterSpacing:".12em", color:T.mid }}>
            <span>© 2026 Axion Index / Operating Architecture Practice</span>
            <span>Architecture is read, not pitched.</span>
          </div>
        </div>
      </footer>

      {diagOpen && <DiagnosticModal onClose={() => setDiagOpen(false)} />}
    </div>
  );
}
