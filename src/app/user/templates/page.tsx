"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, FileText, Download, Loader2 } from "lucide-react";
import { LockedFeature } from "@/components/LockedFeature";

export default function TemplatesPage() {
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [tier, setTier] = useState("free");

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const res = await fetch("/api/user/subscription");
      const data = await res.json();
      setIsSubscribed(data.isSubscribed);
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
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#737373]">Authenticating Access...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight">Communication Templates</h1>
        <p className="text-[#737373] font-medium">Professional compliance response library. (Ref: Doc 16 §11)</p>
      </div>

      <LockedFeature 
        featureId="communication_templates"
        name="Communication Library"
        description="Never lock the diagnosis, always lock the prescription. Free users can see posture; paying users get the templates to fix it."
        isLocked={isLocked}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            "Employment Contract Clause - AI Use",
            "Disciplinary Notice Template",
            "Compliance Amendment Response",
            "Statutory Audit Checklist",
          ].map((template, idx) => (
            <div key={idx} className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-2xl flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <FileText className="w-5 h-5 text-[#C9A24A]" />
                <span className="text-sm font-medium">{template}</span>
              </div>
              <button className="p-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-[#525252] group-hover:text-[#C9A24A] transition-all">
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </LockedFeature>
    </div>
  );
}
