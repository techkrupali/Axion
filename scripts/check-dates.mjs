#!/usr/bin/env node
/**
 * Monthly check (Fix Brief Part 7): list every date and status label written into the site's
 * pages and settings, with the file and line, so each can be confirmed or updated.
 * Library items (reports, essays…) have their dates in the Studio and are listed too.
 *
 *   node --env-file=.env scripts/check-dates.mjs
 */
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import { loadLibrary, ROOT } from "./lib/library-db.mjs";

const MONTHS = "Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?";
const DATE = new RegExp(`\\b(\\d{1,2} (?:${MONTHS})(?: \\d{4})?|(?:${MONTHS}) \\d{4}|20\\d\\d-\\d\\d-\\d\\d)\\b`);
const STATUS = /\b(in development|coming soon|releasing|launch(?:es|ing)?|out now|status: ?"[a-z-]+")\b/i;
const SKIP = /node_modules|\/admin\/|\/user\/|\.test\.|library\.json/;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (SKIP.test(p)) continue;
    if (e.isDirectory()) walk(p, out);
    else if (/\.(tsx?|md)$/.test(e.name)) out.push(p);
  }
  return out;
}

console.log("DATES AND STATUS LABELS IN THE CODE (confirm each, or update it)\n");
for (const file of walk(path.join(ROOT, "src"))) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((l, i) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(l)) return; // comments
    if (DATE.test(l) || STATUS.test(l)) {
      console.log(`${path.relative(ROOT, file)}:${i + 1}`);
      console.log(`    ${l.trim().slice(0, 160)}`);
    }
  });
}

console.log("\nLIBRARY DATES (edit in the Studio)\n");
const lib = await loadLibrary();
for (const i of lib.items.filter((x) => x.category === "report" || !x.date)) {
  console.log(`  ${i.category.padEnd(8)} ${i.date ?? "no date  "}  ${i.draft ? "(draft) " : ""}${i.title}`);
}
if (mongoose.connection.readyState) await mongoose.disconnect();
