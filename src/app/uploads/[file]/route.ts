import { loadPhoto, uploadId } from "@/lib/libraryImages";

/**
 * Photos added in the Studio (/uploads/<id>.jpg). Each address is unique to one upload and never
 * changes, so browsers may keep it for a year. A replaced photo gets a new address.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const id = uploadId(`/uploads/${file}`);
  const img = id ? await loadPhoto(id).catch(() => null) : null;
  if (!img) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(img.data), {
    headers: {
      "Content-Type": img.contentType,
      "Content-Length": String(img.data.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
