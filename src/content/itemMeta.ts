import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { CATEGORIES, coverPath, findItem, isPublic, itemPath, type Category, type Library, type LibraryItem } from "@/content/library";

/** Title, description and generated cover as the share image, for one library item. */
export function itemMetadata(item: LibraryItem) {
  const fallback =
    item.category === "media" ? `${item.title}, published by ${item.publisher ?? "another publication"}.`
    : item.owner === "ai-edge-lab" ? `${item.title}, a report by AI Edge Lab. It launches with the AI Edge Lab site.`
    : `${CATEGORIES[item.category].label} by Nitin Nahata, Axion Index.`;
  return pageMetadata({
    title: item.title,
    description: item.summary || fallback,
    path: itemPath(item),
    image: { url: coverPath(item.slug), width: 1200, height: 630, alt: item.title },
  });
}

/** The public item for this slug in this category, or a 404 (drafts never show, except in preview). */
export function publicItemOr404(lib: Library, slug: string, category: Category): LibraryItem {
  const item = findItem(lib, slug);
  if (!item || item.category !== category || !isPublic(item)) notFound();
  return item;
}
