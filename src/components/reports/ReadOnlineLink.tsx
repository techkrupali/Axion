"use client";

import { track } from "@/lib/analytics";

/** A link that opens the report PDF in a new tab and counts as "Read online" (GA4: read_online_click). */
export default function ReadOnlineLink({ href, report, className, label, children }: { href: string; report: string; className?: string; label?: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener" aria-label={label} className={className} onClick={() => track("read_online_click", { report, from: "cover" })}>
      {children}
    </a>
  );
}
