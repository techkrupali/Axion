import Link from "next/link";
import LibraryShell from "@/components/library/LibraryShell";
import ReportSignupForm from "@/components/ReportSignupForm";
import Button from "@/components/Button";
import { coverPath, itemsIn } from "@/content/library";
import { getLibrary, libraryForPage } from "@/content/store";
import { itemMetadata, publicItemOr404 } from "@/content/itemMeta";
import { pdfUrl, reportState } from "@/content/reportState";
import { AI_EDGE_LAB, aiEdgeLabLive } from "@/config/aiEdgeLab";
import { SITE_URL } from "@/lib/seo";
import ShareButtons from "@/components/library/ShareButtons";
import TrackRead from "@/components/library/TrackRead";
import { JsonLd, ORGANIZATION } from "@/lib/jsonLd";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;
/** Re-check hourly so "Releasing …" turns into "Published …" on the day without a rebuild. */
export const revalidate = 3600;

export async function generateStaticParams() {
  return itemsIn(await getLibrary(), "report").map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props) {
  return itemMetadata(publicItemOr404(await libraryForPage(), (await params).slug, "report"));
}

const LABEL = "font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--accent)]";

/**
 * One report (Fix Brief Part 3): kicker, title, status, summary, what's inside,
 * author and method (each shown once supplied), and the form to get it.
 */
export default async function ReportPage({ params }: Props) {
  const item = publicItemOr404(await libraryForPage(), (await params).slug, "report");
  const { released, readHref, when, status } = reportState(item);
  const download = released && !!pdfUrl(item); // out with a PDF: short sign-up, then download (D7)
  const formPublished = !download && !!readHref; // readable here → the form is for future editions

  return (
    <LibraryShell
      eyebrow={item.kicker ? `REPORT  ·  ${item.kicker.toUpperCase()}` : "AXION  ·  REPORT"}
      title={item.title}
      intro={item.summary || undefined}
      crumbs={[{ label: "Reports", href: "/reports" }]}
    >
      <section className="shell pb-24">
        <TrackRead slug={item.slug} category="report" />
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "Report",
          name: item.title,
          description: item.summary || undefined,
          ...(item.date ? { datePublished: item.date } : {}),
          image: SITE_URL + coverPath(item.slug),
          url: `${SITE_URL}/reports/${item.slug}`,
          // The Author field from the Studio once filled in; until then the owner organisation
          author: item.author ? { "@type": "Person", name: item.author } : item.owner === "ai-edge-lab" ? { "@type": "Organization", name: "AI Edge Lab" } : ORGANIZATION,
          publisher: item.owner === "ai-edge-lab" ? { "@type": "Organization", name: "AI Edge Lab" } : ORGANIZATION,
        }} />
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-start">
          {/* Left: the report */}
          <div className="flex flex-col gap-10 min-w-0">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-[var(--line-gold)] bg-[rgba(201,162,74,0.06)] font-mono text-[11px] tracking-[0.24em] uppercase text-[var(--accent)]">
                <span className="relative flex h-2 w-2">
                  {!released && <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-60 animate-ping" />}
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
                </span>
                {status}
              </span>
              {readHref && <Button href={readHref} variant="primary" showArrow>Read the report</Button>}
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverPath(item.slug)} alt="" width={1200} height={630} className="w-full h-auto rounded-2xl border border-[var(--line)]" />

            {item.inside && item.inside.length > 0 && (
              <div>
                <h2 className={LABEL}>What&apos;s inside</h2>
                <ul className="mt-4 flex flex-col gap-3">
                  {item.inside.map((x) => (
                    <li key={x} className="flex gap-3 text-[16px] leading-[1.65] text-[var(--fg-2)]">
                      <span aria-hidden className="mt-[0.7em] h-[5px] w-[5px] shrink-0 rounded-full bg-[#C9A24A]" />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(item.author || item.method || when) && (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 border-t border-[var(--line)] pt-8">
                {item.author && (<div><dt className={LABEL}>Author</dt><dd className="mt-2 text-[15px] leading-[1.65] text-[var(--fg-2)]">{item.author}</dd></div>)}
                {when && (<div><dt className={LABEL}>{released ? "Published" : "Release"}</dt><dd className="mt-2 text-[15px] leading-[1.65] text-[var(--fg-2)]">{when}</dd></div>)}
                {item.method && (<div className="sm:col-span-2"><dt className={LABEL}>Method</dt><dd className="mt-2 text-[15px] leading-[1.7] text-[var(--fg-3)]">{item.method}</dd></div>)}
              </dl>
            )}

            <ShareButtons url={`${SITE_URL}/reports/${item.slug}`} title={item.title} />

            {/* A-05: the AI report and AI Edge Lab link to each other */}
            {item.owner !== "ai-edge-lab" && item.theme.includes("AI & work") && (
              <p className="text-[15px] leading-[1.7] text-[var(--fg-3)]">
                Related: {AI_EDGE_LAB.name}, our separate institute for the AI architecture of work.{" "}
                <Link href={AI_EDGE_LAB.bridgePath} className="text-[var(--accent)] underline underline-offset-2">About {AI_EDGE_LAB.name} →</Link>
              </p>
            )}

            {item.site && item.owner !== "ai-edge-lab" && (
              <p className="text-[15px] leading-[1.7] text-[var(--fg-3)]">
                This report has its own site.{" "}
                <Link href={item.site} className="text-[var(--accent)] underline underline-offset-2">Visit {item.kicker ?? "it"} →</Link>
              </p>
            )}
          </div>

          {/* Right: get the report. AI Edge Lab's reports go through its own list (Fix Brief Part 5, item 27). */}
          <div className="w-full lg:sticky lg:top-[calc(var(--site-nav-h,74px)+24px)]">
            {item.owner === "ai-edge-lab" ? (
              <div className="glass-card p-7 sm:p-10 rounded-[24px] border border-[var(--line-gold)]">
                <span className={`${LABEL} block mb-3`}>An AI Edge Lab report</span>
                <h2 className="font-serif text-[28px] leading-tight text-[var(--fg)] mb-4">It launches with the AI Edge Lab site.</h2>
                <p className="text-[15px] leading-[1.7] text-[var(--fg-3)] mb-8">
                  AI Edge Lab is a separate institute with its own website. Register for early-bird access and you will hear when it opens.
                </p>
                {aiEdgeLabLive() ? (
                  <a href={AI_EDGE_LAB.siteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-7 py-4 bg-[#C9A24A] text-[#0A0A0B] font-mono text-[11px] tracking-[0.22em] uppercase font-semibold">Visit AI Edge Lab ↗</a>
                ) : (
                  <Link href={`${AI_EDGE_LAB.bridgePath}#${AI_EDGE_LAB.earlyBirdAnchor}`} className="inline-flex items-center gap-3 px-7 py-4 bg-[#C9A24A] text-[#0A0A0B] font-mono text-[11px] tracking-[0.22em] uppercase font-semibold">Register for early-bird access →</Link>
                )}
              </div>
            ) : (
              <div className="glass-card p-7 sm:p-10 rounded-[24px] border border-[var(--line-gold)]">
                <span className={`${LABEL} block mb-3`}>{download ? "Download · free to share" : formPublished ? "Future editions" : released ? "Get the report" : "Get it on release"}</span>
                <h2 className="font-serif text-[28px] leading-tight text-[var(--fg)] mb-8">
                  {download ? "Get your copy." : formPublished ? "Stay on the list." : released ? "We'll send it to you." : "Be the first to read it."}
                </h2>
                <ReportSignupForm report={item.slug} releaseLong={released ? undefined : when || undefined} published={formPublished} download={download} />
              </div>
            )}
          </div>
        </div>
      </section>
    </LibraryShell>
  );
}
