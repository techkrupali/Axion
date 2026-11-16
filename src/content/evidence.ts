/**
 * Evidence on the practice pages (Fix Brief Part 3A). Nitin writes or approves every word.
 * Nothing here shows on the site until it is filled in.
 */
import type { PracticeKey } from "@/config/practices";

/**
 * N-06: anonymised examples, all in one format. Add one ONLY with the client's permission,
 * and set `clientPermission: true`; without it the example never shows.
 */
export type CaseExample = {
  practice: PracticeKey;
  context: string;          // Context (anonymised: sector, size, stage; no names)
  firstThought: string;     // What people first thought was wrong
  realIssue: string;        // What the real issue was
  principle: string;        // Principle applied
  whatWasDone: string;      // What was done and why
  result: string;           // What can honestly be said about the result
  clientPermission: boolean;
};

export const CASES: CaseExample[] = [
  // {
  //   practice: "people",
  //   context: "",
  //   firstThought: "",
  //   realIssue: "",
  //   principle: "",
  //   whatWasDone: "",
  //   result: "",
  //   clientPermission: false,
  // },
];

export const casesFor = (practice: PracticeKey) => CASES.filter((c) => c.practice === practice && c.clientPermission);

export const CASE_FIELDS: { key: keyof Omit<CaseExample, "practice" | "clientPermission">; label: string }[] = [
  { key: "context", label: "Context" },
  { key: "firstThought", label: "What people first thought was wrong" },
  { key: "realIssue", label: "What the real issue was" },
  { key: "principle", label: "Principle applied" },
  { key: "whatWasDone", label: "What was done and why" },
  { key: "result", label: "What can honestly be said about the result" },
];

/**
 * People Architecture "What you get". N-07: when a sample page exists (client details removed),
 * put the file in public/samples/ and set `sample`, e.g. "/samples/diagnostic-readout.pdf".
 */
export const PEOPLE_DELIVERABLES: { name: string; sample?: string }[] = [
  { name: "Diagnostic readout" },
  { name: "Decision rights, written down" },
  { name: "Succession map" },
  { name: "Handover" },
];
