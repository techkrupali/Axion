import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { unstable_cache } from "next/cache";
import { draftMode } from "next/headers";
import dbConnect from "@/lib/db";
import LibraryItemModel from "@/models/LibraryItem";
import LibrarySeriesModel from "@/models/LibrarySeries";
import type { Library, LibraryItem, Series } from "@/content/library";
import seed from "./library.json";

/**
 * Where the library comes from (Fix Brief Part 7). Server only.
 *  • The Studio (/studio) saves items in MongoDB; that is the source.
 *  • Published pages read a cached copy, refreshed the moment the Studio publishes (tag "library").
 *  • Preview (draft mode, opened from the Studio) reads the latest data, drafts included.
 *  • Until the database has been filled (scripts/seed-library.mjs), library.json is used.
 */
export const LIBRARY_TAG = "library";

const FIELDS = ["slug", "category", "title", "date", "theme", "summary", "body", "series", "part", "originalLink", "publisher", "cover", "kicker", "inside", "author", "method", "site", "pdf", "owner", "embed", "statusLine", "draft"] as const;

/** A plain object with only the item's fields (no database ids or dates). */
function plainItem(raw: Record<string, unknown>): LibraryItem {
  const out: Record<string, unknown> = {};
  for (const k of FIELDS) if (raw[k] !== undefined && raw[k] !== null && raw[k] !== "") out[k] = raw[k];
  out.date = typeof raw.date === "string" && raw.date ? raw.date : null;
  out.theme = Array.isArray(raw.theme) ? raw.theme : [];
  out.summary = typeof raw.summary === "string" ? raw.summary : "";
  return out as LibraryItem;
}
const plainSeries = (raw: Record<string, unknown>): Series => ({
  slug: String(raw.slug), name: String(raw.name), summary: String(raw.summary ?? ""), theme: (Array.isArray(raw.theme) ? raw.theme : []) as Series["theme"],
});

/** Starting data: library.json, with essay texts from src/content/texts/<slug>.md. */
function fromFiles(): Library {
  const dir = join(process.cwd(), "src/content/texts");
  const items = (seed.items as Record<string, unknown>[]).map((i) => {
    const file = join(dir, `${i.slug}.md`);
    return plainItem({ ...i, body: existsSync(file) ? readFileSync(file, "utf8") : "" });
  });
  return { items, series: (seed.series as Record<string, unknown>[]).map(plainSeries) };
}

async function fromDb(): Promise<Library | null> {
  if (!process.env.MONGODB_URI) return null;
  await dbConnect();
  const [items, series] = await Promise.all([LibraryItemModel.find().lean(), LibrarySeriesModel.find().lean()]);
  if (!items.length) return null; // not filled yet
  return {
    items: (items as Record<string, unknown>[]).map(plainItem),
    series: (series as Record<string, unknown>[]).map(plainSeries),
  };
}

function withSeriesNames(lib: Library): Library {
  const names = new Map(lib.series.map((s) => [s.slug, s.name]));
  return { ...lib, items: lib.items.map((i) => (i.series && names.has(i.series) ? { ...i, seriesName: names.get(i.series) } : i)) };
}

async function load(): Promise<Library> {
  try {
    const db = await fromDb();
    if (db) return withSeriesNames(db);
  } catch (err) {
    console.error("[LIBRARY] database unavailable, using library.json:", err);
  }
  return withSeriesNames(fromFiles());
}

/** The library as published, cached until the Studio publishes a change. */
export const getLibrary = unstable_cache(load, ["axion-library-v1"], { tags: [LIBRARY_TAG] });

/** For pages: the published library, or in preview the latest data with drafts shown. */
export async function libraryForPage(): Promise<Library> {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return getLibrary();
  const lib = await load();
  return { ...lib, items: lib.items.map((i) => ({ ...i, draft: false })) };
}

/** Fresh, uncached, drafts included: for the Studio. */
export const loadLibraryFresh = load;
