import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { REPORT } from "@/config/report";
import MakeOrBreakPage from "@/components/reports/MakeOrBreakPage";

/**
 * Private preview of Make or Break's "out now" page before launch, for the team and Nitin:
 *   /reports/make-or-break/preview?key=<REPORT_PREVIEW_KEY>   (the key is in the server .env)
 * Without the right key it is a 404; it is never indexed.
 */
type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ key?: string }> };

export const metadata: Metadata = { title: "Preview · Make or Break", robots: { index: false, follow: false } };

export default async function ReportPreview({ params, searchParams }: Props) {
  const [{ slug }, { key }] = await Promise.all([params, searchParams]);
  const secret = process.env.REPORT_PREVIEW_KEY;
  if (slug !== REPORT.slug || !secret || key !== secret) notFound();
  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[300] px-5 py-2.5 rounded-full bg-[#C9A24A] text-[#0A0A0B] font-mono text-[10px] tracking-[0.25em] uppercase shadow-2xl pointer-events-none">
        Preview · goes live {REPORT.releaseShort}, 8:30 am
      </div>
      <MakeOrBreakPage />
    </>
  );
}
