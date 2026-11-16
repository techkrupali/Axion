#!/usr/bin/env node
/**
 * Hand the AI Edge Lab early-bird list to the institute (Fix Brief Part 5, item 23: "the list
 * moves to the institute when its site launches"). Writes a CSV; prints only the count.
 *
 *   node --env-file=.env scripts/export-ai-edge-list.mjs ai-edge-early-bird.csv              every assessment
 *   node --env-file=.env scripts/export-ai-edge-list.mjs ai-edge-ari.csv --assessment ARI    one assessment
 *
 * One row per person per assessment (someone registered for two assessments has two rows).
 * Only people who ticked the consent box are exported. Store and send the file securely.
 */
import fs from "node:fs";
import mongoose from "mongoose";

const out = process.argv[2];
const flag = process.argv.indexOf("--assessment");
const only = flag > 0 ? process.argv[flag + 1] : "";
if (!out || out.startsWith("--") || (flag > 0 && !only)) {
  console.error('Usage: node --env-file=.env scripts/export-ai-edge-list.mjs <file.csv> [--assessment AAI|ARI|LLI|"ORG AI DARS"]');
  process.exit(1);
}
if (!process.env.MONGODB_URI) { console.error("MONGODB_URI is not set (did you pass --env-file=.env?)"); process.exit(1); }

await mongoose.connect(process.env.MONGODB_URI);
const rows = await mongoose.connection.db.collection("aiedgeinterests")
  .find({ consentAt: { $exists: true }, ...(only ? { assessment: only } : {}) }).sort({ assessment: 1, createdAt: 1 }).toArray();

const cols = ["name", "email", "organisation", "role", "country", "assessment", "consentAt", "createdAt"];
const cell = (v) => {
  let s = v instanceof Date ? v.toISOString() : String(v ?? "");
  if (/^[=+\-@]/.test(s)) s = "'" + s; // keep spreadsheets from running it as a formula
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
fs.writeFileSync(out, [cols.join(","), ...rows.map((r) => cols.map((c) => cell(r[c])).join(","))].join("\n") + "\n");
const perAssessment = {};
for (const r of rows) perAssessment[r.assessment] = (perAssessment[r.assessment] ?? 0) + 1;
console.log(`Wrote ${rows.length} early-bird registration(s) to ${out}.`, Object.entries(perAssessment).map(([a, n]) => `${a}: ${n}`).join(" · "));
await mongoose.disconnect();
