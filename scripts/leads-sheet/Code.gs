/**
 * Axion Index leads sheet (Fix Brief Part 4, item 20).
 * Paste this into the Google Sheet: Extensions → Apps Script. Setup: docs/forms-and-leads.md.
 *
 * The website posts each form submission here; this appends it as a row to the tab it names
 * ("Leads", or "AI Edge Lab" for the separate AI Edge Lab list). Header row is created on first use.
 */

// Must match LEADS_SHEET_SECRET in the website's server .env. Use a long random value.
const SECRET = 'PASTE-THE-SAME-SECRET-AS-LEADS_SHEET_SECRET';
const ALLOWED_TABS = ['Leads', 'AI Edge Lab'];

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply({ ok: false, error: 'bad json' });
  }
  if (!body || body.secret !== SECRET) return reply({ ok: false, error: 'unauthorised' });
  const tab = ALLOWED_TABS.indexOf(body.tab) >= 0 ? body.tab : 'Leads';
  const row = body.row || {};

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const book = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = book.getSheetByName(tab) || book.insertSheet(tab);
    let headers = sheet.getLastRow() > 0 ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];
    if (headers.length === 0) {
      headers = Object.keys(row);
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
    // A new field from the website becomes a new column at the end
    Object.keys(row).forEach(function (key) {
      if (headers.indexOf(key) === -1) {
        headers.push(key);
        sheet.getRange(1, headers.length).setValue(key).setFontWeight('bold');
      }
    });
    sheet.appendRow(headers.map(function (h) { return safe(row[h]); }));
  } finally {
    lock.releaseLock();
  }
  return reply({ ok: true });
}

// Text that starts with = + - @ would run as a formula; store it as plain text instead.
function safe(v) {
  const s = v === undefined || v === null ? '' : String(v);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
