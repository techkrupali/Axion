# The library: Reports, and Articles & Publications

Everything on `/reports` and `/publications` is edited in the **Studio**: **https://axionindex.org/studio** (Fix Brief Part 7). A non-technical person can add an item, preview it, and publish it in a few minutes. It goes live straight away, with no developer and no rebuild. The Studio's own Help page walks through it.

| What | Where |
| --- | --- |
| Every item and series | MongoDB, collections `libraryitems` and `libraryseries`, edited in the Studio |
| Starting data, before the database is filled | `src/content/library.json` and `src/content/texts/<slug>.md` |

Covers and share images are generated from one template (`src/lib/shareImage.tsx`, 1200 × 630, site fonts and gold), so nobody has to design one per item. An item can also have a **photo** (Studio → Photo, every category): the editor shrinks it in the browser (at most 1600 px, JPEG, under 900 KB), stores it in the database (`libraryimages`), serves it at `/uploads/<id>.jpg`, and the cover template draws it beside the title (the book cover is shown whole). The item's `cover` field holds that address; `coverAlt` describes the photo. A replaced or removed photo is deleted once no item uses it.

## Setting up the Studio (once, on the server)

```bash
cd /var/www/axion
node --env-file=.env scripts/seed-library.mjs                                     # copy library.json into the Studio
node --env-file=.env scripts/studio-users.mjs add content@axionindex.org "Content Team"         # editor; prints a password once
node --env-file=.env scripts/studio-users.mjs add nitin@axionindex.org "Nitin Nahata" --admin   # admin
```

**Editors** add, preview and publish library items. **Admins** can do the same; templates and code are changed by the tech team in GitHub. The same script also has `list`, `reset <email>` (for a new password), `role <email> admin|editor` and `remove <email>`. Run `remove` the day someone leaves. The Studio also copies the starting data into the database on its first save, so nothing is lost if the seed step is skipped.

## How the site reads the library

- Visitors get a cached copy (`src/content/store.ts`). Every Studio save clears it, so changes show within seconds.
- **Preview** in the Studio turns on Next's draft mode for that browser only. Drafts then show on the real pages, under a gold "Preview" bar.
- New items get their pages on first visit. Nothing needs rebuilding.
- If the database cannot be reached, the site falls back to `library.json`.

## Bulk import from the tracker

Export the tracker's *Content* tab as CSV, then on the server:

```bash
node --env-file=.env scripts/import-library.mjs ~/content.csv --dry-run   # check first
node --env-file=.env scripts/import-library.mjs ~/content.csv             # save into the Studio
```

Columns it reads: `Title`, `Date`, `Category`, `Theme`, `Series`, `Part`, `Original link`, `Publisher`, `Summary`, `Cover image`, `Status`, `Slug`. Only Title and Category are required. It never deletes anything, and it keeps fields the sheet does not carry. To refresh the site afterwards, set `LIBRARY_REVALIDATE_SECRET` in `.env`; otherwise the change shows after the next Studio save.

## Fields

- **Web address (slug):** made from the title, e.g. `make-or-break` → `/reports/make-or-break`. It is fixed once published, so links never break.
- **Category:** report, series part, essay, in the media, podcast or talk, or book.
- **Date:** lists are newest first.
- **Theme:** AI & work, People Architecture, Governance, Labour Codes, Founder doctrine.
- **Summary:** the two-line summary we write. Never copy a publisher's text.
- **Original link:**
  - the LinkedIn post (essays and series; turns on "Discuss on LinkedIn");
  - the publisher's article (in the media);
  - the recording (podcasts).
- **Full text:** essays and series parts, in simple Markdown:
  - `## headings`, `**bold**`, `*italic*`, `> quotes`, lists, and `[links](https://…)`;
  - a blank line starts a new paragraph.
- **Series parts:** choose the series (add it on the Series page first) and the part number.
- **Reports:**
  - small line above the title, what's inside, author, method, own site;
  - owner: Axion Index, or AI Edge Lab. An AI Edge Lab report has no Axion request form; its page points to the AI Edge Lab early-bird list.
- **Podcasts and talks:** a player link (embed) or a recording link.
- **Book:** status line.

## What shows, and when

- Drafts never show (except in your own preview).
- An **essay** or **series part** shows once it has its full text or a link.
- **In the media** items always link out to the publisher; we never copy the article.
- A **podcast or talk** shows once it has a player or recording link.
- An empty category says "In preparation" with a newsletter sign-up, instead of disappearing.
