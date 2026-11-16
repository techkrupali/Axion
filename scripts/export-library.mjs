#!/usr/bin/env node
/**
 * Monthly backup of the Studio's content (Fix Brief Part 9, rule 51): every report, essay,
 * series part, media piece and series, as one JSON file. Content only, no personal data.
 *
 *   node --env-file=.env scripts/export-library.mjs                      → library-backup-YYYY-MM-DD.json
 *   node --env-file=.env scripts/export-library.mjs ~/backups/lib.json   → that file
 *
 * Photos added in the Studio are saved next to it, in a "<name>-photos" folder (one file each).
 * Upload the file and the folder to the Axion Index Google Drive ("Website backups" folder).
 * To restore: the file has the same shape as src/content/library.json, so it can replace it
 * and then `node --env-file=.env scripts/seed-library.mjs` on an empty database.
 */
import fs from "node:fs";
import mongoose from "mongoose";
import { loadLibrary } from "./lib/library-db.mjs";

const out = process.argv[2] || `library-backup-${new Date().toISOString().slice(0, 10)}.json`;
const lib = await loadLibrary();
const clean = (o) => {
  const { _id, createdAt, updatedAt, __v, publishedAt, updatedBy, ...rest } = o;
  void _id; void createdAt; void updatedAt; void __v; void publishedAt; void updatedBy;
  return rest;
};
const data = {
  _readme: `Axion Index library backup, ${new Date().toISOString()}. Same shape as src/content/library.json.`,
  series: lib.series.map(clean),
  items: lib.items.map(clean),
};
fs.writeFileSync(out, JSON.stringify(data, null, 2) + "\n");
console.log(`Saved ${data.items.length} items and ${data.series.length} series to ${out}.`);

// Photos (Studio → Photo): one file each, named like their /uploads/<id>.jpg address
if (mongoose.connection.readyState) {
  const photos = await mongoose.connection.db.collection("libraryimages").find({}, { projection: { data: 1, contentType: 1 } }).toArray();
  if (photos.length) {
    const dir = out.replace(/\.json$/i, "") + "-photos";
    fs.mkdirSync(dir, { recursive: true });
    for (const p of photos) {
      const ext = { "image/png": "png", "image/webp": "webp" }[p.contentType] ?? "jpg";
      const bytes = Buffer.isBuffer(p.data) ? p.data : Buffer.from(p.data.buffer.subarray(0, p.data.position));
      fs.writeFileSync(`${dir}/${p._id}.${ext}`, bytes);
    }
    console.log(`Saved ${photos.length} photos to ${dir}/.`);
  }
}
if (mongoose.connection.readyState) await mongoose.disconnect();
