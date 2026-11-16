"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, Download, Info, Loader2 } from "lucide-react";
import { LockedFeature } from "@/components/LockedFeature";

export default function WageAnalysisPage() {
  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState("free");

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const res = await fetch("/api/user/subscription");
      const data = await res.json();
      setTier(data.subscriber?.planTier || "free");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isLocked = tier === "free";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#C9A24A]" />
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#737373]">Analyzing Wage Architecture...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight">Grade-wise Wage Analysis</h1>
        <p className="text-[#737373] font-medium">Deep structural analysis of organizational wage distribution. (Ref: Doc 16 §11)</p>
      </div>

      <LockedFeature 
        featureId="wage_analysis"
        name="Wage Analytics Engine"
        description="Access advanced wage distribution modeling, grade-wise disparity checks, and statutory minimum wage compliance analysis."
        isLocked={isLocked}
      >
        <div className="bg-[#111] border border-[#2a2a2a] rounded-[40px] p-12">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-xl font-bold">Analysis Workspace</h3>
            <button className="flex items-center gap-3 bg-[#1a1a1a] border border-[#2a2a2a] px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3]">
              <Download className="w-4 h-4" /> Export Report
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="h-64 bg-[#0a0a0a] border border-[#2a2a2a] rounded-[32px] flex items-center justify-center">
              <BarChart3 className="w-12 h-12 text-[#2a2a2a]" />
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl flex items-center px-8">
                  <div className="w-24 h-2 bg-[#2a2a2a] rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </LockedFeature>
    </div>
  );
}
