import dbConnect from "@/lib/db";
import LibraryItemModel from "@/models/LibraryItem";
import { loadLibraryFresh } from "@/content/store";
import { isPublic, type Library, type LibraryItem } from "@/content/library";

export type StudioRow = LibraryItem & { live: boolean; visible: boolean; everPublished: boolean; updatedAt?: string; updatedBy?: string };

/** Everything for the Studio: drafts included, with when and by whom each item was last saved. */
export async function studioLibrary(): Promise<{ lib: Library; rows: StudioRow[] }> {
  const lib = await loadLibraryFresh();
  const meta = new Map<string, { updatedAt?: Date; updatedBy?: string; publishedAt?: Date }>();
  if (process.env.MONGODB_URI) {
    try {
      await dbConnect();
      const docs = await LibraryItemModel.find({}, { slug: 1, updatedAt: 1, updatedBy: 1, publishedAt: 1 }).lean<{ slug: string; updatedAt?: Date; updatedBy?: string; publishedAt?: Date }[]>();
      for (const d of docs) meta.set(d.slug, d);
    } catch { /* the list still works from the starting data */ }
  }
  const rows = lib.items.map((i) => {
    const m = meta.get(i.slug);
    return {
      ...i,
      live: !i.draft,
      visible: isPublic(i),
      everPublished: !!m?.publishedAt || (!meta.size && !i.draft),
      updatedAt: m?.updatedAt ? new Date(m.updatedAt).toISOString() : undefined,
      updatedBy: m?.updatedBy,
    };
  });
  return { lib, rows };
}
