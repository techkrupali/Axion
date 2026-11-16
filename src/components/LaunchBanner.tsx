"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { REPORT, REPORT_FULL_TITLE, inLaunchWeek } from "@/config/report";

/**
 * R-03 (Fix Brief Part 10): a slim "Out now" banner on every page for the report's launch week.
 * Shows only once the report is published (NEXT_PUBLIC_REPORT_PUBLISHED=true) and only between
 * REPORT.launchWeek.from and .until, so it goes away by itself. A visitor can close it.
 */
const KEY = "axion-launch-banner";
/** Nitin, 16 Nov: the bar links to /global-ai-report (it shows the report's page, see next.config.ts). */
const BANNER_HREF = "/global-ai-report";
const listeners = new Set<() => void>();
let dismissed = false;

function closedBefore() {
  try { return localStorage.getItem(KEY) === REPORT.slug; } catch { return false; }
}
const subscribe = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; };
const snapshot = () => REPORT.published && !dismissed && inLaunchWeek(Date.now()) && !closedBefore();
const serverSnapshot = () => false;

function close() {
  dismissed = true;
  try { localStorage.setItem(KEY, REPORT.slug); } catch { /* private window: closes for this visit only */ }
  listeners.forEach((l) => l());
}

export default function LaunchBanner() {
  const show = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const pathname = usePathname() ?? "";
  if (!show || pathname.startsWith("/studio") || pathname === REPORT.signupPath || pathname === BANNER_HREF || pathname.startsWith("/thank-you")) return null;
  return (
    <>
      {/* keeps the end of the page (footer) clear of the banner */}
      <div aria-hidden style={{ height: 52 }} />
      <div role="region" aria-label="New report" className="fixed inset-x-0 bottom-0 z-[290] bg-[#0D0D0B] border-t border-[rgba(201,162,74,0.45)]" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="mx-auto max-w-[1200px] flex items-center gap-3 sm:gap-5 pl-4 pr-1 sm:px-6 min-h-[52px]">
          <p className="flex-1 min-w-0 font-mono text-[10.5px] sm:text-[11px] tracking-[0.1em] sm:tracking-[0.14em] uppercase text-[#D9D6CE] truncate">
            <span className="text-[#C9A24A]">Out now</span>
            <span className="hidden sm:inline"> · {REPORT_FULL_TITLE}</span>
            <span className="sm:hidden"> · {REPORT.name}</span>
          </p>
          <Link href={BANNER_HREF} className="shrink-0 px-3 sm:px-4 py-2 bg-[#C9A24A] text-[#0A0A0B] font-mono text-[10.5px] sm:text-[11px] tracking-[0.14em] uppercase font-semibold">
            <span className="sm:hidden">Download →</span>
            <span className="hidden sm:inline">Download the report →</span>
          </Link>
          <button type="button" onClick={close} aria-label="Close the banner" className="shrink-0 w-11 h-11 flex items-center justify-center text-[#D9D6CE] hover:text-[#C9A24A] text-[20px] leading-none">
            ×
          </button>
        </div>
      </div>
    </>
  );
}
