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
            <div className="eyebrow eyebrow--center mb-10 text-[var(--accent)]">
              AXION&nbsp;&nbsp;·&nbsp;&nbsp;INDEX
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
              <a className="kbd-arrow text-[var(--fg-4)] hover:text-[var(--accent)]" href="#signals">Scroll to explore</a>
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
                <p className="text-[var(--fg-4)] max-w-[28ch] leading-relaxed font-mono text-[11px] tracking-[0.2em] uppercase">
                  Scroll to explore.
                </p>
              </Reveal>
            </div>

            <div className="flex flex-col gap-[10vh] pb-0">
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
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-0 items-start lg:min-h-[300vh]">
            <div className="lg:sticky lg:top-0 h-auto lg:h-screen flex flex-col justify-center py-16 lg:py-20 lg:pr-10 z-30 pointer-events-none">
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
                  <div className="flex flex-col gap-8 pt-12 border-t border-[var(--line)]">
                    <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-[var(--fg-5)]">Read your organisation properly.</p>
                  </div>
                </Reveal>
              </div>
            </div>

            <div className="relative border-l border-[var(--line)] pl-10 md:pl-20 flex flex-col">
              <div className="h-[20vh] flex items-end pb-10">
                <Reveal>
                  <span className="font-mono text-[10px] tracking-[0.5em] uppercase text-[var(--accent)] opacity-50">We map:</span>
                </Reveal>
              </div>

              {[
                { title: "Where the system is breaking", step: "01", icon: "DIAGNOSE", bg: "linear-gradient(180deg, rgba(201,168,76,0.06) 0%, transparent 100%)" },
                { title: "What is holding it together artificially", step: "02", icon: "CODIFY", bg: "linear-gradient(180deg, rgba(74,158,255,0.04) 0%, transparent 100%)" },
                { title: "What will fail next", step: "03", icon: "PREDICT", bg: "linear-gradient(180deg, rgba(201,168,76,0.04) 0%, transparent 100%)" },
                { title: "Then we redesign it so it holds", step: "04", icon: "INSTALL", bg: "linear-gradient(180deg, rgba(240,241,245,0.03) 0%, transparent 100%)" },
              ].map((item, i) => (
                <div key={i} className="min-h-[60vh] flex flex-col justify-center relative group">
                  <div className="absolute left-[-41px] md:left-[-81px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-[var(--accent)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute left-[-50px] md:left-[-90px] top-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
                    <span className="font-mono text-[8px] text-[var(--fg-5)] rotate-[-90deg] translate-y-[-30px] tracking-[0.4em]">{item.icon}</span>
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
                      className="p-8 md:p-10 rounded-[28px] border border-[var(--line)] backdrop-blur-2xl transition-all duration-700 group-hover:border-[var(--line-gold)] group-hover:shadow-[0_30px_70px_rgba(0,0,0,0.6)]"
                      style={{ background: item.bg }}
                    >
                      <h3 className="font-serif text-[clamp(18px,2vw,28px)] leading-[1.2] text-[var(--fg)]">{item.title}</h3>
                    </div>
                  </motion.div>
                </div>
              ))}
              <div className="h-[20vh]" />
            </div>
          </div>
        </div>
        <div className="absolute right-[-10%] top-[20%] font-serif italic text-[28vw] text-white opacity-[0.012] pointer-events-none select-none whitespace-nowrap">
          ARCHITECTURE
        </div>
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
              <Reveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="group relative p-8 border border-[var(--line)] rounded-[24px] bg-[var(--bg-1)] hover:border-[var(--line-gold)] transition-all duration-500"
                >
                  <div className="font-mono text-[10px] tracking-[0.4em] text-[var(--accent)] mb-6 opacity-60">[ {item.num} ]</div>
                  <h3 className="font-serif text-[28px] mb-4 group-hover:text-[var(--accent)] transition-colors duration-500">{item.title}</h3>
                  <p className="text-[14px] text-[var(--fg-3)] leading-relaxed max-w-[20ch]">{item.desc}</p>
                  <div className="mt-8 w-10 h-[1px] bg-[var(--line-strong)] group-hover:w-full group-hover:bg-[var(--accent)] transition-all duration-700" />
                  {/* Corner glow */}
                  <div className="absolute top-0 right-0 w-24 h-24 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: "radial-gradient(circle at top right, var(--accent-glow), transparent 70%)" }} />
                </motion.div>
              </Reveal>
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
                Four practices.<br />
                <em>One operating logic.</em>
              </h2>
            </Reveal>
          </div>

          <div className="flex flex-col lg:flex-row gap-3 min-h-[400px] lg:h-[520px]">
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
                  Who we engage with <em>depending on where you sit.</em>
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
          METHOD — Founding Philosophy
      ══════════════════════════════════════════ */}
      <section className="chapter section-tint relative overflow-hidden" id="method">
        <div className="shell">
          <div className="max-w-[800px] mx-auto text-center flex flex-col items-center">
            <Reveal>
              <span className="eyebrow eyebrow--center mb-8 text-[var(--accent)]">Our Founding Philosophy</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="h-section mb-10">
                One platform method.<br />
                <em>Four practice doctrines.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="body-text mx-auto text-[var(--fg-3)] mb-20">
                Interpreted across labour, AI, people, and ownership.
              </p>
            </Reveal>

            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 mb-20">
              {[{ label: "Belief" }, { label: "Conviction" }, { label: "Rhythm" }].map((item, i) => (
                <div key={i} className="flex items-center gap-6 md:gap-10">
                  <Reveal delay={0.3 + i * 0.15} y={10}>
                    <div className="group">
                      <span className="font-serif text-[clamp(28px,3.5vw,48px)] text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors duration-500 cursor-default">
                        {item.label}
                      </span>
                    </div>
                  </Reveal>
                  {i < 2 && (
                    <Reveal delay={0.4 + i * 0.15} scale={0.8}>
                      <span className="text-[var(--accent)] opacity-40 text-[24px] font-light">→</span>
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
          MAKE IT REAL — What happens next
      ══════════════════════════════════════════ */}
      <section className="chapter section-deep" id="real">
        <div className="shell">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-20 items-start">
            <div>
              <Reveal>
                <span className="eyebrow mb-6 text-[var(--accent)]">Make it real</span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="h-section mb-8">
                  What happens <br/>
                  <em>next.</em>
                </h2>
              </Reveal>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { num: "01", title: "You bring the signal." },
                { num: "02", title: "We diagnose the architecture." },
                { num: "03", title: "We define the intervention." },
                { num: "04", title: "We make it hold." },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 0.1} y={20}>
                  <motion.div
                    whileHover={{ y: -4, borderColor: "var(--line-gold)" }}
                    transition={{ duration: 0.3 }}
                    className="cool-card group bg-[var(--bg-1)] border-[var(--line)] shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                  >
                    <div className="font-mono text-[10px] text-[var(--accent)] mb-4 opacity-60">{item.num}</div>
                    <h3 className="font-serif text-[22px] text-[var(--fg-2)] group-hover:text-[var(--fg)] transition-colors">{item.title}</h3>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
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
                href="#practices"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 px-10 py-5 font-mono text-[11px] tracking-[0.28em] uppercase rounded-full font-semibold"
                style={{
                  background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)",
                  color: "#080A0F",
                  boxShadow: "0 0 40px rgba(201,168,76,0.2)",
                }}
              >
                Explore Practices
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
    <footer className="foot border-t border-[var(--line)]">
      {/* Pre-footer CTA bar */}
      <div className="border-b border-[var(--line)] py-16">
        <div className="shell flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-[var(--accent)] mb-3">Ready to begin?</p>
            <h3 className="font-serif text-[clamp(24px,3vw,40px)] text-[var(--fg)]">
              From <s className="opacity-30">ambiguity</s> to <em className="text-[var(--accent)]">architecture.</em>
            </h3>
          </div>
          <Link
            href="/connect"
            className="shrink-0 inline-flex items-center gap-3 px-8 py-4 font-mono text-[10.5px] tracking-[0.25em] uppercase rounded-full border border-[var(--line-gold)] text-[var(--accent)] hover:bg-[var(--accent-soft)] transition-all duration-300"
          >
            Start Diagnostic
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      <div className="shell">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-20">
          <div className="md:col-span-1">
            <Link className="brand text-[24px] mb-6 block" href="/">Ax<em>ion</em><span className="domain">INDEX</span></Link>
            <p className="text-[13px] text-[var(--fg-4)] leading-relaxed max-w-[20ch]">
              From <s className="opacity-40">ambiguity</s><br />to architecture.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <h5 className="font-mono text-[9.5px] tracking-widest uppercase text-[var(--fg-3)]">Practices</h5>
            <ul className="flex flex-col gap-3 font-mono text-[10.5px] text-[var(--fg-4)] uppercase tracking-wider">
              {[
                { href: "/expertise/labour", label: "Labour Codes" },
                { href: "/expertise/ai-edge", label: "AI Edge Lab" },
                { href: "/expertise/people", label: "People Architecture" },
                { href: "/expertise/family", label: "Family Business" },
              ].map(l => (
                <li key={l.href}><Link href={l.href} className="hover:text-[var(--accent)] transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <h5 className="font-mono text-[9.5px] tracking-widest uppercase text-[var(--fg-3)]">Platform</h5>
            <ul className="flex flex-col gap-3 font-mono text-[10.5px] text-[var(--fg-4)] uppercase tracking-wider">
              {[
                { href: "/about", label: "About" },
                { href: "/founder", label: "Founder" },
                { href: "/connect", label: "Connect" },
              ].map(l => (
                <li key={l.href}><Link href={l.href} className="hover:text-[var(--accent)] transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <h5 className="font-mono text-[9.5px] tracking-widest uppercase text-[var(--fg-3)]">Contact</h5>
            <div className="flex flex-col gap-3 font-mono text-[10.5px] text-[var(--fg-4)] uppercase tracking-wider">
              <span>Bengaluru, India</span>
              <a href="mailto:office@axionindex.com" className="hover:text-[var(--accent)] transition-colors normal-case">office@axionindex.com</a>
            </div>
          </div>
        </div>

        <div className="py-8 border-t border-[var(--line)] flex flex-wrap justify-between items-center gap-6 font-mono text-[9.5px] tracking-widest uppercase text-[var(--fg-5)]">
          <span>&copy; 2026 AXION INDEX. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-8">
            <span>DESIGNED FOR CONSEQUENCE</span>
            <span>BUILT TO HOLD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
