"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

/** Share an item (Fix Brief Part 4, step 1): LinkedIn, X, WhatsApp, copy link. */
export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    { network: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { network: "X", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
    { network: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}` },
  ];
  const btn = "inline-flex items-center gap-2 px-4 py-2.5 border border-[var(--line-strong)] font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--fg-3)] hover:border-[#C9A24A] hover:text-[#C9A24A] transition-colors";

  async function copy() {
    track("Share", { network: "Copy link", page: location.pathname });
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = Object.assign(document.createElement("textarea"), { value: url });
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch { /* nothing more to try */ }
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5" aria-label="Share">
      <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--fg-5)] mr-1">Share</span>
      {links.map((l) => (
        <a key={l.network} href={l.href} target="_blank" rel="noopener noreferrer" className={btn}
          onClick={() => track("Share", { network: l.network, page: location.pathname })}>
          {l.network} <span aria-hidden>↗</span>
        </a>
      ))}
      <button type="button" onClick={copy} className={btn} aria-live="polite">
        {copied ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}
