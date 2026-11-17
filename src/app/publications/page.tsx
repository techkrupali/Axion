import Link from "next/link";
import LibraryShell from "@/components/library/LibraryShell";
import ItemCard from "@/components/library/ItemCard";
import ThemeFilter from "@/components/library/ThemeFilter";
import { CATEGORIES, CATEGORY_ORDER, publicItems, type Category } from "@/content/library";
import { libraryForPage } from "@/content/store";
import { pageMetadata } from "@/lib/seo";
import { offListsForLaunch } from "@/config/report";

// Rebuilt hourly as well as on every Studio publish, so date rules (launch week) apply on time
export const revalidate = 3600;

export const metadata = pageMetadata({
  // SEO-02 (approved by Nitin, 17 Nov): "Nitin Nahata articles"
  title: "Articles by Nitin Nahata on AI, work and people",
  description: "Reports, series, essays, press and talks by Nitin Nahata and Axion Index, on AI and work, people architecture, governance and the labour codes.",
  path: "/publications",
});

const LATEST = 3;

/** The library hub (Fix Brief Part 3, item 9): the latest 3 from each category, plus a theme filter across everything. */
export default async function PublicationsHub() {
  const all = publicItems(await libraryForPage()).filter((i) => !offListsForLaunch(i.slug));
  const by = (c: Category) => all.filter((i) => i.category === c);

  return (
    <LibraryShell
      eyebrow="AXION  ·  ARTICLES & PUBLICATIONS"
      title="Articles & Publications"
      intro="Everything we publish, in one place: reports, series, essays, pieces in other publications, and talks. Filter by theme, or open a category to see all of it."
    >
      <ThemeFilter cards={all.map((i) => ({ slug: i.slug, themes: i.theme, node: <ItemCard item={i} /> }))}>
        <div className="pb-24 flex flex-col gap-20">
          {CATEGORY_ORDER.map((c) => {
            const cat = CATEGORIES[c];
            const items = by(c);
            return (
              <section key={c} id={c} aria-labelledby={`h-${c}`} className="shell scroll-mt-[calc(var(--site-nav-h,74px)+24px)]">
                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line)] pb-5 mb-8">
                  <div>
                    <h2 id={`h-${c}`} className="font-serif text-[clamp(26px,3vw,36px)] leading-tight text-[var(--fg)]">{cat.plural}</h2>
                    <p className="text-[14px] leading-[1.6] text-[var(--fg-4)] mt-2 max-w-[60ch]">{cat.blurb}</p>
                  </div>
                  {items.length > 0 && (
                    <Link href={cat.path} className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--accent)] underline underline-offset-2 shrink-0">
                      {c === "book" ? "Open →" : `All ${cat.plural.toLowerCase()} (${items.length}) →`}
                    </Link>
                  )}
                </div>
                {items.length ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {items.slice(0, LATEST).map((i) => <ItemCard key={i.slug} item={i} />)}
                  </div>
                ) : (
                  <p className="text-[15px] leading-[1.7] text-[var(--fg-4)]">
                    <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--accent)] mr-3">In preparation</span>
                    <Link href="/newsletter" className="text-[var(--accent)] underline underline-offset-2">Sign up to the newsletter</Link> to hear when the first one is out.
                  </p>
                )}
              </section>
            );
          })}
        </div>
      </ThemeFilter>
    </LibraryShell>
  );
}
