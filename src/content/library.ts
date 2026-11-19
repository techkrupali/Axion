/**
 * The Axion Index library (Fix Brief Part 3): Reports, and Articles & Publications.
 * Types and pure helpers only: safe in the browser too. The data comes from the Studio
 * (MongoDB) through src/content/store.ts; library.json is only the starting data. See README.md.
 */

export const THEMES = ["AI & work", "People Architecture", "Governance", "Labour Codes", "Founder doctrine"] as const;
export type Theme = (typeof THEMES)[number];

export type Category = "report" | "series" | "essay" | "media" | "podcast" | "book";

// `meta`: the description Google shows, where the on-page `blurb` is too short for it (SEO-02, 17 Nov)
export const CATEGORIES: Record<Category, { label: string; plural: string; path: string; blurb: string; meta?: string }> = {
  report:  { label: "Report",          plural: "Reports",          path: "/reports",               blurb: "Long research pieces, each with its own page and a form to get the report." },
  series:  { label: "Series",          plural: "Series",           path: "/publications/series",   blurb: "Multi-part series by Nitin Nahata, best read in order.", meta: "Multi-part series by Nitin Nahata, founder of Axion Index, on AI and work, people architecture and governance. Best read in order." },
  essay:   { label: "Essay",           plural: "Essays",           path: "/publications/essays",   blurb: "Single pieces by Nitin Nahata, published here in full.", meta: "Essays by Nitin Nahata, founder of Axion Index, on AI and work, governance and people architecture. Each links to its LinkedIn conversation." },
  media:   { label: "In the media",    plural: "In the media",     path: "/publications/media",    blurb: "Articles by and interviews with Nitin Nahata in other publications. Read them on the publisher's site." },
  podcast: { label: "Podcast or talk", plural: "Podcasts & talks", path: "/publications/podcasts", blurb: "Conversations and talks, with the recording on the page.", meta: "Podcasts and talks with Nitin Nahata, founder of Axion Index, on AI and work and people architecture, with the recording on each page." },
  book:    { label: "Book",            plural: "Book",             path: "/publications/book",     blurb: "Baptism by Chaos, Nitin Nahata's book." },
};

/** Order of categories on the hub. */
export const CATEGORY_ORDER: Category[] = ["report", "series", "essay", "media", "podcast", "book"];

export type LibraryItem = {
  slug: string;
  category: Category;
  title: string;
  date: string | null;          // YYYY-MM-DD
  theme: Theme[];
  summary: string;              // the 2-line summary we write
  series?: string;              // series slug (series parts only)
  part?: number;                // order within the series
  originalLink?: string;        // LinkedIn post, publisher article, recording…
  format?: "post" | "article";  // essays and series parts: a LinkedIn post or an article (shown as the card label)
  publisher?: string;           // In the media
  cover?: string;               // optional photo (Studio upload "/uploads/<id>.jpg", or a /public file); drawn into the cover template
  coverAlt?: string;            // what the photo shows, for screen readers
  kicker?: string;              // small line above a report title
  inside?: string[];            // reports: what's inside
  author?: string;              // reports
  method?: string;              // reports
  site?: string;                // reports with their own site (e.g. AI Edge Lab)
  pdf?: string;                 // reports: the PDF to download after the short sign-up (D7)
  owner?: "axion" | "ai-edge-lab"; // reports keep their owner (Fix Brief Part 5, item 27); default axion
  embed?: string;               // podcasts: player URL (YouTube / Spotify embed)
  statusLine?: string;          // book
  body?: string;                // full text in Markdown (essays and series parts)
  draft?: boolean;              // true until the content is ready
  seriesName?: string;          // filled in when loaded (series parts)
};

export type Series = { slug: string; name: string; summary: string; theme: Theme[] };

/** Everything in the library, as loaded by src/content/store.ts. */
export type Library = { items: LibraryItem[]; series: Series[] };

/** What the item is, for its label: "LinkedIn post" or "Article" when the Studio says so, else the category. */
export const FORMAT_LABEL = { post: "LinkedIn post", article: "Article" } as const;
export const itemKind = (item: Pick<LibraryItem, "category" | "format">) =>
  (item.category === "essay" || item.category === "series") && item.format ? FORMAT_LABEL[item.format] : CATEGORIES[item.category].label;

// ── Visibility ──────────────────────────────────────────────────────────────
/** Essays and series parts need their full text (or a link); podcasts need a recording. Drafts never show. */
export function isPublic(item: LibraryItem): boolean {
  if (item.draft) return false;
  if (item.category === "essay" || item.category === "series") return !!item.body?.trim() || !!item.originalLink;
  if (item.category === "podcast") return !!(item.embed || item.originalLink);
  if (item.category === "media") return !!item.originalLink;
  return true;
}

const byNewest = (a: LibraryItem, b: LibraryItem) => {
  if (a.date && b.date) return b.date.localeCompare(a.date);
  if (a.date) return -1;
  if (b.date) return 1;
  return a.title.localeCompare(b.title);
};

export const sortNewest = (items: LibraryItem[]) => [...items].sort(byNewest);

export function publicItems(lib: Library): LibraryItem[] {
  return lib.items.filter((i) => isPublic(i)).sort(byNewest);
}

export const itemsIn = (lib: Library, category: Category) => publicItems(lib).filter((i) => i.category === category);

export const findItem = (lib: Library, slug: string) => lib.items.find((i) => i.slug === slug);
export const findSeries = (lib: Library, slug: string) => lib.series.find((s) => s.slug === slug);

export function seriesParts(lib: Library, seriesSlug: string): LibraryItem[] {
  return publicItems(lib).filter((i) => i.category === "series" && i.series === seriesSlug)
    .sort((a, b) => (a.part ?? 0) - (b.part ?? 0) || (a.date ?? "").localeCompare(b.date ?? ""));
}

/** URL-safe slug from a title: "The Big AI Bet, Part 1" → "the-big-ai-bet-part-1". */
export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

// ── Paths & formatting ──────────────────────────────────────────────────────
export function itemPath(item: LibraryItem): string {
  switch (item.category) {
    case "report": return `/reports/${item.slug}`;
    case "series": return `/publications/series/${item.series}/${item.slug}`;
    case "essay": return `/publications/essays/${item.slug}`;
    case "media": return `/publications/media/${item.slug}`;
    case "podcast": return `/publications/podcasts/${item.slug}`;
    case "book": return `/publications/book`;
  }
}

/** The item's cover image (one template; with its photo when it has one). `cover` changes the
 *  address when the photo changes, so browsers and LinkedIn fetch the new one. */
export const coverPath = (slug: string, cover?: string) =>
  cover ? `/cover/${slug}?p=${cover.replace(/^.*\//, "").replace(/\.[a-z]+$/i, "").slice(0, 32)}` : `/cover/${slug}`;

export function formatDate(date: string | null | undefined, style: "long" | "short" = "long"): string {
  if (!date) return "";
  const d = new Date(`${date}T00:00:00Z`);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: style === "long" ? "long" : "short", year: "numeric", timeZone: "UTC" });
}

export const isUpcoming = (item: LibraryItem, today = new Date()) =>
  !item.date || new Date(`${item.date}T00:00:00Z`) > today;

/** Reading time in minutes for a text (≈220 words per minute). */
export const readTime = (text: string) => Math.max(1, Math.round(text.trim().split(/\s+/).length / 220));
