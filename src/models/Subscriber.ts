import mongoose, { Schema, model, models } from 'mongoose';

const SubscriberQuotaUsageSchema = new Schema({
  metric: { type: String, required: true },
  current: { type: Number, default: 0 },
  limit: { type: Number, default: 0 },
  periodStart: { type: Date },
  periodEnd: { type: Date },
}, { _id: false });

const SubscriberSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  organizationName: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed', 'pending', 'suspended'],
    default: 'pending',
  },
  planTier: {
    type: String,
    enum: ['free', 'growth', 'enterprise'],
    default: 'free',
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'annual'],
    default: 'monthly',
  },
  subscriptionId: {
    type: String,
  },
  razorpayCustomerId: {
    type: String,
  },
  currentPeriodStart: {
    type: Date,
  },
  currentPeriodEnd: {
    type: Date,
  },
  usage: [SubscriberQuotaUsageSchema],
  downgradeRequested: {
    type: Boolean,
    default: false,
  },
  downgradeEffectiveDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

const Subscriber = models.Subscriber || model('Subscriber', SubscriberSchema);

export default Subscriber;
