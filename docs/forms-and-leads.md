# Forms, follow-up and the leads sheet (Fix Brief Part 4)

## The ladder

| Step | Visitor does | Site gives them | Behind the scenes |
| --- | --- | --- | --- |
| 1. Read | Reads an essay, series or report page | Reading page, "Next in series", share buttons | Analytics event `Read` |
| 2. Follow | Follows Nitin on LinkedIn, or joins the Journal | Axion Index Journal, monthly | Added to the Journal list only if the consent box is ticked |
| 3. Download | Asks for a report | Report by email on release day | Saved with name, email, organisation; optional "Also send me the monthly Journal" |
| 4. Register | Early-bird registration on the AI Edge Lab page (assessment, country, consent) | A note when the institute's site opens; early-bird price | Separate AI Edge Lab list, never the leads tab |
| 5. Talk | "Start a conversation" | Thank-you page + acknowledgement email | Alert to nitin@ + row in the leads sheet |

Every form: saved in MongoDB, alert to `nitin@axionindex.org`, acknowledgement to the visitor (wording in `src/lib/acknowledge.ts`), row in the sheet, thank-you page (`/thank-you`), and the privacy line underneath.

There is one conversation form. Every "Start a conversation / Begin a diagnostic / Request a diagnostic" button opens it. Reach Us (`/connect`) embeds the same form. Practice pages pass their practice silently.

## 1. Sending from office@axionindex.org

All emails are sent from the mailbox in `SMTP_USER`. To send as office@:

1. Create the `office@axionindex.org` mailbox (Google Workspace) and turn on 2-step verification.
2. Create an app password for it.
3. In the server `.env`, set:
   ```
   SMTP_USER=office@axionindex.org
   SMTP_PASSWORD=<the new app password>
   SMTP_FROM="Axion Index <office@axionindex.org>"
   ADMIN_EMAIL=nitin@axionindex.org
   ```
4. Restart: `pm2 restart axion`.

Alerts still go to nitin@ (`ADMIN_EMAIL`). Visitors' replies go to office@.

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
