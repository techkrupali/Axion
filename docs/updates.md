# How updates happen (Fix Brief Part 7)

New content goes live without waiting for a developer. Reports and Articles & Publications are edited in the **Studio** (`https://axionindex.org/studio`): add an item, preview it, publish it, in under 10 minutes. Setup and fields: `src/content/README.md`.

## A change request (anything that is not a library item)

| Step | Who | Where |
| --- | --- | --- |
| 42. Add a row: what to change and why | Nitin or his content person | Tracker |
| 43. Build it and share a preview link in the same row | Tech team | Tracker (preview: run the branch locally, or push to a preview URL) |
| 44. Approve: Status = "Approved" | Nitin | Tracker |
| 45. Publish, then fill in the Done date | Tech team | Server, then tracker |

Publishing a code change on the server:

```bash
cd /var/www/axion && git pull && npm ci && npm run build && pm2 restart axion
```

Library items (essays, media pieces, series parts, reports) do **not** need this: publish them in the Studio.

## The routine

| When | What | Who | How |
| --- | --- | --- | --- |
| Every Monday | Add last week's LinkedIn essays and media pieces to Articles & Publications, in their category | Content person | Studio: **+ Essay** / **+ In the media** (Help page in the Studio) |
| Every Monday | Check the live LinkedIn feed shows the latest posts | Content person | Homepage, "Latest on LinkedIn" (once the feed widget is set up: `docs/linkedin.md`) |
| Every Monday | Review the leads sheet; reply to every conversation within 48 hours | Nitin | Leads sheet ("Leads" tab; "Came from" shows LinkedIn posts) |
| Each report or series end | Report page, homepage card, newsletter, LinkedIn Featured section | Content person + tech | Report page and series in the Studio. Homepage card and Featured links: tech team (`src/config/report.ts`, `docs/linkedin.md`) |
| Monthly, 1st week | Send the Axion Index Journal email | Content person, Nitin approves | Export the list (`docs/forms-and-leads.md` § 5) into the email tool |
| Monthly, 1st week | One-page analytics note: visits, top pages, forms sent, LinkedIn-sourced visits | Tech team | Plausible or GA4. Template below |
| Monthly | Check every status label and date (practice status, Labour Codes dates, report dates) | Tech team | `node scripts/check-dates.mjs` lists every date and status label, and where it lives |
| Monthly | Uptime for the month, SSL days left, domain renewal date | Tech team | UptimeRobot dashboard (`docs/monitoring.md`) |
| Quarterly | Design check: 4 random pages side by side against Part 1; broken-link scan | Tech team | Pages at 1440 px and 375 px; `node scripts/check-links.mjs` |
| Quarterly | Accuracy check of Labour Codes content by a lawyer | Nitin | `/expertise/labour` |

**Done looks like:** Articles & Publications is never more than 7 days behind LinkedIn, and no date on the site is older than the last monthly check.

## Monthly analytics note (template)

```
Axion Index · analytics, <month year>

Targets (G-10, set by Nitin): visits <n> · report sign-ups <n> · conversations <n> · LinkedIn-sourced visits <n>

Visits: <n> (previous month <n>)
Top pages: 1. <page> <n>  2. <page> <n>  3. <page> <n>  4. <page> <n>  5. <page> <n>
Forms sent: conversations <n> · report requests <n> · Journal sign-ups <n> · AI Edge Lab early-bird <n>
From LinkedIn: <n> visits; by series: <campaign> <n>, <campaign> <n>
Read: top 3 essays or series parts by "Read" events
Against target: <on / below / above, for each of the numbers above>
One thing to change next month: <…>
```

In Plausible, every number is on the dashboard: Goals for the form events, and Campaigns for `utm_campaign`. In GA4, use Reports → Engagement → Events, and Acquisition → Traffic acquisition (Session campaign).
