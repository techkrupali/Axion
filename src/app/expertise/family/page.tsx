"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const FamilyThreeScene = dynamic(() => import("@/components/FamilyThreeScene"), { ssr: false });

const architectures = [
  {
    num: "01",
    letter: "O",
    name: "Ownership",
    sub: "Equity · trusts · holding",
    body: "Who owns what, on what terms, with what rights — across generations, branches, and trustees. The most under-built architecture in most Indian family enterprises, and the one that fails first under stress.",
    failure: "Equity drift becomes governance drift becomes operational drift.",
  },
  {
    num: "02",
    letter: "F",
    name: "Family",
    sub: "Council · constitution · charter",
    body: "The forum where the family — not the company — decides who it is, what it stands for, and how it disagrees in public. Without this layer, every business decision becomes a family decision in disguise.",
    failure: "Family conflict leaks into operating decisions.",
  },
  {
    num: "03",
    letter: "I",
    name: "Institution",
    sub: "Board · audit · charter",
    body: "The non-family governance the enterprise needs to scale and outlive any individual. Independent directors with real authority, audit committees with real teeth, charter that survives a difficult year.",
    failure: "Board theatre — present in name, absent in authority.",
  },
  {
    num: "04",
    letter: "S",
    name: "Succession",
    sub: "Roles · readiness · sequencing",
    body: "Not 'who comes next' but 'what role does the next generation hold, when, and on what readiness'. Codified before it is needed; decoupled from death and divorce; built around capability and contribution.",
    failure: "Inheritance treated as event, not architecture.",
  },
  {
    num: "05",
    letter: "O",
    name: "Operator",
    sub: "CEO bench · independence · accountability",
    body: "The person — family or not — who runs the business with operating accountability. Architected with a real mandate, real boundaries, and a real bench. Where most family enterprises freeze, the operator architecture is what unfreezes them.",
    failure: "Operator with title but without authority.",
  },
];

const readingRows = [
  { k: "Ownership", b: "Equity register, dividend policy", i: "Trust drafting, branch terms", m: "Generational transfer mechanics" },
  { k: "Family", b: "Informal council", i: "Constitution, dispute rules", m: "Charter, public expression" },
  { k: "Institution", b: "Statutory board", i: "Audit committee depth", m: "Independent authority" },
  { k: "Succession", b: "Stated heir", i: "Readiness assessment", m: "Sequencing & decoupling" },
  { k: "Operator", b: "CEO seat filled", i: "Mandate scope", m: "Bench, accountability rhythm" },
];

export default function FamilyBusiness() {
  return (
    <div className="min-h-screen">

      {/* HERO — full viewport */}
      <header className="relative min-h-screen flex items-center justify-center bg-transparent pt-20 overflow-hidden">
        <div className="shell text-center relative z-10">
          <Reveal>
            <div className="eyebrow eyebrow--center mb-8 text-[var(--accent)]">AXION&nbsp;&nbsp;·&nbsp;&nbsp;FAMILY BUSINESS</div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="hero-glow mb-8 drop-shadow-2xl">
              <span className="block font-serif font-medium text-[clamp(28px,3.5vw,52px)] leading-[1.15] tracking-[-0.01em] text-[var(--fg-2)] mb-2">
                Family enterprises don&apos;t fail at strategy.
              </span>
              <em className="block font-serif font-medium text-[clamp(28px,3.5vw,52px)] leading-[1.15] tracking-[-0.01em] text-[var(--accent)] italic">
                They fail at architecture.
              </em>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="lead mx-auto mb-12 opacity-90 text-[var(--fg-2)] max-w-[54ch]">
              By the second generation, most family enterprises are running an organisation the founder no longer fits, governed by structures the family no longer trusts.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-col items-center gap-10">
              <Link
                href="/connect?practice=family-business"
                className="nav-cta scale-125 px-12 py-5 bg-[var(--fg)] text-[var(--bg)] border-none hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                Begin a Conversation
              </Link>
              <a className="kbd-arrow text-[var(--fg-3)] hover:text-[var(--accent)]" href="#architectures">
                Read the five architectures
              </a>
            </div>
          </Reveal>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(160,160,160,0.03)_0%,transparent_50%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-[#06070B] to-transparent pointer-events-none" />
      </header>

      {/* FIVE ARCHITECTURES */}
      <section className="chapter section-dark relative" id="architectures">
        <div className="shell">
          <div className="mb-20">
            <Reveal><span className="eyebrow mb-6 text-[var(--accent)]">The five architectures</span></Reveal>
            <Reveal delay={0.1}>
              <h2 className="h-section">
                Five architectures.<br />
                <em className="text-[var(--accent)]">Sequenced.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="lead text-[var(--fg-3)] mt-6 max-w-[52ch]">
                The order matters. Skip ownership and the family architecture cannot hold. Skip family and the institution cannot hold. Skip the operator and succession is theatre.
              </p>
            </Reveal>
          </div>

          <div className="flex flex-col">
            {architectures.map((arch, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -70 : 70 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.04 }}
                className="grid grid-cols-1 md:grid-cols-[80px_1fr_1fr_280px] gap-8 md:gap-10 py-12 border-b border-[rgba(255,255,255,0.05)] group items-start hover:bg-[rgba(255,255,255,0.01)] transition-colors px-4 -mx-4"
              >
                {/* Number */}
                <div>
                  <span className="font-serif italic text-[56px] text-[var(--accent)] leading-[0.85] opacity-30 group-hover:opacity-90 transition-opacity duration-500 block">
                    {arch.num}
                  </span>
                </div>

                {/* Name + sub */}
                <div>
                  <h3 className="font-serif text-[clamp(22px,2.4vw,32px)] font-medium leading-[1.1] text-[var(--fg)] mb-2 group-hover:text-[var(--accent)] transition-colors duration-500">
                    {arch.name}
                  </h3>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--fg-4)]">{arch.sub}</span>
                </div>

                {/* Body */}
                <p className="text-[15px] leading-[1.65] text-[var(--fg-3)]">{arch.body}</p>

                {/* Failure mode — glossy card */}
                <div className="p-5 bg-[rgba(255,255,255,0.02)] backdrop-blur-[12px] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(160,160,160,0.25)] transition-colors duration-500 self-start">
                  <strong className="font-mono text-[10px] tracking-widest uppercase text-[var(--accent)] opacity-60 block mb-2">Failure mode</strong>
                  <p className="font-mono text-[11px] tracking-wide text-[var(--fg-3)] leading-[1.6]">{arch.failure}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* THE READING — diagnostic table */}
      <section className="chapter section-deep relative" id="reading">
        <div className="shell">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-20 items-start">
            <div className="lg:sticky lg:top-32 h-fit">
              <Reveal><span className="eyebrow mb-6 text-[var(--accent)]">The reading</span></Reveal>
              <Reveal delay={0.1}>
                <h2 className="h-section mb-8">
                  Where the architecture<br />
                  <em className="text-[var(--accent)]">actually breaks.</em>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="body-text text-[var(--fg-3)]">
                  A diagnostic across all five layers — what is built, what is improvised, what is missing, and which gap will be exposed first.
                </p>
              </Reveal>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-x-auto"
            >
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {["Architecture", "Built", "Improvised", "Missing"].map((h) => (
                      <th key={h} className="p-4 text-left border-b border-[rgba(255,255,255,0.06)] font-mono text-[10px] tracking-widest uppercase text-[var(--accent)] opacity-70 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {readingRows.map((row, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, x: 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
                      className="group hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                    >
                      <td className="p-4 border-b border-[rgba(255,255,255,0.04)] font-mono text-[11px] tracking-widest uppercase text-[var(--accent)] opacity-80">{row.k}</td>
                      <td className="p-4 border-b border-[rgba(255,255,255,0.04)] text-[14px] text-[var(--fg-3)]">{row.b}</td>
                      <td className="p-4 border-b border-[rgba(255,255,255,0.04)] text-[14px] text-[var(--fg-3)]">{row.i}</td>
                      <td className="p-4 border-b border-[rgba(255,255,255,0.04)] text-[14px] text-[var(--fg-4)]">{row.m}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ENGAGEMENT — centered with architecture recap cards */}
      <section className="chapter section-dark relative overflow-hidden">
        <div className="shell">
          <div className="max-w-[720px] mx-auto text-center">
            <Reveal>
              <span className="eyebrow eyebrow--center mb-6 text-[var(--accent)]">Engagement</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="h-section mb-8">
                Discreet. Sequenced.<br />
                <em className="text-[var(--accent)]">Generational.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="lead text-[var(--fg-3)] mb-12 mx-auto">
                Family Business engagements run private — typically 6–9 months across the five architectures, often longer for the institution and operator layers. References available on request, not on the website.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-wrap justify-center gap-4 mb-20">
                <Link
                  href="/connect?practice=family-business"
                  className="nav-cta bg-[var(--fg)] text-[var(--bg)] border-none hover:bg-[var(--accent)] transition-all duration-500"
                >
                  Begin a Conversation
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
