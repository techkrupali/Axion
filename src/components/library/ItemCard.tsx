import Link from "next/link";
import { coverPath, formatDate, itemKind, itemPath, type LibraryItem } from "@/content/library";

/** One library item as a card: generated cover, category, date, title, source and 2-line summary. */
export default function ItemCard({ item }: { item: LibraryItem }) {
  const source =
    item.category === "media" ? item.publisher
    : item.category === "series" ? item.seriesName
    : item.kicker;
  return (
    <Link
      href={itemPath(item)}
      className="group flex flex-col h-full rounded-2xl border border-[var(--line)] hover:border-[var(--line-gold)] bg-[rgba(255,255,255,0.015)] overflow-hidden transition-colors duration-300"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={coverPath(item.slug, item.cover)} alt="" width={1200} height={630} loading="lazy" className="w-full h-auto aspect-[1200/630] object-cover" />
      <div className="flex flex-col gap-2.5 p-5 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] tracking-[0.18em] uppercase">
          <span className="text-[var(--accent)]">{itemKind(item)}</span>
          {item.date && <span className="text-[var(--fg-5)]">· {formatDate(item.date, "short")}</span>}
        </div>
        <h3 className="font-serif text-[21px] leading-snug text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">{item.title}</h3>
        {source && <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--fg-4)]">{source}</p>}
        {item.summary && <p className="text-[14px] leading-[1.6] text-[var(--fg-4)] line-clamp-2">{item.summary}</p>}
      </div>
    </Link>
  );
}
