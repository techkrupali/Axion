/**
 * Global AI Report — single place to change the report's name, date and address.
 *
 * Launch day (20 Nov): set NEXT_PUBLIC_REPORT_PUBLISHED=true in the server's .env
 * and rebuild. That makes the full report page public and switches the AI Edge Lab
 * card and the Research page to "Read the report →".
 *
 * Address: still pending (Axion Index vs AI Edge Lab name). To move it, rename the
 * `src/app/global-ai-report` folder and update the two paths below.
 */
export const REPORT = {
  name: "Global AI Report",
  edition: "Edition 01",
  releaseShort: "20 Nov",
  releaseLong: "20 November 2026",
  /** Sign-up page (live now): name, email, organisation */
  signupPath: "/global-ai-report",
  /** Full report page (hidden until published) */
  readPath: "/global-ai-report/edition-01",
  published: process.env.NEXT_PUBLIC_REPORT_PUBLISHED === "true",
} as const;

/** Where report links should point right now, and what they say. */
export const reportLink = REPORT.published
  ? { href: REPORT.readPath, label: "Read the report →" }
  : { href: REPORT.signupPath, label: `${REPORT.name} · ${REPORT.releaseShort} →` };
