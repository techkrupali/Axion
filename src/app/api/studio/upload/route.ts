import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import LibraryImageModel from "@/models/LibraryImage";
import { MAX_PHOTO_BYTES, sniffImage, uploadPath } from "@/lib/libraryImages";

/**
 * Studio → Photo: store one photo for a library item. Editors and admins only (also checked in
 * src/proxy.ts). The editor shrinks the photo first, so it arrives as a JPEG under 900 KB.
 * Returns the address to put in the item's `cover` field.
 */
export async function POST(req: Request) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || (role !== "editor" && role !== "admin")) {
    return Response.json({ ok: false, error: "Please sign in to the Studio again." }, { status: 401 });
  }
  try {
    const form = await req.formData();
    const file = form.get("photo");
    if (!(file instanceof Blob) || file.size === 0) return Response.json({ ok: false, error: "Choose a photo first." }, { status: 400 });
    if (file.size > MAX_PHOTO_BYTES) return Response.json({ ok: false, error: "This photo is too large. Please choose a smaller one." }, { status: 413 });
    const data = Buffer.from(await file.arrayBuffer());
    const contentType = sniffImage(data);
    if (!contentType) return Response.json({ ok: false, error: "Please choose a JPG, PNG or WebP photo." }, { status: 415 });
    const num = (k: string) => { const n = Number(form.get(k)); return Number.isFinite(n) && n > 0 && n < 20000 ? Math.round(n) : undefined; };

    await dbConnect();
    const doc = await LibraryImageModel.create({
      data, contentType, bytes: data.length, width: num("width"), height: num("height"), uploadedBy: session.user.email ?? "",
    });
    return Response.json({ ok: true, url: uploadPath(String(doc._id), contentType) });
  } catch (err) {
    console.error("[STUDIO upload]", err);
    return Response.json({ ok: false, error: "Could not upload the photo. Please try again." }, { status: 500 });
  }
}
