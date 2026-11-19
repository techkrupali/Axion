import { Schema, model, models } from 'mongoose';

/** Someone who asked to receive a report. `edition` = the report's key ("Edition 01" for the Global AI Report, else its library slug). */
const ReportSignupSchema = new Schema({
  edition:      { type: String, required: true },
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, lowercase: true, trim: true },
  organisation: { type: String, default: '', trim: true },   // optional on the download form (Nitin, 19 Nov)
  journal:      { type: Boolean, default: false },   // ticked "Also send me the monthly Journal"
  sourcePage:   { type: String, default: '' },
  cameFrom:     { type: String, default: '' },          // UTM tags or referring site, e.g. "linkedin / social / make-or-break"
  downloads:    { type: Number, default: 0 },           // download-form submissions by this person
  sentAt:       { type: Date },                       // set by scripts/send-report.mjs on release day
}, { timestamps: true });

// One sign-up per email per report
ReportSignupSchema.index({ edition: 1, email: 1 }, { unique: true });

const ReportSignup = models.ReportSignup || model('ReportSignup', ReportSignupSchema);

export default ReportSignup;
