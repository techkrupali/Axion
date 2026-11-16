import { notFound } from "next/navigation";
import ItemDetail from "@/components/library/ItemDetail";
import { itemsIn } from "@/content/library";
import { getLibrary, libraryForPage } from "@/content/store";
import { itemMetadata, publicItemOr404 } from "@/content/itemMeta";

type Props = { params: Promise<{ series: string; slug: string }> };

export const dynamicParams = true;
export async function generateStaticParams() {
  return itemsIn(await getLibrary(), "series").map((i) => ({ series: i.series ?? "", slug: i.slug }));
}

async function load(params: Props["params"]) {
  const { series, slug } = await params;
  const lib = await libraryForPage();
  const item = publicItemOr404(lib, slug, "series");
  if (item.series !== series) notFound();
  return { lib, item };
}

export async function generateMetadata({ params }: Props) {
  return itemMetadata((await load(params)).item);
}

export default async function Page({ params }: Props) {
  const { lib, item } = await load(params);
  return <ItemDetail lib={lib} item={item} />;
}
