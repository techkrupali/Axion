import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { REPORT } from "@/config/report";
import { IS_PREVIEW_SITE } from "@/config/features";

export default function robots(): MetadataRoute.Robots {
  // The preview copy of the site (Fix Brief Part 9, rule 50) is never indexed
  if (IS_PREVIEW_SITE) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin",
          "/user",
          "/login",
          "/register",
          "/thank-you",
          "/studio",
          // Full report stays out of search until launch day
          ...(REPORT.published ? [] : [REPORT.readPath]),
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
