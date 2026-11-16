"use client";

import { useState } from "react";
import { THEMES, type Theme } from "@/content/library";

/**
 * Theme filter across the whole library (Fix Brief Part 3, item 9).
 * Server-rendered cards are passed in, keyed by the item's themes, so the
 * filter only shows / hides them — no data is duplicated on the client.
 */
export default function ThemeFilter({
  cards,
  children,
}: {
  cards: { slug: string; themes: Theme[]; node: React.ReactNode }[];
  children: React.ReactNode; // the default view: latest 3 per category
}) {
  const [theme, setTheme] = useState<Theme | null>(null);
  const shown = theme ? cards.filter((c) => c.themes.includes(theme)) : [];

  return (
    <>
      <div className="shell">
        <div role="toolbar" aria-label="Filter by theme" className="flex flex-wrap items-center gap-2.5 pb-10">
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--fg-5)] mr-2">Theme</span>
          {[null, ...THEMES].map((t) => {
            const on = theme === t;
            return (
              <button
                key={t ?? "all"}
                type="button"
                aria-pressed={on}
                onClick={() => setTheme(t)}
                className={`px-4 py-2 rounded-full border font-mono text-[10px] tracking-[0.16em] uppercase transition-colors ${
                  on ? "bg-[#C9A24A] border-[#C9A24A] text-[#0A0A0B]" : "border-[var(--line-strong)] text-[var(--fg-4)] hover:border-[#C9A24A] hover:text-[#C9A24A]"
                }`}
              >
                {t ?? "All"}
              </button>
            );
          })}
        </div>
      </div>

      {theme ? (
        <section className="shell pb-24" aria-live="polite">
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--fg-4)] mb-6">
            {shown.length} {shown.length === 1 ? "item" : "items"} on {theme}
          </p>
          {shown.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {shown.map((c) => <div key={c.slug}>{c.node}</div>)}
            </div>
          ) : (
            <p className="text-[15px] text-[var(--fg-4)]">Nothing published on this theme yet.</p>
          )}
        </section>
      ) : (
        children
      )}
    </>
  );
}
