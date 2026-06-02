"use client";

import { useEffect, useState } from "react";
import { Radio, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

type Signal = {
  _id: string;
  breaking: string;
  whyNow: string;
  signal: string;
  signals?: string[];
  rankedSignals?: string[];
  catchAllDetail?: string;
  practices?: string[];
  role: string;
  company: string;
  size: string;
  name: string;
  email: string;
  phone: string;
  callback: string;
  status: "new" | "read" | "contacted";
  createdAt: string;
};

const STATUS_STYLES = {
  new:       "bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/20",
  read:      "bg-blue-500/10 text-blue-400 border-blue-500/20",
  contacted: "bg-green-500/10 text-green-400 border-green-500/20",
};

export default function SignalsPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/diagnostic");
    const data = await res.json();
    setSignals(data);
    setLoading(false);
  }

  async function updateStatus(id: string, status: Signal["status"]) {
    await fetch("/api/diagnostic", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setSignals(s => s.map(x => x._id === id ? { ...x, status } : x));
  }

  useEffect(() => { load(); }, []);

  const counts = {
    new: signals.filter(s => s.status === "new").length,
    read: signals.filter(s => s.status === "read").length,
    contacted: signals.filter(s => s.status === "contacted").length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#e5e5e5]">Diagnostic Signals</h1>
          <p className="text-[#737373] mt-1 font-medium">Incoming signals from the homepage form.</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] hover:text-[#d4af37] border border-[#2a2a2a] hover:border-[#d4af37]/30 rounded-xl transition-all"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {(["new", "read", "contacted"] as const).map(s => (
          <div key={s} className="bg-[#0a0a0a] p-5 rounded-2xl border border-[#2a2a2a]">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#737373] mb-1">{s}</p>
            <p className="text-3xl font-bold text-[#e5e5e5]">{counts[s]}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#0a0a0a] rounded-2xl border border-[#2a2a2a] overflow-hidden">
        <div className="p-5 border-b border-[#2a2a2a] flex items-center gap-2">
          <Radio size={15} className="text-[#d4af37]" />
          <span className="text-sm font-bold text-[#e5e5e5]">{signals.length} signal{signals.length !== 1 ? "s" : ""} received</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-[#525252] text-sm">Loading…</div>
        ) : signals.length === 0 ? (
          <div className="p-12 text-center text-[#525252] text-sm">No signals yet. They'll appear here when the form is submitted.</div>
        ) : (
          <div className="divide-y divide-[#2a2a2a]">
            {signals.map(sig => (
              <div key={sig._id} className="hover:bg-[#111] transition-colors">
                {/* Row summary */}
                <div
                  className="flex items-center justify-between px-6 py-4 cursor-pointer"
                  onClick={() => setExpanded(expanded === sig._id ? null : sig._id)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="shrink-0">
                      {expanded === sig._id
                        ? <ChevronUp size={14} className="text-[#525252]" />
                        : <ChevronDown size={14} className="text-[#525252]" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#e5e5e5] truncate">{sig.name} — {sig.company}</p>
                      <p className="text-xs text-[#737373] truncate mt-0.5">{sig.breaking}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#525252] font-mono">
                      {new Date(sig.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <select
                      value={sig.status}
                      onChange={e => { e.stopPropagation(); updateStatus(sig._id, e.target.value as Signal["status"]); }}
                      onClick={e => e.stopPropagation()}
                      className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 border rounded-md bg-transparent cursor-pointer outline-none ${STATUS_STYLES[sig.status]}`}
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="contacted">Contacted</option>
                    </select>
                  </div>
                </div>

                {/* Expanded detail */}
                {expanded === sig._id && (
                  <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#1a1a1a]">
                    <div className="space-y-4 pt-4">
                      {/* New multi-signal fields */}
                      {sig.signals && sig.signals.length > 0 ? (
                        <>
                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#525252] mb-2">Signals selected</p>
                            <ul className="space-y-1">
                              {sig.signals.map((s, i) => (
                                <li key={i} className="text-xs text-[#a3a3a3] flex gap-2">
                                  <span className="text-[#525252] shrink-0">·</span>
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {sig.rankedSignals && sig.rankedSignals.length > 0 && (
                            <div>
                              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#525252] mb-2">Ranked top {sig.rankedSignals.length}</p>
                              <ol className="space-y-1 list-none">
                                {sig.rankedSignals.map((s, i) => (
                                  <li key={i} className="text-xs text-[#a3a3a3] flex gap-2">
                                    <span className="text-[#d4af37] shrink-0 font-bold">{i + 1}.</span>
                                    {s}
                                  </li>
                                ))}
                              </ol>
                            </div>
                          )}
                          {sig.practices && sig.practices.length > 0 && (
                            <Field label="Routed to" value={sig.practices.join(", ")} />
                          )}
                          {sig.catchAllDetail && (
                            <Field label="Free-text signal" value={sig.catchAllDetail} large />
                          )}
                        </>
                      ) : (
                        <>
                          <Field label="What's breaking" value={sig.breaking} large />
                          <Field label="Why now" value={sig.whyNow} />
                          <Field label="Loudest signal" value={sig.signal} />
                        </>
                      )}
                    </div>
                    <div className="space-y-4 pt-4">
                      <Field label="Role" value={sig.role} />
                      <Field label="Company" value={sig.company} />
                      <Field label="Size" value={sig.size} />
                      <Field label="Email" value={sig.email} />
                      <Field label="Phone" value={sig.phone} />
                      <Field label="Callback window" value={sig.callback || "—"} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, large }: { label: string; value: string; large?: boolean }) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#525252] mb-1">{label}</p>
      <p className={`text-[#a3a3a3] leading-relaxed ${large ? "text-sm" : "text-xs"}`}>{value || "—"}</p>
    </div>
  );
}
