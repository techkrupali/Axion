"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Pencil, Search, Trash2, X } from "lucide-react";
import { CATEGORIES, CATEGORY_ORDER, formatDate, itemPath, type Category, type LibraryItem } from "@/content/library";
import { deleteItem } from "./actions";
import ConfirmDialog from "./ConfirmDialog";
import { StatusBadge, savedBy, shortDate, ui, type Status } from "./ui";

export type TableRow = {
  slug: string; title: string; category: Category; date: string | null; series?: string;
  status: Status; updatedAt?: string; updatedBy?: string;
};

const STATUS_TABS: { key: "all" | Status; label: string }[] = [
  { key: "all", label: "All" },
  { key: "live", label: "Live" },
  { key: "draft", label: "Drafts" },
  { key: "hidden", label: "Needs a link" },
];

/** Every item: search, filter by category and status, edit, view, delete. */
export default function LibraryTable({ rows: allRows, initialCategory, justDeleted = false }: { rows: TableRow[]; initialCategory: "all" | Category; justDeleted?: boolean }) {
  const router = useRouter();
  const [removed, setRemoved] = useState<string[]>([]); // hidden at once, before the refreshed list arrives
  const rows = useMemo(() => allRows.filter((r) => !removed.includes(r.slug)), [allRows, removed]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"all" | Category>(initialCategory);
  const [status, setStatus] = useState<"all" | Status>("all");
  const [target, setTarget] = useState<TableRow | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(justDeleted ? "Deleted. It is no longer on the website." : "");
  const [pending, start] = useTransition();

  const shown = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return rows
      .filter((r) => (cat === "all" || r.category === cat) && (status === "all" || r.status === status))
      .filter((r) => words.every((w) => `${r.title} ${r.slug} ${CATEGORIES[r.category].label}`.toLowerCase().includes(w)))
      .sort((a, b) => (a.status === "draft" ? 0 : 1) - (b.status === "draft" ? 0 : 1) || (b.date ?? "").localeCompare(a.date ?? "") || a.title.localeCompare(b.title));
  }, [rows, q, cat, status]);

  function confirmDelete() {
    if (!target) return;
    setError("");
    start(async () => {
      const r = await deleteItem(target.slug);
      if (!r.ok) { setError(r.error); return; }
      setRemoved((s) => [...s, target.slug]);
      setNotice(`“${target.title}” was deleted. It is no longer on the website.`);
      setTarget(null);
      router.refresh();
    });
  }

  const cancel = useCallback(() => { setTarget(null); setError(""); }, []);
  const count = (k: "all" | Category) => rows.filter((r) => k === "all" || r.category === k).length;

  return (
    <section aria-labelledby="all-items">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
        <h2 id="all-items" className="font-display font-medium text-[28px] leading-none text-[var(--fg)]">All items</h2>
        <div className="flex border border-[rgba(240,241,245,0.12)]" role="group" aria-label="Status">
          {STATUS_TABS.map((t) => (
            <button key={t.key} type="button" onClick={() => setStatus(t.key)} aria-pressed={status === t.key}
              className={`h-9 px-3.5 font-mono text-[10px] tracking-[0.16em] uppercase transition-colors ${status === t.key ? "bg-[rgba(201,162,74,0.14)] text-[var(--fg)]" : "text-[var(--fg-5)] hover:text-[var(--fg-2)]"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {notice && (
        <div role="status" className="mb-5 flex items-start justify-between gap-4 border border-[rgba(111,207,159,0.3)] bg-[rgba(111,207,159,0.06)] px-4 py-3 text-[14px] text-[#8FDDB6]">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Close" className="text-[#8FDDB6] hover:text-white"><X size={16} aria-hidden /></button>
        </div>
      )}

      {/* Search and categories */}
      <div className={`${ui.panel} border-b-0`}>
        <label className="relative block">
          <span className="sr-only">Search the library</span>
          <Search size={16} strokeWidth={1.6} aria-hidden className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--fg-5)]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title or web address"
            className="w-full h-14 pl-12 pr-12 bg-transparent text-[15px] text-[var(--fg)] placeholder:text-[var(--fg-5)] outline-none border-b border-[rgba(240,241,245,0.08)] focus:border-[#C9A24A]" />
          {q && <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--fg-5)] hover:text-[var(--fg)]"><X size={16} aria-hidden /></button>}
        </label>
        <nav aria-label="Category" className="flex gap-1 px-3 overflow-x-auto">
          {(["all", ...CATEGORY_ORDER] as const).map((k) => {
            const on = cat === k;
            return (
              <button key={k} type="button" onClick={() => setCat(k)} aria-pressed={on}
                className={`shrink-0 h-12 px-3 border-b-2 text-[13.5px] whitespace-nowrap transition-colors ${on ? "border-[#C9A24A] text-[var(--fg)]" : "border-transparent text-[var(--fg-4)] hover:text-[var(--fg-2)]"}`}>
                {k === "all" ? "All" : CATEGORIES[k].plural}
                <span className={`ml-2 font-mono text-[10.5px] ${on ? "text-[#C9A24A]" : "text-[var(--fg-5)]"}`}>{count(k)}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* The list */}
      <div className={ui.panel}>
        <div className="hidden lg:grid grid-cols-[minmax(0,1fr)_104px_104px_128px_120px_128px] gap-4 px-6 h-11 items-center border-b border-[rgba(240,241,245,0.08)] font-mono text-[9.5px] tracking-[0.2em] uppercase text-[var(--fg-5)]">
          <span>Title</span><span>Type</span><span>Date</span><span>Status</span><span>Last saved</span><span className="text-right">Actions</span>
        </div>
        {shown.length === 0 ? (
          <p className="px-6 py-14 text-center text-[15px] text-[var(--fg-5)]">
            {rows.length === 0 ? "The library is empty. Add something above." : "Nothing matches. Try another search or filter."}
          </p>
        ) : (
          <ul className="divide-y divide-[rgba(240,241,245,0.07)]">
            {shown.map((r) => {
              const href = itemPath({ category: r.category, slug: r.slug, series: r.series } as LibraryItem);
              return (
                <li key={r.slug} className="group grid grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,1fr)_104px_104px_128px_120px_128px] gap-x-4 gap-y-2.5 px-5 sm:px-6 py-4 items-center hover:bg-[rgba(240,241,245,0.02)] transition-colors">
                  <div className="min-w-0 col-span-2 lg:col-span-1">
                    <Link href={`/studio/edit/${r.slug}`} className="block text-[15.5px] leading-snug text-[var(--fg)] hover:text-[#C9A24A] transition-colors [overflow-wrap:anywhere]">{r.title}</Link>
                  </div>
                  <span className="hidden lg:block text-[13.5px] text-[var(--fg-3)]">{CATEGORIES[r.category].label}</span>
                  <span className="hidden lg:block text-[13.5px] text-[var(--fg-4)]">{r.date ? formatDate(r.date, "short") : <span className="text-[var(--fg-5)]">No date</span>}</span>
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5 min-w-0">
                    <StatusBadge status={r.status} />
                    <span className="lg:hidden font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--fg-5)]">
                      {CATEGORIES[r.category].label}{r.date ? ` · ${formatDate(r.date, "short")}` : ""}
                    </span>
                  </span>
                  <span className="hidden lg:block text-[12.5px] leading-snug text-[var(--fg-5)]">
                    {r.updatedAt ? <>{shortDate(r.updatedAt)}<span className="block truncate">{savedBy(r.updatedBy)}</span></> : "—"}
                  </span>
                  <span className="flex items-center gap-0.5 justify-end">
                    <Link href={`/studio/edit/${r.slug}`} title="Edit" aria-label={`Edit “${r.title}”`}
                      className="w-10 h-10 flex items-center justify-center text-[var(--fg-4)] hover:text-[var(--fg)] hover:bg-[rgba(240,241,245,0.05)] transition-colors">
                      <Pencil size={16} strokeWidth={1.6} aria-hidden />
                    </Link>
                    {r.status === "live" ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" title="View on the website" aria-label={`View “${r.title}” on the website`}
                        className="w-10 h-10 flex items-center justify-center text-[var(--fg-4)] hover:text-[var(--fg)] hover:bg-[rgba(240,241,245,0.05)] transition-colors">
                        <ArrowUpRight size={17} strokeWidth={1.6} aria-hidden />
                      </a>
                    ) : <span aria-hidden className="w-10 h-10" />}
                    <button type="button" onClick={() => { setError(""); setTarget(r); }} title="Delete" aria-label={`Delete “${r.title}”`}
                      className="w-10 h-10 flex items-center justify-center text-[var(--fg-5)] hover:text-[#E8877B] hover:bg-[rgba(224,122,110,0.08)] transition-colors">
                      <Trash2 size={16} strokeWidth={1.6} aria-hidden />
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <p className="mt-3 text-[12.5px] text-[var(--fg-5)]">{shown.length} of {rows.length} shown · drafts first, then newest.</p>

      <ConfirmDialog
        open={!!target}
        title="Delete this item?"
        confirmLabel="Delete for good"
        busy={pending}
        error={error}
        onConfirm={confirmDelete}
        onCancel={cancel}
      >
        <span className="block mb-3 font-display text-[19px] leading-snug text-[var(--fg)] [overflow-wrap:anywhere]">{target?.title}</span>
        {target?.status === "live"
          ? "It comes off the website straight away: its page, every list it appears in, and the sitemap. This cannot be undone."
          : "The draft is removed for good. This cannot be undone."}
        {target?.status === "live" && <span className="block mt-2 text-[var(--fg-4)]">To take it down but keep it, open it and choose Unpublish instead.</span>}
      </ConfirmDialog>
    </section>
  );
}
