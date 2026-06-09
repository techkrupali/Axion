"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import DiagnosticModal from "@/components/DiagnosticModal";
import { Reveal } from "@/components/Reveal";

// ─────────────────────────────────────────────
// CSS TOKENS (cream / light theme — mirrors the HTML)
// ─────────────────────────────────────────────
const T = {
  white:  "#F7F6F3",
  white2: "#EEECEA",
  white3: "#E2E0DC",
  ink:    "#0D0D0B",
  ink2:   "#1A1A18",
  ink3:   "#2E2E2C",
  mid:    "#7A7870",
  dim:    "#B0AEA8",
  gold:   "#A07830",
  gold2:  "#C49848",
  rule:   "rgba(13,13,11,0.10)",
  rule2:  "rgba(13,13,11,0.18)",
  display: "var(--font-cormorant-garamond),'Cormorant Garamond',serif",
  mono:    "var(--font-geist-mono),'JetBrains Mono',ui-monospace,monospace",
};

// ─────────────────────────────────────────────
// TICKER — seamless marquee helper
// ─────────────────────────────────────────────
function Ticker({
  items,
  duration = 72,
  dark = false,
}: {
  items: { tag: string; line: string }[];
  duration?: number;
  dark?: boolean;
}) {
  const track = [...items, ...items]; // duplicate for seamless loop
  return (
    <div
      className="overflow-hidden relative"
      style={{
        borderTop: `1px solid ${dark ? "rgba(247,246,243,0.12)" : T.rule}`,
        borderBottom: `1px solid ${dark ? "rgba(247,246,243,0.12)" : T.rule}`,
        padding: "16px 0",
        background: dark ? T.ink : T.white2,
        WebkitMaskImage: "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)",
        maskImage: "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)",
      }}
      aria-hidden="true"
    >
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration, ease: "linear" }}
        style={{ width: "max-content" }}
      >
        {track.map((item, i) => (
          <span key={i} className="inline-flex items-baseline gap-3 px-7">
            <span
              className="font-serif italic"
              style={{ fontSize: 20, color: dark ? "rgba(247,246,243,0.78)" : T.ink, lineHeight: 1 }}
            >
              {item.line}
            </span>
            <span
              className="self-center w-[5px] h-[5px] rotate-45 mx-2"
              style={{ background: T.gold, opacity: 0.5, display: "inline-block" }}
            />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

const STRUCTURAL_SIGNALS = [
  { tag: "Structural Signal", line: "Growth is accelerating. Stability is not." },
  { tag: "Structural Signal", line: "Cost is rising. The cause is unclear." },
  { tag: "Structural Signal", line: "AI is increasing output. Judgment is not improving." },
  { tag: "Structural Signal", line: "The organisation changes depending on who is in the room." },
  { tag: "Structural Signal", line: "Succession is visible. Authority is not." },
  { tag: "Structural Signal", line: "The business is stable. The future is not." },
];

// ─────────────────────────────────────────────
// HERO BAND
// ─────────────────────────────────────────────
function HeroBand() {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: "radial-gradient(120% 140% at 70% 10%, #232320 0%, #15150f 45%, #0D0D0B 100%)",
        borderBottom: `1px solid ${T.ink}`,
        minHeight: "clamp(280px, 40vw, 360px)",
      }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)",
          backgroundSize: "52px 52px",
          WebkitMaskImage: "linear-gradient(180deg,rgba(0,0,0,.95),transparent 88%)",
          maskImage: "linear-gradient(180deg,rgba(0,0,0,.95),transparent 88%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-12 pt-[84px] pb-28">
        {/* Practice line */}
        <div className="flex flex-wrap items-baseline gap-0">
          {["People Architecture", "Labour Codes", "AI Edge Lab", "Family Business"].map((p, i, arr) => (
            <span key={p} className="inline-flex items-baseline">
              <Link
                href="#practices"
                className="font-mono text-[11px] uppercase transition-colors duration-200"
                style={{ letterSpacing: "0.2em", color: "rgba(247,246,243,0.62)" }}
              >
                {p}
              </Link>
              {i < arr.length - 1 && (
                <span className="mx-4" style={{ color: T.gold, opacity: 0.6, fontSize: 11 }}>/</span>
              )}
            </span>
          ))}
        </div>

        {/* Thesis */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 0.61, 0.36, 1] }}
          className="font-serif italic mt-7"
          style={{
            fontSize: "clamp(22px,2.6vw,32px)",
            lineHeight: 1.1,
            color: "rgba(247,246,243,0.92)",
            maxWidth: "30ch",
          }}
        >
          You don't need a service. You need to read{" "}
          <em style={{ color: T.gold2 }}>what is breaking.</em>
        </motion.p>
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
          className="font-mono uppercase block mt-4"
          style={{ fontSize: 10, letterSpacing: "0.24em", color: T.gold, opacity: 0.75 }}
        >
          Structural Signal
        </motion.span>
      </div>

      {/* Signal strip at bottom */}
      <div className="absolute left-0 right-0 bottom-12 z-10 overflow-hidden"
        style={{
          WebkitMaskImage: "linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)",
          maskImage: "linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)",
        }}
        aria-hidden="true"
      >
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
          style={{ width: "max-content" }}
        >
          {[...STRUCTURAL_SIGNALS, ...STRUCTURAL_SIGNALS].map((s, i) => (
            <span key={i} className="inline-flex items-baseline gap-3 px-8">
              <span className="font-serif italic" style={{ fontSize: 18, color: "rgba(247,246,243,0.78)", lineHeight: 1 }}>
                {s.line}
              </span>
              <span className="self-center w-[4px] h-[4px] rotate-45 mx-1.5 inline-block" style={{ background: T.gold, opacity: 0.5 }} />
            </span>
          ))}
        </motion.div>
      </div>

      {/* Band label */}
      <span
        className="absolute left-6 sm:left-12 bottom-2 z-10 font-mono text-[10px] uppercase"
        style={{ letterSpacing: "0.22em", color: "rgba(247,246,243,0.45)" }}
      >
        Operating Architecture Practice / Bengaluru / 2026
      </span>

      {/* Vertical wordmark */}
      <span
        className="absolute right-10 top-1/2 -translate-y-1/2 font-serif font-medium uppercase hidden lg:block"
        style={{
          writingMode: "vertical-rl",
          transform: "translateY(-50%) rotate(180deg)",
          fontSize: 30,
          letterSpacing: "0.18em",
          color: "rgba(247,246,243,0.85)",
          zIndex: 2,
        }}
      >
        Axion Index
      </span>

      {/* Gold edge rule */}
      <div
        className="absolute top-0 right-0 w-1 h-full"
        style={{ background: `linear-gradient(${T.gold},transparent)`, zIndex: 2 }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// HERO BODY
// ─────────────────────────────────────────────
function HeroBody({ onDiagnosticOpen }: { onDiagnosticOpen: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ borderBottom: `1px solid ${T.rule}` }}
    >
      <motion.div style={{ y }} className="max-w-[1280px] mx-auto px-4 sm:px-8 py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 items-center">
          {/* Left */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-mono text-[17px] uppercase mb-7"
              style={{ letterSpacing: "0.24em", color: T.mid }}
            >
              Operating Architecture Practice
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif font-medium"
              style={{
                fontFamily: T.display,
                fontSize: "clamp(62px,9vw,116px)",
                lineHeight: 0.96,
                letterSpacing: "0.005em",
                color: T.ink,
              }}
            >
              <span className="block">
                From{" "}
                <span
                  style={{
                    textDecoration: "line-through",
                    textDecorationColor: T.gold,
                    textDecorationThickness: 2,
                    color: T.mid,
                  }}
                >
                  ambiguity
                </span>
              </span>
              <span className="block">
                to{" "}
                <em style={{ fontStyle: "italic", color: T.gold, fontWeight: 500 }}>architecture.</em>
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap gap-4 mt-10"
            >
              <Link
                href="/connect"
                className="inline-flex items-center gap-3 font-mono text-[10px] uppercase px-7 py-4 transition-all duration-250"
                style={{
                  letterSpacing: "0.18em",
                  background: T.ink,
                  color: T.white,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.gold; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = T.ink; }}
              >
                Reach Us <span style={{ display: "inline-block", width: 16, height: 1, background: "currentColor" }} />
              </Link>
              <a
                href="#signals"
                className="inline-flex items-center gap-3 font-mono text-[10px] uppercase px-7 py-4 transition-all duration-250"
                style={{
                  letterSpacing: "0.18em",
                  border: `1px solid ${T.rule2}`,
                  color: T.ink3,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = T.gold;
                  (e.currentTarget as HTMLElement).style.color = T.gold;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = T.rule2;
                  (e.currentTarget as HTMLElement).style.color = T.ink3;
                }}
              >
                Read the signals <span style={{ display: "inline-block", width: 16, height: 1, background: "currentColor" }} />
              </a>
            </motion.div>
          </div>

          {/* Right */}
          <div className="pt-3 md:pt-4 md:pl-10 lg:pl-16">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontFamily: T.display, fontSize: "clamp(17px,2vw,20px)", lineHeight: 1.75, color: T.ink3, fontWeight: 300, maxWidth: "46ch", marginBottom: "clamp(28px,4vw,46px)" }}
            >
              Most organisations don't fail when strategy breaks. They fail when their internal architecture cannot carry what they are becoming.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-3 sm:flex"
            >
              {[
                { val: "70%", key: "Transformations fail to sustain gains", src: "McKinsey" },
                { val: "95%", key: "GenAI pilots show no P&L impact", src: "MIT NANDA" },
                { val: "39%", key: "Core skills change by 2030", src: "WEF" },
              ].map((stat, i) => (
                <a
                  key={i}
                  href="#research"
                  className="flex-1 group block"
                  style={{
                    borderLeft: i > 0 ? `1px solid ${T.rule2}` : "none",
                    paddingLeft: i > 0 ? "clamp(10px, 3vw, 22px)" : 0,
                    paddingRight: "clamp(10px, 3vw, 22px)",
                    paddingBottom: 4,
                    transition: "border-color 0.25s",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <div
                    className="font-serif font-medium"
                    style={{ fontFamily: T.display, fontSize: "clamp(32px,5vw,52px)", lineHeight: 1, color: T.ink }}
                  >
                    {stat.val}
                  </div>
                  <div
                    className="font-mono text-[10px] sm:text-[11px] uppercase mt-2"
                    style={{ letterSpacing: "0.1em", color: T.mid, lineHeight: 1.5 }}
                  >
                    {stat.key}
                  </div>
                  <span
                    className="font-mono text-[10px] uppercase mt-1.5 inline-block opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ letterSpacing: "0.14em", color: T.gold, transform: "translateY(-2px)" }}
                  >
                    {stat.src} · See evidence
                  </span>
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────
// METHOD
// ─────────────────────────────────────────────
const METHOD_LESSONS = [
  { from: "From the Soil",          line: "The first operating system is absorbed before it is designed." },
  { from: "From Wipro",             line: "Effort without system leverage becomes invisible. Architecture beats activity." },
  { from: "Standard Chartered",     line: "Evidence converts where argument fails." },
  { from: "From HSBC",              line: "Authority rarely creates alignment. Clarity does." },
  { from: "From Tata",              line: "Culture is what your systems enforce, not what you declare." },
  { from: "From Udaan",             line: "Design for the organisation you are becoming." },
  { from: "From Gameskraft",        line: "The proof of architecture is the moment it is tested." },
];

function MethodSection() {
  return (
    <section
      style={{
        background: "#0D0D0B",
        borderBottom: "1px solid rgba(247,246,243,0.08)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-12 py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-16 lg:gap-24 items-start">

          {/* ── Left: headline ── */}
          <Reveal>
            <div className="lg:sticky lg:top-[74px]">
              {/* eyebrow */}
              <p
                className="font-mono uppercase mb-10"
                style={{ fontSize: 10, letterSpacing: "0.22em", color: "rgba(247,246,243,0.35)" }}
              >
                The Synthesis
              </p>
              <h2
                className="font-serif"
                style={{
                  fontFamily: T.display,
                  fontSize: "clamp(52px, 7vw, 96px)",
                  lineHeight: 1.0,
                  color: "rgba(247,246,243,0.92)",
                  fontWeight: 400,
                }}
              >
                The chapters became a{" "}
                <em style={{ color: T.gold, fontStyle: "italic" }}>method.</em>
              </h2>
            </div>
          </Reveal>

          {/* ── Right: lesson rows ── */}
          <div>
            {METHOD_LESSONS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-6%" }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="py-6"
                style={{
                  borderTop: i === 0 ? "none" : "1px solid rgba(247,246,243,0.08)",
                }}
              >
                <div className="grid grid-cols-[160px_1fr] gap-6 items-start">
                  <span
                    className="font-mono uppercase pt-0.5"
                    style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(247,246,243,0.32)" }}
                  >
                    {item.from}
                  </span>
                  <p
                    className="font-serif"
                    style={{
                      fontFamily: T.display,
                      fontSize: "clamp(14px,1.1vw,17px)",
                      lineHeight: 1.55,
                      color: "rgba(247,246,243,0.75)",
                    }}
                  >
                    {item.line}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// LOGIC (Operating Logic)
// ─────────────────────────────────────────────
function LogicSection() {
  return (
    <section id="about" style={{ borderBottom: `1px solid ${T.rule}` }}>
      <div className="max-w-[1280px] mx-auto px-6 sm:px-12 py-24">
        <div className="flex items-baseline justify-between mb-14 gap-6">
          <span className="font-mono text-[17px] uppercase" style={{ letterSpacing: "0.24em", color: T.mid }}>Our operating logic</span>
          <span className="font-mono text-[10px]" style={{ letterSpacing: "0.14em", color: T.dim }}>02 / 05</span>
        </div>

        <Reveal>
          <h2 className="font-serif font-medium mb-5" style={{ fontFamily: T.display, fontSize: "clamp(34px,5vw,62px)", lineHeight: 1, color: T.ink }}>
            Our Operating <em style={{ color: T.gold, fontStyle: "italic" }}>Logic.</em>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mb-16" style={{ fontFamily: T.display, fontSize: 20, color: T.ink3, maxWidth: "60ch" }}>
            Not designed in a deck. Forged in the field, then interpreted across labour, AI, people, and ownership.
          </p>
        </Reveal>

        {/* 3-step arc */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 mb-10"
          style={{ gap: 1, background: T.rule, border: `1px solid ${T.rule}` }}
        >
          {[
            {
              stage: "Origin", n: "01", title: "Belief",
              desc: "Where every operating logic begins. A conviction about how an organisation should hold, formed before the pressure arrives.",
              dark: false,
            },
            {
              stage: "Tested", n: "02", title: "Conviction",
              desc: "Belief that has survived collision with reality. Tested against data, cost, and consequence. Not opinion.",
              dark: false,
              bg: "#D8D5CF",
            },
            {
              stage: "Codified", n: "03", title: "Rhythm",
              desc: "When conviction stops depending on the person. Codified into repeatable behaviour the organisation keeps on its own.",
              dark: true,
            },
          ].map((step, i) => (
            <Reveal key={i} delay={i * 0.12}>
              <div
                className="relative p-6 sm:p-8 lg:p-11 h-full"
                style={{ background: step.dark ? T.ink : (step.bg ?? T.white) }}
              >
                {step.dark && (
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${T.gold}, transparent)` }} />
                )}
                <span className="font-mono text-[13px] uppercase block mb-4" style={{ letterSpacing: "0.2em", color: step.dark ? "rgba(247,246,243,0.5)" : T.mid }}>
                  {step.stage}
                </span>
                <span className="font-mono block mt-4 mb-3" style={{ fontSize: 16, color: step.dark ? T.gold2 : T.gold, letterSpacing: "0.14em" }}>
                  {step.n}
                </span>
                <h3
                  className="font-serif italic font-medium mb-5"
                  style={{ fontFamily: T.display, fontSize: 46, color: step.dark ? T.white : T.ink }}
                >
                  {step.title}
                </h3>
                <p style={{ fontFamily: T.display, fontSize: 17, lineHeight: 1.65, color: step.dark ? T.dim : T.ink3 }}>
                  {step.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <p className="font-serif italic" style={{ fontSize: 21, color: T.ink3, maxWidth: "60ch" }}>
            This is the same arc we build for you: from what one person believes, to what the whole organisation runs on.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// PRACTICES
// ─────────────────────────────────────────────
const PRACTICES = [
  {
    num: "[01]",
    titleMain: "People",
    titleEm: "Architecture",
    hook: "When your best people leave, the system leaves with them.",
    chip: "Judgment, decision rights & succession codified into structure",
    signal: "When the organisation depends on who is in the room, not on how it is built.",
    build: "We codify judgment, decision rights, and succession into structure the company keeps after people leave.",
    href: "/expertise/people",
  },
  {
    num: "[02]",
    titleMain: "Labour",
    titleEm: "Codes",
    hook: "Your workforce is a compliance exposure no one has mapped.",
    chip: "Headcount turned into auditable control architecture",
    signal: "When cost, classification, and compliance stop aligning, and you can't see why.",
    build: "We turn your workforce from headcount into auditable control architecture that holds when rules change.",
    href: "/expertise/labour",
  },
  {
    num: "[03]",
    titleMain: "AI",
    titleEm: "Edge Lab",
    hook: "Speed without architecture just scales bad judgment.",
    chip: "The decision layer around the model, not the model",
    signal: "When AI is making you faster, but not wiser. Speed without architecture scales bad judgment.",
    build: "We build the decision layer where AI accelerates, and where a human must still hold the call.",
    href: "/expertise/ai-edge",
  },
  {
    num: "[04]",
    titleMain: "Family",
    titleEm: "Business",
    hook: "What holds when the founder is no longer the system?",
    chip: "Ownership & authority built to survive the handover",
    signal: "When continuity depends on individuals, not structure, and succession is the risk no one says out loud.",
    build: "We codify ownership, authority, and decision rights into architecture that survives the generational handover.",
    href: "/expertise/family",
  },
];

function PracticesSection() {
  return (
    <section id="practices" style={{ borderBottom: `1px solid ${T.rule}` }}>
      <div className="max-w-[1280px] mx-auto px-6 sm:px-12 py-24">
        <div className="flex items-baseline justify-between mb-14 gap-6">
          <span className="font-mono text-[17px] uppercase" style={{ letterSpacing: "0.24em", color: T.mid }}>Where the work happens</span>
          <span className="font-mono text-[10px]" style={{ letterSpacing: "0.14em", color: T.dim }}>03 / 05</span>
        </div>

        <Reveal>
          <h2 className="font-serif font-medium mb-12" style={{ fontFamily: T.display, fontSize: "clamp(30px,4.4vw,56px)", lineHeight: 1.04, color: T.ink }}>
            One Operating Logic. <em style={{ color: T.gold, fontStyle: "italic" }}>Four Practices.</em>
          </h2>
        </Reveal>

        {/* Practice rows */}
        <div>
          {PRACTICES.map((p, i) => {
            const isDarkRow = false;
            const bodyTxt = T.ink3;
            const labelTxt = T.gold;
            return (
            <Reveal key={i} delay={i * 0.08}>
              <div style={{ marginBottom: "12px" }}>
              <Link
                href={p.href}
                className="block group"
                style={{ border: `1px solid ${T.gold}`, transition: "background 0.3s, border-color 0.3s", background: "transparent" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.white2; (e.currentTarget as HTMLElement).style.borderColor = T.gold2; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = T.gold; }}
              >
                {/* Desktop layout */}
                <div
                  className="hidden md:grid gap-9 items-start py-10 px-2"
                  style={{ gridTemplateColumns: i % 2 === 1 ? "130px 1.4fr 1.2fr 90px" : "90px 1.2fr 1.4fr 130px" }}
                >
                  {/* Column order flips for even rows (zigzag) */}
                  {i % 2 === 1 ? (
                    <>
                      {/* Enter — left */}
                      <span className="font-mono text-[10px] uppercase self-center inline-flex items-center gap-2.5"
                        style={{ letterSpacing: "0.14em", color: labelTxt }}>
                        <span className="inline-block h-px group-hover:w-7 transition-all duration-300" style={{ width: 16, background: "currentColor" }} /> Enter
                      </span>
                      {/* Signal + Build */}
                      <div className="grid grid-cols-2 gap-9">
                        <div>
                          <div className="font-mono text-[11px] uppercase mb-3" style={{ letterSpacing: "0.16em", color: labelTxt }}>The Signal</div>
                          <p style={{ fontFamily: T.display, fontSize: 16, lineHeight: 1.65, color: bodyTxt }}>{p.signal}</p>
                        </div>
                        <div>
                          <div className="font-mono text-[11px] uppercase mb-3" style={{ letterSpacing: "0.16em", color: T.gold }}>What We Build</div>
                          <p style={{ fontFamily: T.display, fontSize: 16, lineHeight: 1.65, color: bodyTxt }}>{p.build}</p>
                        </div>
                      </div>
                      {/* Title + Hook — right aligned */}
                      <div className="text-right">
                        <span className="font-serif font-medium uppercase block" style={{ fontFamily: T.display, fontSize: 36, lineHeight: 1, color: labelTxt }}>
                          {p.titleMain}{" "}
                          <em style={{ fontStyle: "italic", display: "block" }}>{p.titleEm}</em>
                        </span>
                        <p className="font-serif italic mt-5 transition-colors duration-300 group-hover:text-[#A07830]"
                          style={{ fontSize: 24, lineHeight: 1.25, color: bodyTxt }}>
                          {p.hook}
                        </p>
                        <span
                          className="inline-flex items-center gap-2 mt-4 px-3 py-1.5"
                          style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: isDarkRow ? "rgba(247,246,243,0.5)" : T.mid, border: `1px solid ${isDarkRow ? "rgba(247,246,243,0.15)" : T.rule2}` }}
                        >
                          <b style={{ color: isDarkRow ? T.white : T.ink, fontWeight: 500, fontSize: 12 }}>{p.chip.split(" ").slice(0, 2).join(" ")}</b>{" "}
                          {p.chip.split(" ").slice(2).join(" ")}
                        </span>
                      </div>
                      {/* Num — far right */}
                      <span className="font-mono self-center justify-self-end" style={{ fontSize: 13, color: labelTxt, letterSpacing: "0.12em" }}>
                        {p.num}
                      </span>
                    </>
                  ) : (
                    <>
                      {/* Num — far left */}
                      <span className="font-mono" style={{ fontSize: 13, color: labelTxt, letterSpacing: "0.12em" }}>
                        {p.num}
                      </span>
                      {/* Title + Hook */}
                      <div>
                        <span className="font-serif font-medium uppercase block" style={{ fontFamily: T.display, fontSize: 36, lineHeight: 1, color: labelTxt }}>
                          {p.titleMain}{" "}
                          <em style={{ fontStyle: "italic", display: "block" }}>{p.titleEm}</em>
                        </span>
                        <p className="font-serif italic mt-5 transition-colors duration-300 group-hover:text-[#A07830]"
                          style={{ fontSize: 24, lineHeight: 1.25, color: bodyTxt }}>
                          {p.hook}
                        </p>
                        <span
                          className="inline-flex items-center gap-2 mt-4 px-3 py-1.5"
                          style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: isDarkRow ? "rgba(247,246,243,0.5)" : T.mid, border: `1px solid ${isDarkRow ? "rgba(247,246,243,0.15)" : T.rule2}` }}
                        >
                          <b style={{ color: isDarkRow ? T.white : T.ink, fontWeight: 500, fontSize: 12 }}>{p.chip.split(" ").slice(0, 2).join(" ")}</b>{" "}
                          {p.chip.split(" ").slice(2).join(" ")}
                        </span>
                      </div>
                      {/* Signal + Build */}
                      <div className="grid grid-cols-2 gap-9">
                        <div>
                          <div className="font-mono text-[11px] uppercase mb-3" style={{ letterSpacing: "0.16em", color: labelTxt }}>The Signal</div>
                          <p style={{ fontFamily: T.display, fontSize: 16, lineHeight: 1.65, color: bodyTxt }}>{p.signal}</p>
                        </div>
                        <div>
                          <div className="font-mono text-[11px] uppercase mb-3" style={{ letterSpacing: "0.16em", color: labelTxt }}>What We Build</div>
                          <p style={{ fontFamily: T.display, fontSize: 16, lineHeight: 1.65, color: bodyTxt }}>{p.build}</p>
                        </div>
                      </div>
                      {/* Enter — far right */}
                      <span className="font-mono text-[10px] uppercase self-center justify-self-end inline-flex items-center gap-2.5"
                        style={{ letterSpacing: "0.14em", color: labelTxt }}>
                        Enter <span className="inline-block h-px group-hover:w-7 transition-all duration-300" style={{ width: 16, background: "currentColor" }} />
                      </span>
                    </>
                  )}
                </div>

                {/* Mobile layout */}
                <div className="md:hidden flex flex-col gap-4 py-8 px-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[13px]" style={{ color: labelTxt, letterSpacing: "0.12em" }}>{p.num}</span>
                    <span className="font-mono text-[11px] uppercase" style={{ letterSpacing: "0.14em", color: labelTxt }}>Enter →</span>
                  </div>
                  <span className="font-serif font-medium uppercase" style={{ fontFamily: T.display, fontSize: 30, lineHeight: 1.05, color: labelTxt }}>
                    {p.titleMain} <em style={{ fontStyle: "italic" }}>{p.titleEm}</em>
                  </span>
                  <p className="font-serif italic" style={{ fontSize: 20, lineHeight: 1.3, color: bodyTxt }}>{p.hook}</p>
                  <div>
                    <div className="font-mono text-[11px] uppercase mb-2" style={{ letterSpacing: "0.16em", color: labelTxt }}>The Signal</div>
                    <p style={{ fontFamily: T.display, fontSize: 16, lineHeight: 1.65, color: bodyTxt }}>{p.signal}</p>
                  </div>
                </div>
              </Link>
              </div>
            </Reveal>
            );
          })}
          {/* spacing after last box */}
          <div style={{ height: 4 }} />
        </div>


      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// ROLES
// ─────────────────────────────────────────────
const ROLES_DATA = [
  {
    role: "Founder / CEO",
    num: "01",
    pull: "You can feel the company outgrowing the way you run it. You just can't see where it cracks first.",
    work: "Map the failure points before they fail, and build the architecture that removes you as the single point of dependency.",
    tag: "Dependency Architecture",
  },
  {
    role: "CFO",
    num: "02",
    pull: "Cost is climbing, and headcount explains some of it. Not the part that keeps you up.",
    work: "Read the workforce as cost, risk, and control architecture, then install the structure that makes the number governable, not just reported.",
    tag: "Workforce Cost Architecture",
  },
  {
    role: "CHRO",
    num: "03",
    pull: "You're running more programs than ever, and the organisation is no more durable for it.",
    work: "Build the operating system underneath HR, so capability is designed into structure, not dependent on who's running the program.",
    tag: "Operating System Design",
  },
  {
    role: "Investor / Board",
    num: "04",
    pull: "The thesis is sound. The question is whether the organisation can carry it.",
    work: "Diligence the organisation's operating architecture: what survives the founder, and what is quietly held by individuals who can leave.",
    tag: "Institutional Durability",
  },
];

function RolesSection() {
  const [active, setActive] = useState(0);
  const r = ROLES_DATA[active];

  return (
    <section style={{ borderBottom: `1px solid ${T.rule}` }}>
      <div className="max-w-[1280px] mx-auto px-6 sm:px-12 py-24">
        {/* Header */}
        <div className="flex items-baseline justify-between mb-14 gap-6">
          <span className="font-mono text-[17px] uppercase" style={{ letterSpacing: "0.24em", color: T.mid }}>Where you sit</span>
          <span className="font-mono text-[10px]" style={{ letterSpacing: "0.14em", color: T.dim }}>04 / 05</span>
        </div>

        <Reveal>
          <h2 className="font-serif font-medium mb-14" style={{ fontFamily: T.display, fontSize: "clamp(30px,4.4vw,56px)", lineHeight: 1.04, color: T.ink }}>
            What changes, depending on <em style={{ color: T.gold, fontStyle: "italic" }}>where you sit.</em>
          </h2>
        </Reveal>

        {/* Main layout: role tabs left + content right */}
        <div className="flex flex-col lg:flex-row gap-0" style={{ border: `1px solid ${T.rule2}` }}>

          {/* Left: role selector */}
          <div className="lg:w-[300px] xl:w-[340px] flex-shrink-0 flex flex-col" style={{ borderRight: `1px solid ${T.rule2}` }}>
            {ROLES_DATA.map((item, i) => {
              const BOX_BG = ["#F7F6F3", "#E7E3DA", "#6E695E", "#0D0D0B"];
              const isDark = i >= 2;
              const boxBg = BOX_BG[i];
              return (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="w-full text-left group relative overflow-hidden transition-all duration-200 flex-1"
                style={{
                  borderBottom: i < ROLES_DATA.length - 1 ? `1px solid ${T.rule2}` : "none",
                  background: boxBg,
                  padding: "20px 20px",
                  borderLeft: active === i ? `3px solid ${T.gold}` : "3px solid transparent",
                }}
                onMouseEnter={e => { if (active !== i) (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
                onMouseLeave={e => { if (active !== i) (e.currentTarget as HTMLElement).style.opacity = "1"; }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span
                      className="font-mono text-[9px] uppercase block mb-2 transition-colors duration-200"
                      style={{ letterSpacing: "0.16em", color: isDark ? T.white : T.ink }}
                    >
                      {item.num}
                    </span>
                    <span
                      className="font-serif font-medium block transition-colors duration-200"
                      style={{ fontFamily: T.display, fontSize: 22, lineHeight: 1.1, color: isDark ? T.white : T.ink }}
                    >
                      {item.role}
                    </span>
                  </div>
                  <span
                    className="font-mono text-[18px] transition-all duration-300"
                    style={{ color: active === i ? T.gold2 : "transparent", transform: active === i ? "translateX(0)" : "translateX(-6px)" }}
                  >
                    →
                  </span>
                </div>
              </button>
              );
            })}
          </div>

          {/* Right: animated content panel */}
          <div className="flex-1 relative overflow-hidden" style={{ minHeight: 320, background: T.white }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="p-6 sm:p-10 xl:p-14 h-full flex flex-col justify-between"
              >
                {/* Big ghost number */}
                <div className="flex items-start justify-between gap-3 mb-6 flex-wrap">
                  <span
                    className="font-serif font-medium select-none"
                    style={{ fontFamily: T.display, fontSize: "clamp(80px,10vw,130px)", lineHeight: 1, color: T.white3, letterSpacing: "-0.02em" }}
                  >
                    {r.num}
                  </span>
                  <span
                    className="font-mono text-[9px] uppercase mt-3"
                    style={{ letterSpacing: "0.18em", color: T.gold, border: `1px solid ${T.rule2}`, padding: "6px 12px" }}
                  >
                    {r.tag}
                  </span>
                </div>

                {/* Pull */}
                <div className="mb-8">
                  <span className="font-mono text-[11px] uppercase block mb-3" style={{ letterSpacing: "0.18em", color: T.gold }}>
                    The pull
                  </span>
                  <p className="font-serif font-medium" style={{ fontFamily: T.display, fontSize: "clamp(22px,2.5vw,32px)", lineHeight: 1.3, color: T.ink }}>
                    {r.pull}
                  </p>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: T.rule2, marginBottom: 28 }} />

                {/* What we do */}
                <div>
                  <span className="font-mono text-[11px] uppercase block mb-3" style={{ letterSpacing: "0.18em", color: T.gold }}>
                    What we do
                  </span>
                  <p style={{ fontFamily: T.display, fontSize: 18, lineHeight: 1.75, color: T.ink3 }}>
                    {r.work}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom closing line */}
        <Reveal delay={0.3}>
          <p className="font-serif italic mt-12" style={{ fontSize: 21, color: T.ink3, maxWidth: "64ch" }}>
            We don't advise from the outside. We install architecture into how the organisation actually runs, and stay until it holds without us.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FOUR MOVES
// ─────────────────────────────────────────────
const MOVES = [
  { label: "Signal", title: "You bring the signal.", sub: "A pattern. A pressure. A question you can't quite name yet.", resolve: false },
  { label: "Read",   title: "We read the architecture.", sub: "Not the symptom. The structural condition producing it.", resolve: false },
  { label: "Define", title: "We define the intervention.", sub: "Precise. Sequenced. Built for your operating reality.", resolve: false },
  { label: "Hold",   title: "We make it hold.", sub: "Installed into the system. Not dependent on who is in the room.", resolve: true },
];

function MovesSection() {
  return (
    <section style={{ borderBottom: `1px solid ${T.rule}` }}>
      <div className="max-w-[1280px] mx-auto px-6 sm:px-12 py-24">
        <div className="flex items-baseline justify-between mb-6 gap-6">
          <span className="font-mono text-[17px] uppercase" style={{ letterSpacing: "0.24em", color: T.mid }}>The engagement</span>
          <span className="font-mono text-[10px]" style={{ letterSpacing: "0.14em", color: T.dim }}>05 / 05</span>
        </div>

        <Reveal>
          <h2 className="font-serif font-medium mb-2" style={{ fontFamily: T.display, fontSize: "clamp(30px,4.4vw,56px)", lineHeight: 1.04, color: T.ink }}>
            Four moves. <em style={{ color: T.gold, fontStyle: "italic" }}>One outcome.</em>
          </h2>
        </Reveal>
      </div>

      {/* Staggered full-width rows — same layout as founder SOIL section */}
      <div>
        {MOVES.map((move, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: move.resolve ? 1 : 1.015, y: move.resolve ? 0 : -4, zIndex: 10 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
            className="group relative border-t cursor-default overflow-hidden"
            style={{
              borderColor: move.resolve ? T.gold : T.rule,
              background: move.resolve ? `linear-gradient(135deg, #C49848 0%, #A07830 100%)` : "transparent",
              position: "relative",
            }}
          >
            {/* Hover background glow — only non-resolve rows */}
            {!move.resolve && (
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `linear-gradient(135deg, rgba(160,120,48,0.04) 0%, transparent 100%)`, boxShadow: `inset 0 0 0 1px rgba(160,120,48,0.10)` }}
              />
            )}

            {/* Gold accent top line on resolve */}
            {move.resolve && (
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: `linear-gradient(90deg, ${T.gold}, transparent 60%)` }}
              />
            )}

            {/* Ghost number watermark */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 font-serif italic leading-none pointer-events-none select-none transition-opacity duration-700 overflow-hidden ${i % 2 === 1 ? "right-8" : "left-0"}`}
              style={{
                fontSize: "22vw",
                color: T.ink,
                opacity: 0.08,
                maxWidth: "40%",
              }}
            >
              {i + 1}
            </div>

            <div className="relative max-w-[1280px] mx-auto px-6 sm:px-12 py-12 lg:py-16 flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-0">

              {/* Step label — alternates side */}
              <div className={`lg:w-1/4 flex flex-col gap-3 ${i % 2 === 1 ? "lg:items-end lg:text-right" : ""}`}>
                <span
                  className="font-mono text-[12px] uppercase tracking-[0.4em] transition-all duration-500 group-hover:opacity-100"
                  style={{ color: move.resolve ? T.ink : T.ink, opacity: 0.7 }}
                >
                  {move.label}
                </span>
                <span
                  className="font-serif italic leading-none transition-colors duration-500 group-hover:text-[#A07830]"
                  style={{
                    fontSize: "clamp(52px,7vw,88px)",
                    WebkitTextStroke: `1px ${move.resolve ? T.ink : T.ink}`,
                    color: "transparent",
                  }}
                >
                  {i + 1}.
                </span>
              </div>

              {/* Vertical divider — desktop */}
              <div
                className="hidden lg:block w-px self-stretch mx-12 transition-colors duration-500 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(to bottom, transparent, ${move.resolve ? "rgba(247,246,243,0.14)" : T.rule2}, transparent)`,
                  opacity: 0.6,
                }}
              />

              {/* Content */}
              <div className={`flex-1 ${i % 2 === 1 ? "lg:text-right" : ""}`}>
                <h3
                  className="font-serif font-medium transition-colors duration-500"
                  style={{
                    fontFamily: T.display,
                    fontSize: "clamp(32px,4.5vw,64px)",
                    lineHeight: 1.0,
                    color: move.resolve ? T.ink : T.gold,
                  }}
                >
                  {move.title}
                </h3>
                <p
                  className="font-serif italic mt-4 transition-colors duration-500"
                  style={{
                    fontFamily: T.display,
                    fontSize: 20,
                    color: move.resolve ? "rgba(13,13,11,0.75)" : T.ink,
                    lineHeight: 1.7,
                    maxWidth: "46ch",
                    marginLeft: i % 2 === 1 ? "auto" : 0,
                  }}
                >
                  {move.sub}
                </p>
              </div>
            </div>

            {/* Gold bottom slide line on hover */}
            {!move.resolve && (
              <div className="absolute bottom-0 left-0 h-[1px] w-0 group-hover:w-full transition-all duration-700"
                style={{ background: `linear-gradient(90deg, ${T.gold}, transparent)` }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FINAL CTA
// ─────────────────────────────────────────────
function FinalSection({ onDiagnosticOpen }: { onDiagnosticOpen: () => void }) {
  return (
    <section
      id="final"
      style={{ background: T.ink, borderBottom: "none", color: T.white }}
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-12 py-24">
        <Reveal>
          <span className="font-mono text-[17px] uppercase block mb-6" style={{ letterSpacing: "0.24em", color: T.gold2 }}>
            Begin the diagnostic
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-serif font-medium mb-8" style={{ fontFamily: T.display, fontSize: "clamp(40px,6vw,84px)", lineHeight: 1.0, color: T.white }}>
            Start where the signal is <em style={{ color: T.gold2, fontStyle: "italic" }}>strongest.</em>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mb-11" style={{ fontFamily: T.display, fontSize: 19, color: T.dim, maxWidth: "56ch", lineHeight: 1.7 }}>
            A 30-minute architectural read. You bring the signal. We tell you what's structurally producing it. No fee, no pitch.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <button
            onClick={onDiagnosticOpen}
            className="inline-flex items-center gap-3 font-mono text-[10px] uppercase px-7 py-4 transition-all duration-250"
            style={{
              letterSpacing: "0.18em",
              background: T.gold,
              color: T.ink,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.gold2; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = T.gold; }}
          >
            Start Diagnostic{" "}
            <span style={{ display: "inline-block", width: 16, height: 1, background: "currentColor" }} />
          </button>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FOOTER (light theme version)
// ─────────────────────────────────────────────
function SiteFooter() {
  return (
    <footer style={{ background: T.ink, color: T.dim, paddingTop: "clamp(40px,8vw,80px)", paddingBottom: 40 }}>
      <div className="max-w-[1280px] mx-auto px-6 sm:px-12">
        {/* Grid */}
        <div
          className="grid gap-12 pb-14"
          style={{
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            borderBottom: "1px solid rgba(247,246,243,0.14)",
          }}
        >
          {/* Brand */}
          <div className="col-span-full lg:col-span-1">
            <img
              src="/axion-index-lockup-gold-on-black.svg"
              alt="Axion Index"
              style={{ width: "clamp(140px, 30vw, 200px)", maxWidth: "100%", height: "auto", display: "block" }}
            />
            <p className="mt-4" style={{ fontSize: 13, color: T.mid, maxWidth: "34ch", lineHeight: 1.6 }}>
              Architecture is read, not pitched.
            </p>
          </div>

          {/* Practices */}
          <div>
            <h4
              className="font-mono text-[9px] uppercase mb-5 pb-3"
              style={{ letterSpacing: "0.22em", color: T.gold2, borderBottom: "1px solid rgba(196,152,72,0.25)" }}
            >
              Practices
            </h4>
            {[
              ["People Architecture", "/expertise/people"],
              ["Labour Codes", "/expertise/labour"],
              ["AI Edge Lab", "/expertise/ai-edge"],
              ["Family Business", "/expertise/family"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="block transition-all duration-200 py-1.5"
                style={{ fontSize: 13, color: T.dim }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = T.white;
                  (e.currentTarget as HTMLElement).style.paddingLeft = "5px";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = T.dim;
                  (e.currentTarget as HTMLElement).style.paddingLeft = "0px";
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Index */}
          <div>
            <h4
              className="font-mono text-[9px] uppercase mb-5 pb-3"
              style={{ letterSpacing: "0.22em", color: T.gold2, borderBottom: "1px solid rgba(196,152,72,0.25)" }}
            >
              Index
            </h4>
            {[
              ["Operating Patterns", "#about"],
              ["Story", "/founder"],
              ["Research & Journals", "/research"],
              ["About", "/about"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="block transition-all duration-200 py-1.5"
                style={{ fontSize: 13, color: T.dim }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = T.white;
                  (e.currentTarget as HTMLElement).style.paddingLeft = "5px";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = T.dim;
                  (e.currentTarget as HTMLElement).style.paddingLeft = "0px";
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4
              className="font-mono text-[9px] uppercase mb-5 pb-3"
              style={{ letterSpacing: "0.22em", color: T.gold2, borderBottom: "1px solid rgba(196,152,72,0.25)" }}
            >
              Contact
            </h4>
            <span className="block py-1.5" style={{ fontSize: 13, color: T.dim }}>Bengaluru, India</span>
            <a
              href="mailto:office@axionindex.org"
              className="block py-1.5 transition-colors duration-200 hover:text-white"
              style={{ fontSize: 13, color: T.dim }}
            >
              office@axionindex.org
            </a>
            <a
              href="https://linkedin.com/company/axionindex"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-1.5 transition-colors duration-200 hover:text-white"
              style={{ fontSize: 13, color: T.dim }}
            >
              LinkedIn
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-wrap justify-between items-center gap-4 pt-8 font-mono text-[10px] uppercase"
          style={{ letterSpacing: "0.12em", color: T.mid }}
        >
          <span>© 2026 Axion Index / Operating Architecture Practice</span>
          <span>Architecture is read, not pitched.</span>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────
export default function Home() {
  const [diagOpen, setDiagOpen] = useState(false);

  return (
    <>
      {/* Cream grid background — whole page */}
      <div
        className="min-h-screen"
        style={{
          background: T.white,
          backgroundImage:
            "linear-gradient(rgba(13,13,11,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(13,13,11,.045) 1px,transparent 1px)",
          backgroundSize: "52px 52px",
          paddingTop: 0,
        }}
      >
        {diagOpen && <DiagnosticModal onClose={() => setDiagOpen(false)} />}

        {/* 1 — Hero Band */}
        <HeroBand />

        {/* 2 — Hero Body */}
        <HeroBody onDiagnosticOpen={() => setDiagOpen(true)} />

        {/* 3 — Method */}
        <MethodSection />

        {/* 4 — Operating Logic */}
        <LogicSection />

        {/* 6 — Practices */}
        <PracticesSection />

        {/* 7 — Roles */}
        <RolesSection />

        {/* 8 — Four Moves */}
        <MovesSection />

        {/* 9 — Final CTA */}
        <FinalSection onDiagnosticOpen={() => setDiagOpen(true)} />

        {/* 10 — Footer */}
        <SiteFooter />
      </div>
    </>
  );
}
