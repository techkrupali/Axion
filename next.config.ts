import type { NextConfig } from "next";

// AI Edge Lab's own site (Fix Brief Part 5, item 28). Empty until it launches.
const AI_EDGE_LAB_URL = (process.env.NEXT_PUBLIC_AI_EDGE_LAB_URL || "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  // The preview copy of the site is never indexed (Fix Brief Part 9, rule 50)
  async headers() {
    return process.env.NEXT_PUBLIC_SITE_ENV === "preview"
      ? [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }]
      : [];
  },
  // SEO-01 (15 Nov): /global-ai-report keeps its address; it shows the report's page
  async rewrites() {
    return [{ source: "/global-ai-report", destination: "/reports/make-or-break" }];
  },
  async redirects() {
    return [
      // One address for the site (Fix Brief Part 8, B-26): www.axionindex.org → axionindex.org
      { source: "/:path*", has: [{ type: "host", value: "www.axionindex.org" }], destination: "https://axionindex.org/:path*", permanent: true },
      // "Research & Journals" became "Reports" (Fix Brief Part 2); keep old links working
      { source: "/research", destination: "/reports", permanent: true },
      // The library moved to /publications (Fix Brief Part 3)
      { source: "/articles", destination: "/publications", permanent: true },
      // The AI Edge diagnostic came down (Part 5, item 24): until the institute's site is live its
      // address points to early-bird registration; after launch it moves there for good (item 28).
      AI_EDGE_LAB_URL.startsWith("https://")
        ? { source: "/expertise/ai-edge/diagnostic", destination: AI_EDGE_LAB_URL, permanent: true }
        : { source: "/expertise/ai-edge/diagnostic", destination: "/expertise/ai-edge#early-bird", permanent: false },
    ];
  },
};

export default nextConfig;
