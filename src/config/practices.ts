/**
 * Which practices are open. Used by the home page cards, the navbar menus and
 * every footer, so a practice's status only has to change here.
 *
 *  live            → normal link
 *  in-development  → greyed out, labelled "In development", no link
 */
export type PracticeKey = "people" | "aiEdge" | "labour" | "family";
export type PracticeStatus = "live" | "in-development";

export const PRACTICES: Record<PracticeKey, { name: string; href: string; desc: string; status: PracticeStatus }> = {
  people: { name: "People Architecture", href: "/expertise/people", desc: "BCR · Structure · Signalling", status: "live" },
  aiEdge: { name: "AI Edge Lab", href: "/expertise/ai-edge", desc: "Judgement · Architecture · Governance", status: "live" },
  labour: { name: "Labour Codes", href: "/expertise/labour", desc: "Cost · Classification · Compliance", status: "in-development" },
  family: { name: "Family Business", href: "/expertise/family", desc: "Ownership · Succession · Institution", status: "in-development" },
};

/** Menu / footer order */
export const PRACTICE_ORDER: PracticeKey[] = ["people", "aiEdge", "labour", "family"];

export const IN_DEVELOPMENT_LABEL = "In development";

export const isLive = (k: PracticeKey) => PRACTICES[k].status === "live";
