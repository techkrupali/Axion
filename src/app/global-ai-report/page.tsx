import { Reveal } from "@/components/Reveal";
import Button from "@/components/Button";
import Footer from "@/components/Footer";
import ReportSignupForm from "@/components/ReportSignupForm";
import { REPORT } from "@/config/report";
import { pageMetadata, OG_REPORT } from "@/lib/seo";

export const metadata = pageMetadata({
  title: `${REPORT.name} · ${REPORT.published ? "Get future editions" : `Releasing ${REPORT.releaseShort}`}`,
  description: `${REPORT.edition} of the ${REPORT.name} — how AI is changing the architecture of work. Releasing ${REPORT.releaseLong}. Leave your name, email and organisation to receive it on release.`,
  path: REPORT.signupPath,
  image: OG_REPORT,
});

export default function ReportSignupPage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-report" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(201,168,76,1)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-report)" />
          </svg>
        </div>
        <div
          className="absolute top-[10%] right-[8%] w-[480px] h-[480px] rounded-full opacity-[0.05] pointer-events-none"
          style={{ background: "radial-gradient(circle, #C9A24A 0%, transparent 70%)", animation: "float 14s ease-in-out infinite" }}
        />

        <div className="shell relative z-10 pt-32 sm:pt-40 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-14 lg:gap-20 items-start">
            {/* Left — the report */}
            <div>
              <Reveal>
                <div className="eyebrow mb-8 text-[var(--accent)]">RESEARCH&nbsp;&nbsp;·&nbsp;&nbsp;{REPORT.edition.toUpperCase()}</div>
              </Reveal>
              <Reveal delay={0.08}>
                <span className="inline-flex items-center gap-3 px-5 py-2.5 mb-8 rounded-full border border-[var(--line-gold)] bg-[rgba(201,162,74,0.06)] font-mono text-[11px] tracking-[0.3em] uppercase text-[var(--accent)]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-60 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
                  </span>
                  {REPORT.published ? "Out now" : `Releasing ${REPORT.releaseShort}`}
                </span>
              </Reveal>
              <Reveal delay={0.14}>
                <h1 className="mb-6">
                  <span className="block font-serif font-normal text-[clamp(40px,5.4vw,76px)] leading-[1.02] tracking-[-0.01em] text-[var(--fg)]">
                    {REPORT.name}.
                  </span>
                  <em className="block font-serif font-medium italic text-[clamp(22px,2.6vw,36px)] leading-[1.25] text-[var(--accent)] mt-3">
                    {REPORT.edition} · {REPORT.releaseLong}
                  </em>
                </h1>
              </Reveal>
              <Reveal delay={0.22}>
                <p className="lead text-[var(--fg-3)] max-w-[52ch] mb-10">
                  The first edition of our research series on how AI is changing the architecture of work —
                  where AI accelerates, and where human judgment must still hold the call.
                  {REPORT.published ? " Read it now, or leave your details for future editions." : " Leave your details and we'll send it to you on release."}
                </p>
              </Reveal>
              {REPORT.published && (
                <Reveal delay={0.28}>
                  <Button href={REPORT.readPath} variant="primary" showArrow>Read the report</Button>
                </Reveal>
              )}
            </div>

            {/* Right — sign-up */}
            <Reveal delay={0.2} className="w-full">
              <div className="glass-card p-8 sm:p-10 rounded-[24px] border border-[var(--line-gold)]">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--accent)] block mb-3">
                  {REPORT.published ? "Future editions" : "Get it on release"}
                </span>
                <h2 className="font-serif text-[28px] leading-tight text-[var(--fg)] mb-8">
                  {REPORT.published ? "Stay on the list." : "Be the first to read it."}
                </h2>
                <ReportSignupForm releaseLong={REPORT.releaseLong} published={REPORT.published} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
