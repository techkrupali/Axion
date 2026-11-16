import { CATEGORIES, findItem, formatDate, publicItems } from "@/content/library";
import { getLibrary, loadLibraryFresh } from "@/content/store";
import { photoCover, shareImage } from "@/lib/shareImage";
import { coverPhotoDataUrl } from "@/lib/libraryImages";

/**
 * One cover template (Fix Brief Part 3, item 13): 1200 × 630, site fonts and gold,
 * for every library item. Used on the cards and as the share image. An item with a photo
 * uses the whole photo instead (see photoCover).
 */
export const dynamic = "force-static";

export async function generateStaticParams() {
  return publicItems(await getLibrary()).map((i) => ({ slug: i.slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Drafts too, so the Studio preview shows the cover; the Studio refreshes it on every save
  const item = findItem(await loadLibraryFresh(), slug);
  if (!item) return new Response("Not found", { status: 404 });

  const kicker =
    item.category === "series" ? item.seriesName ?? "Series"
    : item.category === "media" ? item.publisher ?? "In the media"
    : item.kicker ?? CATEGORIES[item.category].label;
  const meta = [formatDate(item.date), item.theme[0]].filter(Boolean).join("  ·  ");
  // With a photo (Studio → Photo) the cover is the whole photo; without one, the title card
  const src = await coverPhotoDataUrl(item.cover);
  if (src) return photoCover(src);
  return shareImage({ label: CATEGORIES[item.category].label, kicker, title: item.title, meta });
}
