import { isPracticeKey, type PracticeKey } from "@/config/practices";

/** Event the conversation form (src/components/ConversationForm.tsx) listens for. */
export const OPEN_DIAGNOSTIC_EVENT = "axion:open-diagnostic";

export type OpenDiagnosticDetail = { practice?: PracticeKey };

/**
 * Open the one "Start a conversation" form (Fix Brief Part 4, item 14).
 * Safe to pass straight to onClick: anything that is not a practice key is ignored,
 * and the form then falls back to the practice of the page it was opened on.
 */
export const openDiagnostic = (practice?: unknown) =>
  window.dispatchEvent(new CustomEvent<OpenDiagnosticDetail>(OPEN_DIAGNOSTIC_EVENT, { detail: { practice: isPracticeKey(practice) ? practice : undefined } }));
