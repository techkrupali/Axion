"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CATEGORIES, CATEGORY_ORDER, THEMES, itemPath, slugify, type Category, type LibraryItem, type Series } from "@/content/library";
import { markdownToHtml } from "@/lib/markdown";
import { deleteItem, saveItem, unpublishItem, type ItemInput } from "./actions";

const toInput = (i: Partial<LibraryItem> & { category: Category }): ItemInput => ({
  originalSlug: i.slug,
  category: i.category,
  title: i.title ?? "",
  slug: i.slug ?? "",
  date: i.date ?? "",
  theme: i.theme ?? [],
  summary: i.summary ?? "",
  body: i.body ?? "",
  series: i.series ?? "",
  part: i.part ? String(i.part) : "",
  originalLink: i.originalLink ?? "",
  publisher: i.publisher ?? "",
  kicker: i.kicker ?? "",
  inside: (i.inside ?? []).join("\n"),
  author: i.author ?? "",
  method: i.method ?? "",
  site: i.site ?? "",
  pdf: i.pdf ?? "",
  owner: i.owner ?? "axion",
  embed: i.embed ?? "",
  statusLine: i.statusLine ?? "",
  cover: i.cover ?? "",
  coverAlt: i.coverAlt ?? "",
});

/* ── Photo ───────────────────────────────────────────────────────────────────
 * Shrunk in the browser before upload (at most 1600 px on the long side, JPEG, under 900 KB),
 * so any phone or camera photo works and the upload stays small. */
const MAX_BYTES = 900 * 1024;

async function shrinkPhoto(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  if (!/^image\//.test(file.type) && !/\.(jpe?g|png|webp|heic|heif|gif)$/i.test(file.name)) throw new Error("Please choose a photo (JPG, PNG or WebP).");
  let bmp: ImageBitmap;
  try { bmp = await createImageBitmap(file, { imageOrientation: "from-image" }); }
  catch { throw new Error("This photo could not be opened. Please save it as JPG or PNG and try again."); }
  const steps: [number, number][] = [[1600, 0.85], [1600, 0.72], [1280, 0.72], [1024, 0.65]];
  for (const [max, quality] of steps) {
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const w = Math.max(1, Math.round(bmp.width * scale)), h = Math.max(1, Math.round(bmp.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#0B0B09"; // transparent parts of a PNG become the site's dark background
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(bmp, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", quality));
    if (blob && blob.size <= MAX_BYTES) { bmp.close(); return { blob, width: w, height: h }; }
  }
  bmp.close();
  throw new Error("This photo is too large. Please choose a smaller one.");
}

function PhotoField({ category, value, alt, onChange, onAlt, labelClass, inputClass, hintClass }: {
  category: Category; value: string; alt: string;
  onChange: (v: string) => void; onAlt: (v: string) => void;
  labelClass: string; inputClass: string; hintClass: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // choosing the same file again still works
    if (!file) return;
    setError(""); setBusy(true);
    try {
      const { blob, width, height } = await shrinkPhoto(file);
      const form = new FormData();
      form.append("photo", blob, "photo.jpg");
      form.append("width", String(width));
      form.append("height", String(height));
      const res = await fetch("/api/studio/upload", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Could not upload the photo. Please try again.");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upload the photo.");
    } finally {
      setBusy(false);
    }
  }

  const btn = "inline-flex items-center px-4 py-2.5 font-mono text-[10.5px] tracking-[0.16em] uppercase border border-[var(--line-strong)] text-[var(--fg-2)] hover:border-[#C9A24A] focus-within:border-[#C9A24A] focus-within:outline focus-within:outline-1 focus-within:outline-[#C9A24A] cursor-pointer";
  return (
    <div>
      <span className={labelClass}>Photo (optional)</span>
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className={`rounded-lg border border-[var(--line-strong)] bg-[#0B0B09] ${category === "book" ? "w-[120px] h-[160px] object-contain" : "w-[220px] h-[140px] object-cover"}`} />
        )}
        <div className="flex flex-col gap-3 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <label className={`${btn} ${busy ? "opacity-50 pointer-events-none" : ""}`}>
              <input type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" className="sr-only" onChange={pick} disabled={busy} aria-label={value ? "Replace photo" : "Choose a photo"} />
              {busy ? "Uploading…" : value ? "Replace photo" : "Choose a photo"}
            </label>
            {value && !busy && (
              <button type="button" onClick={() => { onChange(""); onAlt(""); }} className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-[var(--fg-4)] hover:text-red-400">
                Remove photo
              </button>
            )}
          </div>
          {error && <p role="alert" className="text-[13px] text-red-400">{error}</p>}
          <p className={hintClass}>
            {category === "book"
              ? "The book cover, shown whole beside the title on the cover image, the book page and LinkedIn previews."
              : "Shown beside the title on the cover image: in every list, on the page and in LinkedIn previews. JPG or PNG; large photos are made smaller automatically."}
            {" "}Save to see it on the site.
          </p>
          {value && (
            <div>
              <label htmlFor="f-coverAlt" className={labelClass}>What the photo shows (for screen readers)</label>
              <input id="f-coverAlt" value={alt} maxLength={200} onChange={(e) => onAlt(e.target.value)} placeholder="e.g. Nitin Nahata speaking at a panel in Mumbai" className={inputClass} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const LINK_LABEL: Partial<Record<Category, string>> = {
  essay: "LinkedIn post link (turns on “Discuss on LinkedIn”)",
  series: "LinkedIn post link (turns on “Discuss on LinkedIn”)",
  media: "Article link on the publisher's site",
  podcast: "Recording link (YouTube, Spotify…)",
};

const PROSE =
  "text-[15px] leading-[1.75] text-[var(--fg-2)] [&_p]:mb-4 [&_h2]:font-serif [&_h2]:text-[24px] [&_h2]:text-[var(--fg)] [&_h2]:mt-6 [&_h2]:mb-3 " +
  "[&_h3]:text-[19px] [&_h3]:text-[var(--fg)] [&_h3]:mt-5 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 " +
  "[&_blockquote]:border-l-2 [&_blockquote]:border-[#C9A24A] [&_blockquote]:pl-4 [&_blockquote]:italic [&_a]:text-[var(--accent)] [&_a]:underline";

/**
 * Add or edit one item (Fix Brief Part 7). Drafts: Save draft → Preview → Publish.
 * Live items: Save and update live, Preview, Unpublish.
 */
export default function ItemEditor({ item, series, live, everPublished }: {
  item: Partial<LibraryItem> & { category: Category };
  series: Series[];
  live: boolean;            // published right now
  everPublished: boolean;   // its web address is fixed
}) {
  const router = useRouter();
  const isNew = !item.slug;
  const [f, setF] = useState<ItemInput>(toInput(item));
  const [showPreview, setShowPreview] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string; path?: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pending, start] = useTransition();

  const set = <K extends keyof ItemInput>(k: K, v: ItemInput[K]) => setF((s) => ({ ...s, [k]: v }));
  const c = f.category;
  const slug = everPublished ? f.slug : slugify(f.slug || f.title);
  const path = slug ? itemPath({ category: c, slug, series: f.series } as LibraryItem) : "";

  function run(mode: "draft" | "publish" | "update", thenPreview = false) {
    setMsg(null);
    // A preview window opened right away (pop-up blockers allow it), then pointed at the page once saved
    const win = thenPreview ? window.open("about:blank", "_blank") : null;
    start(async () => {
      const r = await saveItem({ ...f, slug }, mode);
      if (!r.ok) { win?.close(); setMsg({ ok: false, text: r.error }); return; }
      const text = mode === "publish" ? "Published. It is live on the site now." : mode === "update" ? "Saved. The live page is updated." : "Saved as a draft. Only you can see it, in preview.";
      setMsg({ ok: true, text, path: r.path });
      if (win) win.location.href = `/api/studio/preview?path=${encodeURIComponent(r.path)}`;
      if (isNew || r.slug !== item.slug) router.replace(`/studio/edit/${r.slug}`);
      else router.refresh();
    });
  }

  function unpublish() {
    start(async () => {
      const r = await unpublishItem(item.slug!);
      setMsg(r.ok ? { ok: true, text: "Unpublished. It is a draft again and no longer on the site." } : { ok: false, text: r.error });
      router.refresh();
    });
  }

  function remove() {
    start(async () => {
      const r = await deleteItem(item.slug!);
      if (r.ok) router.push("/studio?deleted=1");
      else setMsg({ ok: false, text: r.error });
    });
  }

  const label = "block mb-1.5 font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--fg-4)]";
  const input = "w-full rounded-lg px-3.5 py-2.5 text-[15px] text-[var(--fg)] bg-[rgba(255,255,255,0.04)] border border-[var(--line-strong)] outline-none focus:border-[#C9A24A] placeholder:text-[var(--fg-5)]";
  const hint = "mt-1.5 text-[12.5px] leading-snug text-[var(--fg-5)]";
  const btn = "px-5 py-3 font-mono text-[11px] tracking-[0.16em] uppercase disabled:opacity-50";

  const field = (k: keyof ItemInput, l: string, opts: { ph?: string; type?: string; help?: string } = {}) => (
    <div>
      <label htmlFor={`f-${k}`} className={label}>{l}</label>
      <input id={`f-${k}`} type={opts.type ?? "text"} value={f[k] as string} placeholder={opts.ph} onChange={(e) => set(k, e.target.value as never)} className={input} />
      {opts.help && <p className={hint}>{opts.help}</p>}
    </div>
  );

  const needs: string[] = [];
  if ((c === "essay" || c === "series") && !f.body.trim() && !f.originalLink.trim()) needs.push("the full text (or a link)");
  if (c === "media" && !f.originalLink.trim()) needs.push("the article link");
  if (c === "podcast" && !f.embed.trim() && !f.originalLink.trim()) needs.push("a player or recording link");

  return (
    <div className="flex flex-col gap-6">
      {/* Category & title */}
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5">
        <div>
          <label htmlFor="f-category" className={label}>Category</label>
          <select id="f-category" value={c} disabled={everPublished} onChange={(e) => set("category", e.target.value as Category)} className={input} style={{ colorScheme: "dark" }}>
            {CATEGORY_ORDER.map((k) => <option key={k} value={k}>{CATEGORIES[k].label}</option>)}
          </select>
        </div>
        {field("title", "Title", { ph: "The title, as on LinkedIn or the publication" })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-5">
        <div>
          <label htmlFor="f-slug" className={label}>Web address</label>
          <input id="f-slug" value={everPublished ? f.slug : f.slug} disabled={everPublished} placeholder={slugify(f.title) || "made from the title"} onChange={(e) => set("slug", e.target.value)} className={input} />
          <p className={hint}>{path ? <>axionindex.org<span className="text-[var(--fg-3)]">{path}</span></> : "Made from the title."}{everPublished && " (fixed: it has been published)"}</p>
        </div>
        {field("date", "Date published", { type: "date", help: "Newest first in every list." })}
      </div>

      <div>
        <span className={label}>Theme</span>
        <div className="flex flex-wrap gap-2">
          {THEMES.map((t) => {
            const on = f.theme.includes(t);
            return (
              <label key={t} className={`cursor-pointer px-3.5 py-2 rounded-full border text-[13px] ${on ? "border-[#C9A24A] bg-[rgba(201,162,74,0.12)] text-[var(--fg)]" : "border-[var(--line-strong)] text-[var(--fg-4)]"}`}>
                <input type="checkbox" className="sr-only" checked={on} onChange={() => set("theme", on ? f.theme.filter((x) => x !== t) : [...f.theme, t])} />
                {t}
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="f-summary" className={label}>Two-line summary</label>
        <textarea id="f-summary" rows={2} value={f.summary} onChange={(e) => set("summary", e.target.value)} className={input} placeholder="In our words. Never copy the publisher's text." />
        <p className={hint}>{f.summary.length} characters · aim for under 200</p>
      </div>

      <PhotoField category={c} value={f.cover} alt={f.coverAlt} onChange={(v) => set("cover", v)} onAlt={(v) => set("coverAlt", v)}
        labelClass={label} inputClass={input} hintClass={hint} />

      {/* Category-specific fields */}
      {c === "series" && (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_160px] gap-5">
          <div>
            <label htmlFor="f-series" className={label}>Series</label>
            <select id="f-series" value={f.series} onChange={(e) => set("series", e.target.value)} className={input} style={{ colorScheme: "dark" }}>
              <option value="">Choose a series…</option>
              {series.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
            </select>
            <p className={hint}>Not in the list? <Link href="/studio/series" className="text-[var(--accent)] underline">Add a series</Link> first.</p>
          </div>
          {field("part", "Part number", { type: "number", ph: "1" })}
        </div>
      )}
      {c === "media" && field("publisher", "Publication", { ph: "e.g. ETHRWorld, People Matters" })}
      {LINK_LABEL[c] && field("originalLink", LINK_LABEL[c]!, { type: "url", ph: "https://…" })}
      {c === "podcast" && field("embed", "Player link (optional)", { type: "url", ph: "https://www.youtube.com/embed/…", help: "The embed address from YouTube or Spotify's Share → Embed. Shows the player on the page." })}
      {c === "report" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {field("kicker", "Small line above the title", { ph: "e.g. Axion Index Journal" })}
            <div>
              <label htmlFor="f-owner" className={label}>Owner</label>
              <select id="f-owner" value={f.owner} onChange={(e) => set("owner", e.target.value)} className={input} style={{ colorScheme: "dark" }}>
                <option value="axion">Axion Index (request form on the page)</option>
                <option value="ai-edge-lab">AI Edge Lab (points to its early-bird list)</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="f-inside" className={label}>What&apos;s inside (one point per line)</label>
            <textarea id="f-inside" rows={4} value={f.inside} onChange={(e) => set("inside", e.target.value)} className={input} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {field("author", "Author")}
            {field("site", "Report's own site (optional)", { ph: "/expertise/ai-edge or https://…" })}
          </div>
          {field("pdf", "Report PDF (link)", { type: "url", ph: "https://… or /reports/make-or-break.pdf", help: "Once the report is out, visitors get this after a short sign-up, and it goes in their email." })}
          <div>
            <label htmlFor="f-method" className={label}>Method</label>
            <textarea id="f-method" rows={3} value={f.method} onChange={(e) => set("method", e.target.value)} className={input} />
          </div>
        </>
      )}
      {c === "book" && field("statusLine", "Status line", { ph: "e.g. In writing, due 2027" })}

      {(c === "essay" || c === "series") && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="f-body" className={label + " mb-0"}>Full text</label>
            <button type="button" onClick={() => setShowPreview((v) => !v)} className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--accent)]">
              {showPreview ? "Edit text" : "Show formatted"}
            </button>
          </div>
          {showPreview ? (
            <div data-lenis-prevent className={`${PROSE} rounded-lg border border-[var(--line-strong)] p-5 min-h-[320px]`} dangerouslySetInnerHTML={{ __html: markdownToHtml(f.body) || "<p>Nothing yet.</p>" }} />
          ) : (
            <textarea data-lenis-prevent id="f-body" rows={16} value={f.body} onChange={(e) => set("body", e.target.value)} className={`${input} font-mono text-[13.5px] leading-relaxed`}
              placeholder={"Paste the post here.\n\nA blank line starts a new paragraph.\n## A heading\n- a list item\n> a quote\n**bold**  *italic*  [a link](https://…)"} />
          )}
          <p className={hint}>Paste the text from LinkedIn and keep the wording as published.</p>
        </div>
      )}

      {needs.length > 0 && (
        <p className="text-[13px] text-[#E0B25A]">To appear on the site once published, this still needs {needs.join(" and ")}.</p>
      )}

      {/* Actions */}
      <div className="sticky bottom-0 -mx-1 px-1 py-4 bg-[var(--bg)] border-t border-[var(--line)] flex flex-wrap items-center gap-3">
        {live ? (
          <>
            <button type="button" disabled={pending} onClick={() => run("update")} className={`${btn} bg-[#C9A24A] text-[#0A0A0B] font-semibold`}>Save and update live</button>
            <button type="button" disabled={pending} onClick={() => run("update", true)} className={`${btn} border border-[var(--line-strong)] text-[var(--fg-2)]`}>Save and preview</button>
            <button type="button" disabled={pending} onClick={unpublish} className={`${btn} text-[var(--fg-4)]`}>Unpublish</button>
          </>
        ) : (
          <>
            <button type="button" disabled={pending} onClick={() => run("draft")} className={`${btn} border border-[var(--line-strong)] text-[var(--fg-2)]`}>Save draft</button>
            <button type="button" disabled={pending} onClick={() => run("draft", true)} className={`${btn} border border-[var(--line-strong)] text-[var(--fg-2)]`}>Preview</button>
            <button type="button" disabled={pending} onClick={() => run("publish")} className={`${btn} bg-[#C9A24A] text-[#0A0A0B] font-semibold`}>Publish</button>
          </>
        )}
        {!isNew && (confirmDelete ? (
          <span className="flex items-center gap-2 text-[13px] text-[var(--fg-3)]">
            Delete for good?
            <button type="button" disabled={pending} onClick={remove} className="text-red-400 underline">Yes, delete</button>
            <button type="button" onClick={() => setConfirmDelete(false)} className="underline">No</button>
          </span>
        ) : (
          <button type="button" onClick={() => setConfirmDelete(true)} className={`${btn} text-red-400/80 ml-auto`}>Delete</button>
        ))}
        {pending && <span className="text-[13px] text-[var(--fg-4)]">Saving…</span>}
        {msg && (
          <p role="status" className={`w-full text-[14px] ${msg.ok ? "text-[#7FD1AE]" : "text-red-400"}`}>
            {msg.text}{" "}
            {msg.ok && msg.path && live && <a href={msg.path} target="_blank" rel="noopener noreferrer" className="underline">View on site ↗</a>}
          </p>
        )}
      </div>
    </div>
  );
}
