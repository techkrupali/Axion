/**
 * AI Edge Lab (Fix Brief Part 5): a separate global digital institute with its own site,
 * products, data and design. On axionindex.org it has one bridge page, /expertise/ai-edge.
 *
 * Launch day: set NEXT_PUBLIC_AI_EDGE_LAB_URL=https://… in the server .env and rebuild.
 * The bridge page then shows "Visit AI Edge Lab", and the old diagnostic address
 * redirects (301) to the institute's site (see next.config.ts).
 */
export const AI_EDGE_LAB = {
  name: "AI Edge Lab",
  bridgePath: "/expertise/ai-edge",
  earlyBirdAnchor: "early-bird",
  siteUrl: process.env.NEXT_PUBLIC_AI_EDGE_LAB_URL || "",
} as const;

export const aiEdgeLabLive = () => AI_EDGE_LAB.siteUrl.startsWith("https://");

/** One name per index, used everywhere (settled 15 Nov). © until a lawyer clears ™. */
export const ASSESSMENTS = [
  { code: "AAI", name: "AI Alignment Index (AAI)©", audience: "Students and early career" },
  { code: "ARI", name: "AI Replaceability Index (ARI)©", audience: "Working professionals" },
  { code: "LLI", name: "Leadership Leverage Index (LLI)©", audience: "CXOs and senior leaders" },
  { code: "ORG AI DARS", name: "ORG AI DARS©", audience: "Organisations" },
] as const;

export type AssessmentCode = (typeof ASSESSMENTS)[number]["code"];
export const isAssessmentCode = (v: unknown): v is AssessmentCode => ASSESSMENTS.some((a) => a.code === v);
export const assessmentName = (code: string) => ASSESSMENTS.find((a) => a.code === code)?.name ?? code;

/**
 * Early access (Nitin, 16 Nov): every visitor registers once, for one assessment, by career stage.
 * ORG AI DARS is never on the registration form; leaders are asked about their organisation
 * afterwards, on the confirmation screen.
 */
export const TRACKS = [
  { code: "AAI", stage: "Student / early career" },
  { code: "ARI", stage: "Working professional" },
  { code: "LLI", stage: "Leader / CXO" },
] as const;
export type TrackCode = (typeof TRACKS)[number]["code"];
export const isTrackCode = (v: unknown): v is TrackCode => TRACKS.some((t) => t.code === v);
export const LEADER_TRACK: TrackCode = "LLI";

/** ORG AI DARS early access (leaders only, after registering). */
export const ORG_ASSESSMENT = { code: "ORG AI DARS", name: "ORG AI DARS©" } as const;
export const HEADCOUNT_BANDS = ["Under 100", "100–499", "500–999", "1,000–4,999", "5,000–19,999", "20,000+"] as const;
export const isHeadcountBand = (v: unknown): v is (typeof HEADCOUNT_BANDS)[number] => HEADCOUNT_BANDS.includes(v as never);

/** The lists' statuses, kept in the sheet by the team (and in the database). */
export const EARLY_ACCESS_STATUSES = ["Registered", "Invited", "Converted", "Unsubscribed"] as const;

/** Early-bird offer (item 23). Nitin approves the wording. */
export const EARLY_BIRD = {
  offer: "Early-bird registrants get a special launch price; a chosen few get a complimentary assessment and report.",
  consent:
    "I agree that my details are kept for AI Edge Lab and passed to the AI Edge Lab institute when its site opens, so it can tell me about the launch and the early-bird offer.",
} as const;
