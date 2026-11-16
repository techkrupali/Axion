import Link from "next/link";
import { notFound } from "next/navigation";
import ItemEditor from "../../ItemEditor";
import { CATEGORIES, itemPath } from "@/content/library";
import { studioLibrary } from "../../data";

type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";

export default async function EditItem({ params }: Props) {
  const { slug } = await params;
  const { lib, rows } = await studioLibrary();
  const row = rows.find((r) => r.slug === slug);
  if (!row) notFound();
  const { live, visible, everPublished, updatedAt: _u, updatedBy: _b, seriesName: _s, ...item } = row;
  return (
    <div>
      <Link href="/studio" className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-[var(--fg-4)] hover:text-[var(--fg)]">← Library</Link>
      <div className="flex flex-wrap items-baseline justify-between gap-3 mt-3 mb-8">
        <h1 className="font-serif text-[32px] leading-tight text-[var(--fg)]">{row.title}</h1>
        <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-[var(--fg-4)]">
          {CATEGORIES[row.category].label} · {live ? (visible ? "Live" : "Published, not showing") : "Draft"}
          {live && visible && <> · <a href={itemPath(row)} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] underline">View ↗</a></>}
        </span>
      </div>
      <ItemEditor key={slug} item={item} series={lib.series} live={live} everPublished={everPublished} />
    </div>
  );
}
