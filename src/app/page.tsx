"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Signal, Layers, Target, Activity } from "lucide-react";

export default function Home() {
  const [activePractice, setActivePractice] = useState(0);

  return (
    <div className="min-h-screen">
      {/* HERO SECTION - High Impact */}
      <header className="relative min-h-screen flex items-center justify-center bg-transparent pt-20 overflow-hidden">
        <div className="shell text-center relative z-10">
          <Reveal>
            <div className="eyebrow eyebrow--center mb-8 text-[var(--accent)] drop-shadow-md">AXION&nbsp;&nbsp;·&nbsp;&nbsp;INDEX</div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="h-display hero-glow leading-[0.95] mb-8 drop-shadow-2xl">
              From <s className="opacity-50">ambiguity</s><br />
              to <em className="text-[var(--accent)]">architecture.</em>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="lead mx-auto mb-12 opacity-90 text-[var(--fg-2)] max-w-[50ch]">
              Most organisations don’t fail when strategy breaks.<br />
              They fail when their internal architecture cannot carry what they are becoming.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-col items-center gap-10">
              <Link href="/connect" className="nav-cta scale-125 px-12 py-5 bg-[var(--fg)] text-[var(--bg)] border-none hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                Start Diagnostic
              </Link>
              <a className="kbd-arrow text-[var(--fg-3)] hover:text-[var(--accent)]" href="#signals">Read the signal</a>
            </div>
          </Reveal>
        </div>
        
        {/* Animated gradients for depth */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(160,160,160,0.03)_0%,transparent_50%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-[#06070B] to-transparent pointer-events-none" />
      </header>

      {/* SIGNALS SECTION - Stacking Cards Layout */}
      <section className="chapter section-dark relative" id="signals">
        <div className="shell">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-20 items-start">
            {/* Left side: Sticky Title */}
            <div className="lg:sticky lg:top-32 h-fit">
              <Reveal><span className="eyebrow mb-6">If this feels familiar</span></Reveal>
              <Reveal delay={0.1}>
                <h2 className="h-section mb-8">
                  You don’t need a service.<br />
                  You need to read <em className="text-[var(--accent)]">what is breaking.</em>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="flex items-center gap-4 text-[var(--fg-4)] font-mono text-[11px] uppercase tracking-widest mb-12">
                  <Activity size={14} className="text-[var(--accent)]" />
                  Live Diagnostic Map
                </div>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="text-[var(--fg-3)] max-w-[32ch] leading-relaxed">
                  Scroll to explore the structural signals that indicate architectural drift.
                </p>
              </Reveal>
            </div>

            {/* Right side: Stacking Cards */}
            <div className="flex flex-col gap-[20vh] pb-[20vh]">
              {[
                { num: "01", text: "Growth is <em>accelerating.</em><br>Stability is not.", href: "/expertise/people", icon: <Layers size={24} /> },
                { num: "02", text: "The organisation behaves differently<br><em>depending on who is in the room.</em>", href: "/expertise/people", icon: <Target size={24} /> },
                { num: "03", text: "AI is increasing <em>output.</em><br>Decision quality is dropping.", href: "/expertise/ai-edge", icon: <Signal size={24} /> },
                { num: "04", text: "Cost is rising.<br><em>You don’t know why.</em>", href: "/expertise/labour", icon: <ArrowRight size={24} /> },
                { num: "05", text: "The business is stable.<br><em>The future is not.</em>", href: "/expertise/family", icon: <Activity size={24} /> },
                { num: "06", text: "You have <em>strong people.</em><br>You do not have a strong system.", href: "/expertise/ai-edge", icon: <Layers size={24} /> },
              ].map((signal, i) => (
                <div 
                  key={i} 
                  className="sticky h-fit transition-all duration-500"
                  style={{ top: `${160 + (i * 24)}px` }}
                >
                  <Reveal delay={0.1} className="h-full">
                    <Link href={signal.href} className="cool-card group block h-full bg-[#0E1117] border-[rgba(255,255,255,0.08)] hover:border-[var(--accent)] transition-all duration-500 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
                      <div className="flex justify-between items-start mb-12">
                        <span className="font-mono text-[12px] text-[var(--accent)] tracking-[0.3em] font-bold">SIGNAL {signal.num}</span>
                        <div className="text-[var(--fg-4)] group-hover:text-[var(--accent)] transition-colors duration-300">
                          {signal.icon}
                        </div>
                      </div>
                      <h3 className="text-[clamp(24px,3vw,32px)] font-serif leading-[1.3] text-[var(--fg)] mb-12" dangerouslySetInnerHTML={{ __html: signal.text }} />
                      <div className="flex items-center gap-4 pt-8 border-t border-[var(--line)] font-mono text-[10px] tracking-widest uppercase text-[var(--fg-4)] group-hover:text-[var(--fg)] transition-colors">
                        Diagnose architecture <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                      </div>
                    </Link>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BRIDGE SECTION - Vertical Pillar Engagement Logic */}
      <section className="chapter section-deep relative py-0" id="bridge">
        <div className="shell">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-0 items-start min-h-[300vh]">
            {/* Left side: Strictly Pinned Context - Increased Width */}
            <div className="lg:sticky lg:top-0 h-screen flex flex-col justify-center py-20 pr-10 z-30 pointer-events-none">
              <div className="pointer-events-auto">
                <Reveal>
                  <span className="eyebrow mb-8 text-[var(--accent)]">Engagement Logic</span>
                </Reveal>
                <Reveal delay={0.1}>
                  <h2 className="h-display text-[clamp(32px,4.5vw,56px)] leading-[0.95] mb-10">
                    We don’t explore the <br/>
                    <em className="text-[var(--accent)]">problem.</em>
                  </h2>
                </Reveal>
                <Reveal delay={0.2}>
                  <p className="body-text text-[var(--fg-2)] text-[clamp(18px,2vw,24px)] mb-12 max-w-[24ch] leading-tight font-serif italic">
                    We map the architecture that carries the consequence.
                  </p>
                </Reveal>
                <Reveal delay={0.3}>
                  <div className="flex flex-col gap-8 pt-12 border-t border-[rgba(255,255,255,0.08)]">
                    <Link href="/connect" className="nav-cta self-start bg-[var(--fg)] text-[var(--bg)] border-none px-12 py-4 scale-110 font-bold hover:bg-[var(--accent)] transition-all">
                      Start Diagnostic
                    </Link>
                    <p className="font-mono text-[11px] tracking-[0.4em] uppercase text-[var(--fg-4)]">Read your organisation properly.</p>
                  </div>
                </Reveal>
              </div>
            </div>

            {/* Right side: Vertical Scroll Pillar with Minimal Title-Only Cards */}
            <div className="relative border-l border-[rgba(255,255,255,0.05)] pl-10 md:pl-20 flex flex-col">
              <div className="h-[20vh] flex items-end pb-10">
                <Reveal>
                  <span className="font-mono text-[11px] tracking-[0.5em] uppercase text-[var(--accent)] opacity-60">We map:</span>
                </Reveal>
              </div>
              
              {[
                { title: "Where the system is breaking", step: "01", icon: "DIAGNOSE", bg: "linear-gradient(180deg, rgba(160,160,160,0.08) 0%, transparent 100%)" },
                { title: "What is holding it together artificially", step: "02", icon: "CODIFY", bg: "linear-gradient(180deg, rgba(56,225,255,0.04) 0%, transparent 100%)" },
                { title: "What will fail next", step: "03", icon: "PREDICT", bg: "linear-gradient(180deg, rgba(255,61,138,0.04) 0%, transparent 100%)" },
                { title: "Then we redesign it so it holds", step: "04", icon: "INSTALL", bg: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)" }
              ].map((item, i) => (
                <div key={i} className="min-h-[60vh] flex flex-col justify-center relative group">
                  {/* Vertical Progress Line Overlay */}
                  <div className="absolute left-[-41px] md:left-[-81px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[var(--accent)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  {/* Step Marker */}
                  <div className="absolute left-[-50px] md:left-[-90px] top-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
                    <span className="font-mono text-[9px] text-[var(--fg-5)] rotate-[-90deg] translate-y-[-30px] tracking-[0.4em]">{item.icon}</span>
                    <div className="w-3 h-3 rounded-full bg-[var(--bg)] border-2 border-[var(--accent)] z-20 group-hover:scale-[1.8] transition-transform duration-500 shadow-[0_0_15px_var(--accent)]" />
                    <span className="font-serif italic text-[32px] text-[var(--fg-5)] group-hover:text-[var(--accent)] transition-colors duration-500">{item.step}</span>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ margin: "-20% 0px" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="relative"
                  >
                    <div 
                      className="p-8 md:p-10 rounded-[32px] border border-[rgba(255,255,255,0.03)] backdrop-blur-2xl transition-all duration-700 group-hover:border-[rgba(255,255,255,0.08)] group-hover:shadow-[0_30px_70px_rgba(0,0,0,0.7)]"
                      style={{ background: item.bg }}
                    >
                      <h3 className="font-serif text-[clamp(16px,2vw,28px)] leading-[1.2] text-[var(--fg)]">
                        {item.title}
                      </h3>
                    </div>
                  </motion.div>
                </div>
              ))}
              <div className="h-[20vh]" /> {/* Bottom Buffer */}
            </div>
          </div>
        </div>

        {/* Dynamic Background Text Parallax */}
        <div className="absolute right-[-10%] top-[20%] font-serif italic text-[30vw] text-white opacity-[0.015] pointer-events-none select-none whitespace-nowrap">
          ARCHITECTURE
        </div>
      </section>

      {/* STATEMENTS SECTION - This is Axion Index */}
      <section className="chapter section-dark relative overflow-hidden" id="statements">
        <div className="shell">
          <div className="mb-24">
            <Reveal>
              <span className="eyebrow mb-6 text-[var(--accent)]">This is Axion Index</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="h-section">
                Four statements.<br />
                <em className="text-[var(--accent)]">One operating logic.</em>
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: "01", title: "Diagnose", desc: "We diagnose where the system is breaking." },
              { num: "02", title: "Codify", desc: "We codify what is dependent on individuals." },
              { num: "03", title: "Redesign", desc: "We redesign the architecture." },
              { num: "04", title: "Hold", desc: "We make it hold under pressure." }
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group relative">
                  <div className="font-mono text-[10px] tracking-[0.4em] text-[var(--accent)] mb-6 opacity-60">[ {item.num} ]</div>
                  <h3 className="font-serif text-[28px] mb-4 group-hover:text-[var(--accent)] transition-colors duration-500">{item.title}</h3>
                  <p className="text-[15px] text-[var(--fg-3)] leading-relaxed max-w-[20ch]">{item.desc}</p>
                  
                  {/* Subtle hover indicator */}
                  <div className="mt-8 w-12 h-[1px] bg-[var(--line-strong)] group-hover:w-full group-hover:bg-[var(--accent)] transition-all duration-700" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Abstract background detail */}
        <div className="absolute left-[-5%] bottom-[-10%] w-[40%] aspect-square bg-[radial-gradient(circle,rgba(160,160,160,0.03)_0%,transparent_70%)] pointer-events-none" />
      </section>

      {/* BELIEF TO SYSTEM SECTION - Unique Sequential Flow */}
      <section className="chapter section-deep relative" id="evolution">
        <div className="shell">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-20 items-start">
            <div>
              <Reveal>
                <span className="eyebrow mb-6 text-[var(--accent)]">What this actually looks like</span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="h-section mb-12">
                  How a belief becomes <br/>
                  <em className="text-[var(--accent)]">a system that holds.</em>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="lead text-[var(--fg-3)]">
                  That is how organisations stop depending on individuals.
                </p>
              </Reveal>
            </div>

            <div className="relative pl-12 md:pl-24">
              {/* Vertical Connector Line with Growth Animation */}
              <motion.div 
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[var(--accent)] via-[var(--accent-2)] to-transparent origin-top"
              />

              {[
                { num: "01", text: "A belief becomes a hiring bar." },
                { num: "02", text: "A hiring bar becomes a decision rule." },
                { num: "03", text: "A decision rule becomes a repeatable system." }
              ].map((step, i) => (
                <div key={i} className="mb-24 last:mb-0 relative">
                  {/* Step Dot */}
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + (i * 0.3), duration: 0.5 }}
                    className="absolute left-[-52px] md:left-[-100px] top-4 w-4 h-4 rounded-full bg-[var(--bg)] border-2 border-[var(--accent)] z-10 shadow-[0_0_15px_var(--accent)]" 
                  />
                  
                  <Reveal delay={0.3 + (i * 0.2)} x={40}>
                    <div className="group">
                      <span className="font-mono text-[10px] tracking-[0.4em] text-[var(--accent)] mb-4 block">[ {step.num} ]</span>
                      <h3 className="font-serif text-[clamp(18px,2.5vw,32px)] leading-[1.2] text-[var(--fg-2)] group-hover:text-[var(--fg)] transition-colors duration-500">
                        {step.text}
                      </h3>
                    </div>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ARCHITECTURE LAYERS - Layered Visual */}
      <section className="chapter section-tint relative overflow-hidden" id="architecture-layers">
        <div className="shell shell--narrow">
          <div className="text-center">
            <Reveal>
              <span className="eyebrow eyebrow--center mb-6 text-[var(--accent)]">Architecture</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="h-display mb-8">
                Three layers.<br />
                <em className="text-[var(--accent)]">One operating logic.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="lead mx-auto text-[var(--fg-2)] leading-relaxed">
                The platform stands on three layers —<br />
                the founder’s thinking,<br />
                Axion Index as the codification platform,<br />
                and the system layer being built on top.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PRACTICES SECTION - Interactive Accordion */}
      <section className="chapter section-dark overflow-hidden" id="practices">
        <div className="shell">
          <div className="text-center mb-20">
            <Reveal><span className="eyebrow eyebrow--center mb-4">Where the work happens</span></Reveal>
            <Reveal delay={0.1}>
              <h2 className="h-section mx-auto max-w-[20ch]">
                Four practices.<br />
                <em className="text-[var(--accent)]">One operating logic.</em>
              </h2>
            </Reveal>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 h-[600px] lg:h-[500px]">
            {[
              { 
                num: "01", 
                name: "People Architecture", 
                sub: "The foundation. The other three sit on top of this one.", 
                href: "/expertise/people",
                label: "Enter People Architecture →"
              },
              { 
                num: "02", 
                name: "Labour Codes", 
                sub: "When cost, classification, and compliance stop aligning.", 
                href: "/expertise/labour",
                label: "Enter Labour Codes →"
              },
              { 
                num: "03", 
                name: "AI Edge Lab", 
                sub: "When work is changing faster than roles.", 
                href: "/expertise/ai-edge",
                label: "Enter AI Edge Lab →"
              },
              { 
                num: "04", 
                name: "Family Business", 
                sub: "When continuity depends on individuals, not structure.", 
                href: "/expertise/family",
                label: "Enter Family Business →"
              },
            ].map((practice, i) => {
              const isActive = activePractice === i;
              
              return (
                <motion.div
                  key={i}
                  onMouseEnter={() => setActivePractice(i)}
                  className={`relative overflow-hidden cursor-pointer rounded-[32px] border transition-colors duration-500 ${
                    isActive 
                      ? "flex-[3] bg-[var(--bg-1)] border-[rgba(160,160,160,0.3)] shadow-[0_30px_60px_rgba(0,0,0,0.5)]" 
                      : "flex-1 bg-[rgba(14,17,23,0.4)] border-[var(--line)] hover:border-[rgba(255,255,255,0.15)]"
                  }`}
                  layout
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="absolute inset-0 p-8 flex flex-col h-full">
                    {/* Number - Always visible */}
                    <div className={`font-mono text-[10px] tracking-[0.3em] mb-8 transition-colors duration-500 ${isActive ? "text-[var(--accent)]" : "text-[var(--fg-4)]"}`}>
                      [ {practice.num} ]
                    </div>

                    <div className="flex flex-col h-full justify-between">
                      {/* Title & Content */}
                      <div className="relative">
                        <AnimatePresence mode="wait">
                          {isActive ? (
                            <motion.div
                              key="active"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.4 }}
                            >
                              <h3 className="font-serif text-[clamp(28px,3.5vw,42px)] leading-[1.1] text-[var(--fg)] mb-6">
                                {practice.name.split(' ').map((word, j) => 
                                  word === 'Architecture' || word === 'Codes' || word === 'Lab' || word === 'Business' 
                                    ? <em key={j} className="italic block">{word}</em> 
                                    : <span key={j}>{word} </span>
                                )}
                              </h3>
                              <p className="text-[16px] text-[var(--fg-3)] leading-relaxed max-w-[30ch] mb-8">
                                {practice.sub}
                              </p>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="collapsed"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="lg:absolute lg:top-0 lg:left-0 lg:origin-top-left lg:rotate-[-90deg] lg:translate-y-[280px] lg:translate-x-[5px] whitespace-nowrap"
                            >
                              <h3 className="font-serif text-[24px] text-[var(--fg-4)] tracking-wide">
                                {practice.name}
                              </h3>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* CTA - Only visible when active */}
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="pt-8 border-t border-[rgba(255,255,255,0.08)]"
                        >
                          <Link 
                            href={practice.href}
                            className="inline-flex items-center gap-4 font-mono text-[11px] tracking-widest uppercase text-[var(--accent)] hover:text-[var(--fg)] transition-colors group"
                          >
                            {practice.label}
                            <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                          </Link>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Background Detail for Active Card */}
                  {isActive && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute bottom-[-10%] right-[-5%] w-[60%] aspect-square bg-[radial-gradient(circle,rgba(160,160,160,0.08)_0%,transparent_70%)] pointer-events-none"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* METHOD SECTION - How this is built */}
      <section className="chapter section-tint relative overflow-hidden" id="method">
        <div className="shell">
          <div className="max-w-[800px] mx-auto text-center flex flex-col items-center">
            <Reveal>
              <span className="eyebrow eyebrow--center mb-8 text-[var(--accent)]">How this is built</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="h-section mb-10">
                One platform method.<br />
                <em className="text-[var(--accent)]">Four practice doctrines.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="body-text mx-auto text-[var(--fg-3)] mb-20">
                Interpreted across labour, AI, people, and ownership.
              </p>
            </Reveal>

            {/* Doctrine Flow */}
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 mb-20">
              {[
                { label: "Belief" },
                { label: "Conviction" },
                { label: "Rhythm" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 md:gap-10">
                  <Reveal delay={0.3 + (i * 0.15)} y={10}>
                    <div className="group">
                      <span className="font-serif text-[clamp(24px,3vw,42px)] text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors duration-500">
                        {item.label}
                      </span>
                    </div>
                  </Reveal>
                  {i < 2 && (
                    <Reveal delay={0.4 + (i * 0.15)} scale={0.8}>
                      <span className="text-[var(--accent)] opacity-40 text-[20px] md:text-[24px] font-light">→</span>
                    </Reveal>
                  )}
                </div>
              ))}
            </div>

            {/* Final Statement */}
            <div className="pt-16 border-t border-[rgba(255,255,255,0.05)] w-full">
              <Reveal delay={0.6}>
                <p className="font-serif italic text-[clamp(20px,2.5vw,32px)] leading-tight text-[var(--fg-2)] mb-4">
                  You don’t see frameworks.
                </p>
              </Reveal>
              <Reveal delay={0.7}>
                <p className="font-serif italic text-[clamp(20px,2.5vw,32px)] leading-tight text-[var(--accent)]">
                  You see what they fix.
                </p>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Background Detail */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-square bg-[radial-gradient(circle,rgba(160,160,160,0.03)_0%,transparent_70%)] pointer-events-none" />
      </section>

      {/* ROLES SECTION - What this changes */}
      <section className="chapter section-deep" id="roles">
        <div className="shell">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(300px,1fr)_1.5fr] gap-16 items-start">
            <div>
              <Reveal><span className="eyebrow mb-6 text-[var(--accent)]">What this changes</span></Reveal>
              <Reveal delay={0.1}>
                <h2 className="h-statement">
                  What this changes <em className="text-[var(--accent)]">depending on where you sit.</em>
                </h2>
              </Reveal>
            </div>
            
            <div className="flex flex-col border-t border-[rgba(255,255,255,0.05)]">
              {[
                { if: "Founder / CEO", then: "See where the organisation will break — before it does." },
                { if: "CFO", then: "Read workforce as cost, risk, and control architecture — not headcount." },
                { if: "CHRO", then: "Stop running HR programs. Start running the operating system underneath them." },
              ].map((role, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="py-10 border-b border-[rgba(255,255,255,0.05)] group hover:bg-[rgba(255,255,255,0.01)] transition-colors px-4 -mx-4">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--accent)] mb-4 block">{role.if}</span>
                    <p className="font-serif text-[24px] leading-snug text-[var(--fg-2)] group-hover:text-[var(--fg)] transition-colors" dangerouslySetInnerHTML={{ __html: role.then }} />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY SECTION - High Impact Centered */}
      <section className="chapter section-dark relative overflow-hidden" id="philosophy">
        <div className="shell text-center">
          <Reveal>
            <span className="eyebrow eyebrow--center mb-10 text-[var(--accent)]">Philosophy</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="h-section mb-10 max-w-[20ch] mx-auto">
              Architecture is not designed in <em className="text-[var(--accent)]">presentations.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="font-serif italic text-[clamp(20px,2.8vw,36px)] text-[var(--fg-2)] mb-12">
              It is read in signals.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="body-text mx-auto text-[var(--fg-3)] max-w-[45ch]">
              We don’t sell services. We read what is already breaking — and build what must hold.
            </p>
          </Reveal>
        </div>
        
        {/* Abstract background detail */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(160,160,160,0.03)_0%,transparent_70%)] pointer-events-none" />
      </section>

      {/* HELD SECTION - Case Studies */}
      <section className="chapter section-deep" id="held">
        <div className="shell">
          <div className="mb-20">
            <Reveal>
              <span className="eyebrow mb-6 text-[var(--accent)]">What this has held</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="h-section">
                Architecture is tested <br/>
                <em className="text-[var(--accent)]">under consequence.</em>
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: "01", name: "Udaan", desc: "Scaled from 800 to 4,000 across 22 languages and 28 states. Manning held at 95% through COVID." },
              { num: "02", name: "Gameskraft", desc: "Held through 28% retroactive GST shock. 97.1% top-performer retention. Zero involuntary layoffs." },
              { num: "03", name: "Tata Global Beverages", desc: "London-to-Mumbai global HQ relocation, 95%+ retention through the transition." }
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="cool-card group h-full">
                  <div className="font-mono text-[10px] text-[var(--accent)] mb-8 opacity-60">[ {item.num} ]</div>
                  <h3 className="font-serif text-[28px] mb-6 group-hover:text-[var(--accent)] transition-colors duration-500">{item.name}</h3>
                  <p className="text-[15px] text-[var(--fg-3)] leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MAKE IT REAL SECTION - What happens next */}
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
                  <em className="text-[var(--accent)]">next.</em>
                </h2>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              {[
                { num: "01", title: "You bring the signal." },
                { num: "02", title: "We diagnose the architecture." },
                { num: "03", title: "We define the intervention." },
                { num: "04", title: "We make it hold." }
              ].map((item, i) => (
                <Reveal key={i} delay={i * 0.1} y={20}>
                  <div className="cool-card group bg-[#0E1117] border-[rgba(255,255,255,0.05)] hover:border-[var(--accent)] transition-all duration-500 shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                    <div className="font-mono text-[10px] text-[var(--accent)] mb-4 opacity-60">{item.num}</div>
                    <h3 className="font-serif text-[22px] text-[var(--fg-2)] group-hover:text-[var(--fg)] transition-colors">{item.title}</h3>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA - Large Impact */}
      <section className="chapter section-tint py-32 overflow-hidden relative">
        <div className="shell text-center relative z-10">
          <Reveal>
            <span className="eyebrow eyebrow--center mb-10">Begin the diagnostic</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="h-display mb-12">
              Start where the signal is <em className="text-[var(--accent)]">strongest.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-wrap justify-center gap-6">
              <Link className="nav-cta scale-110" href="/connect">Start Diagnostic</Link>
              <a className="ill-btn scale-110" href="#practices">Explore Practices</a>
            </div>
          </Reveal>
        </div>
        
        {/* Animated background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(160,160,160,0.05)_0%,transparent_70%)] pointer-events-none" />
      </section>
      
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="foot border-t border-[var(--line)]">
      <div className="shell">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-20">
          <div className="md:col-span-1">
            <Link className="brand text-[24px] mb-6 block" href="/">Ax<em>ion</em><span className="domain">INDEX</span></Link>
            <p className="text-[14px] text-[var(--fg-4)] leading-relaxed max-w-[20ch]">
              From <s className="opacity-50">ambiguity</s><br />to architecture.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <h5 className="font-mono text-[10px] tracking-widest uppercase text-[var(--fg)]">Practices</h5>
            <ul className="flex flex-col gap-3 font-mono text-[11px] text-[var(--fg-4)] uppercase tracking-wider">
              <li><Link href="/expertise/labour" className="hover:text-[var(--accent)] transition-colors">Labour Codes</Link></li>
              <li><Link href="/expertise/ai-edge" className="hover:text-[var(--accent)] transition-colors">AI Edge Lab</Link></li>
              <li><Link href="/expertise/people" className="hover:text-[var(--accent)] transition-colors">People Architecture</Link></li>
              <li><Link href="/expertise/family" className="hover:text-[var(--accent)] transition-colors">Family Business</Link></li>
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <h5 className="font-mono text-[10px] tracking-widest uppercase text-[var(--fg)]">Platform</h5>
            <ul className="flex flex-col gap-3 font-mono text-[11px] text-[var(--fg-4)] uppercase tracking-wider">
              <li><Link href="/about" className="hover:text-[var(--accent)] transition-colors">About</Link></li>
              <li><Link href="/founder" className="hover:text-[var(--accent)] transition-colors">Founder</Link></li>
              <li><Link href="/connect" className="hover:text-[var(--accent)] transition-colors">Connect</Link></li>
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <h5 className="font-mono text-[10px] tracking-widest uppercase text-[var(--fg)]">Contact</h5>
            <div className="flex flex-col gap-3 font-mono text-[11px] text-[var(--fg-4)] uppercase tracking-wider">
              <span>Bengaluru, India</span>
              <a href="mailto:office@axionindex.com" className="hover:text-[var(--accent)] transition-colors">office@axionindex.com</a>
            </div>
          </div>
        </div>
        <div className="py-8 border-t border-[var(--line)] flex flex-wrap justify-between items-center gap-6 font-mono text-[10px] tracking-widest uppercase text-[var(--fg-5)]">
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
