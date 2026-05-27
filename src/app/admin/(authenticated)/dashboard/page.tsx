"use client";

import React, { useEffect, useState } from "react";
import { Users, Activity, Database, ArrowUpRight, Loader2 } from "lucide-react";

export default function AdminDashboard() {
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
        <h1 className="text-3xl font-bold tracking-tight text-[#e5e5e5]">Dashboard</h1>
        <p className="text-[#737373] mt-2 font-medium">Welcome back. Here is your system overview.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers ?? 0}
            icon={<Users className="w-5 h-5 text-[#d4af37]" />}
          />
          <StatCard
            title="Active Subscribers"
            value={stats?.activeSubscribers ?? 0}
            icon={<Activity className="w-5 h-5 text-[#a3a3a3]" />}
          />
          <StatCard
            title="Total Subscribers"
            value={stats?.totalSubscribers ?? 0}
            icon={<Database className="w-5 h-5 text-[#a3a3a3]" />}
          />
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-[#2a2a2a] hover:border-[#d4af37]/30 transition-all group relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="p-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl group-hover:bg-[#d4af37]/5 group-hover:border-[#d4af37]/20 transition-colors">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#737373] mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-[#e5e5e5] tracking-tight">{value.toLocaleString()}</h4>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
}
