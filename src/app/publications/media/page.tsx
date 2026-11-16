import LibraryShell from "@/components/library/LibraryShell";
import CategoryList from "@/components/library/CategoryList";
import { CATEGORIES, itemsIn } from "@/content/library";
import { libraryForPage } from "@/content/store";
import { pageMetadata } from "@/lib/seo";

const cat = CATEGORIES["media"];

export const metadata = pageMetadata({ title: cat.plural, description: cat.blurb, path: cat.path });

export default async function Page() {
  const lib = await libraryForPage();
  return (
    <LibraryShell eyebrow={`AXION  ·  ${cat.plural.toUpperCase()}`} title={cat.plural} intro={cat.blurb} crumbs={[{ label: "Articles & Publications", href: "/publications" }]}>
      <CategoryList items={itemsIn(lib, "media")} empty={`No ${cat.plural.toLowerCase()} published here yet.`} />
    </LibraryShell>
  );
}
