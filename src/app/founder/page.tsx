import FounderPage, { type LatestItem } from "./FounderPage";
import { formatDate, itemKind, itemPath, publicItems, type Category, type Library } from "@/content/library";
import { libraryForPage } from "@/content/store";
import { AXION_PROFILES, FOUNDER_PROFILES } from "@/config/founder";
import { SITE_URL } from "@/lib/seo";

/** Articles & Publications categories shown under "Writing & media" (reports have their own page). */
const WRITING: Category[] = ["series", "essay", "media", "podcast"];

/** The latest 6, chosen automatically (Fix Brief Part 6, item 32). */
function latestWriting(lib: Library): LatestItem[] {
  return publicItems(lib)
    .filter((i) => WRITING.includes(i.category))
    .slice(0, 6)
    .map((i) => {
      const source = i.category === "media" ? i.publisher : i.category === "series" ? i.seriesName : i.kicker;
      return {
        slug: i.slug,
        href: itemPath(i),
        label: [itemKind(i), source].filter(Boolean).join(" · "),
        title: i.title,
        date: formatDate(i.date, "short"),
      };
    });
}

/** "sameAs" structured data (item 36): one person behind all these profiles. */
const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Nitin Nahata",
  url: `${SITE_URL}/founder`,
  image: `${SITE_URL}/nitin-nahata-founder.jpg`,
  jobTitle: "Founder",
  worksFor: { "@type": "Organization", name: "Axion Index", url: SITE_URL, sameAs: AXION_PROFILES },
  sameAs: FOUNDER_PROFILES.map((p) => p.url).filter(Boolean),
};

export default async function Page() {
  const lib = await libraryForPage();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd).replace(/</g, "\\u003c") }} />
      <FounderPage latest={latestWriting(lib)} />
    </>
  );
}
