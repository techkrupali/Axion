import mongoose, { Schema, model, models } from 'mongoose';

const DiagnosticSignalSchema = new Schema({
  // Legacy single-signal field kept for backward compat with old records
  breaking:       { type: String, default: '' },
  whyNow:         { type: String, default: '' },
  signal:         { type: String, default: '' },

  // New multi-signal fields
  signals:        { type: [String], default: [] },        // all selected signals
  rankedSignals:  { type: [String], default: [] },        // visitor-ranked top 3 (optional)
  catchAllDetail: { type: String, default: '' },          // free-text for catch-all
  practices:      { type: [String], default: [] },        // derived routing (backend only)

  // Context
  role:     { type: String, default: '' },
  company:  { type: String, default: '' },
  size:     { type: String, default: '' },

  // Contact
  name:     { type: String, required: true },
  email:    { type: String, required: true },
  phone:    { type: String, default: '' },
  callback: { type: String, default: '' },

  status:   { type: String, enum: ['new', 'read', 'contacted'], default: 'new' },
}, { timestamps: true });

const DiagnosticSignal = models.DiagnosticSignal || model('DiagnosticSignal', DiagnosticSignalSchema);

export default DiagnosticSignal;
