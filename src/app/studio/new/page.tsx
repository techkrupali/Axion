import Link from "next/link";
import ItemEditor from "../ItemEditor";
import { CATEGORIES, CATEGORY_ORDER, type Category } from "@/content/library";
import { studioLibrary } from "../data";

type Props = { searchParams: Promise<{ category?: string }> };
export const dynamic = "force-dynamic";

export default async function NewItem({ searchParams }: Props) {
  const { category } = await searchParams;
  const cat: Category = CATEGORY_ORDER.includes(category as Category) ? (category as Category) : "essay";
  const { lib } = await studioLibrary();
  return (
    <div>
      <Link href="/studio" className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-[var(--fg-4)] hover:text-[var(--fg)]">← Library</Link>
      <h1 className="font-serif text-[32px] text-[var(--fg)] mt-3 mb-8">New {CATEGORIES[cat].label.toLowerCase()}</h1>
      <ItemEditor item={{ category: cat, theme: [] }} series={lib.series} live={false} everPublished={false} />
    </div>
  );
}
