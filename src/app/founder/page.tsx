"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const career = [
  { code: "SCB", full: "Standard Chartered", sub: "Rewards architecture · 700→10,000 scaled operation", body: "Built rewards architecture across a 700-to-10,000 scaled operation. Proved data is how HR earns authority, not how it gets ignored.", stat: "96%", statLabel: "Q12 participation" },
  { code: "TGB", full: "Tata Global Beverages", sub: "Decade · 3 heritage brands · Starbucks + PepsiCo JVs", body: "Decade-long institutional architecture across three heritage brands and joint ventures. London-to-Mumbai global HQ relocation completed at 95%+ retention.", stat: "95%+", statLabel: "Retention through global HQ relocation" },
  { code: "UDN", full: "Udaan", sub: "800→4,000 on-roll · 22 languages · 28 states", body: "Scaled people architecture from 800 to over 4,000 on-roll across 22 languages and 28 states. During COVID, when Udaan was classified as essential government infrastructure, manning held at 95% with no productivity loss.", stat: "95%", statLabel: "COVID manning · zero productivity loss" },
  { code: "GSK", full: "Gameskraft", sub: "9 → full institution · GST shock · zero layoffs", body: "Built the operating system from nine people managing event logistics into a full institution. When a 28% retroactive GST shock and state-level bans threatened the industry, the architecture held: 27% of roles impacted by strategy change, 97.1% top-performer retention, zero involuntary layoffs.", stat: "97.1%", statLabel: "Top-performer retention" },
];

const codified = [
  { label: "Methodology", title: "The BCR Framework.", body: "Belief → Conviction → Rhythm. The signature methodology that runs the platform." },
  { label: "Practice doctrines", title: "Four doctrines.", body: "One platform method — BCR — interpreted across labour, AI, people, and ownership through a second carrier framework, 3i (Interpret · Integrate · Institutionalise). Other methods sit underneath as embedded structures, not branded acronyms." },
  { label: "HROS", title: "The operating-system layer.", body: "Nitin is building separately, where the architecture lives in motion. It is the destination for the patterns codified at Axion Index." },
  { label: "In writing", title: "The Operating Architect (2026).", body: "The book that gathers the codified patterns, the institutional cases, and the doctrine into a single working text." },
];

export default function Founder() {
  return (
    <div className="min-h-screen">

      {/* BUILT BY A PRACTITIONER */}
      <section className="chapter section-deep relative" id="built-by">
        <div className="shell">
          <div className="mb-12">
            <Reveal>
              <span className="eyebrow mb-4 text-[var(--accent)]">04 — FOUNDER</span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="font-serif font-normal leading-[1.1] tracking-[-0.02em] text-[var(--fg)]"
                style={{ fontSize: "clamp(28px,3.5vw,52px)" }}>
                Built by a{" "}
                <em className="italic" style={{ color: "var(--accent)" }}>practitioner</em>
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10 items-start">

            {/* Photo placeholder card */}
            <Reveal delay={0.1}>
              <div
                className="relative flex items-end justify-center"
                style={{
                  aspectRatio: "3 / 4",
                  background: "rgba(18,18,18,0.8)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span
                  className="font-jetbrains tracking-[0.25em] uppercase mb-4 text-center block"
                  style={{ fontSize: "9px", color: "rgba(201,168,76,0.45)" }}
                >
                  NITIN NAHATA
                </span>
              </div>
            </Reveal>

            {/* Details */}
            <Reveal delay={0.15}>
              <div>
                {/* Name */}
                <h3
                  className="font-serif font-normal text-[var(--fg)] mb-2"
                  style={{ fontSize: "clamp(22px,2.4vw,34px)" }}
                >
                  Nitin Nahata
                </h3>

                {/* Role tags */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-6">
                  {["FOUNDER, AXION INDEX", "GROUP CHRO, GAMESKRAFT"].map((tag, i) => (
                    <span key={i} className="font-jetbrains tracking-[0.2em] uppercase"
                      style={{ fontSize: "9px", color: "var(--accent)" }}>
                      {tag}
                      {i < 1 && <span className="ml-3" style={{ color: "rgba(201,168,76,0.3)" }}>·</span>}
                    </span>
                  ))}
                </div>

                {/* Bio paragraphs */}
                <p
                  className="font-sans font-normal leading-[1.7] mb-5"
                  style={{ fontSize: "clamp(13px,1.1vw,15px)", color: "rgba(200,200,200,0.6)", maxWidth: "60ch" }}
                >
                  Two decades building people architecture across startups and enterprises. Currently Group CHRO at Gameskraft, leading workforce strategy for one of India&apos;s largest gaming companies.
                </p>
                <p
                  className="font-sans font-normal leading-[1.7] mb-8"
                  style={{ fontSize: "clamp(13px,1.1vw,15px)", color: "rgba(200,200,200,0.6)", maxWidth: "60ch" }}
                >
                  Axion Index is the codification of a simple belief: workforce decisions are board-level governance matters, not HR administrative tasks. The tools organisations need should make them self-sufficient, not consultant-dependent.
                </p>

                {/* CTA buttons */}
                <div className="flex flex-wrap gap-3">
                  <motion.a
                    href="https://linkedin.com/in/nitin-nahata"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ borderColor: "rgba(201,168,76,0.5)", color: "var(--accent)" }}
                    className="inline-flex items-center gap-2 px-4 py-2 font-jetbrains text-[9px] tracking-[0.22em] uppercase text-[var(--fg-3)]"
                    style={{
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.02)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                    </svg>
                    LinkedIn
                  </motion.a>
                  <motion.a
                    href="mailto:nitin@axionindex.com"
                    whileHover={{ borderColor: "rgba(201,168,76,0.5)", color: "var(--accent)" }}
                    className="inline-flex items-center gap-2 px-4 py-2 font-jetbrains text-[9px] tracking-[0.22em] uppercase text-[var(--fg-3)]"
                    style={{
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.02)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                    Email
                  </motion.a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* HERO */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-founder" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(201,168,76,1)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-founder)" />
          </svg>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_30%,var(--bg)_100%)]" />
        </div>
        <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] rounded-full opacity-[0.04] pointer-events-none"
          style={{ background: "radial-gradient(circle, #C9A84C 0%, transparent 70%)", animation: "float 16s ease-in-out infinite" }} />

        <div className="shell text-center relative z-10 pt-20">
          <Reveal>
            <div className="eyebrow eyebrow--center mb-10 text-[var(--accent)]">AXION&nbsp;&nbsp;·&nbsp;&nbsp;FOUNDER</div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="hero-glow mb-6">
              <span className="block font-serif font-normal text-[clamp(28px,3.5vw,52px)] leading-[1.15] tracking-[-0.01em] text-[var(--fg-2)] mb-2">
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
            <p className="lead mx-auto mb-14 text-[var(--fg-3)] max-w-[50ch]">
              The practitioner whose work codified the patterns Axion Index now deploys.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-col items-center gap-8">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link href="/connect" className="inline-flex items-center gap-3 px-10 py-5 font-mono text-[11px] tracking-[0.28em] uppercase rounded-full font-semibold"
                  style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)", color: "#080A0F", boxShadow: "0 0 40px rgba(201,168,76,0.2)" }}>
                  Begin a Diagnostic <ArrowRight size={14} />
                </Link>
              </motion.div>
              <a className="kbd-arrow text-[var(--fg-4)] hover:text-[var(--accent)]" href="#insight">
                Read the defining insight
              </a>
            </div>
          </Reveal>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[35vh] bg-gradient-to-t from-[var(--bg)] to-transparent pointer-events-none" />
      </header>

      {/* DEFINING INSIGHT */}
      <section className="chapter section-dark relative" id="insight">
        <div className="shell">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 items-start">
            <motion.div initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-10% 0px" }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}>
              <Reveal><span className="eyebrow mb-6 text-[var(--accent)]">The defining insight</span></Reveal>
              <p className="font-serif text-[clamp(20px,2.4vw,32px)] leading-[1.5] text-[var(--fg-2)]">
                Most failures are not strategy failures. They are people-system failures that happen silently, long before anyone notices. By the time they show up as attrition or culture issues, the damage is already structural.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-10% 0px" }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="p-10 glass-card">
              <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--accent)] opacity-60 block mb-6">The thesis · in his words</span>
              <p className="font-serif italic text-[clamp(18px,2vw,26px)] leading-[1.6] text-[var(--fg-2)] mb-8">
                &ldquo;I architect order before scale demands it. The work is to make the patterns survive the person.&rdquo;
              </p>
              <div className="pt-6 border-t border-[var(--line)]">
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
                <em>Each a different stress test.</em>
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
              <motion.div key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -70 : 70 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.04 }}
                className="grid grid-cols-1 md:grid-cols-[100px_1fr] lg:grid-cols-[100px_1fr_1fr_160px] gap-6 md:gap-8 lg:gap-10 py-12 border-b border-[var(--line)] group items-start hover:bg-[rgba(201,168,76,0.01)] transition-colors px-4 -mx-4"
              >
                <div>
                  <span className="font-serif italic text-[clamp(28px,3vw,42px)] text-[var(--accent)] leading-[0.85] opacity-25 group-hover:opacity-90 transition-opacity duration-500 block">
                    {item.code}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-[clamp(18px,2vw,26px)] font-medium leading-[1.2] text-[var(--fg)] mb-2 group-hover:text-[var(--accent)] transition-colors duration-500">
                    {item.full}
                  </h3>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--fg-4)]">{item.sub}</span>
                </div>
                <p className="text-[15px] leading-[1.65] text-[var(--fg-3)]">{item.body}</p>
                <div className="p-5 glass-card self-start text-center">
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
                <em>made transferable.</em>
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {codified.map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
              >
                <motion.div whileHover={{ y: -4, borderColor: "var(--line-gold)" }} transition={{ duration: 0.3 }} className="cool-card group h-full">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--accent)] opacity-60 mb-4 block">{item.label}</span>
                  <h3 className="font-serif text-[clamp(18px,2vw,24px)] text-[var(--fg)] mb-4 group-hover:text-[var(--accent)] transition-colors duration-500">{item.title}</h3>
                  <p className="text-[14px] leading-[1.7] text-[var(--fg-3)]">{item.body}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="chapter py-40 overflow-hidden relative" style={{ background: "linear-gradient(180deg, var(--bg) 0%, #0C0E14 50%, var(--bg) 100%)" }}>
        <div className="shell text-center relative z-10">
          <Reveal><span className="eyebrow eyebrow--center mb-10 text-[var(--accent)]">Continue</span></Reveal>
          <Reveal delay={0.1}>
            <h2 className="h-display mb-12">
              From ambiguity<br />
              to <em>architecture.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-wrap justify-center gap-5">
              <Link href="/about" className="nav-cta">About Axion Index</Link>
              <Link href="/#practices" className="nav-cta">The four practices</Link>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link href="/connect" className="inline-flex items-center gap-3 px-10 py-5 font-mono text-[11px] tracking-[0.28em] uppercase rounded-full font-semibold"
                  style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)", color: "#080A0F", boxShadow: "0 0 40px rgba(201,168,76,0.2)" }}>
                  Begin a diagnostic <ArrowRight size={14} />
                </Link>
              </motion.div>
            </div>
          </Reveal>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)" }} />
      </section>
    </div>
  );
}
