"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

/**
 * Share an item (Fix Brief Part 4, step 1): LinkedIn, X, WhatsApp, copy link.
 * "quiet": a row of text links for article pages; the default boxed buttons stay on report pages.
 */
export default function ShareButtons({ url, title, quiet = false, stacked = false }: { url: string; title: string; quiet?: boolean; stacked?: boolean }) {
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

  if (quiet) {
    // Article pages: a centred row of text links; a 2 × 2 grid on phones so nothing wraps oddly
    const cell = `flex items-center justify-center gap-1.5 min-h-[44px] px-4 bg-[var(--bg)] ${stacked ? "" : "sm:bg-transparent"} font-mono text-[10.5px] tracking-[0.18em] uppercase text-[var(--fg-3)] hover:text-[#C9A24A] transition-colors`;
    return (
      <div className={stacked ? "flex flex-col items-center gap-4" : "flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-1"} aria-label="Share">
        <span className={`font-mono text-[10px] tracking-[0.24em] uppercase text-[var(--fg-5)] ${stacked ? "" : "sm:pr-3"}`}>Share</span>
        <div className={stacked
          ? "grid grid-cols-2 gap-px w-full bg-[var(--line)] border border-[var(--line)]"
          : "grid grid-cols-2 gap-px w-full bg-[var(--line)] border border-[var(--line)] sm:flex sm:w-auto sm:gap-0 sm:bg-transparent sm:border-0 sm:divide-x sm:divide-[var(--line)]"}>
          {links.map((l) => (
            <a key={l.network} href={l.href} target="_blank" rel="noopener noreferrer" className={cell}
              onClick={() => track("Share", { network: l.network, page: location.pathname })}>
              {l.network} <span aria-hidden>↗</span>
            </a>
          ))}
          <button type="button" onClick={copy} className={cell} aria-live="polite">
            {copied ? "Link copied" : "Copy link"}
          </button>
        </div>
      </div>
    );
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
