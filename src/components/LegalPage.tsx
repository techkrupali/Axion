import Link from "next/link";
import Footer from "@/components/Footer";
import { PUBLIC_EMAIL } from "@/config/contact";

export type LegalSection = { id: string; title: string; content: React.ReactNode };

const MONO = "font-mono text-[10.5px] tracking-[0.2em] uppercase";

/**
 * Privacy and Terms: an editorial header with the effective date, three points "at a glance",
 * numbered sections with a contents list beside them (sticky on wide screens), and a contact card.
 */
export default function LegalPage({ eyebrow, title, updated, intro, glance, sections, related }: {
  eyebrow: string;
  title: string;
  updated: string;
  intro: React.ReactNode;
  glance: string[];
  sections: LegalSection[];
  related: { label: string; href: string };
}) {
  return (
    <div className="min-h-screen">
      <header className="pt-32 sm:pt-44 pb-12 sm:pb-16 border-b border-[var(--line)]">
        <div className="shell">
          <p className={`${MONO} text-[var(--accent)]`}>{eyebrow}</p>
          <h1 className="font-display font-medium text-[clamp(40px,5.6vw,72px)] leading-[1.04] tracking-[-0.01em] text-[var(--fg)] mt-6">{title}</h1>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            <span className={`${MONO} text-[var(--fg-4)]`}>Effective {updated}</span>
            <span aria-hidden className="hidden sm:block h-3 w-px bg-[var(--line-gold)]" />
            <span className={`${MONO} text-[var(--fg-4)]`}>Axion Index · Bengaluru, India</span>
          </div>
          <div className="mt-8 max-w-[64ch] text-[17px] leading-[1.75] text-[var(--fg-3)] [&_a]:text-[var(--accent)] [&_a]:underline [&_a]:underline-offset-2">{intro}</div>

          {/* At a glance */}
          <ul className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)]">
            {glance.map((g, i) => (
              <li key={g} className="bg-[var(--bg)] p-6 sm:p-7">
                <span className="font-display text-[22px] leading-none text-[var(--accent)] [font-variant-numeric:lining-nums]">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-4 font-display text-[21px] leading-[1.3] text-[var(--fg)]">{g}</p>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div className="shell py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] gap-10 lg:gap-20 items-start">
          {/* Contents */}
          <nav aria-label="Contents" className="lg:sticky lg:top-28">
            <p className={`${MONO} text-[var(--fg-5)] mb-4`}>Contents</p>
            <ol className="flex flex-col border-l border-[var(--line)]">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="group flex items-baseline gap-3 py-2 pl-4 -ml-px border-l border-transparent hover:border-[var(--accent)] text-[14px] leading-snug text-[var(--fg-4)] hover:text-[var(--fg)] transition-colors">
                    <span className="font-mono text-[10.5px] text-[var(--fg-5)] group-hover:text-[var(--accent)]">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="min-w-0 max-w-[740px]">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-28 py-10 first:pt-0 border-t border-[var(--line)] first:border-t-0">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-[11px] tracking-[0.12em] text-[var(--accent)]">{String(i + 1).padStart(2, "0")}</span>
                  <h2 id={`${s.id}-h`} className="font-display font-medium text-[clamp(26px,2.8vw,32px)] leading-tight text-[var(--fg)]">{s.title}</h2>
                </div>
                <div className="mt-5 text-[16px] leading-[1.8] text-[var(--fg-3)] [&_p+p]:mt-4 [&_ul]:mt-4 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-3 [&_li]:relative [&_li]:pl-6 [&_li]:before:content-[''] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.72em] [&_li]:before:w-2 [&_li]:before:h-px [&_li]:before:bg-[var(--accent)] [&_ul+p]:mt-4 [&_a]:text-[var(--accent)] [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-[var(--fg)] [&_strong]:font-medium">
                  {s.content}
                </div>
              </section>
            ))}

            {/* Questions */}
            <aside className="mt-6 border border-[var(--line-gold)] bg-[rgba(201,162,74,0.03)] p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <p className="font-display text-[clamp(24px,2.4vw,28px)] leading-tight text-[var(--fg)]">Questions about this page?</p>
                <p className="text-[15px] leading-[1.7] text-[var(--fg-4)] mt-2">
                  Write to <a href={`mailto:${PUBLIC_EMAIL}`} className="text-[var(--accent)] underline underline-offset-2">{PUBLIC_EMAIL}</a>.
                </p>
              </div>
              <Link href={related.href} className={`${MONO} shrink-0 inline-flex items-center gap-2 px-6 py-3.5 border border-[var(--line-gold)] text-[var(--fg-2)] hover:border-[var(--accent)] hover:text-[var(--fg)] transition-colors`}>
                {related.label} →
              </Link>
            </aside>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
