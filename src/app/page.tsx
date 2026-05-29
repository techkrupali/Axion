"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import DiagnosticModal from "@/components/DiagnosticModal";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

/* ── Animated grid background ── */
function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(201,168,76,1)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* Radial fade over grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_30%,var(--bg)_100%)]" />
    </div>
  );
}

/* ── Floating orbs ── */
function Orbs() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{
          background: "radial-gradient(circle, #C9A84C 0%, transparent 70%)",
          top: "10%", left: "60%",
          animation: "float 12s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, #4A9EFF 0%, transparent 70%)",
          top: "50%", left: "10%",
          animation: "float 16s ease-in-out infinite reverse",
        }}
      />
    </div>
  );
}

function StatementCard({ item, i }: { item: { num: string; title: string; desc: string }; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
      animate={hovered ? { y: -10, scale: 1.03 } : { y: 0, scale: 1 }}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative p-8 border rounded-[24px] bg-[var(--bg-1)] overflow-hidden cursor-default"
      style={{
        borderColor: hovered ? "rgba(201,168,76,0.6)" : "var(--line)",
        boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.2)" : "none",
        transition: "border-color 0.4s, box-shadow 0.4s",
      }}
    >
      {/* Mouse spotlight */}
      {hovered && (
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 220,
            height: 220,
            top: pos.y - 110,
            left: pos.x - 110,
            background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)",
            transition: "top 0.05s, left 0.05s",
          }}
        />
      )}

      {/* Animated top border beam */}
      <motion.div
        className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 + i * 0.12, ease: "easeOut" }}
        style={{ width: "100%" }}
      />

      {/* Number tag */}
      <div className="font-mono text-[10px] tracking-[0.4em] text-[var(--accent)] mb-6" style={{ opacity: hovered ? 1 : 0.5, transition: "opacity 0.3s" }}>
        [ {item.num} ]
      </div>

      {/* Title */}
      <motion.h3
        className="font-serif text-[28px] mb-4"
        animate={{ color: hovered ? "var(--accent)" : "var(--fg)" }}
        transition={{ duration: 0.35 }}
      >
        {item.title}
      </motion.h3>

      {/* Desc — slides up on hover */}
      <motion.p
        className="text-[14px] text-[var(--fg-3)] leading-relaxed max-w-[20ch]"
        animate={{ y: hovered ? -2 : 0, opacity: hovered ? 1 : 0.7 }}
        transition={{ duration: 0.35 }}
      >
        {item.desc}
      </motion.p>

      {/* Expanding gold line */}
      <motion.div
        className="mt-8 h-[1px] bg-[var(--accent)]"
        animate={{ width: hovered ? "100%" : "40px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Bottom glow */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-20 pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ background: "linear-gradient(to top, rgba(201,168,76,0.08), transparent)" }}
      />
    </motion.div>
  );
}

const BRIDGE_ITEMS = [
  { title: "Where the system is breaking", step: "01", bg: "linear-gradient(180deg, rgba(201,168,76,0.06) 0%, transparent 100%)" },
  { title: "What's holding it together artificially", step: "02", bg: "linear-gradient(180deg, rgba(74,158,255,0.04) 0%, transparent 100%)" },
  { title: "What will fail next", step: "03", bg: "linear-gradient(180deg, rgba(201,168,76,0.04) 0%, transparent 100%)" },
  { title: "Then we redesign it so it holds", step: "04", bg: "linear-gradient(180deg, rgba(240,241,245,0.03) 0%, transparent 100%)" },
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
        <div className="relative border-l border-[var(--line)] pl-10 md:pl-20 flex flex-col gap-6 pt-20 pb-20">
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
                <div className="w-3 h-3 rounded-full bg-[var(--bg)] border-2 border-[var(--accent)] z-20 group-hover:scale-[1.8] transition-transform duration-500 shadow-[0_0_15px_var(--accent-soft)]" />
                <span className="font-serif italic text-[28px] text-[var(--fg-5)] group-hover:text-[var(--accent)] transition-colors duration-500">{item.step}</span>
              </div>
              <div
                className="p-6 md:p-8 rounded-[28px] border border-[var(--line)] backdrop-blur-2xl transition-all duration-700 group-hover:border-[var(--line-gold)] group-hover:shadow-[0_30px_70px_rgba(0,0,0,0.6)]"
                style={{ background: item.bg }}
              >
                <h3 className="font-serif text-[clamp(16px,1.6vw,22px)] leading-[1.2] text-[var(--fg)]">{item.title}</h3>
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
                    className="group block bg-[var(--bg-1)] border border-[var(--line-strong)] hover:border-[var(--line-gold)] transition-all duration-400 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-[24px] px-6 py-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[10px] text-[var(--accent)] tracking-[0.35em] font-semibold">SIGNAL {signal.num}</span>
                      <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--fg-5)] group-hover:text-[var(--accent)] transition-colors duration-300 flex items-center gap-1">
                        → {signal.dest}
                      </span>
                    </div>
                    <h3
                      className="text-[clamp(18px,2.2vw,26px)] font-serif leading-[1.35] text-[var(--fg-2)] group-hover:text-[var(--fg)] transition-colors duration-400"
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
  const [activePractice, setActivePractice] = useState(0);
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
        <Orbs />

        {/* Scan line effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.015]">
          <div className="absolute w-full h-[2px] bg-[var(--accent)]" style={{ animation: "scan-line 8s linear infinite" }} />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="shell text-center relative z-10 pt-20">
          <Reveal>
            {/* Fix 3 — classification eyebrow, corner strips merged in */}
            <div className="eyebrow eyebrow--center mb-10 text-[var(--fg-3)]">
              OPERATING ARCHITECTURE PRACTICE&nbsp;&nbsp;·&nbsp;&nbsp;BENGALURU
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="h-display hero-glow mb-8">
              {/* Fix 6 — strikethrough contrast raised */}
              From <s className="opacity-80 decoration-[var(--accent)] decoration-2">ambiguity</s><br />
              to <em>architecture.</em>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="lead mx-auto mb-14 text-[var(--fg-2)] max-w-[48ch]">
              Most organisations don't fail when strategy breaks.<br />
              They fail when their internal architecture cannot carry<br />what they are becoming.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            {/* Fix 2 — primary gold CTA + secondary outline; Fix 5 — "signals" plural; Fix 7 — one scroll prompt */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="/connect"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 px-8 py-4 font-mono text-[11px] tracking-[0.28em] uppercase rounded-full font-semibold"
                style={{
                  background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)",
                  color: "#080A0F",
                  boxShadow: "0 0 32px rgba(201,168,76,0.25)",
                }}
              >
                Reach Us
                <ArrowRight size={13} />
              </motion.a>
              <motion.a
                href="#signals"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center gap-3 px-8 py-4 font-mono text-[11px] tracking-[0.28em] uppercase overflow-hidden rounded-full"
                style={{
                  border: "1px solid rgba(201,168,76,0.3)",
                  color: "var(--accent-2)",
                }}
              >
                <span className="relative z-10">Read the signals</span>
                <ArrowRight size={13} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-[var(--accent-soft)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>
            </div>
          </Reveal>

          {/* Single scroll prompt */}
          <Reveal delay={0.45}>
            <div className="mt-16 flex justify-center">
              <span className="kbd-arrow">Scroll to explore</span>
            </div>
          </Reveal>
        </motion.div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 w-full h-[35vh] bg-gradient-to-t from-[var(--bg)] to-transparent pointer-events-none" />
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
                  <span className="eyebrow mb-8 text-[var(--accent)]">How We Do It</span>
                </Reveal>
                <Reveal delay={0.1}>
                  <h2 className="h-display text-[clamp(32px,4.5vw,56px)] leading-[0.95] mb-6">
                    We don't explore the <em>problem.</em><br />
                    We map what carries<br />the consequence.
                  </h2>
                </Reveal>
                <Reveal delay={0.3}>
                  <div className="pt-10 border-t border-[var(--line)]">
                    <span className="font-mono text-[10px] tracking-[0.5em] uppercase text-[var(--accent)] opacity-80">We map:</span>
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
              <h2 className="h-section mb-6">
                Our Operating <em>Logic.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-[clamp(16px,1.4vw,19px)] text-[var(--fg-2)] mb-16 max-w-[52ch] leading-relaxed">
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
                  accent: "rgba(201,168,76,0.35)",
                  glow: "rgba(201,168,76,0.06)",
                  tag: "ORIGIN",
                },
                {
                  num: "02",
                  label: "Conviction",
                  desc: "Belief that has survived collision with reality. Tested against data, cost, and consequence — not opinion.",
                  accent: "rgba(201,168,76,0.65)",
                  glow: "rgba(201,168,76,0.10)",
                  tag: "TESTED",
                },
                {
                  num: "03",
                  label: "Rhythm",
                  desc: "When conviction stops depending on the person. Codified into repeatable behaviour the organisation keeps on its own.",
                  accent: "#C9A84C",
                  glow: "rgba(201,168,76,0.18)",
                  tag: "CODIFIED",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.num}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8%" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.15 }}
                  whileHover={{ y: -6 }}
                  className="group relative overflow-hidden cursor-default text-left"
                  style={{
                    background: `linear-gradient(160deg, rgba(12,14,20,0.95) 0%, rgba(8,10,15,0.98) 100%)`,
                    border: `1px solid ${i === 2 ? "rgba(201,168,76,0.3)" : "rgba(240,241,245,0.07)"}`,
                    borderRadius: 20,
                    padding: "36px 32px 32px",
                    boxShadow: i === 2 ? `0 0 60px ${item.glow}, 0 20px 40px rgba(0,0,0,0.4)` : "0 8px 32px rgba(0,0,0,0.3)",
                    transition: "box-shadow 0.5s, border-color 0.5s",
                  }}
                >
                  {/* Animated top beam */}
                  <motion.div
                    className="absolute top-0 left-0 h-[2px]"
                    initial={{ scaleX: 0, originX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.3 + i * 0.15, ease: "easeOut" }}
                    style={{
                      width: "100%",
                      background: `linear-gradient(90deg, transparent, ${item.accent}, transparent)`,
                    }}
                  />

                  {/* Scan line on hover */}
                  <motion.div
                    className="absolute left-0 w-full h-[1px] pointer-events-none"
                    style={{ background: `linear-gradient(90deg, transparent, ${item.accent}, transparent)`, opacity: 0 }}
                    animate={{ top: ["0%", "100%"], opacity: [0, 0.6, 0] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "linear", delay: i * 0.9 }}
                  />

                  {/* Corner tag */}
                  <div className="absolute top-5 right-5 font-mono text-[8px] tracking-[0.4em]" style={{ color: item.accent, opacity: 0.7 }}>
                    {item.tag}
                  </div>

                  {/* Number */}
                  <div
                    className="font-serif italic mb-6 leading-none"
                    style={{ fontSize: "clamp(52px,6vw,80px)", color: item.accent, opacity: i === 2 ? 0.25 : 0.12, lineHeight: 1 }}
                  >
                    {item.num}
                  </div>

                  {/* Label */}
                  <h3
                    className="font-serif mb-4"
                    style={{ fontSize: "clamp(22px,2.2vw,30px)", color: i === 2 ? "#E8C97A" : (i === 1 ? "var(--fg-3)" : "var(--fg)"), fontWeight: 400, lineHeight: 1.1 }}
                  >
                    <em>{item.label}</em>
                  </h3>

                  {/* Desc */}
                  <p style={{ fontSize: "clamp(13px,1.1vw,14.5px)", color: "var(--fg-3)", lineHeight: 1.7 }}>
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

                  {/* Hover glow overlay */}
                  <div
                    className="absolute inset-0 rounded-[20px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(ellipse at 50% 100%, ${item.glow} 0%, transparent 70%)` }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Connector rail */}
            <div className="w-full relative flex items-center mb-16" style={{ height: 8 }}>
              {/* Full line behind dots */}
              <motion.div
                className="absolute left-[calc(100%/6)] right-[calc(100%/6)] h-[1px]"
                initial={{ scaleX: 0, originX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                style={{ background: "linear-gradient(90deg, rgba(201,168,76,0.3), rgba(201,168,76,0.6), #C9A84C)" }}
              />
              {/* Dots at 1/6, 3/6, 5/6 = center of each third */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute w-2 h-2 rounded-full -translate-x-1/2"
                  style={{
                    left: `${(i * 2 + 1) * (100 / 6)}%`,
                    background: i === 2 ? "#C9A84C" : `rgba(201,168,76,${0.35 + i * 0.2})`,
                    boxShadow: i === 2 ? "0 0 8px rgba(201,168,76,0.6)" : "none",
                  }}
                />
              ))}
            </div>

            {/* Closing line */}
            <Reveal delay={0.6}>
              <p className="font-serif italic text-[clamp(16px,1.5vw,20px)] text-[var(--fg-3)] max-w-[54ch] leading-relaxed border-t border-[var(--line)] pt-10">
                This is the same arc we build for you — from what one person believes, to what the whole organisation runs on.
              </p>
            </Reveal>
          </div>
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-square pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)" }} />
      </section>



      {/* ══════════════════════════════════════════
          PRACTICES — Interactive Accordion
      ══════════════════════════════════════════ */}
      <section className="chapter section-deep overflow-hidden pb-10" id="practices">
        <div className="shell">
          <div className="text-center mb-20">
            <Reveal><span className="eyebrow eyebrow--center mb-4">Where the work happens</span></Reveal>
            <Reveal delay={0.1}>
              <h2 className="h-section mx-auto max-w-[20ch]">
                One Operating Logic.<br />
                <em>Four Practices.</em>
              </h2>
            </Reveal>
          </div>

          {/* Desktop accordion */}
          <div className="hidden lg:flex gap-3 h-[560px]">
            {[
              { num: "01", name: "People Architecture", href: "/expertise/people", sub: "When the organisation depends on who is in the room — not on how it is built. We codify the judgment, decision rights, and succession logic your best people carry in their heads into structure the company keeps after they leave. The layer beneath the org chart, made durable." },
              { num: "02", name: "Labour Codes", href: "/expertise/labour", sub: "When cost, classification, and compliance stop aligning — and you can't see why. We turn your workforce from headcount into auditable control architecture: contracts, classification, and risk mapped to the structure that governs them. Built to hold when the rules change retroactively." },
              { num: "03", name: "AI Edge Lab", href: "/expertise/ai-edge", sub: "When AI is making you faster, but not wiser. Output rises while decision quality quietly erodes — speed without architecture just scales bad judgment. We build the decision layer: where AI accelerates, and where a human must still hold the call. The edge is the architecture around the model, not the model." },
              { num: "04", name: "Family Business", href: "/expertise/family", sub: "When continuity depends on individuals, not structure — and succession is the risk no one says out loud. We codify ownership, authority, and decision rights into architecture that survives the generational handover. What holds when the founder is no longer the system." },
            ].map((practice, i) => {
              const isActive = activePractice === i;
              const words = practice.name.split(' ');
              const first = words[0];
              const rest = words.slice(1).join(' ');
              return (
                <motion.div
                  key={i}
                  onMouseEnter={() => setActivePractice(i)}
                  className={`relative overflow-hidden cursor-pointer rounded-[28px] border transition-colors duration-500 ${
                    isActive
                      ? "flex-[3] bg-[var(--bg-2)] border-[var(--line-gold)] shadow-[0_30px_60px_rgba(0,0,0,0.6),0_0_40px_var(--accent-glow)]"
                      : "flex-1 bg-[rgba(12,14,20,0.5)] border-[var(--line)] hover:border-[rgba(201,168,76,0.3)]"
                  }`}
                  layout
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Collapsed state */}
                  {!isActive && (
                    <div className="absolute inset-0 flex flex-col items-center justify-between py-8 px-3">
                      <span className="font-mono text-[9px] tracking-[0.3em] text-[var(--fg-5)]">[{practice.num}]</span>
                      <span
                        className="font-serif text-[14px] text-[var(--fg-4)] tracking-wide whitespace-nowrap"
                        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                      >
                        {practice.name}
                      </span>
                      <span className="text-[var(--accent)] opacity-40 text-[16px]">+</span>
                    </div>
                  )}

                  {/* Expanded state */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 p-8 flex flex-col"
                    >
                      <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--accent)] mb-5">[{practice.num}]</span>
                      <h3 className="font-serif text-[clamp(26px,2.8vw,40px)] leading-[1.1] text-[var(--fg)] mb-5">
                        {first}<br /><em className="text-[var(--accent)]">{rest}</em>
                      </h3>
                      <p className="text-[14px] text-[var(--fg-2)] leading-relaxed flex-1" style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 6, WebkitBoxOrient: 'vertical' as const }}>
                        {practice.sub}
                      </p>
                      <div className="pt-5 border-t border-[var(--line)] mt-4">
                        <Link
                          href={practice.href}
                          className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--accent)] hover:text-[var(--fg)] transition-colors group"
                        >
                          Enter {practice.name} <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </motion.div>
                  )}

                  {isActive && (
                    <div className="absolute bottom-[-10%] right-[-5%] w-[60%] aspect-square pointer-events-none"
                      style={{ background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)" }} />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Mobile stacked */}
          <div className="flex lg:hidden flex-col gap-4">
            {[
              { num: "01", name: "People Architecture", href: "/expertise/people", sub: "When the organisation depends on who is in the room — not on how it is built. We codify the judgment, decision rights, and succession logic your best people carry in their heads into structure the company keeps after they leave." },
              { num: "02", name: "Labour Codes", href: "/expertise/labour", sub: "When cost, classification, and compliance stop aligning — and you can't see why. We turn your workforce from headcount into auditable control architecture." },
              { num: "03", name: "AI Edge Lab", href: "/expertise/ai-edge", sub: "When AI is making you faster, but not wiser. We build the decision layer: where AI accelerates, and where a human must still hold the call." },
              { num: "04", name: "Family Business", href: "/expertise/family", sub: "When continuity depends on individuals, not structure. We codify ownership, authority, and decision rights into architecture that survives the generational handover." },
            ].map((practice, i) => (
              <Link
                key={i}
                href={practice.href}
                className="group block p-6 rounded-[20px] border border-[var(--line)] hover:border-[var(--line-gold)] bg-[var(--bg-1)] transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[9px] tracking-[0.3em] text-[var(--accent)]">[{practice.num}]</span>
                  <ArrowRight size={13} className="text-[var(--accent)] opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-serif text-[22px] text-[var(--fg)] mb-3">{practice.name}</h3>
                <p className="text-[13px] text-[var(--fg-2)] leading-relaxed">{practice.sub}</p>
              </Link>
            ))}
          </div>

          {/* Catch-all line */}
          <Reveal delay={0.2}>
            <div className="mt-8 pt-6 border-t border-[var(--line)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex flex-col gap-3">
                <p className="font-serif text-[clamp(18px,1.7vw,24px)] text-[var(--fg-3)] leading-relaxed">
                  Four practices. <em style={{ color: "var(--accent)" }}>One method.</em>
                </p>
                <p className="font-serif text-[clamp(14px,1.2vw,17px)] text-[var(--fg-4)] max-w-[56ch] leading-relaxed">
                  If what's breaking doesn't fit a category, that is still a signal — bring it, and we read the architecture wherever it lives.
                </p>
              </div>
              <Link
                href="/connect"
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3 font-mono text-[10px] tracking-[0.28em] uppercase rounded-full font-semibold"
                style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)", color: "#080A0F" }}
              >
                Reach Us <ArrowRight size={11} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ROLES — Where You Sit
      ══════════════════════════════════════════ */}
      <section className="chapter section-dark" id="roles">
        <div className="shell">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(280px,1fr)_2.4fr] gap-16 items-center">
            {/* Left col */}
            <div className="md:sticky md:top-[30vh] h-fit flex flex-col gap-10">
              <Reveal>
                <h2 className="h-statement">
                  What changes — depending on <em>where you sit.</em>
                </h2>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="gold-line mb-4" />
                <p className="font-serif italic text-[clamp(15px,1.3vw,18px)] text-[var(--fg-3)] leading-relaxed">
                  We don't advise from the outside. We install architecture into how the organisation actually runs — and stay until it holds without us.
                </p>
              </Reveal>
              <Reveal delay={0.25}>
                <Link
                  href="/connect"
                  className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--accent)] hover:text-[var(--fg)] transition-colors group w-fit"
                >
                  Reach Us <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </Reveal>
            </div>

            {/* Right col — 2x2 grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                {
                  role: "Founder / CEO",
                  pull: "You can feel the company outgrowing the way you run it — you just can't see where it cracks first.",
                  work: "Map the failure points before they fail, and build the architecture that removes you as the single point of dependency.",
                },
                {
                  role: "CFO",
                  pull: "Cost is climbing, and headcount explains some of it — not the part that keeps you up.",
                  work: "Read workforce as cost, risk, and control architecture, then install the structure that makes the number governable — not just reported.",
                },
                {
                  role: "CHRO",
                  pull: "You're running more programs than ever, and the organisation is no more durable for it.",
                  work: "Build the operating system underneath HR — so capability is designed into structure, not dependent on who's running the program.",
                },
                {
                  role: "Investor / Board",
                  pull: "The thesis is sound. The question is whether the organisation can carry it.",
                  work: "Diligence the operating architecture — what survives the founder, and what is quietly held by individuals who can leave.",
                },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="h-full p-7 rounded-[20px] border border-[var(--line)] hover:border-[var(--line-gold)] bg-[var(--bg-1)] group hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--accent)] mb-4 block">{item.role}</span>
                    <p className="font-serif text-[clamp(15px,1.4vw,19px)] leading-snug text-[var(--fg-2)] group-hover:text-[var(--fg)] transition-colors mb-3">
                      {item.pull}
                    </p>
                    <p className="font-mono text-[11px] tracking-[0.12em] text-[var(--fg-4)] group-hover:text-[var(--fg-3)] transition-colors leading-relaxed">
                      {item.work}
                    </p>
                  </div>
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
              <span className="eyebrow text-[var(--accent)]">The engagement</span>
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
              className={`absolute top-1/2 -translate-y-1/2 font-serif italic text-[22vw] leading-none text-white opacity-[0.018] pointer-events-none select-none transition-opacity duration-700 group-hover:opacity-[0.04] overflow-hidden ${item.align === "right" ? "right-8" : "left-0"}`}
              style={{ maxWidth: "40%" }}
            >
              {item.num}
            </div>

            <div className="shell py-12 lg:py-20 flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-0">
              {/* Step tag — always left on mobile */}
              <div className={`lg:w-1/4 flex flex-col gap-3 ${item.align === "right" ? "lg:items-end lg:text-right" : ""}`}>
                <span className="font-mono text-[9px] tracking-[0.5em] uppercase text-[var(--fg-5)] opacity-50 group-hover:opacity-100 group-hover:text-[var(--accent)] transition-all duration-500">{item.label}</span>
                <span
                  className="font-serif italic text-[clamp(56px,8vw,96px)] leading-none group-hover:text-[var(--accent)] transition-colors duration-500"
                  style={{ WebkitTextStroke: "1px currentColor", color: "transparent" }}
                >
                  {item.num}
                </span>
              </div>

              {/* Divider line — desktop */}
              <div className="hidden lg:block lg:w-px lg:self-stretch mx-16 bg-gradient-to-b from-transparent via-[var(--line-strong)] to-transparent group-hover:via-[var(--accent)] transition-colors duration-500" />

              {/* Content — always left on mobile */}
              <div className={`flex-1 ${item.align === "right" ? "lg:text-right" : ""}`}>
                <h3 className="font-serif text-[clamp(28px,3.5vw,48px)] leading-[1.1] text-[var(--fg-2)] group-hover:text-[var(--fg)] transition-colors duration-500 mb-4">
                  {item.title}
                </h3>
                <p
                  className="font-mono text-[12px] tracking-[0.18em] text-[var(--fg-3)] group-hover:text-[var(--fg-2)] transition-colors duration-500 max-w-[40ch]"
                  style={{ marginLeft: item.align === "right" ? "auto" : undefined }}
                >
                  {item.sub}
                </p>
              </div>
            </div>

            {/* Bottom gold line — always visible faint, full on hover */}
            <div className="absolute bottom-0 left-0 h-[1px] w-0 group-hover:w-full bg-gradient-to-r from-[var(--accent)] via-[var(--accent)] to-transparent transition-all duration-700" />
          </motion.div>
        ))}

        <div className="h-px bg-[var(--line)] opacity-30" />
      </section>

      {/* ══════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════ */}
      <section className="chapter py-40 overflow-hidden relative" style={{ background: "linear-gradient(180deg, var(--bg) 0%, #0C0E14 50%, var(--bg) 100%)" }}>
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
              <motion.button
                onClick={() => setDiagOpen(true)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 px-10 py-5 font-mono text-[11px] tracking-[0.28em] uppercase rounded-full font-semibold"
                style={{
                  background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)",
                  color: "#080A0F",
                  boxShadow: "0 0 40px rgba(201,168,76,0.2)",
                }}
              >
                Start Diagnostic
                <ArrowRight size={14} />
              </motion.button>
              <p className="font-mono text-[10px] tracking-[0.15em] text-[var(--fg-4)] max-w-[44ch] text-center leading-relaxed">
                A 30-minute architectural read. You bring the signal — we tell you what's structurally producing it. No fee, no pitch.
              </p>
            </div>
          </Reveal>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)" }} />
      </section>

      <Footer />
    </div>
  );
}

/* ══════════════════════════════════════════
   FOOTER
══════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--line)]" style={{ background: "var(--bg)" }}>

      {/* Ghost wordmark — deep background */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[10%] font-serif italic font-bold leading-none pointer-events-none select-none whitespace-nowrap"
        style={{ fontSize: "20vw", color: "rgba(240,241,245,0.018)", letterSpacing: "-0.02em" }}
      >
        AXION
      </div>

      {/* Subtle top glow */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.25), transparent)" }}
      />

      <div className="shell relative z-10">

        {/* ── Main body ── */}
        <div className="pt-20 pb-16 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-14 lg:gap-8 border-b border-[var(--line)]">

          {/* Brand + tagline + follow capture */}
          <div className="flex flex-col gap-8">
            <div>
              <Link className="brand text-[clamp(22px,2.8vw,34px)] block mb-3 leading-none" href="/">
                Ax<em>ion</em><span className="domain">INDEX</span>
              </Link>
              <p className="font-serif italic text-[clamp(13px,1.1vw,15px)] text-[var(--fg-3)] leading-relaxed max-w-[30ch]">
                Codifying the operating patterns of the unfinished organisation.
              </p>
            </div>

            {/* Follow capture */}
            <div>
              <p className="font-mono text-[9px] tracking-[0.45em] uppercase mb-4" style={{ color: "#EDEBE3" }}>Follow the work</p>
              <a
                href="https://linkedin.com/company/axionindex"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 font-mono text-[10px] tracking-[0.22em] uppercase hover:text-[var(--accent)] transition-colors duration-300"
                style={{ color: "#EDEBE3" }}
              >
                <span
                  className="w-7 h-7 rounded-full border border-[var(--line-strong)] group-hover:border-[var(--line-gold)] flex items-center justify-center transition-colors duration-300"
                  style={{ background: "rgba(12,14,20,0.8)" }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--fg-4)] group-hover:text-[var(--accent)] transition-colors duration-300">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </span>
                LinkedIn
              </a>
            </div>
          </div>

          {/* Practices */}
          <div>
            <p className="font-mono text-[9px] tracking-[0.5em] uppercase text-[var(--accent)] opacity-50 mb-7">Practices</p>
            <ul className="flex flex-col gap-4">
              {[
                { href: "/expertise/people", label: "People Architecture" },
                { href: "/expertise/labour", label: "Labour Codes" },
                { href: "/expertise/ai-edge", label: "AI Edge Lab" },
                { href: "/expertise/family", label: "Family Business" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-mono text-[10px] tracking-[0.18em] uppercase hover:text-[var(--accent)] transition-colors duration-300"
                    style={{ color: "#EDEBE3" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Index */}
          <div>
            <p className="font-mono text-[9px] tracking-[0.5em] uppercase text-[var(--accent)] opacity-50 mb-7">Index</p>
            <ul className="flex flex-col gap-4">
              {[
                { href: "/", label: "Axion Index" },
                { href: "/patterns", label: "Operating Patterns" },
                { href: "/founder", label: "Story" },
                { href: "/about", label: "About" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-mono text-[10px] tracking-[0.18em] uppercase hover:text-[var(--accent)] transition-colors duration-300"
                    style={{ color: "#EDEBE3" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-mono text-[9px] tracking-[0.5em] uppercase text-[var(--accent)] opacity-50 mb-7">Contact</p>
            <div className="flex flex-col gap-4">
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: "#EDEBE3" }}>Bengaluru, India</span>
              <a
                href="mailto:office@axionindex.com"
                className="font-mono text-[10px] tracking-[0.1em] hover:text-[var(--accent)] transition-colors duration-300 normal-case"
                style={{ color: "#EDEBE3" }}
              >
                office@axionindex.com
              </a>
              <Link
                href="/connect"
                className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase font-semibold transition-all duration-300 mt-2"
                style={{
                  color: "#080A0F",
                  background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)",
                  borderRadius: 6,
                  padding: "8px 16px",
                }}
              >
                Reach Us
                <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform duration-300" />
              </Link>
            </div>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="font-mono text-[9px] tracking-[0.4em] uppercase" style={{ color: "#EDEBE3" }}>
            &copy; 2026 Axion Index. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            {[
              { href: "https://linkedin.com/company/axionindex", label: "LinkedIn", external: true },
              { href: "/", label: "Axion Index", external: false },
              { href: "/patterns", label: "Operating Patterns", external: false },
              { href: "/founder", label: "Story", external: false },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noopener noreferrer" : undefined}
                className="font-mono text-[9px] tracking-[0.3em] uppercase hover:text-[var(--accent)] transition-colors duration-300"
                style={{ color: "#EDEBE3" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
