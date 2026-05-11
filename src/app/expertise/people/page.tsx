"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const PeopleThreeScene = dynamic(() => import("@/components/PeopleThreeScene"), { ssr: false });

const bcrSteps = [
  {
    num: "01",
    letter: "B",
    name: "Belief",
    desc: "What the founder, board and operating leadership actually hold to be true about people, scale, performance, and risk. Often inconsistent across the room. Always upstream of every other failure.",
    breakMode: "Belief drift",
  },
  {
    num: "02",
    letter: "C",
    name: "Conviction",
    desc: "The compressed point of view the institution is willing to defend in public, in policy, and in pay. The bridge layer. Where most organisations stop investing — and where the architecture quietly collapses.",
    breakMode: "Conviction-to-rhythm gap",
  },
  {
    num: "03",
    letter: "R",
    name: "Rhythm",
    desc: "The operating cadence that turns conviction into behaviour — calendars, reviews, decisions, signals. Codified once, run weekly. The rhythm is where culture actually lives.",
    breakMode: "Rhythm decay",
  },
];

const surfaces = [
  {
    num: "01",
    name: "Strategy",
    desc: "What the business is asking the workforce to do. Sized, sequenced, scenarioed against capital and time.",
    owner: "CEO + CFO",
  },
  {
    num: "02",
    name: "Structure",
    desc: "Org design, role taxonomy, decision rights. The skeleton. Where the strategy actually meets gravity.",
    owner: "CEO + CHRO",
  },
  {
    num: "03",
    name: "Systems",
    desc: "Comp, performance, talent, succession. The mechanics. Where conviction either gets paid for or gets hollowed out.",
    owner: "CHRO",
  },
  {
    num: "04",
    name: "Signalling",
    desc: "What the institution actually rewards, tolerates, and punishes — in public and in private. The truth-test for everything above it.",
    owner: "CEO + Board",
  },
];

export default function PeopleArchitecture() {
  return (
    <div className="min-h-screen">
      <PeopleThreeScene />

      {/* HERO */}
      <header className="relative min-h-screen flex items-center justify-center bg-transparent pt-20 overflow-hidden">
        <div className="shell text-center relative z-10">
          <Reveal>
            <div className="eyebrow eyebrow--center mb-8 text-[var(--accent)]">AXION&nbsp;&nbsp;·&nbsp;&nbsp;PEOPLE ARCHITECTURE</div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="hero-glow mb-8 drop-shadow-2xl">
              <span className="block font-serif font-medium text-[clamp(28px,3.5vw,52px)] leading-[1.15] tracking-[-0.01em] text-[var(--fg-2)] mb-2">
                The architecture that lets the organisation
              </span>
              <em className="block font-serif font-medium text-[clamp(28px,3.5vw,52px)] leading-[1.15] tracking-[-0.01em] text-[var(--accent)] italic">
                survive the person.
              </em>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="lead mx-auto mb-12 opacity-90 text-[var(--fg-2)] max-w-[52ch]">
              People Architecture is the foundation practice. Every other practice — Labour Codes, AI Edge Lab, Family Business — sits on top of it.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-col items-center gap-10">
              <Link
                href="/connect?practice=people-architecture"
                className="nav-cta scale-125 px-12 py-5 bg-[var(--fg)] text-[var(--bg)] border-none hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                Begin a Diagnostic
              </Link>
              <a className="kbd-arrow text-[var(--fg-3)] hover:text-[var(--accent)]" href="#bcr">
                Read the BCR framework
              </a>
            </div>
          </Reveal>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(160,160,160,0.03)_0%,transparent_50%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-[#06070B] to-transparent pointer-events-none" />
      </header>

      {/* BCR FRAMEWORK */}
      <section className="chapter section-dark relative" id="bcr">
        <div className="shell">
          <div className="mb-20">
            <Reveal><span className="eyebrow mb-6 text-[var(--accent)]">The BCR framework</span></Reveal>
            <Reveal delay={0.1}>
              <h2 className="h-section">
                Three stages.<br />
                <em className="text-[var(--accent)]">One sequence.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="lead text-[var(--fg-3)] mt-6 max-w-[52ch]">
                Every engagement diagnoses where the organisation is stuck. The break is almost always between Conviction and Rhythm.
              </p>
            </Reveal>
          </div>

          <div className="flex flex-col">
            {bcrSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -70 : 70 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.04 }}
                className="grid grid-cols-1 md:grid-cols-[80px_1fr_1fr_260px] gap-8 md:gap-10 py-12 border-b border-[rgba(255,255,255,0.05)] group items-start hover:bg-[rgba(255,255,255,0.01)] transition-colors px-4 -mx-4"
              >
                <div>
                  <span className="font-serif italic text-[64px] text-[var(--accent)] leading-[0.85] opacity-30 group-hover:opacity-90 transition-opacity duration-500 block">
                    {step.letter}
                  </span>
                </div>
                <div>
                  <span className="font-mono text-[10px] tracking-[0.4em] text-[var(--accent)] mb-2 block opacity-60">[ {step.num} ]</span>
                  <h3 className="font-serif text-[clamp(22px,2.4vw,34px)] font-medium leading-[1.1] text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors duration-500">
                    {step.name}
                  </h3>
                </div>
                <p className="text-[15px] leading-[1.65] text-[var(--fg-3)]">{step.desc}</p>
                <div className="p-5 bg-[rgba(255,255,255,0.02)] backdrop-blur-[12px] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(160,160,160,0.25)] transition-colors duration-500 self-start">
                  <strong className="font-mono text-[10px] tracking-widest uppercase text-[var(--accent)] opacity-60 block mb-2">Break</strong>
                  <p className="font-mono text-[11px] tracking-wide text-[var(--fg-3)] leading-[1.6]">{step.breakMode}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Diagnostic callout */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 p-8 bg-[rgba(255,255,255,0.02)] backdrop-blur-[12px] border border-[rgba(255,255,255,0.06)] border-l-2 border-l-[var(--accent)] max-w-[780px]"
          >
            <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--accent)] opacity-60 block mb-3">The diagnostic</span>
            <p className="text-[16px] text-[var(--fg-3)] leading-relaxed">
              You are not stuck on three things. You are stuck on <em className="text-[var(--fg)]">one</em> — at one of these three stages. The diagnostic finds it. The redesign installs it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FOUR SURFACES */}
      <section className="chapter section-deep relative" id="surfaces">
        <div className="shell">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-20 items-start">
            <div className="lg:sticky lg:top-32 h-fit">
              <Reveal><span className="eyebrow mb-6 text-[var(--accent)]">The surfaces</span></Reveal>
              <Reveal delay={0.1}>
                <h2 className="h-section mb-8">
                  Four surfaces.<br />
                  <em className="text-[var(--accent)]">Four owners.</em>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="body-text text-[var(--fg-3)]">
                  People architecture is not "HR work". It is four distinct surfaces with four distinct owners. Confusion at this layer is why most organisations cannot tell whether their people problem is a strategy, structure, system, or signalling problem.
                </p>
              </Reveal>
            </div>

            <div className="flex flex-col border-t border-[rgba(255,255,255,0.05)]">
              {surfaces.map((surface, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
                  className="py-10 border-b border-[rgba(255,255,255,0.05)] group hover:bg-[rgba(255,255,255,0.01)] transition-colors px-4 -mx-4"
                >
                  <div className="flex items-start gap-8">
                    <span className="font-serif italic text-[48px] text-[var(--accent)] leading-[0.85] opacity-25 group-hover:opacity-80 transition-opacity duration-500 shrink-0">{i + 1}</span>
                    <div>
                      <h3 className="font-serif text-[clamp(20px,2.2vw,30px)] leading-[1.15] text-[var(--fg)] mb-3 group-hover:text-[var(--accent)] transition-colors duration-500">
                        {surface.name}
                      </h3>
                      <p className="text-[15px] leading-[1.65] text-[var(--fg-3)] mb-3">{surface.desc}</p>
                      <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--accent)] opacity-50">Owner · {surface.owner}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ENGAGEMENT — centered with BCR recap cards */}
      <section className="chapter section-dark relative overflow-hidden">
        <div className="shell">
          <div className="max-w-[720px] mx-auto text-center">
            <Reveal>
              <span className="eyebrow eyebrow--center mb-6 text-[var(--accent)]">Engagement</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="h-section mb-8">
                Diagnose. Codify.<br />
                <em className="text-[var(--accent)]">Redesign. Operate.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="lead text-[var(--fg-3)] mb-12 mx-auto">
                A People Architecture engagement runs across all four surfaces and ends with a redesign and an operating handover. Most engagements run 12–16 weeks for the diagnostic and codification.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-wrap justify-center gap-4 mb-20">
                <Link
                  href="/connect?practice=people-architecture"
                  className="nav-cta bg-[var(--fg)] text-[var(--bg)] border-none hover:bg-[var(--accent)] transition-all duration-500"
                >
                  Begin a Diagnostic
                </Link>
                <Link href="/#practices" className="nav-cta">Other practices</Link>
              </div>
            </Reveal>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(160,160,160,0.04)_0%,transparent_70%)] pointer-events-none" />
      </section>

    </div>
  );
}
