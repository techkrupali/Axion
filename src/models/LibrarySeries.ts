import { Schema, model, models } from 'mongoose';

/** A multi-part series in Articles & Publications (edited in the Studio). */
const LibrarySeriesSchema = new Schema({
  slug:    { type: String, required: true, unique: true, trim: true },
  name:    { type: String, required: true, trim: true },
  summary: { type: String, default: '' },
  theme:   { type: [String], default: [] },
}, { timestamps: true });

const LibrarySeries = models.LibrarySeries || model('LibrarySeries', LibrarySeriesSchema);

export default LibrarySeries;
