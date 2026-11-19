import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { REPORT } from "@/config/report";
import { MAKE_OR_BREAK as R } from "@/content/reports/makeOrBreak";
import { pageMetadata } from "@/lib/seo";
import TrackRead from "@/components/library/TrackRead";

/**
 * Read online (19 Nov): every page of Make or Break on our own site, no form and no download.
 * Downloading the PDF goes through the sign-up form on the report page (#download).
 * Open once the report is out; before that only with the preview key (?key=REPORT_PREVIEW_KEY).
 */
type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ key?: string }> };

export const metadata: Metadata = pageMetadata({
  title: `Read ${REPORT.name} online`,
  description: `Read ${R.hero.headline} online: all ${REPORT.pageCount} pages, free.`,
  path: REPORT.onlinePath,
  noIndex: true, // Google should send people to the report page, not the page images
  image: { url: R.share.image, width: 1200, height: 630, alt: R.share.imageAlt },
  share: { title: R.share.title, description: R.share.description },
});

export default async function ReadOnline({ params, searchParams }: Props) {
  const [{ slug }, { key }] = await Promise.all([params, searchParams]);
  const secret = process.env.REPORT_PREVIEW_KEY;
  const preview = !REPORT.published && !!secret && key === secret;
  if (slug !== REPORT.slug || (!REPORT.published && !preview)) notFound();

  // Back to the report page's download form (the preview page before launch)
  const reportPage = preview ? `${REPORT.signupPath}/preview?key=${encodeURIComponent(key!)}` : REPORT.signupPath;
  const download = `${reportPage}#download`;
  const pages = Array.from({ length: REPORT.pageCount }, (_, i) => `${REPORT.pagesDir}/p-${String(i + 1).padStart(2, "0")}.jpg`);
  const btn = "inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 min-h-[44px] font-mono text-[10.5px] sm:text-[11px] tracking-[0.2em] uppercase font-semibold bg-[#C9A24A] text-[#0A0A0B] hover:bg-[#d6b25c] transition-colors";

  return (
    <div className="min-h-screen bg-[#141414]">
      <TrackRead slug={REPORT.slug} category="report" />
      {/* Title and the download button stay in view while reading */}
      <div className="sticky top-[74px] z-[60] border-b border-[var(--line)] bg-[rgba(10,10,11,0.94)] backdrop-blur-md mt-[74px]">
        <div className="shell flex items-center gap-4 py-3">
          <div className="min-w-0 flex-1">
            <Link href={reportPage} className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--fg-4)] hover:text-[var(--accent)]">← Report page</Link>
            <p className="font-display text-[18px] sm:text-[22px] leading-tight text-[var(--fg)] truncate">
              {REPORT.name}<span className="hidden sm:inline text-[var(--fg-4)]"> · read online · {REPORT.pageCount} pages</span>
            </p>
          </div>
          <Link href={download} className={btn}>
            <span className="sm:hidden">Download</span><span className="hidden sm:inline">{R.hero.download}</span> <span aria-hidden>↓</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-[920px] px-3 sm:px-6 py-6 sm:py-10 flex flex-col gap-3 sm:gap-6">
        <h1 className="sr-only">{R.hero.headline}: read online</h1>
        {pages.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={i === 0 ? R.coverAlt : `${REPORT.name}, page ${i + 1} of ${REPORT.pageCount}`}
            width={1400}
            height={1978}
            sizes="(max-width: 940px) 100vw, 920px"
            preload={i === 0}
            className="w-full h-auto block bg-white shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]"
          />
        ))}

        {/* The end: keep a copy */}
        <section className="mt-6 sm:mt-10 rounded-[24px] border border-[var(--line-gold)] bg-[rgba(201,162,74,0.04)] p-7 sm:p-10 text-center">
          <h2 className="font-display font-medium text-[clamp(28px,3.4vw,40px)] leading-tight text-[var(--fg)]">Keep a copy of {REPORT.name}</h2>
          <p className="text-[15.5px] leading-[1.7] text-[var(--fg-3)] mt-3 max-w-[48ch] mx-auto">Download the PDF to read offline and share with your colleagues. We&apos;ll also email you a copy.</p>
          <Link href={download} className={`${btn} mt-6 min-h-[52px] px-8`}>{R.hero.download} <span aria-hidden>↓</span></Link>
        </section>
      </div>
    </div>
  );
}
