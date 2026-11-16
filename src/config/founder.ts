import { LINKEDIN_AXION, LINKEDIN_NITIN } from "@/config/nav";

/**
 * Nitin's profiles elsewhere, for the "sameAs" structured data on the Founder page
 * (Fix Brief Part 6, item 36) so Google connects them to one person.
 * Fill in each URL when Nitin supplies it; empty ones are left out.
 */
export const FOUNDER_PROFILES: { label: string; url: string }[] = [
  { label: "LinkedIn", url: LINKEDIN_NITIN },
  { label: "ETHRWorld", url: "" },   // author / contributor page
  { label: "Outlook", url: "" },     // author page
  { label: "Podcast", url: "" },
  { label: "YouTube", url: "" },
];

export const AXION_PROFILES = [LINKEDIN_AXION];
