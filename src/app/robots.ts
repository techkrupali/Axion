import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { REPORT } from "@/config/report";

export default function robots(): MetadataRoute.Robots {
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
          // Full report stays out of search until launch day
          ...(REPORT.published ? [] : [REPORT.readPath]),
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
