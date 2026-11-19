"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { AuthError } from "next-auth";
import { auth, signIn, signOut } from "@/auth";
import dbConnect from "@/lib/db";
import LibraryItemModel from "@/models/LibraryItem";
import LibrarySeriesModel from "@/models/LibrarySeries";
import { LIBRARY_TAG, libraryMeta, loadLibraryFresh } from "@/content/store";
import { CATEGORIES, THEMES, itemPath, slugify, type Category, type LibraryItem, type Theme } from "@/content/library";
import { dropPhotoIfUnused, isCoverPath } from "@/lib/libraryImages";

/**
 * The Studio's actions (Fix Brief Part 7): save, preview, publish. Every change is live on the
 * site straight away; no developer, no rebuild. Only signed-in editors and admins can call these.
 */

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

async function requireEditor(): Promise<string> {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || (role !== "editor" && role !== "admin")) throw new Error("Please sign in to the Studio again.");
  return session.user.email ?? "editor";
}

/**
 * First save ever: copy the starting data (library.json + texts) into the database, so nothing is lost.
 * Then mark the library as filled, so deleting items (even all of them) never brings the starting data back.
 */
let markedSeeded = false;
async function ensureSeeded() {
  await dbConnect();
  if (markedSeeded) return;
  const seeded = await libraryMeta().findOne({ _id: "seeded" });
  if (seeded || (await LibraryItemModel.estimatedDocumentCount()) > 0) {
    if (!seeded) await libraryMeta().updateOne({ _id: "seeded" }, { $setOnInsert: { at: new Date() } }, { upsert: true });
    markedSeeded = true;
    return;
  }
  const lib = await loadLibraryFresh(); // the database is empty and was never filled: this is the starting data
  const now = new Date();
  await LibrarySeriesModel.insertMany(lib.series.map((s) => ({ ...s })), { ordered: false }).catch(() => {});
  await LibraryItemModel.insertMany(
    lib.items.map(({ seriesName: _n, ...i }) => ({ ...i, draft: !!i.draft, publishedAt: i.draft ? undefined : now, updatedBy: "starting data" })),
    { ordered: false },
  ).catch(() => {});
  await libraryMeta().updateOne({ _id: "seeded" }, { $setOnInsert: { at: new Date() } }, { upsert: true });
  markedSeeded = true;
}

/** Show the change on the site now: drop the cached library and every cached page. */
function refreshSite(slug?: string) {
  revalidateTag(LIBRARY_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/cover/${slug}`); // its cover / share image
}

const isHttps = (v: string) => /^https:\/\/[^\s]+$/.test(v);
const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export type ItemInput = {
  originalSlug?: string;           // empty when new
  category: Category;
  title: string;
  slug: string;
  date: string;
  theme: string[];
  summary: string;
  body: string;
  series: string;
  part: string;
  originalLink: string;
  format: string;                  // essays and series parts: "post", "article" or empty
  publisher: string;
  kicker: string;
  inside: string;                  // one point per line
  author: string;
  method: string;
  site: string;
  pdf: string;
  owner: string;
  embed: string;
  statusLine: string;
  cover: string;                   // photo: "/uploads/<id>.jpg" from the upload, or empty
  coverAlt: string;
};

/** Check and tidy what the editor typed. Returns the fields to store, or the first problem in plain words. */
function validate(input: ItemInput): { ok: true; item: Omit<LibraryItem, "draft"> } | { ok: false; error: string } {
  const category = input.category;
  if (!(category in CATEGORIES)) return { ok: false, error: "Choose a category." };
  const title = str(input.title, 200);
  if (title.length < 2) return { ok: false, error: "Add a title." };
  const slug = slugify(str(input.slug, 80) || title);
  if (!slug) return { ok: false, error: "The web address needs letters or numbers." };
  const date = str(input.date, 10);
  if (date && !isDate(date)) return { ok: false, error: "The date should look like 2026-11-20." };
  const theme = (input.theme ?? []).filter((t): t is Theme => (THEMES as readonly string[]).includes(t));
  const summary = str(input.summary, 400);
  const body = typeof input.body === "string" ? input.body.replace(/\r\n/g, "\n").slice(0, 100_000) : "";
  const originalLink = str(input.originalLink, 500);
  if (originalLink && !isHttps(originalLink)) return { ok: false, error: "The original link should start with https://" };
  const embed = str(input.embed, 500);
  if (embed && !isHttps(embed)) return { ok: false, error: "The player link should start with https://" };
  const site = str(input.site, 300);
  if (site && !isHttps(site) && !/^\/[\w\-/#?=&]*$/.test(site)) return { ok: false, error: "The report's own site should be a page on this site (/…) or start with https://" };
  const pdf = str(input.pdf, 500);
  if (pdf && !isHttps(pdf) && !/^\/[\w\-./]*\.pdf$/i.test(pdf)) return { ok: false, error: "The report PDF should be a link starting with https:// (or a /….pdf file on this site)." };

  const cover = str(input.cover, 300);
  if (cover && !isCoverPath(cover)) return { ok: false, error: "The photo could not be used. Please upload it again." };
  const coverAlt = str(input.coverAlt, 200);

  const item: Omit<LibraryItem, "draft"> = { slug, category, title, date: date || null, theme, summary };
  if (cover) { item.cover = cover; if (coverAlt) item.coverAlt = coverAlt; }
  if (body.trim() && (category === "essay" || category === "series")) item.body = body;
  if (originalLink) item.originalLink = originalLink;
  if ((category === "essay" || category === "series") && (input.format === "post" || input.format === "article")) item.format = input.format;

  if (category === "series") {
    const series = str(input.series, 80);
    if (!series) return { ok: false, error: "Choose which series this part belongs to." };
    item.series = series;
    const part = parseInt(input.part, 10);
    if (input.part && (!Number.isFinite(part) || part < 1)) return { ok: false, error: "The part number should be 1, 2, 3…" };
    if (Number.isFinite(part)) item.part = part;
  }
  if (category === "media") {
    item.publisher = str(input.publisher, 120);
    if (!item.publisher) return { ok: false, error: "Add the publication's name." };
  }
  if (category === "report") {
    const kicker = str(input.kicker, 120);
    if (kicker) item.kicker = kicker;
    const inside = (input.inside ?? "").split("\n").map((l) => l.replace(/^[-•*]\s*/, "").trim()).filter(Boolean).slice(0, 12);
    if (inside.length) item.inside = inside;
    const author = str(input.author, 200);
    if (author) item.author = author;
    const method = str(input.method, 1500);
    if (method) item.method = method;
    if (site) item.site = site;
    if (pdf) item.pdf = pdf;
    item.owner = input.owner === "ai-edge-lab" ? "ai-edge-lab" : "axion";
  }
  if (category === "podcast" && embed) item.embed = embed;
  if (category === "book") {
    const statusLine = str(input.statusLine, 200);
    if (statusLine) item.statusLine = statusLine;
  }
  return { ok: true, item };
}

/**
 * Save an item. `mode`: "draft" keeps or makes it a draft, "publish" puts it live,
 * "update" saves a live item and keeps it live.
 */
export async function saveItem(input: ItemInput, mode: "draft" | "publish" | "update"): Promise<Result<{ slug: string; path: string }>> {
  try {
    const editor = await requireEditor();
    const v = validate(input);
    if (!v.ok) return v;
    await ensureSeeded();

    const original = input.originalSlug ? await LibraryItemModel.findOne({ slug: input.originalSlug }).lean<{ slug: string; publishedAt?: Date; draft?: boolean; cover?: string }>() : null;
    if (input.originalSlug && !original) return { ok: false, error: "This item no longer exists. Reload the Studio." };
    // A published address must not change: links to it would break
    const slug = original?.publishedAt ? original.slug : v.item.slug;
    if (slug !== original?.slug && (await LibraryItemModel.exists({ slug }))) {
      return { ok: false, error: `Another item already uses the address "${slug}". Change the title or the address.` };
    }
    if (v.item.category === "series" && !(await LibrarySeriesModel.exists({ slug: v.item.series }))) {
      return { ok: false, error: "That series does not exist yet. Add it on the Series page first." };
    }

    const draft = mode === "draft" ? true : mode === "publish" ? false : !!original?.draft;
    const doc = {
      ...v.item,
      slug,
      draft,
      updatedBy: editor,
      ...(!draft && !original?.publishedAt ? { publishedAt: new Date() } : {}),
    };
    // Clear fields that no longer apply (e.g. a body removed, a category changed)
    const unset = Object.fromEntries(
      ["body", "series", "part", "originalLink", "format", "publisher", "cover", "coverAlt", "kicker", "inside", "author", "method", "site", "pdf", "owner", "embed", "statusLine"]
        .filter((k) => !(k in doc)).map((k) => [k, ""]),
    );
    if (original) await LibraryItemModel.updateOne({ slug: original.slug }, { $set: doc, $unset: unset });
    else await LibraryItemModel.create(doc);
    // A replaced or removed photo is deleted once nothing uses it
    if (original?.cover && original.cover !== doc.cover) await dropPhotoIfUnused(original.cover);

    refreshSite(slug);
    return { ok: true, slug, path: itemPath({ ...v.item, slug, draft } as LibraryItem) };
  } catch (err) {
    console.error("[STUDIO saveItem]", err);
    return { ok: false, error: err instanceof Error ? err.message : "Could not save. Please try again." };
  }
}

export async function unpublishItem(slug: string): Promise<Result> {
  try {
    await requireEditor();
    await ensureSeeded();
    await LibraryItemModel.updateOne({ slug }, { $set: { draft: true } });
    refreshSite(slug);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not unpublish." };
  }
}

export async function deleteItem(slug: string): Promise<Result> {
  try {
    await requireEditor();
    await ensureSeeded();
    const gone = await LibraryItemModel.findOneAndDelete({ slug }).lean<{ cover?: string }>();
    if (gone?.cover) await dropPhotoIfUnused(gone.cover);
    refreshSite(slug);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not delete." };
  }
}

export async function saveSeries(input: { originalSlug?: string; name: string; slug: string; summary: string; theme: string[] }): Promise<Result<{ slug: string }>> {
  try {
    await requireEditor();
    const name = str(input.name, 120);
    if (name.length < 2) return { ok: false, error: "Add the series name." };
    await ensureSeeded();
    const original = input.originalSlug ? await LibrarySeriesModel.findOne({ slug: input.originalSlug }).lean<{ slug: string }>() : null;
    // A series' address stays the same once it exists (its parts' addresses use it)
    const slug = original ? original.slug : slugify(str(input.slug, 80) || name);
    if (!original && (await LibrarySeriesModel.exists({ slug }))) return { ok: false, error: `A series with the address "${slug}" already exists.` };
    const theme = (input.theme ?? []).filter((t) => (THEMES as readonly string[]).includes(t));
    const doc = { slug, name, summary: str(input.summary, 400), theme };
    if (original) await LibrarySeriesModel.updateOne({ slug }, { $set: doc });
    else await LibrarySeriesModel.create(doc);
    refreshSite();
    return { ok: true, slug };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not save the series." };
  }
}

export async function deleteSeries(slug: string): Promise<Result> {
  try {
    await requireEditor();
    await ensureSeeded();
    if (await LibraryItemModel.exists({ series: slug })) return { ok: false, error: "This series still has parts. Move or delete them first." };
    await LibrarySeriesModel.deleteOne({ slug });
    refreshSite();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not delete the series." };
  }
}

/** Studio sign-in (editors and admins). */
export async function studioSignIn(_prev: string | undefined, form: FormData): Promise<string | undefined> {
  const callbackUrl = String(form.get("callbackUrl") || "/studio");
  try {
    await signIn("credentials", {
      email: String(form.get("email") || "").trim().toLowerCase(),
      password: String(form.get("password") || ""),
      redirectTo: callbackUrl.startsWith("/studio") ? callbackUrl : "/studio",
    });
  } catch (err) {
    if (err instanceof AuthError) return "That email and password don't match a Studio account.";
    throw err; // the redirect after a successful sign-in
  }
}

export async function studioSignOut() {
  await signOut({ redirectTo: "/studio/login" });
}
