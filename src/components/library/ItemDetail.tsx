import Link from "next/link";
import LibraryShell from "@/components/library/LibraryShell";
import { CATEGORIES, coverPath, findSeries, formatDate, seriesParts, itemPath, publicItems, type Library, type LibraryItem } from "@/content/library";
import { markdownToHtml } from "@/lib/markdown";
import { SITE_URL } from "@/lib/seo";
import ShareButtons from "@/components/library/ShareButtons";
import TrackRead from "@/components/library/TrackRead";
import { JsonLd, NITIN, ORGANIZATION } from "@/lib/jsonLd";
import { offListsForLaunch } from "@/config/report";

const MONO = "font-mono text-[10.5px] tracking-[0.2em] uppercase";

/** Up to three other pieces: same series first, then the same theme, then the same category; newest first. */
function relatedTo(lib: Library, item: LibraryItem): LibraryItem[] {
  const score = (o: LibraryItem) =>
    (item.series && o.series === item.series ? 4 : 0) +
    (o.theme.some((t) => item.theme.includes(t)) ? 2 : 0) +
    (o.category === item.category ? 1 : 0);
  return publicItems(lib)
    .filter((o) => o.slug !== item.slug && o.category !== "book" && !offListsForLaunch(o.slug))
    .map((o, i) => ({ o, s: score(o), i }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .slice(0, 3)
    .map((x) => x.o);
}

/** What the "read it elsewhere" panel says when the full text is not on this site. */
function elsewhere(item: LibraryItem, isLinkedIn: boolean) {
  if (item.category === "media") {
    const pub = item.publisher ?? "the publisher";
    return { line: `Published by ${pub}.`, sub: "The publisher owns this piece. Read it in full on their site.", cta: `Read on ${pub}` };
  }
  if (item.category === "podcast") return { line: "Listen to the full conversation.", sub: "The recording is on the host's site.", cta: "Listen to the recording" };
  if (isLinkedIn) return { line: "The full essay is on LinkedIn.", sub: "It was first published there, and the conversation continues there.", cta: "Read it on LinkedIn" };
  return { line: "The full essay is on the original site.", sub: "", cta: "Read the full essay" };
}

/**
 * One page per item (Fix Brief Part 3, item 11): essays, series parts, media and podcasts.
 * Header: kicker, title and summary on the left; beside them, where to read it (one clear button)
 * and share. Then the text or recording, series navigation, and three more pieces to read.
 */
export default function ItemDetail({ lib, item }: { lib: Library; item: LibraryItem }) {
  const cat = CATEGORIES[item.category];
  const series = item.series ? findSeries(lib, item.series) : undefined;
  const written = item.category === "essay" || item.category === "series";
  const text = written && item.body?.trim() ? item.body : null;
  const isLinkedIn = written && !!item.originalLink && /^https:\/\/(www\.)?linkedin\.com\//.test(item.originalLink);
  const parts = series ? seriesParts(lib, series.slug) : [];
  const idx = parts.findIndex((p) => p.slug === item.slug);
  const prev = idx > 0 ? parts[idx - 1] : undefined;
  const next = idx >= 0 && idx < parts.length - 1 ? parts[idx + 1] : undefined;
  const related = relatedTo(lib, item);
  const photo = item.cover; // an uploaded photo; the generated cover is only the share image

  const crumbs = [
    { label: "Articles & Publications", href: "/publications" },
    { label: cat.plural, href: cat.path },
    ...(series ? [{ label: series.name, href: `/publications/series/${series.slug}` }] : []),
  ];
  const kicker = [
    cat.label,
    series ? `${series.name}${item.part ? ` · Part ${item.part}` : ""}` : item.category === "media" ? item.publisher : item.theme[0],
  ].filter(Boolean).join("  ·  ");

  // Beside the title: where to read it. With the full text here, a quieter link back to the original.
  const ask = !text && item.originalLink ? elsewhere(item, isLinkedIn) : null;
  const backLink = text && item.originalLink
    ? { line: isLinkedIn ? "First published on LinkedIn." : "First published elsewhere.", cta: isLinkedIn ? "Join the conversation" : "Read the original" }
    : null;

  const hero = (
    <header className="relative pt-32 sm:pt-44 pb-14 sm:pb-20 border-b border-[var(--line)]">
      <div className="shell">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--fg-5)]">
          {crumbs.map((c, i) => (
            <span key={c.href} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden className="opacity-60">/</span>}
              <Link href={c.href} className="inline-flex items-center hover:text-[var(--accent)] transition-colors">{c.label}</Link>
            </span>
          ))}
        </nav>

        <div className="mt-10 sm:mt-12 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px] gap-12 lg:gap-16 xl:gap-24 lg:items-center">
          <div className="min-w-0">
            <p className={`${MONO} text-[var(--accent)] whitespace-pre-wrap`}>{kicker}</p>
            <h1 className="font-display font-medium text-[clamp(38px,5vw,68px)] leading-[1.06] tracking-[-0.01em] text-[var(--fg)] mt-6 [text-wrap:balance]">
              {item.title}
            </h1>
            {item.summary && (
              <p className="font-display italic text-[clamp(21px,2.2vw,25px)] leading-[1.45] text-[var(--fg-3)] mt-7 max-w-[44ch] [text-wrap:pretty]">
                {item.summary}
              </p>
            )}
          </div>

          <aside aria-label="Read and share" className="border border-[var(--line-gold)] bg-[rgba(201,162,74,0.025)] p-7 sm:p-9 text-center">
            {ask ? (
              <>
                <p className="font-display italic text-[clamp(24px,2.4vw,28px)] leading-[1.3] text-[var(--fg)]">{ask.line}</p>
                {ask.sub && <p className="text-[14.5px] leading-[1.7] text-[var(--fg-4)] mt-3">{ask.sub}</p>}
                <a href={item.originalLink} target="_blank" rel="noopener noreferrer"
                  className="mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#C9A24A] hover:bg-[#D6B35E] text-[#0A0A0B] font-mono text-[11px] tracking-[0.22em] uppercase font-semibold transition-colors">
                  {ask.cta} <span aria-hidden>↗</span>
                </a>
              </>
            ) : backLink ? (
              <>
                <p className="font-display italic text-[clamp(22px,2.2vw,26px)] leading-[1.3] text-[var(--fg)]">{backLink.line}</p>
                <a href={item.originalLink} target="_blank" rel="noopener noreferrer"
                  className="mt-7 w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 border border-[#C9A24A] text-[var(--fg)] hover:bg-[#C9A24A] hover:text-[#0A0A0B] font-mono text-[11px] tracking-[0.2em] uppercase transition-colors">
                  {backLink.cta} <span aria-hidden>↗</span>
                </a>
              </>
            ) : (
              <p className="font-display italic text-[clamp(22px,2.2vw,26px)] leading-[1.3] text-[var(--fg)]">Pass it on.</p>
            )}
            <div className="mt-8 pt-7 border-t border-[var(--line-gold)]">
              <ShareButtons url={SITE_URL + itemPath(item)} title={item.title} quiet stacked />
            </div>
          </aside>
        </div>
      </div>
    </header>
  );

  return (
    <LibraryShell crumbs={crumbs} hero={hero}>
      <article className="shell pb-24 sm:pb-32">
        <TrackRead slug={item.slug} category={item.category} />
        {written && (
          <JsonLd data={{
            "@context": "https://schema.org",
            "@type": "Article",
            headline: item.title,
            description: item.summary || undefined,
            ...(item.date ? { datePublished: item.date } : {}),
            image: SITE_URL + coverPath(item.slug, item.cover),
            url: SITE_URL + itemPath(item),
            mainEntityOfPage: SITE_URL + itemPath(item),
            author: NITIN,
            publisher: ORGANIZATION,
            ...(series ? { isPartOf: { "@type": "CreativeWorkSeries", name: series.name, url: `${SITE_URL}/publications/series/${series.slug}` } } : {}),
            ...(item.originalLink ? { sameAs: item.originalLink } : {}),
          }} />
        )}

        {photo && (
          <figure className="mx-auto max-w-[980px] mt-14 sm:mt-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt={item.coverAlt ?? ""} className="w-full h-auto border border-[var(--line)]" />
            {item.coverAlt && <figcaption className="mt-3 text-center text-[13px] text-[var(--fg-5)]">{item.coverAlt}</figcaption>}
          </figure>
        )}

        {/* The text or the recording */}
        {text ? (
          <div className="article-prose mx-auto max-w-[680px] mt-14 sm:mt-20" dangerouslySetInnerHTML={{ __html: markdownToHtml(text) }} />
        ) : item.category === "podcast" && item.embed ? (
          <div className="mx-auto max-w-[880px] aspect-video border border-[var(--line)] mt-14 sm:mt-20">
            <iframe src={item.embed} title={item.title} className="w-full h-full" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen loading="lazy" />
          </div>
        ) : null}

        {(prev || next) && (
          <nav aria-label="Series" className="mx-auto max-w-[880px] grid grid-cols-1 sm:grid-cols-2 gap-px mt-14 sm:mt-20 bg-[var(--line)] border border-[var(--line)]">
            {prev ? (
              <Link href={itemPath(prev)} className="group bg-[var(--bg)] p-6 hover:bg-[rgba(201,162,74,0.04)] transition-colors">
                <span className={`${MONO} text-[var(--fg-5)]`}>← Previous{prev.part ? ` · Part ${prev.part}` : ""}</span>
                <span className="block font-display text-[21px] leading-snug text-[var(--fg)] group-hover:text-[var(--accent)] mt-2 transition-colors">{prev.title}</span>
              </Link>
            ) : <span className="hidden sm:block bg-[var(--bg)]" />}
            {next ? (
              <Link href={itemPath(next)} className="group bg-[var(--bg)] p-6 sm:text-right hover:bg-[rgba(201,162,74,0.04)] transition-colors">
                <span className={`${MONO} text-[var(--fg-5)]`}>Next{next.part ? ` · Part ${next.part}` : ""} →</span>
                <span className="block font-display text-[21px] leading-snug text-[var(--fg)] group-hover:text-[var(--accent)] mt-2 transition-colors">{next.title}</span>
              </Link>
            ) : <span className="hidden sm:block bg-[var(--bg)]" />}
          </nav>
        )}

        {/* Keep reading: three more pieces */}
        <section aria-labelledby="keep-reading" className="mt-16 sm:mt-24">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 mb-8 sm:mb-10">
            <h2 id="keep-reading" className="font-display font-medium text-[clamp(30px,3.4vw,42px)] leading-none text-[var(--fg)]">Keep reading</h2>
            <Link href={cat.path} className={`${MONO} text-[var(--fg-4)] hover:text-[var(--accent)] transition-colors min-h-[36px] inline-flex items-center`}>
              All {cat.plural.toLowerCase()} →
            </Link>
          </div>
          {related.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)]">
              {related.map((r) => (
                <Link key={r.slug} href={itemPath(r)} className="group flex flex-col bg-[var(--bg)] p-7 sm:p-8 min-h-[220px] hover:bg-[rgba(201,162,74,0.04)] transition-colors">
                  <span className={`${MONO} text-[var(--accent)]`}>
                    {CATEGORIES[r.category].label}{r.date ? <span className="text-[var(--fg-5)]">{"  ·  "}{formatDate(r.date, "short")}</span> : null}
                  </span>
                  <span className="font-display text-[24px] leading-[1.2] text-[var(--fg)] group-hover:text-[var(--accent)] mt-4 transition-colors [text-wrap:balance]">{r.title}</span>
                  {r.summary && <span className="text-[14px] leading-[1.65] text-[var(--fg-4)] mt-3 line-clamp-2">{r.summary}</span>}
                  <span className={`${MONO} text-[var(--fg-4)] group-hover:text-[var(--accent)] mt-auto pt-6 transition-colors`}>Read →</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </article>
    </LibraryShell>
  );
}
