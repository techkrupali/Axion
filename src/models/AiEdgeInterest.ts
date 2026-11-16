import { Schema, model, models } from 'mongoose';

/**
 * AI Edge Lab early-bird registration (Fix Brief Part 5, item 23). A separate list from the
 * Axion leads; it moves to the institute when its site launches (scripts/export-ai-edge-list.mjs).
 * One row per person per assessment (Nitin, 16 Nov: interest is recorded separately for each
 * assessment), so someone who registers for ARI and later for LLI has two rows.
 */
const AiEdgeInterestSchema = new Schema({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, lowercase: true, trim: true },   // looked up via the index below
  organisation: { type: String, default: '', trim: true },
  role:         { type: String, default: '', trim: true },
  country:      { type: String, default: '', trim: true },
  assessment:   { type: String, default: '' },   // AAI, ARI, LLI or ORG AI DARS
  consentAt:    { type: Date },                  // ticked the consent box (required)
  sourcePage:   { type: String, default: '' },
  notifiedAt:   { type: Date },                  // when the "site is open" note was sent
}, { timestamps: true });

AiEdgeInterestSchema.index({ email: 1, assessment: 1 }, { unique: true });

const AiEdgeInterest = models.AiEdgeInterest || model('AiEdgeInterest', AiEdgeInterestSchema);

export default AiEdgeInterest;
