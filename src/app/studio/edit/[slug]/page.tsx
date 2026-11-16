import Link from "next/link";
import { notFound } from "next/navigation";
import ItemEditor from "../../ItemEditor";
import { CATEGORIES } from "@/content/library";
import { studioLibrary } from "../../data";
import { PageHeader } from "../../ui";

type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";

export default async function EditItem({ params }: Props) {
  const { slug } = await params;
  const { lib, rows } = await studioLibrary();
  const row = rows.find((r) => r.slug === slug);
  if (!row) notFound();
  const { live, visible, everPublished, updatedAt, updatedBy, seriesName: _s, ...item } = row; // eslint-disable-line @typescript-eslint/no-unused-vars
  return (
    <>
      <PageHeader
        crumbs={<><Link href="/studio" className="hover:text-[var(--fg)]">Library</Link><span className="mx-2 opacity-60">/</span><Link href={`/studio?category=${row.category}`} className="hover:text-[var(--fg)]">{CATEGORIES[row.category].plural}</Link></>}
        eyebrow={`Edit ${CATEGORIES[row.category].label.toLowerCase()}`}
        title={row.title}
      />
      <ItemEditor key={slug} item={item} series={lib.series} live={live} visible={visible} everPublished={everPublished} meta={{ updatedAt, updatedBy }} />
    </>
  );
}
