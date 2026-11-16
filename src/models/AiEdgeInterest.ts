import { Schema, model, models } from 'mongoose';

/**
 * AI Edge Lab early-bird registration (Fix Brief Part 5, item 23). A separate list from the
 * Axion leads; it moves to the institute when its site launches (scripts/export-ai-edge-list.mjs).
 * One row per email.
 */
const AiEdgeInterestSchema = new Schema({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  organisation: { type: String, default: '', trim: true },
  role:         { type: String, default: '', trim: true },
  country:      { type: String, default: '', trim: true },
  assessment:   { type: String, default: '' },   // AAI, ARI, LLI or ORG AI DARS
  consentAt:    { type: Date },                  // ticked the consent box (required)
  sourcePage:   { type: String, default: '' },
  notifiedAt:   { type: Date },                  // when the "site is open" note was sent
}, { timestamps: true });

const AiEdgeInterest = models.AiEdgeInterest || model('AiEdgeInterest', AiEdgeInterestSchema);

export default AiEdgeInterest;
