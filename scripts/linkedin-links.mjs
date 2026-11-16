#!/usr/bin/env node
/**
 * The link to paste in the first comment of each LinkedIn post (Fix Brief Part 6, items 39–40):
 * the site version of every published essay, series part and report, with tracking tags.
 *
 *   node --env-file=.env scripts/linkedin-links.mjs              all items (from the Studio)
 *   node --env-file=.env scripts/linkedin-links.mjs the-big-ai   only items whose address or title contains this
 */
import mongoose from "mongoose";
import { loadLibrary } from "./lib/library-db.mjs";

const SITE = "https://axionindex.org";
const lib = await loadLibrary();
const filter = (process.argv[2] || "").toLowerCase();

const pathOf = (i) =>
  i.category === "report" ? `/reports/${i.slug}`
  : i.category === "series" ? `/publications/series/${i.series}/${i.slug}`
  : i.category === "essay" ? `/publications/essays/${i.slug}`
  : null;

const items = lib.items
  .filter((i) => !i.draft && pathOf(i))
  .filter((i) => i.category === "report" || (i.body && i.body.trim()) || i.originalLink)
  .filter((i) => !filter || i.slug.includes(filter) || i.title.toLowerCase().includes(filter));

if (!items.length) console.log("No published essays, series parts or reports match.");
for (const i of items) {
  // utm_campaign = the series name; single essays and reports use their own address
  const campaign = i.category === "series" ? i.series : i.slug;
  const q = new URLSearchParams({ utm_source: "linkedin", utm_medium: "social", utm_campaign: campaign });
  console.log(`${i.title}\n  ${SITE}${pathOf(i)}?${q}\n`);
}
if (mongoose.connection.readyState) await mongoose.disconnect();
