import { NEXT_READ } from "@/config/contact";
import { findSeries, seriesParts } from "@/content/library";
import { getLibrary } from "@/content/store";
import { SITE_URL } from "@/lib/seo";

/**
 * The read offered after a form (Fix Brief Part 4, item 18): "While you wait, read The Three
 * Laws of AI." Until that series has a published part, it points to the library instead.
 */
export async function nextRead(): Promise<{ path: string; url: string; label: string; line: string }> {
  const lib = await getLibrary();
  const s = findSeries(lib, NEXT_READ.series);
  if (s && seriesParts(lib, s.slug).length > 0) {
    const path = `/publications/series/${s.slug}`;
    return { path, url: SITE_URL + path, label: `Read ${NEXT_READ.label}`, line: `While you wait, read ${NEXT_READ.label}.` };
  }
  return { path: "/publications", url: SITE_URL + "/publications", label: "Browse Articles & Publications", line: "While you wait, browse our reports, essays and articles." };
}
