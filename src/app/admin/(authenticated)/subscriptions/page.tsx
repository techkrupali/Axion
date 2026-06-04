"use client";

import React, { useState, useEffect } from "react";
import { 
  CreditCard, 
  Plus, 
  Search, 
  MoreVertical, 
  Trash2, 
  Edit2, 
  X, 
  Check,
  Loader2,
  Filter
} from "lucide-react";

interface ISubscription {
  _id: string;
  email: string;
  status: string;
  plan: string;
  createdAt: string;
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<ISubscription | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({ email: "", plan: "free", status: "active" });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/subscriptions");
      const data = await res.json();
      if (Array.isArray(data)) setSubscriptions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingSub 
      ? `/api/admin/subscriptions/${editingSub._id}` 
      : "/api/admin/subscriptions";
    const method = editingSub ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setEditingSub(null);
        setFormData({ email: "", plan: "free", status: "active" });
        fetchSubscriptions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subscription?")) return;
    try {
      await fetch(`/api/admin/subscriptions/${id}`, { method: "DELETE" });
      fetchSubscriptions();
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (sub: ISubscription) => {
    setEditingSub(sub);
    setFormData({ email: sub.email, plan: sub.plan, status: sub.status });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-[10px] font-mono tracking-[0.35em] uppercase text-[#737373] mb-2">Admin · Subscriptions</p>
          <h1 className="text-[28px] font-bold leading-tight tracking-tight text-[#e5e5e5]">Subscriptions</h1>
          <p className="text-[15px] text-[#737373] mt-1.5 leading-[1.6]">Manage user billing cycles and service plans.</p>
        </div>
        <button 
          onClick={() => { setEditingSub(null); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-3 bg-[#1a1a1a] border border-[#C9A24A]/20 hover:border-[#C9A24A]/50 text-[#C9A24A] px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          New Subscription
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-[#0a0a0a] rounded-2xl border border-[#2a2a2a] overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-20 flex justify-center">
            <Loader2 className="w-8 h-8 text-[#C9A24A] animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#111]/50 border-b border-[#2a2a2a]">
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#525252]">Subscriber</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#525252]">Plan</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#525252]">Status</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#525252]">Created</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#525252] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {subscriptions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-[#1a1a1a]/40 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#C9A24A]">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-[#e5e5e5] text-sm">{sub.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#a3a3a3]">{sub.plan}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest ${
                        sub.status === "active" 
                          ? "bg-green-500/5 text-green-500 border border-green-500/10" 
                          : "bg-red-500/5 text-red-500 border border-red-500/10"
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-xs text-[#525252] font-mono">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEdit(sub)}
                          className="p-2 hover:bg-[#2a2a2a] rounded-lg text-[#525252] hover:text-[#C9A24A] transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(sub._id)}
                          className="p-2 hover:bg-red-500/5 rounded-lg text-[#525252] hover:text-red-500 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-[#2a2a2a] w-full max-w-lg rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-[#e5e5e5]">
                {editingSub ? "Edit Subscription" : "New Subscription"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#525252] hover:text-[#e5e5e5]">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#525252] px-1">Identity Email</label>
                <input 
                  type="email" 
                  required
                  disabled={!!editingSub}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-sm text-[#e5e5e5] focus:outline-none focus:ring-1 focus:ring-[#C9A24A]/30 transition-all disabled:opacity-50" 
                  placeholder="subscriber@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#525252] px-1">Service Plan</label>
                  <select 
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                    className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-xs font-bold uppercase tracking-widest text-[#a3a3a3] focus:outline-none focus:ring-1 focus:ring-[#C9A24A]/30"
                  >
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#525252] px-1">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-xs font-bold uppercase tracking-widest text-[#a3a3a3] focus:outline-none focus:ring-1 focus:ring-[#C9A24A]/30"
                  >
                    <option value="active">Active</option>
                    <option value="unsubscribed">Unsubscribed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 bg-[#1a1a1a] border border-[#C9A24A]/20 hover:border-[#C9A24A]/50 text-[#C9A24A] py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all shadow-lg"
                >
                  <Check className="w-4 h-4" />
                  {editingSub ? "Update Record" : "Create Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
