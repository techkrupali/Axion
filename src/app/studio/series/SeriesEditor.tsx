"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { THEMES, slugify, type Series } from "@/content/library";
import { deleteSeries, saveSeries } from "../actions";
import ConfirmDialog from "../ConfirmDialog";
import { ui } from "../ui";

/** Add a series, or edit one's name and summary (its address stays fixed once it exists). */
export default function SeriesEditor({ series, parts }: { series?: Series; parts?: number }) {
  const router = useRouter();
  const [name, setName] = useState(series?.name ?? "");
  const [summary, setSummary] = useState(series?.summary ?? "");
  const [theme, setTheme] = useState<string[]>(series?.theme ?? []);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const save = () => start(async () => {
    const r = await saveSeries({ originalSlug: series?.slug, name, slug: slugify(name), summary, theme });
    setMsg(r.ok ? { ok: true, text: series ? "Saved." : "Series added. You can now choose it when adding a part." } : { ok: false, text: r.error });
    if (r.ok) { if (!series) { setName(""); setSummary(""); setTheme([]); } router.refresh(); }
  });
  const remove = () => start(async () => {
    setError("");
    const r = await deleteSeries(series!.slug);
    if (r.ok) { setConfirm(false); router.refresh(); } else setError(r.error);
  });
  const close = useCallback(() => { setConfirm(false); setError(""); }, []);

  return (
    <div className={`${ui.panel} p-6 sm:p-7 flex flex-col gap-5`}>
      {series && (
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="font-display font-medium text-[24px] leading-tight text-[var(--fg)]">{series.name}</p>
          <p className={`${ui.mono} text-[10px] text-[var(--fg-5)]`}>
            /publications/series/{series.slug} · <span className="text-[#C9A24A]">{parts} part{parts === 1 ? "" : "s"}</span>
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-4">
        <div>
          <label htmlFor={`s-name-${series?.slug ?? "new"}`} className={ui.label}>Series name</label>
          <input id={`s-name-${series?.slug ?? "new"}`} placeholder="e.g. The Big AI Bet" value={name} onChange={(e) => setName(e.target.value)} className={ui.input} />
        </div>
        <div>
          <label htmlFor={`s-sum-${series?.slug ?? "new"}`} className={ui.label}>One-line description</label>
          <input id={`s-sum-${series?.slug ?? "new"}`} placeholder="What the series is about" value={summary} onChange={(e) => setSummary(e.target.value)} className={ui.input} />
        </div>
      </div>
      <div>
        <span className={ui.label}>Theme</span>
        <div className="flex flex-wrap gap-2">
          {THEMES.map((t) => {
            const on = theme.includes(t);
            return (
              <label key={t} className={ui.chip(on)}>
                <input type="checkbox" className="sr-only" checked={on} onChange={() => setTheme(on ? theme.filter((x) => x !== t) : [...theme, t])} />{t}
              </label>
            );
          })}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button type="button" disabled={pending} onClick={save} className={ui.primary}>{series ? "Save changes" : "Add series"}</button>
        {msg && <span role="status" className={`text-[13.5px] ${msg.ok ? "text-[#8FDDB6]" : "text-[#E8877B]"}`}>{msg.text}</span>}
        {series && (
          parts ? (
            <span className="ml-auto text-[12.5px] text-[var(--fg-5)]">To delete it, move or delete its parts first.</span>
          ) : (
            <button type="button" disabled={pending} onClick={() => setConfirm(true)} className="ml-auto inline-flex items-center gap-2 text-[13px] text-[var(--fg-5)] hover:text-[#E8877B] transition-colors">
              <Trash2 size={14} strokeWidth={1.6} aria-hidden /> Delete series
            </button>
          )
        )}
      </div>
      {series && (
        <ConfirmDialog open={confirm} title="Delete this series?" confirmLabel="Delete series" busy={pending} error={error} onConfirm={remove} onCancel={close}>
          <span className="block mb-3 font-display text-[19px] leading-snug text-[var(--fg)]">{series.name}</span>
          It has no parts, so nothing else changes. Its page comes off the website. This cannot be undone.
        </ConfirmDialog>
      )}
    </div>
  );
}
