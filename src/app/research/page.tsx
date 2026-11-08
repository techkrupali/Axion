import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import Button from "@/components/Button";
import Footer from "@/components/Footer";
import { REPORT, reportLink } from "@/config/report";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Research & Journals",
  description: `Research and journals from Axion Index. ${REPORT.edition}: the ${REPORT.name}, ${REPORT.published ? "out now" : `releasing ${REPORT.releaseLong}`}.`,
  path: "/research",
});

export default function ResearchPage() {
  return (
    <div className="min-h-screen">
      {/* HERO */}
      <header className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
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

        <div className="shell text-center relative z-10 pt-32 pb-12">
          <Reveal>
            <div className="eyebrow eyebrow--center mb-8 text-[var(--accent)]">AXION&nbsp;&nbsp;·&nbsp;&nbsp;RESEARCH &amp; JOURNALS</div>
          </Reveal>
          <Reveal delay={0.12}>
            <h1 className="mb-8">
              <span className="block font-serif font-normal text-[clamp(34px,4.8vw,68px)] leading-[1.1] tracking-[-0.01em] text-[var(--fg)]">
                Research &amp; Journals.
              </span>
              <em className="block font-serif font-medium italic text-[clamp(24px,3vw,42px)] leading-[1.2] tracking-[-0.01em] text-[var(--accent)] mt-2">
                {REPORT.published ? "Edition 01 is out." : "Edition 01 lands on 20 November."}
              </em>
            </h1>
          </Reveal>
          <Reveal delay={0.22}>
            <p className="lead mx-auto text-[var(--fg-3)] max-w-[54ch]">
              Working papers, field notes and long-form research on how organisations hold together —
              starting with the {REPORT.name}.
            </p>
          </Reveal>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[20vh] bg-gradient-to-t from-[var(--bg)] to-transparent pointer-events-none" />
      </header>

      {/* EDITION 01 */}
      <section className="relative pb-28">
        <div className="shell">
          <Reveal>
            <Link
              href={reportLink.href}
              className="group block rounded-[28px] border border-[var(--line-gold)] bg-[rgba(201,162,74,0.04)] hover:bg-[rgba(201,162,74,0.07)] transition-colors duration-300 p-8 sm:p-12 lg:p-14"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-end">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-8">
                    <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[var(--accent)]">{REPORT.edition}</span>
                    <span className="text-[var(--accent)] opacity-50">·</span>
                    <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[var(--fg-3)]">{REPORT.name}</span>
                    <span className="text-[var(--accent)] opacity-50">·</span>
                    <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[var(--fg-3)]">{REPORT.releaseShort}</span>
                  </div>
                  <h2 className="font-serif text-[clamp(36px,5vw,72px)] leading-[1] tracking-[-0.01em] text-[var(--fg)]">
                    {REPORT.name}
                  </h2>
                  <p className="text-[16px] leading-[1.7] text-[var(--fg-4)] mt-6 max-w-[56ch]">
                    How AI is changing the architecture of work — where AI accelerates, and where human judgment must still hold the call.
                  </p>
                </div>
                <span className="inline-flex items-center gap-3 px-7 py-4 rounded-full bg-[#C9A24A] text-[#0A0A0B] font-mono text-[11px] tracking-[0.24em] uppercase font-semibold whitespace-nowrap group-hover:scale-[1.03] transition-transform">
                  {REPORT.published ? "Read the report →" : "Get it on release →"}
                </span>
              </div>
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-14">
              <span className="text-[14px] text-[var(--fg-5)]">Want a read of your own organisation first?</span>
              <Button href="/?diagnostic=1" variant="secondary" showArrow>Start Diagnostic</Button>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
