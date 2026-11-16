/**
 * Shared by the library scripts: read and write the library in MongoDB (the Studio's data),
 * falling back to src/content/library.json before the database has been filled.
 */
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");

export function libraryFromFiles() {
  const lib = JSON.parse(fs.readFileSync(path.join(ROOT, "src/content/library.json"), "utf8"));
  const dir = path.join(ROOT, "src/content/texts");
  for (const i of lib.items) {
    const f = path.join(dir, `${i.slug}.md`);
    if (fs.existsSync(f)) i.body = fs.readFileSync(f, "utf8");
  }
  return lib;
}

export async function connect() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not set (did you pass --env-file=.env?)");
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  return { items: db.collection("libraryitems"), series: db.collection("libraryseries"), meta: db.collection("librarymeta") };
}

/** The library as the site sees it: the database if filled, else the starting files. */
export async function loadLibrary() {
  if (!process.env.MONGODB_URI) return libraryFromFiles();
  const c = await connect();
  const items = await c.items.find().toArray();
  if (!items.length && !(await c.meta.findOne({ _id: "seeded" }))) return libraryFromFiles();
  return { items, series: await c.series.find().toArray() };
}

/** Copy the starting files into an empty database. Returns how many items were added. */
export async function seedIfEmpty(c) {
  if ((await c.items.countDocuments()) > 0) {
    await c.meta.updateOne({ _id: "seeded" }, { $setOnInsert: { at: new Date() } }, { upsert: true });
    return 0;
  }
  // Filled once already and then emptied in the Studio: never bring the starting data back
  if (await c.meta.findOne({ _id: "seeded" })) return 0;
  const lib = libraryFromFiles();
  const now = new Date();
  if (lib.series.length) await c.series.insertMany(lib.series.map((s) => ({ ...s, createdAt: now, updatedAt: now })));
  await c.items.insertMany(lib.items.map((i) => ({ ...i, draft: !!i.draft, ...(i.draft ? {} : { publishedAt: now }), updatedBy: "starting data", createdAt: now, updatedAt: now })));
  await c.items.createIndex({ slug: 1 }, { unique: true });
  await c.series.createIndex({ slug: 1 }, { unique: true });
  await c.meta.updateOne({ _id: "seeded" }, { $setOnInsert: { at: now } }, { upsert: true });
  return lib.items.length;
}

/** Ask the running site to show the change now (needs LIBRARY_REVALIDATE_SECRET; SITE_URL defaults to localhost). */
export async function refreshSite() {
  const secret = process.env.LIBRARY_REVALIDATE_SECRET;
  const site = process.env.SITE_URL || "http://localhost:3000";
  if (!secret) {
    console.log("Note: set LIBRARY_REVALIDATE_SECRET to refresh the site automatically; until then changes show after the next Studio save.");
    return;
  }
  try {
    const r = await fetch(`${site}/api/revalidate-library`, { method: "POST", headers: { authorization: `Bearer ${secret}` } });
    console.log(r.ok ? "Site refreshed." : `Could not refresh the site (${r.status}).`);
  } catch (e) {
    console.log(`Could not reach ${site} to refresh: ${e.message}`);
  }
}
