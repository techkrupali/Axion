import { Schema, model, models } from 'mongoose';

/** Someone who asked to receive the Global AI Report on release. */
const ReportSignupSchema = new Schema({
  edition:      { type: String, required: true },
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, lowercase: true, trim: true },
  organisation: { type: String, required: true, trim: true },
}, { timestamps: true });

// One sign-up per email per edition
ReportSignupSchema.index({ edition: 1, email: 1 }, { unique: true });

const ReportSignup = models.ReportSignup || model('ReportSignup', ReportSignupSchema);

export default ReportSignup;
