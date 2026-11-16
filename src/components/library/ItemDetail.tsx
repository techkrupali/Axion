import Link from "next/link";
import LibraryShell from "@/components/library/LibraryShell";
import { CATEGORIES, coverPath, findSeries, formatDate, readTime, seriesParts, itemPath, type Library, type LibraryItem } from "@/content/library";
import { markdownToHtml } from "@/lib/markdown";
import { SITE_URL } from "@/lib/seo";
import ShareButtons from "@/components/library/ShareButtons";
import FollowBlock from "@/components/library/FollowBlock";
import TrackRead from "@/components/library/TrackRead";
import { JsonLd, NITIN, ORGANIZATION } from "@/lib/jsonLd";

const PROSE =
  "text-[17px] leading-[1.8] text-[var(--fg-2)] [&_p]:mb-6 [&_h2]:font-serif [&_h2]:text-[30px] [&_h2]:leading-tight [&_h2]:text-[var(--fg)] [&_h2]:mt-12 [&_h2]:mb-4 " +
  "[&_h3]:font-serif [&_h3]:text-[23px] [&_h3]:text-[var(--fg)] [&_h3]:mt-10 [&_h3]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_li]:mb-2 " +
  "[&_blockquote]:border-l-2 [&_blockquote]:border-[#C9A24A] [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-[var(--fg-3)] [&_blockquote]:my-8 " +
  "[&_a]:text-[var(--accent)] [&_a:hover]:underline [&_strong]:text-[var(--fg)] [&_hr]:border-[var(--line)] [&_hr]:my-10";

/** One page per item (Fix Brief Part 3, item 11): title, date, category, theme, series, read time, summary, then the content or a link out. */
export default function ItemDetail({ lib, item }: { lib: Library; item: LibraryItem }) {
  const cat = CATEGORIES[item.category];
  const series = item.series ? findSeries(lib, item.series) : undefined;
  const text = (item.category === "essay" || item.category === "series") && item.body?.trim() ? item.body : null;
  const minutes = text ? readTime(text) : null;
  const isLinkedIn = (item.category === "essay" || item.category === "series") && !!item.originalLink && /^https:\/\/(www\.)?linkedin\.com\//.test(item.originalLink);
  const parts = series ? seriesParts(lib, series.slug) : [];
  const idx = parts.findIndex((p) => p.slug === item.slug);
  const prev = idx > 0 ? parts[idx - 1] : undefined;
  const next = idx >= 0 && idx < parts.length - 1 ? parts[idx + 1] : undefined;

  const crumbs = [
    { label: "Articles & Publications", href: "/publications" },
    { label: cat.plural, href: cat.path },
    ...(series ? [{ label: series.name, href: `/publications/series/${series.slug}` }] : []),
  ];

  return (
    <LibraryShell
      eyebrow={`AXION  ·  ${cat.label.toUpperCase()}`}
      title={item.title}
      crumbs={crumbs}
      intro={item.summary ? <p className="italic">{item.summary}</p> : undefined}
    >
      <article className="shell pb-24">
        <TrackRead slug={item.slug} category={item.category} />
        {(item.category === "essay" || item.category === "series") && (
          <JsonLd data={{
            "@context": "https://schema.org",
            "@type": "Article",
            headline: item.title,
            description: item.summary || undefined,
            ...(item.date ? { datePublished: item.date } : {}),
            image: SITE_URL + coverPath(item.slug),
            url: SITE_URL + itemPath(item),
            mainEntityOfPage: SITE_URL + itemPath(item),
            author: NITIN,
            publisher: ORGANIZATION,
            ...(series ? { isPartOf: { "@type": "CreativeWorkSeries", name: series.name, url: `${SITE_URL}/publications/series/${series.slug}` } } : {}),
            ...(item.originalLink ? { sameAs: item.originalLink } : {}),
          }} />
        )}
        {/* meta row */}
        <dl className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--fg-4)] border-y border-[var(--line)] py-4 mb-10">
          {item.date && (<div><dt className="sr-only">Date</dt><dd>{formatDate(item.date)}</dd></div>)}
          <div><dt className="sr-only">Category</dt><dd className="text-[var(--accent)]">{cat.label}</dd></div>
          {item.publisher && (<div><dt className="sr-only">Publisher</dt><dd>{item.publisher}</dd></div>)}
          {series && (<div><dt className="sr-only">Series</dt><dd><Link href={`/publications/series/${series.slug}`} className="hover:text-[var(--accent)]">{series.name}{item.part ? ` · Part ${item.part}` : ""}</Link></dd></div>)}
          {minutes && (<div><dt className="sr-only">Read time</dt><dd>{minutes} min read</dd></div>)}
          {item.theme.length > 0 && (<div><dt className="sr-only">Theme</dt><dd>{item.theme.join(" · ")}</dd></div>)}
        </dl>

        <div className="max-w-[760px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverPath(item.slug)} alt="" width={1200} height={630} className="w-full h-auto rounded-2xl border border-[var(--line)] mb-12" />

          {text ? (
            <>
              <div className={PROSE} dangerouslySetInnerHTML={{ __html: markdownToHtml(text) }} />
              {item.originalLink && !isLinkedIn && (
                <p className="mt-10 font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--fg-5)]">
                  First published on <a href={item.originalLink} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">the original site ↗</a>
                </p>
              )}
            </>
          ) : item.category === "podcast" && item.embed ? (
            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-[var(--line)]">
              <iframe src={item.embed} title={item.title} className="w-full h-full" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen loading="lazy" />
            </div>
          ) : item.originalLink ? (
            // In the media: never copy the article; the publisher owns that text
            <div className="rounded-2xl border border-[var(--line-gold)] bg-[rgba(201,162,74,0.04)] p-7 sm:p-9">
              <p className="text-[15px] leading-[1.7] text-[var(--fg-3)] mb-6">
                {item.category === "media" ? `This piece was published by ${item.publisher ?? "another publication"}. Read it in full on their site.` : "Read or listen to it in full on the original site."}
              </p>
              <a href={item.originalLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-7 py-4 bg-[#C9A24A] text-[#0A0A0B] font-mono text-[11px] tracking-[0.22em] uppercase font-semibold">
                {item.category === "media" ? `Read on ${item.publisher ?? "the publisher's site"}` : "Open the original"} <span aria-hidden>↗</span>
              </a>
            </div>
          ) : null}

          <div className="mt-12 pt-8 border-t border-[var(--line)] flex flex-col gap-6">
            {/* Fix Brief Part 6, item 31: essays and series parts link back to their LinkedIn post */}
            {isLinkedIn && (
              <div className="flex flex-wrap items-center gap-4">
                <a href={item.originalLink} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-7 py-4 bg-[#C9A24A] text-[#0A0A0B] font-mono text-[11px] tracking-[0.22em] uppercase font-semibold">
                  Discuss on LinkedIn <span aria-hidden>↗</span>
                </a>
                <span className="text-[14px] text-[var(--fg-4)]">First published on LinkedIn. Join the conversation there.</span>
              </div>
            )}
            <ShareButtons url={SITE_URL + itemPath(item)} title={item.title} />
          </div>

          {(prev || next) && (
            <nav aria-label="Series" className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-14">
              {prev ? <Link href={itemPath(prev)} className="rounded-xl border border-[var(--line)] p-5 hover:border-[var(--line-gold)]"><span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--fg-5)]">← Previous</span><span className="block mt-2 text-[var(--fg)]">{prev.title}</span></Link> : <span />}
              {next && <Link href={itemPath(next)} className="rounded-xl border border-[var(--line)] p-5 hover:border-[var(--line-gold)] sm:text-right"><span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--fg-5)]">Next in series →</span><span className="block mt-2 text-[var(--fg)]">{next.title}</span></Link>}
            </nav>
          )}

          <FollowBlock />

          <p className="mt-14">
            <Link href={cat.path} className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--fg-4)] hover:text-[var(--accent)]">← All {cat.plural.toLowerCase()}</Link>
          </p>
        </div>
      </article>
    </LibraryShell>
  );
}
