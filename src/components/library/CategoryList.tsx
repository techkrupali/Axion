import Link from "next/link";
import ItemCard from "@/components/library/ItemCard";
import type { LibraryItem } from "@/content/library";

/** Every item in a category, newest first (Fix Brief Part 3, item 10). */
export default function CategoryList({ items, empty }: { items: LibraryItem[]; empty: string }) {
  return (
    <section className="shell pb-24">
      {items.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((i) => <ItemCard key={i.slug} item={i} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--line-gold)] p-6 sm:p-8 max-w-[640px]">
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--accent)]">In preparation</span>
          <p className="text-[15px] leading-[1.7] text-[var(--fg-3)] mt-3">
            {empty}{" "}
            <Link href="/newsletter" className="text-[var(--accent)] underline underline-offset-2">Sign up to the newsletter</Link> to hear when it is.
          </p>
        </div>
      )}
    </section>
  );
}
