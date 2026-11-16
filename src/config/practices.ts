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

/** Slugs used in links (/connect?practice=people-architecture) ↔ practice keys. */
export const PRACTICE_SLUGS: Record<PracticeKey, string> = {
  people: "people-architecture",
  aiEdge: "ai-edge-lab",
  labour: "labour-codes",
  family: "family-business",
};

export const isPracticeKey = (v: unknown): v is PracticeKey => typeof v === "string" && v in PRACTICES;

/** "labour-codes" or "labour" → "labour"; anything else → undefined. */
export function practiceFromSlug(v: string | null | undefined): PracticeKey | undefined {
  if (!v) return undefined;
  if (isPracticeKey(v)) return v;
  return (Object.keys(PRACTICE_SLUGS) as PracticeKey[]).find((k) => PRACTICE_SLUGS[k] === v);
}

/** The practice whose page this is (Fix Brief Part 4, item 14: practice pages pre-select their practice). */
export function practiceFromPath(pathname: string): PracticeKey | undefined {
  return (Object.keys(PRACTICES) as PracticeKey[]).find((k) => pathname === PRACTICES[k].href || pathname.startsWith(PRACTICES[k].href + "/"));
}

