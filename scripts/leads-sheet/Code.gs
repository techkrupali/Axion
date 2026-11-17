/**
 * Axion Index leads sheet (Fix Brief Part 4, item 20; AI Edge Lab early access, Nitin 16 Nov).
 * Paste this whole file into the Google Sheet: Extensions → Apps Script. Keep your own SECRET line.
 * Then Deploy → Manage deployments → edit (pencil) → Version: New version → Deploy. The URL stays.
 * Setup: docs/forms-and-leads.md.
 *
 * Tabs (each is created on first use):
 *  • Leads          one row per form submission, added at the bottom.
 *  • Individuals    AI Edge Lab early access: one row per person, found by Email and updated in place.
 *  • Organisations  ORG AI DARS early access: one row per organisation, found by Org ID (the leader's
 *                   work-email domain; with a personal email the name, and "To check" is filled in).
 *  Individuals and Organisations show counts on rows 1–2; their column headings are on row 4.
 *  The team keeps "Invited for complimentary" and "Status" up to date in the sheet; the website never
 *  changes them once a row exists.
 */

// Must match LEADS_SHEET_SECRET in the website's server .env. Use a long random value.
const SECRET = 'PASTE-THE-SAME-SECRET-AS-LEADS_SHEET_SECRET';
const VERSION = 2;
const TABS = {
  'Leads': { headerRow: 1 },
  'AI Edge Lab': { headerRow: 1 },   // the earlier AI Edge list, kept for its rows
  'Individuals': { headerRow: 4 },
  'Organisations': { headerRow: 4 },
};

// The website checks this before sending AI Edge Lab rows
function doGet() {
  return reply({ ok: true, v: VERSION });
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply({ ok: false, error: 'bad json' });
  }
  if (!body || body.secret !== SECRET) return reply({ ok: false, error: 'unauthorised' });
  const tab = body.tab;
  if (!TABS[tab]) return reply({ ok: false, error: 'unknown tab' });
  const row = body.row || {};
  const first = body.insert || row; // the full row, used when no row has this key yet

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    // The website retries when Google is slow to answer; never write the same submission twice
    const cache = CacheService.getScriptCache();
    const seenKey = body.id ? 'lead:' + String(body.id).slice(0, 64) : '';
    if (seenKey && cache.get(seenKey)) return reply({ ok: true, duplicate: true, v: VERSION });

    const sheet = getTab(tab);
    const hr = TABS[tab].headerRow;
    let headers = headerCells(sheet, hr);
    if (headers.length === 0) {
      headers = Object.keys(first);
      sheet.getRange(hr, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
      sheet.setFrozenRows(hr);
    }
    // A new field from the website becomes a new column at the end
    Object.keys(first).concat(Object.keys(row)).forEach(function (key) {
      if (headers.indexOf(key) === -1) {
        headers.push(key);
        sheet.getRange(hr, headers.length).setValue(key).setFontWeight('bold');
      }
    });

    const at = body.key ? findRow(sheet, hr, headers, body.key, row[body.key]) : 0;
    if (at) {
      // Update only the fields the website sent (Registered at, Status, Invited… stay as they are)
      Object.keys(row).forEach(function (key) {
        sheet.getRange(at, headers.indexOf(key) + 1).setValue(safe(row[key]));
      });
    } else {
      const values = headers.map(function (h) { return safe(first[h] !== undefined ? first[h] : row[h]); });
      sheet.getRange(Math.max(sheet.getLastRow(), hr) + 1, 1, 1, values.length).setValues([values]);
    }
    if (seenKey) cache.put(seenKey, '1', 21600); // remembered for 6 hours
  } finally {
    lock.releaseLock();
  }
  return reply({ ok: true, v: VERSION });
}

/** The tab, created with its count block the first time. */
function getTab(tab) {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(tab);
  if (sheet) return sheet;
  sheet = book.insertSheet(tab);
  if (tab === 'Individuals') {
    const count = function (track) {
      return '=IFERROR(COUNTIF(INDEX($A$5:$Z,0,MATCH("Track",$A$4:$Z$4,0)),"' + track + '"),0)';
    };
    sheet.getRange('A1:E1').setValues([['AAI', 'ARI', 'LLI', 'All individuals', 'Organisations']]);
    sheet.getRange('A2:E2').setFormulas([[
      count('AAI'), count('ARI'), count('LLI'),
      '=IFERROR(COUNTA(INDEX($A$5:$Z,0,MATCH("Email",$A$4:$Z$4,0))),0)',
      '=IFERROR(COUNTA(INDEX(INDIRECT("Organisations!A5:Z"),0,MATCH("Organisation",INDIRECT("Organisations!A4:Z4"),0))),0)',
    ]]);
    styleCounts(sheet, 5);
  }
  if (tab === 'Organisations') {
    sheet.getRange('A1').setValue('Organisations');
    sheet.getRange('A2').setFormula('=IFERROR(COUNTA(INDEX($A$5:$Z,0,MATCH("Organisation",$A$4:$Z$4,0))),0)');
    styleCounts(sheet, 1);
  }
  return sheet;
}

function styleCounts(sheet, columns) {
  sheet.getRange(1, 1, 1, columns).setFontSize(9).setFontColor('#6b6b6b').setFontWeight('bold');
  sheet.getRange(2, 1, 1, columns).setFontSize(16).setFontWeight('bold').setHorizontalAlignment('left');
}

function headerCells(sheet, hr) {
  const last = sheet.getLastColumn();
  if (sheet.getLastRow() < hr || last === 0) return [];
  return sheet.getRange(hr, 1, 1, last).getValues()[0]
    .map(function (h) { return String(h); })
    .filter(function (h, i, all) { return h !== '' || all.slice(i).some(function (x) { return String(x) !== ''; }); });
}

/** The sheet row whose `key` column matches `value` (ignoring case and extra spaces), or 0. */
function findRow(sheet, hr, headers, key, value) {
  const col = headers.indexOf(key) + 1;
  const last = sheet.getLastRow();
  if (!col || last <= hr || value === undefined || value === null || value === '') return 0;
  const want = norm(value);
  const values = sheet.getRange(hr + 1, col, last - hr, 1).getDisplayValues();
  for (let i = 0; i < values.length; i++) {
    if (norm(values[i][0]) === want) return hr + 1 + i;
  }
  return 0;
}

function norm(v) {
  return String(v).replace(/^'/, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

// Text that starts with = + - @ would run as a formula; store it as plain text instead.
function safe(v) {
  const s = v === undefined || v === null ? '' : String(v);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
