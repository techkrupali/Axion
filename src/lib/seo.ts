import type { Metadata } from "next";

export const SITE_URL = "https://axionindex.org";
export const SITE_NAME = "Axion Index";

/** 1200×630 share images (public/og/*). */
export const OG_DEFAULT = { url: "/og/axion-index.png", width: 1200, height: 630, alt: "Axion Index — From ambiguity to architecture." };
export const OG_REPORT = { url: "/og/global-ai-report.png", width: 1200, height: 630, alt: "Axion Index · Global AI Report · Edition 01" };

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
}): Metadata {
  const image = opts.image ?? OG_DEFAULT;
  const fullTitle = opts.path === "/" ? opts.title : `${opts.title} · ${SITE_NAME}`;
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
