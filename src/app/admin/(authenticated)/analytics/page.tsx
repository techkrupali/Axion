"use client";

import React, { useEffect, useState } from "react";
import { Users, CreditCard, Activity, Loader2 } from "lucide-react";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<{ totalUsers: number; activeSubscribers: number; totalSubscribers: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => setStats(d))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#e5e5e5]">Analytics</h1>
        <p className="text-[#737373] mt-2 font-medium">System telemetry and user engagement.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Users" value={stats?.totalUsers ?? 0} icon={<Users className="w-5 h-5 text-[#d4af37]" />} />
          <StatCard title="Active Subscribers" value={stats?.activeSubscribers ?? 0} icon={<Activity className="w-5 h-5 text-green-500" />} />
          <StatCard title="Total Subscribers" value={stats?.totalSubscribers ?? 0} icon={<CreditCard className="w-5 h-5 text-[#a3a3a3]" />} />
        </div>
      )}

      <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl p-12 flex items-center justify-center min-h-[300px]">
        <div className="text-center space-y-3">
          <Activity className="w-10 h-10 text-[#2a2a2a] mx-auto" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#525252]">
            Advanced analytics coming soon
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl p-6 hover:border-[#d4af37]/20 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[#737373] text-[10px] font-bold uppercase tracking-[0.2em]">{title}</span>
        {icon}
      </div>
      <h4 className="text-2xl font-bold text-[#e5e5e5] tracking-tight">{value.toLocaleString()}</h4>
    </div>
  );
}
