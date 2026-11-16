import Link from "next/link";
import LibraryShell from "@/components/library/LibraryShell";
import { notFound } from "next/navigation";
import { CATEGORIES, coverPath, type Library } from "@/content/library";
import { libraryForPage } from "@/content/store";
import { pageMetadata } from "@/lib/seo";

/** The book is the library's one "book" item (edited in the Studio). */
const findBook = (lib: Library) => lib.items.find((i) => i.category === "book" && !i.draft);

export async function generateMetadata() {
  const book = findBook(await libraryForPage());
  if (!book) return pageMetadata({ title: "Book", description: "Nitin Nahata's book.", path: CATEGORIES.book.path });
  return pageMetadata({
    title: book.title,
    description: book.summary || `${book.title}, Nitin Nahata's book.`,
    path: CATEGORIES.book.path,
    image: { url: coverPath(book.slug, book.cover), width: 1200, height: 630, alt: book.title },
  });
}

/** The book (Fix Brief Part 3): shows Nitin's status line until it is ready. */
export default async function Page() {
  const book = findBook(await libraryForPage());
  if (!book) notFound();
  return (
    <LibraryShell eyebrow="AXION  ·  BOOK" title={book.title} intro={book.summary || "Nitin Nahata's book."}
      crumbs={[{ label: "Articles & Publications", href: "/publications" }]}>
      <section className="shell pb-24 max-w-[760px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={coverPath(book.slug, book.cover)} alt={book.coverAlt ?? ""} width={1200} height={630} className="w-full h-auto rounded-2xl border border-[var(--line)] mb-10" />
        <div className="rounded-2xl border border-[var(--line-gold)] bg-[rgba(201,162,74,0.04)] p-7">
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--accent)]">Status</span>
          <p className="text-[17px] leading-[1.7] text-[var(--fg-2)] mt-3">{book.statusLine || "In progress."}</p>
          <p className="text-[14px] text-[var(--fg-4)] mt-4">
            <Link href="/newsletter" className="text-[var(--accent)] hover:underline">Sign up to the newsletter</Link> to hear when it is ready.
          </p>
        </div>
      </section>
    </LibraryShell>
  );
}
