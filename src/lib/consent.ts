"use client";

import { useEffect, useState } from "react";

/**
 * Cookie consent (Fix Brief Part 10, G-04). Analytics cookies (GA4) and the LinkedIn feed widget
 * need consent from visitors in the EU and UK. Without a country from the server, the browser's
 * time zone decides: Europe → ask first; elsewhere → allowed. Plausible sets no cookies and is
 * never blocked. The choice is kept in this browser only.
 */
const KEY = "axion:cookie-consent";
const EVENT = "axion:consent";
export type Consent = "granted" | "denied";

// GA4 sets cookies. Nitin (17 Nov): it may track only after the visitor accepts, so once a GA4 ID is set
// every visitor is asked first, wherever they are.
const GA_ON = /^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA_ID ?? "");

export function consentRequired(): boolean {
  if (GA_ON) return true;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    return tz.startsWith("Europe/") || ["Atlantic/Canary", "Atlantic/Madeira", "Atlantic/Azores", "Atlantic/Faroe", "Atlantic/Reykjavik"].includes(tz);
  } catch {
    return false;
  }
}

export function getConsent(): Consent | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(v: Consent | null) {
  try {
    if (v) localStorage.setItem(KEY, v);
    else localStorage.removeItem(KEY);
  } catch { /* storage blocked: the choice lasts for this page only */ }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: v }));
}

/** Re-open the banner (footer "Cookie settings"). */
export const reopenConsent = () => setConsent(null);

/** { allowed: may we set cookies, needsChoice: show the banner } — updates when the visitor chooses. */
export function useConsent() {
  const [state, setState] = useState({ allowed: false, needsChoice: false, ready: false });
  useEffect(() => {
    const read = () => {
      const required = consentRequired();
      const c = getConsent();
      setState({ allowed: !required || c === "granted", needsChoice: required && c === null, ready: true });
    };
    read();
    window.addEventListener(EVENT, read);
    return () => window.removeEventListener(EVENT, read);
  }, []);
  return state;
}
