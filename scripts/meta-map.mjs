#!/usr/bin/env node
/**
 * Keyword and meta map (Fix Brief Part 10, SEO-02): every page in the sitemap with its title,
 * description, main heading and share image, as a CSV for the tracker.
 *
 *   node scripts/meta-map.mjs > meta-map.csv                          (the live site)
 *   node scripts/meta-map.mjs http://localhost:3000 > meta-map.csv    (a local copy)
 *
 * Flags: titles over 60 characters and descriptions outside 70–160 characters get cut off in Google.
 */
const BASE = (process.argv[2] || "https://axionindex.org").replace(/\/$/, "");
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const pick = (html, re) => { const m = html.match(re); return m ? decode(m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()) : ""; };
const cell = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));

const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace("https://axionindex.org", BASE));
console.log(["Page", "Title", "Title length", "Description", "Description length", "H1", "Share image", "Flags", "Target keyword (fill in)"].join(","));
for (const url of pages) {
  const html = await (await fetch(url)).text();
  const title = pick(html, /<title>([^<]*)<\/title>/);
  const desc = pick(html, /<meta name="description" content="([^"]*)"/);
  const h1 = pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/);
  const img = pick(html, /<meta property="og:image" content="([^"]*)"/).replace("https://axionindex.org", "");
  const flags = [title.length > 60 && "title long", (desc.length < 70 || desc.length > 160) && "description length", !h1 && "no H1"].filter(Boolean).join("; ");
  console.log([url.replace(BASE, "") || "/", title, title.length, desc, desc.length, h1, img, flags, ""].map(cell).join(","));
}
