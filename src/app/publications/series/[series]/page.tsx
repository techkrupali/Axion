import { notFound } from "next/navigation";
import LibraryShell from "@/components/library/LibraryShell";
import CategoryList from "@/components/library/CategoryList";
import { findSeries, seriesParts, type Library } from "@/content/library";
import { getLibrary, libraryForPage } from "@/content/store";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ series: string }> };

export const dynamicParams = true;
export async function generateStaticParams() {
  const lib = await getLibrary();
  return lib.series.filter((s) => seriesParts(lib, s.slug).length > 0).map((s) => ({ series: s.slug }));
}

function load(lib: Library, slug: string) {
  const s = findSeries(lib, slug);
  const parts = s ? seriesParts(lib, s.slug) : [];
  if (!s || !parts.length) notFound();
  return { s, parts };
}

export async function generateMetadata({ params }: Props) {
  const { s } = load(await libraryForPage(), (await params).series);
  return pageMetadata({ title: s.name, description: s.summary || `${s.name}: a series by Nitin Nahata, read in order.`, path: `/publications/series/${s.slug}` });
}

/** One series, parts in reading order (Fix Brief Part 3: /publications/series/[name]). */
export default async function Page({ params }: Props) {
  const { s, parts } = load(await libraryForPage(), (await params).series);
  return (
    <LibraryShell eyebrow="AXION  ·  SERIES" title={s.name} intro={s.summary || "Read in order."}
      crumbs={[{ label: "Articles & Publications", href: "/publications" }, { label: "Series", href: "/publications/series" }]}>
      <CategoryList items={parts} empty="No parts published yet." />
    </LibraryShell>
  );
}
