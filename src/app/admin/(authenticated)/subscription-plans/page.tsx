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
  AlertCircle,
  Edit2,
  Trash2,
  Save,
  Trash,
  PlusCircle
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
  _id?: string;
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

const defaultNewPlan: IPlan = {
  tier: 'free',
  name: '',
  description: '',
  monthlyPrice: 0,
  annualPrice: 0,
  currency: 'INR',
  isActive: true,
  isFeatured: false,
  features: [
    { featureId: 'six_agent_assessment', name: 'Six-Agent Assessment', description: '', gated: 'unlocked', limit: null, unit: null },
    { featureId: 'stuck_protocol', name: 'STUCK Protocol', description: '', gated: 'unlocked', limit: null, unit: null },
    { featureId: 'posture_dashboard', name: 'Posture Dashboard', description: '', gated: 'unlocked', limit: null, unit: null },
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
  meta: {
    targetAudience: '',
    popularFor: '',
  }
};

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<IPlan | null>(null);
  const [formData, setFormData] = useState<IPlan>(defaultNewPlan);

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
    if (!confirm("This will reset all plans to their default values. Continue?")) return;
    setSeeding(true);
    try {
      const res = await fetch("/api/admin/subscription-plans/seed");
      const data = await res.json();
      if (data.plans) setPlans(data.plans);
    } catch (err) {
      console.error(err);
    } finally {
      setSeeding(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingPlan?._id;
    const url = isEdit 
      ? `/api/admin/subscription-plans/${editingPlan?._id}` 
      : "/api/admin/subscription-plans";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchPlans();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    try {
      const res = await fetch(`/api/admin/subscription-plans/${id}`, { method: "DELETE" });
      if (res.ok) fetchPlans();
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (plan: IPlan) => {
    setEditingPlan(plan);
    setFormData(plan);
    setIsModalOpen(true);
  };

  const openCreate = () => {
    setEditingPlan(null);
    setFormData(defaultNewPlan);
    setIsModalOpen(true);
  };

  const addFeature = () => {
    const newFeature: IFeature = { 
      featureId: `feature_${Date.now()}`, 
      name: '', 
      description: '', 
      gated: 'unlocked', 
      limit: null, 
      unit: null 
    };
    setFormData({
      ...formData,
      features: [...formData.features, newFeature]
    });
  };

  const removeFeature = (index: number) => {
    const newFeatures = [...formData.features];
    newFeatures.splice(index, 1);
    setFormData({ ...formData, features: newFeatures });
  };

  const updateFeature = (index: number, field: keyof IFeature, value: any) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFormData({ ...formData, features: newFeatures });
  };

  const formatPrice = (price: number, currency: string = 'INR') => {
    if (price === 0) return 'Free';
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency,
      maximumFractionDigits: 0 
    }).format(price);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#e5e5e5]">Subscription Plans</h1>
          <p className="text-[#737373] mt-2 font-medium">Configure plan tiers, features, and usage quotas.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center justify-center gap-3 bg-[#111] border border-[#2a2a2a] hover:border-[#d4af37]/30 text-[#a3a3a3] hover:text-[#e5e5e5] px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all"
          >
            {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
            Reset to Default
          </button>
          <button 
            onClick={openCreate}
            className="flex items-center justify-center gap-3 bg-[#1a1a1a] border border-[#d4af37]/20 hover:border-[#d4af37]/50 text-[#d4af37] px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Create Plan
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan._id} className={`bg-gradient-to-br ${tierColors[plan.tier] || tierColors.free} border rounded-2xl p-8 flex flex-col relative overflow-hidden group hover:border-[#d4af37]/40 transition-all`}>
              <div className="absolute top-4 right-4 flex gap-2">
                <button 
                  onClick={() => openEdit(plan)}
                  className="p-2 bg-[#111] border border-[#2a2a2a] rounded-lg text-[#525252] hover:text-[#d4af37] transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(plan._id!)}
                  className="p-2 bg-[#111] border border-[#2a2a2a] rounded-lg text-[#525252] hover:text-red-500 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2.5 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] ${tierAccent[plan.tier] || tierAccent.free}`}>
                  {tierIcons[plan.tier] || <Shield className="w-5 h-5" />}
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

              <p className="text-[11px] text-[#a3a3a3] leading-relaxed mb-6 h-12 overflow-hidden">{plan.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <QuotaDisplay label="Entities" value={plan.quotas.entities} />
                <QuotaDisplay label="Workers" value={plan.quotas.workersPerEntity} />
              </div>

              <div className="flex-1 space-y-3 mb-8 overflow-y-auto max-h-48 custom-scrollbar pr-2">
                {plan.features.map((feature) => (
                  <div key={feature.featureId} className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-[#e5e5e5] truncate">{feature.name}</span>
                    {feature.gated === 'unlocked' ? <Check className="w-3 h-3 text-green-500" /> : <Lock className="w-3 h-3 text-[#d4af37]" />}
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-[#2a2a2a]">
                <p className="text-[9px] text-[#525252] font-bold uppercase tracking-widest">Audience</p>
                <p className="text-[11px] text-[#a3a3a3] mt-1 truncate">{plan.meta.targetAudience}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-[#0a0a0a] border border-[#2a2a2a] w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col">
            <div className="p-8 border-b border-[#2a2a2a] flex items-center justify-between bg-[#111]/30">
              <div>
                <h3 className="text-xl font-bold text-[#e5e5e5]">
                  {editingPlan ? `Edit ${editingPlan.name}` : "Create New Plan"}
                </h3>
                <p className="text-xs text-[#525252] mt-1 uppercase tracking-widest font-bold">Plan Configuration Terminal</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[#1a1a1a] rounded-xl text-[#525252] hover:text-[#e5e5e5] transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#525252] px-1">Plan Name</label>
                    <input 
                      type="text" required value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-5 py-4 text-sm text-[#e5e5e5] focus:outline-none focus:ring-1 focus:ring-[#d4af37]/30 transition-all" 
                      placeholder="e.g., Growth Tier"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#525252] px-1">Internal Tier ID</label>
                    <input 
                      type="text" required value={formData.tier}
                      onChange={(e) => setFormData({ ...formData, tier: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                      className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-5 py-4 text-sm text-[#a3a3a3] font-mono focus:outline-none focus:ring-1 focus:ring-[#d4af37]/30 transition-all" 
                      placeholder="e.g., starter_pack"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#525252] px-1">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-5 py-4 text-sm text-[#e5e5e5] h-[132px] focus:outline-none focus:ring-1 focus:ring-[#d4af37]/30 transition-all resize-none"
                    placeholder="Describe the value proposition of this tier..."
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-[#111]/20 border border-[#2a2a2a] rounded-2xl">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#525252] px-1">Monthly Price (INR)</label>
                  <input 
                    type="number" value={formData.monthlyPrice}
                    onChange={(e) => setFormData({ ...formData, monthlyPrice: Number(e.target.value) })}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-5 py-4 text-sm font-mono text-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37]/30" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#525252] px-1">Annual Price (INR)</label>
                  <input 
                    type="number" value={formData.annualPrice}
                    onChange={(e) => setFormData({ ...formData, annualPrice: Number(e.target.value) })}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-5 py-4 text-sm font-mono text-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37]/30" 
                  />
                </div>
                <div className="flex items-center gap-6 pt-6">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-5 h-5 accent-[#d4af37]"
                    />
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3]">Feature Plan</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-5 h-5 accent-[#d4af37]"
                    />
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3]">Active</label>
                  </div>
                </div>
              </div>

              {/* Quotas */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37] mb-6 flex items-center gap-3">
                  <Package className="w-4 h-4" /> Hard Caps & Quotas
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {Object.keys(formData.quotas).map((q) => (
                    <div key={q} className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-[#525252] px-1">{q.replace(/([A-Z])/g, ' $1')}</label>
                      <input 
                        type="number" value={(formData.quotas as any)[q]}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          quotas: { ...formData.quotas, [q]: Number(e.target.value) } 
                        })}
                        className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-xs font-mono text-[#e5e5e5] focus:outline-none focus:ring-1 focus:ring-[#d4af37]/30" 
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Features Management */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37] flex items-center gap-3">
                    <Unlock className="w-4 h-4" /> Feature Matrix
                  </h4>
                  <button 
                    type="button" onClick={addFeature}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] hover:text-[#d4af37] transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" /> Add Feature
                  </button>
                </div>
                
                <div className="space-y-4">
                  {formData.features.map((feature, idx) => (
                    <div key={idx} className="p-6 bg-[#111]/30 border border-[#2a2a2a] rounded-2xl relative group/feature">
                      <button 
                        type="button" onClick={() => removeFeature(idx)}
                        className="absolute -top-2 -right-2 p-1.5 bg-[#0a0a0a] border border-red-500/20 rounded-lg text-red-500 opacity-0 group-hover/feature:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-[8px] font-bold uppercase tracking-widest text-[#525252]">Feature Name</label>
                          <input 
                            type="text" value={feature.name}
                            onChange={(e) => updateFeature(idx, 'name', e.target.value)}
                            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-xs text-[#e5e5e5] focus:ring-1 focus:ring-[#d4af37]/30 outline-none"
                            placeholder="e.g., Priority Support"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[8px] font-bold uppercase tracking-widest text-[#525252]">Gate Type</label>
                          <select 
                            value={feature.gated}
                            onChange={(e) => updateFeature(idx, 'gated', e.target.value)}
                            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] outline-none"
                          >
                            <option value="unlocked">Unlocked</option>
                            <option value="soft">Soft Gate</option>
                            <option value="hard">Hard Cap</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[8px] font-bold uppercase tracking-widest text-[#525252]">Internal ID</label>
                          <input 
                            type="text" value={feature.featureId}
                            onChange={(e) => updateFeature(idx, 'featureId', e.target.value)}
                            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-xs font-mono text-[#737373] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#525252] px-1">Target Audience</label>
                  <input 
                    type="text" value={formData.meta.targetAudience}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      meta: { ...formData.meta, targetAudience: e.target.value } 
                    })}
                    className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-5 py-4 text-sm text-[#e5e5e5] focus:outline-none focus:ring-1 focus:ring-[#d4af37]/30" 
                    placeholder="Who is this plan for?"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#525252] px-1">Popular For</label>
                  <input 
                    type="text" value={formData.meta.popularFor}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      meta: { ...formData.meta, popularFor: e.target.value } 
                    })}
                    className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-5 py-4 text-sm text-[#e5e5e5] focus:outline-none focus:ring-1 focus:ring-[#d4af37]/30" 
                    placeholder="Key selling point..."
                  />
                </div>
              </div>
            </form>

            <div className="p-8 border-t border-[#2a2a2a] bg-[#111]/30 flex justify-end gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#525252] hover:text-[#e5e5e5] transition-colors"
              >
                Discard
              </button>
              <button 
                onClick={handleSubmit}
                className="flex items-center gap-3 bg-[#1a1a1a] border border-[#d4af37]/20 hover:border-[#d4af37]/50 text-[#d4af37] px-10 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all shadow-xl active:scale-[0.98]"
              >
                <Save className="w-4 h-4" />
                {editingPlan ? "Update Plan" : "Initialize Plan"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d4af3733; }
      `}</style>
    </div>
  );
}

function QuotaDisplay({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[#111]/50 border border-[#2a2a2a] rounded-xl px-4 py-3">
      <p className="text-[9px] text-[#525252] uppercase tracking-widest font-bold">{label}</p>
      <p className="text-sm font-bold text-[#e5e5e5] mt-1">{value >= 999 ? '∞' : value}</p>
    </div>
  );
}
