#!/usr/bin/env node
/**
 * Import the tracker's "Content" tab into the site library.
 *
 *   node --env-file=.env scripts/import-library.mjs path/to/content.csv            # into the Studio (database)
 *   node --env-file=.env scripts/import-library.mjs path/to/content.csv --dry-run  # only show what would change
 *
 * With MONGODB_URI set (on the server: --env-file=.env) it writes to the Studio's database and
 * refreshes the site (Fix Brief Part 7). Without it, it writes src/content/library.json, the starting data.
 * For one or two items, the Studio (/studio) is quicker.
 *
 * Columns (header row, any order, case-insensitive):
 *   Title, Date, Category, Theme, Series, Part, Original link, Publisher, Summary, Cover image, Status, Slug
 * Only Title and Category are required. Rows are matched to existing items by Slug, else by
 * Original link, else by Title, so fields the sheet does not carry (kicker, what's inside, author,
 * method…) are kept. Items that are not in the sheet are left alone; this script never deletes.
 *
 * Full texts of essays and series parts go in src/content/texts/<slug>.md (see src/content/README.md).
 */
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import { connect, refreshSite, seedIfEmpty } from "./lib/library-db.mjs";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const LIB = path.join(ROOT, "src/content/library.json");
const THEMES = ["AI & work", "People Architecture", "Governance", "Labour Codes", "Founder doctrine"];

const [csvPath, ...flags] = process.argv.slice(2);
const dryRun = flags.includes("--dry-run");
if (!csvPath) {
  console.error("Usage: node scripts/import-library.mjs <content.csv> [--dry-run]");
  process.exit(1);
}

// ── CSV (RFC 4180: quoted fields, "" escapes, newlines inside quotes) ─────────
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') q = false;
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((x) => x.trim()));
}

// ── Field helpers ─────────────────────────────────────────────────────────────
const slugify = (s) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

const CATEGORY = {
  report: "report", reports: "report",
  series: "series", "series part": "series",
  essay: "essay", essays: "essay", article: "essay",
  media: "media", "in the media": "media", press: "media",
  podcast: "podcast", podcasts: "podcast", talk: "podcast", talks: "podcast", "podcast or talk": "podcast", "podcasts & talks": "podcast",
  book: "book",
};

const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12 };
const pad = (n) => String(n).padStart(2, "0");
function parseDate(s) {
  s = s.trim();
  if (!s) return null;
  let m;
  if ((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))) return `${m[1]}-${pad(m[2])}-${pad(m[3])}`;
  if ((m = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/))) return `${m[3]}-${pad(m[2])}-${pad(m[1])}`; // DD/MM/YYYY (India)
  const month = (name) => MONTHS[name.toLowerCase().slice(0, 4)] ?? MONTHS[name.toLowerCase().slice(0, 3)];
  if ((m = s.match(/^(\d{1,2})\s+([A-Za-z]+)\.?,?\s+(\d{4})$/)) && month(m[2])) return `${m[3]}-${pad(month(m[2]))}-${pad(m[1])}`; // 20 Nov 2026
  if ((m = s.match(/^([A-Za-z]+)\.?\s+(\d{1,2}),?\s+(\d{4})$/)) && month(m[1])) return `${m[3]}-${pad(month(m[1]))}-${pad(m[2])}`; // Nov 20, 2026
  return undefined; // unreadable
}

function parseThemes(s, warn) {
  return s.split(/[;,|]/).map((t) => t.trim()).filter(Boolean).flatMap((t) => {
    const hit = THEMES.find((x) => x.toLowerCase() === t.toLowerCase());
    if (!hit) { warn(`unknown theme "${t}" (allowed: ${THEMES.join(", ")})`); return []; }
    return [hit];
  });
}

// ── Import ────────────────────────────────────────────────────────────────────
const useDb = !!process.env.MONGODB_URI;
let db;
let lib;
if (useDb) {
  db = await connect();
  if (!dryRun) await seedIfEmpty(db);
  lib = { items: await db.items.find().toArray(), series: await db.series.find().toArray() };
  if (!lib.items.length) lib = JSON.parse(fs.readFileSync(LIB, "utf8")); // dry run on an empty database
} else {
  lib = JSON.parse(fs.readFileSync(LIB, "utf8"));
}
const changed = new Set();
const newSeries = [];
const rows = parseCsv(fs.readFileSync(csvPath, "utf8").replace(/^﻿/, ""));
const header = rows.shift().map((h) => h.trim().toLowerCase());
const col = (name) => header.indexOf(name);
const get = (r, ...names) => {
  for (const n of names) { const i = col(n); if (i >= 0) return (r[i] ?? "").trim(); }
  return "";
};
if (col("title") < 0 || col("category") < 0) {
  console.error(`The CSV needs at least "Title" and "Category" columns. Found: ${header.join(", ")}`);
  process.exit(1);
}

let added = 0, updated = 0, problems = 0;
rows.forEach((r, n) => {
  const line = n + 2;
  const warn = (msg) => { problems++; console.warn(`  row ${line}: ${msg}`); };
  const title = get(r, "title");
  const catRaw = get(r, "category");
  const category = CATEGORY[catRaw.toLowerCase()];
  if (!title) return warn("no title, skipped");
  if (!category) return warn(`unknown category "${catRaw}", skipped`);

  const link = get(r, "original link", "link", "url");
  const slug = get(r, "slug") || slugify(title);
  let item = lib.items.find((i) => i.slug === slug)
    || (link && lib.items.find((i) => i.originalLink === link))
    || lib.items.find((i) => i.title.toLowerCase() === title.toLowerCase());
  const isNew = !item;
  if (isNew) { item = { slug, category, title, date: null, theme: [], summary: "" }; lib.items.push(item); }

  const before = JSON.stringify(item);
  item.category = category;
  item.title = title;

  const dateRaw = get(r, "date");
  if (dateRaw) {
    const d = parseDate(dateRaw);
    if (d === undefined) warn(`could not read date "${dateRaw}" (use YYYY-MM-DD), left as it was`);
    else item.date = d;
  }
  const themes = get(r, "theme", "themes");
  if (themes) item.theme = parseThemes(themes, warn);
  const summary = get(r, "summary");
  if (summary) item.summary = summary;
  if (link) item.originalLink = link;
  const publisher = get(r, "publisher", "publication");
  if (publisher) item.publisher = publisher;
  const cover = get(r, "cover image", "cover");
  if (cover) item.cover = cover;

  if (category === "series") {
    const seriesName = get(r, "series");
    if (seriesName) {
      let s = lib.series.find((x) => x.name.toLowerCase() === seriesName.toLowerCase() || x.slug === slugify(seriesName));
      if (!s) { s = { slug: slugify(seriesName), name: seriesName, summary: "", theme: item.theme }; lib.series.push(s); newSeries.push(s); console.log(`  + series "${seriesName}"`); }
      item.series = s.slug;
    } else if (!item.series) warn("series part without a Series name");
    const part = parseInt(get(r, "part"), 10);
    if (Number.isFinite(part)) item.part = part;
  }

  const status = get(r, "status").toLowerCase();
  if (status) {
    if (/draft|in progress|not ready|hold/.test(status)) item.draft = true;
    else if (/publish|live|ready|done/.test(status)) delete item.draft;
  }

  if (isNew) { added++; changed.add(item); console.log(`  + ${category.padEnd(7)} ${item.slug}`); }
  else if (JSON.stringify(item) !== before) { updated++; changed.add(item); console.log(`  ~ ${category.padEnd(7)} ${item.slug}`); }
});

// Slugs must stay unique (they are the page addresses)
const seen = new Map();
for (const i of lib.items) {
  if (seen.has(i.slug)) { problems++; console.warn(`  duplicate slug "${i.slug}" (${seen.get(i.slug)} and ${i.title}); add a Slug column to tell them apart`); }
  seen.set(i.slug, i.title);
}

console.log(`\n${added} added, ${updated} updated, ${problems} problem(s).`);
if (dryRun) console.log("Dry run: nothing written.");
else if (useDb) {
  const now = new Date();
  for (const s of newSeries) await db.series.updateOne({ slug: s.slug }, { $setOnInsert: { ...s, createdAt: now, updatedAt: now } }, { upsert: true });
  for (const item of changed) {
    const { _id, createdAt: _c, ...fields } = item;
    const publish = !fields.draft && !fields.publishedAt ? { publishedAt: now } : {};
    await db.items.updateOne(
      { slug: item.slug },
      { $set: { ...fields, ...publish, draft: !!fields.draft, updatedBy: "import", updatedAt: now }, $setOnInsert: { createdAt: now } },
      { upsert: true },
    );
  }
  console.log(`Saved ${changed.size} item(s) to the Studio.`);
  await refreshSite();
} else {
  fs.writeFileSync(LIB, JSON.stringify(lib, null, 2) + "\n");
  console.log(`Wrote ${path.relative(ROOT, LIB)} (the starting data).`);
}
if (useDb) await mongoose.disconnect();
