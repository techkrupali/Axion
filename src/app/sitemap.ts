import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { REPORT } from "@/config/report";
import { PRACTICES, PRACTICE_ORDER } from "@/config/practices";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
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
    page("/expertise/ai-edge/diagnostic", 0.6),
    page("/research", 0.7, "weekly"),
    page(REPORT.signupPath, 0.8, "weekly"),
    ...(REPORT.published ? [page(REPORT.readPath, 0.9, "weekly")] : []),
    page("/connect", 0.6),
  ];
}
