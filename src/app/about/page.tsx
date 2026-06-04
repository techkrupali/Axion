"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import DiagnosticModal from "@/components/DiagnosticModal";
import Footer from "@/components/Footer";
import Button from "@/components/Button";

/* ─────────────────────────────────────────
   SHARED PRIMITIVES
───────────────────────────────────────── */
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FadeIn({
  children,
  delay = 0,
  x = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  x?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Animated gold grid */
function GridBg({ id = "g1", opacity = 0.025 }: { id?: string; opacity?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" style={{ opacity }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={id} width="72" height="72" patternUnits="userSpaceOnUse">
            <path d="M 72 0 L 0 0 0 72" fill="none" stroke="rgba(201,168,76,1)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,transparent_20%,var(--bg)_100%)]" />
    </div>
  );
}

/* Floating orb */
function Orb({
  size = 500,
  color = "#C9A84C",
  opacity = 0.06,
  top = "10%",
  left = "60%",
  duration = 14,
}: {
  size?: number;
  color?: string;
  opacity?: number;
  top?: string;
  left?: string;
  duration?: number;
}) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        top,
        left,
        opacity,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        animation: `float ${duration}s ease-in-out infinite`,
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}

/* Eyebrow label */
function Eyebrow({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div className={`flex items-center gap-3 mb-6 ${center ? "justify-center" : ""}`}>
      {!center && <span className="w-6 h-[1px] bg-[var(--accent)] opacity-60 shrink-0" />}
      <span className="font-mono text-[10.5px] tracking-[0.38em] uppercase text-[var(--fg-4)]">
        {children}
      </span>
    </div>
  );
}

/* Gold CTA button */
function GoldBtn({
  href,
  onClick,
  children,
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
      {href ? (
        <Link
          href={href}
          className="inline-flex items-center gap-3 px-10 py-4 font-mono text-[11px] tracking-[0.28em] uppercase rounded-full font-semibold"
          style={{
            background: "linear-gradient(135deg,#C9A84C 0%,#E8C97A 50%,#C9A84C 100%)",
            color: "#080A0F",
            boxShadow: "0 0 40px rgba(201,168,76,0.18)",
          }}
        >
          {children}
          <ArrowRight size={13} />
        </Link>
      ) : (
        <button
          onClick={onClick}
          className="inline-flex items-center gap-3 px-10 py-4 font-mono text-[11px] tracking-[0.28em] uppercase rounded-full font-semibold"
          style={{
            background: "linear-gradient(135deg,#C9A84C 0%,#E8C97A 50%,#C9A84C 100%)",
            color: "#080A0F",
            boxShadow: "0 0 40px rgba(201,168,76,0.18)",
            cursor: "pointer",
            border: "none",
          }}
        >
          {children}
          <ArrowRight size={13} />
        </button>
      )}
    </motion.div>
  );
}

/* Ghost CTA button */
function GhostBtn({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 px-7 py-4 font-mono text-[10.5px] tracking-[0.24em] uppercase rounded-full border border-[var(--line-strong)] text-[var(--fg-3)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-300"
      style={{ boxShadow: "0 0 0 0 transparent" }}
    >
      {children}
    </Link>
  );
}

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const diagnosticQuestions = [
  "Where is your workforce structurally at risk?",
  "What will regulatory shifts do to your cost and operating model?",
  "Which parts of your organisation are resilient — and which are already obsolete?",
  "What decisions belong to HR — and which must move to the CFO and the board?",
];

const breakdownItems = [
  { num: "01", text: "Workforce models became fragmented" },
  { num: "02", text: "Compliance became interpretive" },
  { num: "03", text: "HR systems became bookkeeping layers" },
  { num: "04", text: "Decision ownership became unclear" },
];

const approachSteps = [
  { step: "01", label: "DIAGNOSE", title: "Where the system is breaking", desc: "We read the operating model before we read the org chart." },
  { step: "02", label: "CODIFY", title: "What is holding it together artificially", desc: "We surface the dependencies that live in people, not process." },
  { step: "03", label: "PREDICT", title: "What will fail next", desc: "We sequence the risk before it becomes a crisis." },
  { step: "04", label: "INSTALL", title: "Then we redesign it so it holds", desc: "We build the architecture that survives the person who built it." },
];

const differentiators = [
  "We start with risk, cost, and structure — not engagement or process",
  "We design for CFOs and boards, not just HR teams",
  "We quantify what others describe",
  "We expose what most systems hide",
];

const whoWeWorkWith = [
  {
    role: "Founder / CEO",
    statement: "See where the organisation will break — before it does.",
    detail: "You are scaling faster than the architecture underneath can carry. We read the system before it reads you.",
  },
  {
    role: "CFO",
    statement: "Read workforce as cost, risk, and control architecture — not headcount.",
    detail: "Workforce is your largest cost line and your least-read risk register. We change that.",
  },
  {
    role: "CHRO",
    statement: "Stop running HR programs. Start running the operating system underneath them.",
    detail: "The programs are symptoms. The architecture is the cause. We work at the cause.",
  },
];

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function About() {
  const [diagOpen, setDiagOpen] = useState(false);
  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ══════════════════════════════════════
          S1 — HERO
      ══════════════════════════════════════ */}
      <HeroSection />

      {/* ══════════════════════════════════════
          S2 — WHAT WE DO
      ══════════════════════════════════════ */}
      <WhatWeDoSection />

      {/* ══════════════════════════════════════
          S3 — STATEMENT
      ══════════════════════════════════════ */}
      <StatementSection />

      {/* ══════════════════════════════════════
          S4 — WHY WE EXIST
      ══════════════════════════════════════ */}
      <WhySection />

      {/* ══════════════════════════════════════
          S5 — OUR APPROACH
      ══════════════════════════════════════ */}
      <ApproachSection />

      {/* ══════════════════════════════════════
          S6 — FOUNDING PHILOSOPHY
      ══════════════════════════════════════ */}
      <PhilosophySection />

      {/* ══════════════════════════════════════
          S7 — WHAT MAKES US DIFFERENT
      ══════════════════════════════════════ */}
      <DifferentSection />

      {/* ══════════════════════════════════════
          S8 — WHO WE WORK WITH
      ══════════════════════════════════════ */}
      <WhoSection />

      {/* ══════════════════════════════════════
          S9 — END NOTE / FINAL CTA
      ══════════════════════════════════════ */}
      <EndSection onStartDiagnostic={() => setDiagOpen(true)} />

      {diagOpen && <DiagnosticModal onClose={() => setDiagOpen(false)} />}

      <Footer />
    </div>
  );
}

/* ─────────────────────────────────────────
   S1 — HERO
───────────────────────────────────────── */
function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <header ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <GridBg id="hero-grid" opacity={0.028} />
      <Orb size={700} color="#C9A84C" opacity={0.055} top="20%" left="70%" duration={16} />
      <Orb size={400} color="#4A9EFF" opacity={0.035} top="65%" left="15%" duration={20} />

      {/* Scan line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-20"
          style={{ animation: "scan-line 10s linear infinite" }}
        />
      </div>

      <motion.div style={{ y, opacity }} className="shell text-center relative z-10 pt-24">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <span className="w-8 h-[1px] bg-[var(--accent)] opacity-50" />
          <span className="font-mono text-[10.5px] tracking-[0.42em] uppercase text-[var(--accent)] opacity-80">
            AXION&nbsp;&nbsp;·&nbsp;&nbsp;ABOUT
          </span>
          <span className="w-8 h-[1px] bg-[var(--accent)] opacity-50" />
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif font-normal leading-[0.95] tracking-[-0.025em] text-[var(--fg)] mb-10"
          style={{
            fontSize: "clamp(64px, 10vw, 140px)",
            textShadow: "0 0 80px rgba(201,168,76,0.1), 0 0 200px rgba(201,168,76,0.04)",
          }}
        >
          AXION<br />
          <em className="text-[var(--accent)] italic">INDEX</em>
        </motion.h1>

        {/* Primary subtext */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-[clamp(18px,2vw,26px)] leading-[1.55] text-[var(--fg-2)] max-w-[52ch] mx-auto mb-6"
        >
          Most organisations don&apos;t fail because of strategy.<br />
          They fail because the system underneath cannot carry the strategy.
        </motion.p>

        {/* Secondary subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="text-[16px] leading-[1.75] text-[var(--fg-4)] max-w-[54ch] mx-auto mb-14"
        >
          Work today is being reshaped by three irreversible forces —
          AI compression, regulatory resets, and structural fragmentation of the workforce.
          Yet the way organisations measure, design, and operate work has not kept pace.
          <br /><br />
          <em className="text-[var(--accent)] not-italic font-medium">Axion Index exists to solve that gap.</em>
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-6"
        >
          <a
            href="#what-we-do"
            className="group inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.28em] uppercase text-[var(--fg-4)] hover:text-[var(--accent)] transition-colors duration-300"
          >
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="text-[var(--accent)] opacity-70 text-[18px]"
            >
              ↓
            </motion.span>
            Read the architecture
          </a>
        </motion.div>
      </motion.div>

      {/* Corner metadata */}
      <div className="absolute bottom-10 left-8 font-mono text-[9px] tracking-[0.35em] text-[var(--fg-5)] hidden lg:block">
        EST. 2024 · BENGALURU, INDIA
      </div>
      <div className="absolute bottom-10 right-8 font-mono text-[9px] tracking-[0.35em] text-[var(--fg-5)] hidden lg:block">
        OPERATING INTELLIGENCE
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-[var(--bg)] to-transparent pointer-events-none" />
    </header>
  );
}

/* ─────────────────────────────────────────
   S2 — WHAT WE DO
───────────────────────────────────────── */
function WhatWeDoSection() {
  return (
    <section className="relative py-[clamp(100px,14vh,180px)] bg-[var(--bg)]" id="what-we-do">
      {/* Subtle top border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--line-gold)] to-transparent" />

      <div className="shell">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-20 items-start">

          {/* LEFT — sticky context */}
          <div className="lg:sticky lg:top-32 h-fit">
            <FadeUp>
              <Eyebrow>What We Do</Eyebrow>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h2
                className="font-serif font-normal leading-[1.06] tracking-[-0.015em] text-[var(--fg)] mb-8"
                style={{ fontSize: "clamp(36px,4.2vw,58px)" }}
              >
                Is your organisation<br />
                structurally built for<br />
                <em className="italic text-[var(--accent)]">what is coming next?</em>
              </h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="text-[var(--fg-3)] leading-relaxed max-w-[34ch] mb-6 text-[17px]">
                Axion Index is an operating intelligence company focused on one question.
              </p>
            </FadeUp>
            <FadeUp delay={0.28}>
              <div className="text-[14px] text-[var(--fg-4)] leading-[1.8] max-w-[34ch] border-l border-[var(--line-gold)] pl-5">
                We do not run HR programs.<br />
                We do not implement HR systems.<br /><br />
                We diagnose, quantify, and redesign<br />the operating architecture of work.
              </div>
            </FadeUp>
          </div>

          {/* RIGHT — question cards */}
          <div className="flex flex-col gap-4 pt-2">
            <FadeUp>
              <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-[var(--fg-5)] mb-2">
                Through proprietary indices, diagnostics, and frameworks, we help organisations answer:
              </p>
            </FadeUp>

            {diagnosticQuestions.map((q, i) => (
              <FadeUp key={i} delay={0.08 + i * 0.1}>
                <motion.div
                  whileHover={{ y: -4, borderColor: "rgba(201,168,76,0.35)" }}
                  transition={{ duration: 0.3 }}
                  className="group relative overflow-hidden p-7 rounded-[24px] border border-[var(--line)] cursor-default"
                  style={{ background: "rgba(12,14,20,0.55)", backdropFilter: "blur(12px)" }}
                >
                  {/* Number */}
                  <span className="font-mono text-[10px] text-[var(--accent)] opacity-50 mb-4 block tracking-[0.3em]">
                    [ 0{i + 1} ]
                  </span>
                  <p className="font-serif text-[19px] leading-[1.45] text-[var(--fg-2)] group-hover:text-[var(--fg)] transition-colors duration-400">
                    {q}
                  </p>
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[24px]"
                    style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.06) 0%, transparent 60%)" }}
                  />
                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 h-[1px] w-0 group-hover:w-full bg-[var(--accent)] opacity-40 transition-all duration-600" />
                </motion.div>
              </FadeUp>
            ))}

            <FadeUp delay={0.5}>
              <p className="font-serif italic text-[clamp(20px,2.4vw,28px)] text-[var(--accent)] mt-4 leading-snug">
                We are Rewriting the Operating Logic of Work.
              </p>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   S3 — STATEMENT
───────────────────────────────────────── */
function StatementSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section
      ref={ref}
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: "70vh", background: "#050609" }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)" }}
      />

      {/* Horizontal lines */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--line-gold)] to-transparent opacity-60" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--line-gold)] to-transparent opacity-60" />

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
        className="shell text-center relative z-10 py-32"
      >
        <p className="font-mono text-[10.5px] tracking-[0.42em] uppercase text-[var(--accent)] opacity-60 mb-10">
          The operating thesis
        </p>
        <h2
          className="font-serif font-normal leading-[1.0] tracking-[-0.02em] text-[var(--fg)]"
          style={{
            fontSize: "clamp(42px, 7vw, 100px)",
            textShadow: "0 0 60px rgba(201,168,76,0.08)",
          }}
        >
          We are Rewriting<br />
          the Operating Logic<br />
          <em className="italic text-[var(--accent)]">of Work.</em>
        </h2>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────
   S4 — WHY WE EXIST
───────────────────────────────────────── */
function WhySection() {
  return (
    <section className="relative py-[clamp(100px,14vh,180px)] bg-[var(--bg)]" id="why">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--line)] to-transparent" />
      <Orb size={600} color="#C9A84C" opacity={0.04} top="50%" left="90%" duration={18} />

      {/* Watermark */}
      <div className="absolute right-[-8%] top-[15%] font-serif italic pointer-events-none select-none"
        style={{ fontSize: "22vw", color: "rgba(240,241,245,0.012)", lineHeight: 1 }}>
        CLARITY
      </div>

      <div className="shell">
        <div className="max-w-[860px]">
          <FadeUp>
            <Eyebrow>Why Axion Index Exists</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2
              className="font-serif font-normal leading-[1.06] tracking-[-0.015em] text-[var(--fg)] mb-16"
              style={{ fontSize: "clamp(36px,4.2vw,58px)" }}
            >
              For years, organisations optimised for<br />
              <em className="italic text-[var(--accent)]">speed, flexibility, and scale.</em>
            </h2>
          </FadeUp>

          {/* Timeline items */}
          <div className="relative mb-16">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-[var(--accent)] via-[var(--line-gold)] to-transparent opacity-40" />

            <div className="flex flex-col gap-0">
              {breakdownItems.map((item, i) => (
                <FadeIn key={i} delay={0.1 + i * 0.1} x={-20}>
                  <div className="flex items-start gap-8 py-7 group">
                    {/* Node */}
                    <div className="relative shrink-0 mt-1">
                      <motion.div
                        whileInView={{ scale: [0.6, 1.2, 1] }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                        className="w-10 h-10 rounded-full border border-[var(--line-gold)] flex items-center justify-center"
                        style={{ background: "rgba(201,168,76,0.06)" }}
                      >
                        <span className="font-mono text-[9px] text-[var(--accent)] tracking-[0.2em]">{item.num}</span>
                      </motion.div>
                    </div>
                    <div className="pt-2 border-b border-[var(--line)] pb-7 flex-1">
                      <p className="text-[18px] text-[var(--fg-3)] leading-relaxed group-hover:text-[var(--fg-2)] transition-colors duration-400">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Callout block */}
          <FadeUp delay={0.5}>
            <div
              className="relative p-10 rounded-[28px] border border-[var(--line-gold)] mb-12 overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.05) 0%, rgba(12,14,20,0.8) 100%)" }}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent)] opacity-60 rounded-l-[28px]" />
              <p
                className="font-serif leading-[1.5] text-[var(--fg-2)] mb-5"
                style={{ fontSize: "clamp(18px,2.2vw,26px)" }}
              >
                The result is a system that looks functional on the surface —<br />
                but is broken by design underneath.
              </p>
              <p className="text-[16px] text-[var(--fg-3)] leading-relaxed">
                The next phase of work will not be defined by tools.<br />
                It will be defined by operating discipline, structural clarity, and decision ownership.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.65}>
            <p
              className="font-serif italic text-[var(--accent)]"
              style={{ fontSize: "clamp(20px,2.5vw,30px)" }}
            >
              Axion Index was built to bring that clarity.
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   S5 — OUR APPROACH
───────────────────────────────────────── */
function ApproachSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="relative py-[clamp(100px,14vh,180px)]" style={{ background: "#050609" }} id="approach">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--line-gold)] to-transparent opacity-50" />
      <GridBg id="approach-grid" opacity={0.018} />
      <Orb size={500} color="#4A9EFF" opacity={0.03} top="30%" left="80%" duration={22} />

      <div className="shell">
        {/* Header */}
        <div className="mb-20">
          <FadeUp>
            <Eyebrow>Our Approach</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2
              className="font-serif font-normal leading-[1.06] tracking-[-0.015em] text-[var(--fg)] mb-6"
              style={{ fontSize: "clamp(36px,4.2vw,58px)" }}
            >
              We don&apos;t explore the<br />
              <em className="italic text-[var(--accent)]">problem.</em>
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="font-serif italic text-[clamp(18px,2vw,24px)] text-[var(--fg-3)] max-w-[42ch] leading-tight">
              We map the architecture that carries the consequence.
            </p>
          </FadeUp>
        </div>

        {/* Interactive step grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 items-start">

          {/* Step selector */}
          <div className="flex flex-col gap-3">
            {approachSteps.map((item, i) => (
              <FadeIn key={i} delay={i * 0.08} x={-16}>
                <motion.button
                  onClick={() => setActive(i)}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.25 }}
                  className={`w-full text-left p-6 rounded-[20px] border transition-all duration-400 group ${
                    active === i
                      ? "border-[var(--line-gold)] bg-[rgba(201,168,76,0.06)]"
                      : "border-[var(--line)] bg-transparent hover:border-[var(--line-strong)]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`font-mono text-[10px] tracking-[0.35em] transition-colors duration-300 ${
                        active === i ? "text-[var(--accent)]" : "text-[var(--fg-5)]"
                      }`}
                    >
                      {item.label}
                    </span>
                    <span className="font-serif italic text-[22px] text-[var(--fg-5)] opacity-40">{item.step}</span>
                  </div>
                  <h3
                    className={`font-serif text-[18px] leading-snug mt-2 transition-colors duration-300 ${
                      active === i ? "text-[var(--fg)]" : "text-[var(--fg-3)]"
                    }`}
                  >
                    {item.title}
                  </h3>
                </motion.button>
              </FadeIn>
            ))}
          </div>

          {/* Detail panel */}
          <div className="lg:sticky lg:top-32 h-fit">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative p-12 rounded-[32px] border border-[var(--line-gold)] overflow-hidden"
                style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.06) 0%, rgba(8,10,15,0.9) 100%)" }}
              >
                {/* Big number watermark */}
                <div
                  className="absolute right-8 top-4 font-serif italic pointer-events-none select-none"
                  style={{ fontSize: "120px", color: "rgba(201,168,76,0.06)", lineHeight: 1 }}
                >
                  {approachSteps[active].step}
                </div>

                <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[var(--accent)] opacity-60 block mb-6">
                  {approachSteps[active].label}
                </span>
                <h3
                  className="font-serif leading-[1.15] text-[var(--fg)] mb-6"
                  style={{ fontSize: "clamp(24px,3vw,38px)" }}
                >
                  {approachSteps[active].title}
                </h3>
                <p className="text-[16px] text-[var(--fg-3)] leading-relaxed mb-10 max-w-[40ch]">
                  {approachSteps[active].desc}
                </p>

                {/* Step dots */}
                <div className="flex items-center gap-3">
                  {approachSteps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`transition-all duration-300 rounded-full ${
                        i === active
                          ? "w-8 h-2 bg-[var(--accent)]"
                          : "w-2 h-2 bg-[var(--fg-5)] hover:bg-[var(--fg-4)]"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <FadeUp delay={0.4}>
              <div className="mt-8 text-center">
                <Link
                  href="/#bridge"
                  className="inline-flex items-center gap-2 font-mono text-[10.5px] tracking-[0.24em] uppercase text-[var(--fg-4)] hover:text-[var(--accent)] transition-colors duration-300"
                >
                  See how we work
                  <ArrowRight size={12} />
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   S6 — FOUNDING PHILOSOPHY
───────────────────────────────────────── */
function PhilosophySection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref} className="relative overflow-hidden" style={{ minHeight: "90vh", background: "#080A0F" }} id="philosophy">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--line-gold)] to-transparent opacity-60" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--line-gold)] to-transparent opacity-60" />

      {/* Parallax glow */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)" }}
        />
      </motion.div>

      <div className="shell relative z-10 flex flex-col items-center justify-center py-40 text-center">
        <FadeUp>
          <Eyebrow center>Founding Philosophy</Eyebrow>
        </FadeUp>

        {/* BCR flow */}
        <FadeUp delay={0.1}>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 mb-20">
            {["Belief", "Conviction", "Rhythm"].map((label, i) => (
              <div key={i} className="flex items-center gap-6 md:gap-12">
                <motion.span
                  whileHover={{ color: "var(--accent)" }}
                  transition={{ duration: 0.3 }}
                  className="font-serif text-[var(--fg)] cursor-default"
                  style={{ fontSize: "clamp(32px,5vw,64px)", lineHeight: 1 }}
                >
                  {label}
                </motion.span>
                {i < 2 && (
                  <span className="text-[var(--accent)] opacity-30 text-[28px] font-light">→</span>
                )}
              </div>
            ))}
          </div>
        </FadeUp>

        {/* Divider */}
        <FadeUp delay={0.25}>
          <div className="w-24 h-[1px] bg-[var(--accent)] opacity-30 mx-auto mb-20" />
        </FadeUp>

        {/* Quote lines */}
        <div className="flex flex-col gap-8 max-w-[640px] mx-auto mb-16">
          {[
            { text: "Architecture is not designed in presentations.", delay: 0.3 },
            { text: "It is read in signals.", delay: 0.42 },
          ].map((item, i) => (
            <FadeUp key={i} delay={item.delay}>
              <p
                className="font-serif italic text-[var(--fg-2)] leading-[1.3]"
                style={{ fontSize: "clamp(22px,3vw,38px)" }}
              >
                {item.text}
              </p>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.55}>
          <p className="text-[16px] text-[var(--fg-4)] leading-relaxed max-w-[46ch] mx-auto">
            We don&apos;t sell services. We read what is already breaking — and build what must hold.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   S7 — WHAT MAKES US DIFFERENT
───────────────────────────────────────── */
function DifferentSection() {
  return (
    <section className="relative py-[clamp(100px,14vh,180px)] bg-[var(--bg)]" id="different">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--line)] to-transparent" />
      <Orb size={500} color="#C9A84C" opacity={0.04} top="60%" left="5%" duration={20} />

      <div className="shell">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-20 items-start">

          {/* LEFT — sticky */}
          <div className="lg:sticky lg:top-32 h-fit">
            <FadeUp>
              <Eyebrow>What Makes Us Different</Eyebrow>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h2
                className="font-serif font-normal leading-[1.06] tracking-[-0.015em] text-[var(--fg)] mb-8"
                style={{ fontSize: "clamp(36px,4.2vw,58px)" }}
              >
                A new category of<br />
                <em className="italic text-[var(--accent)]">operating intelligence.</em>
              </h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="flex flex-col gap-3 text-[14px] text-[var(--fg-4)] leading-[1.8]">
                <p className="line-through opacity-50">Axion Index is not an HR advisory firm.</p>
                <p className="line-through opacity-50">It is not a SaaS product.</p>
                <p className="line-through opacity-50">It is not a benchmarking report.</p>
                <p className="text-[var(--accent)] not-line-through opacity-100 mt-2 font-medium">
                  It is a new category of operating intelligence.
                </p>
              </div>
            </FadeUp>
          </div>

          {/* RIGHT — differentiator list */}
          <div className="flex flex-col gap-0">
            {differentiators.map((item, i) => (
              <FadeIn key={i} delay={0.1 + i * 0.1} x={24}>
                <motion.div
                  whileHover={{ backgroundColor: "rgba(201,168,76,0.025)", x: 4 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-6 py-8 border-b border-[var(--line)] group cursor-default rounded-lg px-4 -mx-4"
                >
                  {/* Animated number */}
                  <div className="shrink-0 mt-1">
                    <div
                      className="w-9 h-9 rounded-full border border-[var(--line-gold)] flex items-center justify-center group-hover:border-[var(--accent)] group-hover:bg-[var(--accent-soft)] transition-all duration-400"
                    >
                      <span className="font-mono text-[9px] text-[var(--accent)] tracking-[0.2em]">0{i + 1}</span>
                    </div>
                  </div>
                  <p className="text-[18px] text-[var(--fg-3)] group-hover:text-[var(--fg)] transition-colors duration-400 leading-relaxed pt-1">
                    {item}
                  </p>
                  <ArrowRight
                    size={14}
                    className="shrink-0 mt-2 text-[var(--accent)] opacity-0 group-hover:opacity-60 transition-opacity duration-300 ml-auto"
                  />
                </motion.div>
              </FadeIn>
            ))}

            <FadeUp delay={0.55}>
              <p
                className="font-serif italic text-[var(--fg-2)] pt-10 leading-snug"
                style={{ fontSize: "clamp(16px,1.8vw,22px)" }}
              >
                Where others optimise the visible layer,<br />
                we rebuild the system underneath.
              </p>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   S8 — WHO WE WORK WITH
───────────────────────────────────────── */
function WhoSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="relative py-[clamp(100px,14vh,180px)]" style={{ background: "#050609" }} id="who">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--line-gold)] to-transparent opacity-50" />
      <GridBg id="who-grid" opacity={0.016} />
      <Orb size={600} color="#C9A84C" opacity={0.04} top="50%" left="50%" duration={24} />

      <div className="shell">
        <div className="mb-20">
          <FadeUp>
            <Eyebrow>Who We Work With</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2
              className="font-serif font-normal leading-[1.06] tracking-[-0.015em] text-[var(--fg)]"
              style={{ fontSize: "clamp(36px,4.2vw,58px)" }}
            >
              Who we engage with{" "}
              <em className="italic text-[var(--accent)]">depending on where you sit.</em>
            </h2>
          </FadeUp>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {whoWeWorkWith.map((item, i) => (
            <FadeUp key={i} delay={0.1 + i * 0.12}>
              <motion.div
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-[28px] border p-8 flex flex-col gap-6 cursor-default h-full"
                style={{
                  background: hovered === i
                    ? "linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(8,10,15,0.95) 100%)"
                    : "rgba(12,14,20,0.6)",
                  borderColor: hovered === i ? "rgba(201,168,76,0.35)" : "rgba(240,241,245,0.06)",
                  backdropFilter: "blur(16px)",
                  boxShadow: hovered === i ? "0 32px 64px rgba(0,0,0,0.5), 0 0 40px rgba(201,168,76,0.06)" : "none",
                  transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                {/* Role badge */}
                <div>
                  <span
                    className="inline-block font-mono text-[9.5px] tracking-[0.35em] uppercase px-4 py-2 rounded-full border"
                    style={{
                      color: "var(--accent)",
                      borderColor: "rgba(201,168,76,0.25)",
                      background: "rgba(201,168,76,0.06)",
                    }}
                  >
                    {item.role}
                  </span>
                </div>

                {/* Statement */}
                <p
                  className="font-serif leading-[1.35] text-[var(--fg-2)]"
                  style={{ fontSize: "clamp(18px,1.8vw,22px)" }}
                >
                  {item.statement}
                </p>

                {/* Detail */}
                <p className="text-[14px] text-[var(--fg-4)] leading-relaxed mt-auto">
                  {item.detail}
                </p>

                {/* Bottom accent */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-[28px] transition-opacity duration-400"
                  style={{
                    background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
                    opacity: hovered === i ? 0.5 : 0,
                  }}
                />

                {/* Corner glow */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 pointer-events-none rounded-[28px] transition-opacity duration-400"
                  style={{
                    background: "radial-gradient(circle at top right, rgba(201,168,76,0.08), transparent 70%)",
                    opacity: hovered === i ? 1 : 0,
                  }}
                />
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   S9 — END NOTE / FINAL CTA
───────────────────────────────────────── */
function EndSection({ onStartDiagnostic }: { onStartDiagnostic: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden flex items-center justify-center"
      style={{ minHeight: "100vh", background: "var(--bg)" }}
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--line-gold)] to-transparent opacity-60" />

      {/* Layered glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 65%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)" }} />
      </div>

      <GridBg id="end-grid" opacity={0.02} />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
        className="shell text-center relative z-10 py-32"
      >
        {/* Brand watermark */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif font-bold pointer-events-none select-none whitespace-nowrap"
          style={{
            fontSize: "clamp(80px,18vw,260px)",
            color: "rgba(201,168,76,0.025)",
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
        >
          AXION
        </div>

        {/* Eyebrow */}
        <FadeUp>
          <div className="flex items-center justify-center gap-3 mb-12">
            <span className="w-10 h-[1px] bg-[var(--accent)] opacity-40" />
            <span className="font-mono text-[10.5px] tracking-[0.42em] uppercase text-[var(--accent)] opacity-70">
              AXION INDEX
            </span>
            <span className="w-10 h-[1px] bg-[var(--accent)] opacity-40" />
          </div>
        </FadeUp>

        {/* Main heading */}
        <FadeUp delay={0.1}>
          <h2
            className="font-serif font-normal leading-[1.0] tracking-[-0.02em] text-[var(--fg)] mb-10"
            style={{
              fontSize: "clamp(48px,8vw,110px)",
              textShadow: "0 0 80px rgba(201,168,76,0.08)",
            }}
          >
            From <s className="opacity-25 line-through">ambiguity</s><br />
            to <em className="italic text-[var(--accent)]">architecture.</em>
          </h2>
        </FadeUp>

        {/* Sub-lines */}
        <FadeUp delay={0.22}>
          <div className="flex flex-col items-center gap-3 mb-16">
            {[
              "From compliance to control.",
              "From systems to operating intelligence.",
            ].map((line, i) => (
              <p
                key={i}
                className="font-serif italic text-[var(--fg-3)]"
                style={{ fontSize: "clamp(16px,1.8vw,22px)" }}
              >
                {line}
              </p>
            ))}
          </div>
        </FadeUp>

        {/* CTAs */}
        <FadeUp delay={0.35}>
          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={onStartDiagnostic} variant="primary" showArrow={true}>Start Diagnostic</Button>
            <Button href="/founder" variant="secondary" showArrow={true}>Read about the founder</Button>
          </div>
        </FadeUp>

        {/* Bottom metadata */}
        <FadeUp delay={0.5}>
          <div className="mt-24 flex flex-wrap justify-center gap-8 font-mono text-[9.5px] tracking-[0.35em] uppercase text-[var(--fg-5)]">
            <span>Bengaluru, India</span>
            <span className="text-[var(--line-gold)]">·</span>
            <span>Est. 2024</span>
            <span className="text-[var(--line-gold)]">·</span>
            <a href="mailto:office@axionindex.com" className="hover:text-[var(--accent)] transition-colors">
              office@axionindex.com
            </a>
            <span className="text-[var(--line-gold)]">·</span>
            <a href="https://www.linkedin.com/in/nahatanitin" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">
              linkedin.com/in/nahatanitin
            </a>
          </div>
        </FadeUp>
      </motion.div>
    </section>
  );
}
