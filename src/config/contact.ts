/**
 * How the public reaches Axion Index (Fix Brief Part 4).
 *  • One public email everywhere on the site (item 19). nitin@ only receives form alerts
 *    (see OWNER_EMAIL in src/lib/mailer.ts).
 *  • The line under every form (item 15).
 *  • The monthly newsletter's name (ladder step 2).
 */
import { LINKEDIN_NITIN } from "@/config/nav";

export const PUBLIC_EMAIL = "office@axionindex.org";

export const FORM_PRIVACY_LINE = "We use your details only to reply to you.";

export const JOURNAL = {
  name: "Axion Index Journal",
  cadence: "once a month",
} as const;

/** "Follow Nitin on LinkedIn" (ladder step 2). */
export const LINKEDIN_FOLLOW = { label: "Follow Nitin on LinkedIn", href: LINKEDIN_NITIN } as const;

/** Thank-you pages offer this next read (item 18). Falls back to the library until the series is published. */
export const NEXT_READ = { series: "the-three-laws-of-ai", label: "The Three Laws of AI" } as const;
