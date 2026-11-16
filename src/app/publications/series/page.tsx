import Link from "next/link";
import LibraryShell from "@/components/library/LibraryShell";
import CategoryList from "@/components/library/CategoryList";
import { CATEGORIES, seriesParts } from "@/content/library";
import { libraryForPage } from "@/content/store";
import { pageMetadata } from "@/lib/seo";

const cat = CATEGORIES.series;
export const metadata = pageMetadata({ title: cat.plural, description: cat.blurb, path: cat.path });

export default async function Page() {
  const lib = await libraryForPage();
  const live = lib.series.map((s) => ({ s, parts: seriesParts(lib, s.slug) })).filter((x) => x.parts.length > 0);
  return (
    <LibraryShell eyebrow="AXION  ·  SERIES" title="Series" intro={cat.blurb} crumbs={[{ label: "Articles & Publications", href: "/publications" }]}>
      {live.length ? (
        <section className="shell pb-24 grid grid-cols-1 md:grid-cols-2 gap-5">
          {live.map(({ s, parts }) => (
            <Link key={s.slug} href={`/publications/series/${s.slug}`} className="group rounded-2xl border border-[var(--line)] hover:border-[var(--line-gold)] p-7 transition-colors">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--accent)]">{parts.length} {parts.length === 1 ? "part" : "parts"}</span>
              <h2 className="font-serif text-[28px] leading-tight text-[var(--fg)] group-hover:text-[var(--accent)] mt-3">{s.name}</h2>
              {s.summary && <p className="text-[15px] leading-[1.65] text-[var(--fg-4)] mt-3">{s.summary}</p>}
            </Link>
          ))}
        </section>
      ) : (
        <CategoryList items={[]} empty="No series published here yet." />
      )}
    </LibraryShell>
  );
}
