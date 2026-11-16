import Footer from "@/components/Footer";

/** Plain, readable layout for Privacy and Terms. */
export default function LegalPage({ eyebrow, title, updated, children }: { eyebrow: string; title: string; updated: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <article className="shell pt-36 sm:pt-44 pb-24">
        <div className="max-w-[760px]">
          <div className="eyebrow mb-8 text-[var(--accent)]">{eyebrow}</div>
          <h1 className="font-serif font-normal text-[clamp(36px,5vw,64px)] leading-[1.05] text-[var(--fg)]">{title}</h1>
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--fg-5)] mt-5">Effective {updated}</p>
          <div className="mt-12 flex flex-col gap-10 text-[16px] leading-[1.75] text-[var(--fg-3)] [&_h2]:font-serif [&_h2]:text-[26px] [&_h2]:leading-tight [&_h2]:text-[var(--fg)] [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_a]:text-[var(--accent)] [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-[var(--fg)] [&_strong]:font-medium">
            {children}
          </div>
        </div>
      </article>
      <Footer />
    </div>
  );
}
