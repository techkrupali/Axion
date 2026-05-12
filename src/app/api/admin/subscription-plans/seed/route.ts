import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SubscriptionPlan from "@/models/SubscriptionPlan";
import { auth } from "@/auth";

const defaultPlans = [
  {
    tier: 'free',
    name: 'Free',
    description: 'Core compliance intelligence for individuals and small teams. The diagnosis is always free.',
    monthlyPrice: 0,
    annualPrice: 0,
    currency: 'INR',
    isActive: true,
    isFeatured: false,
    meta: {
      targetAudience: 'Individuals & Small Teams',
      popularFor: 'Getting started with compliance',
    },
    features: [
      { featureId: 'six_agent_assessment', name: 'Six-Agent Assessment', description: 'Full compliance diagnosis across all 6 agents', gated: 'unlocked', limit: null, unit: null },
      { featureId: 'stuck_protocol', name: 'STUCK Protocol', description: 'Automated compliance stuck resolution', gated: 'unlocked', limit: null, unit: null },
      { featureId: 'posture_dashboard', name: 'Posture Dashboard', description: 'Real-time compliance posture visualization', gated: 'unlocked', limit: null, unit: null },
      { featureId: 'communication_templates', name: 'Communication Templates', description: 'Library of compliance communication templates', gated: 'soft', limit: null, unit: null },
      { featureId: 'wage_analysis', name: 'Grade-wise Wage Analysis', description: 'Detailed wage structure analysis', gated: 'soft', limit: null, unit: null },
      { featureId: 'ctc_builder', name: 'CTC Structure Builder', description: 'Cost-to-Company structure builder', gated: 'soft', limit: null, unit: null },
      { featureId: 'teo_export', name: 'TEO Export', description: 'Export reports in TEO format', gated: 'soft', limit: null, unit: null },
      { featureId: 'multi_entity', name: 'Multi-Entity Management', description: 'Manage multiple organizational entities', gated: 'soft', limit: null, unit: null },
      { featureId: 'realtime_amendments', name: 'Real-time Amendment Alerts', description: 'Instant notifications for law updates', gated: 'soft', limit: null, unit: null },
      { featureId: 'webhook_endpoints', name: 'Webhook Endpoints', description: 'Custom webhook integrations', gated: 'hard', limit: 0, unit: 'endpoints' },
      { featureId: 'custom_reports', name: 'Custom Report Templates', description: 'White-label report customization', gated: 'hard', limit: 0, unit: 'templates' },
    ],
    quotas: {
      entities: 1,
      workersPerEntity: 50,
      assessmentsPerMonth: 5,
      pdfReportsPerMonth: 2,
      inspectorPacksPerYear: 0,
      webhookEndpoints: 0,
      customReportTemplates: 0,
    },
  },
  {
    tier: 'growth',
    name: 'Growth',
    description: 'For growing organizations that need advanced compliance tools and team collaboration.',
    monthlyPrice: 24999,
    annualPrice: 224991,
    currency: 'INR',
    isActive: true,
    isFeatured: true,
    meta: {
      targetAudience: 'Growing Organizations',
      popularFor: 'Team collaboration & advanced analytics',
    },
    features: [
      { featureId: 'six_agent_assessment', name: 'Six-Agent Assessment', description: 'Full compliance diagnosis across all 6 agents', gated: 'unlocked', limit: null, unit: null },
      { featureId: 'stuck_protocol', name: 'STUCK Protocol', description: 'Automated compliance stuck resolution', gated: 'unlocked', limit: null, unit: null },
      { featureId: 'posture_dashboard', name: 'Posture Dashboard', description: 'Real-time compliance posture visualization', gated: 'unlocked', limit: null, unit: null },
      { featureId: 'communication_templates', name: 'Communication Templates', description: 'Full library of compliance templates', gated: 'unlocked', limit: null, unit: null },
      { featureId: 'wage_analysis', name: 'Grade-wise Wage Analysis', description: 'Detailed wage structure analysis', gated: 'unlocked', limit: null, unit: null },
      { featureId: 'ctc_builder', name: 'CTC Structure Builder', description: 'Full CTC builder with projections', gated: 'unlocked', limit: null, unit: null },
      { featureId: 'teo_export', name: 'TEO Export', description: 'Advanced TEO export capabilities', gated: 'unlocked', limit: null, unit: null },
      { featureId: 'multi_entity', name: 'Multi-Entity Management', description: 'Up to 5 entities', gated: 'unlocked', limit: 5, unit: 'entities' },
      { featureId: 'realtime_amendments', name: 'Real-time Amendment Alerts', description: 'Priority alerts for law updates', gated: 'unlocked', limit: null, unit: null },
      { featureId: 'webhook_endpoints', name: 'Webhook Endpoints', description: 'Custom webhook integrations', gated: 'hard', limit: 3, unit: 'endpoints' },
      { featureId: 'custom_reports', name: 'Custom Report Templates', description: 'White-label report customization', gated: 'hard', limit: 5, unit: 'templates' },
      { featureId: 'inspector_packs', name: 'Inspector Packs', description: 'Annual compliance inspector packs', gated: 'unlocked', limit: 2, unit: 'packs/year' },
    ],
    quotas: {
      entities: 5,
      workersPerEntity: 200,
      assessmentsPerMonth: 50,
      pdfReportsPerMonth: 20,
      inspectorPacksPerYear: 2,
      webhookEndpoints: 3,
      customReportTemplates: 5,
    },
  },
  {
    tier: 'enterprise',
    name: 'Enterprise',
    description: 'Full-scale compliance infrastructure with dedicated support and custom integrations.',
    monthlyPrice: 249000,
    annualPrice: 2241000,
    currency: 'INR',
    isActive: true,
    isFeatured: false,
    meta: {
      targetAudience: 'Large Enterprises',
      popularFor: 'Full compliance suite with dedicated SLA',
    },
    features: [
      { featureId: 'six_agent_assessment', name: 'Six-Agent Assessment', description: 'Full compliance diagnosis across all 6 agents', gated: 'unlocked', limit: null, unit: null },
      { featureId: 'stuck_protocol', name: 'STUCK Protocol', description: 'Automated compliance stuck resolution', gated: 'unlocked', limit: null, unit: null },
      { featureId: 'posture_dashboard', name: 'Posture Dashboard', description: 'Real-time compliance posture visualization', gated: 'unlocked', limit: null, unit: null },
      { featureId: 'communication_templates', name: 'Communication Templates', description: 'Full library + custom template creation', gated: 'unlocked', limit: null, unit: null },
      { featureId: 'wage_analysis', name: 'Grade-wise Wage Analysis', description: 'Advanced wage analysis with projections', gated: 'unlocked', limit: null, unit: null },
      { featureId: 'ctc_builder', name: 'CTC Structure Builder', description: 'Full CTC builder with AI projections', gated: 'unlocked', limit: null, unit: null },
      { featureId: 'teo_export', name: 'TEO Export', description: 'Unlimited TEO exports', gated: 'unlocked', limit: null, unit: null },
      { featureId: 'multi_entity', name: 'Multi-Entity Management', description: 'Unlimited entities', gated: 'unlocked', limit: null, unit: 'unlimited' },
      { featureId: 'realtime_amendments', name: 'Real-time Amendment Alerts', description: 'Dedicated compliance officer alerts', gated: 'unlocked', limit: null, unit: null },
      { featureId: 'webhook_endpoints', name: 'Webhook Endpoints', description: 'Unlimited webhook endpoints', gated: 'unlocked', limit: null, unit: 'unlimited' },
      { featureId: 'custom_reports', name: 'Custom Report Templates', description: 'Unlimited white-label templates', gated: 'unlocked', limit: null, unit: 'unlimited' },
      { featureId: 'inspector_packs', name: 'Inspector Packs', description: 'Unlimited annual packs', gated: 'unlocked', limit: null, unit: 'unlimited' },
      { featureId: 'white_label', name: 'White-Label Solution', description: 'Full white-label deployment', gated: 'unlocked', limit: null, unit: null },
      { featureId: 'dedicated_support', name: 'Dedicated Support', description: '24/7 dedicated compliance officer', gated: 'unlocked', limit: null, unit: null },
      { featureId: 'sla_guarantee', name: 'SLA Guarantee', description: 'Contractual SLA commitments', gated: 'unlocked', limit: null, unit: null },
    ],
    quotas: {
      entities: 999,
      workersPerEntity: 9999,
      assessmentsPerMonth: 999,
      pdfReportsPerMonth: 999,
      inspectorPacksPerYear: 999,
      webhookEndpoints: 999,
      customReportTemplates: 999,
    },
  },
];

export const GET = auth(async (req) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await dbConnect();

    for (const planData of defaultPlans) {
      await SubscriptionPlan.findOneAndUpdate(
        { tier: planData.tier },
        planData,
        { upsert: true, new: true }
      );
    }

    const plans = await SubscriptionPlan.find({}).sort({ monthlyPrice: 1 });
    return NextResponse.json({ message: "Plans seeded successfully", plans });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
});
