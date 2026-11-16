import { Reveal } from "@/components/Reveal";
import { CASE_FIELDS, casesFor } from "@/content/evidence";
import type { PracticeKey } from "@/config/practices";

/**
 * N-06 (Fix Brief Part 3A): 2–3 anonymised examples for a practice, all in one format.
 * Renders nothing until an example with the client's permission exists in src/content/evidence.ts.
 */
export default function CaseExamples({ practice }: { practice: PracticeKey }) {
  const cases = casesFor(practice);
  if (!cases.length) return null;

  return (
    <section className="chapter section-deep relative" id="examples">
      <div className="shell">
        <Reveal>
          <span className="eyebrow mb-6 text-[var(--accent)]">In practice</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="h-section mb-6">
            How the thinking <em className="text-[var(--accent)]">applies.</em>
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="lead text-[var(--fg-3)] max-w-[58ch] mb-14">Anonymised, and shared with each client&apos;s permission.</p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cases.map((c, i) => (
            <Reveal key={i} delay={0.1 + i * 0.08}>
              <article className="h-full rounded-[24px] border border-[var(--line-gold)] bg-[rgba(201,162,74,0.03)] p-7 sm:p-9">
                <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--accent)]">Example {String(i + 1).padStart(2, "0")}</span>
                <dl className="mt-6 flex flex-col gap-5">
                  {CASE_FIELDS.map((f) => (
                    <div key={f.key}>
                      <dt className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--fg-5)] mb-1.5">{f.label}</dt>
                      <dd className="text-[15px] leading-[1.7] text-[var(--fg-2)]">{c[f.key]}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
