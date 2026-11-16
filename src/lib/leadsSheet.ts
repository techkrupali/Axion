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

async function post(url: string | undefined, tab: string, row: LeadRow): Promise<boolean> {
  if (!url) {
    console.info(`[SHEET] no sheet URL set — skipped "${tab}" row for ${row.form}`);
    return false;
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: process.env.LEADS_SHEET_SECRET ?? "", tab, row: toColumns(row) }),
      redirect: "follow",
      // Runs after the visitor already has their answer, so waiting longer costs nobody anything.
      // Google Apps Script can take 10 s+ on its first call after a quiet spell, or when rows queue up.
      signal: AbortSignal.timeout(30_000),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok) {
      console.error(`[SHEET] "${tab}" row rejected (${res.status})`, data);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[SHEET] could not add "${tab}" row:`, err);
    return false;
  }
}

/** A row in the Axion leads sheet. Never throws. */
export const addLeadRow = (row: LeadRow) => post(process.env.LEADS_SHEET_URL, "Leads", row);

/** AI Edge Lab is a separate list, never the Axion leads sheet (Fix Brief Part 4, step 4). */
export const addAiEdgeRow = (row: LeadRow) =>
  post(process.env.AI_EDGE_SHEET_URL || process.env.LEADS_SHEET_URL, "AI Edge Lab", row);

/** "Came from" as sent by the browser: plain text, short. */
export const cleanCameFrom = (v: unknown) => (typeof v === "string" ? v.replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, 150) : "");

/** A safe "source page" value from the browser: a site path, nothing else. */
export function cleanSourcePage(v: unknown): string {
  if (typeof v !== "string") return "";
  const s = v.trim().slice(0, 200);
  return /^\/[\w\-./?=&%#]*$/.test(s) ? s : "";
}
