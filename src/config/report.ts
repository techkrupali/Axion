/**
 * Make or Break: the 20 Nov report (Axion Index Journal). Single place for its name, date and addresses.
 *
 * Launch day (20 Nov), see docs/launch-20-nov.md:
 *  1. In the Studio, open the report and paste the PDF's link into "Report PDF" (then the page
 *     offers "Download the report" after a short sign-up, D7).
 *  2. Set NEXT_PUBLIC_REPORT_PUBLISHED=true in the server's .env, rebuild and restart. The homepage
 *     band, the AI Edge Lab card and the report page switch to "out now".
 *  3. Email everyone who signed up before release: scripts/send-report.mjs.
 *
 * The report's own page is /reports/make-or-break (library item "make-or-break").
 * /global-ai-report keeps working at its own address (SEO-01). The long-form page stays at readPath.
 */
export const REPORT = {
  /** R-04 / D7: title confirmed by Nitin, 16 Nov 2026 */
  name: "Make or Break",
  subtitle: "The Weakest Link in the Big AI Bet",
  edition: "Edition 01",
  /** Library slug: the report's page is /reports/<slug> */
  slug: "make-or-break",
  releaseShort: "20 Nov",
  releaseLong: "20 November 2026",
  /** The report's page, with the sign-up / download form */
  signupPath: "/reports/make-or-break",
  /** Long-form report page (hidden until published) */
  readPath: "/global-ai-report/edition-01",
  published: process.env.NEXT_PUBLIC_REPORT_PUBLISHED === "true",
  /** R-03: the slim "Out now" banner shows on every page for launch week, once published (IST) */
  launchWeek: { from: "2026-11-20T00:00:00+05:30", until: "2026-11-27T00:00:00+05:30" },
} as const;

/** True during launch week (R-03). */
export const inLaunchWeek = (now: number) =>
  now >= Date.parse(REPORT.launchWeek.from) && now < Date.parse(REPORT.launchWeek.until);

export const REPORT_FULL_TITLE = `${REPORT.name}: ${REPORT.subtitle}`;

/** Where report links should point right now, and what they say. */
export const reportLink = REPORT.published
  ? { href: REPORT.signupPath, label: `${REPORT.name} · Out now →` }
  : { href: REPORT.signupPath, label: `${REPORT.name} · ${REPORT.releaseShort} →` };
