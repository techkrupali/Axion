import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Studio preview (Fix Brief Part 7): turns on draft mode for this browser, then opens the page.
 * Only signed-in editors reach this (see src/auth.config.ts). Drafts show until "Exit preview".
 */
export async function GET(req: Request) {
  const path = new URL(req.url).searchParams.get("path") || "/publications";
  const safe = path.startsWith("/") && !path.startsWith("//") ? path : "/publications";
  (await draftMode()).enable();
  redirect(safe);
}
