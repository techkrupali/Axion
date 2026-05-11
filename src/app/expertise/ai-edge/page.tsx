"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const AIEdgeThreeScene = dynamic(() => import("@/components/AIEdgeThreeScene"), { ssr: false });

const actors = [
  {
    num: "01",
    name: "The work that holds judgment",
    desc: "Architectural intent, taste, the shape of the question itself. This work cannot be replaced by tooling — only amplified or starved. As cognitive cost falls, this is the work that compounds in value.",
    stake: "Architecture & taste",
  },
  {
    num: "02",
    name: "The work that produces output",
    desc: "Translating intent into deliverables. The most exposed to substitution — and the most often defended out of habit. The right move is to redesign it upward toward judgment work, not insulate it.",
    stake: "Throughput & quality",
  },
  {
    num: "03",
    name: "The work that keeps the envelope",
    desc: "Lawful, ethical, reputational containment. Invisible until something breaks. Codifying this layer is half the diagnostic — most organisations are running on a steward function nobody has named.",
    stake: "Integrity & risk",
  },
  {
    num: "04",
    name: "The work that is no longer human",
    desc: "Models, agents, pipelines. They act with consequence, but the organisation has not issued them accountability. They must be governed like a role, not configured like a tool.",
    stake: "Scale & velocity",
  },
];

const laws = [
  {
    num: "I",
    title: "The Law of Judgment Compression",
    body: "As cognitive cost falls toward zero, the value of human judgment rises non-linearly. The architecture that wins is the one that puts judgment closest to consequence — not the one that automates the most.",
    verdict: "Move judgment toward the edges of the system, not the centre.",
  },
  {
    num: "II",
    title: "The Law of Accountability Lag",
    body: "Synthetic actors gain authority faster than the organisation issues accountability. The gap is where institutional risk lives. Closing it is the steward's job — and it cannot be retrofitted.",
    verdict: "Issue accountability before authority. Always.",
  },
  {
    num: "III",
    title: "The Law of Architectural Inheritance",
    body: "The model an organisation deploys inherits the operating model it deploys it inside. Bad architecture amplifies, not heals. AI does not fix a broken system; it makes the breakage faster and harder to see.",
    verdict: "Fix the operating model first. Deploy second.",
  },
];

const edgeSteps = [
  { letter: "E", step: "01", name: "Examine", desc: "Map the existing operating model — actors, judgments, decision rights, where consequence actually lands." },
  { letter: "D", step: "02", name: "Decompose", desc: "Break each role into the four actors. Surface where executor work has crowded out operator work." },
  { letter: "G", step: "03", name: "Govern", desc: "Issue accountability for synthetic actors. Build the steward layer before the deployment runs hot." },
  { letter: "E", step: "04", name: "Embed", desc: "Re-install the operating model. Move judgment to the edges. Redesign executor roles upward, not sideways." },
];

export default function AIEdgeLab() {
  return (
    <div className="min-h-screen">
      <AIEdgeThreeScene />

      {/* HERO — full viewport */}
      <header className="relative min-h-screen flex items-center justify-center bg-transparent pt-20 overflow-hidden">
        <div className="shell text-center relative z-10">
          <Reveal>
            <div className="eyebrow eyebrow--center mb-8 text-[var(--accent)]">AXION&nbsp;&nbsp;·&nbsp;&nbsp;AI EDGE LAB</div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="h-display hero-glow leading-[0.95] mb-8 drop-shadow-2xl">
              AI doesn't disrupt jobs.<br />
              <em className="text-[var(--accent)]">It disrupts judgment.</em>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="lead mx-auto mb-12 opacity-90 text-[var(--fg-2)] max-w-[52ch]">
              Most AI-and-work conversations are pitched at the wrong altitude tooling adoption, productivity uplift, headcount math. The real question is what happens to the architecture of human judgment when the cognitive layer underneath it changes.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-col items-center gap-10">
              <Link
                href="/connect?practice=ai-edge-lab"
                className="nav-cta scale-125 px-12 py-5 bg-[var(--fg)] text-[var(--bg)] border-none hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                Begin a Diagnostic
              </Link>
              <a className="kbd-arrow text-[var(--fg-3)] hover:text-[var(--accent)]" href="#actors">
                Read the three laws
              </a>
            </div>
          </Reveal>
        </div>

        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(160,160,160,0.03)_0%,transparent_50%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-[#06070B] to-transparent pointer-events-none" />
      </header>

      {/* SURGICAL POSTURE CALLOUT */}
      <section className="chapter section-dark relative overflow-hidden">
        <div className="shell">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <Reveal>
                <span className="eyebrow mb-6 text-[var(--accent)]">Surgical posture</span>
              </Reveal>
              <h2 className="h-section mb-8">
                The diagnostic comes<br />
                <em className="text-[var(--accent)]">before the conversation.</em>
              </h2>
              <p className="body-text text-[var(--fg-3)] mb-10">
                This is the only practice where the diagnostic comes before the conversation. We do not generalise, we operate on specifics.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/connect?practice=ai-edge-lab"
                  className="nav-cta bg-[var(--fg)] text-[var(--bg)] border-none hover:bg-[var(--accent)] transition-all duration-500"
                >
                  Begin a Diagnostic
                </Link>
                <a href="#laws" className="nav-cta">Read the three laws</a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="cool-card"
            >
              <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--accent)] mb-6 block opacity-60">The defining shift</span>
              <p className="font-serif text-[20px] leading-[1.55] text-[var(--fg-2)] italic mb-8">
                The question is not &ldquo;does AI replace people&rdquo;. The question is whether your operating model still makes sense once judgment, taste and architecture are the only things humans uniquely do.
              </p>
              <div className="pt-6 border-t border-[var(--line)] font-mono text-[10px] tracking-widest uppercase text-[var(--fg-4)]">
                From the AI Edge Lab doctrine
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHO THIS IS FOR */}
      <section className="chapter section-deep relative" id="audience">
        <div className="shell">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-20 items-start">
            <div className="lg:sticky lg:top-32 h-fit">
              <Reveal><span className="eyebrow mb-6 text-[var(--accent)]">Who this is for</span></Reveal>
              <Reveal delay={0.1}>
                <h2 className="h-section mb-8">
                  Different stakes.<br />
                  <em className="text-[var(--accent)]">One question.</em>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="body-text text-[var(--fg-3)]">
                  AI Edge Lab is the entry point for anyone whose work is changing faster than their role.
                </p>
              </Reveal>
            </div>

            <div className="flex flex-col border-t border-[rgba(255,255,255,0.05)]">
              {[
                "Leaders navigating AI-led change.",
                "Professionals redesigning their work.",
                "Individuals building future-proof capability.",
                "Students preparing for an AI-shaped economy.",
              ].map((text, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
                  className="py-10 border-b border-[rgba(255,255,255,0.05)] group hover:bg-[rgba(255,255,255,0.01)] transition-colors px-4 -mx-4"
                >
                  <span className="font-mono text-[10px] tracking-[0.4em] text-[var(--accent)] mb-3 block opacity-60">[ 0{i + 1} ]</span>
                  <p className="font-serif text-[clamp(18px,2vw,26px)] leading-[1.3] text-[var(--fg-2)] group-hover:text-[var(--fg)] transition-colors duration-500">
                    {text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOUR ACTORS */}
      <section className="chapter section-dark relative overflow-hidden" id="actors">
        <div className="shell">
          <div className="mb-20">
            <Reveal><span className="eyebrow mb-6 text-[var(--accent)]">How AI reshapes work</span></Reveal>
            <Reveal delay={0.1}>
              <h2 className="h-section max-w-[22ch]">
                Stop counting heads.<br />
                <em className="text-[var(--accent)]">Start reading the four roles.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="lead text-[var(--fg-3)] mt-6">
                Inside an AI-shaped operating model, work divides into who holds judgment, who produces output, who keeps the system inside its envelope, and what now acts without accountability.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {actors.map((actor, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
                className="cool-card group"
              >
                <div className="font-mono text-[10px] tracking-[0.4em] text-[var(--accent)] mb-6 opacity-60">[ {actor.num} ]</div>
                <h3 className="font-serif text-[clamp(20px,2vw,28px)] mb-4 group-hover:text-[var(--accent)] transition-colors duration-500">
                  {actor.name}
                </h3>
                <p className="text-[15px] text-[var(--fg-3)] leading-relaxed mb-6">{actor.desc}</p>
                <div className="mt-auto pt-4 border-t border-[var(--line)] font-mono text-[10px] tracking-widest uppercase text-[var(--fg-4)]">
                  Stake · {actor.stake}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* THREE LAWS */}
      <section className="chapter section-deep relative" id="laws">
        <div className="shell">
          <div className="mb-20">
            <Reveal><span className="eyebrow mb-6 text-[var(--accent)]">The three laws</span></Reveal>
            <Reveal delay={0.1}>
              <h2 className="h-section">
                Three laws.<br />
                <em className="text-[var(--accent)]">In sequence.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="lead text-[var(--fg-3)] mt-6 max-w-[48ch]">
                Each law constrains the next. Skip one and the architecture you build will not survive contact with the wave.
              </p>
            </Reveal>
          </div>

          <div className="flex flex-col">
            {laws.map((law, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
                className="grid grid-cols-1 md:grid-cols-[120px_1fr_280px] gap-8 md:gap-12 py-14 border-b border-[rgba(255,255,255,0.05)] group items-start"
              >
                <div className="font-serif italic text-[80px] text-[var(--accent)] leading-[0.85] opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                  {law.num}
                </div>
                <div>
                  <h3 className="font-serif text-[clamp(22px,2.4vw,34px)] font-medium leading-[1.1] text-[var(--fg)] mb-4 group-hover:text-[var(--accent)] transition-colors duration-500">
                    {law.title}
                  </h3>
                  <p className="text-[16px] leading-[1.65] text-[var(--fg-3)] max-w-[52ch]">{law.body}</p>
                </div>
                <div className="self-start p-6 font-mono text-[11px] tracking-widest uppercase leading-[1.6] bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(160,160,160,0.3)] transition-colors duration-500">
                  <strong className="block mb-2 font-semibold text-[var(--accent)] opacity-70">Verdict</strong>
                  <span className="text-[var(--fg-2)]">{law.verdict}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* E.D.G.E. METHOD */}
      <section className="chapter section-dark relative overflow-hidden" id="edge">
        <div className="shell">
          <div className="mb-20">
            <Reveal><span className="eyebrow mb-6 text-[var(--accent)]">The E.D.G.E. method</span></Reveal>
            <Reveal delay={0.1}>
              <h2 className="h-section">
                How a diagnostic<br />
                <em className="text-[var(--accent)]">actually runs.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="lead text-[var(--fg-3)] mt-6">
                Examine. Decompose. Govern. Embed. Each step ends in an artefact, not a slide.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {edgeSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
                className="cool-card group relative overflow-hidden"
              >
                <span className="absolute right-4 top-2 font-serif italic text-[80px] text-[var(--accent)] leading-[0.85] opacity-10 pointer-events-none select-none">
                  {step.letter}
                </span>
                <span className="font-mono text-[10px] tracking-[0.4em] text-[var(--accent)] mb-4 block opacity-60">Step {step.step}</span>
                <h4 className="font-serif text-[26px] font-medium text-[var(--fg)] mb-3 group-hover:text-[var(--accent)] transition-colors duration-500">
                  {step.name}
                </h4>
                <p className="text-[14px] leading-[1.6] text-[var(--fg-3)]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ENGAGEMENT MODEL */}
      <section className="chapter section-deep relative overflow-hidden">
        <div className="shell">
          <div className="max-w-[720px] mx-auto text-center">
            <Reveal>
              <span className="eyebrow eyebrow--center mb-6 text-[var(--accent)]">Engagement model</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="h-section mb-8">
                A diagnostic,<br />
                <em className="text-[var(--accent)]">not a deck.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="lead text-[var(--fg-3)] mb-12 mx-auto">
                AI Edge Lab does not run discovery calls. The diagnostic is the engagement — a 4–6 week deep dive into one operating model under stress, ending in an architectural verdict and a sequenced redesign.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-wrap justify-center gap-4 mb-20">
                <Link
                  href="/connect?practice=ai-edge-lab"
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
