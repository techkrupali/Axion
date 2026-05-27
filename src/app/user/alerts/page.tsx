"use client";

import React, { useState, useEffect } from "react";
import { Bell, Loader2 } from "lucide-react";
import { LockedFeature } from "@/components/LockedFeature";

export default function AlertsPage() {
  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState("free");

  useEffect(() => {
    fetch("/api/user/subscription")
      .then((r) => r.json())
      .then((d) => setTier(d.subscriber?.planTier || "free"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" />
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#737373]">Listening for Amendments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight">Real-time Amendment Alerts</h1>
        <p className="text-[#737373] font-medium">Instant notifications for statutory law changes and compliance updates.</p>
      </div>

      <LockedFeature
        featureId="realtime_amendments"
        name="Amendment Intel Stream"
        description="Receive priority alerts the moment statutory changes are gazetted. Our agents monitor amendments across all 28 states and 8 union territories."
        isLocked={tier === "free"}
      >
        <div className="bg-[#111] border border-[#2a2a2a] rounded-[40px] p-12 flex items-center justify-center min-h-[300px]">
          <div className="text-center space-y-4">
            <Bell className="w-12 h-12 text-[#2a2a2a] mx-auto" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#525252]">
              No alerts yet. They will appear here when amendments are detected.
            </p>
          </div>
        </div>
      </LockedFeature>
    </div>
  );
}
