import Link from "next/link";
import { ChartColumn, Layers, Mic, Newspaper, PenLine } from "lucide-react";
import { CATEGORY_ORDER, type Category } from "@/content/library";
import { studioLibrary } from "./data";
import { PageHeader, savedBy, shortDate, ui } from "./ui";
import LibraryTable, { type TableRow } from "./LibraryTable";

type Props = { searchParams: Promise<{ category?: string; deleted?: string }> };

export const dynamic = "force-dynamic";

const CREATE: { category: Category; label: string; line: string; icon: typeof PenLine }[] = [
  { category: "essay", label: "Essay", line: "A LinkedIn essay", icon: PenLine },
  { category: "series", label: "Series part", line: "One part of a series", icon: Layers },
  { category: "media", label: "In the media", line: "A publisher's article", icon: Newspaper },
  { category: "podcast", label: "Podcast or talk", line: "A recording", icon: Mic },
  { category: "report", label: "Report", line: "Axion or AI Edge Lab", icon: ChartColumn },
];

/** The Studio's home: create something, see where things stand, find and manage every item. */
export default async function StudioHome({ searchParams }: Props) {
  const { category, deleted } = await searchParams;
  const { rows } = await studioLibrary();
  const initial = CATEGORY_ORDER.includes(category as Category) ? (category as Category) : "all";

  const live = rows.filter((r) => r.live && r.visible).length;
  const drafts = rows.filter((r) => !r.live).length;
  const needs = rows.filter((r) => r.live && !r.visible).length;
  const latest = rows.filter((r) => r.updatedAt).sort((a, b) => b.updatedAt!.localeCompare(a.updatedAt!))[0];

  const table: TableRow[] = rows.map((r) => ({
    slug: r.slug, title: r.title, category: r.category, date: r.date, series: r.series,
    status: !r.live ? "draft" : r.visible ? "live" : "hidden",
    updatedAt: r.updatedAt, updatedBy: r.updatedBy,
  }));

  const stats = [
    { n: rows.length, label: "Items in the library" },
    { n: live, label: "Live on the website" },
    { n: drafts, label: "Drafts" },
    { n: needs, label: "Published, needs a link", warn: needs > 0 },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Reports · Articles & Publications"
        title="Library"
        intro="Everything on the Reports and Articles & Publications pages. Add last week's LinkedIn essays and media pieces every Monday."
      />

      {/* Create */}
      <section aria-labelledby="create" className="mb-10">
        <h2 id="create" className={`${ui.mono} text-[var(--fg-5)] mb-4`}>Add something new</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-px bg-[rgba(240,241,245,0.08)] border border-[rgba(240,241,245,0.08)]">
          {CREATE.map((c, i) => (
            <Link key={c.category} href={`/studio/new?category=${c.category}`}
              className={`group flex flex-col gap-4 p-5 sm:p-6 bg-[#0E0E10] hover:bg-[#141416] transition-colors ${i === CREATE.length - 1 ? "col-span-2 md:col-span-1" : ""}`}>
              <span className="w-10 h-10 flex items-center justify-center border border-[rgba(201,162,74,0.35)] text-[#C9A24A] group-hover:bg-[#C9A24A] group-hover:text-[#0A0A0B] transition-colors">
                <c.icon size={18} strokeWidth={1.5} aria-hidden />
              </span>
              <span>
                <span className="block text-[15px] text-[var(--fg)]"><span aria-hidden className="text-[#C9A24A] mr-1">+</span>{c.label}</span>
                <span className="block text-[13px] text-[var(--fg-5)] mt-1">{c.line}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Where things stand */}
      <section aria-label="Overview" className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[rgba(240,241,245,0.08)] border border-[rgba(240,241,245,0.08)] mb-12">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#0B0B0D] px-5 sm:px-6 py-5">
            <p className={`font-display font-medium text-[38px] leading-none [font-variant-numeric:lining-nums] ${s.warn ? "text-[#E8C27A]" : "text-[var(--fg)]"}`}>{s.n}</p>
            <p className={`${ui.mono} text-[9.5px] text-[var(--fg-5)] mt-3`}>{s.label}</p>
          </div>
        ))}
      </section>

      <LibraryTable rows={table} initialCategory={initial} justDeleted={!!deleted} />

      {latest && (
        <p className="mt-6 text-[13px] text-[var(--fg-5)]">
          Last change: <span className="text-[var(--fg-4)]">{latest.title}</span>, {shortDate(latest.updatedAt)}{savedBy(latest.updatedBy) ? ` · ${savedBy(latest.updatedBy)}` : ""}.
        </p>
      )}
    </>
  );
}
