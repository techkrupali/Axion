/** Event the home / about pages listen for to open the diagnostic popup. */
export const OPEN_DIAGNOSTIC_EVENT = "axion:open-diagnostic";

/** Open the diagnostic popup on the current page (used by the navbar). */
export const openDiagnostic = () => window.dispatchEvent(new Event(OPEN_DIAGNOSTIC_EVENT));
