import Image from "next/image";
import Link from "next/link";
import LibraryShell from "@/components/library/LibraryShell";
import TrackRead from "@/components/library/TrackRead";
import ReportHeroButtons from "@/components/reports/ReportHeroButtons";
import ReportDownloadForm from "@/components/reports/ReportDownloadForm";
import ReportShare from "@/components/reports/ReportShare";
import { MAKE_OR_BREAK as R } from "@/content/reports/makeOrBreak";
import { REPORT } from "@/config/report";
import { SITE_URL } from "@/lib/seo";
import { JsonLd, NITIN, ORGANIZATION } from "@/lib/jsonLd";

const LABEL = "font-mono text-[10.5px] tracking-[0.25em] uppercase text-[var(--accent)]";
const H2 = "font-display font-medium text-[clamp(32px,3.6vw,46px)] leading-tight text-[var(--fg)]";

/**
 * Make or Break, once it is out (Nitin's page brief, 19 Nov): hero with Read online / Download and the
 * download form, key findings, what's inside, method, author, citation and sharing, and what comes next.
 * (19 Nov: the cover image and "read it by role" were taken off.) Text: src/content/reports/makeOrBreak.ts.
 */
export default function MakeOrBreakPage({ previewKey }: { previewKey?: string } = {}) {
  const pageUrl = `${SITE_URL}/reports/${REPORT.slug}`;
  // "Read online" = the report's pages on our own site (the private preview keeps its key)
  const readHref = previewKey ? `${REPORT.onlinePath}?key=${encodeURIComponent(previewKey)}` : REPORT.onlinePath;

  const hero = (
    <header className="relative overflow-hidden pt-28 sm:pt-36 lg:pt-40 pb-14 sm:pb-20">
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(60% 50% at 80% 30%, rgba(201,162,74,0.10), transparent 70%)" }} />
      <div className="shell relative">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 gap-y-0 font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--fg-5)] mb-8">
          <Link href="/publications" className="inline-flex items-center hover:text-[var(--accent)] transition-colors">Articles &amp; Publications</Link>
          <span aria-hidden>/</span>
          <Link href="/reports" className="inline-flex items-center hover:text-[var(--accent)] transition-colors">Reports</Link>
        </nav>
        {/* Title and buttons on the left, the download form where the cover used to be (19 Nov) */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-12 lg:gap-14 items-start">
          <div className="min-w-0">
            <span className={LABEL}>{R.hero.label}</span>
            <h1 className="font-display font-medium text-[clamp(40px,4.8vw,64px)] leading-[1.04] tracking-[-0.005em] text-[var(--fg)] mt-5 max-w-[18ch]">{R.hero.headline}</h1>
            <p className="text-[17px] sm:text-[18px] leading-[1.7] text-[var(--fg-3)] mt-6 max-w-[60ch]">{R.hero.standfirst}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[var(--line-gold)] bg-[rgba(201,162,74,0.08)] font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--accent)]">
                <span aria-hidden className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                {R.hero.badge}
              </span>
            </div>
            <div className="mt-6">
              <ReportHeroButtons readHref={readHref} readLabel={R.hero.readOnline} downloadLabel={R.hero.download} report={REPORT.slug} />
            </div>
            <p className="mt-6 font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--fg-4)]">{R.hero.meta.join("  ·  ")}</p>
          </div>
          <div id="download" className="scroll-mt-[calc(var(--site-nav-h,74px)+16px)] min-w-0">
            <ReportDownloadForm report={REPORT.slug} pdf={R.pdf} fileName={R.pdfFileName} pageUrl={pageUrl} shareText={R.shareText} t={R.form} />
          </div>
        </div>
      </div>
    </header>
  );

  return (
    <LibraryShell eyebrow="" title={R.hero.headline} hero={hero} crumbs={[{ label: "Articles & Publications", href: "/publications" }, { label: "Reports", href: "/reports" }]}>
      <TrackRead slug={REPORT.slug} category="report" />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Report",
        name: R.hero.headline,
        description: R.seo.description,
        datePublished: "2026-11-20",
        image: `${SITE_URL}${R.cover}`,
        url: pageUrl,
        numberOfPages: 48,
        author: NITIN,
        publisher: ORGANIZATION,
        encoding: { "@type": "MediaObject", contentUrl: `${SITE_URL}${R.pdf}`, encodingFormat: "application/pdf" },
      }} />

      {/* 3. Key findings */}
      <section aria-labelledby="findings" className="shell py-14 sm:py-20 border-t border-[var(--line)]">
        <h2 id="findings" className={LABEL}>Key findings</h2>
        <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {R.keyFindings.map((k) => (
            <li key={k.figure} className="rounded-2xl border border-[var(--line)] bg-[rgba(255,255,255,0.02)] p-6 flex flex-col">
              <span className="font-display font-medium text-[clamp(34px,2.9vw,44px)] leading-none text-[var(--accent)] [font-variant-numeric:lining-nums]">{k.figure}</span>
              <p className="text-[15px] leading-[1.6] text-[var(--fg-2)] mt-4 flex-1">{k.finding}</p>
              <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-[var(--fg-5)] mt-5 leading-[1.6]">{k.source}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 4. What's inside */}
      <section aria-labelledby="inside" className="shell py-14 sm:py-20 border-t border-[var(--line)]">
        <h2 id="inside" className={H2}>What&apos;s inside</h2>
        <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {R.inside.map((x, i) => (
            <li key={x.title} className="grid grid-cols-[44px_minmax(0,1fr)] gap-4">
              <span className="font-display italic text-[34px] leading-none text-[var(--accent)] [font-variant-numeric:lining-nums]">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-display font-medium text-[26px] leading-snug text-[var(--fg)]">{x.title}</h3>
                <p className="text-[15.5px] leading-[1.7] text-[var(--fg-3)] mt-2">{x.text.charAt(0).toUpperCase() + x.text.slice(1)}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 7–9. Method, author, citation and sharing */}
      <section className="shell py-14 sm:py-20 border-t border-[var(--line)] grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20">
        <div>
          <h2 className={LABEL}>{R.method.heading}</h2>
          <p className="text-[16px] leading-[1.8] text-[var(--fg-2)] mt-5">{R.method.text}</p>
        </div>
        <div>
          <h2 className={LABEL}>{R.author.heading}</h2>
          {/* Author card (19 Nov redesign): portrait on the left, name, role, bio and the founder page link */}
          <div className="mt-5 grid grid-cols-[104px_minmax(0,1fr)] sm:grid-cols-[150px_minmax(0,1fr)] rounded-[20px] overflow-hidden border border-[var(--line-gold)] bg-[rgba(201,162,74,0.04)]">
            <div className="relative min-h-[150px] sm:min-h-[200px]">
              <Image src={R.author.photo} alt={R.author.name} fill sizes="(max-width: 640px) 104px, 150px" className="object-cover object-[25%_15%] sm:object-[40%_15%]" />
            </div>
            <div className="p-5 sm:p-7 min-w-0">
              <p className="font-display font-medium text-[24px] sm:text-[30px] leading-tight text-[var(--fg)]">{R.author.name}</p>
              <p className="font-mono text-[9.5px] sm:text-[10px] tracking-[0.18em] uppercase text-[var(--accent)] mt-2 leading-[1.6]">{R.author.role}</p>
              <p className="text-[14.5px] sm:text-[15.5px] leading-[1.75] text-[var(--fg-3)] mt-4">{R.author.text}</p>
              <Link href="/founder" className="inline-flex items-center gap-2 mt-5 font-mono text-[10.5px] tracking-[0.18em] uppercase text-[var(--accent)] hover:underline underline-offset-4">Read Nitin&apos;s story <span aria-hidden>→</span></Link>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 border-t border-[var(--line)] pt-12 grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-10 items-start">
          <div>
            <h2 className={LABEL}>{R.cite.heading}</h2>
            <p className="mt-4 text-[15px] leading-[1.75] text-[var(--fg-3)] border-l-2 border-[var(--line-gold)] pl-5">{R.cite.text}</p>
          </div>
          <div>
            <h2 className={LABEL}>Share</h2>
            <div className="mt-4">
              <ReportShare url={pageUrl} text={R.shareText} report={REPORT.slug} />
            </div>
          </div>
        </div>
      </section>

      {/* 10. Coming next */}
      <section aria-label={R.comingNext.label} className="border-y border-[var(--line-gold)] bg-[rgba(201,162,74,0.05)]">
        <div className="shell py-7 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <span className={LABEL}>{R.comingNext.label}</span>
          <p className="text-[15.5px] leading-[1.6] text-[var(--fg-2)]">
            <span className="font-display font-medium text-[22px] text-[var(--fg)]">{R.comingNext.title}.</span> {R.comingNext.text}
          </p>
        </div>
      </section>
    </LibraryShell>
  );
}
