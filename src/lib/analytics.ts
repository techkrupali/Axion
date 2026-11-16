"use client";

import { useCallback, useRef } from "react";

/**
 * Analytics events (Fix Brief Part 4, item 21). Works with Plausible or GA4, whichever is
 * switched on in the server's .env (see src/components/Analytics.tsx); does nothing otherwise.
 */
export type AnalyticsEvent =
  | "Form started"
  | "Form sent"
  | "Report requested"
  | "Assessment finished"
  | "LinkedIn click"
  | "Newsletter sign-up"
  | "Read"
  | "Share";

/** Which form an event is about. */
export type FormName = "conversation" | "report" | "newsletter" | "ai-edge-interest" | "ai-edge-assessment";

type Props = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Record<string, string | number | boolean> }) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: AnalyticsEvent, props: Props = {}) {
  if (typeof window === "undefined") return;
  const clean = Object.fromEntries(Object.entries(props).filter(([, v]) => v !== undefined && v !== "")) as Record<string, string | number | boolean>;
  try { window.plausible?.(event, { props: clean }); } catch { /* analytics must never break the page */ }
  try { window.gtag?.("event", event.toLowerCase().replace(/[^a-z0-9]+/g, "_"), clean); } catch { /* ignore */ }
}

/** Returns a callback to put on a form's first interaction; it reports "Form started" once. */
export function useFormStarted(form: FormName, extra: Props = {}) {
  const done = useRef(false);
  const extraKey = JSON.stringify(extra);
  return useCallback(() => {
    if (done.current) return;
    done.current = true;
    track("Form started", { form, ...JSON.parse(extraKey) });
  }, [form, extraKey]);
}

const FROM_KEY = "axion:came-from";

/**
 * Remember where this visit came from, once per browser session (Fix Brief Part 6, item 40):
 * the utm tags on the landing link (e.g. ?utm_source=linkedin&utm_medium=social&utm_campaign=the-big-ai-bet),
 * or else the site that linked here. Sent with every form so the leads sheet shows it.
 */
export function rememberVisitSource() {
  try {
    if (sessionStorage.getItem(FROM_KEY) !== null) return;
    const q = new URLSearchParams(location.search);
    const utm = ["utm_source", "utm_medium", "utm_campaign"].map((k) => (q.get(k) || "").slice(0, 60)).filter(Boolean);
    let from = utm.join(" / ");
    if (!from && document.referrer) {
      const host = new URL(document.referrer).hostname;
      if (host && host !== location.hostname) from = `link from ${host}`;
    }
    sessionStorage.setItem(FROM_KEY, from);
  } catch { /* storage blocked: nothing to remember */ }
}

/** "linkedin / social / the-big-ai-bet", "link from www.google.com", or "" (typed in / unknown). */
export function visitSource(): string {
  try { return sessionStorage.getItem(FROM_KEY) || ""; } catch { return ""; }
}
