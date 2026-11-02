import { Schema, model, models } from 'mongoose';

/** A completed AI Edge Lab diagnostic (/expertise/ai-edge/diagnostic). */
const EdgeAssessmentSchema = new Schema({
  // Contact — copied from the submitter's registered account
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  name:   { type: String, required: true },
  email:  { type: String, required: true, lowercase: true, trim: true },
  phone:  { type: String, default: '' },

  // What they entered on the profile step
  indexType:      { type: String, required: true },
  indexName:      { type: String, default: '' },
  profileName:    { type: String, default: '' },
  profileRole:    { type: String, default: '' },
  experienceBand: { type: String, default: '' },
  answers:        { type: Schema.Types.Mixed, default: {} },

  // Result — recomputed on the server from the answers
  score:      { type: Number },
  range:      { type: String, default: '' },
  band:       { type: String, default: '' },
  archetype:  { type: String, default: '' },
  components: { type: Schema.Types.Mixed, default: {} },

  status: { type: String, enum: ['new', 'read', 'contacted'], default: 'new' },
}, { timestamps: true });

const EdgeAssessment = models.EdgeAssessment || model('EdgeAssessment', EdgeAssessmentSchema);

export default EdgeAssessment;
