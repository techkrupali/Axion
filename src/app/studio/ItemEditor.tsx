"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, ImagePlus, Trash2 } from "lucide-react";
import { CATEGORIES, CATEGORY_ORDER, THEMES, itemPath, slugify, type Category, type LibraryItem, type Series } from "@/content/library";
import { markdownToHtml } from "@/lib/markdown";
import { deleteItem, saveItem, unpublishItem, type ItemInput } from "./actions";
import ConfirmDialog from "./ConfirmDialog";
import { StatusBadge, savedBy, shortDate, ui } from "./ui";

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

  const btn = `${ui.secondary} cursor-pointer focus-within:border-[#C9A24A] focus-within:outline focus-within:outline-1 focus-within:outline-[#C9A24A]`;
  return (
    <div>
      <span className={labelClass}>Photo (optional)</span>
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className={`border border-[rgba(240,241,245,0.12)] bg-[#0B0B09] ${category === "book" ? "w-[120px] h-[160px] object-contain" : "w-[220px] h-[140px] object-cover"}`} />
        ) : (
          <span aria-hidden className={`flex items-center justify-center border border-dashed border-[rgba(240,241,245,0.16)] text-[var(--fg-5)] ${category === "book" ? "w-[120px] h-[160px]" : "w-[220px] h-[140px]"}`}>
            <ImagePlus size={24} strokeWidth={1.3} />
          </span>
        )}
        <div className="flex flex-col gap-3 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <label className={`${btn} ${busy ? "opacity-50 pointer-events-none" : ""}`}>
              <input type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" className="sr-only" onChange={pick} disabled={busy} aria-label={value ? "Replace photo" : "Choose a photo"} />
              {busy ? "Uploading…" : value ? "Replace photo" : "Choose a photo"}
            </label>
            {value && !busy && (
              <button type="button" onClick={() => { onChange(""); onAlt(""); }} className={`${ui.quiet} hover:text-[#E8877B]`}>
                Remove photo
              </button>
            )}
          </div>
          {error && <p role="alert" className="text-[13px] text-red-400">{error}</p>}
          <p className={hintClass}>
            {category === "book"
              ? "The book cover. The whole photo becomes the cover: on the book page, in lists and in LinkedIn previews."
              : "The whole photo becomes the cover: in every list, on the page and in LinkedIn previews. JPG or PNG; large photos are made smaller automatically."}
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
  essay: "LinkedIn post link",
  series: "LinkedIn post link",
  media: "Article link on the publisher's site",
  podcast: "Recording link (YouTube, Spotify…)",
};

const PROSE =
  "text-[15.5px] leading-[1.8] text-[var(--fg-2)] [&_p]:mb-4 [&_h2]:font-display [&_h2]:text-[26px] [&_h2]:text-[var(--fg)] [&_h2]:mt-6 [&_h2]:mb-3 " +
  "[&_h3]:font-display [&_h3]:text-[21px] [&_h3]:text-[var(--fg)] [&_h3]:mt-5 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 " +
  "[&_blockquote]:border-l [&_blockquote]:border-[#C9A24A] [&_blockquote]:pl-4 [&_blockquote]:font-display [&_blockquote]:text-[21px] [&_blockquote]:italic [&_a]:text-[var(--accent)] [&_a]:underline";

/** One block of the form, with a serif heading. */
function Section({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section className={`${ui.panel} p-6 sm:p-8`}>
      <h2 className="font-display font-medium text-[25px] leading-none text-[var(--fg)]">{title}</h2>
      {intro && <p className="text-[13.5px] leading-snug text-[var(--fg-5)] mt-2.5">{intro}</p>}
      <div className="mt-7 flex flex-col gap-6">{children}</div>
    </section>
  );
}

/**
 * Add or edit one item (Fix Brief Part 7). Drafts: Save draft → Preview → Publish.
 * Live items: Save and update live, Preview, Unpublish. Delete asks first.
 */
export default function ItemEditor({ item, series, live, everPublished, visible = true, meta }: {
  item: Partial<LibraryItem> & { category: Category };
  series: Series[];
  live: boolean;            // published right now
  everPublished: boolean;   // its web address is fixed
  visible?: boolean;        // published and has what it needs to show
  meta?: { updatedAt?: string; updatedBy?: string };
}) {
  const router = useRouter();
  const isNew = !item.slug;
  const [f, setF] = useState<ItemInput>(toInput(item));
  const [showPreview, setShowPreview] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string; path?: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");
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
      const text = mode === "publish" ? "Published. It is live on the website now." : mode === "update" ? "Saved. The live page is updated." : "Saved as a draft. Only you can see it, in preview.";
      setMsg({ ok: true, text, path: r.path });
      if (win) win.location.href = `/api/studio/preview?path=${encodeURIComponent(r.path)}`;
      if (isNew || r.slug !== item.slug) router.replace(`/studio/edit/${r.slug}`);
      else router.refresh();
    });
  }

  function unpublish() {
    start(async () => {
      const r = await unpublishItem(item.slug!);
      setMsg(r.ok ? { ok: true, text: "Unpublished. It is a draft again and no longer on the website." } : { ok: false, text: r.error });
      router.refresh();
    });
  }

  function remove() {
    setDeleteError("");
    start(async () => {
      const r = await deleteItem(item.slug!);
      if (r.ok) router.push("/studio?deleted=1");
      else setDeleteError(r.error);
    });
  }
  const closeDelete = useCallback(() => { setConfirmDelete(false); setDeleteError(""); }, []);

  const { label, input, hint } = ui;

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

  const status = !live ? "draft" : visible ? "live" : "hidden";

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-6 xl:gap-8 items-start">
      <div className="flex flex-col gap-6 min-w-0">
        <Section title="The basics" intro="What it is, its title and where it lives on the website.">
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
              <input id="f-slug" value={f.slug} disabled={everPublished} placeholder={slugify(f.title) || "made from the title"} onChange={(e) => set("slug", e.target.value)} className={input} />
              <p className={`${hint} [overflow-wrap:anywhere]`}>{path ? <>axionindex.org<span className="text-[var(--fg-3)]">{path}</span></> : "Made from the title."}{everPublished && " · fixed, because it has been published"}</p>
            </div>
            {field("date", "Date published", { type: "date", help: "Newest first in every list." })}
          </div>

          <div>
            <span className={label}>Theme</span>
            <div className="flex flex-wrap gap-2">
              {THEMES.map((t) => {
                const on = f.theme.includes(t);
                return (
                  <label key={t} className={ui.chip(on)}>
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
            <p className={hint}>{f.summary.length} characters · aim for under 200 · shown under the title</p>
          </div>
        </Section>

        {c === "series" && (
          <Section title="Series" intro="Which series it belongs to, and its place in it.">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_160px] gap-5">
              <div>
                <label htmlFor="f-series" className={label}>Series</label>
                <select id="f-series" value={f.series} onChange={(e) => set("series", e.target.value)} className={input} style={{ colorScheme: "dark" }}>
                  <option value="">Choose a series…</option>
                  {series.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
                </select>
                <p className={hint}>Not in the list? <Link href="/studio/series" className="text-[var(--accent)] underline">Add a series</Link> first.</p>
              </div>
              {field("part", "Part number", { type: "number", ph: "1", help: "Leave empty for a lead-in." })}
            </div>
          </Section>
        )}

        {(LINK_LABEL[c] || c === "media") && (
          <Section
            title={c === "media" ? "Publication" : c === "podcast" ? "Recording" : "Where it was published"}
            intro={c === "essay" || c === "series" ? "The LinkedIn post. It turns on “Read it on LinkedIn”, and “Join the conversation” when the full text is here." : undefined}>
            {c === "media" && field("publisher", "Publication", { ph: "e.g. ETHRWorld, People Matters" })}
            {LINK_LABEL[c] && field("originalLink", LINK_LABEL[c]!, { type: "url", ph: "https://…" })}
            {c === "podcast" && field("embed", "Player link (optional)", { type: "url", ph: "https://www.youtube.com/embed/…", help: "The embed address from YouTube or Spotify's Share → Embed. Shows the player on the page." })}
          </Section>
        )}

        {c === "report" && (
          <Section title="Report details" intro="What the report page shows: the line above the title, what's inside, author and method.">
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
          </Section>
        )}

        {c === "book" && (
          <Section title="Book">
            {field("statusLine", "Status line", { ph: "e.g. In writing, due 2027" })}
          </Section>
        )}

        <Section title="Photo" intro="Optional. With a photo, the whole photo is the cover. Without one, a cover is made from the title.">
          <PhotoField category={c} value={f.cover} alt={f.coverAlt} onChange={(v) => set("cover", v)} onAlt={(v) => set("coverAlt", v)}
            labelClass={label} inputClass={input} hintClass={hint} />
        </Section>

        {(c === "essay" || c === "series") && (
          <Section title="Full text" intro="Paste the text from LinkedIn and keep the wording as published. Optional: without it, the page links to LinkedIn.">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="f-body" className={`${label} mb-0`}>Text</label>
                <button type="button" onClick={() => setShowPreview((v) => !v)} className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--accent)] hover:text-[#D6B35E]">
                  {showPreview ? "Edit text" : "Show formatted"}
                </button>
              </div>
              {showPreview ? (
                <div data-lenis-prevent className={`${PROSE} border border-[rgba(240,241,245,0.12)] bg-[#111113] p-6 min-h-[320px]`} dangerouslySetInnerHTML={{ __html: markdownToHtml(f.body) || "<p>Nothing yet.</p>" }} />
              ) : (
                <textarea data-lenis-prevent id="f-body" rows={18} value={f.body} onChange={(e) => set("body", e.target.value)} className={`${input} font-mono text-[13.5px] leading-relaxed`}
                  placeholder={"Paste the post here.\n\nA blank line starts a new paragraph.\n## A heading\n- a list item\n> a quote\n**bold**  *italic*  [a link](https://…)"} />
              )}
              <p className={hint}>{f.body.trim() ? `${f.body.trim().split(/\s+/).length} words` : "A blank line starts a new paragraph."}</p>
            </div>
          </Section>
        )}

        {/* Phones and tablets: the main action stays in reach while scrolling */}
        <div className="xl:hidden sticky bottom-0 z-20 -mx-4 sm:mx-0 px-4 py-3 border-t sm:border border-[rgba(240,241,245,0.1)] bg-[rgba(14,14,16,0.97)] backdrop-blur flex items-center gap-3 shadow-[0_-12px_40px_rgba(0,0,0,0.5)]">
          {!isNew && <StatusBadge status={status} />}
          <span className="ml-auto flex gap-2">
            {live ? (
              <button type="button" disabled={pending} onClick={() => run("update")} className={`${ui.primary} h-10 px-4`}>{pending ? "Saving…" : "Save and update live"}</button>
            ) : (
              <>
                <button type="button" disabled={pending} onClick={() => run("draft")} className={`${ui.secondary} h-10 px-4`}>Save draft</button>
                <button type="button" disabled={pending} onClick={() => run("publish")} className={`${ui.primary} h-10 px-4`}>Publish</button>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Publish panel: beside the form on wide screens; after the form on smaller ones (the slim bar above stays pinned) */}
      <aside aria-label="Publish" className="xl:sticky xl:top-8">
        <div className={`${ui.panel} p-5 xl:p-6`}>
          <div className="flex items-center justify-between gap-3">
            <span className="hidden xl:block font-display font-medium text-[22px] leading-none text-[var(--fg)]">Publish</span>
            {!isNew ? <StatusBadge status={status} /> : <span className={`${ui.mono} text-[var(--fg-5)]`}>Not saved yet</span>}
            {live && visible && path && (
              <a href={path} target="_blank" rel="noopener noreferrer" className="xl:hidden inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--fg-4)] hover:text-[var(--fg)]">
                View <ArrowUpRight size={13} aria-hidden />
              </a>
            )}
          </div>

          <div className="hidden xl:block mt-5 pt-5 border-t border-[rgba(240,241,245,0.08)] text-[13px] leading-[1.6] text-[var(--fg-4)]">
            {path && <p className="[overflow-wrap:anywhere]"><span className="text-[var(--fg-5)]">Address </span>{path}</p>}
            {meta?.updatedAt && <p className="mt-1"><span className="text-[var(--fg-5)]">Last saved </span>{shortDate(meta.updatedAt)}{savedBy(meta.updatedBy) ? ` · ${savedBy(meta.updatedBy)}` : ""}</p>}
            {live && visible && path && (
              <a href={path} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-[var(--accent)] hover:underline">
                View on the website <ArrowUpRight size={14} aria-hidden />
              </a>
            )}
          </div>

          <div className="mt-4 xl:mt-6 flex flex-wrap xl:flex-col gap-2.5 xl:gap-3 xl:[&>button]:w-full">
            {live ? (
              <>
                <button type="button" disabled={pending} onClick={() => run("update")} className={ui.primary}>Save and update live</button>
                <button type="button" disabled={pending} onClick={() => run("update", true)} className={ui.secondary}>Save and preview</button>
                <button type="button" disabled={pending} onClick={unpublish} className={ui.quiet}>Unpublish</button>
              </>
            ) : (
              <>
                <button type="button" disabled={pending} onClick={() => run("publish")} className={ui.primary}>Publish</button>
                <button type="button" disabled={pending} onClick={() => run("draft")} className={ui.secondary}>Save draft</button>
                <button type="button" disabled={pending} onClick={() => run("draft", true)} className={ui.secondary}>Preview</button>
              </>
            )}
            {!isNew && (
              <button type="button" disabled={pending} onClick={() => { setDeleteError(""); setConfirmDelete(true); }} aria-label="Delete this item"
                className={`${ui.quiet} xl:hidden ml-auto hover:text-[#E8877B]`}>
                <Trash2 size={15} strokeWidth={1.6} aria-hidden />
              </button>
            )}
          </div>

          {pending && <p className="mt-3 text-[13px] text-[var(--fg-4)]">Saving…</p>}
          {msg && (
            <p role="status" className={`mt-3 text-[13.5px] leading-snug ${msg.ok ? "text-[#8FDDB6]" : "text-[#E8877B]"}`}>
              {msg.text}{" "}
              {msg.ok && msg.path && live && <a href={msg.path} target="_blank" rel="noopener noreferrer" className="underline">View ↗</a>}
            </p>
          )}
          {needs.length > 0 && (
            <p className="mt-3 text-[13px] leading-snug text-[#E8C27A]">To show on the website once published, it still needs {needs.join(" and ")}.</p>
          )}

          {!isNew && (
            <div className="hidden xl:block mt-6 pt-5 border-t border-[rgba(240,241,245,0.08)]">
              <button type="button" disabled={pending} onClick={() => { setDeleteError(""); setConfirmDelete(true); }}
                className="inline-flex items-center gap-2 text-[13px] text-[var(--fg-5)] hover:text-[#E8877B] transition-colors">
                <Trash2 size={14} strokeWidth={1.6} aria-hidden /> Delete this item
              </button>
            </div>
          )}
        </div>
      </aside>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this item?"
        confirmLabel="Delete for good"
        busy={pending}
        error={deleteError}
        onConfirm={remove}
        onCancel={closeDelete}
      >
        <span className="block mb-3 font-display text-[19px] leading-snug text-[var(--fg)] [overflow-wrap:anywhere]">{f.title || item.title}</span>
        {live
          ? "It comes off the website straight away: its page, every list it appears in, and the sitemap. This cannot be undone."
          : "The draft is removed for good. This cannot be undone."}
        {live && <span className="block mt-2 text-[var(--fg-4)]">To take it down but keep it, choose Unpublish instead.</span>}
      </ConfirmDialog>
    </div>
  );
}
