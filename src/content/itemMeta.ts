import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { MAKE_OR_BREAK } from "@/content/reports/makeOrBreak";
import { CATEGORIES, coverPath, findItem, isPublic, itemPath, type Category, type Library, type LibraryItem } from "@/content/library";

/**
 * Google title and description for items where Nitin approved specific wording (SEO-02, 17 Nov).
 * Only what Google shows changes; the page itself keeps the item's title and summary from the Studio.
 */
const SEO_OVERRIDES: Record<string, { title?: string; exactTitle?: boolean; description?: string; imageAlt?: string }> = {
  // Nitin's report page brief (19 Nov) replaces the SEO-02 wording for this report
  "make-or-break": {
    title: MAKE_OR_BREAK.seo.title,
    exactTitle: true,
    description: MAKE_OR_BREAK.seo.description,
    imageAlt: MAKE_OR_BREAK.coverAlt,
  },
  "irdai-people-architecture-playbook": {
    title: "IRDAI People Architecture Playbook for insurers",
    description: "A people architecture playbook for India's insurers after the IRDAI reforms: incentives, targets, recognition, and the structures that must change with them.",
  },
};

const MIN_DESC = 70;   // Google shows roughly 70–160 characters; shorter or longer gets replaced or cut
const MAX_DESC = 160;
const MAX_TITLE = 60;

/** What the item is, in a few words: added to summaries too short for Google. */
function context(item: LibraryItem): string {
  if (item.category === "series") return item.seriesName ? `${item.part ? `Part ${item.part} of` : "From"} ${item.seriesName}, a series by Nitin Nahata.` : "A series by Nitin Nahata.";
  if (item.category === "media") return `By Nitin Nahata, published by ${item.publisher ?? "another publication"}.`;
  if (item.category === "report") return item.owner === "ai-edge-lab" ? "A report by AI Edge Lab. It launches with the AI Edge Lab site." : "A report by Axion Index.";
  if (item.category === "essay") return "An essay by Nitin Nahata, founder of Axion Index.";
  return `${CATEGORIES[item.category].label} by Nitin Nahata, founder of Axion Index.`;
}

const sentence = (s: string) => (/[.!?…]$/.test(s) ? s : `${s}.`);

/** A description Google will show in full: the summary (or the title), with context added if short, cut at a word if long. */
function googleDescription(item: LibraryItem): string {
  let d = sentence((item.summary || item.title).trim());
  if (d.length < MIN_DESC) d = `${d} ${context(item)}`;
  if (d.length < MIN_DESC && item.theme.length) d = `${d} On ${item.theme.join(", ").replace(/, ([^,]*)$/, " and $1")}.`;
  if (d.length > MAX_DESC) d = d.slice(0, MAX_DESC - 1).replace(/[\s,;:·–—-]+\S*$/, "") + "…";
  return d;
}

/** Title, description and generated cover as the share image, for one library item. */
export function itemMetadata(item: LibraryItem) {
  const o = SEO_OVERRIDES[item.slug] ?? {};
  const title = o.title ?? item.title;
  return pageMetadata({
    title,
    // Long titles drop " · Axion Index" so Google shows the title itself, not a cut-off name
    exactTitle: o.exactTitle ?? `${title} · Axion Index`.length > MAX_TITLE,
    description: o.description ?? googleDescription(item),
    path: itemPath(item),
    image: { url: coverPath(item.slug, item.cover), width: 1200, height: 630, alt: o.imageAlt ?? item.title },
  });
}

/** The public item for this slug in this category, or a 404 (drafts never show, except in preview). */
export function publicItemOr404(lib: Library, slug: string, category: Category): LibraryItem {
  const item = findItem(lib, slug);
  if (!item || item.category !== category || !isPublic(item)) notFound();
  return item;
}
