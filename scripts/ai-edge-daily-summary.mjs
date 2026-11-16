#!/usr/bin/env node
/**
 * AI Edge Lab early access: the daily summary of individuals for Nitin (Nitin, 16 Nov: "an immediate
 * email for every organisation registration; a daily summary for individuals").
 * Lists everyone who registered or changed track since the last summary, with the totals per track.
 * Sends nothing when nobody new came in. Run once a day from cron on the server (09:00 IST):
 *
 *   30 3 * * * cd /var/www/axion && /usr/bin/node --env-file=.env scripts/ai-edge-daily-summary.mjs >> /var/log/axion-ai-edge-summary.log 2>&1
 *
 *   --dry-run   print the email instead of sending it (nothing is marked as sent)
 */
import dns from "node:dns";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

dns.setDefaultResultOrder("ipv4first"); // the server's IPv6 route to Google hangs
const dry = process.argv.includes("--dry-run");
if (!process.env.MONGODB_URI) { console.error("MONGODB_URI is not set (did you pass --env-file=.env?)"); process.exit(1); }
const TO = process.env.ADMIN_EMAIL || "nitin@axionindex.org";
const NAMES = { AAI: "AI Alignment Index (AAI)", ARI: "AI Replaceability Index (ARI)", LLI: "Leadership Leverage Index (LLI)" };
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const ist = (d) => new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false }).format(d);

await mongoose.connect(process.env.MONGODB_URI);
const col = mongoose.connection.db.collection("aiedgeinterests");
const due = await col.find({ summaryPendingSince: { $exists: true } }).sort({ summaryPendingSince: 1 }).toArray();
const stamp = new Date();
const stamp_ = ist(stamp);
if (!due.length) {
  console.log(`[${stamp.toISOString()}] No new AI Edge Lab registrations since the last summary; nothing sent.`);
  await mongoose.disconnect();
  process.exit(0);
}

const totals = {};
for (const t of ["AAI", "ARI", "LLI"]) totals[t] = await col.countDocuments({ track: t });
const orgs = await mongoose.connection.db.collection("aiedgeorganisations").countDocuments();
// New: registered in the last day (a cron missed for a day still catches them as changes at worst)
const since = new Date(stamp.getTime() - 26 * 3600 * 1000);
const fresh = due.filter((d) => d.createdAt >= since);
const moved = due.filter((d) => d.createdAt < since);

const line = (d) => `${d.name} <${d.email}> · ${d.track}${d.organisation ? ` · ${d.organisation}` : ""}${d.role ? ` · ${d.role}` : ""}${d.country ? ` · ${d.country}` : ""}`;
const subject = `[Axion] AI Edge Lab: ${due.length} new or changed registration${due.length === 1 ? "" : "s"} · ${stamp_}`;
const text = [
  `AI Edge Lab early access, summary to ${stamp_} IST.`, "",
  `Totals: AAI ${totals.AAI} · ARI ${totals.ARI} · LLI ${totals.LLI} · organisations ${orgs}`, "",
  ...(fresh.length ? [`New (${fresh.length}):`, ...fresh.map((d) => `- ${line(d)}`), ""] : []),
  ...(moved.length ? [`Changed track (${moved.length}):`, ...moved.map((d) => `- ${line(d)} (was ${d.previousTrack})`), ""] : []),
  "Organisations come in a separate email each, at once.",
  "The full list is in the leads sheet (Individuals and Organisations tabs).",
].join("\n");

const row = (d, note) => `<tr><td style="padding:10px 0;border-top:1px solid #ECE8DF;font-family:Arial,sans-serif;font-size:14px;line-height:1.5;color:#1F1E1B;">
  <strong>${esc(d.name)}</strong> · <a href="mailto:${esc(d.email)}" style="color:#9A7429;text-decoration:none;">${esc(d.email)}</a><br>
  <span style="color:#6B675E;">${esc(NAMES[d.track] ?? d.track)}${d.organisation ? ` · ${esc(d.organisation)}` : ""}${d.role ? ` · ${esc(d.role)}` : ""}${d.country ? ` · ${esc(d.country)}` : ""}${note ? ` · ${esc(note)}` : ""}</span>
</td></tr>`;
const block = (title, list, note) => !list.length ? "" : `<tr><td style="padding:22px 32px 0;">
  <div style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#9A7429;">${esc(title)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;">${list.map((d) => row(d, note?.(d))).join("")}</table>
</td></tr>`;
const stat = (label, n) => `<td style="padding:14px 10px;text-align:center;border:1px solid #ECE8DF;"><div style="font-family:Georgia,serif;font-size:26px;color:#0D0D0B;">${n}</div><div style="font-family:Arial,sans-serif;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#8A8578;margin-top:4px;">${label}</div></td>`;
const html = `<!doctype html><html><body style="margin:0;padding:0;background:#F3F1EC;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F3F1EC;"><tr><td align="center" style="padding:32px 14px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#FFFFFF;border:1px solid #E5E0D4;border-radius:16px;overflow:hidden;">
<tr><td style="background:#0D0D0B;padding:26px 32px 30px;">
  <div style="font-family:Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:4px;color:#C9A24A;">AI&nbsp;EDGE&nbsp;LAB · DAILY</div>
  <div style="font-family:Georgia,serif;font-size:26px;line-height:1.25;color:#F7F6F3;margin-top:22px;">${due.length} new or changed early-access registration${due.length === 1 ? "" : "s"}</div>
  <div style="font-family:Arial,sans-serif;font-size:13px;color:#9DA3B6;margin-top:8px;">To ${esc(stamp_)} IST · separate AI Edge Lab list</div>
</td></tr>
<tr><td style="height:3px;line-height:3px;font-size:0;background:#C9A24A;">&nbsp;</td></tr>
<tr><td style="padding:24px 32px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${stat("AAI", totals.AAI)}${stat("ARI", totals.ARI)}${stat("LLI", totals.LLI)}${stat("Organisations", orgs)}</tr></table></td></tr>
${block(`New (${fresh.length})`, fresh)}
${block(`Changed track (${moved.length})`, moved, (d) => `was ${d.previousTrack}`)}
<tr><td style="padding:26px 32px 22px;font-family:Arial,sans-serif;font-size:12px;line-height:1.7;color:#8A8578;">
  Organisations come in a separate email each, at once. The full list is in the leads sheet (Individuals and Organisations tabs).
</td></tr></table></td></tr></table></body></html>`;

if (dry) {
  console.log(`DRY RUN — would send to ${TO}:\nSubject: ${subject}\n\n${text}`);
  await mongoose.disconnect();
  process.exit(0);
}
if (!process.env.SMTP_HOST) { console.error("SMTP_HOST is not set; nothing sent."); process.exit(1); }
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
});
await transporter.sendMail({ from: process.env.SMTP_FROM || `"Axion Index" <${process.env.SMTP_USER}>`, to: TO, subject, text, html });
// Only the ones in this email: anyone who registered meanwhile goes in tomorrow's
await col.updateMany({ _id: { $in: due.map((d) => d._id) }, summaryPendingSince: { $lte: stamp } }, { $unset: { summaryPendingSince: "" } });
console.log(`[${stamp.toISOString()}] Sent the AI Edge Lab summary (${due.length}) to ${TO}.`);
await mongoose.disconnect();
