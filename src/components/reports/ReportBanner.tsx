"use client";

import Image from "next/image";
import Link from "next/link";
import { REPORT } from "@/config/report";
import { MAKE_OR_BREAK } from "@/content/reports/makeOrBreak";
import { track } from "@/lib/analytics";

/**
 * Nitin's Make or Break banner (19 Nov, docs/MoB_banner_embed.html): the whole image opens the
 * report page. A wide image on tablets and laptops, a 4:5 one on phones; each screen loads only its own.
 * Shown once the report is out, at the top of the homepage and the Reports page.
 * Clicks count in GA4 as banner_click (not utm tags, which would restart the visit as "website").
 */
export default function ReportBanner({ place, maxWidth, preload = false }: { place: "home" | "reports"; maxWidth: number; preload?: boolean }) {
  const b = MAKE_OR_BREAK.banner;
  return (
    <Link href={REPORT.signupPath} className="block" onClick={() => track("banner_click", { report: REPORT.slug, banner: "image", place })}>
      {/* "1px" makes the other screen load only the tiniest copy; min(100vw, …) on purpose:
          a bare "100vw" makes Next drop the small copies from the list */}
      <Image src={b.imageMobile} alt={b.alt} width={2160} height={2700} sizes="(max-width: 767px) min(100vw, 767px), 1px" preload={preload} className="md:hidden w-full h-auto block" />
      <Image src={b.image} alt={b.alt} width={3840} height={1440} sizes={`(max-width: 767px) 1px, min(100vw, ${maxWidth}px)`} preload={preload} className="hidden md:block w-full h-auto" />
    </Link>
  );
}
