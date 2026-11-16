#!/usr/bin/env node
/**
 * Release day (Fix Brief Part 4, step 3): email a report to everyone who asked for it.
 *
 * Run on the server, from /var/www/axion:
 *   node --env-file=.env scripts/send-report.mjs --report make-or-break --link https://axionindex.org/global-ai-report/edition-01
 *       → dry run: shows how many people are waiting, sends nothing
 *   … --test you@example.com      → sends one sample to that address only
 *   … --send                      → sends to everyone not yet sent, and marks each one as sent
 *
 * Safe to run again: people already marked as sent are skipped. Sends one email every 1.5 s
 * to stay within mailbox limits. Uses the same SMTP settings as the website.
 */
import dns from "node:dns";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { loadLibrary } from "./lib/library-db.mjs";

// The server's IPv6 route to Google can hang; send over IPv4 (same as the website, src/lib/preferIpv4.ts)
dns.setDefaultResultOrder("ipv4first");

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const slug = opt("--report");
const link = opt("--link");
const testTo = opt("--test");
const send = args.includes("--send");

if (!slug || !link || !/^https:\/\//.test(link)) {
  console.error("Usage: node --env-file=.env scripts/send-report.mjs --report <slug> --link https://… [--test you@example.com | --send]");
  process.exit(1);
}

const lib = await loadLibrary(); // the Studio's data (or the starting library.json)
const item = lib.items.find((i) => i.slug === slug && i.category === "report");
if (!item) { console.error(`No report "${slug}" in the library`); process.exit(1); }
// Same key as signupKey() in src/content/reportState.ts: the Global AI Report kept its first key
const edition = slug === "make-or-break" ? "Edition 01" : slug;

const PUBLIC_EMAIL = "support@axionindex.org"; // the only public address (src/config/contact.ts)
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const first = (name) => String(name).trim().split(/\s+/)[0] || name;

function render(name) {
  const subject = `${item.title} is here · Axion Index`;
  const text = [
    `Dear ${first(name)},`, "",
    `As promised, here is ${item.title}${item.kicker ? ` (${item.kicker})` : ""}:`, link, "",
    `Questions or thoughts? Reply to this email or write to ${PUBLIC_EMAIL}.`, "",
    "Axion Index · https://axionindex.org",
    `You are receiving this because you asked for ${item.title} on axionindex.org.`,
  ].join("\n");
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#F3F1EC;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F3F1EC;"><tr><td align="center" style="padding:32px 14px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#FFFFFF;border:1px solid #E5E0D4;border-radius:16px;overflow:hidden;">
<tr><td style="background:#0D0D0B;padding:26px 32px 30px;">
  <div style="font-family:Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:4px;color:#C9A24A;">AXION&nbsp;INDEX</div>
  <div style="font-family:Georgia,serif;font-size:28px;line-height:1.25;color:#F7F6F3;margin-top:26px;">${esc(item.title)} is here.</div>
</td></tr>
<tr><td style="height:3px;line-height:3px;font-size:0;background:#C9A24A;">&nbsp;</td></tr>
<tr><td style="padding:28px 32px 8px;font-family:Arial,sans-serif;font-size:15px;line-height:1.7;color:#1F1E1B;">
  <p style="margin:0 0 14px;">Dear ${esc(first(name))},</p>
  <p style="margin:0 0 14px;">As promised, here is ${esc(item.title)}${item.kicker ? ` (${esc(item.kicker)})` : ""}.</p>
</td></tr>
<tr><td style="padding:8px 32px 0;"><a href="${esc(link)}" style="display:inline-block;padding:13px 22px;background:#0D0D0B;color:#C9A24A;font-family:Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;text-decoration:none;">Read the report &rarr;</a></td></tr>
<tr><td style="padding:30px 32px 0;font-size:0;line-height:0;">&nbsp;</td></tr>
<tr><td style="padding:18px 32px 22px;background:#FAF8F3;border-top:1px solid #ECE8DF;font-family:Arial,sans-serif;font-size:12px;line-height:1.7;color:#8A8578;">
  You are receiving this because you asked for ${esc(item.title)} on axionindex.org.<br>
  Questions? Reply to this email or write to <a href="mailto:${PUBLIC_EMAIL}" style="color:#9A7429;text-decoration:none;">${PUBLIC_EMAIL}</a>.
</td></tr></table></td></tr></table></body></html>`;
  return { subject, text, html };
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
});
const from = process.env.SMTP_FROM || `"Axion Index" <${process.env.SMTP_USER}>`;
const mail = (to, name) => transporter.sendMail({ from, to, replyTo: PUBLIC_EMAIL, ...render(name) });

if (testTo) {
  if (!process.env.SMTP_HOST) { console.error("SMTP_HOST is not set (did you pass --env-file=.env?)"); process.exit(1); }
  await mail(testTo, "Test Reader");
  console.log(`Sample sent to ${testTo}. Nothing else was sent.`);
  process.exit(0);
}

if (!process.env.MONGODB_URI) { console.error("MONGODB_URI is not set (did you pass --env-file=.env?)"); process.exit(1); }
if (!mongoose.connection.readyState) await mongoose.connect(process.env.MONGODB_URI);
const signups = mongoose.connection.db.collection("reportsignups");
const waiting = await signups.find({ edition, sentAt: { $exists: false } }).sort({ createdAt: 1 }).toArray();
const done = await signups.countDocuments({ edition, sentAt: { $exists: true } });
console.log(`${item.title}: ${waiting.length} waiting, ${done} already sent.`);

if (!send) {
  console.log("Dry run: nothing sent. Add --test you@example.com to see the email, then --send to send it to everyone.");
  await mongoose.disconnect();
  process.exit(0);
}
if (!process.env.SMTP_HOST) { console.error("SMTP_HOST is not set."); process.exit(1); }

let ok = 0, failed = 0;
const failedList = [];
for (const s of waiting) {
  try {
    await mail(s.email, s.name);
    await signups.updateOne({ _id: s._id }, { $set: { sentAt: new Date() } });
    ok++;
    console.log(`  sent ${ok}/${waiting.length}`);
  } catch (err) {
    failed++;
    failedList.push(`${s.email}: ${err.message}`);
    console.error(`  failed for one address: ${err.message}`);
  }
  await new Promise((r) => setTimeout(r, 1500));
}
console.log(`Done: ${ok} sent, ${failed} failed. Run again to retry the failed ones.`);

// T-02: tell Nitin how the send went, with every address the mail server refused.
// (Bounces that come back later land in the sending inbox; see docs/launch-20-nov.md.)
const owner = process.env.ADMIN_EMAIL;
if (owner) {
  try {
    await transporter.sendMail({
      from, to: owner,
      subject: `[Axion] ${item.title}: ${ok} sent, ${failed} failed`,
      text: [
        `${item.title}: ${ok} sent, ${failed} failed, ${done} sent earlier.`,
        ...(failedList.length ? ["", "Not delivered (run the send again to retry, or correct the address):", ...failedList.map((l) => `- ${l}`)] : []),
        "", "Bounces that arrive later come back to the sending inbox as \"Delivery Status Notification\" emails.",
      ].join("\n"),
    });
    console.log(`Summary sent to ${owner}.`);
  } catch (err) {
    console.error(`Could not send the summary to ${owner}: ${err.message}`);
  }
}
await mongoose.disconnect();
