import { Schema, model, models } from 'mongoose';

/**
 * One item in Reports and Articles & Publications (Fix Brief Part 7: edited in the Studio,
 * /studio). Same fields as src/content/library.ts → LibraryItem. `draft: true` = not published.
 */
const LibraryItemSchema = new Schema({
  slug:         { type: String, required: true, unique: true, trim: true },
  category:     { type: String, required: true, enum: ['report', 'series', 'essay', 'media', 'podcast', 'book'] },
  title:        { type: String, required: true, trim: true },
  date:         { type: String, default: null },          // YYYY-MM-DD
  theme:        { type: [String], default: [] },
  summary:      { type: String, default: '' },
  body:         { type: String, default: '' },            // Markdown (essays and series parts)
  series:       { type: String },
  part:         { type: Number },
  originalLink: { type: String },
  publisher:    { type: String },
  cover:        { type: String },                       // photo: /uploads/<id>.jpg (Studio) or a /public file
  coverAlt:     { type: String },                       // what the photo shows (screen readers)
  kicker:       { type: String },
  inside:       { type: [String], default: undefined },
  author:       { type: String },
  method:       { type: String },
  site:         { type: String },
  pdf:          { type: String },                       // reports: PDF link (download after sign-up)
  owner:        { type: String, enum: ['axion', 'ai-edge-lab'] },
  embed:        { type: String },
  statusLine:   { type: String },
  draft:        { type: Boolean, default: true },
  publishedAt:  { type: Date },
  updatedBy:    { type: String, default: '' },
}, { timestamps: true });

const LibraryItem = models.LibraryItem || model('LibraryItem', LibraryItemSchema);

export default LibraryItem;
