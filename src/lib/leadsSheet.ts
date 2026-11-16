/**
 * Leads sheet (Fix Brief Part 4, item 20): every form submission lands as a row in a Google
 * Sheet that Nitin reviews on Mondays. The sheet runs a small Apps Script (scripts/leads-sheet/
 * Code.gs) that appends rows; the site posts to it. MongoDB stays the full record.
 *
 * Server .env:
 *   LEADS_SHEET_URL=https://script.google.com/macros/s/…/exec   (the Apps Script web app)
 *   LEADS_SHEET_SECRET=…                                        (same value as in Code.gs)
 *   AI_EDGE_SHEET_URL=…   optional: AI Edge Lab interest goes to its own sheet; without it,
 *                          to an "AI Edge Lab" tab of the same file, never the Leads tab.
 * Not set → rows are skipped (the submission is still saved and emailed).
 */

export type LeadRow = {
  form: string;            // "Conversation", "Report: Make or Break", "Journal sign-up"…
  name: string;
  email: string;
  phone?: string;
  organisation?: string;
  role?: string;
  practice?: string;
  signals?: string[];
  message?: string;
  sourcePage?: string;
  cameFrom?: string;       // utm tags or referring site (Fix Brief Part 6, item 40)
  /** Extra columns for this row only, e.g. Country and Assessment on the AI Edge Lab tab */
  extra?: Record<string, string>;
};

function sheetDate(d = new Date()) {
  // "2026-11-16 14:05" in India time, sorts correctly as text
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(d).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}`;
}

/** Column order = the brief's list (date, name, organisation, role, form, signals, message, source page), then contact details. */
function toColumns(r: LeadRow): Record<string, string> {
  return {
    "Date": sheetDate(),
    "Name": r.name,
    "Organisation": r.organisation ?? "",
    "Role": r.role ?? "",
    "Form": r.form,
    "Signals chosen": (r.signals ?? []).join(" | "),
    "Message": r.message ?? "",
    "Source page": r.sourcePage ?? "",
    "Came from": r.cameFrom ?? "",
    "Email": r.email,
    "Phone": r.phone ?? "",
    "Practice": r.practice ?? "",
    ...(r.extra ?? {}),
  };
}

/**
 * Google Apps Script answers in about a second, but about 1 call in 5 hangs with no reply (measured from
 * the server on 16 Nov; same on IPv4 and with curl, so it is on Google's side). So: short tries, a few of
 * them. This runs after the visitor already has their answer, so the retries cost nobody any time.
 * Each submission carries one id; Code.gs skips an id it has already written, so a retry after a reply
 * that got lost on the way back cannot add the row twice.
 */
const TRY_MS = 12_000;
const WAIT_BEFORE_TRY_MS = [0, 2_000, 5_000, 10_000];
const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function post(url: string | undefined, tab: string, row: LeadRow): Promise<boolean> {
  if (!url) {
    console.info(`[SHEET] no sheet URL set — skipped "${tab}" row for ${row.form}`);
    return false;
  }
  return send(url, tab, { row: toColumns(row) }, `${row.form}, ${row.email}`);
}

/**
 * One call to the sheet's script, retried as above. `extra`: the row, and for an upsert the key
 * column (`key`) plus the full row to add when no row has that key yet (`insert`).
 */
async function send(url: string, tab: string, extra: { row: Record<string, string>; key?: string; insert?: Record<string, string> }, what: string): Promise<boolean> {
  const body = JSON.stringify({ secret: process.env.LEADS_SHEET_SECRET ?? "", tab, id: crypto.randomUUID(), ...extra });
  for (let i = 0; i < WAIT_BEFORE_TRY_MS.length; i++) {
    if (WAIT_BEFORE_TRY_MS[i]) await pause(WAIT_BEFORE_TRY_MS[i]);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        redirect: "follow",
        signal: AbortSignal.timeout(TRY_MS),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        if (i > 0) console.info(`[SHEET] "${tab}" row added on try ${i + 1}`);
        return true;
      }
      // The script answered "no" (wrong secret, bad data): trying again will not help
      if (data && data.ok === false) {
        console.error(`[SHEET] "${tab}" row rejected (${res.status})`, data);
        return false;
      }
      console.warn(`[SHEET] "${tab}" try ${i + 1}: HTTP ${res.status}, no answer from the script`);
    } catch (err) {
      console.warn(`[SHEET] "${tab}" try ${i + 1} failed: ${err instanceof Error ? err.name : err}`);
    }
  }
  console.error(`[SHEET] could not write "${tab}" row (${what}) after ${WAIT_BEFORE_TRY_MS.length} tries; it is still saved in the database`);
  return false;
}

/** A row in the Axion leads sheet. Never throws. */
export const addLeadRow = (row: LeadRow) => post(process.env.LEADS_SHEET_URL, "Leads", row);

/* ── AI Edge Lab early access (Nitin, 16 Nov): "Individuals" and "Organisations" tabs ──────────
 * One row per person / organisation, updated in place (the script finds the row by its key column).
 * These tabs need the current Code.gs (it answers GET with {v: 2}); an older script would put the
 * rows in the Leads tab, so nothing is sent until the sheet's script is up to date.
 */
const aiEdgeUrl = () => process.env.AI_EDGE_SHEET_URL || process.env.LEADS_SHEET_URL;
let v2: { ok: boolean; at: number } | null = null;

async function sheetIsCurrent(url: string): Promise<boolean> {
  if (v2 && (v2.ok || Date.now() - v2.at < 10 * 60_000)) return v2.ok;
  let ok = false;
  for (let i = 0; i < 3 && !ok; i++) {
    try {
      const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(TRY_MS) });
      const data = await res.json().catch(() => null);
      ok = data?.v === 2;
      if (res.ok && !ok) break; // it answered, but it is the old script
    } catch { /* Google did not answer: try again */ }
  }
  v2 = { ok, at: Date.now() };
  if (!ok) console.error("[SHEET] The leads sheet's script is out of date (or not answering): paste scripts/leads-sheet/Code.gs into it and deploy a new version. AI Edge Lab rows are not sent until then; they are saved in the database.");
  return ok;
}

/** Sheet time: "2026-11-16 14:05" (India). */
export const sheetTime = (d: Date) => sheetDate(d);

async function upsert(tab: "Individuals" | "Organisations", key: string, row: Record<string, string>, insert: Record<string, string>, what: string) {
  const url = aiEdgeUrl();
  if (!url) { console.info(`[SHEET] no sheet URL set — skipped "${tab}" row`); return false; }
  if (!(await sheetIsCurrent(url))) return false;
  return send(url, tab, { key, row, insert }, what);
}

/** A person on the early-access list: update their row (found by Email), or add it. */
export const upsertIndividualRow = (row: Record<string, string>, insert: Record<string, string>) =>
  upsert("Individuals", "Email", row, insert, row.Email ?? "");

/** An organisation (found by name): update its row, or add it. */
export const upsertOrganisationRow = (row: Record<string, string>, insert: Record<string, string>) =>
  upsert("Organisations", "Organisation", row, insert, row.Organisation ?? "");

/** "Came from" as sent by the browser: plain text, short. */
export const cleanCameFrom = (v: unknown) => (typeof v === "string" ? v.replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, 150) : "");

/** A safe "source page" value from the browser: a site path, nothing else. */
export function cleanSourcePage(v: unknown): string {
  if (typeof v !== "string") return "";
  const s = v.trim().slice(0, 200);
  return /^\/[\w\-./?=&%#]*$/.test(s) ? s : "";
}
