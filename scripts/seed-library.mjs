#!/usr/bin/env node
/**
 * Fill the Studio's database with the starting library (src/content/library.json + texts).
 * Safe: does nothing if the database already has items. (The Studio also does this on its first save.)
 *
 *   node --env-file=.env scripts/seed-library.mjs
 */
import mongoose from "mongoose";
import { connect, refreshSite, seedIfEmpty } from "./lib/library-db.mjs";

const c = await connect();
const added = await seedIfEmpty(c);
console.log(added ? `Added ${added} items to the Studio.` : "The Studio already has items; nothing changed.");
if (added) await refreshSite();
await mongoose.disconnect();
