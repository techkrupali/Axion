import LibraryShell from "@/components/library/LibraryShell";
import CategoryList from "@/components/library/CategoryList";
import { CATEGORIES, itemsIn } from "@/content/library";
import { libraryForPage } from "@/content/store";
import { HOME_EVIDENCE } from "@/config/evidence";
import { pageMetadata } from "@/lib/seo";
import { offListsForLaunch, reportFirst } from "@/config/report";

const cat = CATEGORIES.report;

// Rebuilt hourly as well as on every Studio publish, so date rules (launch week) apply on time
export const revalidate = 3600;

export const metadata = pageMetadata({
  // SEO-02 (approved by Nitin, 17 Nov): "AI and the future of work report"
  title: "Reports on AI and the future of work",
  description: "Research reports from Axion Index on how AI and regulation are changing the architecture of work: where AI accelerates, and where judgment must still hold.",
  path: cat.path,
});

/** Every report, newest first (Fix Brief Part 3). Each opens its own page. */
export default async function ReportsPage() {
  const lib = await libraryForPage();
  return (
    <LibraryShell
      eyebrow="AXION  ·  REPORTS"
      title="Reports"
      intro="Long research pieces on how AI and regulation are changing the architecture of work. Open a report to see what is inside and to get it."
      crumbs={[{ label: "Articles & Publications", href: "/publications" }]}
    >
      <CategoryList items={reportFirst(itemsIn(lib, "report").filter((i) => !offListsForLaunch(i.slug)))} empty="No reports published yet." />

      {/* B-16 (Fix Brief Part 8): the evidence behind the homepage figures */}
      <section id="evidence" className="shell pb-24 scroll-mt-[calc(var(--site-nav-h,74px)+24px)]" aria-labelledby="evidence-title">
        <div className="border-t border-[var(--line)] pt-14">
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--accent)]">The evidence</span>
          <h2 id="evidence-title" className="font-serif text-[clamp(28px,3.4vw,42px)] leading-tight text-[var(--fg)] mt-3 max-w-[30ch]">
            The figures on our homepage, and where they come from.
          </h2>
          <p className="text-[15px] leading-[1.7] text-[var(--fg-4)] mt-4 max-w-[64ch]">
            These are other institutions&apos; findings about the market, not results of Axion Index&apos;s own work. Each links to its source.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
            {HOME_EVIDENCE.map((e) => (
              <article key={e.src} className="rounded-2xl border border-[var(--line-gold)] bg-[rgba(201,162,74,0.03)] p-6 sm:p-7 flex flex-col">
                <div className="font-serif text-[52px] leading-none text-[var(--fg)]">{e.val}</div>
                <div className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-[var(--accent)] mt-3">{e.src}</div>
                <p className="text-[15.5px] leading-[1.6] text-[var(--fg-2)] mt-4">{e.finding}</p>
                <p className="text-[13.5px] leading-[1.6] text-[var(--fg-4)] mt-3">{e.note}</p>
                <a href={e.url} target="_blank" rel="noopener noreferrer" className="mt-auto pt-6 text-[13px] leading-snug text-[var(--accent)] hover:underline">
                  {e.source} ↗
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </LibraryShell>
  );
}
