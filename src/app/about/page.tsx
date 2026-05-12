"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const AboutThreeScene = dynamic(() => import("@/components/AboutThreeScene"), { ssr: false });

const movements = [
  {
    num: "01",
    label: "Genesis",
    title: "Why we exist.",
    body: "Axion Index exists to codify the patterns that let organisations grow and sustain their people architecture. The work is pattern-codification — converting individual intellect into institutional structure.",
    personas: null,
  },
  {
    num: "02",
    label: "The gap we close",
    title: "HR's biggest historical failure was dependence on individual intellect.",
    body: "The right person, in the right role, making the right judgment in the moment. When that person leaves, the architecture collapses. Axion Index makes the patterns explicit, transferable, and institutional, so the architecture survives the person.",
    personas: null,
  },
  {
    num: "03",
    label: "What we do",
    title: "Diagnose. Codify. Redesign. Operate.",
    body: "Diagnose — surface where the architecture has drifted before the cost becomes visible. Codify — convert observed patterns into transferable frameworks. Redesign — install the architecture the operating model actually needs. Operate — keep the redesign alive in cadence, not in slides.",
    personas: null,
  },
  {
    num: "04",
    label: "The Promise",
    title: "Three personas. Each line is a promise.",
    body: null,
    personas: [
      { role: "Founder · CEO", promise: "See where the organisation will break before it does." },
      { role: "CFO", promise: "Read workforce as cost, risk, and control architecture — not headcount." },
      { role: "CHRO", promise: "Stop running HR programs. Start running the operating system underneath them." },
    ],
  },
  {
    num: "05",
    label: "The System",
    title: "Two sentences. Both true.",
    body: "Every engagement diagnoses where you are stuck in one sequence — Belief → Conviction → Rhythm. The platform itself stands on three layers — the founder's thinking, Axion Index as the codification platform, and HROS as the system layer being built on top.",
    personas: null,
  },
];

export default function About() {
  return (
    <div className="min-h-screen">
      
      {/* HERO — full viewport */}
      <header className="relative min-h-screen flex items-center justify-center bg-transparent pt-20 overflow-hidden">
        <div className="shell text-center relative z-10">
          <Reveal>
            <div className="eyebrow eyebrow--center mb-8 text-[var(--accent)]">AXION&nbsp;&nbsp;·&nbsp;&nbsp;ABOUT</div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="h-display hero-glow text-[clamp(28px,3.5vw,52px)] leading-[0.95] mb-8 drop-shadow-2xl">
              The patterns that let<br />
              organisations <em className="text-[var(--accent)]">survive the person.</em>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="lead mx-auto mb-12 opacity-90 text-[var(--fg-2)] max-w-[46ch]">
              Converting individual intellect into institutional structure.<br />
              Architecture that holds after the person leaves.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-col items-center gap-10">
              <Link
                href="/connect"
                className="nav-cta scale-125 px-12 py-5 bg-[var(--fg)] text-[var(--bg)] border-none hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                Start Diagnostic
              </Link>
              <a className="kbd-arrow text-[var(--fg-3)] hover:text-[var(--accent)]" href="#movements">
                Read the architecture
              </a>
            </div>
          </Reveal>
        </div>

        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(201,168,92,0.03)_0%,transparent_50%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-[#06070B] to-transparent pointer-events-none" />
      </header>

      {/* MOVEMENTS — alternating left/right */}
      <section className="chapter section-dark relative" id="movements">
        <div className="shell">
          <div className="mb-20">
            <Reveal>
              <span className="eyebrow mb-6 text-[var(--accent)]">Architecture Movements</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="h-section">
                Five movements.<br />
                <em className="text-[var(--accent)]">One operating logic.</em>
              </h2>
            </Reveal>
          </div>

          <div className="flex flex-col gap-0">
            {movements.map((movement, i) => {
              const fromLeft = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: fromLeft ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
                  className="py-12 border-b border-[rgba(255,255,255,0.05)] group hover:bg-[rgba(255,255,255,0.01)] transition-colors px-4 -mx-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-8 md:gap-16">
                    <div>
                      <span className="font-mono text-[10px] tracking-[0.4em] text-[var(--accent)] mb-2 block opacity-60">
                        [ {movement.num} ]
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--fg-4)]">
                        {movement.label}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-serif text-[clamp(20px,2.4vw,34px)] leading-[1.15] text-[var(--fg)] mb-5 group-hover:text-[var(--accent)] transition-colors duration-500">
                        {movement.title}
                      </h3>
                      {movement.body && (
                        <p className="text-[16px] leading-[1.7] text-[var(--fg-3)] max-w-[60ch] font-light">
                          {movement.body}
                        </p>
                      )}
                      {movement.personas && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                          {movement.personas.map((p, j) => (
                            <motion.div
                              key={j}
                              initial={{ opacity: 0, y: 30 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: j * 0.12 }}
                              className="cool-card group/card"
                            >
                              <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--accent)] mb-4 block opacity-60">
                                {p.role}
                              </span>
                              <p className="font-serif text-[17px] leading-snug text-[var(--fg-2)] group-hover/card:text-[var(--fg)] transition-colors">
                                {p.promise}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="chapter section-tint py-32 overflow-hidden relative">
        <div className="shell text-center relative z-10">
          <Reveal>
            <span className="eyebrow eyebrow--center mb-10 text-[var(--accent)]">Architectural Conclusion</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="h-display mb-12">
              From ambiguity<br />
              to <em className="text-[var(--accent)]">architecture.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="/connect"
                className="nav-cta scale-110 bg-[var(--fg)] text-[var(--bg)] border-none hover:bg-[var(--accent)] transition-all duration-500"
              >
                Start Diagnostic
              </Link>
              <Link href="/founder" className="nav-cta scale-110">
                Read about the founder
              </Link>
            </div>
          </Reveal>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(201,168,92,0.05)_0%,transparent_70%)] pointer-events-none" />
      </section>
    </div>
  );
}
