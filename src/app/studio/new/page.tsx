import Link from "next/link";
import ItemEditor from "../ItemEditor";
import { CATEGORIES, CATEGORY_ORDER, type Category } from "@/content/library";
import { studioLibrary } from "../data";
import { PageHeader } from "../ui";

type Props = { searchParams: Promise<{ category?: string }> };
export const dynamic = "force-dynamic";

export default async function NewItem({ searchParams }: Props) {
  const { category } = await searchParams;
  const cat: Category = CATEGORY_ORDER.includes(category as Category) ? (category as Category) : "essay";
  const { lib } = await studioLibrary();
  return (
    <>
      <PageHeader
        crumbs={<><Link href="/studio" className="hover:text-[var(--fg)]">Library</Link><span className="mx-2 opacity-60">/</span>New</>}
        eyebrow="Add to the library"
        title={`New ${CATEGORIES[cat].label.toLowerCase()}`}
        intro="Save a draft and preview it as visitors will see it. Publish when it's ready: it goes live straight away."
      />
      <ItemEditor item={{ category: cat, theme: [] }} series={lib.series} live={false} everPublished={false} />
    </>
  );
}
