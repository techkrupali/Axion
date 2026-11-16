#!/usr/bin/env node
/**
 * Data from the old AI Edge quiz (Fix Brief Part 10, A-11). The quiz came down in Part 5;
 * Nitin, 16 Nov: move only people who agreed to hear from us; delete phone numbers and the rest.
 * The quiz never asked for that consent, so nobody qualifies for the early-bird list. Checked on
 * 16 Nov: the live database holds no quiz results, so there was nothing to delete.
 *
 *   node --env-file=.env scripts/old-quiz-data.mjs count              how many, and the date range
 *   node --env-file=.env scripts/old-quiz-data.mjs export quiz.csv    for Nitin (upload to Axion's Drive, then delete the file)
 *   node --env-file=.env scripts/old-quiz-data.mjs delete --confirm   remove it all, once decided
 */
import fs from "node:fs";
import mongoose from "mongoose";

const [cmd, arg] = process.argv.slice(2);
if (!["count", "export", "delete"].includes(cmd)) {
  console.error("Usage: node --env-file=.env scripts/old-quiz-data.mjs count | export <file.csv> | delete --confirm");
  process.exit(1);
}
if (!process.env.MONGODB_URI) { console.error("MONGODB_URI is not set (did you pass --env-file=.env?)"); process.exit(1); }

await mongoose.connect(process.env.MONGODB_URI);
const col = mongoose.connection.db.collection("edgeassessments");
const n = await col.countDocuments();

if (cmd === "count") {
  const first = await col.find().sort({ createdAt: 1 }).limit(1).toArray();
  const last = await col.find().sort({ createdAt: -1 }).limit(1).toArray();
  const day = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "?");
  console.log(n ? `${n} quiz result(s), from ${day(first[0]?.createdAt)} to ${day(last[0]?.createdAt)}.` : "No quiz results stored.");
}

if (cmd === "export") {
  if (!arg) { console.error("Give a file name, e.g. quiz.csv"); process.exit(1); }
  const rows = await col.find().sort({ createdAt: 1 }).toArray();
  const cols = ["createdAt", "name", "email", "phone", "indexName", "profileRole", "experienceBand", "score", "band", "archetype"];
  const cell = (v) => {
    let s = v instanceof Date ? v.toISOString() : String(v ?? "");
    if (/^[=+\-@]/.test(s)) s = "'" + s;
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  fs.writeFileSync(arg, [cols.join(","), ...rows.map((r) => cols.map((c) => cell(r[c])).join(","))].join("\n") + "\n");
  console.log(`Wrote ${rows.length} quiz result(s) to ${arg}. It holds personal data: upload it to Axion's Drive and delete this copy.`);
}

if (cmd === "delete") {
  if (arg !== "--confirm") { console.error(`This deletes all ${n} quiz result(s). Run again with --confirm.`); process.exit(1); }
  const r = await col.deleteMany({});
  console.log(`Deleted ${r.deletedCount} quiz result(s).`);
}
await mongoose.disconnect();
