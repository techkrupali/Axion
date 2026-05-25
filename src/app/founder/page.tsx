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


      {/* ══════════════════════════════════════════════════════════════════
          HERO — The Making of the Operating Architect
      ══════════════════════════════════════════════════════════════════ */}
      <header
        className="relative min-h-screen flex items-stretch overflow-hidden"
        style={{ background: "#080808" }}
      >
        {/* LEFT — full-height B&W photo */}
        <div className="hidden md:block w-[42%] lg:w-[45%] relative shrink-0">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to right, #080808 0%, transparent 18%), linear-gradient(to left, #080808 0%, transparent 12%)",
              zIndex: 2,
            }}
          />
          {/* Photo placeholder — replace src with real image */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(160deg, #1a1a1a 0%, #0a0a0a 100%)",
            }}
          >
            <img
              src="/nitishpic.png"
              alt="Nitin Nahata"
              className="w-full h-full object-cover object-top"
              style={{ filter: "grayscale(100%)" }}
            />
          </div>
        </div>

        {/* RIGHT — content */}
        <div
          className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 relative z-10"
          style={{ paddingTop: "clamp(100px,14vh,160px)", paddingBottom: "clamp(60px,8vh,100px)" }}
        >
          {/* Name label */}
          <Reveal>
            <span
              className="font-jetbrains tracking-[0.35em] uppercase mb-8 block"
              style={{ fontSize: "clamp(9px,0.75vw,11px)", color: "#C9A84C" }}
            >
              NITIN NAHATA
            </span>
          </Reveal>

          {/* Main title */}
          <Reveal delay={0.1}>
            <h1
              className="font-serif font-normal leading-[1.0] tracking-[-0.02em] mb-10"
              style={{
                fontSize: "clamp(36px,5.5vw,76px)",
                color: "#F5F0E8",
              }}
            >
              The Making<br />
              of the<br />
              Operating<br />
              Architect
            </h1>
          </Reveal>

          {/* Subtitle */}
          <Reveal delay={0.18}>
            <p
              className="font-sans font-light leading-[1.5] mb-12"
              style={{
                fontSize: "clamp(16px,1.5vw,20px)",
                color: "rgba(200,195,185,0.7)",
                maxWidth: "36ch",
              }}
            >
              A 23-Year Journey Through Collision, Scars &amp; Conviction
            </p>
          </Reveal>

          {/* Italic quote — gold, no border */}
          <Reveal delay={0.26}>
            <p
              className="font-serif italic leading-[1.75]"
              style={{
                fontSize: "clamp(14px,1.2vw,18px)",
                color: "#C9A84C",
                maxWidth: "42ch",
              }}
            >
              &ldquo;A bamboo plant spends years building roots underground. No visible shoot. No measurable progress. Then, in what looks like weeks, it rises. The speed is not sudden. It was always happening — invisibly, structurally, below the surface.&rdquo;
            </p>
          </Reveal>

          {/* Thin vertical line below quote */}
          <Reveal delay={0.34}>
            <div
              className="mt-8"
              style={{ width: "1px", height: "48px", background: "rgba(255,255,255,0.2)" }}
            />
          </Reveal>
        </div>

        {/* Bottom fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 w-full h-[20vh]"
          style={{ background: "linear-gradient(to top, #080808 0%, transparent 100%)", zIndex: 3 }}
        />
      </header>
      {/* ══════════════════════════════════════════════════════════════════
          THE SOIL — BEFORE 2003
      ══════════════════════════════════════════════════════════════════ */}
      <section
        className="relative"
        style={{
          background: "#080808",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "clamp(80px,12vh,160px) 0",
        }}
      >
        <div className="shell">

          {/* Section header */}
          <Reveal>
            <div className="mb-14 max-w-[680px] mx-auto">
              <span
                className="font-jetbrains tracking-[0.35em] uppercase block mb-1"
                style={{ fontSize: "12px", color: "#C9A84C" }}
              >
                THE SOIL
              </span>
              <span
                className="font-jetbrains tracking-[0.3em] uppercase block mb-8"
                style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}
              >
                BEFORE 2003
              </span>
              <h2
                className="font-serif font-normal leading-[1.05] tracking-[-0.02em] mb-8"
                style={{ fontSize: "clamp(28px,3.8vw,54px)", color: "#F5F0E8", maxWidth: "18ch" }}
              >
                Where the operating<br />
                system began writing itself
              </h2>
              <p
                className="font-sans font-light leading-[1.7]"
                style={{ fontSize: "clamp(13px,1.1vw,16px)", color: "rgba(200,195,185,0.55)", maxWidth: "62ch" }}
              >
                Every architect needs material to work with. For buildings, it is steel and concrete. For people systems, it is something less visible: a way of reading the world, a comfort with responsibility, an internal compass that holds when external certainty disappears.
              </p>
            </div>
          </Reveal>

          {/* Story cards */}
          <div className="flex flex-col gap-6 max-w-[680px] mx-auto">

            {/* Card 1 — The Origins */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="p-8 sm:p-10"
              style={{
                background: "rgba(18,18,18,0.7)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "12px",
              }}
            >
              <span
                className="font-jetbrains tracking-[0.3em] uppercase block mb-4"
                style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)" }}
              >
                DELHI · A MARWARI HOUSEHOLD
              </span>
              <h3
                className="font-serif font-normal mb-5"
                style={{ fontSize: "clamp(22px,2.4vw,34px)", color: "#F5F0E8" }}
              >
                The Origins
              </h3>
              <p
                className="font-sans font-light leading-[1.7] mb-6"
                style={{ fontSize: "clamp(13px,1.1vw,15px)", color: "rgba(200,195,185,0.6)" }}
              >
                Born into a world where the script was laid out early: Commerce, CA, Business, Respectability. But within that structure lived a different kind of influence. A maternal grandfather who began working at thirteen, who embodied responsibility before teaching it.
              </p>
              <div
                className="pl-5"
                style={{ borderLeft: "2px solid rgba(201,168,76,0.35)" }}
              >
                <p
                  className="font-serif italic leading-[1.7]"
                  style={{ fontSize: "clamp(13px,1.1vw,15px)", color: "#C9A84C" }}
                >
                  &ldquo;The first operating system is not designed. It is absorbed — from the people who raise you, the values they embody without declaring, and the quiet conviction that thinking for yourself is not defiance but duty.&rdquo;
                </p>
              </div>
            </motion.div>

            {/* Card 2 — The First Collision */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="p-8 sm:p-10"
              style={{
                background: "rgba(18,18,18,0.7)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "12px",
              }}
            >
              <span
                className="font-jetbrains tracking-[0.3em] uppercase block mb-4"
                style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)" }}
              >
                DELHI · 2002 — SRCC VS. BANGALORE
              </span>
              <h3
                className="font-serif font-normal mb-5"
                style={{ fontSize: "clamp(22px,2.4vw,34px)", color: "#F5F0E8" }}
              >
                The First Collision
              </h3>
              <p
                className="font-sans font-light leading-[1.7] mb-6"
                style={{ fontSize: "clamp(13px,1.1vw,15px)", color: "rgba(200,195,185,0.6)" }}
              >
                SRCC held firm within my consciousness — not simply a college but a verdict. When the letter came confirming what everyone expected, the path seemed settled. But life rarely honours the scripts we write for ourselves. At eighteen, standing between certainty and duty, I chose Bangalore. Not because I wanted to leave. But because accountability felt familiar.
              </p>
              <div
                className="pl-5"
                style={{ borderLeft: "2px solid rgba(201,168,76,0.35)" }}
              >
                <p
                  className="font-serif italic leading-[1.7]"
                  style={{ fontSize: "clamp(13px,1.1vw,15px)", color: "#C9A84C" }}
                >
                  &ldquo;The choices that are easy do not form identity. The ones that arrive at the worst possible time and demand an answer — those reflect character, not convenience.&rdquo;
                </p>
              </div>
            </motion.div>

            {/* Card 3 — The Anonymous Years */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="p-8 sm:p-10"
              style={{
                background: "rgba(18,18,18,0.7)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "12px",
              }}
            >
              <span
                className="font-jetbrains tracking-[0.3em] uppercase block mb-4"
                style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)" }}
              >
                BANGALORE · 2002–2005
              </span>
              <h3
                className="font-serif font-normal mb-5"
                style={{ fontSize: "clamp(22px,2.4vw,34px)", color: "#F5F0E8" }}
              >
                The Anonymous Years
              </h3>
              <p
                className="font-sans font-light leading-[1.7] mb-6"
                style={{ fontSize: "clamp(13px,1.1vw,15px)", color: "rgba(200,195,185,0.6)" }}
              >
                Bangalore did not welcome me with clarity. It met me with stillness — the kind that unnerves you when you are eighteen and suddenly invisible in a city that does not know your past or care about your promise. Anonymity has a strange discipline. It cleans out the noise you did not know you were carrying.
              </p>
              <div
                className="pl-5"
                style={{ borderLeft: "2px solid rgba(201,168,76,0.35)" }}
              >
                <p
                  className="font-serif italic leading-[1.7]"
                  style={{ fontSize: "clamp(13px,1.1vw,15px)", color: "#C9A84C" }}
                >
                  &ldquo;Anonymity is the crucible that separates those who need validation from those who generate their own momentum.&rdquo;
                </p>
              </div>
            </motion.div>

            {/* Card 4 — HR at TISS */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="p-8 sm:p-10"
              style={{
                background: "rgba(18,18,18,0.7)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "12px",
              }}
            >
              <span
                className="font-jetbrains tracking-[0.3em] uppercase block mb-4"
                style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)" }}
              >
                MUMBAI
              </span>
              <h3
                className="font-serif font-normal mb-5"
                style={{ fontSize: "clamp(22px,2.4vw,34px)", color: "#F5F0E8" }}
              >
                HR at TISS
              </h3>
              <p
                className="font-sans font-light leading-[1.7] mb-6"
                style={{ fontSize: "clamp(13px,1.1vw,15px)", color: "rgba(200,195,185,0.6)" }}
              >
                I did not choose HR as a fallback. I chose it because I finally recognised that my instinct for people and my instinct for business were not separate — they were the same instinct. Solve people problems with a business mind. Solve business problems with a people heart.
              </p>
              <div
                className="pl-5"
                style={{ borderLeft: "2px solid rgba(201,168,76,0.35)" }}
              >
                <p
                  className="font-serif italic leading-[1.7]"
                  style={{ fontSize: "clamp(13px,1.1vw,15px)", color: "#C9A84C" }}
                >
                  &ldquo;The people instinct and the business instinct are not separate. They are the same instinct expressed through different lenses.&rdquo;
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

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
