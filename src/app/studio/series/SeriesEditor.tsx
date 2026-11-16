"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { THEMES, slugify, type Series } from "@/content/library";
import { deleteSeries, saveSeries } from "../actions";

/** Add a series, or edit one's name and summary (its address stays fixed once it exists). */
export default function SeriesEditor({ series, parts }: { series?: Series; parts?: number }) {
  const router = useRouter();
  const [name, setName] = useState(series?.name ?? "");
  const [summary, setSummary] = useState(series?.summary ?? "");
  const [theme, setTheme] = useState<string[]>(series?.theme ?? []);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const input = "w-full rounded-lg px-3.5 py-2.5 text-[15px] text-[var(--fg)] bg-[rgba(255,255,255,0.04)] border border-[var(--line-strong)] outline-none focus:border-[#C9A24A]";

  const save = () => start(async () => {
    const r = await saveSeries({ originalSlug: series?.slug, name, slug: slugify(name), summary, theme });
    setMsg(r.ok ? { ok: true, text: series ? "Saved." : "Series added. You can now choose it when adding a part." } : { ok: false, text: r.error });
    if (r.ok) { if (!series) { setName(""); setSummary(""); setTheme([]); } router.refresh(); }
  });
  const remove = () => start(async () => {
    const r = await deleteSeries(series!.slug);
    if (r.ok) router.refresh(); else setMsg({ ok: false, text: r.error });
  });

  return (
    <div className="rounded-xl border border-[var(--line)] p-5 flex flex-col gap-3">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-3">
        <input aria-label="Series name" placeholder="Series name, e.g. The Big AI Bet" value={name} onChange={(e) => setName(e.target.value)} className={input} />
        <input aria-label="One-line description" placeholder="One-line description" value={summary} onChange={(e) => setSummary(e.target.value)} className={input} />
      </div>
      <div className="flex flex-wrap gap-2">
        {THEMES.map((t) => {
          const on = theme.includes(t);
          return (
            <label key={t} className={`cursor-pointer px-3 py-1.5 rounded-full border text-[12.5px] ${on ? "border-[#C9A24A] text-[var(--fg)] bg-[rgba(201,162,74,0.12)]" : "border-[var(--line-strong)] text-[var(--fg-4)]"}`}>
              <input type="checkbox" className="sr-only" checked={on} onChange={() => setTheme(on ? theme.filter((x) => x !== t) : [...theme, t])} />{t}
            </label>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" disabled={pending} onClick={save} className="px-5 py-2.5 bg-[#C9A24A] text-[#0A0A0B] font-mono text-[10.5px] tracking-[0.16em] uppercase font-semibold disabled:opacity-50">{series ? "Save" : "Add series"}</button>
        {series && <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-[var(--fg-5)]">/publications/series/{series.slug} · {parts} part{parts === 1 ? "" : "s"}</span>}
        {series && !parts && <button type="button" disabled={pending} onClick={remove} className="ml-auto text-[13px] text-red-400/80 underline">Delete series</button>}
        {msg && <span role="status" className={`text-[13.5px] ${msg.ok ? "text-[#7FD1AE]" : "text-red-400"}`}>{msg.text}</span>}
      </div>
    </div>
  );
}
