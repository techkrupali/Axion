# Launch: Make or Break, 20 November 2026

Owner of the send: **the tech team** (tracker G-02: "Tech emails existing sign-ups the download link on 20 Nov"). Tool: the site's own sender, `scripts/send-report.mjs`, from office@axionindex.org. Time: **9:00 am IST** (recommended; Nitin approves the test email on 19 Nov).

Everything below runs on the server from `/var/www/axion` unless it says otherwise.

## By 18 November: email set-up and test (G-01)

1. **DNS (Namecheap → Advanced DNS):** add SPF and DMARC (`docs/access.md`, "Email records"). DKIM is already in place.
2. **Sending address:** if office@ exists, switch `SMTP_USER`, `SMTP_PASSWORD` and `SMTP_FROM` to it (`docs/forms-and-leads.md` § 1), then run `pm2 restart axion`.
3. **Test sends to a Gmail and an Outlook inbox:**
   ```bash
   node --env-file=.env scripts/send-report.mjs --report make-or-break --link https://axionindex.org/reports/make-or-break --test someone@gmail.com
   node --env-file=.env scripts/send-report.mjs --report make-or-break --link https://axionindex.org/reports/make-or-break --test someone@outlook.com
   ```
   Also send one form (Journal sign-up) to each inbox, to see the acknowledgement email.
4. In each inbox, check the email arrived in the **Inbox, not Spam**. Open "Show original" (Gmail) and check SPF, DKIM and DMARC all say **PASS**.

## 19 November: dry run (G-02)

1. Count who is waiting (sends nothing):
   ```bash
   node --env-file=.env scripts/send-report.mjs --report make-or-break --link https://axionindex.org/reports/make-or-break
   ```
2. Check the long-form page privately: `https://axionindex.org/global-ai-report/edition-01?preview=<REPORT_PREVIEW_KEY>`.
3. In the Studio, open **Make or Break**:
   - confirm the title (D7);
   - check what's inside, author and method (B-17: Nitin's desk draft is already filled in; change it here if he edits it);
   - put the PDF online and paste its link into **Report PDF**. Either add the file to the site as `public/reports/make-or-break.pdf` (it is then `/reports/make-or-break.pdf`), or use a public Google Drive link. Save.
4. Nitin marks the dry run "Approved" in the tracker.

## 20 November: go live

1. **Switch the site to "out now":** set `NEXT_PUBLIC_REPORT_PUBLISHED=true` in `.env`, then rebuild and restart:
   ```bash
   npm run build && pm2 restart axion
   ```
2. **Check the site:**
   - **Homepage:** the band says "Out now · Free to share · Download the report".
   - **Report page:** it offers "Download the report" after a short sign-up (name, email, organisation), and the thank-you page shows the PDF button.
3. **Send to everyone who signed up before release (at the agreed time):**
   ```bash
   node --env-file=.env scripts/send-report.mjs --report make-or-break --link https://axionindex.org/reports/make-or-break --send
   ```
   Running it again only reaches people who were missed. The link goes to the report page, where the PDF is.
   When it finishes, Nitin (`ADMIN_EMAIL`) gets a summary: how many were sent, and every address the mail server refused (T-02).
   Bounces that arrive later land in the sending inbox as "Delivery Status Notification" emails. In that Gmail inbox, add a filter `from:mailer-daemon` → "Forward to nitin@axionindex.org", so Nitin sees them too.
4. **LinkedIn:**
   - post with the tracked link: run `node --env-file=.env scripts/linkedin-links.mjs make-or-break`;
   - add the report to the Featured section;
   - refresh the preview in Post Inspector (https://www.linkedin.com/post-inspector/) for `https://axionindex.org/reports/make-or-break`.
5. **Google (G-07):** in Search Console, submit `https://axionindex.org/sitemap.xml`, then use URL Inspection → "Request indexing" on the report page.

## Addresses

- **Report page:** `https://axionindex.org/reports/make-or-break`.
- **The old address:** `https://axionindex.org/global-ai-report` still works and shows the same page (SEO-01).
- **Share image:** the report's cover, with the title "Make or Break: The Weakest Link in the Big AI Bet" (R-04).
