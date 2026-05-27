"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Signal, Layers, Target, Activity } from "lucide-react";

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

export default function Home() {
  const [activePractice, setActivePractice] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="min-h-screen">

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
            <div className="eyebrow eyebrow--center mb-4 text-[var(--accent)]">
              AXION&nbsp;&nbsp;·&nbsp;&nbsp;INDEX
            </div>
            <div className="flex justify-center mb-10">
              <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-[var(--fg-3)] border border-[var(--line-strong)] rounded-full px-4 py-1.5">
                Organisational Advisory
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="h-display hero-glow mb-8">
              From <s className="opacity-30 line-through decoration-[var(--accent)]">ambiguity</s><br />
              to <em>architecture.</em>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="lead mx-auto mb-14 text-[var(--fg-3)] max-w-[48ch]">
              Most organisations don't fail when strategy breaks.<br />
              They fail when their internal architecture cannot carry<br />what they are becoming.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-col items-center gap-8">
              {/* Gold CTA */}
              <motion.a
                href="#signals"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center gap-3 px-8 py-4 font-mono text-[11px] tracking-[0.28em] uppercase overflow-hidden rounded-full"
                style={{
                  background: "linear-gradient(135deg, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.05) 100%)",
                  border: "1px solid rgba(201,168,76,0.3)",
                  color: "var(--accent-2)",
                }}
              >
                <span className="relative z-10">Read the signal</span>
                <ArrowRight size={13} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-[var(--accent-soft)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>
              <a className="kbd-arrow text-white hover:text-[var(--accent)]" href="#signals">Scroll to explore</a>
            </div>
          </Reveal>
        </motion.div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 w-full h-[35vh] bg-gradient-to-t from-[var(--bg)] to-transparent pointer-events-none" />

        {/* Corner decorations */}
        <div className="absolute top-24 left-8 font-mono text-[9px] tracking-[0.3em] text-[var(--fg-5)] opacity-40 hidden lg:block">
          EST. 2024 · BENGALURU
        </div>
        <div className="absolute top-24 right-8 font-mono text-[9px] tracking-[0.3em] text-[var(--fg-5)] opacity-40 hidden lg:block">
          OPERATING INTELLIGENCE
        </div>
      </header>

      {/* ══════════════════════════════════════════
          SIGNALS — Stacking Cards
      ══════════════════════════════════════════ */}
      <section className="chapter section-dark relative" id="signals">
        <div className="shell">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-20 items-start">
            <div className="lg:sticky lg:top-32 h-fit">
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
                <div className="gold-line mb-6" />
                <p className="text-[var(--fg-4)] max-w-[28ch] leading-relaxed font-mono text-[11px] tracking-[0.2em] uppercase text-white">
                  Scroll to explore.
                </p>
              </Reveal>
            </div>

            <div className="flex flex-col gap-[6vh] md:gap-[10vh] pb-0">
              {[
                { num: "01", text: "Growth is <em>accelerating.</em><br>Stability is not.", href: "/expertise/people", icon: <Layers size={18} /> },
                { num: "02", text: "The organisation behaves differently<br><em>depending on who is in the room.</em>", href: "/expertise/people", icon: <Target size={18} /> },
                { num: "03", text: "AI is increasing <em>output.</em><br>Decision quality is dropping.", href: "/expertise/ai-edge", icon: <Signal size={18} /> },
                { num: "04", text: "Cost is rising.<br><em>You don't know why.</em>", href: "/expertise/labour", icon: <ArrowRight size={18} /> },
                { num: "05", text: "The business is stable.<br><em>The future is not.</em>", href: "/expertise/family", icon: <Activity size={18} /> },
                { num: "06", text: "You have <em>strong people.</em><br>You do not have a strong system.", href: "/expertise/ai-edge", icon: <Layers size={18} /> },
              ].map((signal, i) => (
                <div
                  key={i}
                  className="sticky transition-all duration-500"
                  style={{ top: `${128 + i * 44}px`, zIndex: 10 }}
                >
                  <div className="flex items-center justify-between px-6 py-4 bg-[var(--bg-1)] border border-b-0 border-[var(--line-strong)] rounded-t-[24px]">
                    <span className="font-mono text-[10px] text-[var(--accent)] tracking-[0.35em] font-semibold">SIGNAL {signal.num}</span>
                    <div className="text-[var(--accent)] opacity-50">{signal.icon}</div>
                  </div>
                  <Reveal delay={0.1} className="h-full">
                    <Link
                      href={signal.href}
                      className="group block bg-[var(--bg-1)] border border-[var(--line-strong)] hover:border-[var(--line-gold)] transition-all duration-500 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] rounded-b-[24px] p-8"
                    >
                      <h3
                        className="text-[clamp(22px,2.8vw,30px)] font-serif leading-[1.35] text-[var(--fg-2)] group-hover:text-[var(--fg)] transition-colors duration-500 mb-6"
                        dangerouslySetInnerHTML={{ __html: signal.text }}
                      />
                      <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                        <span>Explore</span>
                        <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
                  <h2 className="h-display text-[clamp(32px,4.5vw,56px)] leading-[0.95] mb-10">
                    We don't explore the <br/>
                    <em>problem.</em>
                  </h2>
                </Reveal>
                <Reveal delay={0.2}>
                  <p className="body-text text-[var(--fg-3)] text-[clamp(18px,2vw,24px)] mb-12 max-w-[24ch] leading-tight font-serif italic">
                    We map the architecture that carries the consequence.
                  </p>
                </Reveal>
                <Reveal delay={0.3}>
                  <div className="flex flex-col gap-6 pt-10 border-t border-[var(--line)]">
                    <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-white mb-2">Read your organisation properly.</p>
                    <span className="font-mono text-[10px] tracking-[0.5em] uppercase text-white opacity-80">We map:</span>
                  </div>
                </Reveal>
              </div>
            </div>

            <div className="relative border-l border-[var(--line)] pl-10 md:pl-20 flex flex-col pt-20 lg:pt-20">
              {[
                { title: "Where the system is breaking", step: "01", bg: "linear-gradient(180deg, rgba(201,168,76,0.06) 0%, transparent 100%)" },
                { title: "What is holding it together artificially", step: "02", bg: "linear-gradient(180deg, rgba(74,158,255,0.04) 0%, transparent 100%)" },
                { title: "What will fail next", step: "03", bg: "linear-gradient(180deg, rgba(201,168,76,0.04) 0%, transparent 100%)" },
                { title: "Then we redesign it so it holds", step: "04", bg: "linear-gradient(180deg, rgba(240,241,245,0.03) 0%, transparent 100%)" },
              ].map((item, i) => (
                <div key={i} className="min-h-[10vh] flex flex-col justify-center relative group py-4">
                  <div className="absolute left-[-41px] md:left-[-81px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-[var(--accent)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute left-[-50px] md:left-[-90px] top-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[var(--bg)] border-2 border-[var(--accent)] z-20 group-hover:scale-[1.8] transition-transform duration-500 shadow-[0_0_15px_var(--accent-soft)]" />
                    <span className="font-serif italic text-[28px] text-[var(--fg-5)] group-hover:text-[var(--accent)] transition-colors duration-500">{item.step}</span>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ margin: "-20% 0px" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div
                      className="p-6 md:p-8 rounded-[28px] border border-[var(--line)] backdrop-blur-2xl transition-all duration-700 group-hover:border-[var(--line-gold)] group-hover:shadow-[0_30px_70px_rgba(0,0,0,0.6)]"
                      style={{ background: item.bg }}
                    >
                      <h3 className="font-serif text-[clamp(16px,1.6vw,22px)] leading-[1.2] text-[var(--fg)]">{item.title}</h3>
                    </div>
                  </motion.div>
                </div>
              ))}

            </div>
          </div>
        </div>
        <div className="absolute right-0 bottom-[-5%] font-serif italic text-[20vw] text-white opacity-[0.015] pointer-events-none select-none whitespace-nowrap overflow-hidden max-w-full">
          ARCHITECTURE
        </div>
      </section>

      {/* ══════════════════════════════════════════
          METHOD — Founding Philosophy
      ══════════════════════════════════════════ */}
      <section className="section-tint relative overflow-hidden py-16" id="method">
        <div className="shell">
          <div className="max-w-[800px] mx-auto text-center flex flex-col items-center">
            <Reveal>
              <span className="eyebrow eyebrow--center mb-8 text-[var(--accent)]">Our Founding Philosophy</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="h-section mb-10">
                Our Operating <em>Logic.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="body-text mx-auto text-[var(--fg-3)] mb-8">
                Interpreted across labour, AI, people, and ownership.
              </p>
            </Reveal>

            <div className="flex flex-col md:flex-row justify-center items-center gap-0 md:gap-0 w-full mt-8 mb-4">
              {[
                { label: "Belief", desc: "Absorbed in the Soil. Tested at Udaan. Every founder starts here.", active: false },
                { label: "Conviction", desc: "Earned through collisions at SCB, HSBC, TGB. Data, proof, and lived experience.", active: true },
                { label: "Rhythm", desc: "Designed at Gameskraft. When conviction becomes repeatable behaviour.", active: false },
              ].map((item, i) => (
                <div key={i} className="flex flex-col md:flex-row items-center">
                  <Reveal delay={0.3 + i * 0.15} y={20}>
                    <div className="flex flex-col items-center gap-6">
                      {/* Circle */}
                      <motion.div
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-center justify-center rounded-full cursor-default"
                        style={{
                          width: "clamp(160px,18vw,220px)",
                          height: "clamp(160px,18vw,220px)",
                          border: item.active ? "2px solid rgba(201,168,76,0.8)" : "1px solid rgba(201,168,76,0.35)",
                          background: item.active ? "rgba(201,168,76,0.06)" : "rgba(12,14,20,0.6)",
                          boxShadow: item.active ? "0 0 40px rgba(201,168,76,0.1)" : "none",
                        }}
                      >
                        <span className="font-serif italic text-[var(--accent)]" style={{ fontSize: "clamp(22px,2.5vw,32px)" }}>
                          {item.label}
                        </span>
                      </motion.div>
                      {/* Description below circle */}
                      <p className="font-serif text-[var(--fg-4)] text-center leading-relaxed max-w-[18ch]" style={{ fontSize: "clamp(13px,1.1vw,15px)" }}>
                        {item.desc}
                      </p>
                    </div>
                  </Reveal>
                  {/* Arrow between circles */}
                  {i < 2 && (
                    <Reveal delay={0.4 + i * 0.15}>
                      <span className="text-[var(--accent)] opacity-40 text-[22px] mx-6 md:mx-10 my-4 md:my-0 md:mb-16">
                        →
                      </span>
                    </Reveal>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-square pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)" }} />
      </section>

      {/* ══════════════════════════════════════════
          STATEMENTS — Four operating logic
      ══════════════════════════════════════════ */}
      <section className="chapter section-dark relative overflow-hidden" id="statements">
        <div className="shell">
          <div className="mb-24">
            <Reveal>
              <span className="eyebrow mb-6 text-[var(--accent)]">Our Approach at Axion Index</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="h-section">
                Four statements.<br />
                <em>One operating logic.</em>
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "01", title: "Diagnose", desc: "We diagnose where the system is breaking." },
              { num: "02", title: "Codify", desc: "We codify what is dependent on individuals." },
              { num: "03", title: "Redesign", desc: "We redesign the architecture." },
              { num: "04", title: "Hold", desc: "We make it hold under pressure." },
            ].map((item, i) => (
              <StatementCard key={i} item={item} i={i} />
            ))}
          </div>
        </div>
        <div className="absolute left-[-5%] bottom-[-10%] w-[40%] aspect-square bg-[radial-gradient(circle,var(--accent-glow)_0%,transparent_70%)] pointer-events-none" />
      </section>

      {/* ══════════════════════════════════════════
          PRACTICES — Interactive Accordion
      ══════════════════════════════════════════ */}
      <section className="chapter section-deep overflow-hidden" id="practices">
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

          <div className="flex flex-col lg:flex-row gap-3 lg:h-[520px]">
            {[
              { num: "01", name: "People Architecture", sub: "The foundation. The other three sit on top of this one.", href: "/expertise/people", label: "Enter People Architecture →" },
              { num: "02", name: "Labour Codes", sub: "When cost, classification, and compliance stop aligning.", href: "/expertise/labour", label: "Enter Labour Codes →" },
              { num: "03", name: "AI Edge Lab", sub: "When work is changing faster than roles.", href: "/expertise/ai-edge", label: "Enter AI Edge Lab →" },
              { num: "04", name: "Family Business", sub: "When continuity depends on individuals, not structure.", href: "/expertise/family", label: "Enter Family Business →" },
            ].map((practice, i) => {
              const isActive = activePractice === i;
              return (
                <motion.div
                  key={i}
                  onMouseEnter={() => setActivePractice(i)}
                  className={`relative overflow-hidden cursor-pointer rounded-[28px] border transition-colors duration-500 ${
                    isActive
                      ? "flex-[3] bg-[var(--bg-2)] border-[var(--line-gold)] shadow-[0_30px_60px_rgba(0,0,0,0.6),0_0_40px_var(--accent-glow)]"
                      : "flex-1 bg-[rgba(12,14,20,0.5)] border-[var(--line)] hover:border-[var(--line-strong)]"
                  }`}
                  layout
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="absolute inset-0 p-8 flex flex-col h-full">
                    <div className={`font-mono text-[10px] tracking-[0.3em] mb-8 transition-colors duration-500 ${isActive ? "text-[var(--accent)]" : "text-[var(--fg-5)]"}`}>
                      [ {practice.num} ]
                    </div>
                    <div className="flex flex-col h-full justify-between">
                      <div className="relative">
                        <AnimatePresence mode="wait">
                          {isActive ? (
                            <motion.div key="active" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.4 }}>
                              <h3 className="font-serif text-[clamp(28px,3.5vw,44px)] leading-[1.1] text-[var(--fg)] mb-6">
                                {practice.name.split(' ').map((word, j) =>
                                  ['Architecture', 'Codes', 'Lab', 'Business'].includes(word)
                                    ? <em key={j} className="italic block text-[var(--accent)]">{word}</em>
                                    : <span key={j}>{word} </span>
                                )}
                              </h3>
                              <p className="text-[15px] text-[var(--fg-3)] leading-relaxed max-w-[30ch] mb-8">{practice.sub}</p>
                            </motion.div>
                          ) : (
                            <motion.div key="collapsed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:absolute lg:top-0 lg:left-0 lg:origin-top-left lg:rotate-[-90deg] lg:translate-y-[300px] lg:translate-x-[5px] whitespace-nowrap">
                              <h3 className="font-serif text-[22px] text-[var(--fg-4)] tracking-wide">{practice.name}</h3>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {isActive && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="pt-8 border-t border-[var(--line)]">
                          <Link href={practice.href} className="inline-flex items-center gap-3 font-mono text-[10.5px] tracking-widest uppercase text-[var(--accent)] hover:text-[var(--fg)] transition-colors group">
                            {practice.label}
                            <ArrowRight size={13} className="group-hover:translate-x-2 transition-transform" />
                          </Link>
                        </motion.div>
                      )}
                    </div>
                  </div>
                  {isActive && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-[-10%] right-[-5%] w-[60%] aspect-square pointer-events-none"
                      style={{ background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)" }} />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ROLES — Who We Engage With
      ══════════════════════════════════════════ */}
      <section className="chapter section-dark" id="roles">
        <div className="shell">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(300px,1fr)_1.5fr] gap-16 items-start">
            <div>
              <Reveal>
                <h2 className="h-statement">
                  How we engage with <em>depending on where you sit.</em>
                </h2>
              </Reveal>
            </div>
            <div className="flex flex-col border-t border-[var(--line)]">
              {[
                { if: "Founder / CEO", then: "See where the organisation will break — before it does." },
                { if: "CFO", then: "Read workforce as cost, risk, and control architecture — not headcount." },
                { if: "CHRO", then: "Stop running HR programs. Start running the operating system underneath them." },
              ].map((role, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="py-10 border-b border-[var(--line)] group hover:bg-[rgba(201,168,76,0.02)] transition-colors px-4 -mx-4">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--accent)] mb-4 block">{role.if}</span>
                    <p className="font-serif text-[24px] leading-snug text-[var(--fg-2)] group-hover:text-[var(--fg)] transition-colors" dangerouslySetInnerHTML={{ __html: role.then }} />
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

            {/* Ghost number watermark */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 font-serif italic text-[22vw] leading-none text-white opacity-[0.018] pointer-events-none select-none transition-opacity duration-700 group-hover:opacity-[0.05] ${item.align === "right" ? "right-[-2vw]" : "left-[-2vw]"}`}
            >
              {item.num}
            </div>

            <div className={`shell py-12 lg:py-20 flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-0 ${item.align === "right" ? "lg:flex-row-reverse" : ""}`}>
              {/* Step tag */}
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

              {/* Content */}
              <div className={`flex-1 ${item.align === "right" ? "lg:text-right" : ""}`}>
                <h3 className="font-serif text-[clamp(28px,3.5vw,48px)] leading-[1.1] text-[var(--fg-2)] group-hover:text-[var(--fg)] transition-colors duration-500 mb-4">
                  {item.title}
                </h3>
                <p
                  className="font-mono text-[12px] tracking-[0.2em] text-[var(--fg-5)] group-hover:text-[var(--fg-3)] transition-colors duration-500 max-w-[40ch]"
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
            <div className="flex flex-wrap justify-center gap-5">
              <motion.a
                href="/expertise/ai-edge/diagnostic"
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
              </motion.a>
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

      {/* Giant background wordmark */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[30%] font-serif italic font-bold text-[22vw] leading-none text-white opacity-[0.022] pointer-events-none select-none whitespace-nowrap tracking-tight">
        AXION
      </div>

      {/* Top band — brand + tagline full width */}
      <div className="border-b border-[var(--line)]">
        <div className="shell pt-10 pb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <Link className="brand text-[clamp(24px,3.5vw,40px)] block mb-2 leading-none" href="/">
                Ax<em>ion</em><span className="domain">INDEX</span>
              </Link>
              <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-white">
                EST. 2024 &nbsp;·&nbsp; BENGALURU &nbsp;·&nbsp; OPERATING INTELLIGENCE
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle band — asymmetric nav */}
      <div className="shell py-16">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-12">

          {/* Practices — takes more space */}
          <div className="col-span-2 lg:col-span-1 lg:col-auto">
            <span className="font-mono text-[9px] tracking-[0.5em] uppercase text-[var(--accent)] opacity-50 mb-8 block">Practices</span>
            <ul className="flex flex-col gap-5">
              {[
                { href: "/expertise/people", label: "People Architecture" },
                { href: "/expertise/labour", label: "Labour Codes" },
                { href: "/expertise/ai-edge", label: "AI Edge Lab" },
                { href: "/expertise/family", label: "Family Business" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--fg-4)] hover:text-[var(--accent)] transition-colors duration-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <span className="font-mono text-[9px] tracking-[0.5em] uppercase text-[var(--accent)] opacity-50 mb-8 block">Platform</span>
            <ul className="flex flex-col gap-5">
              {[
                { href: "/about", label: "About" },
                { href: "/founder", label: "Founder" },
                { href: "/connect", label: "Connect" },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--fg-4)] hover:text-[var(--accent)] transition-colors duration-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}          <div>
            <span className="font-mono text-[9px] tracking-[0.5em] uppercase text-[var(--accent)] opacity-50 mb-8 block">Contact</span>
            <div className="flex flex-col gap-5">
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--fg-4)]">Bengaluru, India</span>
              <a
                href="mailto:office@axionindex.com"
                className="font-mono text-[11px] tracking-[0.1em] text-[var(--fg-4)] hover:text-[var(--accent)] transition-colors duration-300 normal-case"
              >
                office@axionindex.com
              </a>
            </div>
          </div>


        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--line)]">
        <div className="shell py-6 flex items-center justify-start">
          <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-white">
            &copy; 2026 Axion Index. All rights reserved.
          </span>
        </div>
      </div>

    </footer>
  );
}
