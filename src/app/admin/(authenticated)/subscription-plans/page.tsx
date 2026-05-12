"use client";

import React, { useState, useEffect } from "react";
import { 
  Package, 
  Plus, 
  Check, 
  X, 
  Loader2,
  Crown,
  Zap,
  Shield,
  Lock,
  Unlock,
  AlertCircle
} from "lucide-react";

interface IFeature {
  featureId: string;
  name: string;
  description: string;
  gated: 'soft' | 'hard' | 'unlocked';
  limit: number | null;
  unit: string | null;
}

interface IQuotas {
  entities: number;
  workersPerEntity: number;
  assessmentsPerMonth: number;
  pdfReportsPerMonth: number;
  inspectorPacksPerYear: number;
  webhookEndpoints: number;
  customReportTemplates: number;
}

interface IPlan {
  _id: string;
  tier: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  currency: string;
  isActive: boolean;
  isFeatured: boolean;
  features: IFeature[];
  quotas: IQuotas;
  meta: {
    targetAudience: string;
    popularFor: string;
  };
}

const tierIcons: Record<string, React.ReactNode> = {
  free: <Shield className="w-5 h-5" />,
  growth: <Zap className="w-5 h-5" />,
  enterprise: <Crown className="w-5 h-5" />,
};

const tierColors: Record<string, string> = {
  free: 'from-gray-500/10 to-gray-600/5 border-gray-600/20',
  growth: 'from-[#d4af37]/10 to-[#d4af37]/5 border-[#d4af37]/30',
  enterprise: 'from-purple-500/10 to-purple-600/5 border-purple-500/30',
};

const tierAccent: Record<string, string> = {
  free: 'text-gray-400',
  growth: 'text-[#d4af37]',
  enterprise: 'text-purple-400',
};

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/subscription-plans");
      const data = await res.json();
      if (Array.isArray(data)) setPlans(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/admin/subscription-plans/seed");
      const data = await res.json();
      if (data.plans) {
        setPlans(data.plans);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSeeding(false);
    }
  };

  const formatPrice = (price: number, currency: string = 'INR') => {
    if (price === 0) return 'Free';
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency,
      maximumFractionDigits: 0 
    }).format(price);
  };

  const renderGatedBadge = (gated: string) => {
    if (gated === 'unlocked') {
      return <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-green-500"><Check className="w-3 h-3" /> Unlocked</span>;
    }
    if (gated === 'soft') {
      return <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-[#d4af37]"><Lock className="w-3 h-3" /> Soft Gate</span>;
    }
    return <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-red-400"><AlertCircle className="w-3 h-3" /> Hard Cap</span>;
  };

  const renderQuota = (value: number) => {
    if (value >= 999) return <span className="text-[#e5e5e5] font-bold">Unlimited</span>;
    if (value === 0) return <span className="text-[#525252]">—</span>;
    return <span className="text-[#e5e5e5] font-bold">{value}</span>;
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#e5e5e5]">Subscription Plans</h1>
          <p className="text-[#737373] mt-2 font-medium">Configure plan tiers, features, and usage quotas.</p>
        </div>
        <button 
          onClick={handleSeed}
          disabled={seeding}
          className="flex items-center justify-center gap-3 bg-[#1a1a1a] border border-[#d4af37]/20 hover:border-[#d4af37]/50 text-[#d4af37] px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Seed Default Plans
        </button>
      </div>

      {loading ? (
        <div className="p-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" />
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-[#0a0a0a] rounded-2xl border border-[#2a2a2a] p-20 text-center">
          <Package className="w-12 h-12 text-[#404040] mx-auto mb-4" />
          <p className="text-[#525252] font-medium">No plans configured. Click "Seed Default Plans" to populate.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan._id} className={`bg-gradient-to-br ${tierColors[plan.tier]} border rounded-2xl p-8 flex flex-col relative overflow-hidden group hover:scale-[1.02] transition-all`}>
              {plan.isFeatured && (
                <div className="absolute top-4 right-4 bg-[#d4af37]/20 text-[#d4af37] text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[#d4af37]/30">
                  Popular
                </div>
              )}

              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2.5 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] ${tierAccent[plan.tier]}`}>
                  {tierIcons[plan.tier]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#e5e5e5]">{plan.name}</h3>
                  <p className="text-[10px] text-[#737373] uppercase tracking-widest">{plan.tier}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#e5e5e5] tracking-tight">
                    {formatPrice(plan.monthlyPrice)}
                  </span>
                  {plan.monthlyPrice > 0 && (
                    <span className="text-[10px] text-[#525252] font-bold uppercase tracking-widest">/mo</span>
                  )}
                </div>
                <p className="text-[10px] text-[#737373] mt-1 font-mono">
                  {plan.annualPrice > 0 ? `${formatPrice(plan.annualPrice)}/year` : 'No annual pricing'}
                </p>
              </div>

              <p className="text-[11px] text-[#a3a3a3] leading-relaxed mb-6">{plan.description}</p>

              <div className="text-[9px] text-[#525252] uppercase tracking-widest mb-4 font-bold">Quotas</div>
              <div className="grid grid-cols-2 gap-3 mb-8">
                <QuotaItem label="Entities" value={renderQuota(plan.quotas.entities)} />
                <QuotaItem label="Workers/Entity" value={renderQuota(plan.quotas.workersPerEntity)} />
                <QuotaItem label="Assessments/mo" value={renderQuota(plan.quotas.assessmentsPerMonth)} />
                <QuotaItem label="PDF Reports/mo" value={renderQuota(plan.quotas.pdfReportsPerMonth)} />
                <QuotaItem label="Inspector Packs/yr" value={renderQuota(plan.quotas.inspectorPacksPerYear)} />
                <QuotaItem label="Webhooks" value={renderQuota(plan.quotas.webhookEndpoints)} />
              </div>

              <div className="text-[9px] text-[#525252] uppercase tracking-widest mb-4 font-bold">Features</div>
              <div className="flex-1 space-y-2.5 overflow-y-auto max-h-48">
                {plan.features.map((feature) => (
                  <div key={feature.featureId} className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-[#e5e5e5] truncate">{feature.name}</p>
                      <p className="text-[9px] text-[#525252] truncate mt-0.5">{feature.description}</p>
                    </div>
                    {renderGatedBadge(feature.gated)}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-[#2a2a2a]">
                <p className="text-[9px] text-[#525252] font-bold uppercase tracking-widest">Target Audience</p>
                <p className="text-[11px] text-[#a3a3a3] mt-1">{plan.meta.targetAudience}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Feature Legend */}
      <div className="bg-[#0a0a0a] rounded-2xl border border-[#2a2a2a] p-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#a3a3a3] mb-4">Gate Type Reference</h3>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-[11px] text-[#737373]"><span className="font-bold text-[#e5e5e5]">Unlocked</span> — Available on this tier</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#d4af37]" />
            <span className="text-[11px] text-[#737373]"><span className="font-bold text-[#e5e5e5]">Soft Gate</span> — Visible but locked UX</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-[11px] text-[#737373]"><span className="font-bold text-[#e5e5e5]">Hard Cap</span> — Quota-limited on this tier</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuotaItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-[#111]/50 border border-[#2a2a2a] rounded-lg px-3 py-2">
      <p className="text-[9px] text-[#525252] uppercase tracking-widest font-bold">{label}</p>
      <div className="mt-1">{value}</div>
    </div>
  );
}
