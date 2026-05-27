"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/Reveal";

/* ─── DATA ─────────────────────────────────────────────────────────────────── */

const STRATA = [
  {
    num: "I",
    loc: "Delhi · A Marwari Household",
    title: "The Origins",
    body: "Born into a world where the script was laid out early: Commerce, CA, business, respectability. But within that structure lived a different kind of influence — a maternal grandfather who began working at thirteen, who embodied responsibility before teaching it.",
    pq: "The first operating system is not designed. It is absorbed — from the people who raise you, the values they embody without declaring, and the quiet conviction that thinking for yourself is not defiance but duty.",
  },
  {
    num: "II",
    loc: "Delhi · 2002 — SRCC vs. Bangalore",
    title: "The First Collision",
    body: "SRCC held firm in my consciousness — not simply a college but a verdict. When the letter came confirming what everyone expected, the path seemed settled. But life rarely honours the scripts we write for ourselves. At eighteen, standing between certainty and duty, I chose Bangalore. Not because I wanted to leave, but because accountability felt familiar.",
    pq: "The choices that are easy do not form identity. The ones that arrive at the worst possible time and demand an answer — those reflect character, not convenience.",
  },
  {
    num: "III",
    loc: "Bangalore · 2002–2005",
    title: "The Anonymous Years",
    body: "Bangalore did not welcome me with clarity. It met me with stillness — the kind that unnerves you when you are eighteen and suddenly invisible in a city that does not know your past or care about your promise. Anonymity has a strange discipline. It clears out the noise you did not know you were carrying.",
    pq: "Anonymity is the crucible that separates those who need validation from those who generate their own momentum.",
  },
  {
    num: "IV",
    loc: "Mumbai · TISS",
    title: "The Dual Instinct",
    body: "I did not choose HR as a fallback. I chose it because my instinct for people and my instinct for business were never separate — they were the same instinct, looking at the same problem from two ends.",
    pq: "Solve people problems with a business mind. Solve business problems with a people heart.",
    last: true,
  },
];

const ROOTS_TABS = [
  {
    id: "wipro", label: "Wipro", num: "I.", period: "2003–2004",
    title: "The Monkey on My Back",
    sub: "Greenfield Manufacturing · Plant HR",
    body: "At twenty-three, fresh out of TISS, I became the sole HR point of contact at a manufacturing unit acquired from Godrej. Every worker on the floor was older than me; union dynamics were real. The mandate was wide and unglamorous — production hiring, training coordination, post-acquisition policy integration, and the first employee engagement survey the unit had ever conducted. No framework. No precedent. No one to escalate to.",
    scar: "The first operating system you design is not for the organisation. It is for yourself.",
    installations: [
      { n: "01", title: "Training Built Before the Plant", desc: "Clarity before authority — systems designed in motion outlast systems designed in comfort." },
      { n: "02", title: "Voice as Infrastructure", desc: "Once you ask people to speak, you have made a promise. Listening is commitment architecture." },
      { n: "03", title: "The Greenfield Instinct", desc: "Building people architecture for an organisation before it knows what it will become." },
    ],
    installed: "A permanent orientation toward architecture over activity — and the instinct to step in before being asked.",
    tag: "Installed → Voice Architecture",
    doctrine: ["Clarity"],
  },
  {
    id: "scb", label: "Standard Chartered", num: "II.", period: "2004–2008",
    title: "Wizards of Data",
    sub: "Captive Finance · Data-Led HR",
    body: "Building Standard Chartered's finance arm under a mandate of world-class service at a fraction of the cost. This was where data learned to command a seat rather than ask for one — including an attrition analysis that overturned the business's own hypothesis, and held under senior pushback.",
    scar: "Compliance is not commitment.",
    installations: [
      { n: "01", title: "The Analysis That Held", desc: "Evidence converts where argument fails — make the business unable to decide without it." },
      { n: "02", title: "Conviction Over Conformity", desc: "Distinguishing surface compliance from genuine belief became the work itself." },
    ],
    installed: "The ability to let data carry authority — and to tell the difference between agreement and belief.",
    tag: "Installed → The Credibility Stack",
    doctrine: ["Data"],
  },
  {
    id: "hsbc", label: "HSBC", num: "III.", period: "2008–2009",
    title: "The Pilot That Changed the Room",
    sub: "Reward Architecture · Talent Redesign",
    body: "One year — and one of the most architecturally precise. The mandate came with hard constraints: improve competitiveness, fix South India talent acquisition, redesign the reward structure — with zero incremental budget. The conventional response was to ask for more resources. The architectural one was to ask a different question: what if constraint is the design condition, not the obstacle?",
    scar: "Authority rarely creates alignment. Clarity does.",
    installations: [
      { n: "01", title: "The South India Talent Redesign", desc: "Proof before persuasion — small pilots that deliver beat strategies that reassure." },
      { n: "02", title: "The Housing Allowance Redesign", desc: "Constraint is the mother of architecture; the budget limit was a design specification." },
      { n: "03", title: "Stress-Testing Before the Room Does", desc: "Never enter a room with a proposal you have not already argued against." },
    ],
    installed: "Constraint-driven design, proof before persuasion, and self-scrutiny as the foundation of authority.",
    tag: "Installed → Decision Architecture",
    doctrine: ["Constraint"],
  },
  {
    id: "tata", label: "Tata", num: "IV.", period: "2009–2019",
    title: "The Decade That Made the Architect",
    sub: "Global HR · M&A · Starbucks India",
    body: "Ten years. Three stints. Global HR across the Americas, Australia, the Middle East, Europe & Asia. M&A integration of Tata Tea, Tetley and Eight O'Clock Coffee. Anchoring Starbucks India as a joint venture. Relocating the global headquarters from London to Mumbai — 200+ roles, continuity preserved. And the crystallisation of the floor that never left: Humanity Over Hierarchy.",
    scar: "Culture is not what organisations declare. It is what their systems enforce.",
    installations: [
      { n: "01", title: "The Maverick Principle", desc: "HR earns the seat by making the business unable to decide without it." },
      { n: "02", title: "Coherence Across Difference", desc: "Scale is not uniformity — design what must be common, protect what must stay distinct." },
      { n: "03", title: "Anchoring the Starbucks People Charter", desc: "Values survive only when embedded in operating systems." },
      { n: "04", title: "Inducting My Own Incoming Boss", desc: "Institutional courage: security without need for approval." },
    ],
    installed: "Institutional scale, coherence across difference, and Humanity Over Hierarchy as the operating floor.",
    tag: "Installed → Belief Translation",
    doctrine: ["Scale"],
  },
  {
    id: "udaan", label: "Udaan", num: "V.", period: "2019–2021",
    title: "The Collision",
    sub: "Startup Hypergrowth · National Scale · COVID",
    body: "Not a transition — a collision. The interview itself dismantled sixteen years of institutional assumptions in a single conversation. A workforce from 800 to 4,000+ on-roll in a single year, across 22 languages and 28 states. Then a national lockdown — with Udaan classified an essential service when the country shut down. Everything I knew was simultaneously my greatest asset and my most dangerous liability.",
    scar: "Startup physics is not a faster version of institutional physics. It is a different machine.",
    installations: [
      { n: "01", title: "A Different Machine", desc: "First-principles design for actual conditions, not templates borrowed from mature firms." },
      { n: "02", title: "Continuity Under Existential Pressure", desc: "In a startup, culture is the organisation — belief held when external systems fail." },
      { n: "03", title: "Belief → Conviction → Rhythm Becomes Doctrine", desc: "Founder belief cannot be delegated. It must be translated." },
    ],
    installed: "Startup physics, culture as the operating system, and Belief → Conviction → Rhythm as a doctrine.",
    tag: "Installed → Pre-Institutional Design",
    doctrine: ["Startup Physics"],
  },
  {
    id: "gameskraft", label: "Gameskraft", num: "VI.", period: "2022–Present",
    title: "The Other Side of the Equation",
    sub: "Culture-First Engineering · Crisis-Tested",
    body: "The fullest test. A profitable, fast-growing company with nine HR people, 250 open roles, no performance system, no employer brand, no institutional memory beyond founder energy. Twenty-four months of architecture — and then a 4 AM regulatory notification that threatened the sector overnight. The crisis did not find the company unprepared. The architecture held: zero layoffs through the shock, top performers stayed, offers held.",
    scar: "The architecture you build before the crisis determines whether you survive it. What you build in calm is tested in crisis.",
    installations: [
      { n: "01", title: "Building the Architecture Before the Crisis", desc: "Culture-first is an engineering decision: the sequence is the strategy." },
      { n: "02", title: "The 4 AM Test", desc: "The proof of architecture is the moment it is tested — not the moment it is built." },
      { n: "03", title: "Narrative That Scaled Itself", desc: "When the narrative is true, it scales itself — it needed to be real, not communicated." },
    ],
    installed: "Crisis-tested systems, culture-first engineering, and restraint as strategy.",
    tag: "Installed → Crisis Architecture",
    doctrine: ["Crisis Arch"],
  },
];

const ALL_DOCTRINE = ["Clarity", "Data", "Constraint", "Scale", "Startup Physics", "Crisis Arch"];

const TIMELINE_ITEMS = [
  { source: "From the Soil",           quote: "The first operating system is not designed. It is absorbed." },
  { source: "From Wipro",              quote: "Effort without system leverage becomes invisible — architecture over activity." },
  { source: "From Standard Chartered", quote: "Evidence converts where argument fails." },
  { source: "From HSBC",               quote: "Authority rarely creates alignment. Clarity does." },
  { source: "From Tata",               quote: "Culture is what your systems enforce, not what you declare." },
  { source: "From Udaan",              quote: "Design for the organisation you are becoming." },
  { source: "From Gameskraft",         quote: "The proof of architecture is the moment it is tested." },
];

const PATTERNS_THRESHOLD = [
  { num: "01", name: "Operating Rhythm", signal: "Cadence, memory, ownership, enforcement — with no bypass.", desc: "The recurring rituals through which work is reviewed, decisions remembered and standards enforced — what keeps the system running when attention moves elsewhere." },
  { num: "02", name: "Decision Architecture", signal: "One owner, one deadline, one escalation path — by design.", desc: "How decisions get made, owned and escalated — structured deliberately rather than left to whoever is loudest or most senior in the room. Installed at HSBC." },
  { num: "03", name: "The Credibility Stack", signal: "How HR earns strategic authority, in the only sequence that works.", desc: "Authority earned in sequence — evidence before argument, proof before persuasion, results the business cannot dispute. Built at Standard Chartered." },
  { num: "04", name: "Voice Architecture", signal: "Channels for dissent, before silent failure sets in.", desc: "Designed mechanisms through which people can speak — and a system obligated to respond. First built at Wipro, as commitment architecture, not a survey." },
];

const PATTERNS_SIGNATURE = [
  { num: "05", name: "Pre-Institutional Design", signal: "Designing the organisation before it knows it needs one.", desc: "Building people architecture for the organisation that is coming, not the one that exists today — before speed reveals the gaps. The greenfield instinct, proven at Udaan." },
  { num: "06", name: "Rhythm Matching", signal: "Diagnosing cadence fit before the hire, not after.", desc: "Reading the operating tempo a role and a person actually run at — and matching them before commitment. The most expensive hiring errors are rhythm errors." },
  { num: "07", name: "Belief Translation", signal: "Converting founder conviction into organisational rhythm.", desc: "Turning what a founder believes into what an organisation reliably does when the founder is not in the room. Crystallised at Tata, proven at Udaan." },
  { num: "08", name: "Crisis Architecture", signal: "Readiness as design, not improvisation.", desc: "The commitments and trust built in calm that determine whether an organisation survives the shock. Demonstrated at Gameskraft when the sector was tested overnight." },
];

const SYS_MAP = [
  { n: "01 · Doctrine",    title: "Founder Doctrine",    desc: "The Operating Architect — the thesis and the lived scars behind it.", entry: false },
  { n: "02 · Framework",   title: "Operating Patterns",  desc: "How organisations hold — eight patterns, in two tiers.", entry: false },
  { n: "03 · Entry point", title: "Diagnostics",         desc: "Where the system is breaking — measured against the patterns.", entry: true },
  { n: "04 · Practice",    title: "Practices",           desc: "People Architecture · AI Edge Lab · Labour Codes · Family Business.", entry: false },
  { n: "05 · Infrastructure", title: "HROS",             desc: "The operating-intelligence layer — the patterns, encoded into software.", entry: false, future: true },
];

const WHO_GRID = [
  { aud: "Founders",              desc: "Convert founder conviction into operating rhythm — so the company runs the system, not you." },
  { aud: "Investors & boards",    desc: "Diagnose whether the organisation can actually carry the strategy." },
  { aud: "CHROs & CXOs",          desc: "Redesign decision, rhythm, capability and trust architecture." },
  { aud: "Operators & people teams", desc: "Frameworks to scale without importing enterprise drag." },
];

const ARTICLES_FEATURED = { cat: "Featured · AI & HR", title: "Should AI Replace Empathy? The Limits of Technology in Hiring", meta: "Publishing soon" };

const ARTICLES = [
  { cat: "Startups",      title: "HR in Start-Ups: Unconventional Wisdom and Constant Re-Alignment" },
  { cat: "HR Strategy",   title: "What Does HR Want? A Deep Dive Into the Wishlist of HR Leaders" },
  { cat: "HR Leadership", title: "The Art of Being Relevant: Where Does the HR Function Stand?" },
  { cat: "HR Tech",       title: "Beyond Tech: How Far Can HR Tech Address Human Emotions?" },
  { cat: "Performance",   title: "Continuous Feedback Through 'Konversations'" },
];

const HONOURS = [
  "Jombay's HR 40 Under 40",
  "ET Human Capital Award — Trust & High Performance",
  "BW People Gold — Performance Management",
  "LinkedIn Talent Award 2024 — Best TA Team",
  "Kincentric Top-Quartile Engagement",
];

/* ─── MAIN PAGE ─────────────────────────────────────────────────────────────── */

export default function FounderPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [emailNews, setEmailNews] = useState("");
  const [submittedNews, setSubmittedNews] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("story");

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Intersection observer for active nav link
  useEffect(() => {
    const sections = ["story", "roots", "synthesis", "patterns", "writing", "vision"];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const NAV_LINKS = [
    { href: "#story",    label: "Story" },
    { href: "#roots",    label: "Roots" },
    { href: "#patterns", label: "Patterns" },
    { href: "#writing",  label: "Writing" },
    { href: "#vision",   label: "Vision" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#0A0A0B" }}>
      <style>{`
        /* ── Founder page scoped styles ── */
        .fn-nav {
          position: fixed; top: 0; left: 0; right: 0; height: 64px; z-index: 900;
          display: flex; align-items: center;
          background: rgba(10,10,11,.6); backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(237,235,227,.08);
          transition: background .3s;
        }
        .fn-nav.s { background: rgba(10,10,11,.95); }
        .fn-nav-inner { max-width: 1160px; margin: 0 auto; padding: 0 38px; display: flex; align-items: center; justify-content: space-between; width: 100%; }
        .fn-brand { font-family: var(--font-serif), Georgia, serif; font-size: 20px; font-weight: 400; color: #EDEBE3; letter-spacing: .01em; text-decoration: none; }
        .fn-nl { display: flex; align-items: center; gap: 30px; }
        .fn-nl a { font-family: var(--font-sans), Inter, sans-serif; font-size: 11px; font-weight: 500; letter-spacing: .18em; text-transform: uppercase; color: #6A6A70; transition: color .2s; padding: 5px 0; position: relative; text-decoration: none; }
        .fn-nl a:hover, .fn-nl a.on { color: #E2C078; }
        .fn-nl a.on::after { content: ""; position: absolute; left: 0; right: 0; bottom: -1px; height: 1px; background: #C9A24A; }
        .fn-nl .fn-btn { color: #C9A24A; border: 1px solid rgba(201,162,74,.28); border-radius: 2px; padding: 8px 15px; }
        .fn-nl .fn-btn:hover { background: rgba(201,162,74,.08); }
        .fn-hamb { display: none; background: none; border: 1px solid rgba(237,235,227,.08); color: #EDEBE3; width: 42px; height: 38px; border-radius: 4px; cursor: pointer; align-items: center; justify-content: center; }

        /* Spine draw animation */
        @keyframes spineGrow {
          from { transform: scaleY(0); transform-origin: top; }
          to   { transform: scaleY(1); transform-origin: top; }
        }
        .spine-line { animation: spineGrow 1.4s cubic-bezier(0.22,1,0.36,1) forwards; transform-origin: top; }

        /* Pattern card hover */
        .pattern-card { transition: border-color .25s, box-shadow .25s, transform .25s; }
        .pattern-card:hover { border-color: rgba(201,162,74,.32) !important; box-shadow: 0 8px 32px -12px rgba(201,162,74,.18); transform: translateY(-3px); }

        /* Tab underline slide */
        .roots-tab { position: relative; transition: color .2s; }
        .roots-tab::after { content: ""; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; background: #C9A24A; transform: scaleX(0); transform-origin: left; transition: transform .28s cubic-bezier(0.22,1,0.36,1); }
        .roots-tab[aria-selected="true"]::after { transform: scaleX(1); }

        /* Reduced motion — kill all animations */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
          .spine-line { animation: none !important; transform: none !important; }
          .pattern-card:hover { transform: none !important; }
        }

        @media (max-width: 960px) {
          .fn-nl { position: fixed; inset: 64px 0 auto 0; flex-direction: column; gap: 0; background: #0D0D0F; border-bottom: 1px solid rgba(201,162,74,.28); max-height: 0; overflow: hidden; transition: max-height .35s; padding: 0 38px; }
          .fn-nl.open { max-height: 580px; padding: 12px 38px 26px; }
          .fn-nl a { padding: 14px 0; width: 100%; border-bottom: 1px solid rgba(237,235,227,.08); font-size: 13px; }
          .fn-nl .fn-btn { margin-top: 12px; text-align: center; }
          .fn-hamb { display: inline-flex; }
        }
        @media (max-width: 768px) {
          .founder-hero { grid-template-columns: 1fr !important; }
          .founder-hero-img { height: 42vh; min-height: 300px; }
          .founder-hero-img::after { top: auto !important; left: 0; right: 0; bottom: 0; width: 100% !important; height: 42%; background: linear-gradient(0deg, #0A0A0B, transparent) !important; }
          .founder-hero-txt { padding: 40px 28px 52px !important; }
          .founder-loop { grid-template-columns: 1fr !important; }
          .founder-loop .loop-arrow { transform: rotate(90deg); padding: 4px 0; }
          .synthesis-timeline > div { width: 100% !important; left: 0 !important; text-align: left !important; padding-left: 28px !important; padding-right: 12px !important; }
          .synthesis-timeline > div .tl-dot { left: -3.5px !important; right: auto !important; }
          .synthesis-center-line { left: 0 !important; }
          .bedrock-grid { grid-template-columns: 1fr !important; }
          .bedrock-arrow { display: none !important; }
          .bridge-grid { grid-template-columns: 1fr !important; }
          .patterns-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .patterns-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── FIXED NAV ── */}
      <nav className={`fn-nav${navScrolled ? " s" : ""}`} aria-label="Primary">
        <div className="fn-nav-inner">
          <a className="fn-brand" href="#story">Nitin Nahata</a>
          <button
            className="fn-hamb"
            aria-label="Menu"
            aria-expanded={mobileOpen}
            aria-controls="fn-nl"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 20, height: 20 }}>
              <line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" />
            </svg>
          </button>
          <div className={`fn-nl${mobileOpen ? " open" : ""}`} id="fn-nl">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={activeSection === l.href.slice(1) ? "on" : ""}
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <a
              className="fn-btn"
              href="https://axionindex.org"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
            >
              Axion Index ↗
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <header
        id="story"
        className="founder-hero"
        style={{
          minHeight: "100vh",
          display: "grid",
          gridTemplateColumns: ".92fr 1.08fr",
          alignItems: "stretch",
        }}
      >
        {/* Left — monogram */}
        <div
          className="founder-hero-img"
          style={{
            position: "relative",
            background: "radial-gradient(120% 90% at 30% 30%, #201f24, #0c0c0e 70%)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* ::before equivalent */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(60% 50% at 50% 42%, rgba(201,162,74,.05), transparent 70%)" }}
          />
          {/* ::after equivalent — right fade into bg */}
          <div
            className="absolute pointer-events-none"
            style={{ top: 0, right: 0, bottom: 0, width: "42%", background: "linear-gradient(90deg, transparent, #0A0A0B)" }}
          />
          {/* Monogram */}
          <div className="relative z-10 text-center">
            {/* Outer halo ring */}
            <div
              style={{
                width: 220, height: 220, borderRadius: "50%",
                border: "1px solid rgba(201,162,74,.10)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto",
              }}
            >
              {/* Inner ring */}
              <div
                style={{
                  width: 188, height: 188, borderRadius: "50%",
                  border: "1px solid rgba(201,162,74,.32)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 80px -30px rgba(201,162,74,.55), inset 0 0 40px -20px rgba(201,162,74,.06)",
                }}
              >
                <span
                  className="font-serif"
                  style={{ fontSize: 72, fontWeight: 400, color: "#3e3d44", letterSpacing: ".06em", userSelect: "none" }}
                >
                  NN
                </span>
              </div>
            </div>
            {/* Caption */}
            <p
              className="font-sans"
              style={{ marginTop: 24, fontSize: "9.5px", fontWeight: 500, letterSpacing: ".38em", textTransform: "uppercase", color: "#4A4A52" }}
            >
              The Operating Architect
            </p>
          </div>
        </div>

        {/* Right — text */}
        <div
          className="founder-hero-txt"
          style={{
            display: "flex", flexDirection: "column", justifyContent: "center",
            padding: "calc(64px + 36px) 9% 56px",
            position: "relative",
          }}
        >
          {/* Radial glow behind text */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(80% 60% at 70% 40%, rgba(201,162,74,.035), transparent 70%)" }}
          />
          <div style={{ position: "relative" }}>
            <Reveal>
              <span
                className="font-sans"
                style={{ display: "block", marginBottom: 24, fontSize: "10.5px", fontWeight: 500, letterSpacing: ".32em", textTransform: "uppercase", color: "#C9A24A" }}
              >
                Nitin Nahata
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1
                className="font-serif"
                style={{
                  fontWeight: 400,
                  fontSize: "clamp(44px, 5.8vw, 76px)",
                  lineHeight: 1.04,
                  letterSpacing: "-.014em",
                  color: "#EDEBE3",
                  marginBottom: 24,
                }}
              >
                The{" "}
                <em style={{ fontStyle: "italic", color: "#C9A24A" }}>Making</em>
                {" "}of the<br />Operating Architect
              </h1>
            </Reveal>
            <Reveal delay={0.18}>
              <p
                className="font-sans"
                style={{ fontWeight: 300, fontSize: "clamp(15px,1.45vw,18px)", color: "#97979C", maxWidth: "38ch", marginBottom: 32, lineHeight: 1.6, letterSpacing: ".01em" }}
              >
                A 23-year journey through collision, scars &amp; conviction.
              </p>
            </Reveal>
            <Reveal delay={0.26}>
              <blockquote
                className="font-serif"
                style={{
                  fontStyle: "italic",
                  fontSize: "15.5px",
                  lineHeight: 1.68,
                  color: "#8A7338",
                  maxWidth: "44ch",
                  borderLeft: "1.5px solid rgba(138,115,56,.4)",
                  paddingLeft: 20,
                  marginBottom: 0,
                }}
              >
                A bamboo plant spends years building roots underground. No visible shoot. No measurable progress. Then, in what looks like weeks, it rises — the speed is not sudden. It was always happening, invisibly, structurally, below the surface.
              </blockquote>
            </Reveal>
            <Reveal delay={0.34}>
              <div
                style={{
                  marginTop: 34,
                  paddingTop: 24,
                  borderTop: "1px solid rgba(237,235,227,.07)",
                }}
              >
                {/* Tier 1 — Companies */}
                <div
                  className="font-sans"
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: ".16em",
                    textTransform: "uppercase",
                    color: "#C9A24A",
                    lineHeight: 1.9,
                    marginBottom: 10,
                  }}
                >
                  Wipro&nbsp;<span style={{ color: "#3A3A40", fontWeight: 400 }}>|</span>&nbsp;Standard Chartered&nbsp;<span style={{ color: "#3A3A40", fontWeight: 400 }}>|</span>&nbsp;HSBC&nbsp;<span style={{ color: "#3A3A40", fontWeight: 400 }}>|</span>&nbsp;Tata&nbsp;<span style={{ color: "#3A3A40", fontWeight: 400 }}>|</span>&nbsp;Udaan&nbsp;<span style={{ color: "#3A3A40", fontWeight: 400 }}>|</span>&nbsp;Gameskraft
                </div>
                {/* Tier 2 — Sectors */}
                <div
                  className="font-sans"
                  style={{
                    fontSize: "9.5px",
                    fontWeight: 400,
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    color: "#5A5A62",
                    lineHeight: 1.9,
                    marginBottom: 8,
                  }}
                >
                  IT&nbsp;<span style={{ color: "#2E2E34" }}>|</span>&nbsp;Manufacturing&nbsp;<span style={{ color: "#2E2E34" }}>|</span>&nbsp;Banking&nbsp;<span style={{ color: "#2E2E34" }}>|</span>&nbsp;Real Estate&nbsp;<span style={{ color: "#2E2E34" }}>|</span>&nbsp;FMCG&nbsp;<span style={{ color: "#2E2E34" }}>|</span>&nbsp;Retail&nbsp;<span style={{ color: "#2E2E34" }}>|</span>&nbsp;B2B &amp; B2C Startups&nbsp;<span style={{ color: "#2E2E34" }}>|</span>&nbsp;Gaming &amp; Tech
                </div>
                {/* Tier 3 — Geography */}
                <div
                  className="font-sans"
                  style={{
                    fontSize: "9.5px",
                    fontWeight: 400,
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    color: "#4A4A52",
                    lineHeight: 1.9,
                  }}
                >
                  Asia&nbsp;<span style={{ color: "#2E2E34" }}>|</span>&nbsp;Americas&nbsp;<span style={{ color: "#2E2E34" }}>|</span>&nbsp;Australia&nbsp;<span style={{ color: "#2E2E34" }}>|</span>&nbsp;Europe&nbsp;<span style={{ color: "#2E2E34" }}>|</span>&nbsp;Middle East
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          style={{
            position: "absolute", bottom: 0, left: 0, width: "100%",
            height: "20vh",
            background: "linear-gradient(to top, #0A0A0B, transparent)",
            pointerEvents: "none",
            gridColumn: "1 / -1",
          }}
        />
      </header>

      {/* ── SOIL ── */}
      <section
        id="soil"
        className="relative"
        style={{ padding: "clamp(80px,12vh,140px) 0", borderTop: "1px solid var(--line)" }}
      >
        <div className="shell">
          <Reveal>
            <div className="mb-14" style={{ maxWidth: 880 }}>
              <span className="eyebrow mb-4 block">The Soil · Before 2003</span>
              <h2 className="h-section mb-5" style={{ maxWidth: "18ch" }}>
                Where the operating system began writing itself
              </h2>
              <p className="lead" style={{ maxWidth: "62ch" }}>
                Every architect needs material to work with. For buildings, it is steel and concrete. For people systems, it is something less visible: a way of reading the world, a comfort with responsibility, an internal compass that holds when external certainty disappears.
              </p>
            </div>
          </Reveal>

          {/* Strata timeline */}
          <div
            className="relative"
            style={{ maxWidth: 860, margin: "0 auto" }}
          >
            {/* Vertical spine — draws top→bottom on scroll-enter */}
            <motion.div
              className="absolute pointer-events-none"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                left: 26, top: 18, bottom: 64, width: 1,
                background: "linear-gradient(180deg, rgba(201,162,74,.18) 0%, rgba(201,162,74,.38) 40%, #C9A24A 100%)",
                transformOrigin: "top",
              }}
            />

            {STRATA.map((s, i) => {
              /* depth: layer I faintest, layer IV richest */
              const depthOpacity = 0.55 + i * 0.15; // 0.55 → 1.0
              const isLast = !!s.last;
              return (
                <div
                  key={i}
                  className="relative"
                  style={{
                    padding: "32px 0 32px 72px",
                    borderBottom: isLast ? "none" : "1px solid rgba(237,235,227,.07)",
                  }}
                >
                  {/* Node — lights up when layer enters viewport */}
                  <motion.div
                    className="absolute flex items-center justify-center font-serif italic"
                    initial={{ scale: 0.6, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-12%" }}
                    transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      left: isLast ? 8 : 11,
                      top: 32,
                      width: isLast ? 37 : 31,
                      height: isLast ? 37 : 31,
                      borderRadius: "50%",
                      background: isLast ? "#C9A24A" : "#0A0A0B",
                      border: isLast ? "none" : "1px solid rgba(201,162,74,.38)",
                      fontSize: isLast ? 13 : 14,
                      color: isLast ? "#000" : "#C9A24A",
                      zIndex: 2,
                      boxShadow: isLast ? "0 0 22px 4px rgba(201,162,74,.45)" : "none",
                    }}
                  >
                    {s.num}
                  </motion.div>

                  {/* Layer body — staggered fade + rise */}
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: depthOpacity, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span
                      className="font-sans block mb-2"
                      style={{ fontSize: "10px", letterSpacing: ".22em", textTransform: "uppercase", color: "#6A6A70" }}
                    >
                      {s.loc}
                    </span>
                    <h3
                      className="font-serif mb-3"
                      style={{ fontSize: isLast ? 26 : 23, fontWeight: isLast ? 500 : 400, color: isLast ? "#EDEBE3" : "#CCCAC2", lineHeight: 1.15 }}
                    >
                      {s.title}
                    </h3>
                    <p style={{ color: "#97979C", fontWeight: 300, fontSize: 15.5, lineHeight: 1.7, maxWidth: "68ch" }}>
                      {s.body}
                    </p>
                  </motion.div>

                  {/* Pull-quote — arrives slightly after body */}
                  <motion.blockquote
                    className="font-serif italic"
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.65, delay: i * 0.06 + 0.22, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      marginTop: 18,
                      fontSize: isLast ? 17 : 15.5,
                      lineHeight: 1.62,
                      color: isLast ? "#C9A24A" : "#8A7338",
                      borderLeft: `1.5px solid ${isLast ? "rgba(201,162,74,.6)" : "rgba(138,115,56,.3)"}`,
                      paddingLeft: 18,
                      maxWidth: "60ch",
                    }}
                  >
                    {s.pq}
                  </motion.blockquote>

                  {/* Bedrock arrival label — last node only */}
                  {isLast && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, margin: "-10%" }}
                      transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                      className="font-sans mt-4"
                      style={{ fontSize: "9.5px", fontWeight: 500, letterSpacing: ".28em", textTransform: "uppercase", color: "#C9A24A" }}
                    >
                      ◆ Bedrock
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Closing line */}
          <motion.p
            className="font-serif italic text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5%" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: 18, lineHeight: 1.5, color: "#6A6A70", maxWidth: 680, margin: "52px auto 0" }}
          >
            This was the soil. Everything that came after was built on it.
          </motion.p>
        </div>
      </section>

      {/* ── ROOTS ── */}
      <section
        id="roots"
        className="relative"
        style={{ padding: "clamp(80px,12vh,140px) 0", borderTop: "1px solid var(--line)" }}
      >
        <div className="shell">
          <Reveal>
            <div className="mb-10" style={{ maxWidth: 880 }}>
              <span className="eyebrow mb-4 block">The Roots · 2003 — Present</span>
              <h2 className="h-section mb-5" style={{ maxWidth: "22ch" }}>
                Preparing for the war when you are not at war
              </h2>
              <p className="lead" style={{ maxWidth: "62ch" }}>
                Six collisions across institution and startup. In the early years the architecture was already built — the work was to operate inside it, learn its mechanics, understand what holds and what breaks. In the later years there was no architecture to inherit: only belief, speed and chaos — and every lesson installed in the root years, tested under live conditions.
              </p>
            </div>
          </Reveal>

          {/* Tab bar */}
          <div
            role="tablist"
            aria-label="Career chapters"
            className="flex flex-wrap"
            style={{ borderBottom: "1px solid var(--line)", marginBottom: 0, maxWidth: 1080 }}
          >
            {ROOTS_TABS.map((t, i) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={activeTab === i}
                aria-controls={`panel-${t.id}`}
                id={`tab-${t.id}`}
                onClick={() => setActiveTab(i)}
                className="roots-tab font-sans transition-colors duration-200"
                style={{
                  fontSize: "11px", fontWeight: 500, letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: activeTab === i ? "#E2C078" : "#6A6A70",
                  background: "none", border: "none",
                  borderBottom: "2px solid transparent",
                  padding: "13px 18px", cursor: "pointer",
                  marginBottom: -1,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab panels */}
          {ROOTS_TABS.map((t, i) => (
            <AnimatePresence key={t.id} mode="wait">
              {activeTab === i && (
                <motion.div
                  id={`panel-${t.id}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${t.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    background: "rgba(14,13,12,.7)",
                    border: "1px solid rgba(237,235,227,.07)",
                    borderTop: "none",
                    borderRadius: "0 0 14px 14px",
                    padding: "40px 44px",
                    maxWidth: 1080,
                  }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* ── LEFT COLUMN ── */}
                    <div>
                      {/* Era / label */}
                      <div className="font-sans mb-3" style={{ fontSize: "10px", letterSpacing: ".2em", textTransform: "uppercase", color: "#6A6A70" }}>
                        <span className="font-serif italic" style={{ fontSize: 15, color: "#C9A24A", marginRight: 8 }}>{t.num}</span>
                        {t.label} · {t.period}
                      </div>

                      {/* Title */}
                      <h3 className="font-serif mb-1" style={{ fontSize: "clamp(22px,2.3vw,30px)", fontWeight: 400, color: "#EDEBE3", lineHeight: 1.1 }}>
                        {t.title}
                      </h3>

                      {/* Sub */}
                      <p className="font-sans mb-5" style={{ fontSize: "10px", letterSpacing: ".18em", textTransform: "uppercase", color: "#4A4A52" }}>
                        {t.sub}
                      </p>

                      {/* Body */}
                      <p style={{ color: "#97979C", fontWeight: 300, fontSize: 15, lineHeight: 1.7 }}>
                        {t.body}
                      </p>

                      {/* ── SCAR BOX — cinematic ── */}
                      <div
                        className="mt-6"
                        style={{
                          background: "rgba(18,15,8,.9)",
                          borderLeft: "2.5px solid #C9A24A",
                          borderRadius: "0 10px 10px 0",
                          padding: "22px 26px 24px",
                          boxShadow: "0 0 40px -18px rgba(201,162,74,.35), inset 0 0 24px -16px rgba(201,162,74,.08)",
                        }}
                      >
                        <span className="font-sans block mb-3" style={{ fontSize: "9.5px", fontWeight: 600, letterSpacing: ".28em", textTransform: "uppercase", color: "#C9A24A", opacity: .7 }}>
                          The Scar
                        </span>
                        <p className="font-serif italic" style={{ fontSize: "clamp(18px,1.8vw,22px)", lineHeight: 1.44, color: "#E2C078", margin: 0 }}>
                          {t.scar}
                        </p>
                      </div>
                    </div>

                    {/* ── RIGHT COLUMN ── */}
                    <div>
                      {/* Installations header */}
                      <span className="font-sans block mb-4" style={{ fontSize: "9.5px", fontWeight: 500, letterSpacing: ".22em", textTransform: "uppercase", color: "#4A4A52" }}>
                        The Installations
                      </span>

                      {/* Stepped ledger — mini spine */}
                      <div className="relative">
                        {/* Mini spine */}
                        <div
                          className="absolute pointer-events-none"
                          style={{
                            left: 18, top: 6, bottom: 6, width: 1,
                            background: "linear-gradient(180deg, rgba(201,162,74,.12), rgba(201,162,74,.22))",
                          }}
                        />

                        {t.installations.map((inst, j) => (
                          <motion.div
                            key={j}
                            whileHover={{ x: 3, backgroundColor: "rgba(201,162,74,.03)" }}
                            transition={{ duration: 0.18 }}
                            className="relative flex gap-4 py-3 px-2 rounded-lg"
                            style={{
                              borderTop: j === 0 ? "none" : "1px solid rgba(237,235,227,.06)",
                              cursor: "default",
                            }}
                          >
                            {/* Numeral node on mini spine */}
                            <div
                              className="shrink-0 font-serif italic"
                              style={{
                                width: 36, height: 36,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                borderRadius: "50%",
                                background: "#0A0A0B",
                                border: "1px solid rgba(201,162,74,.22)",
                                fontSize: 13,
                                color: "#C9A24A",
                                zIndex: 2,
                                flexShrink: 0,
                              }}
                            >
                              {inst.n}
                            </div>
                            <div style={{ paddingTop: 6 }}>
                              <strong className="block font-sans" style={{ fontWeight: 500, fontSize: "14px", color: "#CCCAC2", marginBottom: 3, lineHeight: 1.2 }}>
                                {inst.title}
                              </strong>
                              <span style={{ fontSize: "13.5px", color: "#6A6A70", lineHeight: 1.52 }}>
                                {inst.desc}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* What this installed */}
                      <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(237,235,227,.07)" }}>
                        <span className="font-sans block mb-2" style={{ fontSize: "9.5px", fontWeight: 500, letterSpacing: ".2em", textTransform: "uppercase", color: "#4A4A52" }}>
                          What this collision installed
                        </span>
                        <p style={{ color: "#97979C", fontSize: "14px", lineHeight: 1.58 }}>{t.installed}</p>
                      </div>

                      {/* Tag pill */}
                      <span
                        className="inline-flex items-center font-sans mt-4"
                        style={{
                          fontSize: "10.5px", fontWeight: 500, letterSpacing: ".08em",
                          color: "#E2C078",
                          border: "1px solid rgba(201,162,74,.22)",
                          borderRadius: 30, padding: "7px 16px",
                        }}
                      >
                        {t.tag}
                      </span>

                      {/* ── DOCTRINE PROGRESS ── */}
                      <div className="mt-6 pt-5" style={{ borderTop: "1px solid rgba(237,235,227,.07)" }}>
                        <span className="font-sans block mb-3" style={{ fontSize: "9px", fontWeight: 500, letterSpacing: ".2em", textTransform: "uppercase", color: "#C9A24A", opacity: .6 }}>
                          Operating Architect · Doctrine Progress
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {ALL_DOCTRINE.map((d, di) => {
                            const tabIndex = ROOTS_TABS.findIndex(tab => tab.doctrine.includes(d));
                            const isEarned = tabIndex !== -1 && tabIndex < i;
                            const isCurrent = t.doctrine.includes(d);
                            const isUpcoming = !isEarned && !isCurrent;
                            return (
                              <span
                                key={d}
                                className="font-sans"
                                style={{
                                  fontSize: "9px", fontWeight: isCurrent ? 600 : 400,
                                  letterSpacing: ".13em", textTransform: "uppercase",
                                  color: isCurrent ? "#000" : isEarned ? "#C9A24A" : "#3A3A40",
                                  background: isCurrent ? "#C9A24A" : isEarned ? "rgba(201,162,74,.10)" : "transparent",
                                  border: `1px solid ${isCurrent ? "#C9A24A" : isEarned ? "rgba(201,162,74,.28)" : "rgba(237,235,227,.07)"}`,
                                  borderRadius: 20, padding: "5px 12px",
                                  transition: "all .25s",
                                }}
                              >
                                {isEarned && !isCurrent ? "✓ " : ""}{d}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          ))}

          {/* ── BRIDGE ── */}
          <Reveal delay={0.1}>
          <div
            className="relative"
            style={{ maxWidth: 860, margin: "72px auto 0" }}
          >
            {/* Ambient glow */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: "50%", top: "10%", width: 480, height: 320,
                transform: "translateX(-50%)",
                background: "radial-gradient(ellipse at center, rgba(201,162,74,.055), transparent 70%)",
              }}
            />

            {/* Gold-framed signature container */}
            <div
              className="relative text-center"
              style={{
                border: "1px solid rgba(201,162,74,.18)",
                borderRadius: 16,
                padding: "52px 60px 48px",
                background: "rgba(12,11,9,.5)",
              }}
            >
              {/* Corner accents — top */}
              <div className="absolute pointer-events-none" style={{ top: -1, left: 28, width: 48, height: 1, background: "#C9A24A", opacity: .5 }} />
              <div className="absolute pointer-events-none" style={{ top: -1, right: 28, width: 48, height: 1, background: "#C9A24A", opacity: .5 }} />

              {/* Label */}
              <span className="font-sans block mb-1" style={{ fontSize: "9.5px", fontWeight: 600, letterSpacing: ".32em", textTransform: "uppercase", color: "#C9A24A", opacity: .65 }}>
                The Bridge
              </span>
              <span className="font-sans block mb-8" style={{ fontSize: "9px", fontWeight: 400, letterSpacing: ".22em", textTransform: "uppercase", color: "#4A4A52" }}>
                Two pauses that reset the lens
              </span>

              {/* Central quote */}
              <blockquote
                className="font-serif italic mx-auto"
                style={{ fontSize: "clamp(21px,2.4vw,28px)", lineHeight: 1.44, color: "#EDEBE3", maxWidth: "26ch", marginBottom: 28 }}
              >
                "Not every chapter in a career needs to be a collision. Some need to be a clearing."
              </blockquote>

              {/* Recalibration line — quiet, centered, no box */}
              <p
                className="font-serif italic mx-auto"
                style={{ fontSize: "15.5px", lineHeight: 1.62, color: "#6A6A70", maxWidth: "52ch", marginBottom: 32 }}
              >
                Recognising when the professional timeline and the personal timeline need realignment is not weakness — it is the same first-principles thinking, applied to your own life.
              </p>

              {/* Divider */}
              <div style={{ width: 1, height: 32, background: "rgba(201,162,74,.22)", margin: "0 auto 32px" }} />

              {/* Two connector cards */}
              <div className="bridge-grid grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                {[
                  {
                    label: "The Discipline Bridge — Marico",
                    heading: "Where intensity paused and refocus began",
                    body: "Between the decade at Tata and the velocity of Udaan, a deliberate clearing — a mature, consumer-first organisation where the challenge was not building systems but sustaining and refining them.",
                    chips: ["Focus as Architecture", "Self-Architecture"],
                  },
                  {
                    label: "The Reality Bridge — Lodha",
                    heading: "When the plan and the situation diverge",
                    body: "A different sector, a different velocity. Conditions shifted from what had been anticipated — and navigating that shift compressed significant adaptability learning into a short, intense window.",
                    chips: ["Adaptability as Design", "Context Reading"],
                  },
                ].map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-8%" }}
                    transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      border: "1px solid rgba(201,162,74,.14)",
                      borderRadius: 10,
                      padding: "24px 26px",
                      background: "rgba(10,10,11,.6)",
                    }}
                  >
                    <span className="font-sans block mb-2" style={{ fontSize: "9.5px", fontWeight: 500, letterSpacing: ".18em", textTransform: "uppercase", color: "#C9A24A", opacity: .75 }}>
                      {c.label}
                    </span>
                    <h4 className="font-serif mb-3" style={{ fontWeight: 400, fontSize: 18, color: "#CCCAC2", lineHeight: 1.22 }}>
                      {c.heading}
                    </h4>
                    <p style={{ color: "#6A6A70", fontSize: "13.5px", fontWeight: 300, marginBottom: 14, lineHeight: 1.62 }}>
                      {c.body}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {c.chips.map((ch) => (
                        <span key={ch} className="font-sans inline-block" style={{ fontSize: "9px", fontWeight: 400, letterSpacing: ".1em", textTransform: "uppercase", color: "#4A4A52", border: "1px solid rgba(237,235,227,.07)", borderRadius: 20, padding: "4px 11px" }}>
                          {ch}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Corner accents — bottom */}
              <div className="absolute pointer-events-none" style={{ bottom: -1, left: 28, width: 48, height: 1, background: "#C9A24A", opacity: .5 }} />
              <div className="absolute pointer-events-none" style={{ bottom: -1, right: 28, width: 48, height: 1, background: "#C9A24A", opacity: .5 }} />
            </div>
          </div>
          </Reveal>
        </div>
      </section>

      {/* ── SYNTHESIS ── */}
      <section
        id="synthesis"
        className="relative"
        style={{ padding: "clamp(80px,12vh,140px) 0", borderTop: "1px solid var(--line)" }}
      >
        <div className="shell">
          <Reveal>
            <div className="text-center mb-16">
              <span className="eyebrow eyebrow--center mb-4 block">The Synthesis</span>
              <h2 className="h-section mx-auto" style={{ maxWidth: "20ch" }}>
                How the chapters became a way of working
              </h2>
            </div>
          </Reveal>

          {/* ── CRESCENDO TIMELINE ── */}
          <div className="synthesis-timeline relative" style={{ maxWidth: 800, margin: "0 auto 72px" }}>

            {/* Spine — draws top→bottom, gradient intensifies toward bedrock */}
            <motion.div
              className="synthesis-center-line absolute pointer-events-none"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                left: "50%", top: 8, bottom: 8, width: 1,
                background: "linear-gradient(180deg, rgba(201,162,74,.08) 0%, rgba(201,162,74,.22) 40%, rgba(201,162,74,.55) 75%, #C9A24A 100%)",
                transform: "translateX(-50%)",
                transformOrigin: "top",
              }}
            />

            {TIMELINE_ITEMS.map((item, i) => {
              const isOdd = i % 2 === 0;
              const isLast = i === TIMELINE_ITEMS.length - 1;

              /* Crescendo: opacity + size ramp cleanly, no accidental gold on text */
              const labelOpacity  = 0.28 + i * 0.10;   // 0.28 → 0.88
              const quoteOpacity  = 0.38 + i * 0.09;   // 0.38 → 0.92
              const quoteFontSize = 15 + i * 0.6;       // 15 → 18.6px
              const quoteWeight   = i >= 5 ? 400 : 300;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isOdd ? -18 : 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-8%" }}
                  transition={{ duration: 0.65, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                  style={{
                    width: "50%",
                    padding: isLast ? "20px 40px" : "14px 40px",
                    left: isOdd ? 0 : "50%",
                    textAlign: isOdd ? "right" : "left",
                  }}
                >
                  {/* Spine node — lights up on enter */}
                  <motion.div
                    className="tl-dot absolute rounded-full"
                    initial={{ scale: 0.4, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.4, delay: i * 0.07 + 0.15, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      top: isLast ? 22 : 20,
                      width: isLast ? 13 : i === 0 ? 6 : 8,
                      height: isLast ? 13 : i === 0 ? 6 : 8,
                      background: i === 0 ? "rgba(201,162,74,.3)" : "#C9A24A",
                      right: isOdd ? (isLast ? -6.5 : i === 0 ? -3 : -4) : "auto",
                      left: !isOdd ? (isLast ? -6.5 : i === 0 ? -3 : -4) : "auto",
                      boxShadow: isLast ? "0 0 20px 3px rgba(201,162,74,.55)" : "none",
                      zIndex: 2,
                    }}
                  />

                  {/* Connector tick — faint horizontal line from spine to text */}
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      top: isLast ? 28 : 24,
                      width: 16,
                      height: 1,
                      background: `rgba(201,162,74,${0.08 + i * 0.03})`,
                      right: isOdd ? 24 : "auto",
                      left: !isOdd ? 24 : "auto",
                    }}
                  />

                  {/* Source label — fixed dim color, never gold, never wraps onto quote */}
                  <span
                    className="font-sans block mb-1"
                    style={{
                      fontSize: "9.5px",
                      fontWeight: 500,
                      letterSpacing: ".2em",
                      textTransform: "uppercase",
                      color: `rgba(201,162,74,${labelOpacity})`,
                      lineHeight: 1,
                    }}
                  >
                    {item.source}
                  </span>

                  {/* Conviction — always its own element, no colour bleed */}
                  <p
                    className="font-serif italic"
                    style={{
                      fontSize: quoteFontSize,
                      fontWeight: quoteWeight,
                      lineHeight: 1.44,
                      color: `rgba(237,235,227,${quoteOpacity})`,
                      margin: 0,
                    }}
                  >
                    {item.quote}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* ── BEDROCK ── */}
          <Reveal>
            <div className="text-center" style={{ marginBottom: 40 }}>
              <span className="font-sans block mb-4" style={{ fontSize: "9.5px", fontWeight: 600, letterSpacing: ".32em", textTransform: "uppercase", color: "#C9A24A", opacity: .65 }}>
                The Bedrock
              </span>
              <p
                className="font-serif italic mx-auto"
                style={{
                  fontSize: "clamp(20px,2.2vw,26px)",
                  lineHeight: 1.44,
                  color: "#EDEBE3",
                  maxWidth: "34ch",
                  marginBottom: 0,
                }}
              >
                Three sentences underwrite everything above.
              </p>
            </div>
          </Reveal>

          <div
            className="bedrock-grid grid grid-cols-1 md:grid-cols-3 gap-5"
            style={{ maxWidth: 1080, margin: "0 auto" }}
          >
            {[
              { k: "The Thesis",    v: "People Systems Fail Before Strategy Does" },
              { k: "The Framework", v: "Belief → Conviction → Rhythm" },
              { k: "The Credo",     v: "Humanity Over Hierarchy" },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5%" }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
                style={{
                  background: "rgba(14,13,11,.8)",
                  border: "1px solid rgba(201,162,74,.16)",
                  borderTop: `2px solid ${i === 2 ? "#E2C078" : "#C9A24A"}`,
                  borderRadius: 14,
                  padding: "44px 36px 40px",
                  boxShadow: `0 0 ${50 + i * 14}px -${22 - i * 3}px rgba(201,162,74,${0.22 + i * 0.12})`,
                }}
              >
                <span className="font-sans block mb-5" style={{ fontSize: "9.5px", fontWeight: 600, letterSpacing: ".22em", textTransform: "uppercase", color: "#C9A24A", opacity: .65 }}>
                  {card.k}
                </span>
                <p className="font-serif" style={{ fontWeight: 400, fontSize: "clamp(22px,2.2vw,28px)", lineHeight: 1.14, color: "#EDEBE3" }}>
                  {card.v}
                </p>
                {i < 2 && (
                  <motion.span
                    className="bedrock-arrow absolute font-serif"
                    initial={{ opacity: 0, x: -4 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.12 + 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{ right: -16, top: "50%", transform: "translateY(-50%)", color: "#C9A24A", fontSize: 18, zIndex: 2, opacity: .55 }}
                  >
                    →
                  </motion.span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPERATING PATTERNS ── */}
      <section
        id="patterns"
        className="relative"
        style={{ padding: "clamp(80px,12vh,140px) 0", borderTop: "1px solid var(--line)", background: "var(--bg-1)" }}
      >
        <div className="shell">

          {/* Intro */}
          <div style={{ maxWidth: 1120, margin: "0 auto 56px" }}>
            <Reveal>
              <span className="eyebrow mb-4 block">The Operating Patterns</span>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="font-serif" style={{ fontSize: "clamp(19px,2vw,24px)", lineHeight: 1.38, color: "#CCCAC2", maxWidth: "36ch" }}>
                What does an organisation actually run on — beneath the strategy, beneath the talent?
                Eight patterns. Two tiers. The difference between a system that holds and one that doesn't.
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <p style={{ marginTop: 14, fontSize: "15px", color: "#6A6A70", maxWidth: "62ch", lineHeight: 1.68 }}>
                The startup, the scaling company, the family business — the{" "}
                <em style={{ color: "#97979C", fontStyle: "italic" }}>unfinished organisation</em>{" "}
                — is still writing its operating system. These patterns are for them.
              </p>
            </Reveal>
          </div>

          <div style={{ maxWidth: 1120, margin: "0 auto" }}>

            {/* ── THRESHOLD FRAME ── */}
            <Reveal>
              <div
                className="relative mb-10"
                style={{
                  border: "1px solid rgba(237,235,227,.08)",
                  borderRadius: 16,
                  padding: "36px 36px 32px",
                  background: "rgba(10,10,11,.5)",
                }}
              >
                {/* Tier header */}
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="font-sans" style={{ fontSize: "10px", fontWeight: 600, letterSpacing: ".22em", textTransform: "uppercase", color: "#6A6A70" }}>
                    Threshold — the floor
                  </span>
                  <span
                    className="font-sans"
                    style={{ fontSize: "8.5px", fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: "#C9A24A", border: "1px solid rgba(201,162,74,.3)", borderRadius: 20, padding: "3px 9px" }}
                  >
                    Foundation
                  </span>
                </div>
                <p style={{ fontSize: "13.5px", color: "#4A4A52", maxWidth: "72ch", marginBottom: 24, lineHeight: 1.58 }}>
                  The mechanics every organisation runs on. Get these wrong and nothing above them holds.
                </p>

                <div className="patterns-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {PATTERNS_THRESHOLD.map((p, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-6%" }}
                      transition={{ duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                      className="pattern-card"
                      style={{
                        background: "rgba(14,13,11,.7)",
                        border: "1px solid rgba(237,235,227,.07)",
                        borderRadius: 10, padding: "22px 20px",
                      }}
                    >
                      <div className="font-serif italic mb-2" style={{ fontSize: 15, color: "rgba(201,162,74,.55)" }}>{p.num}</div>
                      <div className="font-serif mb-2" style={{ fontWeight: 400, fontSize: 18, color: "#CCCAC2", lineHeight: 1.14 }}>{p.name}</div>
                      <div className="font-serif italic mb-3" style={{ fontSize: "13px", lineHeight: 1.42, color: "rgba(201,162,74,.65)" }}>{p.signal}</div>
                      <div style={{ fontSize: "12.5px", color: "#5A5A62", lineHeight: 1.54 }}>{p.desc}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* ── SIGNATURE FRAME ── */}
            <Reveal delay={0.06}>
              <div
                className="relative mb-16"
                style={{
                  border: "1px solid rgba(201,162,74,.14)",
                  borderRadius: 16,
                  padding: "36px 36px 32px",
                  background: "rgba(12,11,9,.6)",
                  boxShadow: "0 0 60px -30px rgba(201,162,74,.12)",
                }}
              >
                {/* Tier header */}
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="font-sans" style={{ fontSize: "10px", fontWeight: 600, letterSpacing: ".22em", textTransform: "uppercase", color: "#6A6A70" }}>
                    Signature — the ceiling
                  </span>
                  <span
                    className="font-sans"
                    style={{ fontSize: "8.5px", fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: "#000", background: "#C9A24A", borderRadius: 20, padding: "3px 9px" }}
                  >
                    Differentiator
                  </span>
                </div>
                <p style={{ fontSize: "13.5px", color: "#4A4A52", maxWidth: "72ch", marginBottom: 24, lineHeight: 1.58 }}>
                  What separates a good organisation from a great one — designed in deliberately, not improvised under pressure.
                </p>

                <div className="patterns-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {PATTERNS_SIGNATURE.map((p, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-6%" }}
                      transition={{ duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                      className="pattern-card"
                      style={{
                        background: "rgba(14,13,11,.7)",
                        border: "1px solid rgba(201,162,74,.10)",
                        borderRadius: 10, padding: "22px 20px",
                      }}
                    >
                      <div className="font-serif italic mb-2" style={{ fontSize: 15, color: "rgba(201,162,74,.7)" }}>{p.num}</div>
                      <div className="font-serif mb-2" style={{ fontWeight: 400, fontSize: 18, color: "#EDEBE3", lineHeight: 1.14 }}>{p.name}</div>
                      <div className="font-serif italic mb-3" style={{ fontSize: "13px", lineHeight: 1.42, color: "rgba(201,162,74,.75)" }}>{p.signal}</div>
                      <div style={{ fontSize: "12.5px", color: "#6A6A70", lineHeight: 1.54 }}>{p.desc}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* ── STATEMENT OF BELIEF ── */}
            <Reveal>
              <div className="text-center" style={{ padding: "20px 0 8px" }}>
                <p
                  className="font-serif italic mx-auto"
                  style={{
                    fontSize: "clamp(26px,3.2vw,40px)",
                    lineHeight: 1.28,
                    color: "#EDEBE3",
                    maxWidth: "22ch",
                    letterSpacing: "-.01em",
                  }}
                >
                  <span style={{ color: "#C9A24A" }}>Talent</span> guarantees the ceiling.{" "}
                  <span style={{ color: "#C9A24A" }}>Patterns</span> guarantee the floor.
                </p>
              </div>
            </Reveal>

          </div>
        </div>
      </section>
      {/* ── WRITING & MEDIA ── */}
      <section
        id="writing"
        className="relative"
        style={{ padding: "clamp(80px,12vh,140px) 0", borderTop: "1px solid var(--line)" }}
      >
        <div className="shell">
          <Reveal>
            <div className="mb-10" style={{ maxWidth: 880 }}>
              <span className="eyebrow mb-4 block">Writing &amp; Media</span>
              <h2 className="h-section mb-4" style={{ maxWidth: "18ch" }}>The thinking, in the open</h2>
              <p className="lead" style={{ maxWidth: "62ch" }}>
                Essays, frameworks and field notes on building people systems for the new-age organisation — across articles, podcast and LinkedIn.
              </p>
            </div>
          </Reveal>

          {/* Featured article */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "block",
              background: "var(--bg-1)",
              border: "1px solid rgba(201,162,74,.28)",
              borderRadius: 14, padding: "34px 40px",
              maxWidth: 1080, margin: "0 auto 14px",
            }}
          >
            <span className="font-mono block mb-2" style={{ fontSize: 10, fontWeight: 500, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--accent)" }}>
              {ARTICLES_FEATURED.cat}
            </span>
            <h3 className="font-serif mb-2" style={{ fontSize: "clamp(24px,3vw,32px)", lineHeight: 1.16, color: "var(--fg)", fontWeight: 500, maxWidth: "22ch" }}>
              {ARTICLES_FEATURED.title}
            </h3>
            <span className="font-mono" style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--accent)" }}>
              {ARTICLES_FEATURED.meta}
            </span>
          </motion.div>

          {/* Article grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            style={{ maxWidth: 1080, margin: "0 auto 24px" }}
          >
            {ARTICLES.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 12, padding: "24px 26px" }}
              >
                <span className="font-mono block mb-2" style={{ fontSize: 10, fontWeight: 500, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--accent)" }}>{a.cat}</span>
                <h4 className="font-serif" style={{ fontSize: 18, lineHeight: 1.24, color: "var(--fg)", marginTop: 10 }}>{a.title}</h4>
                <span className="font-mono block mt-3" style={{ fontSize: "9.5px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--accent)" }}>Publishing soon</span>
              </motion.div>
            ))}
          </div>

          {/* Channels */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
            style={{ maxWidth: 1080, margin: "0 auto 24px" }}
          >
            <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 12, padding: "26px 30px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18 }}>
              <div>
                <span className="font-mono block mb-1" style={{ fontSize: "10.5px", fontWeight: 500, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--accent)" }}>Podcast</span>
                <h4 className="font-serif" style={{ fontSize: 21, color: "var(--fg)", fontWeight: 500, marginTop: 5 }}>Conversations on the operating architecture of people</h4>
                <span className="font-mono block mt-1" style={{ fontSize: "9.5px", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--accent)" }}>Coming soon</span>
              </div>
            </div>
            <a
              href="https://www.linkedin.com/in/nitinnahata"
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 12, padding: "26px 30px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, textDecoration: "none" }}
            >
              <div>
                <span className="font-mono block mb-1" style={{ fontSize: "10.5px", fontWeight: 500, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--accent)" }}>LinkedIn</span>
                <h4 className="font-serif" style={{ fontSize: 21, color: "var(--fg)", fontWeight: 500, marginTop: 5 }}>Field notes and frameworks, as they form</h4>
                <span className="font-mono block mt-1" style={{ fontSize: "9.5px", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--accent)" }}>Followed by founders &amp; operators</span>
              </div>
              <span className="font-mono shrink-0" style={{ fontSize: "10.5px", fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--accent)" }}>Follow ↗</span>
            </a>
          </div>

          {/* Newsletter capture */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center"
            style={{ maxWidth: 1080, margin: "0 auto", background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 12, padding: "32px 36px" }}
          >
            <div>
              <h4 className="font-serif mb-1" style={{ fontSize: 23, color: "var(--fg)", fontWeight: 500 }}>Read the thinking as it's written</h4>
              <p style={{ fontSize: 14, color: "var(--fg-3)", marginTop: 6 }}>New essays direct to your inbox — no spam, unsubscribe anytime.</p>
            </div>
            <div>
              {submittedNews ? (
                <span className="font-mono" style={{ fontSize: 14, color: "var(--accent)" }}>✓ You're on the list.</span>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="you@company.com"
                    aria-label="Email for newsletter"
                    value={emailNews}
                    onChange={e => setEmailNews(e.target.value)}
                    className="flex-1 font-sans"
                    style={{ fontSize: 14, padding: "12px 14px", border: "1px solid var(--line)", borderRadius: 5, background: "var(--bg)", color: "var(--fg)", outline: "none" }}
                  />
                  <button
                    type="button"
                    onClick={() => setSubmittedNews(true)}
                    className="font-mono shrink-0"
                    style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase", background: "var(--accent)", color: "#000", border: "none", borderRadius: 5, padding: "0 20px", cursor: "pointer" }}
                  >
                    Notify me
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* ── VISION ── */}
      <section
        id="vision"
        className="relative"
        style={{ padding: "clamp(80px,12vh,140px) 0", borderTop: "1px solid var(--line)" }}
      >
        <div className="shell">
          <Reveal>
            <div className="mb-10">
              <span className="eyebrow mb-4 block">The Vision</span>
              <h2 className="h-section" style={{ maxWidth: "18ch" }}>The arc continues — as a loop</h2>
            </div>
          </Reveal>

          {/* Loop */}
          <div
            className="founder-loop grid gap-3 mb-6"
            style={{ gridTemplateColumns: "1fr auto 1fr auto 1fr", maxWidth: 1040, margin: "0 auto 36px", alignItems: "stretch" }}
          >
            {[
              { sn: "01 · Lived",   title: "The Practice",   body: "23 years of collisions — the scars that became the raw material." },
              { sn: "02 · Written", title: "The Philosophy",  body: "Two books in progress — Baptism by Chaos and The Operating Architect — codifying the patterns into a body of work." },
              { sn: "03 · Applied", title: "The Applied Loop", body: "Axion Index — the operating-architecture advisory practice — and HROS, an AI-native people operating system, in development." },
            ].map((stage, i) => (
              <>
                <motion.div
                  key={stage.sn}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 12, padding: "32px 28px" }}
                >
                  <span className="font-mono block mb-2" style={{ fontSize: "10.5px", fontWeight: 500, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--accent)" }}>{stage.sn}</span>
                  <h4 className="font-serif mb-3" style={{ fontSize: 22, color: "var(--fg)", fontWeight: 500 }}>{stage.title}</h4>
                  <p style={{ color: "var(--fg-3)", fontSize: "14.5px" }}>{stage.body}</p>
                  {i === 2 && (
                    <a
                      href="#system"
                      className="font-mono inline-block mt-4"
                      style={{ fontSize: "10.5px", fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--accent)", border: "1px solid rgba(201,162,74,.28)", borderRadius: 30, padding: "8px 15px" }}
                    >
                      See the system
                    </a>
                  )}
                </motion.div>
                {i < 2 && (
                  <div key={`arr-${i}`} className="loop-arrow flex items-center justify-center" style={{ color: "var(--accent)", fontSize: 22 }}>→</div>
                )}
              </>
            ))}
          </div>

          <p className="font-mono text-center mb-10" style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--accent)", opacity: .6 }}>
            ↺&nbsp;&nbsp;theory returns to practice
          </p>

          {/* Closing */}
          <div className="text-center" style={{ maxWidth: 760, margin: "0 auto" }}>
            <p className="font-serif italic mb-5" style={{ fontSize: 22, color: "var(--accent-2)" }}>
              The loop closes where it began — in practice.
            </p>
            <blockquote className="font-serif italic" style={{ fontSize: "clamp(21px,2.7vw,29px)", lineHeight: 1.42, color: "var(--fg)" }}>
              "The founders who once watched me build are part of what comes next. The rest, I'm still building."
            </blockquote>
            <div className="flex flex-col items-center gap-1 mt-8">
              <span style={{ color: "#C9A24A", fontSize: 18 }}>◇</span>
              <span className="font-serif" style={{ fontSize: 22, color: "#E2C078" }}>Nitin Nahata</span>
              <span className="font-sans" style={{ fontSize: "10.5px", fontWeight: 500, letterSpacing: ".18em", textTransform: "uppercase", color: "#6A6A70" }}>The Operating Architect</span>
              <a
                href="https://www.linkedin.com/in/nitinnahata"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans mt-2"
                style={{ fontSize: "10.5px", color: "#C9A24A" }}
              >
                LinkedIn ↗
              </a>
            </div>

            {/* Axion CTA */}
            <Reveal delay={0.1}>
              <div
                className="mt-14 mx-auto"
                style={{
                  maxWidth: 560,
                  background: "rgba(201,162,74,.04)",
                  border: "1px solid rgba(201,162,74,.22)",
                  borderRadius: 14,
                  padding: "40px 44px",
                  textAlign: "center",
                }}
              >
                <span className="font-sans block mb-3" style={{ fontSize: "10.5px", fontWeight: 500, letterSpacing: ".22em", textTransform: "uppercase", color: "#C9A24A" }}>
                  Axion Index
                </span>
                <p className="font-serif" style={{ fontSize: "clamp(18px,2vw,22px)", lineHeight: 1.36, color: "#EDEBE3", marginBottom: 22 }}>
                  The operating-architecture advisory practice — for founders and operators building the unfinished organisation.
                </p>
                <a
                  href="https://axionindex.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans inline-flex items-center gap-2"
                  style={{
                    fontSize: "11.5px", fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase",
                    color: "#000", background: "#C9A24A",
                    borderRadius: 4, padding: "13px 26px",
                    textDecoration: "none",
                  }}
                >
                  Visit Axion Index ↗
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "var(--bg-1)", borderTop: "1px solid rgba(201,162,74,.28)", padding: "68px 0 36px" }}>
        <div className="shell">
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-9 items-center mb-12"
          >
            <div>
              <h4 className="font-serif mb-2" style={{ fontSize: 26, color: "var(--fg)", fontWeight: 500, lineHeight: 1.2 }}>
                Codifying the operating patterns of the unfinished organisation.
              </h4>
              <p style={{ color: "var(--fg-3)", fontSize: 14, marginTop: 8 }}>Essays, frameworks and the build — followed by founders and operators.</p>
            </div>
            <div>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="you@company.com"
                  aria-label="Email"
                  className="flex-1 font-sans"
                  style={{ fontSize: 14, padding: "12px 14px", border: "1px solid rgba(201,162,74,.28)", borderRadius: 6, background: "var(--bg)", color: "var(--fg)", outline: "none" }}
                />
                <button
                  type="button"
                  className="font-mono shrink-0"
                  style={{ fontSize: 12, fontWeight: 500, letterSpacing: ".08em", textTransform: "uppercase", background: "var(--accent)", color: "#000", border: "none", borderRadius: 6, padding: "0 22px", cursor: "pointer" }}
                >
                  Follow
                </button>
              </div>
            </div>
          </div>
          <div
            className="flex flex-wrap items-center justify-between gap-3 pt-6"
            style={{ borderTop: "1px solid var(--line)" }}
          >
            <div className="flex flex-wrap gap-5">
              {[
                { href: "https://www.linkedin.com/in/nitinnahata", label: "LinkedIn", external: true },
                { href: "https://axionindex.org", label: "Axion Index", external: true },
                { href: "/", label: "Home" },
                { href: "#story", label: "Story" },
              ].map((l) =>
                l.external ? (
                  <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="font-mono" style={{ fontSize: 11, letterSpacing: ".08em", color: "var(--fg-5)" }}>{l.label}</a>
                ) : (
                  <Link key={l.label} href={l.href} className="font-mono" style={{ fontSize: 11, letterSpacing: ".08em", color: "var(--fg-5)" }}>{l.label}</Link>
                )
              )}
            </div>
            <span className="font-mono" style={{ fontSize: "10.5px", color: "var(--fg-5)" }}>© 2026 Nitin Nahata. All rights reserved.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
