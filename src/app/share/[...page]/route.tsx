import { SHARE_PAGES, shareKey, sharePathFor } from "@/config/sharePages";
import { shareImage } from "@/lib/shareImage";

/** Each page's own share image (Fix Brief Part 6, item 35). */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(SHARE_PAGES).map((path) => ({ page: shareKey(path).split("/") }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ page: string[] }> }) {
  const { page } = await params;
  const entry = SHARE_PAGES[sharePathFor(page.join("/"))];
  if (!entry) return new Response("Not found", { status: 404 });
  return shareImage(entry);
}
