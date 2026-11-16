"use client";

import { Reveal } from "@/components/Reveal";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { ConversationFlow } from "@/components/DiagnosticModal";
import { CONVERSATION_INVITE } from "@/config/nav";
import { PUBLIC_EMAIL } from "@/config/contact";

const sidebarItems = [
  { label: "Email", content: <a href={`mailto:${PUBLIC_EMAIL}`} className="font-serif text-[18px] text-[var(--fg)] hover:text-[var(--accent)] transition-colors duration-300 block break-words">{PUBLIC_EMAIL}</a> },
  { label: "Press & speaking", content: <p className="text-[14px] leading-[1.65] text-[var(--fg-4)]">Press, speaking and editorial requests via the same channel — please mark the subject line accordingly.</p> },
  { label: "On discretion", content: <p className="text-[14px] leading-[1.65] text-[var(--fg-4)]">Axion Index works with founders, boards and CHROs in regulated and family-held contexts. References, case material, and engagement details are not published on the website. They are shared on request, where relevant.</p> },
  { label: "What we don't do", content: <p className="text-[14px] leading-[1.65] text-[var(--fg-4)]">Recruiting · payroll · vendor management · executive coaching · culture surveys · &ldquo;engagement&rdquo; programs.</p> },
];

export default function Connect() {
  return (
    <div className="min-h-screen overflow-x-clip">

      {/* HERO */}
      <header className="relative flex items-center justify-center overflow-hidden pt-36 sm:pt-44 pb-10 sm:pb-14">
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-connect" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(201,162,74,1)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-connect)" />
          </svg>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_30%,var(--bg)_100%)]" />
        </div>
        <div className="absolute top-[20%] right-[20%] w-[500px] h-[500px] rounded-full opacity-[0.04] pointer-events-none"
          style={{ background: "radial-gradient(circle, #C9A24A 0%, transparent 70%)", animation: "float 14s ease-in-out infinite" }} />

        <div className="shell text-center relative z-10">
          <Reveal>
            <div className="eyebrow eyebrow--center mb-10 text-[var(--accent)]">AXION&nbsp;&nbsp;·&nbsp;&nbsp;CONNECT</div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="hero-glow mb-8">
              <span className="block font-serif font-normal text-[clamp(28px,3.5vw,52px)] leading-[1.15] tracking-[-0.01em] text-[var(--fg-2)] mb-2">
                Begin a conversation.
              </span>
              <em className="block font-serif font-medium text-[clamp(28px,3.5vw,52px)] leading-[1.15] tracking-[-0.01em] text-[var(--accent)] italic">
                From ambiguity to architecture.
              </em>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="lead mx-auto mb-14 text-[var(--fg-3)] max-w-[50ch]">
              {CONVERSATION_INVITE}
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <a className="kbd-arrow text-[var(--fg-4)] hover:text-[var(--accent)]" href="#form">
              Start the conversation
            </a>
          </Reveal>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[var(--bg)] to-transparent pointer-events-none" />
      </header>

      {/* FORM + SIDEBAR */}
      <section className="section-dark relative pt-8 sm:pt-12 pb-[var(--chap)] scroll-mt-24" id="form">
        <div className="shell">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-16 lg:gap-24">

            {/* FORM */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="min-w-0"
            >
              <div className="mb-8">
                <span className="eyebrow mb-4 text-[var(--accent)]">Start a conversation</span>
                <p className="text-[15px] text-[var(--fg-4)] mt-3 leading-relaxed">
                  Three short steps: the signals you are seeing, where you sit, and how to reach you. Read only by the founder.
                </p>
              </div>
              {/* The same form every "Start a conversation" button opens (Fix Brief Part 4, item 14) */}
              <div
                className="rounded-[28px] overflow-hidden"
                style={{ background: "rgba(10,12,18,0.98)", border: "1px solid rgba(201,162,74,0.35)" }}
              >
                <ConversationFlow variant="inline" />
              </div>
            </motion.div>

            {/* SIDEBAR */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="flex flex-col gap-4"
            >
              {sidebarItems.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ borderColor: "var(--line-gold)" }}
                  transition={{ duration: 0.3 }}
                  className="p-7 glass-card"
                >
                  <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--accent)] opacity-60 block mb-3">{item.label}</span>
                  {item.content}
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
