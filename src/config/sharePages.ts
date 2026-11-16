/**
 * Share image for each page (Fix Brief Part 6, item 35): every page gets its own 1200 × 630
 * image, drawn by the cover template at /share/<page>. Titles are the page's own headline.
 * Library items and reports use their covers (/cover/<slug>) instead.
 */
export const SHARE_PAGES: Record<string, { label: string; kicker: string; title: string }> = {
  "/": { label: "Axion Index", kicker: "Operating Architecture Practice", title: "From ambiguity to architecture." },
  "/about": { label: "About", kicker: "Axion Index", title: "About Axion Index" },
  "/founder": { label: "Founder", kicker: "Nitin Nahata", title: "The Making of the Operating Architect." },
  "/expertise/people": { label: "Practice", kicker: "People Architecture", title: "The architecture that lets the organisation survive the person." },
  "/expertise/ai-edge": { label: "AI Edge Lab", kicker: "AI Edge Lab", title: "AI has entered the workplace as the fourth actor." },
  "/expertise/labour": { label: "In development", kicker: "Labour Codes", title: "29 laws consolidated. Four Codes. One reset." },
  "/expertise/family": { label: "In development", kicker: "Family Business", title: "Family enterprises don't fail at strategy. They fail at architecture." },
  "/reports": { label: "Reports", kicker: "Reports", title: "Research on how AI and regulation are changing the architecture of work." },
  "/publications": { label: "Library", kicker: "Articles & Publications", title: "Reports, series, essays, press and talks by Nitin Nahata." },
  "/publications/series": { label: "Library", kicker: "Series", title: "Multi-part series by Nitin Nahata, best read in order." },
  "/publications/essays": { label: "Library", kicker: "Essays", title: "Single pieces by Nitin Nahata, published here in full." },
  "/publications/media": { label: "Library", kicker: "In the media", title: "Articles by and interviews with Nitin Nahata in other publications." },
  "/publications/podcasts": { label: "Library", kicker: "Podcasts & talks", title: "Conversations and talks, with the recording on the page." },
  "/connect": { label: "Reach us", kicker: "Start a conversation", title: "Begin a conversation." },
  "/newsletter": { label: "Journal", kicker: "Axion Index Journal", title: "New reports, essays and field notes, once a month." },
  "/privacy": { label: "Privacy", kicker: "Privacy policy", title: "What we collect, why, and your choices." },
  "/terms": { label: "Terms", kicker: "Terms of use", title: "The terms for using axionindex.org." },
};

/** "/" → "home", "/expertise/people" → "expertise/people" */
export const shareKey = (path: string) => (path === "/" ? "home" : path.replace(/^\//, ""));
export const sharePathFor = (key: string) => (key === "home" ? "/" : `/${key}`);
