import { revalidatePath, revalidateTag } from "next/cache";
import { LIBRARY_TAG } from "@/content/store";

/**
 * Refresh the library on the site after a script changed it (scripts/import-library.mjs,
 * scripts/seed-library.mjs). Needs LIBRARY_REVALIDATE_SECRET in the server .env; the Studio
 * itself refreshes on every save and does not use this.
 */
export async function POST(req: Request) {
  const secret = process.env.LIBRARY_REVALIDATE_SECRET;
  if (!secret || secret.length < 16) return new Response("Not found", { status: 404 });
  if (req.headers.get("authorization") !== `Bearer ${secret}`) return Response.json({ ok: false }, { status: 401 });
  revalidateTag(LIBRARY_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  return Response.json({ ok: true });
}
