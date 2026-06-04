"use client";

import React, { useState, useEffect } from "react";
import { 
  Check, 
  Shield, 
  Zap, 
  Crown, 
  Loader2, 
  ArrowRight,
  Info
} from "lucide-react";
import Script from "next/script";

interface IPlan {
  _id: string;
  tier: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  currency: string;
  isFeatured: boolean;
  features: {
    name: string;
    gated: string;
  }[];
  quotas: {
    entities: number;
    assessmentsPerMonth: number;
  };
}

export function SubscriptionPlans({ onComplete }: { onComplete: () => void }) {
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
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

  const handleSubscribe = async (plan: IPlan) => {
    if (plan.monthlyPrice === 0) {
      // Handle free plan activation
      try {
        setProcessing(plan._id);
        const res = await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: "free_" + Date.now(),
            razorpay_payment_id: "free_" + Date.now(),
            razorpay_signature: "free", // Logic in verify route should handle this or I should bypass for free
            planId: plan._id,
            billingCycle
          }),
        });
        if (res.ok) onComplete();
      } catch (err) {
        console.error(err);
      } finally {
        setProcessing(null);
      }
      return;
    }

    try {
      setProcessing(plan._id);
      const amount = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
      
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      
      const order = await orderRes.json();

      const options = {
        key: "rzp_test_RlUAkt1HzIvV4j",
        amount: order.amount,
        currency: order.currency,
        name: "Axion Index",
        description: `${plan.name} Plan (${billingCycle})`,
        order_id: order.id,
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              planId: plan._id,
              billingCycle
            }),
          });
          
          if (verifyRes.ok) {
            onComplete();
          }
        },
        prefill: {
          name: "",
          email: "",
        },
        theme: {
          color: "#C9A24A",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#C9A24A]" />
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#737373]">Loading Architecture...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Select Your Plan</h2>
        <p className="text-[#737373] max-w-lg mx-auto">Choose the entitlement tier that matches your organization's engineering needs.</p>
        
        <div className="flex items-center justify-center gap-4 mt-8">
          <span className={`text-[10px] font-bold uppercase tracking-widest ${billingCycle === 'monthly' ? 'text-[#e5e5e5]' : 'text-[#525252]'}`}>Monthly</span>
          <button 
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            className="w-12 h-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full p-1 transition-all relative"
          >
            <div className={`w-4 h-4 bg-[#C9A24A] rounded-full transition-all ${billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${billingCycle === 'annual' ? 'text-[#e5e5e5]' : 'text-[#525252]'}`}>
            Annual <span className="text-[#C9A24A] ml-1">(10% OFF)</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan._id}
            className={`relative group bg-[#111] border rounded-3xl p-8 transition-all hover:scale-[1.02] ${
              plan.isFeatured ? 'border-[#C9A24A]/50' : 'border-[rgba(240,241,245,0.1)] hover:border-[rgba(240,241,245,0.2)]'
            }`}
          >
            {plan.isFeatured && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#C9A24A] text-[#0A0A0B] text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                Recommended
              </div>
            )}

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl bg-[#1a1a1a] border ${
                  plan.tier === 'free' ? 'border-gray-800' : 
                  plan.tier === 'growth' ? 'border-[#C9A24A]/20' : 'border-purple-900/30'
                }`}>
                  {plan.tier === 'free' ? <Shield className="w-5 h-5 text-gray-500" /> : 
                   plan.tier === 'growth' ? <Zap className="w-5 h-5 text-[#C9A24A]" /> : <Crown className="w-5 h-5 text-purple-400" />}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#525252]">{plan.tier}</span>
              </div>

              <div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-xs text-[#737373] mt-2 leading-relaxed">{plan.description}</p>
              </div>

              <div className="pt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  {new Intl.NumberFormat('en-IN', { 
                    style: 'currency', 
                    currency: plan.currency,
                    maximumFractionDigits: 0 
                  }).format(billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice)}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#525252]">
                  / {billingCycle === 'annual' ? 'year' : 'month'}
                </span>
              </div>

              <button 
                onClick={() => handleSubscribe(plan)}
                disabled={!!processing}
                className={`w-full py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                  plan.isFeatured 
                    ? 'bg-[#C9A24A] hover:bg-[#8A7338] text-[#0A0A0B]' 
                    : 'bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#404040] text-[#e5e5e5]'
                }`}
              >
                {processing === plan._id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {plan.monthlyPrice === 0 ? 'Activate Now' : 'Upgrade Now'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="space-y-4 pt-6 border-t border-[#2a2a2a]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#525252]">Includes:</p>
                <div className="space-y-3">
                  {plan.features.slice(0, 6).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`mt-0.5 ${feature.gated === 'unlocked' ? 'text-[#C9A24A]' : 'text-[#525252]'}`}>
                        {feature.gated === 'unlocked' ? <Check className="w-3.5 h-3.5" /> : <Info className="w-3.5 h-3.5" />}
                      </div>
                      <span className={`text-[11px] ${feature.gated === 'unlocked' ? 'text-[#a3a3a3]' : 'text-[#525252]'}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
