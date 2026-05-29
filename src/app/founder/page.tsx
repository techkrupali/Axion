"use client";

import { useState, useEffect, Fragment } from "react";
import Image from "next/image";
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

const ARTICLES_FEATURED = { 
  cat: "AI & HR", 
  title: "Should AI Replace Empathy? The Limits of Technology in Hiring", 
  whyItMatters: "Hiring is not a process problem. It is a judgment architecture problem." 
};

const ARTICLES = [
  { 
    cat: "Startups",      
    title: "HR in Start-Ups: Unconventional Wisdom and Constant Re-Alignment",
    whyItMatters: "Startup physics is not slower institutional physics. It is a different machine."
  },
  { 
    cat: "HR Strategy",   
    title: "What Does HR Want? A Deep Dive Into the Wishlist of HR Leaders",
    whyItMatters: "What HR asks for reveals where the operating system is breaking."
  },
  { 
    cat: "HR Leadership", 
    title: "The Art of Being Relevant: Where Does the HR Function Stand?",
    whyItMatters: "HR earns the seat when the business cannot decide without it."
  },
  { 
    cat: "HR Tech",       
    title: "Beyond Tech: How Far Can HR Tech Address Human Emotions?",
    whyItMatters: "HR tech fails when it automates workflow without redesigning consequence."
  },
  { 
    cat: "Performance",   
    title: "Continuous Feedback Through 'Konversations'",
    whyItMatters: "Feedback is not a tool. It is commitment architecture."
  },
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
    { href: "#writing",  label: "Field Notes" },
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
        .fn-brand { font-family: var(--font-serif), 'Cormorant Garamond', Georgia, serif; font-size: 20px; font-weight: 400; color: #EDEBE3; letter-spacing: .01em; text-decoration: none; }
        .fn-nl { display: flex; align-items: center; gap: 30px; }
        .fn-nl a { font-family: var(--font-geist-sans), system-ui, sans-serif; font-size: 11px; font-weight: 500; letter-spacing: .18em; text-transform: uppercase; color: #6A6A70; transition: color .2s; padding: 5px 0; position: relative; text-decoration: none; }
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
              href="/"
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
                width: 340, height: 340, borderRadius: "50%",
                border: "1px solid rgba(201,162,74,.10)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto",
              }}
            >
              {/* Inner ring */}
              <div
                style={{
                  width: 300, height: 300, borderRadius: "50%",
                  border: "1px solid rgba(201,162,74,.32)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 80px -30px rgba(201,162,74,.55), inset 0 0 40px -20px rgba(201,162,74,.06)",
                  overflow: "hidden",
                }}
              >
                <Image
                  src="/nitishcolorfull.png"
                  alt="Nitin Nahata"
                  width={300}
                  height={300}
                  style={{ objectFit: "cover", width: "100%", height: "100%", borderRadius: "50%" }}
                  priority
                />
              </div>
            </div>
            {/* Caption */}
            <div
              style={{
                marginTop: 24,
                display: "inline-block",
                border: "1px solid rgba(201,162,74,0.4)",
                borderRadius: 10,
                padding: "14px 32px",
                background: "rgba(201,162,74,0.07)",
                boxShadow: "0 0 24px -8px rgba(201,162,74,0.2)",
              }}
            >
              <p
                className="font-sans"
                style={{ fontSize: "12px", fontWeight: 600, letterSpacing: ".32em", textTransform: "uppercase", color: "#C9A24A", margin: 0 }}
              >
                The Operating Architect
              </p>
            </div>
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
      <section className="section-deep overflow-hidden" id="soil">
        {/* Header */}
        <div className="shell pt-12 pb-2">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <Reveal>
              <span className="eyebrow text-[var(--accent)]">The Soil · Before 2003</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="h-section lg:text-right">
                Where the operating system<br />
                <em>began writing itself.</em>
              </h2>
            </Reveal>
          </div>
        </div>

        {/* Steps — full-width staggered rows */}
        {STRATA.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.04, y: -8, zIndex: 10 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
            className="group relative border-t border-[var(--line)] transition-all duration-500 cursor-default"
            style={{ position: "relative" }}
          >
            {/* Hover background glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[4px]"
              style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.04) 0%, transparent 100%)", boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 40px rgba(201,168,76,0.06), inset 0 0 0 1px rgba(201,168,76,0.15)" }}
            />

            {/* Ghost number watermark — clipped to row, no overflow */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 font-serif italic text-[22vw] leading-none text-white opacity-[0.018] pointer-events-none select-none transition-opacity duration-700 group-hover:opacity-[0.04] overflow-hidden ${i % 2 === 1 ? "right-8" : "left-0"}`}
              style={{ maxWidth: "40%" }}
            >
              {i + 1}
            </div>

            <div className="shell py-6 lg:py-10 flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-0">
              {/* Step tag — always left on mobile */}
              <div className={`lg:w-1/4 flex flex-col gap-2 ${i % 2 === 1 ? "lg:items-end lg:text-right" : ""}`}>
                <span className="font-mono text-[9px] tracking-[0.5em] uppercase text-[var(--fg-5)] opacity-50 group-hover:opacity-100 group-hover:text-[var(--accent)] transition-all duration-500">{item.loc}</span>
                <div className="flex items-center gap-3">
                  <span
                    className="font-serif italic text-[clamp(40px,6vw,72px)] leading-none group-hover:text-[var(--accent)] transition-colors duration-500"
                    style={{ WebkitTextStroke: "1px currentColor", color: "transparent" }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="font-serif italic text-[clamp(24px,4vw,42px)] leading-none text-[var(--accent)] opacity-70 group-hover:opacity-100 transition-all duration-500"
                  >
                    {item.num}
                  </span>
                </div>
              </div>

              {/* Divider line — desktop */}
              <div className="hidden lg:block lg:w-px lg:self-stretch mx-12 bg-gradient-to-b from-transparent via-[var(--line-strong)] to-transparent group-hover:via-[var(--accent)] transition-colors duration-500" />

              {/* Content — always left on mobile */}
              <div className={`flex-1 ${i % 2 === 1 ? "lg:text-right" : ""}`}>
                <h3 className="font-serif text-[clamp(22px,3vw,36px)] leading-[1.1] text-[var(--fg-2)] group-hover:text-[var(--fg)] transition-colors duration-500 mb-3">
                  {item.title}
                </h3>
                <p
                  className="font-sans text-[14px] text-[var(--fg-3)] group-hover:text-[var(--fg-2)] transition-colors duration-500 max-w-[52ch] mb-3"
                  style={{ marginLeft: i % 2 === 1 ? "auto" : undefined, lineHeight: 1.6 }}
                >
                  {item.body}
                </p>
                <blockquote
                  className="font-serif italic text-[14px] text-[var(--accent)] border-l-[1.5px] border-[rgba(201,162,74,.3)] pl-3"
                  style={{ marginLeft: i % 2 === 1 ? "auto" : undefined, maxWidth: "52ch" }}
                >
                  {item.pq}
                </blockquote>
                {item.last && (
                  <div className="font-mono mt-3" style={{ fontSize: "9px", letterSpacing: ".28em", textTransform: "uppercase", color: "#C9A24A" }}>
                    ◆ Bedrock
                  </div>
                )}
              </div>
            </div>

            {/* Bottom gold line — always visible faint, full on hover */}
            <div className="absolute bottom-0 left-0 h-[1px] w-0 group-hover:w-full bg-gradient-to-r from-[var(--accent)] via-[var(--accent)] to-transparent transition-all duration-700" />
          </motion.div>
        ))}

        {/* Closing line */}
        <div className="shell py-6">
          <Reveal>
            <p className="font-serif italic text-center text-[var(--fg-4)]" style={{ fontSize: 16, lineHeight: 1.5 }}>
              This was the soil. Everything that came after was built on it.
            </p>
          </Reveal>
        </div>

        <div className="h-px bg-[var(--line)] opacity-30" />
      </section>

      {/* ── ROOTS ── */}
      <section
        id="roots"
        className="relative section-deep overflow-hidden"
        style={{ padding: "clamp(60px,8vh,100px) 0" }}
      >
        {/* Header */}
        <div className="shell pt-8 pb-16">
          <Reveal>
            <div className="text-center">
              <span className="eyebrow text-[var(--accent)] block mb-6">The Roots · 2003 — Present</span>
              <h2 className="h-section mb-6 max-w-4xl mx-auto">
                Preparing for the war when you are not at war
              </h2>
              <p className="lead text-[var(--fg-4)] max-w-3xl mx-auto">
                Six collisions across institution and startup. In the early years the architecture was already built — the work was to operate inside it, learn its mechanics, understand what holds and what breaks. In the later years there was no architecture to inherit: only belief, speed and chaos.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Main interactive experience */}
        <div className="relative">
          {/* Vertical timeline spine */}
          <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px hidden lg:block" 
               style={{ background: "linear-gradient(180deg, rgba(201,162,74,0.1) 0%, rgba(201,162,74,0.4) 50%, rgba(201,162,74,0.1) 100%)" }} />
          
          {/* Timeline nodes */}
          {ROOTS_TABS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="shell py-8"
            >
              <div className={`flex flex-col lg:flex-row items-start gap-12 lg:gap-20 ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                {/* Timeline year marker */}
                <div className="hidden lg:flex items-center justify-center w-20 shrink-0">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 rounded-full" 
                         style={{ background: "radial-gradient(circle, rgba(201,162,74,0.3) 0%, transparent 70%)" }} />
                    <div className="relative w-16 h-16 rounded-full flex items-center justify-center"
                         style={{ 
                           background: activeTab === i ? "linear-gradient(135deg, #C9A24A 0%, #E2C078 100%)" : "#0A0A0B",
                           border: `2px solid ${activeTab === i ? "#C9A24A" : "rgba(201,162,74,0.3)"}`,
                           boxShadow: activeTab === i ? "0 0 40px rgba(201,162,74,0.4)" : "none",
                           transition: "all 0.4s ease"
                         }}>
                      <span className="font-serif italic text-xl" 
                            style={{ color: activeTab === i ? "#000" : "#C9A24A" }}>{i + 1}</span>
                    </div>
                  </motion.div>
                </div>

                {/* Main content card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setActiveTab(activeTab === i ? -1 : i)}
                  className="flex-1 cursor-pointer"
                  style={{ position: "relative" }}
                >
                  {/* Card glow */}
                  <div className="absolute -inset-2 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                       style={{ background: "radial-gradient(circle at center, rgba(201,162,74,0.1) 0%, transparent 70%)" }} />
                  
                  {/* Main card */}
                  <div className="relative rounded-3xl overflow-hidden"
                       style={{
                         background: activeTab === i 
                           ? "linear-gradient(135deg, rgba(201,162,74,0.12) 0%, rgba(14,13,12,0.95) 50%, rgba(201,162,74,0.08) 100%)"
                           : "linear-gradient(135deg, rgba(14,13,12,0.9) 0%, rgba(8,7,5,0.95) 100%)",
                         border: `1px solid ${activeTab === i ? "rgba(201,162,74,0.4)" : "rgba(237,235,227,0.08)"}`,
                         boxShadow: activeTab === i 
                           ? "0 25px 80px -20px rgba(201,162,74,0.25), 0 10px 40px -15px rgba(0,0,0,0.5), inset 0 1px 0 rgba(201,162,74,0.1)"
                           : "0 10px 40px -10px rgba(0,0,0,0.3)",
                         transition: "all 0.5s ease"
                       }}>
                    
                    {/* Card corner decorations */}
                    <div className="absolute top-4 left-4 w-12 h-12 border-t border-l"
                         style={{ borderColor: "rgba(201,162,74,0.2)" }} />
                    <div className="absolute top-4 right-4 w-12 h-12 border-t border-r"
                         style={{ borderColor: "rgba(201,162,74,0.2)" }} />
                    <div className="absolute bottom-4 left-4 w-12 h-12 border-b border-l"
                         style={{ borderColor: "rgba(201,162,74,0.2)" }} />
                    <div className="absolute bottom-4 right-4 w-12 h-12 border-b border-r"
                         style={{ borderColor: "rgba(201,162,74,0.2)" }} />

                    {/* Card header */}
                    <div className="p-8 lg:p-10 border-b" style={{ borderColor: "rgba(237,235,227,0.06)" }}>
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                        <div>
                          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--fg-5)] block mb-2">
                            {t.period}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="font-serif italic text-2xl text-[var(--accent)]">{t.num}</span>
                            <h3 className="font-serif text-2xl lg:text-3xl text-[var(--fg)]">{t.label}</h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {t.doctrine.map((d, di) => (
                              <span key={di} className="font-mono text-[9px] tracking-[0.2em] uppercase px-3 py-1 rounded-full"
                                    style={{ 
                                      background: "rgba(201,162,74,0.1)", 
                                      color: "#C9A24A",
                                      border: "1px solid rgba(201,162,74,0.25)"
                                    }}>
                                {d}
                              </span>
                            ))}
                          </div>
                          {activeTab === i && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTab(-1);
                              }}
                              className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                              style={{
                                background: "rgba(201,162,74,0.15)",
                                border: "1px solid rgba(201,162,74,0.3)"
                              }}
                            >
                              <span className="text-[var(--accent)] text-xl leading-none">×</span>
                            </motion.button>
                          )}
                        </div>
                      </div>
                      
                      <h4 className="font-serif text-xl lg:text-2xl text-[var(--fg-2)] mb-2">{t.title}</h4>
                      <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--fg-4)]">{t.sub}</p>
                    </div>

                    {/* Card body - expandable */}
                    <AnimatePresence>
                      {activeTab === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 lg:p-8 pt-4">
                            {/* Compact 2-col layout — fits in one viewport */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Left — body + scar */}
                              <div className="flex flex-col gap-4">
                                <p className="text-[var(--fg-3)] text-sm leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{t.body}</p>

                                {/* Scar */}
                                <div className="relative">
                                  <div className="absolute -left-4 top-0 bottom-0 w-1 rounded-full"
                                       style={{ background: "linear-gradient(180deg, #C9A24A 0%, rgba(201,162,74,0.2) 100%)" }} />
                                  <div className="pl-5">
                                    <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[var(--accent)] opacity-70 block mb-2">The Scar</span>
                                    <blockquote className="font-serif italic text-base lg:text-lg text-[var(--accent)] leading-snug">
                                      "{t.scar}"
                                    </blockquote>
                                  </div>
                                </div>

                                {/* Installed tag */}
                                <div className="mt-auto pt-3 border-t" style={{ borderColor: "rgba(237,235,227,0.06)" }}>
                                  <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[var(--fg-5)] block mb-2">What this installed</span>
                                  <p className="text-[var(--fg-3)] text-xs leading-relaxed">{t.installed}</p>
                                </div>
                              </div>

                              {/* Right — installations + tag */}
                              <div className="flex flex-col gap-3">
                                <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[var(--fg-5)] block">The Installations</span>
                                <div className="flex flex-col gap-2">
                                  {t.installations.map((inst, j) => (
                                    <motion.div
                                      key={j}
                                      initial={{ opacity: 0, x: 20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: j * 0.08 }}
                                      className="flex gap-3 p-3 rounded-xl"
                                      style={{ 
                                        background: "rgba(201,162,74,0.03)", 
                                        border: "1px solid rgba(201,162,74,0.1)" 
                                      }}
                                    >
                                      <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-mono text-[11px]"
                                           style={{ background: "#C9A24A", color: "#000" }}>
                                        {inst.n}
                                      </div>
                                      <div>
                                        <strong className="block text-[var(--fg)] text-sm">{inst.title}</strong>
                                        <p className="text-[var(--fg-4)] text-xs leading-relaxed">{inst.desc}</p>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>

                                {/* Tag bottom-right */}
                                <div className="mt-auto flex justify-end">
                                  <span className="inline-flex items-center font-mono text-[10px] tracking-[0.15em] uppercase px-4 py-2 rounded-full"
                                        style={{ 
                                          background: "linear-gradient(135deg, #C9A24A 0%, #E2C078 100%)", 
                                          color: "#000",
                                          boxShadow: "0 4px 16px rgba(201,162,74,0.25)"
                                        }}>
                                    {t.tag}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Expand hint */}
                    {activeTab !== i && (
                      <div className="px-8 pb-6 text-center">
                        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--fg-5)]">Click to expand</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}

          {/* ── BRIDGE ── */}
          <Reveal delay={0.1}>
          <div
            className="relative"
            style={{ maxWidth: 960, margin: "56px auto 0" }}
          >
            {/* Ambient glow */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: "50%", top: "0%", width: 500, height: 350,
                transform: "translateX(-50%)",
                background: "radial-gradient(ellipse at center, rgba(201,162,74,.07), transparent 70%)",
              }}
            />

            {/* Main content area */}
            <div
              className="relative"
              style={{
                background: "linear-gradient(135deg, rgba(201,162,74,.04) 0%, rgba(12,11,9,.65) 50%, rgba(201,162,74,.03) 100%)",
                border: "1px solid rgba(201,162,74,.15)",
                borderRadius: 16,
                padding: "36px 40px 40px",
                boxShadow: "0 0 70px -25px rgba(201,162,74,.18), inset 0 1px 0 rgba(201,162,74,.1)",
              }}
            >
              {/* Decorative corners */}
              <div className="absolute pointer-events-none" style={{ top: 16, left: 16, width: 50, height: 1, background: "linear-gradient(90deg, rgba(201,162,74,.5), transparent)" }} />
              <div className="absolute pointer-events-none" style={{ top: 16, right: 16, width: 50, height: 1, background: "linear-gradient(270deg, rgba(201,162,74,.5), transparent)" }} />
              <div className="absolute pointer-events-none" style={{ bottom: 16, left: 16, width: 50, height: 1, background: "linear-gradient(90deg, rgba(201,162,74,.5), transparent)" }} />
              <div className="absolute pointer-events-none" style={{ bottom: 16, right: 16, width: 50, height: 1, background: "linear-gradient(270deg, rgba(201,162,74,.5), transparent)" }} />

              {/* Header */}
              <div className="text-center mb-6">
                <span className="font-sans block mb-1" style={{ fontSize: "10px", fontWeight: 600, letterSpacing: ".32em", textTransform: "uppercase", color: "#C9A24A" }}>
                  The Bridge
                </span>
                <span className="font-sans block" style={{ fontSize: "11px", fontWeight: 400, letterSpacing: ".18em", textTransform: "uppercase", color: "#5A5A62" }}>
                  Two pauses that reset the lens
                </span>
              </div>

              {/* Central quote */}
              <blockquote
                className="font-serif italic text-center mx-auto"
                style={{
                  fontSize: "clamp(20px,2.2vw,26px)",
                  lineHeight: 1.45,
                  color: "#EDEBE3",
                  maxWidth: "30ch",
                  marginBottom: 16,
                }}
              >
                "Not every chapter in a career needs to be a collision. Some need to be a clearing."
              </blockquote>

              {/* Recalibration line */}
              <p
                className="font-serif italic text-center mx-auto"
                style={{ fontSize: "14px", lineHeight: 1.65, color: "#7A7A82", maxWidth: "52ch", marginBottom: 28 }}
              >
                Recognising when the professional timeline and the personal timeline need realignment is not weakness — it is the same first-principles thinking, applied to your own life.
              </p>

              {/* Decorative divider */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <div style={{ width: 32, height: 1, background: "linear-gradient(90deg, transparent, rgba(201,162,74,.35))" }} />
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(201,162,74,.45)" }} />
                <div style={{ width: 32, height: 1, background: "linear-gradient(270deg, transparent, rgba(201,162,74,.35))" }} />
              </div>

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
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-8%" }}
                    transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -3, boxShadow: "0 10px 35px -10px rgba(201,162,74,.28)" }}
                    style={{
                      border: "1px solid rgba(201,162,74,.18)",
                      borderRadius: 12,
                      padding: "22px 24px",
                      background: "rgba(10,10,11,.75)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Card top accent */}
                    <div
                      className="absolute top-0 left-0"
                      style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(201,162,74,.4), transparent)" }}
                    />
                    
                    {/* Label with diamond */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans" style={{ fontSize: "10px", fontWeight: 600, letterSpacing: ".15em", textTransform: "uppercase", color: "#C9A24A" }}>
                        {c.label}
                      </span>
                      <span style={{ color: "rgba(201,162,74,.25)", fontSize: 18 }}>◆</span>
                    </div>
                    
                    {/* Heading */}
                    <h4 className="font-serif mb-3" style={{ fontWeight: 400, fontSize: "clamp(18px,1.8vw,21px)", color: "#E8E6DE", lineHeight: 1.25 }}>
                      {c.heading}
                    </h4>
                    
                    {/* Body */}
                    <p style={{ color: "#7A7A82", fontSize: "14px", fontWeight: 300, marginBottom: 14, lineHeight: 1.6 }}>
                      {c.body}
                    </p>
                    
                    {/* Chips */}
                    <div className="flex flex-wrap gap-2">
                      {c.chips.map((ch) => (
                        <span
                          key={ch}
                          className="font-sans inline-block"
                          style={{
                            fontSize: "9px",
                            fontWeight: 500,
                            letterSpacing: ".08em",
                            textTransform: "uppercase",
                            color: "rgba(201,162,74,.9)",
                            background: "rgba(201,162,74,.1)",
                            border: "1px solid rgba(201,162,74,.2)",
                            borderRadius: 14,
                            padding: "4px 10px",
                          }}
                        >
                          {ch}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
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
                      fontWeight: 600,
                      letterSpacing: ".2em",
                      textTransform: "uppercase",
                      color: "#C9A24A",
                      textShadow: "0 0 12px rgba(201,162,74,0.7)",
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
          <div style={{ maxWidth: 1120, margin: "0 auto 56px", paddingLeft: "32px" }}>
            <Reveal>
              <span className="eyebrow mb-4 block" style={{ color: "#C9A24A" }}>The Operating Patterns</span>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="font-serif" style={{ fontSize: "clamp(19px,2vw,24px)", lineHeight: 1.38, color: "#CCCAC2", maxWidth: "36ch" }}>
                <span style={{ color: "#FFFFFF", textShadow: "0 0 20px rgba(255,255,255,0.4)" }}>What does an organisation actually run on — beneath the strategy, beneath the talent?</span>{" "}
                <span style={{ color: "#C9A24A" }}>Eight patterns. Two tiers. The difference between a system that holds and one that doesn't.</span>
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <p style={{ marginTop: 14, fontSize: "15px", color: "#6A6A70", maxWidth: "62ch", lineHeight: 1.68 }}>
                The startup, the scaling company, the family business — the{" "}
                <em style={{ color: "#C9A24A", fontStyle: "italic" }}>unfinished organisation</em>{" "}
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
                  <span className="font-sans" style={{ fontSize: "13px", fontWeight: 600, letterSpacing: ".22em", textTransform: "uppercase", color: "#EDEBE3" }}>
                    Threshold — the floor
                  </span>
                  <span
                    className="font-sans"
                    style={{ fontSize: "11px", fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: "#C9A24A", border: "1px solid rgba(201,162,74,.3)", borderRadius: 20, padding: "3px 9px" }}
                  >
                    Foundation
                  </span>
                </div>
                <p style={{ fontSize: "16px", color: "#4A4A52", maxWidth: "72ch", marginBottom: 24, lineHeight: 1.58 }}>
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
                      <div className="font-serif italic mb-2" style={{ fontSize: 17, color: "rgba(201,162,74,.55)" }}>{p.num}</div>
                      <div className="font-serif mb-2" style={{ fontWeight: 400, fontSize: 21, color: "#CCCAC2", lineHeight: 1.14 }}>{p.name}</div>
                      <div className="font-serif italic mb-3" style={{ fontSize: "15px", lineHeight: 1.42, color: "rgba(201,162,74,.65)" }}>{p.signal}</div>
                      <div style={{ fontSize: "14px", color: "#5A5A62", lineHeight: 1.54 }}>{p.desc}</div>
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
                  <span className="font-sans" style={{ fontSize: "13px", fontWeight: 600, letterSpacing: ".22em", textTransform: "uppercase", color: "#EDEBE3" }}>
                    Signature — the ceiling
                  </span>
                  <span
                    className="font-sans"
                    style={{ fontSize: "11px", fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: "#000", background: "#C9A24A", borderRadius: 20, padding: "3px 9px" }}
                  >
                    Differentiator
                  </span>
                </div>
                <p style={{ fontSize: "16px", color: "#4A4A52", maxWidth: "72ch", marginBottom: 24, lineHeight: 1.58 }}>
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
                      <div className="font-serif italic mb-2" style={{ fontSize: 17, color: "rgba(201,162,74,.7)" }}>{p.num}</div>
                      <div className="font-serif mb-2" style={{ fontWeight: 400, fontSize: 21, color: "#EDEBE3", lineHeight: 1.14 }}>{p.name}</div>
                      <div className="font-serif italic mb-3" style={{ fontSize: "15px", lineHeight: 1.42, color: "rgba(201,162,74,.75)" }}>{p.signal}</div>
                      <div style={{ fontSize: "14px", color: "#6A6A70", lineHeight: 1.54 }}>{p.desc}</div>
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
        style={{ 
          '--ink': '#0b0a08', '--paper': '#f5f0e8', '--gold': '#b8953a', '--gold-pale': '#e8d99a', '--dim': '#2a2720', '--mid': '#6b6450', '--rule': '#1e1c18', '--card': '#111009', '--serif': 'Georgia, "Times New Roman", serif', '--mono': '"Courier New", Courier, monospace',
          padding: 0, borderTop: '1px solid var(--rule)', background: 'var(--ink)', width: '100%', margin: 0 } as React.CSSProperties}
      >
        <style>{`
          /* ── Writing & Media Section Styles ── */
          .mast {
            display: grid; grid-template-columns: 1fr 1fr;
            border-bottom: 1px solid var(--rule);
            min-height: 420px;
            width: 100%;
          }
          .mast-l {
            padding: 56px 48px;
            border-right: 1px solid var(--rule);
            display: flex; flex-direction: column; justify-content: space-between;
          }
          .mast-r {
            padding: 56px 48px;
            display: flex; flex-direction: column; justify-content: flex-end;
            position: relative; overflow: hidden;
          }
          .mast-r-bg {
            position: absolute; inset: 0;
            background: repeating-linear-gradient(0deg, transparent, transparent 39px, #1a1814 39px, #1a1814 40px),
                       repeating-linear-gradient(90deg, transparent, transparent 39px, #1a1814 39px, #1a1814 40px);
            opacity: 0.5;
          }
          .wr-eyebrow {
            font-family: var(--mono); font-size: 14px; letter-spacing: 0.28em;
            color: var(--gold); text-transform: uppercase;
            display: flex; align-items: center; gap: 10px; margin-bottom: 32px;
          }
          .wr-eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
          .mast-title {
            font-size: clamp(50px, 7vw, 100px); font-weight: 400; line-height: 0.95;
            letter-spacing: -0.04em; color: var(--paper);
          }
          .mast-title .gold { color: var(--gold); font-style: italic; }
          .mast-title .ghost { color: #1e1c18; }
          .mast-meta {
            font-family: var(--mono); font-size: 14px; letter-spacing: 0.15em;
            color: var(--paper); line-height: 2; margin-top: auto; padding-top: 32px;
          }
          .mast-desc {
            position: relative; z-index: 1;
            font-size: clamp(18px, 2.5vw, 24px); color: var(--paper);
            font-style: italic; line-height: 1.6;
          }
          .mast-desc strong { color: var(--gold); font-style: normal; }
          .mast-stamp {
            position: relative; z-index: 1;
            margin-top: 24px;
            display: inline-flex; align-items: center; gap: 12px;
            font-family: var(--mono); font-size: 12px; letter-spacing: 0.2em; color: var(--gold);
            border: 1px solid var(--gold); padding: 12px 22px; cursor: pointer;
            transition: background 0.2s, color 0.2s;
          }
          .mast-stamp:hover { background: var(--gold); color: var(--ink); }
          .ticker {
            border-bottom: 1px solid var(--rule);
            overflow: hidden; padding: 0; height: 48px; display: flex; align-items: center;
          }
          .ticker-track {
            display: inline-flex; white-space: nowrap;
            animation: marquee 28s linear infinite;
          }
          .t-seg {
            display: inline-flex; align-items: center; gap: 20px; padding: 0 28px;
            font-family: var(--mono); font-size: 12px; letter-spacing: 0.22em; color: var(--paper); text-transform: uppercase;
          }
          .t-pip { width: 4px; height: 4px; border-radius: 50%; background: var(--gold); flex-shrink: 0; }
          .feat-wrap {
            border-bottom: 1px solid var(--rule);
            display: grid; grid-template-columns: 100px 1fr 320px;
            width: 100%;
          }
          .feat-num {
            border-right: 1px solid var(--rule);
            display: flex; align-items: flex-start; justify-content: center;
            padding: 40px 0 0;
            font-family: var(--mono); font-size: 14px; color: var(--paper); letter-spacing: 0.1em;
          }
          .feat-body {
            padding: 48px 56px; border-right: 1px solid var(--rule);
          }
          .feat-tag {
            display: inline-flex; gap: 10px; margin-bottom: 24px;
          }
          .pill {
            font-family: var(--mono); font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase;
            border: 1px solid var(--gold); color: var(--gold); padding: 8px 16px;
          }
          .pill.filled { background: var(--gold); color: var(--ink); }
          .feat-title {
            font-size: clamp(28px, 4.5vw, 56px); font-weight: 400; line-height: 1.1;
            letter-spacing: -0.02em; color: var(--paper); margin-bottom: 20px;
          }
          .feat-title em { color: var(--gold); }
          .feat-dek { font-size: 18px; color: var(--paper); line-height: 1.7; max-width: 600px; }
          .feat-aside {
            padding: 48px 40px;
            display: flex; flex-direction: column; justify-content: space-between;
          }
          .feat-label {
            font-family: var(--mono); font-size: 12px; letter-spacing: 0.2em; color: var(--paper); text-transform: uppercase;
            margin-bottom: 16px;
          }
          .feat-soon {
            font-size: clamp(36px, 5vw, 64px); font-weight: 300; color: #1e1c18;
            letter-spacing: -0.03em; line-height: 1;
          }
          .feat-soon strong { color: var(--gold); font-weight: 400; font-style: italic; }
          .cursor { animation: blink 1s step-end infinite; }
          .sec-head {
            display: flex; align-items: center; justify-content: space-between;
            padding: 28px 40px; border-bottom: 1px solid var(--rule);
            width: 100%;
          }
          .sec-title {
            font-family: var(--mono); font-size: 14px; letter-spacing: 0.28em; color: var(--paper); text-transform: uppercase;
          }
          .sec-meta { font-family: var(--mono); font-size: 12px; letter-spacing: 0.15em; color: var(--paper); }
          .essays-grid {
            display: grid; grid-template-columns: repeat(3, 1fr);
            border-bottom: 1px solid var(--rule);
            width: 100%;
          }
          .essay-card {
            padding: 40px 36px;
            border-right: 1px solid var(--rule);
            cursor: pointer; position: relative; overflow: hidden;
            transition: background 0.25s;
          }
          .essay-card:last-child { border-right: none; }
          .essay-card::after {
            content: ''; position: absolute; left: 0; top: 0; width: 2px; height: 0;
            background: var(--gold); transition: height 0.35s ease;
          }
          .essay-card:hover { background: var(--card); }
          .essay-card:hover::after { height: 100%; }
          .essay-row { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 18px; }
          .e-pill {
            font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
            border: 1px solid #2e2b22; color: var(--gold); padding: 6px 14px;
          }
          .e-num { font-family: var(--mono); font-size: 14px; color: var(--paper); }
          .e-title {
            font-size: clamp(18px, 2.5vw, 22px); font-weight: 400; color: var(--paper);
            line-height: 1.3; letter-spacing: -0.01em; margin-bottom: 24px;
          }
          .e-why {
            font-family: var(--serif); font-style: italic; font-size: 16px;
            color: var(--gold); opacity: 0.55; line-height: 1.6;
            margin-bottom: 20px; transition: opacity 0.2s;
          }
          .essay-card:hover .e-why { opacity: 0.85; }
          .e-arrow {
            font-family: var(--mono); font-size: 12px; letter-spacing: 0.2em; color: var(--paper);
            transition: color 0.2s, letter-spacing 0.3s;
          }
          .essay-card:hover .e-arrow { color: var(--gold); letter-spacing: 0.35em; }
          .essays-grid-2 {
            display: grid; grid-template-columns: 1fr 1fr;
            border-bottom: 1px solid var(--rule);
            width: 100%;
          }
          .essays-grid-2 .essay-card:last-child { border-right: none; }
          .essays-grid-2 .essay-card { border-right: 1px solid var(--rule); }
          .channels { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid var(--rule); width: 100%; }
          .ch-card {
            padding: 56px 48px;
            border-right: 1px solid var(--rule);
            position: relative; overflow: hidden; cursor: pointer;
            transition: background 0.25s;
          }
          .ch-card:last-child { border-right: none; }
          .ch-card:hover { background: var(--card); }
          .ch-type {
            font-family: var(--mono); font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase;
            color: var(--gold); margin-bottom: 24px; display: flex; align-items: center; gap: 10px;
          }
          .ch-type::before { content: ''; width: 16px; height: 1px; background: var(--gold); }
          .ch-name {
            font-size: clamp(24px, 4vw, 44px); font-weight: 400; line-height: 1.15;
            letter-spacing: -0.02em; color: var(--paper); margin-bottom: 20px;
          }
          .ch-name em { color: var(--gold); font-style: italic; }
          .ch-sub { font-family: var(--mono); font-size: 14px; letter-spacing: 0.12em; color: var(--paper); text-transform: uppercase; }
          .ch-cta {
            margin-top: 40px; display: inline-flex; align-items: center; gap: 10px;
            font-family: var(--mono); font-size: 12px; letter-spacing: 0.2em; color: var(--gold);
            border-bottom: 1px solid transparent; transition: border-color 0.2s;
          }
          .ch-card:hover .ch-cta { border-color: var(--gold); }
          .ch-soon {
            margin-top: 16px; font-family: var(--mono); font-size: 12px;
            letter-spacing: 0.15em; color: var(--paper); text-transform: uppercase;
          }
          .nl {
            padding: 72px 56px;
            display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
            width: 100%;
          }
          .nl-l .nl-eyebrow {
            font-family: var(--mono); font-size: 12px; letter-spacing: 0.28em; color: var(--gold);
            text-transform: uppercase; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;
          }
          .nl-l .nl-eyebrow::before { content: ''; width: 16px; height: 1px; background: var(--gold); }
          .nl-title {
            font-size: clamp(28px, 4.5vw, 52px); font-weight: 400; line-height: 1.1;
            letter-spacing: -0.02em; color: var(--paper); margin-bottom: 14px;
          }
          .nl-title em { color: var(--gold); }
          .nl-sub { font-size: 16px; color: var(--paper); line-height: 1.6; }
          .nl-form { display: flex; gap: 0; }
          .nl-input {
            flex: 1; background: #111009; border: 1px solid #2a2720; border-right: none;
            color: var(--paper); font-family: var(--mono); font-size: 16px;
            padding: 20px 24px; letter-spacing: 0.05em; outline: none;
            transition: border-color 0.2s;
          }
          .nl-input::placeholder { color: #2a2720; }
          .nl-input:focus { border-color: var(--gold); }
          .nl-btn {
            background: var(--gold); color: var(--ink); border: none;
            font-family: var(--mono); font-size: 14px; letter-spacing: 0.22em;
            text-transform: uppercase; padding: 20px 28px; cursor: pointer;
            transition: background 0.2s; white-space: nowrap;
          }
          .nl-btn:hover { background: var(--gold-pale); }
          .nl-note { font-family: var(--mono); font-size: 12px; color: var(--paper); letter-spacing: 0.1em; margin-top: 16px; }
          @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
          
          @media (max-width: 640px) {
            .mast, .feat-wrap, .essays-grid, .essays-grid-2, .channels, .nl { grid-template-columns: 1fr; }
            .mast-l, .feat-num, .feat-body, .feat-aside, .ch-card, .essay-card { border-right: none; border-bottom: 1px solid var(--rule); }
            .feat-wrap { grid-template-columns: 1fr; }
            .feat-num { display: none; }
            .nl { padding: 40px 24px; gap: 32px; }
            .nl-form { flex-direction: column; }
            .nl-input { border-right: 1px solid #2a2720; border-bottom: none; }
          }
        `}</style>

          
          {/* MASTHEAD */}
          <div className="mast">
            <div className="mast-l">
              <div>
                <div className="wr-eyebrow">Writing & Media</div>
                <div className="mast-title">
                  The<br/>thinking,<br/><span className="gold">in the</span><br/>open
                </div>
              </div>
              <div className="mast-meta">
                Essays · Frameworks · Field Notes<br/>
                Building people systems · Unfinished organisations<br/>
                Publishing through 2025–26
              </div>
            </div>
            <div className="mast-r">
              <div className="mast-r-bg"></div>
              <div className="mast-desc">
                Not thought leadership.<br/>
                <strong>Thought in progress.</strong><br/><br/>
                Essays written from inside organisations that are still figuring it out — where belief becomes operating rhythm, authority becomes clarity, and systems are tested under live conditions.
              </div>
              <button className="mast-stamp" onClick={() => {}}>
                READ THE INDEX ↗
              </button>
            </div>
          </div>

          {/* TICKER */}
          <div className="ticker">
            <div className="ticker-track">
              <div className="t-seg"><div className="t-pip"></div>AI & HR<div className="t-pip"></div>Startups<div className="t-pip"></div>HR Strategy<div className="t-pip"></div>HR Leadership<div className="t-pip"></div>HR Tech<div className="t-pip"></div>Performance</div>
              <div className="t-seg"><div className="t-pip"></div>AI & HR<div className="t-pip"></div>Startups<div className="t-pip"></div>HR Strategy<div className="t-pip"></div>HR Leadership<div className="t-pip"></div>HR Tech<div className="t-pip"></div>Performance</div>
            </div>
          </div>

          {/* FEATURED CONTEXT */}
          <div style={{ 
            padding: '32px 56px', 
            borderBottom: '1px solid var(--rule)',
            background: 'var(--ink)'
          }}>
            <p style={{ 
              fontFamily: 'var(--serif)', 
              fontStyle: 'italic', 
              fontSize: '18px', 
              color: 'var(--paper)',
              opacity: 0.7,
              maxWidth: '600px',
              margin: 0
            }}>
              Start here if you want to understand the shifts I’m writing from inside of.
            </p>
          </div>

          {/* FEATURED */}
          <div className="feat-wrap">
            <div className="feat-num">F·01</div>
            <div className="feat-body">
              <div className="feat-tag">
                <span className="pill filled">Featured</span>
                <span className="pill">AI & HR</span>
              </div>
              <div className="feat-title">Should AI Replace <em>Empathy?</em><br/>The Limits of Technology in Hiring</div>
              <div className="feat-dek"><em>Hiring is not a process problem. It is a judgment architecture problem.</em></div>
            </div>
            <div className="feat-aside">
              <div>
                <div className="feat-label">Status</div>
                <div className="feat-soon">Coming<br/><strong>soon<span className="cursor">_</span></strong></div>
              </div>
              <div className="feat-label">Estimated Q3 2025</div>
            </div>
          </div>

          {/* ESSAYS — row 1 (3-col) */}
          <div className="sec-head">
            <div className="sec-title">Essays</div>
            <div className="sec-meta">Publishing through 2025–26</div>
          </div>
          <div className="essays-grid">
            {ARTICLES.slice(0, 3).map((a, i) => (
              <div key={i} className="essay-card" onClick={() => {}}>
                <div className="essay-row"><span className="e-pill">{a.cat}</span><span className="e-num">0{i+1}</span></div>
                <div className="e-title">{a.title}</div>
                {a.whyItMatters && <div className="e-why">{a.whyItMatters}</div>}
                <div className="e-arrow">READ →</div>
              </div>
            ))}
          </div>

          {/* ESSAYS — row 2 (2-col) */}
          <div className="essays-grid-2">
            {ARTICLES.slice(3).map((a, i) => (
              <div key={i} className="essay-card" onClick={() => {}}>
                <div className="essay-row"><span className="e-pill">{a.cat}</span><span className="e-num">0{i+4}</span></div>
                <div className="e-title">{a.title}</div>
                {a.whyItMatters && <div className="e-why">{a.whyItMatters}</div>}
                <div className="e-arrow">READ →</div>
              </div>
            ))}
          </div>

          {/* CHANNELS */}
          <div className="sec-head">
            <div className="sec-title">Channels</div>
            <div className="sec-meta">Where the thinking lives</div>
          </div>
          <div className="channels">
            <div className="ch-card">
              <div className="ch-type">Podcast</div>
              <div className="ch-name">Conversations on the<br/><em>operating architecture</em><br/>of people</div>
              <div className="ch-soon">Coming soon</div>
              <div className="ch-cta">NOTIFY ME →</div>
            </div>
            <a className="ch-card" href="https://www.linkedin.com/in/nitinnahata" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div className="ch-type">LinkedIn</div>
              <div className="ch-name">Field notes and<br/><em>frameworks,</em><br/>as they form</div>
              <div className="ch-sub">Followed by founders & operators</div>
              <div className="ch-cta">FOLLOW →</div>
            </a>
          </div>

          {/* NEWSLETTER */}
          <div className="sec-head">
            <div className="sec-title">Newsletter</div>
            <div className="sec-meta">Direct to your inbox</div>
          </div>
          <div className="nl">
            <div className="nl-l">
              <div className="nl-eyebrow">Subscribe</div>
              <div className="nl-title">Read the thinking<br/><em>as it's written</em></div>
              <div className="nl-sub">New essays direct to your inbox — no spam, unsubscribe anytime.</div>
            </div>
            <div className="nl-r">
              <div className="nl-form">
                {submittedNews ? (
                  <span className="font-sans" style={{ fontSize: 14, color: '#b8953a' }}>✓ You're on the list.</span>
                ) : (
                  <>
                    <input
                      className="nl-input"
                      type="email"
                      placeholder="you@company.com"
                      value={emailNews}
                      onChange={(e) => setEmailNews(e.target.value)}
                    />
                    <button className="nl-btn" onClick={() => setSubmittedNews(true)}>Notify me</button>
                  </>
                )}
              </div>
              <div className="nl-note">No spam · Unsubscribe anytime · Essays only</div>
            </div>
          </div>
      </section>


      {/* ── BRIDGE BLOCK — Axion connection ── */}
      <section style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: 'clamp(72px, 10vw, 120px) clamp(24px, 6vw, 80px)',
        background: 'var(--ink)',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'var(--mono, monospace)',
          fontSize: '11px',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: '#b8953a',
          opacity: 1,
          marginBottom: '28px',
        }}>
          From thinking to architecture
        </p>
        <p style={{
          fontFamily: 'var(--serif)',
          fontSize: 'clamp(18px, 2.2vw, 26px)',
          fontWeight: 400,
          color: 'var(--paper)',
          lineHeight: 1.7,
          maxWidth: '640px',
          margin: '0 auto 48px',
          opacity: 0.85,
        }}>
          These essays are the public edge of work I&apos;m doing with organisations through{' '}
          <em>Axion Index</em> — translating doctrine into operating rhythm for founders,
          CHROs and boards navigating growth, AI and consequence.
        </p>
        <a
          href="https://axionindex.org"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            fontFamily: 'var(--mono, monospace)',
            fontSize: '12px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#b8953a',
            textDecoration: 'none',
            borderBottom: '1px solid rgba(184,149,58,0.35)',
            paddingBottom: '3px',
            transition: 'opacity 0.2s, border-color 0.2s',
            opacity: 1,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(201,168,76,0.8)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.8'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(201,168,76,0.35)'; }}
        >
          Start a conversation →
        </a>
      </section>


      {/* ── VISION ── */}
      <section
        id="vision"
        className="relative"
        style={{ padding: "clamp(80px,12vh,140px) 0", borderTop: "1px solid var(--line)" }}
      >
        {/* Ambient glow — peaks at the CTA */}
        <div className="absolute pointer-events-none" style={{ left: "50%", bottom: "10%", width: 600, height: 400, transform: "translateX(-50%)", background: "radial-gradient(ellipse at center, rgba(201,162,74,.06), transparent 70%)" }} />

        <div className="shell">

          {/* Section label */}
          <Reveal>
            <div className="mb-12" style={{ textAlign: "center" }}>
              <span className="eyebrow mb-4 block" style={{ color: "#C9A24A" }}>The Vision</span>
              <h2 className="h-section" style={{ maxWidth: "18ch", margin: "0 auto" }}>The arc continues — as a loop</h2>
            </div>
          </Reveal>

          {/* ── THREE-STAGE LOOP ── */}
          <div
            className="founder-loop grid gap-3"
            style={{ gridTemplateColumns: "1fr auto 1fr auto 1fr", maxWidth: 1040, margin: "0 auto 20px", alignItems: "stretch" }}
          >
            {[
              { sn: "01 · Lived",   title: "The Practice",    body: "23 years of collisions — the scars that became the raw material." },
              { sn: "02 · Written", title: "The Philosophy",   body: "Two books in progress — Baptism by Chaos and The Operating Architect — codifying the patterns into a body of work." },
              { sn: "03 · Applied", title: "The Applied Loop", body: "Axion Index — the operating-architecture advisory practice — and HROS, an AI-native people operating system, in development." },
            ].map((stage, i) => (
              <Fragment key={stage.sn}>
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    background: "rgba(12,11,9,.6)",
                    border: `1px solid ${i === 2 ? "rgba(201,162,74,.16)" : "rgba(237,235,227,.07)"}`,
                    borderRadius: 12, padding: "30px 26px",
                    boxShadow: i === 2 ? "0 0 40px -20px rgba(201,162,74,.18)" : "none",
                  }}
                >
                  <span className="font-sans block mb-2" style={{ fontSize: "9.5px", fontWeight: 500, letterSpacing: ".18em", textTransform: "uppercase", color: i === 2 ? "#C9A24A" : "#4A4A52" }}>
                    {stage.sn}
                  </span>
                  <h4 className="font-serif mb-3" style={{ fontSize: 20, color: i === 2 ? "#EDEBE3" : "#CCCAC2", fontWeight: 400, lineHeight: 1.18 }}>
                    {stage.title}
                  </h4>
                  <p style={{ color: "#6A6A70", fontSize: "13.5px", lineHeight: 1.6 }}>{stage.body}</p>
                </motion.div>
                {i < 2 && (
                  <div key={`arr-${i}`} className="loop-arrow flex items-center justify-center" style={{ color: "rgba(201,162,74,.3)", fontSize: 18 }}>→</div>
                )}
              </Fragment>
            ))}
          </div>



          {/* ── CLOSING FINALE ── */}
          <div className="text-center" style={{ maxWidth: 680, margin: "0 auto" }}>

            {/* Bridge line */}
            <Reveal>
              <p className="font-serif italic mb-6" style={{ fontSize: "clamp(16px,1.6vw,19px)", color: "#6A6A70", lineHeight: 1.5 }}>
                The loop closes where it began — in practice.
              </p>
            </Reveal>

            {/* Closing quote */}
            <Reveal delay={0.1}>
              <blockquote
                className="font-serif italic"
                style={{ fontSize: "clamp(22px,2.8vw,32px)", lineHeight: 1.38, color: "#EDEBE3", letterSpacing: "-.01em", marginBottom: 36 }}
              >
                "The founders who once watched me build are part of what comes next. The rest, I'm still building."
              </blockquote>
            </Reveal>

            {/* Signature */}
            <Reveal delay={0.18}>
              <div className="flex flex-col items-center gap-1 mb-14">
                <span style={{ color: "rgba(201,162,74,.4)", fontSize: 16, lineHeight: 1 }}>◇</span>
                <span className="font-serif" style={{ fontSize: 20, color: "#C9A24A", marginTop: 6 }}>Nitin Nahata</span>
                <span className="font-sans" style={{ fontSize: "9.5px", fontWeight: 500, letterSpacing: ".22em", textTransform: "uppercase", color: "#4A4A52" }}>
                  The Operating Architect
                </span>
                <a
                  href="https://www.linkedin.com/in/nitinnahata"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans mt-2"
                  style={{ fontSize: "10px", letterSpacing: ".08em", color: "#4A4A52", textDecoration: "none" }}
                >
                  LinkedIn ↗
                </a>
              </div>
            </Reveal>

            {/* ── SINGLE CTA — page's only ask ── */}
            <Reveal delay={0.28}>
              <div
                style={{
                  border: "1px solid rgba(201,162,74,.22)",
                  borderRadius: 14,
                  padding: "44px 48px",
                  background: "rgba(12,11,9,.7)",
                  boxShadow: "0 0 60px -24px rgba(201,162,74,.22)",
                }}
              >
                {/* Corner accents */}
                <div className="relative">
                  <div className="absolute pointer-events-none" style={{ top: -44, left: -48, width: 40, height: 1, background: "#C9A24A", opacity: .35 }} />
                  <div className="absolute pointer-events-none" style={{ top: -44, right: -48, width: 40, height: 1, background: "#C9A24A", opacity: .35 }} />

                  <span className="font-sans block mb-3" style={{ fontSize: "9.5px", fontWeight: 600, letterSpacing: ".28em", textTransform: "uppercase", color: "#C9A24A", opacity: .65 }}>
                    Axion Index
                  </span>
                  <p className="font-serif mx-auto mb-8" style={{ fontSize: "clamp(17px,1.8vw,21px)", lineHeight: 1.44, color: "#CCCAC2", maxWidth: "34ch" }}>
                    If the patterns in this page describe what your organisation is missing — the conversation starts here.
                  </p>

                  <a
                    href="https://axionindex.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans inline-flex items-center gap-3"
                    style={{
                      fontSize: "11px", fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase",
                      color: "#000", background: "#C9A24A",
                      borderRadius: 4, padding: "14px 30px",
                      textDecoration: "none",
                    }}
                  >
                    Start the conversation ↗
                  </a>

                  <p className="font-sans mt-4" style={{ fontSize: "11px", color: "#3A3A40", letterSpacing: ".04em" }}>
                    via Axion Index
                  </p>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative overflow-hidden" style={{ background: "var(--bg)", borderTop: "1px solid rgba(201,162,74,0.18)" }}>

        {/* Ghost wordmark */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[10%] font-serif italic font-bold leading-none pointer-events-none select-none whitespace-nowrap"
          style={{ fontSize: "18vw", color: "rgba(240,241,245,0.016)", letterSpacing: "-0.02em" }}
        >
          NITIN
        </div>

        {/* Top gold line */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[50%] h-[1px] pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, rgba(201,162,74,0.3), transparent)" }}
        />

        <div className="shell relative z-10">

          {/* ── Main grid ── */}
          <div className="pt-20 pb-16 grid grid-cols-1 lg:grid-cols-[1.8fr_1fr_1fr] gap-14 lg:gap-10 border-b border-[var(--line)]">

            {/* Left — tagline + follow capture */}
            <div className="flex flex-col gap-10">
              <div>
                <Link className="brand text-[clamp(20px,2.4vw,30px)] block mb-4 leading-none" href="/">
                  Ax<em>ion</em><span className="domain">INDEX</span>
                </Link>
                <p className="font-serif italic leading-relaxed" style={{ fontSize: "clamp(14px,1.2vw,16px)", color: "var(--fg-3)", maxWidth: "32ch" }}>
                  Codifying the operating patterns of the unfinished organisation.
                </p>
                <p className="font-sans mt-3" style={{ fontSize: 13, color: "var(--fg-5)", lineHeight: 1.6, maxWidth: "36ch" }}>
                  Essays, frameworks and the build — followed by founders and operators.
                </p>
              </div>

              {/* Email follow capture */}
              <div>
                <p className="font-mono mb-4" style={{ fontSize: "9px", letterSpacing: ".45em", textTransform: "uppercase", color: "#EDEBE3" }}>
                  Follow the work
                </p>
                <div className="flex gap-2 max-w-[340px]">
                  <input
                    type="email"
                    placeholder="you@company.com"
                    aria-label="Email address"
                    className="flex-1 font-sans"
                    style={{
                      fontSize: 13, padding: "11px 14px",
                      border: "1px solid rgba(201,162,74,0.2)",
                      borderRadius: 6,
                      background: "rgba(12,14,20,0.8)",
                      color: "var(--fg)",
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    className="font-mono shrink-0"
                    style={{
                      fontSize: "10px", fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase",
                      background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)",
                      color: "#080A0F", border: "none", borderRadius: 6,
                      padding: "0 20px", cursor: "pointer",
                    }}
                  >
                    Follow
                  </button>
                </div>
              </div>
            </div>

            {/* Index */}
            <div>
              <p className="font-mono mb-7" style={{ fontSize: "9px", letterSpacing: ".5em", textTransform: "uppercase", color: "var(--accent)", opacity: 0.5 }}>
                Index
              </p>
              <ul className="flex flex-col gap-4">
                {[
                  { href: "/", label: "Home" },
                  { href: "#story", label: "Story" },
                  { href: "/patterns", label: "Operating Patterns" },
                  { href: "/connect", label: "Connect" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="font-mono"
                      style={{ fontSize: "10px", letterSpacing: ".18em", textTransform: "uppercase", color: "#EDEBE3", textDecoration: "none", transition: "color 0.3s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#EDEBE3")}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <p className="font-mono mb-7" style={{ fontSize: "9px", letterSpacing: ".5em", textTransform: "uppercase", color: "var(--accent)", opacity: 0.5 }}>
                Connect
              </p>
              <div className="flex flex-col gap-4">
                <a
                  href="https://www.linkedin.com/in/nitinnahata"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 font-mono"
                  style={{ fontSize: "10px", letterSpacing: ".18em", textTransform: "uppercase", color: "#EDEBE3", textDecoration: "none", transition: "color 0.3s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#EDEBE3")}
                >
                  <span
                    style={{
                      width: 26, height: 26, borderRadius: "50%",
                      border: "1px solid rgba(240,241,245,0.12)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "rgba(12,14,20,0.8)", flexShrink: 0,
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </span>
                  LinkedIn
                </a>
                <a
                  href="https://axionindex.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono"
                  style={{ fontSize: "10px", letterSpacing: ".18em", textTransform: "uppercase", color: "#EDEBE3", textDecoration: "none", transition: "color 0.3s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#EDEBE3")}
                >
                  Axion Index ↗
                </a>
                <a
                  href="mailto:office@axionindex.com"
                  className="font-mono"
                  style={{ fontSize: "10px", letterSpacing: ".1em", color: "#EDEBE3", textDecoration: "none", textTransform: "none", transition: "color 0.3s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#EDEBE3")}
                >
                  office@axionindex.com
                </a>
              </div>
            </div>

          </div>

          {/* ── Bottom bar ── */}
          <div className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="font-mono" style={{ fontSize: "9px", letterSpacing: ".4em", textTransform: "uppercase", color: "#EDEBE3" }}>
              © 2026 Nitin Nahata · Axion Index. All rights reserved.
            </span>
            <div className="flex items-center gap-6">
              {[
                { href: "https://www.linkedin.com/in/nitinnahata", label: "LinkedIn", external: true },
                { href: "/", label: "Axion Index", external: false },
                { href: "/patterns", label: "Operating Patterns", external: false },
                { href: "#story", label: "Story", external: false },
              ].map((l) =>
                l.external ? (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono"
                    style={{ fontSize: "9px", letterSpacing: ".3em", textTransform: "uppercase", color: "#EDEBE3", textDecoration: "none", transition: "color 0.3s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#EDEBE3")}
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="font-mono"
                    style={{ fontSize: "9px", letterSpacing: ".3em", textTransform: "uppercase", color: "#EDEBE3", textDecoration: "none", transition: "color 0.3s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#EDEBE3")}
                  >
                    {l.label}
                  </Link>
                )
              )}
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
