"use client";

import React, { useState, useEffect } from "react";
import { User, LogOut, LayoutDashboard, Settings, Bell, CreditCard, Loader2, ShieldAlert, Zap, ArrowRight } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

export function DashboardContent({ user }: { user: any }) {
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
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#737373]">Verifying Entitlements...</p>
      </div>
    );
  }

  const isSubscribed = subscription?.isSubscribed;
  const { subscriber } = subscription || {};

  return (
    <div className="space-y-12">
      {/* Unsubscribed Warning */}
      {!isSubscribed && (
        <div className="bg-[#111] border border-[#C9A24A]/20 p-8 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-[#C9A24A]/10 border border-[#C9A24A]/20 rounded-2xl flex items-center justify-center">
              <ShieldAlert className="w-7 h-7 text-[#C9A24A]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#e5e5e5]">Plan Activation Required</h3>
              <p className="text-xs text-[#737373] mt-1 max-w-md">
                Your account is currently in a pending state. Activate a plan to unlock full compliance management and assessments.
              </p>
            </div>
          </div>
          <Link 
            href="/user/billing"
            className="flex items-center gap-3 bg-[#C9A24A] hover:bg-[#8A7338] text-black px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all active:scale-[0.98] whitespace-nowrap"
          >
            <Zap className="w-4 h-4" />
            Select Plan
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">Dashboard</h1>
          <p className="text-[#737373] font-medium">
            Welcome back, {user?.name}. {isSubscribed ? `Your ${subscriber?.planTier} tier is active.` : "Please select a plan to begin."}
          </p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-[10px] font-bold uppercase tracking-widest hover:border-[#C9A24A]/30 transition-all">
            Edit Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-[#111] border border-[#2a2a2a] p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <LayoutDashboard className="w-12 h-12" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#737373] mb-4">Account Status</p>
          <h3 className="text-2xl font-bold text-[#e5e5e5] uppercase tracking-wider">
            {isSubscribed ? subscriber?.status : "Inactive"}
          </h3>
          <div className={`mt-4 h-1 w-12 ${isSubscribed ? "bg-[#C9A24A]" : "bg-[#2a2a2a]"}`}></div>
        </div>

        <div className="bg-[#111] border border-[#2a2a2a] p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <CreditCard className="w-12 h-12" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#737373] mb-4">Current Plan</p>
          <h3 className="text-2xl font-bold text-[#e5e5e5] uppercase tracking-wider">
            {isSubscribed ? subscriber?.planTier : "None"}
          </h3>
          <div className={`mt-4 h-1 w-12 ${isSubscribed ? "bg-[#C9A24A]" : "bg-[#2a2a2a]"}`}></div>
        </div>

        <div className="bg-[#111] border border-[#2a2a2a] p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Bell className="w-12 h-12" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#737373] mb-4">Renewal Date</p>
          <h3 className="text-2xl font-bold text-[#e5e5e5]">
            {isSubscribed && subscriber?.currentPeriodEnd ? new Date(subscriber.currentPeriodEnd).toLocaleDateString() : 'N/A'}
          </h3>
          <div className={`mt-4 h-1 w-12 ${isSubscribed ? "bg-[#C9A24A]" : "bg-[#2a2a2a]"}`}></div>
        </div>
      </div>

      {/* Quotas Section */}
      {isSubscribed && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriber?.usage?.map((quota: any, idx: number) => (
            <div key={idx} className="bg-[#111] border border-[#2a2a2a] p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">{quota.metric.replace('_', ' ')}</p>
                <p className="text-[10px] font-bold text-[#e5e5e5]">{quota.current} / {quota.limit}</p>
              </div>
              <div className="h-1.5 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#C9A24A] transition-all" 
                  style={{ width: `${Math.min((quota.current / quota.limit) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content Section */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight border-b border-[#2a2a2a] pb-4">Recent Activity</h2>
          <div className="bg-[#111] border border-[#2a2a2a] rounded-3xl p-8 flex items-center justify-center min-h-[200px]">
            <p className="text-[#525252] text-sm uppercase tracking-widest font-bold">No recent activity to show</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight border-b border-[#2a2a2a] pb-4">Account Settings</h2>
          <div className="space-y-4">
            {[
              { icon: <User className="w-4 h-4" />, label: "Profile Information", href: "/user/settings" },
              { icon: <Settings className="w-4 h-4" />, label: "Privacy & Security", href: "/user/settings" },
              { icon: <CreditCard className="w-4 h-4" />, label: "Billing & Subscription", href: "/user/billing" },
            ].map((item, idx) => (
              <Link key={idx} href={item.href} className="w-full flex items-center justify-between p-6 bg-[#111] border border-[#2a2a2a] rounded-2xl hover:bg-[#161616] hover:border-[#C9A24A]/20 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="text-[#737373] group-hover:text-[#C9A24A] transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                </div>
                <span className="text-[#404040] group-hover:text-[#C9A24A] transition-all transform group-hover:translate-x-1">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
