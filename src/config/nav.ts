/**
 * Site-wide menu and footer links (Fix Brief, Part 2). Every page reads from here,
 * so the menu and footer can never drift apart again.
 */
import { PRACTICES, PRACTICE_ORDER, isLive } from "@/config/practices";

export type NavLink = { label: string; href: string };

/** Menu, in order. "Practices" is a dropdown built from src/config/practices.ts. */
export const MENU: NavLink[] = [
  { label: "Reports", href: "/reports" },
  { label: "Articles & Publications", href: "/publications" },
  { label: "Founder", href: "/founder" },
  { label: "About", href: "/about" },
];
export const PRACTICES_LABEL = "Practices";

/** Main button on every page: opens the same conversation form (Part 4). */
export const MAIN_CTA_LABEL = "Start a conversation";

/**
 * Invitation copy (Fix Brief Part 3A, N-03; D3 settled). Shown on Reach Us and wherever
 * a conversation starts, including the form every "Start a conversation" button opens.
 */
export const CONVERSATION_INVITE =
  "Share the signals you are seeing and what concerns you. We read them first, so our 30-minute conversation is sharp and focused on what to do next.";

/** Founder page: its in-page links, shown as a second row under the main menu. */
export const FOUNDER_SUBNAV: NavLink[] = [
  { label: "Story", href: "#story" },
  { label: "Patterns", href: "#patterns" },
  { label: "Writing", href: "#writing" },
];

export const LINKEDIN_NITIN = "https://www.linkedin.com/in/nahatanitin";
export const LINKEDIN_AXION = "https://www.linkedin.com/company/axionindex";

export type FooterLink = NavLink & { status?: string; external?: boolean };

/** Footer columns, identical on every page. */
export const FOOTER_COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Practices",
    // same status labels as the homepage cards
    links: PRACTICE_ORDER.map((k) => ({
      label: PRACTICES[k].name,
      href: PRACTICES[k].href,
      status: isLive(k) ? undefined : "In development",
    })),
  },
  {
    title: "Reports · Articles & Publications",
    links: [
      { label: "Reports", href: "/reports" },
      { label: "Series", href: "/publications/series" },
      { label: "Essays", href: "/publications/essays" },
      { label: "In the media", href: "/publications/media" },
      { label: "Podcasts & talks", href: "/publications/podcasts" },
    ],
  },
  {
    title: "Firm",
    links: [
      { label: "About", href: "/about" },
      { label: "Founder", href: "/founder" },
      { label: "Reach us", href: "/connect" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
  {
    title: "Follow",
    links: [
      { label: "Nitin on LinkedIn", href: LINKEDIN_NITIN, external: true },
      { label: "Axion Index on LinkedIn", href: LINKEDIN_AXION, external: true },
      { label: "Axion Index Journal (monthly)", href: "/newsletter" },
    ],
  },
];

export const FOOTER_BOTTOM_LINE = "© 2026 Axion Index · Bengaluru · Architecture is read, not pitched.";
