import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/** Leave Studio preview and go back to the page as visitors see it. */
export async function GET(req: Request) {
  const path = new URL(req.url).searchParams.get("path") || "/";
  (await draftMode()).disable();
  redirect(path.startsWith("/") && !path.startsWith("//") ? path : "/");
}
