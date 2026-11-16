import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";
import { pageMetadata } from "@/lib/seo";
import { JOURNAL, LINKEDIN_FOLLOW } from "@/config/contact";

export const metadata = pageMetadata({
  title: JOURNAL.name,
  description: `The ${JOURNAL.name}, by email ${JOURNAL.cadence}: new reports, essays and field notes on how organisations hold together.`,
  path: "/newsletter",
});

export default function NewsletterPage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="shell relative z-10 pt-36 sm:pt-44 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-14 lg:gap-20 items-start">
            <div>
              <Reveal>
                <div className="eyebrow mb-8 text-[var(--accent)]">AXION&nbsp;&nbsp;·&nbsp;&nbsp;JOURNAL</div>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="font-serif font-normal text-[clamp(36px,5vw,68px)] leading-[1.05] tracking-[-0.01em] text-[var(--fg)]">
                  The {JOURNAL.name}, <em className="text-[var(--accent)]">{JOURNAL.cadence}.</em>
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="lead text-[var(--fg-3)] max-w-[50ch] mt-6">
                  New <Link href="/reports" className="text-[var(--accent)] underline underline-offset-2">reports</Link>,{" "}
                  <Link href="/publications" className="text-[var(--accent)] underline underline-offset-2">essays and field notes</Link> from Axion Index,
                  in one email {JOURNAL.cadence}.
                </p>
                <p className="text-[15px] text-[var(--fg-4)] max-w-[50ch] mt-5">
                  Prefer LinkedIn?{" "}
                  <a href={LINKEDIN_FOLLOW.href} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] underline underline-offset-2">{LINKEDIN_FOLLOW.label} ↗</a>
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.2} className="w-full">
              <div className="glass-card p-8 sm:p-10 rounded-[24px] border border-[var(--line-gold)]">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--accent)] block mb-3">{JOURNAL.name}</span>
                <h2 className="font-serif text-[28px] leading-tight text-[var(--fg)] mb-8">Sign up.</h2>
                <NewsletterForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
