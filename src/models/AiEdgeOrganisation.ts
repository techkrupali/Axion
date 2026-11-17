import { Schema, model, models } from 'mongoose';

/**
 * ORG AI DARS early access (Nitin, 16 Nov). One record per organisation, created only when a
 * leader (LLI) opts in on the confirmation screen; linked to that leader's email in the
 * individuals list. Another leader from the same organisation is added to `alsoRequestedBy`.
 * Matched by work-email domain (orgKey "domain:tata.com"); with a personal email, by name
 * (orgKey "name:acme") and marked `toCheck` (Nitin, 17 Nov).
 */
const AiEdgeOrganisationSchema = new Schema({
  orgKey:        { type: String, required: true, unique: true },   // "domain:tata.com" or "name:acme"
  domain:        { type: String, default: '', index: true },          // the work-email domain, if any
  nameKey:       { type: String, default: '', index: true },          // the name, simplified (orgNameKey)
  toCheck:       { type: Boolean, default: false },                   // matched by name: Nitin reviews it
  organisation:  { type: String, required: true, trim: true },
  leaderEmail:   { type: String, required: true, lowercase: true, trim: true, index: true },
  leaderName:    { type: String, default: '', trim: true },
  headcount:     { type: String, required: true },
  question:      { type: String, required: true, trim: true },
  alsoRequestedBy: { type: [String], default: [] },
  consentAt:     { type: Date },                  // the leader's consent at registration
  sourcePage:    { type: String, default: '' },
  cameFrom:      { type: String, default: '' },
  invitedComplimentary: { type: Boolean, default: false },
  status:        { type: String, enum: ['Registered', 'Invited', 'Converted', 'Unsubscribed'], default: 'Registered' },
}, { timestamps: true });

const AiEdgeOrganisation = models.AiEdgeOrganisation || model('AiEdgeOrganisation', AiEdgeOrganisationSchema);

export default AiEdgeOrganisation;
