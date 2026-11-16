import { Schema, model, models } from 'mongoose';

/**
 * Someone on the Axion Index Journal list (monthly). One row per email.
 * Only added when the visitor ticked the consent box (Fix Brief Part 4, step 2);
 * `consentAt` records when, and `source` which form it came from.
 */
const NewsletterSignupSchema = new Schema({
  name:       { type: String, required: true, trim: true },
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  consentAt:  { type: Date },
  source:     { type: String, default: 'journal' },   // "journal" or "report:<slug>"
  sourcePage: { type: String, default: '' },
}, { timestamps: true });

const NewsletterSignup = models.NewsletterSignup || model('NewsletterSignup', NewsletterSignupSchema);

export default NewsletterSignup;
