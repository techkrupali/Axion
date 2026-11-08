import { notFound } from "next/navigation";
import Button from "@/components/Button";
import Footer from "@/components/Footer";
import { REPORT } from "@/config/report";
import { pageMetadata, OG_REPORT } from "@/lib/seo";

/**
 * Full Global AI Report — hidden until launch day.
 *  • Public only when NEXT_PUBLIC_REPORT_PUBLISHED=true.
 *  • Before that, the team can preview it at
 *    /global-ai-report/edition-01?preview=<REPORT_PREVIEW_KEY>  (set in the server .env).
 *
 * Content: every block marked "To be supplied" is waiting for the report text.
 */

type Props = { searchParams: Promise<{ preview?: string }> };

const canView = (preview?: string) =>
  REPORT.published || (!!process.env.REPORT_PREVIEW_KEY && preview === process.env.REPORT_PREVIEW_KEY);

export async function generateMetadata() {
  return pageMetadata({
    title: `${REPORT.name} · ${REPORT.edition}`,
    description: `${REPORT.edition} of the ${REPORT.name}: how AI is changing the architecture of work. Published ${REPORT.releaseLong}.`,
    path: REPORT.readPath,
    image: OG_REPORT,
    noIndex: !REPORT.published,
  });
}

function Placeholder({ label, lines = 3 }: { label: string; lines?: number }) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--line-gold)] bg-[rgba(201,162,74,0.03)] p-6">
      <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--accent)]">To be supplied · {label}</span>
      <div className="mt-4 flex flex-col gap-2.5">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="h-2.5 rounded-full bg-[rgba(240,241,245,0.07)]" style={{ width: `${92 - i * 11}%` }} />
        ))}
      </div>
    </div>
  );
}

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-[var(--line)] py-16 sm:py-20">
      <div className="shell grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-16">
        <div>
          <span className="eyebrow text-[var(--accent)]">{eyebrow}</span>
          <h2 className="font-serif text-[clamp(26px,3vw,38px)] leading-tight text-[var(--fg)] mt-4">{title}</h2>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

export default async function ReportPage({ searchParams }: Props) {
  const { preview } = await searchParams;
  if (!canView(preview)) notFound();

  return (
    <div className="min-h-screen">
      {!REPORT.published && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[90] px-5 py-2.5 rounded-full bg-[#C9A24A] text-[#0A0A0B] font-mono text-[10px] tracking-[0.25em] uppercase shadow-2xl">
          Preview · not public until {REPORT.releaseShort}
        </div>
      )}

      {/* HERO */}
      <header className="relative overflow-hidden">
        <div
          className="absolute top-[12%] left-[10%] w-[520px] h-[520px] rounded-full opacity-[0.05] pointer-events-none"
          style={{ background: "radial-gradient(circle, #C9A24A 0%, transparent 70%)" }}
        />
        <div className="shell relative z-10 pt-36 sm:pt-44 pb-20">
          <div className="eyebrow mb-8 text-[var(--accent)]">RESEARCH&nbsp;&nbsp;·&nbsp;&nbsp;{REPORT.edition.toUpperCase()}&nbsp;&nbsp;·&nbsp;&nbsp;{REPORT.releaseLong.toUpperCase()}</div>
          <h1 className="font-serif font-normal text-[clamp(44px,6.5vw,96px)] leading-[0.98] tracking-[-0.015em] text-[var(--fg)] max-w-[14ch]">
            {REPORT.name}<span className="text-[var(--accent)]">.</span>
          </h1>
          <div className="mt-8 max-w-[640px]">
            <Placeholder label="Report subtitle / standfirst" lines={2} />
          </div>
        </div>
      </header>

      <Section eyebrow="01 · Summary" title="Executive summary">
        <Placeholder label="Executive summary" lines={6} />
      </Section>

      <Section eyebrow="02 · Findings" title="Key findings">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <Placeholder key={n} label={`Finding ${String(n).padStart(2, "0")}`} lines={3} />
          ))}
        </div>
      </Section>

      <Section eyebrow="03 · Implications" title="What it means for leaders">
        <Placeholder label="Implications for CEOs, CFOs, CHROs and boards" lines={5} />
      </Section>

      <Section eyebrow="04 · Method" title="Methodology">
        <Placeholder label="Sample, sources and method" lines={4} />
      </Section>

      {/* CTA */}
      <section className="border-t border-[var(--line)] py-20">
        <div className="shell text-center">
          <h2 className="font-serif text-[clamp(28px,3.4vw,46px)] leading-tight text-[var(--fg)] mb-4">
            Read what is breaking in <em className="text-[var(--accent)]">your</em> organisation.
          </h2>
          <p className="lead mx-auto text-[var(--fg-3)] max-w-[48ch] mb-10">
            A 30-minute architectural read. You bring the signal. No fee, no pitch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button href="/?diagnostic=1" variant="primary" showArrow>Start Diagnostic</Button>
            <Button href="/connect" variant="secondary">Reach Us</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
