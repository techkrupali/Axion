import { SITE_URL } from "@/lib/seo";
import { LINKEDIN_AXION, LINKEDIN_NITIN } from "@/config/nav";

/**
 * Structured data for search engines (Fix Brief Part 10, SEO-03). Rendered as
 * <script type="application/ld+json">; "<" is escaped so text can't close the tag.
 */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export const ORGANIZATION = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Axion Index",
  url: SITE_URL,
  logo: `${SITE_URL}/og/axion-index.png`,
  sameAs: [LINKEDIN_AXION],
  founder: { "@type": "Person", name: "Nitin Nahata", url: `${SITE_URL}/founder`, sameAs: [LINKEDIN_NITIN] },
};

export const NITIN = { "@type": "Person", name: "Nitin Nahata", url: `${SITE_URL}/founder` };

/** Organization + WebSite, on every page (root layout). */
export const SITE_LD = {
  "@context": "https://schema.org",
  "@graph": [ORGANIZATION, { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "Axion Index", url: SITE_URL, publisher: { "@id": `${SITE_URL}/#organization` } }],
};

/** Breadcrumbs for the library pages. */
export const breadcrumbLd = (crumbs: { label: string; href: string }[], current?: { label: string; href: string }) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [{ label: "Home", href: "/" }, ...crumbs, ...(current ? [current] : [])].map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.label,
    item: SITE_URL + c.href,
  })),
});
