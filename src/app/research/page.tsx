import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import Button from "@/components/Button";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Research & Journals — Coming soon · Axion Index",
  description: "Working papers, field notes and journals from Axion Index. Coming soon.",
};

// Same practice descriptors as the navbar's Practice Areas menu
const streams = [
  { practice: "People Architecture", topics: "BCR · Structure · Signalling" },
  { practice: "Labour Codes", topics: "Cost · Classification · Compliance" },
  { practice: "AI Edge Lab", topics: "Judgement · Architecture · Governance" },
  { practice: "Family Business", topics: "Ownership · Succession · Institution" },
];

export default function ResearchPage() {
  return (
    <div className="min-h-screen">
      {/* HERO — coming soon banner */}
      <header className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-research" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(201,168,76,1)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-research)" />
          </svg>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_30%,var(--bg)_100%)]" />
        </div>
        <div
          className="absolute top-[18%] left-[18%] w-[460px] h-[460px] rounded-full opacity-[0.05] pointer-events-none"
          style={{ background: "radial-gradient(circle, #C9A24A 0%, transparent 70%)", animation: "float 14s ease-in-out infinite" }}
        />

        <div className="shell text-center relative z-10 pt-28 pb-16">
          <Reveal>
            <div className="eyebrow eyebrow--center mb-8 text-[var(--accent)]">AXION&nbsp;&nbsp;·&nbsp;&nbsp;RESEARCH &amp; JOURNALS</div>
          </Reveal>

          <Reveal delay={0.1}>
            <span className="inline-flex items-center gap-3 px-5 py-2.5 mb-10 rounded-full border border-[var(--line-gold)] bg-[rgba(201,162,74,0.06)] font-mono text-[11px] tracking-[0.3em] uppercase text-[var(--accent)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-60 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
              </span>
              Coming soon
            </span>
          </Reveal>

          <Reveal delay={0.15}>
            <h1 className="mb-8">
              <span className="block font-serif font-normal text-[clamp(34px,4.8vw,68px)] leading-[1.1] tracking-[-0.01em] text-[var(--fg)]">
                Research &amp; Journals.
              </span>
              <em className="block font-serif font-medium italic text-[clamp(26px,3.4vw,48px)] leading-[1.2] tracking-[-0.01em] text-[var(--accent)] mt-2">
                The first editions are on their way.
              </em>
            </h1>
          </Reveal>

          <Reveal delay={0.25}>
            <p className="lead mx-auto mb-12 text-[var(--fg-3)] max-w-[54ch]">
              Working papers, field notes and long-form journals from Axion Index — on people architecture,
              labour codes, AI and family enterprise. This page goes live with the first publication.
            </p>
          </Reveal>

          <Reveal delay={0.35}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button href="/?diagnostic=1" variant="primary" showArrow>Start Diagnostic</Button>
              <Button href="/connect" variant="secondary">Reach Us</Button>
            </div>
          </Reveal>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[25vh] bg-gradient-to-t from-[var(--bg)] to-transparent pointer-events-none" />
      </header>

      {/* WHAT'S COMING */}
      <section className="relative pb-28">
        <div className="shell">
          <Reveal>
            <div className="eyebrow mb-10 text-[var(--accent)]">In preparation</div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {streams.map((s, i) => (
              <Reveal key={s.practice} delay={i * 0.08} className="h-full">
                <div className="h-full p-7 rounded-2xl border border-[var(--line)] bg-[rgba(255,255,255,0.02)] hover:border-[var(--line-gold)] transition-colors duration-300">
                  <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--fg-5)]">
                    {String(i + 1).padStart(2, "0")}&nbsp;&nbsp;·&nbsp;&nbsp;Coming soon
                  </span>
                  <h3 className="font-serif text-[22px] leading-tight text-[var(--fg)] mt-5 mb-3">{s.practice}</h3>
                  <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--fg-4)]">{s.topics}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
