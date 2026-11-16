import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { isValidObjectId } from "mongoose";
import dbConnect from "@/lib/db";
import LibraryImageModel from "@/models/LibraryImage";
import LibraryItemModel from "@/models/LibraryItem";

/**
 * Cover photos for library items (Studio → Photo). Server only.
 *  • Uploaded photos live in the database and are served at /uploads/<id>.jpg.
 *  • An item's `cover` can also be a file in /public (e.g. "/aiedgelab.jpg") in the starting data.
 */
export const MAX_PHOTO_BYTES = 900 * 1024; // under nginx's default 1 MB upload limit

const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const UPLOAD_PATH = /^\/uploads\/([a-f0-9]{24})\.(jpg|png|webp)$/;
const PUBLIC_PATH = /^\/[\w\-./]+\.(jpe?g|png|webp)$/i;

export const uploadPath = (id: string, contentType: string) => `/uploads/${id}.${EXT[contentType] ?? "jpg"}`;
export const uploadId = (path?: string) => (path ? UPLOAD_PATH.exec(path)?.[1] : undefined);
/** A cover value the Studio accepts: one of our uploads, or a photo file on this site. */
export const isCoverPath = (v: string) => UPLOAD_PATH.test(v) || (PUBLIC_PATH.test(v) && !v.includes(".."));

/** The real type of an image from its first bytes (never trust the browser's label). */
export function sniffImage(buf: Buffer): string | null {
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buf.length > 12 && buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") return "image/webp";
  return null;
}

/** One uploaded photo's bytes and type (a full document, so `data` is a real Buffer). */
export async function loadPhoto(id: string): Promise<{ data: Buffer; contentType: string } | null> {
  if (!isValidObjectId(id) || !process.env.MONGODB_URI) return null;
  await dbConnect();
  const doc = await LibraryImageModel.findById(id);
  if (!doc) return null;
  return { data: Buffer.from(doc.get("data") as Buffer), contentType: String(doc.get("contentType")) };
}

/** The photo as a data: URL, for drawing it into the cover image. Null if it can't be found. */
export async function coverPhotoDataUrl(cover?: string): Promise<string | null> {
  if (!cover) return null;
  try {
    const id = uploadId(cover);
    if (id) {
      const img = await loadPhoto(id);
      return img ? `data:${img.contentType};base64,${img.data.toString("base64")}` : null;
    }
    if (isCoverPath(cover)) {
      const buf = await readFile(join(process.cwd(), "public", cover));
      const type = sniffImage(buf);
      return type ? `data:${type};base64,${buf.toString("base64")}` : null;
    }
  } catch (err) {
    console.error("[COVER] photo unavailable:", cover, err);
  }
  return null;
}

/** Remove an uploaded photo once no item uses it any more (after a replace, remove or delete). */
export async function dropPhotoIfUnused(cover?: string) {
  const id = uploadId(cover);
  if (!id || !isValidObjectId(id)) return;
  try {
    await dbConnect();
    if (await LibraryItemModel.exists({ cover })) return;
    await LibraryImageModel.deleteOne({ _id: id });
  } catch (err) {
    console.error("[COVER] could not tidy up photo", cover, err);
  }
}
