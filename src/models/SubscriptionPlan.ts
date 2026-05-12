import mongoose, { Schema, model, models } from 'mongoose';

const PlanFeatureSchema = new Schema({
  featureId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  gated: { type: String, enum: ['soft', 'hard', 'unlocked'], default: 'unlocked' },
  limit: { type: Number, default: null },
  unit: { type: String, default: null },
}, { _id: false });

const SubscriptionPlanSchema = new Schema({
  tier: {
    type: String,
    required: true,
    enum: ['free', 'growth', 'enterprise'],
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  monthlyPrice: {
    type: Number,
    default: 0,
  },
  annualPrice: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  features: [PlanFeatureSchema],
  quotas: {
    entities: { type: Number, default: 1 },
    workersPerEntity: { type: Number, default: 50 },
    assessmentsPerMonth: { type: Number, default: 5 },
    pdfReportsPerMonth: { type: Number, default: 2 },
    inspectorPacksPerYear: { type: Number, default: 0 },
    webhookEndpoints: { type: Number, default: 0 },
    customReportTemplates: { type: Number, default: 0 },
  },
  meta: {
    targetAudience: { type: String, default: '' },
    popularFor: { type: String, default: '' },
  }
}, {
  timestamps: true,
});

const SubscriptionPlan = models.SubscriptionPlan || model('SubscriptionPlan', SubscriptionPlanSchema);

export default SubscriptionPlan;
