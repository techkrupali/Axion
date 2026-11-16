import { Schema, model, models } from 'mongoose';

/**
 * A photo added to a library item in the Studio (cover photo). Stored in the database with
 * the rest of the content, so it survives a server move and needs no file storage.
 * The Studio shrinks photos in the browser first (at most 1600 px, under 900 KB).
 * Served at /uploads/<id>.jpg; used inside the item's cover (/cover/<slug>).
 */
const LibraryImageSchema = new Schema({
  data:        { type: Buffer, required: true },
  contentType: { type: String, required: true, enum: ['image/jpeg', 'image/png', 'image/webp'] },
  bytes:       { type: Number, required: true },
  width:       { type: Number },
  height:      { type: Number },
  uploadedBy:  { type: String, default: '' },
}, { timestamps: true });

const LibraryImage = models.LibraryImage || model('LibraryImage', LibraryImageSchema);

export default LibraryImage;
