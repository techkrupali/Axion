# LinkedIn and the website (Fix Brief Part 6)

LinkedIn is where people meet Nitin; the website is where they go deeper and get in touch. Every LinkedIn post should lead to the site in one click, and every site page to LinkedIn in one click.

## Already on the website

- The footer and the Founder page link to **Nitin on LinkedIn** (linkedin.com/in/nahatanitin) and **Axion Index on LinkedIn** (linkedin.com/company/axionindex).
- Every essay and series page has a **Discuss on LinkedIn** button to the original post, and share buttons (LinkedIn, X, WhatsApp, copy link).
- The Founder page's "Writing & media" shows the latest 6 items from Articles & Publications automatically.
- Every page has its own share title, description and 1200 × 630 image. Essays and reports use their covers.
- The Founder page tells Google which profiles are Nitin's (`src/config/founder.ts`). Add the ETHRWorld, Outlook, podcast and YouTube addresses there when you have them.
- Visits that arrive with tracking tags show up in analytics. The leads sheet's "Came from" column also shows which post or series a lead came from.

## For Nitin or his team, on LinkedIn

**Personal profile (item 37)**
- Website: `https://axionindex.org`
- Featured section, three items:
  - Report: `https://axionindex.org/reports/make-or-break?utm_source=linkedin&utm_medium=social&utm_campaign=featured`
  - Writing library: `https://axionindex.org/publications?utm_source=linkedin&utm_medium=social&utm_campaign=featured`
  - Start a conversation: `https://axionindex.org/connect?utm_source=linkedin&utm_medium=social&utm_campaign=featured`

**Company page (item 38)**
- Website: `https://axionindex.org`
- Tagline and logo: the same as the site ("From ambiguity to architecture.", the gold Axion Index mark).

**Each essay post (items 39 and 40)**
1. Publish the essay on the site first (Part 7), then post on LinkedIn.
2. In the first comment, paste the site link with its tracking tags. To print the links, run:
   ```bash
   node scripts/linkedin-links.mjs              # every published essay, series part and report
   node scripts/linkedin-links.mjs big-ai       # just the ones matching "big-ai"
   ```
   Each link ends in `?utm_source=linkedin&utm_medium=social&utm_campaign=<series-name>`, so analytics shows visits by series.
3. Put the LinkedIn post's address into the essay's `originalLink` in `src/content/library.json`. That turns on the "Discuss on LinkedIn" button.

**One bio (item 41)**
Use the same bio on the site, LinkedIn and speaker profiles. Write "HR leadership across Standard Chartered, HSBC, Tata, Udaan and Gameskraft", never "CHRO across".

**After any change to a page (item 35)**
LinkedIn keeps its own copy of each link preview. After changing a page, paste its address into LinkedIn's Post Inspector (https://www.linkedin.com/post-inspector/) to refresh the preview.

## The live LinkedIn feed (item 33)

LinkedIn has no live-feed embed, and its API for reading a person's own posts is closed to new apps, so this needs a paid widget. The site has a slot ready on the homepage (3 posts) and the Founder page (6 posts). It shows nothing until set up.

1. Choose a tool. **Check before buying that it supports personal LinkedIn profiles, not only company pages.** Elfsight and Curator are both wired in; Curator's LinkedIn plan is about $59 a month and refreshes every 15 minutes.
2. Create two feeds that both follow Nitin's profile and the Axion Index page: one set to 3 posts (homepage) and one to 6 (Founder page).
3. In the tool's design settings, match the site and remove the tool's branding:
   - fonts: Cormorant Garamond for titles, Geist for text;
   - colours: gold `#A07830` on cream `#F7F6F3`;
   - no "Powered by" line.
4. In the server `.env`, set:
   ```
   NEXT_PUBLIC_LINKEDIN_FEED_HOME=elfsight:<widget id>      (or curator:<feed id>)
   NEXT_PUBLIC_LINKEDIN_FEED_FOUNDER=elfsight:<widget id>
   ```
5. Rebuild: `npm run build && pm2 restart axion`.

The feed shows what is new. Articles & Publications stays the permanent home that Google indexes and people bookmark (item 34), so essays still go into the library every Monday.
