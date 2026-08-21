import { Schema, model, models } from 'mongoose';

const WrittenIntentSchema = new Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  role: { type: String, default: '', trim: true },
  organisation: { type: String, default: '', trim: true },
  email: { type: String, required: [true, 'Email is required'], lowercase: true, trim: true },
  practice: { type: String, default: '' },       // Practice of interest
  reading: { type: String, default: '' },        // Where the architecture is under stress
  message: { type: String, default: '' },        // Free text intent
  status: {
    type: String,
    enum: ['new', 'read', 'contacted'],
    default: 'new',
  },
}, {
  timestamps: true,
});

const WrittenIntent = models.WrittenIntent || model('WrittenIntent', WrittenIntentSchema);

export default WrittenIntent;
