"use client";

import React, { useState, useEffect } from "react";
import { SubscriptionPlans } from "@/components/SubscriptionPlans";
import { Loader2, Zap } from "lucide-react";

export default function BillingPage() {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const res = await fetch("/api/user/subscription");
      const data = await res.json();
      setSubscription(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#C9A24A]" />
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#737373]">Loading Billing Architecture...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight">Plan & Billing</h1>
        <p className="text-[#737373] font-medium">Manage your organization's entitlement tier and payment history.</p>
      </div>

      {subscription?.isSubscribed && (
        <div className="bg-[#111] border border-[#C9A24A]/30 p-8 rounded-[32px] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-[#C9A24A]/10 border border-[#C9A24A]/30 rounded-2xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-[#C9A24A]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#C9A24A]">Active Subscription</p>
              <h3 className="text-xl font-bold text-[#e5e5e5] uppercase tracking-wider">{subscription.subscriber.planTier} Tier</h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#525252]">Next Renewal</p>
            <p className="text-sm font-bold text-[#a3a3a3]">
              {new Date(subscription.subscriber.currentPeriodEnd).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      <div className="pt-8">
        <SubscriptionPlans onComplete={fetchSubscription} />
      </div>
    </div>
  );
}
