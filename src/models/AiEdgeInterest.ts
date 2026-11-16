import { Schema, model, models } from 'mongoose';

/**
 * AI Edge Lab early access, individuals (Nitin, 16 Nov). A separate list from the Axion leads; it
 * moves to the institute when its site launches (scripts/export-ai-edge-list.mjs).
 * One record per person, for one track by career stage (AAI, ARI or LLI). Registering again with
 * another track updates the record and notes the change.
 */
const AiEdgeInterestSchema = new Schema({
  name:          { type: String, required: true, trim: true },
  email:         { type: String, required: true, unique: true, lowercase: true, trim: true },
  organisation:  { type: String, default: '', trim: true },
  role:          { type: String, default: '', trim: true },
  country:       { type: String, default: '', trim: true },
  track:         { type: String, required: true, enum: ['AAI', 'ARI', 'LLI'] },
  previousTrack: { type: String, default: '' },
  trackChangedAt:{ type: Date },
  consentAt:     { type: Date },                  // ticked the consent box (required)
  sourcePage:    { type: String, default: '' },
  cameFrom:      { type: String, default: '' },
  invitedComplimentary: { type: Boolean, default: false },
  status:        { type: String, enum: ['Registered', 'Invited', 'Converted', 'Unsubscribed'], default: 'Registered' },
  summaryPendingSince: { type: Date },           // new or changed: goes in the next daily summary
  notifiedAt:    { type: Date },                  // when the "site is open" note was sent
}, { timestamps: true });

const AiEdgeInterest = models.AiEdgeInterest || model('AiEdgeInterest', AiEdgeInterestSchema);

export default AiEdgeInterest;
