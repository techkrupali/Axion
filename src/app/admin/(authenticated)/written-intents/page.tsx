"use client";

import { useEffect, useState } from "react";
import { Loader2, Eye, CheckCircle, ChevronDown, ChevronUp, Mail } from "lucide-react";

interface Intent {
  _id: string;
  name: string;
  role?: string;
  organisation?: string;
  email: string;
  practice?: string;
  reading?: string;
  message?: string;
  status: "new" | "read" | "contacted";
  createdAt: string;
}

export default function AdminWrittenIntentsPage() {
  const [items, setItems] = useState<Intent[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/written-intent")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: Intent["status"]) => {
    await fetch("/api/written-intent", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setItems((prev) => prev.map((s) => (s._id === id ? { ...s, status } : s)));
  };

  const statusColor = (s: string) =>
    s === "new" ? "bg-[#C9A24A]/10 text-[#C9A24A] border-[#C9A24A]/20"
    : s === "read" ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
    : s === "contacted" ? "bg-green-500/10 text-green-400 border-green-500/20"
    : "bg-gray-500/10 text-gray-400 border-gray-500/20";

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[12px] font-mono tracking-[0.35em] uppercase text-[#737373] mb-2">Admin · Written Intents</p>
        <h1 className="text-[32px] font-bold leading-tight tracking-tight text-[#e5e5e5]">Written Intents</h1>
        <p className="text-[17px] text-[#737373] mt-1.5 leading-[1.6]">
          Submissions from the Connect form. Each one is also emailed to the founder.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-[#C9A24A] animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl p-16 text-center">
          <Mail className="w-10 h-10 text-[#2a2a2a] mx-auto mb-4" />
          <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#525252]">No written intents yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((it) => (
            <div key={it._id} className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-xl">
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                onClick={() => setExpanded(expanded === it._id ? null : it._id)}>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[17px] leading-snug text-[#e5e5e5]">{it.name}</span>
                    {it.organisation && <span className="text-[#737373] text-[14px]">· {it.organisation}</span>}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${statusColor(it.status)}`}>{it.status}</span>
                  </div>
                  <span className="text-[#737373] text-[15px] leading-[1.6]">{it.email}</span>
                  <span className="text-[#525252] text-[12px] mt-1 font-mono">{new Date(it.createdAt).toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  {it.practice && (
                    <span className="px-2 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md text-[11px] font-bold uppercase tracking-widest text-[#a3a3a3]">{it.practice}</span>
                  )}
                  <div className="flex gap-2 ml-4">
                    {it.status !== "read" && (
                      <button onClick={(e) => { e.stopPropagation(); updateStatus(it._id, "read"); }}
                        className="p-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] hover:border-blue-500/30 hover:text-blue-400 text-[#737373] transition-all" title="Mark as Read">
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {it.status !== "contacted" && (
                      <button onClick={(e) => { e.stopPropagation(); updateStatus(it._id, "contacted"); }}
                        className="p-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] hover:border-green-500/30 hover:text-green-400 text-[#737373] transition-all" title="Mark as Contacted">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {expanded === it._id ? <ChevronUp className="w-5 h-5 text-[#737373]" /> : <ChevronDown className="w-5 h-5 text-[#737373]" />}
                </div>
              </div>

              {expanded === it._id && (
                <div className="border-t border-[#2a2a2a] p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#737373] mb-2">Contact</h4>
                      <div className="space-y-1.5 text-[14px] leading-[1.65]">
                        <p><span className="text-[#a3a3a3]">Role:</span> {it.role || "-"}</p>
                        <p><span className="text-[#a3a3a3]">Organisation:</span> {it.organisation || "-"}</p>
                        <p><span className="text-[#a3a3a3]">Email:</span> <a href={`mailto:${it.email}`} className="text-[#C9A24A] hover:underline">{it.email}</a></p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#737373] mb-2">Practice</h4>
                      <p className="text-[14px] leading-[1.65] text-[#e5e5e5]">{it.practice || "-"}</p>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#737373] mb-2">Architecture under stress</h4>
                      <p className="text-[14px] leading-[1.65] text-[#e5e5e5]">{it.reading || "-"}</p>
                    </div>
                  </div>
                  {it.message && (
                    <div>
                      <h4 className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#737373] mb-3">Intent</h4>
                      <p className="text-[14px] leading-[1.65] text-[#e5e5e5] bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 whitespace-pre-wrap">{it.message}</p>
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
