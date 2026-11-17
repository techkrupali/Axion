import type { Metadata } from "next";
import { SHARE_PAGES, shareKey } from "@/config/sharePages";

export const SITE_URL = "https://axionindex.org";
export const SITE_NAME = "Axion Index";

/** 1200×630 share images (public/og/*). */
export const OG_DEFAULT = { url: "/og/axion-index.png", width: 1200, height: 630, alt: "Axion Index — From ambiguity to architecture." };

/**
 * Title, description and share card for one page. Next merges metadata shallowly,
 * so every page passes its own openGraph/twitter block (including the image).
 */
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  image?: typeof OG_DEFAULT;
  noIndex?: boolean;
  /** Use the title as given, without " · Axion Index" (SEO-02: titles that already name us, or would run past 60 characters) */
  exactTitle?: boolean;
}): Metadata {
  // Every page its own share image (Fix Brief Part 6, item 35); unknown pages fall back to the default
  const own = SHARE_PAGES[opts.path];
  const image = opts.image ?? (own ? { url: `/share/${shareKey(opts.path)}`, width: 1200, height: 630, alt: `${own.kicker}: ${own.title}` } : OG_DEFAULT);
  const fullTitle = opts.path === "/" || opts.exactTitle ? opts.title : `${opts.title} · ${SITE_NAME}`;
  return {
    title: { absolute: fullTitle },
    description: opts.description,
    alternates: { canonical: opts.path },
    openGraph: {
      title: fullTitle,
      description: opts.description,
      url: opts.path,
      siteName: SITE_NAME,
      locale: "en_IN",
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: opts.description,
      images: [image.url],
    },
    ...(opts.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
