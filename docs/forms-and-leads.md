# Forms, follow-up and the leads sheet (Fix Brief Part 4)

## The ladder

| Step | Visitor does | Site gives them | Behind the scenes |
| --- | --- | --- | --- |
| 1. Read | Reads an essay, series or report page | Reading page, "Next in series", share buttons | Analytics event `Read` |
| 2. Follow | Follows Nitin on LinkedIn, or joins the Journal | Axion Index Journal, monthly | Added to the Journal list only if the consent box is ticked |
| 3. Download | Asks for a report | Report by email on release day | Saved with name, email, organisation; optional "Also send me the monthly Journal" |
| 4. Register | AI Edge Lab early access (Nitin, 16 Nov): one choice, "Which describes you?" (AAI / ARI / LLI), then contact details and consent. Leaders then see an optional, unticked ORG AI DARS question (headcount band, main question) | A thank-you on screen and by email; a note when the institute's site opens | Separate AI Edge Lab list, never the Leads tab: sheet tabs **Individuals** (one row per person, Track column, track changes noted) and **Organisations** (one row per organisation). Nitin: an email per organisation at once, a daily summary of individuals |
| 5. Talk | "Start a conversation" | Thank-you page + acknowledgement email | Alert to nitin@ + row in the leads sheet |

Every form: saved in MongoDB, alert to `nitin@axionindex.org`, acknowledgement to the visitor (wording in `src/lib/acknowledge.ts`), row in the sheet, thank-you page (`/thank-you`), and the privacy line underneath.

There is one conversation form. Every "Start a conversation / Begin a diagnostic / Request a diagnostic" button opens it. Reach Us (`/connect`) embeds the same form. Practice pages pass their practice silently.

## 1. Sender and reply address (support@)

`support@axionindex.org` is the only public address (Nitin, 16 Nov). office@ and admin@ do not exist. Every visitor email has **Reply-To: support@**.

**Done 18 Nov.** support@ is an **alias of nitin@** (Google Admin → Users → Nitin Nahata → Alternative emails), not a separate mailbox: its mail lands in nitin@'s inbox, with no extra password or licence. The website sends **from** support@:

1. In the nitin@ Gmail: **Settings → Accounts → Send mail as**: `Axion Index <support@axionindex.org>` is added and confirmed ("Treat as an alias" ticked). nitin@ stays the default. **When replying to a message: Reply from the same address to which the message was sent**, so replies to support@ mail go from support@.
2. The server `.env` has:
   ```
   SMTP_FROM="Axion Index <support@axionindex.org>"
   ```
   with `SMTP_USER`, `SMTP_PASSWORD` (nitin@ app password) and `ADMIN_EMAIL=nitin@axionindex.org` unchanged.
3. After any change: `pm2 restart axion`. Tested 18 Nov: From support@, SPF, DKIM and DMARC all PASS.

Without step 1, Gmail quietly replaces the sender with nitin@. Alerts always go to nitin@ (`ADMIN_EMAIL`); that address is never shown on the site.

## 2. The leads sheet (Google Sheets)

1. Create a Google Sheet, for example "Axion Index leads".
2. Open **Extensions → Apps Script** and paste in `scripts/leads-sheet/Code.gs`.
3. Replace `PASTE-THE-SAME-SECRET-AS-LEADS_SHEET_SECRET` with a long random value. To make one, run `openssl rand -hex 24`.
4. **Deploy → New deployment → Web app**. Set Execute as **Me** and Who has access to **Anyone**. Then **Deploy** and copy the web app URL.
5. In the server `.env`, set:
   ```
   LEADS_SHEET_URL=<the web app URL>
   LEADS_SHEET_SECRET=<the same random value>
   ```
6. Restart: `pm2 restart axion`. Submit one test form and check that a row appears in the "Leads" tab.

Columns: Date, Name, Organisation, Role, Form, Signals chosen, Message, Source page, Email, Phone, Practice.

AI Edge Lab early-bird registrations go to an "AI Edge Lab" tab, with extra Country and Assessment columns. To keep them in a different file, deploy the same script in a second sheet and set `AI_EDGE_SHEET_URL`.

If the sheet is down, nothing is lost: every submission is still in MongoDB and in nitin@'s inbox.

**Slow Google.** Google Apps Script answers in about a second, but about 1 call in 5 hangs with no reply (measured from the server on 16 Nov, on IPv4 and with curl, so it is on Google's side). The website therefore tries up to 4 times, 12 seconds each, after the visitor already has their answer (`src/lib/leadsSheet.ts`). The server's IPv6 route to Google does not work at all, so the site also prefers IPv4 (`src/lib/preferIpv4.ts`).

Each submission carries one id, and `Code.gs` skips an id it has already written. That way a retry never adds a row twice. **After updating `Code.gs` in the sheet**, keep your own `SECRET` line, then **Deploy → Manage deployments → edit → Version: New version → Deploy**. The web app URL stays the same.

If a row is still missing, the server log (`pm2 logs axion`) says `[SHEET] could not add … after 4 tries`. The submission is still in the database and in nitin@'s inbox.

## 2b. AI Edge Lab early access (Individuals and Organisations)

- **Sheet:** the current `scripts/leads-sheet/Code.gs` creates two tabs. *Individuals*: one row per person, found by Email and updated in place; a new track fills *Track changed at* and *Previous track*. *Organisations*: one row per organisation (another leader from the same organisation goes in *Also requested by*). Both have Registered at, Consent given, Source, Invited for complimentary and Status; counts per track and of organisations are on rows 1–2. The team keeps *Invited for complimentary* and *Status* (Registered / Invited / Converted / Unsubscribed) up to date in the sheet; the website never overwrites them.
- **Older script:** the website asks the sheet's script for its version first. An older Code.gs would put these rows in the Leads tab, so they are not sent until the script is updated (they stay in the database, and the server log says so).
- **Daily summary to Nitin:** `scripts/ai-edge-daily-summary.mjs`, from cron on the server at 9:00 IST (`30 3 * * *`, see the file). Nothing is sent on a day with no new registrations. `--dry-run` prints it instead.
- **Organisations:** an email to Nitin at once, for each one.
- **Handover:** `node --env-file=.env scripts/export-ai-edge-list.mjs ai-edge-handover` writes `AAI.csv`, `ARI.csv`, `LLI.csv` and `organisations.csv`. If the team changed Status or Invited in the sheet, use the sheet's values (download its tabs too).

## 3. Analytics

Set **one** of these in the server `.env`, then rebuild (`npm run build && pm2 restart axion`):

- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=axionindex.org`: Plausible (paid, no cookies, no cookie banner needed). Add the site in Plausible first. If Plausible gives you a site-specific script URL, also set `NEXT_PUBLIC_PLAUSIBLE_SRC`.
- `NEXT_PUBLIC_GA_ID=G-XXXXXXX`: Google Analytics 4 (free, uses cookies).

Events sent: `Form started`, `Form sent`, `Report requested`, `LinkedIn click`, `Newsletter sign-up`, `Read`, `Share`. (`Assessment finished` belongs to the AI Edge diagnostic, which moved off this site in Part 5; the institute's site should send it.) In Plausible, add each one under **Site settings → Goals → Custom event** to see it on the dashboard. In GA4 they arrive as `form_started`, `form_sent` and so on.

## 4. Release day: emailing a report

On the server, from `/var/www/axion`:

```bash
# how many people are waiting (sends nothing)
node --env-file=.env scripts/send-report.mjs --report make-or-break --link https://axionindex.org/global-ai-report/edition-01
# one sample to yourself
node --env-file=.env scripts/send-report.mjs --report make-or-break --link https://axionindex.org/global-ai-report/edition-01 --test you@example.com
# everyone
node --env-file=.env scripts/send-report.mjs --report make-or-break --link https://axionindex.org/global-ai-report/edition-01 --send
```

Each person is marked as sent, so running it again only reaches people who were missed. Use the link where the report actually lives on release day: the report page, or a PDF.

## 5. The Journal list

Everyone who ticked the consent box is in the MongoDB collection `newslettersignups`, with `consentAt` and `source`. They are also in the leads sheet, as rows with Form = "Journal sign-up", or a report request whose message says "Also asked for the Axion Index Journal". Import that list into whichever tool sends the monthly Journal. Remove anyone who replies "unsubscribe".

## 6. AI Edge Lab (Fix Brief Part 5)

- The diagnostic is off axionindex.org. `/expertise/ai-edge/diagnostic` redirects to the early-bird form on the AI Edge Lab page.
- **Launch day of the institute's site:** set `NEXT_PUBLIC_AI_EDGE_LAB_URL=https://…` in the server `.env`, then run `npm run build && pm2 restart axion`. The bridge page shows "Visit AI Edge Lab", and the old diagnostic address redirects (301) to the new site.
- **Handing over the early-bird list:** run `node --env-file=.env scripts/export-ai-edge-list.mjs ai-edge-early-bird.csv`. It exports only people who ticked the consent box.
- The question set and scoring (`src/config/diagnosticConfig.ts`, `src/engine/scoring.ts`, `src/report/`) stay in this repository for the institute's site. They are no longer used here.
