import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { PRACTICES, PRACTICE_ORDER } from "@/config/practices";
import { CATEGORIES, CATEGORY_ORDER, itemPath, publicItems, seriesParts } from "@/content/library";
import { getLibrary } from "@/content/store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lib = await getLibrary();
  const now = new Date();
  const items = publicItems(lib);
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" = "monthly") => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    page("/", 1, "weekly"),
    page("/about", 0.8),
    page("/founder", 0.7),
    // Only practices that are open (Labour Codes / Family Business are "in development")
    ...PRACTICE_ORDER.filter((k) => PRACTICES[k].status === "live").map((k) => page(PRACTICES[k].href, 0.8)),
    // Library: hub, every category that has something in it, every series and item
    page("/publications", 0.7, "weekly"),
    ...CATEGORY_ORDER.filter((c) => c !== "book" && items.some((i) => i.category === c)).map((c) => page(CATEGORIES[c].path, 0.7, "weekly")),
    ...lib.series.filter((s) => seriesParts(lib, s.slug).length > 0).map((s) => page(`/publications/series/${s.slug}`, 0.6)),
    ...items.map((i) => page(itemPath(i), i.category === "report" ? 0.8 : 0.6)),
    page("/connect", 0.6),
    page("/newsletter", 0.5),
    page("/privacy", 0.3),
    page("/terms", 0.3),
  ];
}
