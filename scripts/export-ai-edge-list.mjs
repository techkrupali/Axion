#!/usr/bin/env node
/**
 * Hand the AI Edge Lab early-access lists to the institute (Nitin, 16 Nov: "at handover, export each
 * track and the organisations as separate CSVs"). Writes four files into a folder; prints only counts.
 *
 *   node --env-file=.env scripts/export-ai-edge-list.mjs ai-edge-handover
 *     → ai-edge-handover/AAI.csv, ARI.csv, LLI.csv, organisations.csv
 *
 * Only people who ticked the consent box are exported. Store and send the files securely, then delete them.
 * Status and "Invited for complimentary" come from the database; if the team changed them in the sheet,
 * download the sheet's tabs as well (File → Download → CSV) and use the sheet's values.
 */
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

const out = process.argv[2];
if (!out) { console.error("Usage: node --env-file=.env scripts/export-ai-edge-list.mjs <folder>"); process.exit(1); }
if (!process.env.MONGODB_URI) { console.error("MONGODB_URI is not set (did you pass --env-file=.env?)"); process.exit(1); }

const cell = (v) => {
  let s = v instanceof Date ? v.toISOString() : typeof v === "boolean" ? (v ? "yes" : "no") : Array.isArray(v) ? v.join(" ") : String(v ?? "");
  if (/^[=+\-@]/.test(s)) s = "'" + s; // keep spreadsheets from running it as a formula
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const csv = (rows, cols) => [cols.map((c) => c[0]).join(","), ...rows.map((r) => cols.map(([, get]) => cell(get(r))).join(","))].join("\n") + "\n";

await mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection.db;
fs.mkdirSync(out, { recursive: true });

const people = await db.collection("aiedgeinterests").find({ consentAt: { $exists: true } }).sort({ createdAt: 1 }).toArray();
const PERSON = [
  ["Registered at", (r) => r.createdAt], ["Name", (r) => r.name], ["Email", (r) => r.email], ["Track", (r) => r.track],
  ["Organisation", (r) => r.organisation], ["Role", (r) => r.role], ["Country", (r) => r.country],
  ["Consent given", (r) => r.consentAt], ["Source", (r) => [r.sourcePage, r.cameFrom].filter(Boolean).join(" · ")],
  ["Track changed at", (r) => r.trackChangedAt], ["Previous track", (r) => r.previousTrack],
  ["Invited for complimentary", (r) => !!r.invitedComplimentary], ["Status", (r) => r.status || "Registered"],
];
const counts = [];
for (const track of ["AAI", "ARI", "LLI"]) {
  const rows = people.filter((p) => p.track === track);
  fs.writeFileSync(path.join(out, `${track}.csv`), csv(rows, PERSON));
  counts.push(`${track}: ${rows.length}`);
}

const orgs = await db.collection("aiedgeorganisations").find().sort({ createdAt: 1 }).toArray();
const ORG = [
  ["Registered at", (r) => r.createdAt], ["Organisation", (r) => r.organisation], ["Leader name", (r) => r.leaderName],
  ["Leader email", (r) => r.leaderEmail], ["Headcount", (r) => r.headcount], ["Main question", (r) => r.question],
  ["Also requested by", (r) => r.alsoRequestedBy], ["Consent given", (r) => r.consentAt],
  ["Source", (r) => [r.sourcePage, r.cameFrom].filter(Boolean).join(" · ")],
  ["Invited for complimentary", (r) => !!r.invitedComplimentary], ["Status", (r) => r.status || "Registered"],
];
fs.writeFileSync(path.join(out, "organisations.csv"), csv(orgs, ORG));
counts.push(`organisations: ${orgs.length}`);

console.log(`Wrote ${out}/AAI.csv, ARI.csv, LLI.csv and organisations.csv (${counts.join(" · ")}). They hold personal data: send securely, then delete.`);
await mongoose.disconnect();
