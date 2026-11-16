# Access and ownership (Fix Brief Part 9)

Every account behind axionindex.org must belong to Axion Index, with Nitin as owner, so the firm never depends on one developer's login. Copy the table below into the tracker's **Access** tab once, fill in the blanks, and review it every quarter.

## The Access tab, for this website

"What we know" is what the tech team could see on 16 Nov 2026. Each row needs Nitin to confirm the owner.

| Asset | What it is here | Owner (should be) | Others | What we know / to do |
| --- | --- | --- | --- | --- |
| Domain axionindex.org | Registered at **Namecheap** | Axion Index, Nitin's email | Tech lead (delegated) | Confirm the Namecheap account is Nitin's. Turn **auto-renew on**; put the renewal date in the tracker. |
| DNS and email records | Namecheap DNS (`dns1/2.registrar-servers.com`) | Axion Index | Tech lead | Site → `187.127.132.112`. Mail → Google. DKIM ✓. **SPF missing, DMARC missing**: add the two records below. |
| Hosting | **Hostinger VPS** (Ubuntu, nginx, pm2), not Vercel | Axion Index, Nitin as owner, Axion's card | Developers (SSH keys) | Confirm the Hostinger account and card are Axion's. Give each developer their own SSH key; no shared root password. |
| Database | **MongoDB Atlas** (forms, Studio content, Studio logins) | Axion Index, Nitin as owner | Tech lead | Confirm the Atlas organisation owner. Turn on backups if the plan allows; otherwise rely on the monthly exports below. |
| Code | GitHub repo **techkrupali/Axion** (a developer's personal account) | **Axion Index organisation**, Nitin as owner | Developers as members | Create a GitHub organisation, then transfer the repo. Steps below. |
| Content manager | **Studio** at axionindex.org/studio | Nitin as admin | Content person (editor), tech (admin) | `scripts/studio-users.mjs` adds, lists and removes logins. Keep two admins. |
| Email inboxes | Google Workspace: nitin@, office@ | Axion Index | — | Create **office@** (the public address); it should also send the site's emails. Alerts go to nitin@. |
| Website email sending | SMTP app password in the server `.env` | Axion Index | Tech (server only) | Switch to office@'s own app password once it exists (`docs/forms-and-leads.md` § 1). |
| Leads sheet and form data | Google Sheet + Apps Script (`docs/forms-and-leads.md` § 2) | Axion Index Drive | Nitin; tech for setup only | Create the sheet **in Axion's Drive**, not a developer's. Personal data stays there and in Atlas. |
| Analytics | Plausible or GA4 (not chosen yet) | Axion Index, Nitin admin | Tech, content person (view) | Open the account in Axion's name. |
| Search Console | A Google verification record already exists on the domain | Axion Index, Nitin admin | Tech (view) | Find which Google account verified it; make sure Nitin is an owner. |
| Newsletter tool | Not chosen yet | Axion Index, Axion's card | Content person | Subscription date in the tracker. |
| LinkedIn feed widget | Elfsight or Curator (not bought yet) | Axion Index, Axion's card | Content person | Subscription date in the tracker. |
| LinkedIn company page | linkedin.com/company/axionindex | Nitin (super admin) | One backup admin | Two admins at all times. |
| Server secrets | `/var/www/axion/.env` (database, email, login secret) | Axion Index | Tech (server only) | Keep a copy in the shared password manager. |

### Email records to add at Namecheap (DNS → Advanced DNS)

These let inboxes trust the site's form replies and report emails:

| Type | Host | Value |
| --- | --- | --- |
| TXT | `@` | `v=spf1 include:_spf.google.com ~all` |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:office@axionindex.org` |

DKIM is already in place (`google._domainkey`). After two clean weeks of DMARC reports, change `p=none` to `p=quarantine`.

## The six rules, in practice

46. **In Axion's name.** No account on a developer's personal email or card. For this site, the GitHub repo is the one that breaks this rule today. Also check the Namecheap, Hostinger and Atlas accounts.
47. **Two admins, 2-step verification on**, on every row above (Nitin + one trusted backup).
48. **Passwords in a shared password manager**, never WhatsApp or email. Some credentials for this site were shared in chat during setup: the Gmail app password, the MongoDB database password and the report preview key. Change those three now, then store the new ones in the password manager:
    - Gmail app password: revoke the old one in Google → Security → App passwords, create a new one, and update `SMTP_PASSWORD`.
    - MongoDB password: Atlas → Database Access → edit user → new password, and update `MONGODB_URI`.
    - Report preview key: set a new `REPORT_PREVIEW_KEY`.

    Then run `pm2 restart axion`.
49. **Remove access the day someone leaves.** Do it on every row of the Access tab:
    - Studio: `node --env-file=.env scripts/studio-users.mjs remove <email>`.
    - Server: remove their SSH key from `~/.ssh/authorized_keys`.
    - GitHub, Atlas and Google: remove them from the organisation.
50. **Nothing goes live without approval.** Use a preview link, then Nitin marks "Approved" in the tracker, then tech publishes. The preview site is set up below. Library items go through the Studio's own Preview.
51. **Backups.**
    - Code: in the Axion GitHub organisation.
    - Studio content: export monthly with `node --env-file=.env scripts/export-library.mjs`, and upload the file to Axion's Drive ("Website backups").
    - Leads: the sheet lives in Axion's Drive.

## Moving the code into an Axion Index GitHub organisation

1. Nitin creates a free organisation at github.com/organizations/new (e.g. `axionindex`), as its owner, and adds the tech lead as a member.
2. The current repo owner opens the repo's **Settings → Danger Zone → Transfer**, and transfers it to the organisation. GitHub keeps redirects from the old address.
3. On the server: `cd /var/www/axion && git remote set-url origin https://github.com/<organisation>/Axion.git && git pull`.
4. Developers do the same on their machines. No code is kept only on a laptop: everything is pushed.

## Preview site (rule 50)

A second copy of the site at **preview.axionindex.org**, on the same server. It is never indexed and shows a "Preview" badge. It doesn't send emails or write to the leads sheet, because those settings are left out of its `.env`.

1. **DNS (Namecheap):** add an `A` record, host `preview`, value `187.127.132.112`.
2. **On the server**, as the deploy user:
   ```bash
   git clone https://github.com/<organisation>/Axion.git /var/www/axion-preview
   cd /var/www/axion-preview && git checkout -b preview
   cp /var/www/axion/.env .env
   ```
   Then edit `.env`:
   - add `NEXT_PUBLIC_SITE_ENV=preview`;
   - point `MONGODB_URI` at a separate database name, e.g. change `/axion` to `/axion_preview`;
   - delete the `SMTP_*`, `LEADS_SHEET_*` and analytics lines;
   - set a different `AUTH_SECRET`.

   Then build and start it:
   ```bash
   npm ci && npm run build
   pm2 start npm --name axion-preview -- start -- -p 3001 && pm2 save
   ```
3. **nginx:** copy the axionindex.org server block. Change `server_name` to `preview.axionindex.org` and `proxy_pass` to `http://127.0.0.1:3001`. Optionally add a password with `auth_basic`. Then run `sudo nginx -t && sudo systemctl reload nginx && sudo certbot --nginx -d preview.axionindex.org`.
4. **Each change:**
   - Push it to the `preview` branch.
   - Update the preview: `cd /var/www/axion-preview && git pull && npm ci && npm run build && pm2 restart axion-preview`.
   - Put the preview link in the tracker row.
   - Once it is "Approved", merge into `master` and deploy the live site as usual.

## Every quarter

- Open the Access tab and confirm each owner, each admin pair and each renewal date.
- Remove anyone who no longer needs access. To see who has Studio logins, run `node --env-file=.env scripts/studio-users.mjs list`.
- Check that 2-step verification is on for every admin.
- Confirm the last three monthly Studio exports are in Axion's Drive.
