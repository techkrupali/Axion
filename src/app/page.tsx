"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import DiagnosticModal from "@/components/DiagnosticModal";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import Button from "@/components/Button";

/* ── Animated grid background ── */
function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#C9A24A" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

/* ── Floating orbs ── */
function Orbs() {
  return null;
}

function StatementCard({ item, i }: { item: { num: string; title: string; desc: string }; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
      className="group relative p-8 border rounded-[24px] bg-[#0A0A0B] cursor-default"
      style={{
        borderColor: hovered ? "rgba(201,162,74,0.2)" : "rgba(240,241,245,0.1)",
        transition: "border-color 0.4s",
      }}
    >
      {/* Animated top border beam */}
      <motion.div
        className="absolute top-0 left-0 h-[1px]"
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 + i * 0.12, ease: "easeOut" }}
        style={{ width: "100%", background: "#C9A24A" }}
      />

      {/* Number tag */}
      <div className="font-mono text-[10px] tracking-[0.4em] text-[#C9A24A] mb-6" style={{ opacity: hovered ? 1 : 0.5, transition: "opacity 0.3s" }}>
        [ {item.num} ]
      </div>

      {/* Title */}
      <motion.h3
        className="font-serif text-[28px] mb-4"
        animate={{ color: hovered ? "#C9A24A" : "#F0F1F5" }}
        transition={{ duration: 0.35 }}
      >
        {item.title}
      </motion.h3>

      {/* Desc — slides up on hover */}
      <motion.p
        className="text-[14px] text-[#B8BDCE] leading-relaxed max-w-[20ch]"
        animate={{ y: hovered ? -2 : 0, opacity: hovered ? 1 : 0.7 }}
        transition={{ duration: 0.35 }}
      >
        {item.desc}
      </motion.p>

      {/* Expanding gold line */}
      <motion.div
        className="mt-8 h-[1px] bg-[#C9A24A]"
        animate={{ width: hovered ? "100%" : "40px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
}

const BRIDGE_ITEMS = [
  { title: "Where the system is breaking", step: "01", bg: "#0A0A0B" },
  { title: "What's holding it together artificially", step: "02", bg: "#0A0A0B" },
  { title: "What will fail next", step: "03", bg: "#0A0A0B" },
  { title: "Then we redesign it so it holds", step: "04", bg: "#0A0A0B" },
];

function BridgeCards() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      const idx = Math.min(BRIDGE_ITEMS.length - 1, Math.floor(v * BRIDGE_ITEMS.length));
      setActiveIndex(idx);
    });
  }, [scrollYProgress]);

  return (
    <div ref={sectionRef} style={{ height: `${BRIDGE_ITEMS.length * 50}vh` }}>
      <div className="sticky top-[20vh]">
        <div className="relative border-l border-[rgba(240,241,245,0.1)] pl-10 md:pl-20 flex flex-col gap-6 pt-20 pb-20">
          {BRIDGE_ITEMS.map((item, i) => (
            <div
              key={i}
              className="relative group transition-all duration-500"
              style={{
                opacity: i <= activeIndex ? 1 : 0,
                transform: i <= activeIndex ? "translateY(0)" : "translateY(32px)",
              }}
            >
              <div className="absolute left-[-41px] md:left-[-81px] top-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#0A0A0B] border-2 border-[#C9A24A] z-20 group-hover:scale-[1.8] transition-transform duration-500" />
                <span className="font-serif italic text-[28px] text-[#4A4F62] group-hover:text-[#C9A24A] transition-colors duration-500">{item.step}</span>
              </div>
              <div
                className="p-6 md:p-8 rounded-[28px] border border-[rgba(240,241,245,0.1)] transition-all duration-700 group-hover:border-[rgba(201,162,74,0.2)]"
                style={{ background: item.bg }}
              >
                <h3 className="font-serif text-[clamp(16px,1.6vw,22px)] leading-[1.2] text-[#F0F1F5]">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const SIGNALS = [
  { num: "01", text: "Growth is <em>accelerating.</em><br>Stability is not.", href: "/expertise/people", dest: "People Architecture" },
  { num: "02", text: "The organisation behaves differently<br><em>depending on who is in the room.</em>", href: "/expertise/people", dest: "People Architecture" },
  { num: "03", text: "AI is increasing <em>output.</em><br>Decision quality is dropping.", href: "/expertise/ai-edge", dest: "AI Edge Lab" },
  { num: "04", text: "Cost is rising.<br><em>You don't know why.</em>", href: "/expertise/labour", dest: "Labour Codes" },
  { num: "05", text: "The business is stable.<br><em>The future is not.</em>", href: "/expertise/family", dest: "Family Business" },
  { num: "06", text: "You have <em>strong people.</em><br>You do not have a strong system.", href: "/expertise/people", dest: "People Architecture" },
];

function SignalsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      const idx = Math.min(SIGNALS.length - 1, Math.floor(v * SIGNALS.length));
      setActiveIndex(idx);
    });
  }, [scrollYProgress]);

  return (
    <section
      ref={sectionRef}
      id="signals"
      className="section-dark relative"
      style={{ height: `${100 + SIGNALS.length * 50}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="shell w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-20 items-center">
            {/* Left — static */}
            <div>
              <Reveal>
                <span className="eyebrow mb-6">If this feels familiar</span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="h-section mb-8">
                  You don't need a service.<br />
                  You need to read <em>what is breaking.</em>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="gold-line" />
              </Reveal>
            </div>

            {/* Right — stacking cards, contained */}
            <div className="relative" style={{ height: `${SIGNALS.length * 56 + 80}px` }}>
              {SIGNALS.map((signal, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 transition-all duration-500"
                  style={{
                    top: i <= activeIndex ? `${i * 56}px` : `${SIGNALS.length * 56 + 40}px`,
                    zIndex: 10 + i,
                    opacity: i <= activeIndex ? 1 : 0,
                    transform: i <= activeIndex ? "translateY(0)" : "translateY(24px)",
                  }}
                >
                  <Link
                    href={signal.href}
                    className="group block bg-[#0A0A0B] border border-[rgba(240,241,245,0.1)] hover:border-[rgba(201,162,74,0.2)] transition-all duration-400 rounded-[24px] px-6 py-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[10px] text-[#C9A24A] tracking-[0.35em] font-semibold">SIGNAL {signal.num}</span>
                      <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#4A4F62] group-hover:text-[#C9A24A] transition-colors duration-300 flex items-center gap-1">
                        → {signal.dest}
                      </span>
                    </div>
                    <h3
                      className="text-[clamp(18px,2.2vw,26px)] font-serif leading-[1.35] text-[#D4D7E0] group-hover:text-[#F0F1F5] transition-colors duration-400"
                      dangerouslySetInnerHTML={{ __html: signal.text }}
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [diagOpen, setDiagOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="min-h-screen">

      {diagOpen && <DiagnosticModal onClose={() => setDiagOpen(false)} />}

      {/* ══════════════════════════════════════════
          HERO — Cinematic full-screen
      ══════════════════════════════════════════ */}
      <header ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <GridBackground />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="shell text-center relative z-10 pt-20">
          <Reveal>
            {/* Fix 3 — classification eyebrow, corner strips merged in */}
            <div className="eyebrow eyebrow--center mb-10 text-[#B8BDCE]">
              OPERATING ARCHITECTURE PRACTICE
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="h-display hero-glow mb-8">
              {/* Fix 6 — strikethrough contrast raised */}
              From <s className="opacity-80 decoration-[#C9A24A] decoration-2">ambiguity</s><br />
              to <em>architecture.</em>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="lead mx-auto mb-14 text-[#D4D7E0] max-w-[48ch]">
              Most organisations don't fail when strategy breaks.<br />
              They fail when their internal architecture cannot carry<br />what they are becoming.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            {/* Fix 2 — primary gold CTA + secondary outline; Fix 5 — "signals" plural; Fix 7 — one scroll prompt */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="/connect" variant="primary" showArrow={true}>Reach Us</Button>
              <Button href="#signals" variant="secondary" showArrow={true}>Read the signals</Button>
            </div>
          </Reveal>

          {/* Single scroll prompt */}
          <Reveal delay={0.45}>
            <div className="mt-16 flex justify-center">
              <span className="kbd-arrow">Scroll to explore</span>
            </div>
          </Reveal>
        </motion.div>
      </header>

      {/* ══════════════════════════════════════════
          SIGNALS — Stacking Cards
      ══════════════════════════════════════════ */}
      <SignalsSection />

      {/* ══════════════════════════════════════════
          BRIDGE — How We Do It
      ══════════════════════════════════════════ */}
      <section className="chapter section-deep relative py-0" id="bridge">
        <div className="shell">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-0 items-start">
            <div className="lg:sticky lg:top-0 h-fit flex flex-col justify-start pt-40 pb-40 lg:pr-10 z-30 pointer-events-none">
              <div className="pointer-events-auto">
                <Reveal>
                  <span className="eyebrow mb-8 text-[#C9A24A]">How We Do It</span>
                </Reveal>
                <Reveal delay={0.1}>
                  <h2 className="h-display text-[clamp(32px,4.5vw,56px)] leading-[0.95] mb-6">
                    We don't explore the <em>problem.</em><br />
                    We map what carries<br />the consequence.
                  </h2>
                </Reveal>
                <Reveal delay={0.3}>
                  <div className="pt-10 border-t border-[rgba(240,241,245,0.1)]">
                    <span className="font-mono text-[10px] tracking-[0.5em] uppercase text-[#C9A24A] opacity-80">We map:</span>
                  </div>
                </Reveal>
              </div>
            </div>

            <BridgeCards />
          </div>
        </div>

      </section>

      {/* ══════════════════════════════════════════
          METHOD — Our Operating Logic
      ══════════════════════════════════════════ */}
      <section className="section-tint relative overflow-hidden py-24" id="method">
        <div className="shell">
          <div className="max-w-[860px] mx-auto text-center flex flex-col items-center">

            <Reveal delay={0.1}>
              <h2 className="h-section mb-6 -mt-8">
                Our Operating <em>Logic.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-[clamp(16px,1.4vw,19px)] text-[#D4D7E0] mb-16 max-w-[52ch] leading-relaxed">
                Not designed in a deck. Forged in the field — then interpreted across labour, AI, people, and ownership.
              </p>
            </Reveal>

            {/* ── Three-panel architectural cards ── */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
              {[
                {
                  num: "01",
                  label: "Belief",
                  desc: "Where every operating logic begins. A conviction about how an organisation should hold — before the pressure arrives.",
                  accent: "#C9A24A",
                  tag: "ORIGIN",
                },
                {
                  num: "02",
                  label: "Conviction",
                  desc: "Belief that has survived collision with reality. Tested against data, cost, and consequence — not opinion.",
                  accent: "#C9A24A",
                  tag: "TESTED",
                },
                {
                  num: "03",
                  label: "Rhythm",
                  desc: "When conviction stops depending on the person. Codified into repeatable behaviour the organisation keeps on its own.",
                  accent: "#C9A24A",
                  tag: "CODIFIED",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.num}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8%" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.15 }}
                  className="group relative cursor-default text-left"
                  style={{
                    background: "#0A0A0B",
                    border: "1px solid rgba(240,241,245,0.1)",
                    borderRadius: 20,
                    padding: "36px 32px 32px",
                    transition: "border-color 0.5s",
                  }}
                  whileHover={{ borderColor: "rgba(201,162,74,0.2)" }}
                >
                  {/* Animated top beam */}
                  <motion.div
                    className="absolute top-0 left-0 h-[1px]"
                    initial={{ scaleX: 0, originX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.3 + i * 0.15, ease: "easeOut" }}
                    style={{
                      width: "100%",
                      background: item.accent,
                    }}
                  />

                  {/* Corner tag */}
                  <div className="absolute top-5 right-5 font-mono text-[8px] tracking-[0.4em]" style={{ color: item.accent, opacity: 0.7 }}>
                    {item.tag}
                  </div>

                  {/* Number */}
                  <div
                    className="font-serif italic mb-6 leading-none"
                    style={{ fontSize: "clamp(52px,6vw,80px)", color: item.accent, opacity: 0.25, lineHeight: 1 }}
                  >
                    {item.num}
                  </div>

                  {/* Label */}
                  <h3
                    className="font-serif mb-4"
                    style={{ fontSize: "clamp(22px,2.2vw,30px)", color: "#C9A24A", fontWeight: 400, lineHeight: 1.1 }}
                  >
                    <em>{item.label}</em>
                  </h3>

                  {/* Desc */}
                  <p style={{ fontSize: "clamp(14px,1.1vw,16px)", color: "#B8BDCE", lineHeight: 1.7 }}>
                    {item.desc}
                  </p>

                  {/* Bottom expanding line */}
                  <motion.div
                    className="mt-8 h-[1px]"
                    style={{ background: item.accent }}
                    initial={{ width: "28px" }}
                    whileInView={{ width: "48px" }}
                    whileHover={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                </motion.div>
              ))}
            </div>
            {/* Closing line */}
            <Reveal delay={0.6}>
              <p className="font-serif italic text-[clamp(16px,1.5vw,20px)] text-[#B8BDCE] max-w-[54ch] leading-relaxed border-t border-[rgba(240,241,245,0.1)] pt-10">
                This is the same arc we build for you — from what one person believes, to what the whole organisation runs on.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PRACTICES — Equal Cards Grid
      ══════════════════════════════════════════ */}
      <section className="chapter section-deep overflow-hidden pb-10" id="practices">
        <div className="shell">
          <div className="text-center mb-6 -mt-4">
            <Reveal><span className="eyebrow eyebrow--center mb-4">Where the work happens</span></Reveal>
            <Reveal delay={0.1}>
              <h2 className="h-section mx-auto max-w-[20ch]">
                One Operating Logic.<br />
                <em>Four Practices.</em>
              </h2>
            </Reveal>
          </div>

          {/* Desktop & Tablet grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                num: "01", 
                name: "People Architecture", 
                href: "/expertise/people", 
                condition: "When the organisation depends on who is in the room — not on how it is built.",
                promise: "We codify judgment, decision rights, and succession into structure the company keeps after people leave.",
              },
              { 
                num: "02", 
                name: "Labour Codes", 
                href: "/expertise/labour", 
                condition: "When cost, classification, and compliance stop aligning — and you can't see why.",
                promise: "We turn your workforce from headcount into auditable control architecture that holds when rules change.",
              },
              { 
                num: "03", 
                name: "AI Edge Lab", 
                href: "/expertise/ai-edge", 
                condition: "When AI is making you faster, but not wiser — speed without architecture scales bad judgment.",
                promise: "We build the decision layer where AI accelerates, and where a human must still hold the call.",
              },
              { 
                num: "04", 
                name: "Family Business", 
                href: "/expertise/family", 
                condition: "When continuity depends on individuals, not structure — and succession is the risk no one says out loud.",
                promise: "We codify ownership, authority, and decision rights into architecture that survives the generational handover.",
              },
            ].map((practice, i) => {
              const words = practice.name.split(' ');
              const first = words[0];
              const rest = words.slice(1).join(' ');
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8%" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
                >
                  <Link
                    href={practice.href}
                    className="group block h-full p-6 rounded-[24px] border border-[rgba(240,241,245,0.1)] hover:border-[rgba(201,162,74,0.2)] bg-[#0A0A0B] transition-all duration-400"
                  >
                    <span className="font-mono text-[12px] tracking-[0.3em] text-[#C9A24A] mb-4 block">[{practice.num}]</span>
                    <h3 className="font-serif text-[28px] leading-[1.1] text-[#F0F1F5] mb-5 group-hover:text-[#C9A24A] transition-colors">
                      {first}<br /><em className="text-[#C9A24A]">{rest}</em>
                    </h3>
                    <div className="mb-4">
                      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#8A8FA4] block mb-2">The Signal</span>
                      <p className="text-[15px] text-[#D4D7E0] leading-relaxed">{practice.condition}</p>
                    </div>
                    <div className="mb-5">
                      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#8A8FA4] block mb-2">What We Build</span>
                      <p className="text-[15px] text-[#B8BDCE] leading-relaxed">{practice.promise}</p>
                    </div>
                    <div className="pt-4 border-t border-[rgba(240,241,245,0.1)]">
                      <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.28em] uppercase text-[#C9A24A] group-hover:text-[#F0F1F5] transition-colors">
                        Enter {practice.name} <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Catch-all line */}
          <Reveal delay={0.2}>
            <div className="mt-8 pt-6 border-t border-[rgba(240,241,245,0.1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex flex-col gap-3">
                <p className="font-serif text-[clamp(18px,1.7vw,24px)] text-[#B8BDCE] leading-relaxed">
                  Four practices. <em style={{ color: "#C9A24A" }}>One method.</em>
                </p>
                <p className="font-serif text-[clamp(14px,1.2vw,17px)] text-[#8A8FA4] max-w-[56ch] leading-relaxed">
                  If what's breaking doesn't fit a category, that is still a signal — bring it, and we read the architecture wherever it lives.
                </p>
              </div>
              <Button href="/connect" variant="primary" showArrow={true} size="sm">Reach Us</Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ROLES — Where You Sit
      ══════════════════════════════════════════ */}
      <section className="chapter--tight section-dark py-12" id="roles">
        <div className="shell">
          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_3fr] gap-10 items-center">
            {/* Left col */}
            <div className="lg:sticky lg:top-[15vh] h-fit flex flex-col gap-4">
              <Reveal>
                <h2 className="h-statement">
                  What changes — depending on <em>where you sit.</em>
                </h2>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="w-16 h-[2px] bg-[#C9A24A] mb-4" />
              </Reveal>
              <Reveal delay={0.25}>
                <Button href="/connect" variant="primary" showArrow={true} size="sm">Reach Us</Button>
              </Reveal>
            </div>

            {/* Right col — grid of interactive cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  role: "Founder / CEO",
                  pull: "You can feel the company outgrowing the way you run it — you just can't see where it cracks first.",
                  work: "Map the failure points before they fail, and build the architecture that removes you as the single point of dependency.",
                  icon: "👨‍💼"
                },
                {
                  role: "CFO",
                  pull: "Cost is climbing, and headcount explains some of it — not the part that keeps you up.",
                  work: "Read workforce as cost, risk, and control architecture, then install the structure that makes the number governable — not just reported.",
                  icon: "💰"
                },
                {
                  role: "CHRO",
                  pull: "You're running more programs than ever, and the organisation is no more durable for it.",
                  work: "Build the operating system underneath HR — so capability is designed into structure, not dependent on who's running the program.",
                  icon: "👥"
                },
                {
                  role: "Investor / Board",
                  pull: "The thesis is sound. The question is whether the organisation can carry it.",
                  work: "Diligence the operating architecture — what survives the founder, and what is quietly held by individuals who can leave.",
                  icon: "📊"
                },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 0.12} className="h-full">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative h-full p-5 rounded-[24px] border border-[rgba(240,241,245,0.1)] hover:border-[rgba(201,162,74,0.2)] bg-[#0A0A0B] group transition-all duration-500"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-2xl flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-[#C9A24A] mb-2 block font-semibold">{item.role}</span>
                        <p className="font-serif text-[clamp(14px,1.2vw,17px)] leading-snug text-[#D4D7E0] group-hover:text-[#F0F1F5] transition-colors mb-3 font-medium">
                          {item.pull}
                        </p>
                        <div className="flex items-start gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#C9A24A] mt-1.5 flex-shrink-0" />
                          <p className="font-mono text-[11px] tracking-[0.15em] text-[#8A8FA4] group-hover:text-[#B8BDCE] transition-colors leading-relaxed">
                            {item.work}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MAKE IT REAL — What happens next
      ══════════════════════════════════════════ */}
      <section className="section-deep overflow-hidden" id="real">
        {/* Header */}
        <div className="shell pt-20 pb-4">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <Reveal>
              <span className="eyebrow text-[#C9A24A]">The engagement</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="h-section lg:text-right">
                Four moves.<br />
                <em>One outcome.</em>
              </h2>
            </Reveal>
          </div>

        </div>

        {/* Steps — full-width staggered rows */}
        {[
          {
            num: "01",
            label: "SIGNAL",
            title: "You bring the signal.",
            sub: "A pattern. A pressure. A question you can't quite name yet.",
            align: "left",
          },
          {
            num: "02",
            label: "READ",
            title: "We read the architecture.",
            sub: "Not the symptom — the structural condition producing it.",
            align: "right",
          },
          {
            num: "03",
            label: "DEFINE",
            title: "We define the intervention.",
            sub: "Precise. Sequenced. Built for your operating reality.",
            align: "left",
          },
          {
            num: "04",
            label: "HOLD",
            title: "We make it hold.",
            sub: "Installed into the system. Not dependent on who is in the room.",
            align: "right",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
            className="group relative border-t border-[rgba(240,241,245,0.1)] transition-all duration-500 cursor-default"
          >
            <div className="shell py-12 lg:py-20 flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-0">
              {/* Step tag — always left on mobile */}
              <div className={`lg:w-1/4 flex flex-col gap-3 ${item.align === "right" ? "lg:items-end lg:text-right" : ""}`}>
                <span className="font-mono text-[9px] tracking-[0.5em] uppercase text-[#4A4F62] opacity-50 group-hover:opacity-100 group-hover:text-[#C9A24A] transition-all duration-500">{item.label}</span>
                <span
                  className="font-serif italic text-[clamp(56px,8vw,96px)] leading-none group-hover:text-[#C9A24A] transition-colors duration-500"
                  style={{ WebkitTextStroke: "1px currentColor", color: "transparent" }}
                >
                  {item.num}
                </span>
              </div>

              {/* Divider line — desktop */}
              <div className={`hidden lg:block lg:w-px lg:self-stretch mx-16 bg-[rgba(240,241,245,0.1)] group-hover:bg-[rgba(201,162,74,0.2)] transition-colors duration-500`} />

              {/* Content — always left on mobile */}
              <div className={`flex-1 ${item.align === "right" ? "lg:text-right" : ""}`}>
                <h3 className="font-serif text-[clamp(28px,3.5vw,48px)] leading-[1.1] text-[#D4D7E0] group-hover:text-[#F0F1F5] transition-colors duration-500 mb-4">
                  {item.title}
                </h3>
                <p
                  className="font-mono text-[12px] tracking-[0.18em] text-[#B8BDCE] group-hover:text-[#D4D7E0] transition-colors duration-500 max-w-[40ch]"
                  style={{ marginLeft: item.align === "right" ? "auto" : undefined }}
                >
                  {item.sub}
                </p>
              </div>
            </div>

            {/* Bottom gold line — always visible faint, full on hover */}
            <div className="absolute bottom-0 left-0 h-[1px] w-0 group-hover:w-full bg-[#C9A24A] transition-all duration-700" />
          </motion.div>
        ))}

        <div className="h-px bg-[rgba(240,241,245,0.1)]" />
      </section>

      {/* ══════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════ */}
      <section className="chapter py-40 overflow-hidden relative" style={{ background: "#0A0A0B" }}>
        <div className="shell text-center relative z-10">
          <Reveal>
            <span className="eyebrow eyebrow--center mb-10">Begin the diagnostic</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="h-display mb-14">
              Start where the signal is <em>strongest.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-col items-center gap-4">
              <Button onClick={() => setDiagOpen(true)} variant="primary" showArrow={true}>Start Diagnostic</Button>
              <p className="font-mono text-[10px] tracking-[0.15em] text-[#8A8FA4] max-w-[44ch] text-center leading-relaxed">
                A 30-minute architectural read. You bring the signal — we tell you what's structurally producing it. No fee, no pitch.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
