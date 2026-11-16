#!/usr/bin/env node
/**
 * Quarterly broken-link scan (Fix Brief Part 7): reads the sitemap, opens every page, and
 * checks every link on it, internal and external. Prints only the broken ones.
 *
 *   node scripts/check-links.mjs                       # the live site
 *   node scripts/check-links.mjs http://localhost:3000 # a local copy
 *
 * Some sites (LinkedIn, news sites) refuse automated checks; those are listed separately
 * as "could not check" rather than broken. Open them by hand.
 */
const BASE = (process.argv[2] || "https://axionindex.org").replace(/\/$/, "");
const UA = "Mozilla/5.0 (link check; axionindex.org)";
const seen = new Map(); // url → status

async function status(url) {
  if (seen.has(url)) return seen.get(url);
  let s;
  try {
    let r = await fetch(url, { method: "HEAD", redirect: "follow", headers: { "user-agent": UA }, signal: AbortSignal.timeout(15000) });
    if (r.status === 405 || r.status === 403 || r.status === 404) {
      r = await fetch(url, { method: "GET", redirect: "follow", headers: { "user-agent": UA }, signal: AbortSignal.timeout(15000) });
    }
    s = r.status;
  } catch (e) {
    s = `error: ${e.cause?.code || e.name}`;
  }
  seen.set(url, s);
  return s;
}

const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace("https://axionindex.org", BASE));
console.log(`Checking ${pages.length} pages on ${BASE}…\n`);

const broken = [], unchecked = [];
for (const page of pages) {
  const html = await (await fetch(page)).text();
  const links = [...new Set([...html.matchAll(/href="([^"#]+)/g)].map((m) => m[1]))]
    .filter((h) => !/^(mailto:|tel:|javascript:)/.test(h) && !h.startsWith("/_next/"))
    .map((h) => (h.startsWith("/") ? BASE + h : h.replace(/&amp;/g, "&")))
    .filter((h) => /^https?:/.test(h));
  for (const link of links) {
    const s = await status(link);
    const external = !link.startsWith(BASE);
    if (typeof s === "number" && s < 400) continue;
    if (external && (s === 403 || s === 429 || s === 999 || String(s).startsWith("error"))) unchecked.push(`${link}  (${s}) on ${page}`);
    else broken.push(`${link}  (${s}) on ${page}`);
  }
}

console.log(broken.length ? `BROKEN (${broken.length})\n  ${broken.join("\n  ")}` : "No broken links.");
if (unchecked.length) console.log(`\nCOULD NOT CHECK (${unchecked.length}): open by hand\n  ${[...new Set(unchecked)].join("\n  ")}`);
console.log(`\n${seen.size} links checked.`);
