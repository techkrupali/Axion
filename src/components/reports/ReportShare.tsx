"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

type Channel = "LinkedIn" | "WhatsApp" | "X" | "Copy link";

/**
 * Share buttons for a report page, with the pre-filled text (Nitin, 19 Nov). Each click is the GA4
 * event `share_click` with its channel. LinkedIn takes only the link; its preview card shows the cover.
 */
export default function ReportShare({ url, text, channels = ["LinkedIn", "WhatsApp", "X", "Copy link"], report, size = "md" }: {
  url: string;
  text: string;
  channels?: Channel[];
  report: string;
  size?: "md" | "lg";
}) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const href: Record<Exclude<Channel, "Copy link">, string> = {
    LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    WhatsApp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    X: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${u}`,
  };
  const btn = `inline-flex items-center justify-center gap-2 border border-[var(--line-strong)] font-mono uppercase text-[var(--fg-2)] hover:border-[#C9A24A] hover:text-[#C9A24A] transition-colors ${size === "lg" ? "px-5 py-3.5 text-[11px] tracking-[0.2em]" : "px-4 py-3 text-[10.5px] tracking-[0.18em]"}`;

  async function copy() {
    track("share_click", { channel: "Copy link", report });
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = Object.assign(document.createElement("textarea"), { value: url });
      document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-wrap gap-2.5">
      {channels.map((c) =>
        c === "Copy link" ? (
          <button key={c} type="button" onClick={copy} className={btn}>{copied ? "Link copied" : "Copy link"}</button>
        ) : (
          <a key={c} href={href[c]} target="_blank" rel="noopener noreferrer" className={btn} onClick={() => track("share_click", { channel: c, report })}>
            {size === "lg" ? `Share on ${c}` : c} <span aria-hidden>↗</span>
          </a>
        ),
      )}
    </div>
  );
}
