"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const FounderThreeScene = dynamic(() => import("@/components/FounderThreeScene"), { ssr: false });

const career = [
  {
    code: "SCB",
    full: "Standard Chartered",
    sub: "Rewards architecture · 700→10,000 scaled operation",
    body: "Built rewards architecture across a 700-to-10,000 scaled operation. Proved data is how HR earns authority, not how it gets ignored.",
    stat: "96%",
    statLabel: "Q12 participation",
  },
  {
    code: "TGB",
    full: "Tata Global Beverages",
    sub: "Decade · 3 heritage brands · Starbucks + PepsiCo JVs",
    body: "Decade-long institutional architecture across three heritage brands and joint ventures. London-to-Mumbai global HQ relocation completed at 95%+ retention.",
    stat: "95%+",
    statLabel: "Retention through global HQ relocation",
  },
  {
    code: "UDN",
    full: "Udaan",
    sub: "800→4,000 on-roll · 22 languages · 28 states",
    body: "Scaled people architecture from 800 to over 4,000 on-roll across 22 languages and 28 states. During COVID, when Udaan was classified as essential government infrastructure, manning held at 95% with no productivity loss.",
    stat: "95%",
    statLabel: "COVID manning · zero productivity loss",
  },
  {
    code: "GSK",
    full: "Gameskraft",
    sub: "9 → full institution · GST shock · zero layoffs",
    body: "Built the operating system from nine people managing event logistics into a full institution. When a 28% retroactive GST shock and state-level bans threatened the industry, the architecture held: 27% of roles impacted by strategy change, 97.1% top-performer retention, zero involuntary layoffs.",
    stat: "97.1%",
    statLabel: "Top-performer retention",
  },
];

const codified = [
  {
    label: "Methodology",
    title: "The BCR Framework.",
    body: "Belief → Conviction → Rhythm. The signature methodology that runs the platform.",
  },
  {
    label: "Practice doctrines",
    title: "Four doctrines.",
    body: "One platform method — BCR — interpreted across labour, AI, people, and ownership through a second carrier framework, 3i (Interpret · Integrate · Institutionalise). Other methods sit underneath as embedded structures, not branded acronyms.",
  },
  {
    label: "HROS",
    title: "The operating-system layer.",
    body: "Nitin is building separately, where the architecture lives in motion. It is the destination for the patterns codified at Axion Index.",
  },
  {
    label: "In writing",
    title: "The Operating Architect (2026).",
    body: "The book that gathers the codified patterns, the institutional cases, and the doctrine into a single working text.",
  },
];

export default function Founder() {
  return (
    <div className="min-h-screen">
      <FounderThreeScene />

      {/* HERO */}
      <header className="relative min-h-screen flex items-center justify-center bg-transparent pt-20 overflow-hidden">
        <div className="shell text-center relative z-10">
          <Reveal>
            <div className="eyebrow eyebrow--center mb-8 text-[var(--accent)]">AXION&nbsp;&nbsp;·&nbsp;&nbsp;FOUNDER</div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="hero-glow mb-6 drop-shadow-2xl">
              <span className="block font-serif font-medium text-[clamp(28px,3.5vw,52px)] leading-[1.15] tracking-[-0.01em] text-[var(--fg-2)] mb-2">
                The Operating Architect
              </span>
              <em className="block font-serif font-medium text-[clamp(28px,3.5vw,52px)] leading-[1.15] tracking-[-0.01em] text-[var(--accent)] italic">
                Nitin Nahata.
              </em>
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--fg-5)] mb-8">
              Portrait · Considered, not corporate · 2026
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="lead mx-auto mb-12 opacity-90 text-[var(--fg-2)] max-w-[50ch]">
              The practitioner whose work codified the patterns Axion Index now deploys.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-col items-center gap-10">
              <Link
                href="/connect"
                className="nav-cta scale-125 px-12 py-5 bg-[var(--fg)] text-[var(--bg)] border-none hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                Begin a Diagnostic
              </Link>
              <a className="kbd-arrow text-[var(--fg-3)] hover:text-[var(--accent)]" href="#insight">
                Read the defining insight
              </a>
            </div>
          </Reveal>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(201,168,92,0.03)_0%,transparent_50%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-[#06070B] to-transparent pointer-events-none" />
      </header>

      {/* DEFINING INSIGHT */}
      <section className="chapter section-dark relative" id="insight">
        <div className="shell">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <Reveal><span className="eyebrow mb-6 text-[var(--accent)]">The defining insight</span></Reveal>
              <p className="font-serif text-[clamp(20px,2.4vw,32px)] leading-[1.5] text-[var(--fg-2)]">
                Most failures are not strategy failures. They are people-system failures that happen silently, long before anyone notices. By the time they show up as attrition or culture issues, the damage is already structural.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="p-10 bg-[rgba(255,255,255,0.02)] backdrop-blur-[12px] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(201,168,92,0.25)] transition-colors duration-500"
            >
              <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--accent)] opacity-60 block mb-6">The thesis · in his words</span>
              <p className="font-serif italic text-[clamp(18px,2vw,26px)] leading-[1.6] text-[var(--fg-2)] mb-8">
                "I architect order before scale demands it. The work is to make the patterns survive the person."
              </p>
              <div className="pt-6 border-t border-[rgba(255,255,255,0.05)]">
                <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--fg-5)]">— Nitin Nahata · Founder · Axion Index</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CAREER ARC */}
      <section className="chapter section-deep relative" id="career">
        <div className="shell">
          <div className="mb-20">
            <Reveal><span className="eyebrow mb-4 text-[var(--accent)]">§F · 03 · The career arc</span></Reveal>
            <Reveal delay={0.1}>
              <h2 className="h-section mb-4">
                22 years · 4 institutions.<br />
                <em className="text-[var(--accent)]">Each a different stress test.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="lead text-[var(--fg-3)] max-w-[52ch]">
                Twenty-two years inside the systems beneath organisations. Four institutions, sequenced. Each one a different stress test of the same underlying question: how do you build a people architecture that survives the person who built it?
              </p>
            </Reveal>
          </div>

          <div className="flex flex-col">
            {career.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -70 : 70 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.04 }}
                className="grid grid-cols-1 md:grid-cols-[100px_1fr_1fr_160px] gap-8 md:gap-10 py-12 border-b border-[rgba(255,255,255,0.05)] group items-start hover:bg-[rgba(255,255,255,0.01)] transition-colors px-4 -mx-4"
              >
                {/* Code */}
                <div>
                  <span className="font-serif italic text-[clamp(28px,3vw,42px)] text-[var(--accent)] leading-[0.85] opacity-30 group-hover:opacity-90 transition-opacity duration-500 block">
                    {item.code}
                  </span>
                </div>

                {/* Name + sub */}
                <div>
                  <h3 className="font-serif text-[clamp(18px,2vw,26px)] font-medium leading-[1.2] text-[var(--fg)] mb-2 group-hover:text-[var(--accent)] transition-colors duration-500">
                    {item.full}
                  </h3>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--fg-4)]">{item.sub}</span>
                </div>

                {/* Body */}
                <p className="text-[15px] leading-[1.65] text-[var(--fg-3)]">{item.body}</p>

                {/* Stat */}
                <div className="p-5 bg-[rgba(255,255,255,0.02)] backdrop-blur-[12px] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(201,168,92,0.25)] transition-colors duration-500 self-start text-center">
                  <div className="font-serif italic text-[clamp(24px,2.5vw,36px)] text-[var(--accent)] leading-[1] mb-2">{item.stat}</div>
                  <p className="font-mono text-[9px] tracking-widest uppercase text-[var(--fg-4)] leading-[1.5]">{item.statLabel}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT GOT CODIFIED */}
      <section className="chapter section-dark relative" id="codified">
        <div className="shell">
          <div className="mb-20">
            <Reveal><span className="eyebrow mb-4 text-[var(--accent)]">§F · 04 · What got codified</span></Reveal>
            <Reveal delay={0.1}>
              <h2 className="h-section">
                The work,<br />
                <em className="text-[var(--accent)]">made transferable.</em>
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {codified.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
                className="cool-card group"
              >
                <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--accent)] opacity-60 mb-4 block">{item.label}</span>
                <h3 className="font-serif text-[clamp(18px,2vw,24px)] text-[var(--fg)] mb-4 group-hover:text-[var(--accent)] transition-colors duration-500">{item.title}</h3>
                <p className="text-[14px] leading-[1.7] text-[var(--fg-3)]">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="chapter section-tint py-32 overflow-hidden relative">
        <div className="shell text-center relative z-10">
          <Reveal>
            <span className="eyebrow eyebrow--center mb-10 text-[var(--accent)]">Continue</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="h-display mb-12">
              From ambiguity<br />
              to <em className="text-[var(--accent)]">architecture.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/about" className="nav-cta scale-110">About Axion Index</Link>
              <Link href="/#practices" className="nav-cta scale-110">The four practices</Link>
              <Link
                href="/connect"
                className="nav-cta scale-110 bg-[var(--fg)] text-[var(--bg)] border-none hover:bg-[var(--accent)] transition-all duration-500"
              >
                Begin a diagnostic
              </Link>
            </div>
          </Reveal>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(201,168,92,0.05)_0%,transparent_70%)] pointer-events-none" />
      </section>

    </div>
  );
}
