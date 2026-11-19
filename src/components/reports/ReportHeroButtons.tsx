"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";
import { MAIN_BUTTON_SHAPE } from "@/components/Button";
import { DOWNLOAD_REQUEST } from "@/components/reports/ReportDownloadForm";

/**
 * "Read online" opens the report's pages on our own site, no form (keeps reach high for LinkedIn readers).
 * "Download the PDF" scrolls to the download form next to the cover (Nitin, 19 Nov).
 */
export default function ReportHeroButtons({ readHref, readLabel, downloadLabel, report }: { readHref: string; readLabel: string; downloadLabel: string; report: string }) {
  const base = `inline-flex items-center justify-center gap-3 px-7 py-4 font-mono text-[11px] tracking-[0.24em] uppercase ${MAIN_BUTTON_SHAPE} min-h-[52px] w-full sm:w-auto transition-colors`;
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Link
        href={readHref}
        onClick={() => track("read_online_click", { report })}
        className={`${base} bg-[#C9A24A] text-[#0A0A0B] font-semibold hover:bg-[#d6b25c]`}
      >
        {readLabel} <span aria-hidden>→</span>
      </Link>
      <a
        href="#download"
        onClick={(e) => {
          e.preventDefault();
          // Take the reader to the sign-up form: scroll there, then the form lights up and the name
          // field gets the cursor (or, for someone who already signed up, the PDF downloads again)
          const form = document.getElementById("download");
          if (form) {
            const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--site-nav-h")) || 74;
            window.scrollTo({ top: Math.max(0, form.getBoundingClientRect().top + window.scrollY - navH - 16), behavior: "smooth" });
          }
          window.dispatchEvent(new CustomEvent(DOWNLOAD_REQUEST));
        }}
        className={`${base} border border-[#C9A24A] text-[#C9A24A] hover:bg-[rgba(201,162,74,0.08)]`}
      >
        {downloadLabel} <span aria-hidden>↓</span>
      </a>
    </div>
  );
}
