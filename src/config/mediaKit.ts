import { PUBLIC_EMAIL } from "@/config/contact";

/**
 * Media and speaker kit (Fix Brief Part 10, G-06): what podcast hosts and conference organisers
 * look for before inviting Nitin. The /media-kit page and its links (Founder page, footer) appear
 * by themselves once both bios and the talk topics are filled in. Nitin writes or approves every word;
 * the bio says "HR leadership across …", not "CHRO across …" (Part 6, item 41).
 */
export const MEDIA_KIT = {
  // Approved bio (tracker L-08, 15 Nov 2026). Use the same text on LinkedIn and speaker profiles.
  shortBio: "Nitin Nahata is the founder of Axion Index, a Bengaluru consulting firm that applies design principles evolved through 23 years of HR leadership across Wipro, Standard Chartered, HSBC, Tata, Lodha, Marico, Udaan and Gameskraft. He holds a master's from TISS, Mumbai.",
  longBio: "",    // about 150 words; blank lines start new paragraphs
  topics: [] as { title: string; line: string }[],   // e.g. { title: "…", line: "One line on what the talk covers." }
  headshots: [
    { src: "/media-kit-nitin-nahata-colour.jpg", download: "/nitishcolorfull.png", label: "Colour" },
    { src: "/media-kit-nitin-nahata-portrait.jpg", download: "/nitishpic.png", label: "Black and white" },
  ],
  contact: PUBLIC_EMAIL,
};

export const mediaKitReady = () => !!MEDIA_KIT.shortBio.trim() && !!MEDIA_KIT.longBio.trim() && MEDIA_KIT.topics.length > 0;
