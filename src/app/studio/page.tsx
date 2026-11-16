import Link from "next/link";
import { CATEGORIES, CATEGORY_ORDER, formatDate, itemPath, sortNewest, type Category } from "@/content/library";
import { studioLibrary } from "./data";

type Props = { searchParams: Promise<{ category?: string; deleted?: string }> };

export const dynamic = "force-dynamic";

/** Everything in Reports and Articles & Publications, drafts first. */
export default async function StudioHome({ searchParams }: Props) {
  const { category, deleted } = await searchParams;
  const { rows } = await studioLibrary();
  const cat = CATEGORY_ORDER.includes(category as Category) ? (category as Category) : undefined;
  const shown = sortNewest(rows.filter((r) => !cat || r.category === cat)) as typeof rows;
  const drafts = shown.filter((r) => !r.live);
  const live = shown.filter((r) => r.live);

  const chip = (active: boolean) => `px-3.5 py-1.5 rounded-full border text-[12.5px] ${active ? "border-[#C9A24A] text-[var(--fg)] bg-[rgba(201,162,74,0.12)]" : "border-[var(--line-strong)] text-[var(--fg-4)] hover:text-[var(--fg)]"}`;

  const table = (list: typeof rows, empty: string) =>
    list.length ? (
      <ul className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
        {list.map((r) => (
          <li key={r.slug} className="py-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <Link href={`/studio/edit/${r.slug}`} className="min-w-0 flex-1 basis-[280px]">
              <span className="block text-[15.5px] text-[var(--fg)] hover:text-[var(--accent)] truncate">{r.title}</span>
              <span className="block font-mono text-[10.5px] tracking-[0.12em] uppercase text-[var(--fg-5)] mt-0.5">
                {CATEGORIES[r.category].label}{r.date ? ` · ${formatDate(r.date, "short")}` : " · no date"}{r.updatedBy ? ` · saved by ${r.updatedBy}` : ""}
              </span>
            </Link>
            <span className={`font-mono text-[10px] tracking-[0.14em] uppercase px-2.5 py-1 rounded ${r.live ? (r.visible ? "bg-[rgba(127,209,174,0.12)] text-[#7FD1AE]" : "bg-[rgba(224,178,90,0.12)] text-[#E0B25A]") : "bg-[rgba(255,255,255,0.06)] text-[var(--fg-4)]"}`}>
              {r.live ? (r.visible ? "Live" : "Published, not showing") : "Draft"}
            </span>
            {r.live && r.visible && <a href={itemPath(r)} target="_blank" rel="noopener noreferrer" className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-[var(--fg-4)] hover:text-[var(--accent)]">View ↗</a>}
          </li>
        ))}
      </ul>
    ) : <p className="text-[14px] text-[var(--fg-5)] py-3">{empty}</p>;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-[36px] leading-tight text-[var(--fg)]">Library</h1>
          <p className="text-[14.5px] text-[var(--fg-4)] mt-1">Reports and Articles & Publications. Add last week&apos;s LinkedIn essays and media pieces every Monday.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["essay", "series", "media", "podcast", "report"] as Category[]).map((k) => (
            <Link key={k} href={`/studio/new?category=${k}`} className="px-4 py-2.5 bg-[#C9A24A] text-[#0A0A0B] font-mono text-[10.5px] tracking-[0.14em] uppercase font-semibold">+ {CATEGORIES[k].label}</Link>
          ))}
        </div>
      </div>
      {deleted && <p role="status" className="text-[14px] text-[#7FD1AE]">Deleted.</p>}
      <div className="flex flex-wrap gap-2">
        <Link href="/studio" className={chip(!cat)}>All ({rows.length})</Link>
        {CATEGORY_ORDER.map((k) => (
          <Link key={k} href={`/studio?category=${k}`} className={chip(cat === k)}>{CATEGORIES[k].plural} ({rows.filter((r) => r.category === k).length})</Link>
        ))}
      </div>
      <section>
        <h2 className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--accent)] mb-3">Drafts ({drafts.length})</h2>
        {table(drafts, "No drafts.")}
      </section>
      <section>
        <h2 className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--accent)] mb-3">Published ({live.length})</h2>
        {table(live, "Nothing published yet.")}
      </section>
    </div>
  );
}
