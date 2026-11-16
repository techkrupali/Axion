import ItemDetail from "@/components/library/ItemDetail";
import { itemsIn } from "@/content/library";
import { getLibrary, libraryForPage } from "@/content/store";
import { itemMetadata, publicItemOr404 } from "@/content/itemMeta";

type Props = { params: Promise<{ slug: string }> };

// New items published in the Studio render on first visit, no rebuild needed (Fix Brief Part 7)
export const dynamicParams = true;
export async function generateStaticParams() {
  return itemsIn(await getLibrary(), "essay").map((i) => ({ slug: i.slug }));
}
export async function generateMetadata({ params }: Props) {
  return itemMetadata(publicItemOr404(await libraryForPage(), (await params).slug, "essay"));
}
export default async function Page({ params }: Props) {
  const lib = await libraryForPage();
  return <ItemDetail lib={lib} item={publicItemOr404(lib, (await params).slug, "essay")} />;
}
