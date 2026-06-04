"use client";

import React from "react";
import { Lock, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

interface LockedFeatureProps {
  featureId: string;
  name: string;
  description: string;
  children: React.ReactNode;
  isLocked: boolean;
}

export function LockedFeature({ featureId, name, description, children, isLocked }: LockedFeatureProps) {
  if (!isLocked) return <>{children}</>;

  return (
    <div className="relative group overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#111]/50 p-8">
      {/* Blurred Content Placeholder */}
      <div className="filter blur-md opacity-20 pointer-events-none select-none">
        {children}
      </div>

      {/* Paywall Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[#0a0a0a]/40 backdrop-blur-[2px]">
        <div className="w-12 h-12 bg-[#1a1a1a] border border-[#C9A24A]/30 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
          <Lock className="w-5 h-5 text-[#C9A24A]" />
        </div>
        
        <h3 className="text-xl font-bold tracking-tight text-[#e5e5e5] mb-2">{name}</h3>
        <p className="text-xs text-[#737373] max-w-[280px] leading-relaxed mb-8">
          {description || "This feature is gated behind a higher entitlement tier. Upgrade to unlock the full potential of your compliance architecture."}
        </p>

        <Link 
          href="/user/billing"
          className="flex items-center gap-3 bg-[#C9A24A] hover:bg-[#8A7338] text-black px-8 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all active:scale-[0.98]"
        >
          <Zap className="w-3.5 h-3.5" />
          View Upgrade Options
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        
        <p className="mt-4 text-[9px] font-bold uppercase tracking-widest text-[#525252]">
          Ref: Doc 16 §11 · Soft Gate Pattern
        </p>
      </div>
    </div>
  );
}
