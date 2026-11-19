"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";

/** A link to the report's pages on our own site that counts as "Read online" (GA4: read_online_click). */
export default function ReadOnlineLink({ href, report, className, label, children }: { href: string; report: string; className?: string; label?: string; children: React.ReactNode }) {
  return (
    <Link href={href} aria-label={label} className={className} onClick={() => track("read_online_click", { report, from: "cover" })}>
      {children}
    </Link>
  );
}
