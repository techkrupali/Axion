"use client";

import { useEffect, useState } from "react";
import { Loader2, Eye, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

interface Signal {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  callback?: string;
  role?: string;
  company?: string;
  size?: string;
  signals: string[];
  rankedSignals?: string[];
  whyNow?: string;
  catchAllDetail?: string;
  practices: string[];
  status: "new" | "read" | "contacted";
  createdAt: string;
}

export default function AdminSignalsPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/diagnostic")
      .then(res => res.json())
      .then(data => setSignals(data))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: "new" | "read" | "contacted") => {
    await fetch("/api/diagnostic", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setSignals(prev => prev.map(s => s._id === id ? { ...s, status } : s));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-[#C9A24A]/10 text-[#C9A24A] border-[#C9A24A]/20";
      case "read": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "contacted": return "bg-green-500/10 text-green-400 border-green-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-mono tracking-[0.35em] uppercase text-[#737373] mb-2">Admin · Signals</p>
        <h1 className="text-[28px] font-bold leading-tight tracking-tight text-[#e5e5e5]">Signals</h1>
        <p className="text-[15px] text-[#737373] mt-1.5 leading-[1.6]">Manage incoming diagnostic signals.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#C9A24A] animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {signals.map((signal) => (
            <div
              key={signal._id}
              className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-xl"
            >
              <div
                className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                onClick={() => setExpanded(expanded === signal._id ? null : signal._id)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[15px] leading-snug text-[#e5e5e5]">{signal.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${getStatusColor(signal.status)}`}>
                        {signal.status}
                      </span>
                    </div>
                    <span className="text-[#737373] text-[13px] leading-[1.6]">{signal.email}</span>
                    <span className="text-[#525252] text-[11px] mt-1 font-mono">{new Date(signal.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {signal.practices.map((p, idx) => (
                      <span key={idx} className="px-2 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3]">
                        {p}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 ml-4">
                    {signal.status !== "read" && (
                      <button
                        onClick={(e) => { e.stopPropagation(); updateStatus(signal._id, "read"); }}
                        className="p-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] hover:border-blue-500/30 hover:text-blue-400 text-[#737373] transition-all"
                        title="Mark as Read"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {signal.status !== "contacted" && (
                      <button
                        onClick={(e) => { e.stopPropagation(); updateStatus(signal._id, "contacted"); }}
                        className="p-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] hover:border-green-500/30 hover:text-green-400 text-[#737373] transition-all"
                        title="Mark as Contacted"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {expanded === signal._id ? (
                    <ChevronUp className="w-5 h-5 text-[#737373]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#737373]" />
                  )}
                </div>
              </div>

              {expanded === signal._id && (
                <div className="border-t border-[#2a2a2a] p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#737373] mb-2">Contact</h4>
                      <div className="space-y-1.5 text-[13px] leading-[1.65]">
                        <p><span className="text-[#a3a3a3]">Phone:</span> {signal.phone || "-"}</p>
                        <p><span className="text-[#a3a3a3]">Callback:</span> {signal.callback || "-"}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#737373] mb-2">Context</h4>
                      <div className="space-y-1.5 text-[13px] leading-[1.65]">
                        <p><span className="text-[#a3a3a3]">Role:</span> {signal.role || "-"}</p>
                        <p><span className="text-[#a3a3a3]">Company:</span> {signal.company || "-"}</p>
                        <p><span className="text-[#a3a3a3]">Size:</span> {signal.size || "-"}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#737373] mb-2">Practices</h4>
                      <div className="flex flex-wrap gap-2">
                        {signal.practices.map((p, idx) => (
                          <span key={idx} className="px-2 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3]">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#737373] mb-3">Signals</h4>
                    <ul className="space-y-2">
                      {signal.signals.map((s, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-[13px] leading-[1.65] text-[#e5e5e5]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24A] shrink-0"></span>
                          {s}
                        </li>
                      ))}
                    </ul>
                    {signal.rankedSignals && signal.rankedSignals.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#737373] mb-3">Ranked Signals</h4>
                        <ol className="list-decimal list-inside space-y-2">
                          {signal.rankedSignals.map((s, idx) => (
                            <li key={idx} className="text-[13px] leading-[1.65] text-[#e5e5e5]">{s}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>

                  {signal.whyNow && (
                    <div>
                      <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#737373] mb-3">Why Now</h4>
                      <p className="text-[13px] leading-[1.65] text-[#e5e5e5] bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
                        {signal.whyNow}
                      </p>
                    </div>
                  )}

                  {signal.catchAllDetail && (
                    <div>
                      <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#737373] mb-3">Additional Details</h4>
                      <p className="text-[13px] leading-[1.65] text-[#e5e5e5] bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
                        {signal.catchAllDetail}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
