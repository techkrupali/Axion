import { readFile } from "node:fs/promises";
import path from "node:path";
import { REPORT } from "@/config/report";

/**
 * /reports/make-or-break/download: the report PDF as a download (not opened in the browser),
 * saved under Nitin's file name. The "here" link and button in the "Your copy" email point here.
 * The file itself lives in public/reports/ on the server (kept out of git: the repo is public).
 */
export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  if (slug !== REPORT.slug) return new Response("Not found", { status: 404 });
  let pdf: Buffer;
  try {
    pdf = await readFile(path.join(process.cwd(), "public", REPORT.pdfPath));
  } catch {
    return new Response("Not found", { status: 404 });
  }
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${REPORT.pdfFileName}"`,
      "Content-Length": String(pdf.length),
      "Cache-Control": "public, max-age=600",
      "X-Robots-Tag": "noindex",
    },
  });
}
