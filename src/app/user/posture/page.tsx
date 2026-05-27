"use client";

import React, { useState, useEffect } from "react";
import { Activity, ShieldCheck, AlertTriangle, Loader2 } from "lucide-react";

export default function PosturePage() {
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    fetch("/api/user/subscription")
      .then((r) => r.json())
      .then((d) => setIsSubscribed(d.isSubscribed))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" />
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#737373]">Reading Posture Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight">Posture Dashboard</h1>
        <p className="text-[#737373] font-medium">Real-time compliance visualization. The diagnosis is always unlocked.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#111] border border-[#2a2a2a] p-8 rounded-3xl group hover:border-[#d4af37]/30 transition-all">
          <Activity className="w-6 h-6 text-[#d4af37] mb-4" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#525252] mb-1">Account Status</p>
          <p className="text-2xl font-bold text-[#d4af37]">{isSubscribed ? "Active" : "Inactive"}</p>
        </div>
        <div className="bg-[#111] border border-[#2a2a2a] p-8 rounded-3xl group hover:border-[#d4af37]/30 transition-all">
          <ShieldCheck className="w-6 h-6 text-green-500 mb-4" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#525252] mb-1">Assessments Run</p>
          <p className="text-2xl font-bold text-green-500">0</p>
        </div>
        <div className="bg-[#111] border border-[#2a2a2a] p-8 rounded-3xl group hover:border-[#d4af37]/30 transition-all">
          <AlertTriangle className="w-6 h-6 text-amber-500 mb-4" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#525252] mb-1">Pending Actions</p>
          <p className="text-2xl font-bold text-amber-500">0</p>
        </div>
      </div>

      <div className="bg-[#111] border border-[#2a2a2a] rounded-[40px] p-12 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Activity className="w-12 h-12 text-[#2a2a2a] mx-auto" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#525252]">
            Run your first assessment to see posture data
          </p>
        </div>
      </div>
    </div>
  );
}
