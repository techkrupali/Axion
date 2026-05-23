"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/Reveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Data ────────────────────────────────────────────────────────────────────

const aiTasks = [
  "Research", "Analysis", "Analytics", "Presentations",
  "Content", "Report Writing", "Emails", "Summaries",
];

const linkedinCards = [
  { title: "Tools &\nPrompts",       sub: '"How to use\nAI better"' },
  { title: "Fear &\nJob Loss",       sub: '"What AI\nwill do to us"' },
  { title: "Courses &\nUpskilling",  sub: '"How to\nstay relevant"' },
  { title: "Org AI\nAdoption",       sub: '"How to\nimplement AI"' },
];

const threeThings = [
  {
    num: "01",
    title: "Your Status",
    desc: "Where your edge is thinning. Where your work is defensible. Where your thinking is dependent vs owned.",
  },
  {
    num: "02",
    title: "Your Rules",
    desc: "The AI-era framework: judgment over answers, ownership over output, clarity over speed.",
  },
  {
    num: "03",
    title: "Your 90-Day Plan",
    desc: "A personalised action plan. Deliberate, not sporadic. Yours, not generic.",
  },
];

const transformations = [
  { from: "Guessing your readiness", to: "Knowing your exact status" },
  { from: "Consuming tools with no plan", to: "Executing a 90-day build" },
  { from: "Reacting to every AI headline", to: "Operating from a fixed framework" },
  { from: "Falling behind in silence", to: "Building an edge you can defend" },
];

const ctaFeatures = [
  { label: "Status", desc: "Know exactly where you stand today" },
  { label: "Rules", desc: "The framework that holds as work shifts" },
  { label: "90 Days", desc: "Your AI-proof action plan — personal, structured, deliberate" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function AIEdgeLab() {
  const heroRef = useRef<HTMLElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bgTextY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // GSAP: stagger the hero text lines on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gsap-hero-line",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.14,
          ease: "power3.out",
          delay: 0.2,
        }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: "#050505" }}
    >
      {/* ── Grain overlay ─────────────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[9998] opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "256px 256px",
        }}
      />

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 01 — HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        style={{ paddingTop: "clamp(120px,16vh,200px)", paddingBottom: "clamp(80px,12vh,140px)" }}
      >
        {/* Oversized faded BG word */}
        <motion.div
          ref={bgTextRef}
          style={{ y: bgTextY, opacity: heroOpacity }}
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-start overflow-hidden select-none"
        >
          <span
            className="font-serif font-bold leading-none whitespace-nowrap"
            style={{
              fontSize: "clamp(120px,22vw,340px)",
              color: "transparent",
              WebkitTextStroke: "1px rgba(255,255,255,0.04)",
              letterSpacing: "-0.04em",
              paddingLeft: "clamp(24px,6vw,96px)",
            }}
          >
            AI EDGE
          </span>
        </motion.div>

        {/* Radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 20% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)",
          }}
        />

        <div className="shell relative z-10">
          {/* Top label */}
          <div className="gsap-hero-line mb-10">
            <span className="eyebrow text-[var(--accent)]">
              AXION INDEX&nbsp;&nbsp;·&nbsp;&nbsp;PIONEERING WORK
            </span>
          </div>

          {/* Main heading */}
          <h1
            className="gsap-hero-line font-serif font-normal text-[var(--fg)] leading-[1.0] tracking-[-0.025em] mb-8"
            style={{ fontSize: "clamp(38px,5.5vw,88px)", maxWidth: "18ch" }}
          >
            Everyone is talking about AI.{" "}
            <em className="italic" style={{ color: "var(--accent)" }}>
              Almost no one is talking to you.
            </em>
          </h1>

          {/* Subtext */}
          <p
            className="gsap-hero-line text-[var(--fg-3)] font-light leading-[1.65]"
            style={{ fontSize: "clamp(16px,1.4vw,20px)", maxWidth: "46ch" }}
          >
            Tools. Courses. Corporate strategies. All of it.{" "}
            <br className="hidden md:block" />
            None of it for the individual who has to show up tomorrow.
          </p>
        </div>

        {/* Bottom fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 w-full h-[30vh]"
          style={{
            background: "linear-gradient(to top, #050505 0%, transparent 100%)",
          }}
        />
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 02 — WHAT AI CAN NOW DO
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative"
        style={{
          background: "#080808",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "clamp(80px,12vh,160px) 0",
        }}
      >
        <div className="shell">
          {/* Label */}
          <Reveal>
            <span className="eyebrow text-[var(--accent)] mb-8 block">
              WHAT AI CAN NOW DO
            </span>
          </Reveal>

          {/* Main statement */}
          <Reveal delay={0.1}>
            <p
              className="font-serif font-normal text-[var(--fg)] leading-[1.1] tracking-[-0.02em] mb-14"
              style={{ fontSize: "clamp(28px,3.8vw,58px)", maxWidth: "22ch" }}
            >
              A significant portion of what filled your working day can now be done by AI.{" "}
              <em className="italic" style={{ color: "var(--accent)" }}>In minutes.</em>
            </p>
          </Reveal>

          {/* Task grid — 3 columns, 3 rows */}
          <Reveal delay={0.15}>
          <div className="grid grid-cols-3 gap-3 mb-14">
            {[...aiTasks, "And more →"].map((task, i) => {
              const isLast = i === aiTasks.length;
              return (
                <motion.div
                  key={task}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{
                    borderColor: isLast ? "rgba(201,168,76,0.7)" : "rgba(201,168,76,0.4)",
                    color: "var(--accent)",
                  }}
                  className="flex items-center justify-center text-center py-5 px-4 font-jetbrains text-[11px] tracking-[0.18em] uppercase cursor-default rounded-[6px]"
                  style={{
                    border: isLast
                      ? "1px solid rgba(201,168,76,0.3)"
                      : "1px solid rgba(255,255,255,0.1)",
                    background: isLast
                      ? "rgba(201,168,76,0.04)"
                      : "rgba(255,255,255,0.02)",
                    color: isLast ? "var(--accent)" : "var(--fg-3)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {task}
                </motion.div>
              );
            })}
          </div>
          </Reveal>

          {/* Bottom statement */}
          <Reveal delay={0.2}>
            <div className="flex items-center gap-5">
              {/* Gold vertical bar */}
              <div
                className="shrink-0 self-stretch"
                style={{
                  width: "2px",
                  minHeight: "100%",
                  background: "var(--accent)",
                  opacity: 0.85,
                  borderRadius: "2px",
                }}
              />
              <p
                className="font-serif font-bold text-[var(--fg)] leading-[1.2]"
                style={{ fontSize: "clamp(18px,2vw,28px)" }}
              >
                So what should an individual do?
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 03 — MOST DISCUSSED AI TOPICS
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative"
        style={{
          background: "#050505",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "clamp(80px,12vh,160px) 0",
        }}
      >
        <div className="shell">
          {/* Top bar: label left, counter right */}
          <Reveal>
            <div className="flex items-center justify-between mb-8">
              <span
                className="font-jetbrains font-normal text-[var(--fg-4)] tracking-[0.18em] uppercase"
                style={{ fontSize: "clamp(10px,0.85vw,12px)" }}
              >
                THE MOST DISCUSSED AI TOPICS ON LINKEDIN
              </span>
              <span
                className="font-jetbrains text-[var(--fg-5)] tracking-[0.15em]"
                style={{ fontSize: "clamp(10px,0.85vw,12px)" }}
              >
                03 / 10
              </span>
            </div>
          </Reveal>

          {/* 2×2 square cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {linkedinCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.75, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex flex-col justify-between group cursor-default"
                style={{
                  aspectRatio: "4 / 3",
                  background: "rgba(18,18,18,0.9)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  padding: "clamp(16px,2.2vw,28px)",
                  transition: "border-color 0.4s ease, background 0.4s ease",
                }}
                whileHover={{
                  borderColor: "rgba(201,168,76,0.25)",
                  background: "rgba(22,20,16,0.95)",
                }}
              >
                {/* Top-left label */}
                <span
                  className="font-jetbrains tracking-[0.3em] uppercase"
                  style={{
                    fontSize: "clamp(9px,0.75vw,11px)",
                    color: "var(--accent)",
                  }}
                >
                  CROWD {String(i + 1).padStart(2, "0")}
                </span>

                {/* Bottom content */}
                <div>
                  <h3
                    className="font-serif font-normal text-[var(--fg)] leading-[1.05] mb-3 group-hover:text-[rgba(240,241,245,0.9)] transition-colors duration-500"
                    style={{ fontSize: "clamp(20px,2.4vw,38px)" }}
                  >
                    {card.title.split("\n").map((line, j) => (
                      <span key={j} className="block">{line}</span>
                    ))}
                  </h3>
                  <p
                    className="font-serif italic leading-[1.4]"
                    style={{
                      fontSize: "clamp(12px,1vw,15px)",
                      color: "rgba(255,255,255,0.28)",
                    }}
                  >
                    {card.sub.split("\n").map((line, j) => (
                      <span key={j} className="block">{line}</span>
                    ))}
                  </p>
                </div>

                {/* Hover bottom line */}
                <div
                  aria-hidden
                  className="absolute bottom-0 left-0 w-0 h-[1px] group-hover:w-full transition-all duration-700"
                  style={{ background: "var(--accent)", opacity: 0.35 }}
                />
              </motion.div>
            ))}
          </div>

          {/* Bottom statement — gold line + italic "you" */}
          <Reveal delay={0.35}>
            <div className="flex items-center gap-5 mt-12">
              {/* Gold dash */}
              <div
                className="shrink-0"
                style={{
                  width: "40px",
                  height: "2px",
                  background: "var(--accent)",
                  opacity: 0.85,
                }}
              />
              <p
                className="font-serif font-normal text-[var(--fg)] leading-[1.2]"
                style={{ fontSize: "clamp(18px,1.8vw,26px)" }}
              >
                None of them are talking to{" "}
                <em className="italic" style={{ color: "var(--accent)" }}>you.</em>
              </p>
            </div>
          </Reveal>

          {/* Bottom-right label */}
          <Reveal delay={0.4}>
            <div className="flex justify-end mt-4">
              <span
                className="font-jetbrains tracking-[0.25em] uppercase"
                style={{ fontSize: "clamp(9px,0.75vw,11px)", color: "rgba(255,255,255,0.2)" }}
              >
                AI EDGE LAB
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 04 — AI IS NOT A TREND
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "#0a0a0a",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "clamp(80px,14vh,180px) 0",
        }}
      >
        <div className="shell relative z-10">

          {/* Line 1 — faded grey, large serif */}
          <Reveal>
            <p
              className="font-serif font-normal leading-[1.1] tracking-[-0.02em] mb-8"
              style={{
                fontSize: "clamp(28px,4.5vw,72px)",
                color: "rgba(200,200,200,0.38)",
              }}
            >
              AI is not a trend.<br />
              It is not a phase.
            </p>
          </Reveal>

          {/* Gold dash separator */}
          <Reveal delay={0.1}>
            <div
              className="mb-8"
              style={{ width: "36px", height: "2px", background: "var(--accent)", opacity: 0.9 }}
            />
          </Reveal>

          {/* Main statement — bold, mixed colour */}
          <Reveal delay={0.18}>
            <p
              className="font-serif font-bold leading-[1.0] tracking-[-0.025em] mb-12"
              style={{ fontSize: "clamp(36px,6vw,96px)" }}
            >
              <span className="text-[var(--fg)]">It is an </span>
              <em
                className="italic font-bold"
                style={{ color: "var(--accent)" }}
              >
                operating layer
              </em>
              <span className="text-[var(--fg)]"><br />of work.</span>
            </p>
          </Reveal>

          {/* Blockquote — left gold border */}
          <Reveal delay={0.28}>
            <div
              className="pl-5"
              style={{ borderLeft: "2px solid rgba(201,168,76,0.55)" }}
            >
              <p
                className="font-sans font-normal leading-[1.65]"
                style={{
                  fontSize: "clamp(16px,1.5vw,22px)",
                  color: "rgba(200,200,200,0.55)",
                  maxWidth: "42ch",
                }}
              >
                Its adoption across every organisation will only deepen and evolve. Which means —{" "}
                <strong className="font-semibold" style={{ color: "rgba(240,241,245,0.85)" }}>
                  your readiness cannot wait.
                </strong>
              </p>
            </div>
          </Reveal>

        </div>

        {/* Bottom-right label */}
        <div className="shell relative z-10 mt-16">
          <div className="flex justify-end">
            <span
              className="font-mono tracking-[0.25em] uppercase"
              style={{ fontSize: "clamp(9px,0.75vw,11px)", color: "rgba(255,255,255,0.15)" }}
            >
              AI EDGE LAB
            </span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 05 — THE GAP
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative"
        style={{
          background: "#0a0a0a",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "clamp(80px,12vh,160px) 0",
        }}
      >
        <div className="shell">

          {/* Main heading — faded grey + italic white */}
          <Reveal>
            <h2
              className="font-serif font-bold leading-[1.0] tracking-[-0.03em] mb-14"
              style={{ fontSize: "clamp(32px,5.5vw,82px)" }}
            >
              <span className="block" style={{ color: "rgba(180,180,175,0.55)" }}>Organisations have</span>
              <em className="block italic whitespace-nowrap" style={{ color: "rgba(240,241,245,0.95)", fontStyle: "italic" }}>transformation strategies.</em>
              <span className="block" style={{ color: "rgba(180,180,175,0.55)" }}>Individuals have nothing.</span>
            </h2>
          </Reveal>

          {/* Bullet rows — gold left border, thin dividers between */}
          <Reveal delay={0.15}>
            <div
              className="pl-6 mb-12"
              style={{ borderLeft: "2px solid rgba(201,168,76,0.6)" }}
            >
              {[
                { prefix: "No benchmark on ", bold: "where they stand." },
                { prefix: "No framework for ", bold: "what to protect." },
                { prefix: "No plan for ",      bold: "the next 90 days." },
              ].map((item, i) => (
                <div key={i}>
                  <p
                    className="font-serif font-normal leading-[1.3] py-5"
                    style={{
                      fontSize: "clamp(18px,2vw,28px)",
                      color: "rgba(200,200,200,0.55)",
                    }}
                  >
                    {item.prefix}
                    <strong
                      className="font-bold"
                      style={{ color: "rgba(240,241,245,0.88)" }}
                    >
                      {item.bold}
                    </strong>
                  </p>
                  {i < 2 && (
                    <div style={{ height: "1px", background: "rgba(255,255,255,0.07)" }} />
                  )}
                </div>
              ))}
            </div>
          </Reveal>

          {/* Gold closing statement */}
          <Reveal delay={0.28}>
            <p
              className="font-serif font-normal leading-[1.2]"
              style={{
                fontSize: "clamp(14px,1.3vw,18px)",
                color: "var(--accent)",
              }}
            >
              This is the gap Axion Index is built to close.
            </p>
          </Reveal>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 06 — INTRODUCING AI EDGE LAB
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "#080808",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "clamp(100px,16vh,220px) 0",
        }}
      >
        {/* Large faded BG text */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
        >
          <span
            className="font-serif font-bold leading-none whitespace-nowrap"
            style={{
              fontSize: "clamp(80px,18vw,280px)",
              color: "transparent",
              WebkitTextStroke: "1px rgba(255,255,255,0.025)",
              letterSpacing: "-0.04em",
            }}
          >
            EDGE LAB
          </span>
        </div>

        {/* Glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 65%)",
          }}
        />

        <div className="shell relative z-10 text-center">
          <Reveal>
            <span className="eyebrow eyebrow--center text-[var(--accent)] mb-8 block">
              INTRODUCING
            </span>
          </Reveal>

          <Reveal delay={0.1}>
            <h2
              className="font-serif font-normal leading-[0.95] tracking-[-0.03em] mb-10"
              style={{ fontSize: "clamp(56px,10vw,160px)" }}
            >
              <span className="text-[var(--fg)]">AI </span>
              <em className="italic" style={{ color: "var(--accent)" }}>Edge</em>
              <span className="text-[var(--fg)]"> Lab</span>
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p
              className="font-light text-[var(--fg-3)] leading-[1.65] mx-auto"
              style={{ fontSize: "clamp(15px,1.3vw,19px)", maxWidth: "52ch" }}
            >
              A pioneering individual track from Axion Index. Built for the one being impacted —
              to craft an AI-proof readiness plan that is personal, structured, and built to last.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 07 — THREE THINGS. ONE FOUNDATION.
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative"
        style={{
          background: "#050505",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "clamp(80px,12vh,160px) 0",
        }}
      >
        <div className="shell">
          {/* Label */}
          <Reveal>
            <span className="eyebrow text-[var(--accent)] mb-14 block">
              THREE THINGS. ONE FOUNDATION.
            </span>
          </Reveal>

          {/* Three rows */}
          <div className="flex flex-col" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            {threeThings.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 md:grid-cols-[80px_1fr_1fr] gap-6 md:gap-12 py-12 group"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                {/* Number */}
                <span
                  className="font-serif italic leading-none self-start pt-1"
                  style={{
                    fontSize: "clamp(28px,3vw,48px)",
                    color: "rgba(201,168,76,0.35)",
                    transition: "color 0.4s",
                  }}
                >
                  {item.num}
                </span>

                {/* Title */}
                <h3
                  className="font-serif font-normal text-[var(--fg)] leading-[1.1] self-start group-hover:text-[var(--accent)] transition-colors duration-500"
                  style={{ fontSize: "clamp(22px,2.4vw,38px)" }}
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p
                  className="text-[var(--fg-3)] leading-[1.65] self-start"
                  style={{ fontSize: "clamp(14px,1.1vw,17px)" }}
                >
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 08 — WHAT THIS CHANGES FOR YOU
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative"
        style={{
          background: "#080808",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "clamp(80px,12vh,160px) 0",
        }}
      >
        <div className="shell">
          {/* Label */}
          <Reveal>
            <span className="eyebrow text-[var(--accent)] mb-14 block">
              WHAT THIS CHANGES FOR YOU
            </span>
          </Reveal>

          {/* Transformation rows */}
          <div className="flex flex-col" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            {transformations.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 md:grid-cols-[1fr_48px_1fr] items-center gap-4 md:gap-8 py-9 group"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                {/* FROM */}
                <p
                  className="font-serif font-normal text-[var(--fg-4)] leading-[1.2] group-hover:text-[var(--fg-3)] transition-colors duration-400"
                  style={{ fontSize: "clamp(16px,1.6vw,24px)" }}
                >
                  {row.from}
                </p>

                {/* Arrow */}
                <span
                  className="font-mono text-center hidden md:block"
                  style={{ color: "rgba(201,168,76,0.5)", fontSize: "18px" }}
                >
                  →
                </span>
                <span
                  className="font-mono md:hidden"
                  style={{ color: "rgba(201,168,76,0.5)", fontSize: "14px" }}
                >
                  ↓
                </span>

                {/* TO */}
                <p
                  className="font-serif font-normal text-[var(--fg)] leading-[1.2] group-hover:text-[var(--accent)] transition-colors duration-500"
                  style={{ fontSize: "clamp(16px,1.6vw,24px)" }}
                >
                  {row.to}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 09 — FINAL STATEMENT
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "#050505",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "clamp(100px,16vh,220px) 0",
        }}
      >
        {/* Ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)",
          }}
        />

        <div className="shell relative z-10 text-center">
          <Reveal>
            <p
              className="font-serif font-normal text-[var(--fg-2)] leading-[1.05] tracking-[-0.02em] mb-6"
              style={{ fontSize: "clamp(30px,4.5vw,72px)" }}
            >
              You don&apos;t need to know everything about AI.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <p
              className="font-serif italic leading-[1.05] tracking-[-0.02em] mb-10"
              style={{
                fontSize: "clamp(30px,4.5vw,72px)",
                color: "var(--accent)",
              }}
            >
              You need to know where you stand within it.
            </p>
          </Reveal>

          <Reveal delay={0.22}>
            <p
              className="font-light text-[var(--fg-3)] leading-[1.65] mx-auto"
              style={{ fontSize: "clamp(15px,1.3vw,19px)", maxWidth: "44ch" }}
            >
              And then build your readiness — before the market decides for you.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 10 — FINAL CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "#080808",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "clamp(80px,12vh,160px) 0",
        }}
      >
        {/* Subtle top glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 w-full h-[1px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.3) 50%, transparent 100%)",
          }}
        />

        <div className="shell">
          {/* Top label */}
          <Reveal>
            <span className="eyebrow text-[var(--accent)] mb-10 block">
              AXION INDEX&nbsp;&nbsp;·&nbsp;&nbsp;INDIVIDUAL TRACK
            </span>
          </Reveal>

          {/* Main heading */}
          <Reveal delay={0.08}>
            <h2
              className="font-serif font-normal leading-[0.95] tracking-[-0.03em] mb-16"
              style={{ fontSize: "clamp(48px,8vw,130px)" }}
            >
              <span className="text-[var(--fg)]">AI </span>
              <em className="italic" style={{ color: "var(--accent)" }}>Edge</em>
              <span className="text-[var(--fg)]"> Lab</span>
            </h2>
          </Reveal>

          {/* Feature rows */}
          <div
            className="flex flex-col mb-16"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            {ctaFeatures.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 md:gap-12 py-8 group"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                <span
                  className="font-serif italic text-[var(--accent)] leading-[1.1] self-center"
                  style={{ fontSize: "clamp(20px,2vw,32px)" }}
                >
                  {feat.label}
                </span>
                <p
                  className="font-light text-[var(--fg-3)] leading-[1.5] self-center group-hover:text-[var(--fg-2)] transition-colors duration-400"
                  style={{ fontSize: "clamp(14px,1.2vw,18px)" }}
                >
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA bottom */}
          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <p
                className="font-mono text-[var(--fg-3)] tracking-[0.15em] uppercase"
                style={{ fontSize: "clamp(10px,0.9vw,12px)" }}
              >
                Opening soon. Follow for early access.
              </p>
              <motion.a
                href="#"
                whileHover={{ borderColor: "rgba(201,168,76,0.6)", color: "var(--accent)" }}
                className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-[var(--fg)] inline-flex items-center gap-3 px-6 py-3"
                style={{
                  border: "1px solid rgba(255,255,255,0.15)",
                  transition: "all 0.3s ease",
                }}
              >
                Follow Axion Index →
              </motion.a>
            </div>
          </Reveal>
        </div>

        {/* Bottom gold line */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 w-full h-[1px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.2) 50%, transparent 100%)",
          }}
        />
      </section>

    </div>
  );
}
