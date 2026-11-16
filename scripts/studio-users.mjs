#!/usr/bin/env node
/**
 * Who can use the Studio (Fix Brief Part 7 and Part 9). Run on the server, from /var/www/axion.
 *
 *   node --env-file=.env scripts/studio-users.mjs list
 *   node --env-file=.env scripts/studio-users.mjs add content@axionindex.org "Content Team"           (editor)
 *   node --env-file=.env scripts/studio-users.mjs add nitin@axionindex.org "Nitin Nahata" --admin
 *   node --env-file=.env scripts/studio-users.mjs reset content@axionindex.org                         (new password)
 *   node --env-file=.env scripts/studio-users.mjs role content@axionindex.org admin|editor
 *   node --env-file=.env scripts/studio-users.mjs remove content@axionindex.org                        (the day someone leaves)
 *
 * Roles: "editor" can add, preview and publish library items. "admin" can do the same (templates and
 * code are changed by the tech team in GitHub, not in the Studio). Passwords are printed once:
 * put them straight into the shared password manager, never WhatsApp or email (Part 9, rule 48).
 */
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const [cmd, emailArg, ...rest] = process.argv.slice(2);
const email = (emailArg || "").toLowerCase();
const flags = rest.filter((a) => a.startsWith("--"));
const words = rest.filter((a) => !a.startsWith("--"));
const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function usage() {
  console.error("Usage: node --env-file=.env scripts/studio-users.mjs list | add <email> [\"Name\"] [--admin] | reset <email> | role <email> admin|editor | remove <email>");
  process.exit(1);
}
if (!["list", "add", "reset", "role", "remove"].includes(cmd)) usage();
if (cmd !== "list" && !validEmail) usage();
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set (did you pass --env-file=.env?)");
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);
const admins = mongoose.connection.db.collection("admins");
const newPassword = async () => {
  const password = crypto.randomBytes(12).toString("base64url");
  return { password, hash: await bcrypt.hash(password, 12) };
};
const done = async (code = 0) => { await mongoose.disconnect(); process.exit(code); };

if (cmd === "list") {
  const rows = await admins.find({}, { projection: { email: 1, name: 1, role: 1, createdAt: 1 } }).sort({ role: 1, email: 1 }).toArray();
  if (!rows.length) console.log("No Studio accounts yet.");
  for (const r of rows) console.log(`${(r.role || "admin").padEnd(7)} ${r.email.padEnd(36)} ${r.name || ""}${r.createdAt ? `  (since ${new Date(r.createdAt).toISOString().slice(0, 10)})` : ""}`);
  await done();
}

const existing = await admins.findOne({ email });

if (cmd === "add") {
  if (existing) { console.error(`${email} already has an account (role: ${existing.role}). Use "reset" for a new password.`); await done(1); }
  const { password, hash } = await newPassword();
  const role = flags.includes("--admin") ? "admin" : "editor";
  await admins.insertOne({ email, name: words[0] || (role === "admin" ? "Admin" : "Editor"), password: hash, role, createdAt: new Date(), updatedAt: new Date() });
  console.log(`Added ${email} as ${role}.\n  password: ${password}\nSave it in the password manager now; it is not shown again. Sign in at https://axionindex.org/studio`);
  await done();
}

if (!existing) { console.error(`${email} has no Studio account.`); await done(1); }

if (cmd === "reset") {
  const { password, hash } = await newPassword();
  await admins.updateOne({ _id: existing._id }, { $set: { password: hash, updatedAt: new Date() } });
  console.log(`New password for ${email}:\n  password: ${password}\nSave it in the password manager now; it is not shown again.`);
}
if (cmd === "role") {
  const role = words[0];
  if (role !== "admin" && role !== "editor") usage();
  await admins.updateOne({ _id: existing._id }, { $set: { role, updatedAt: new Date() } });
  console.log(`${email} is now ${role}. They need to sign out and in again.`);
}
if (cmd === "remove") {
  const others = await admins.countDocuments({ role: "admin", _id: { $ne: existing._id } });
  if (existing.role === "admin" && others === 0) { console.error("This is the last admin. Add another admin first (two admins at all times)."); await done(1); }
  await admins.deleteOne({ _id: existing._id });
  console.log(`Removed ${email}. They can no longer sign in to the Studio. (A session already open ends when it expires; change AUTH_SECRET to end every session at once.)`);
}
await done();
