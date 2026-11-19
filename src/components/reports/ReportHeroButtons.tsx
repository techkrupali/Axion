"use client";

import { track } from "@/lib/analytics";
import { MAIN_BUTTON_SHAPE } from "@/components/Button";

/**
 * "Read online" opens the PDF in a new tab, no form (keeps reach high for LinkedIn readers).
 * "Download the PDF" scrolls to the download form (Nitin, 19 Nov).
 */
export default function ReportHeroButtons({ pdf, readLabel, downloadLabel, report }: { pdf: string; readLabel: string; downloadLabel: string; report: string }) {
  const base = `inline-flex items-center justify-center gap-3 px-7 py-4 font-mono text-[11px] tracking-[0.24em] uppercase ${MAIN_BUTTON_SHAPE} min-h-[52px] w-full sm:w-auto transition-colors`;
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <a
        href={pdf}
        target="_blank"
        rel="noopener"
        onClick={() => track("read_online_click", { report })}
        className={`${base} bg-[#C9A24A] text-[#0A0A0B] font-semibold hover:bg-[#d6b25c]`}
      >
        {readLabel} <span aria-hidden>↗</span>
      </a>
      <a
        href="#download"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("download")?.scrollIntoView({ behavior: "smooth", block: "start" });
          setTimeout(() => (document.getElementById("report-name") as HTMLInputElement | null)?.focus({ preventScroll: true }), 600);
        }}
        className={`${base} border border-[#C9A24A] text-[#C9A24A] hover:bg-[rgba(201,162,74,0.08)]`}
      >
        {downloadLabel} <span aria-hidden>↓</span>
      </a>
    </div>
  );
}
