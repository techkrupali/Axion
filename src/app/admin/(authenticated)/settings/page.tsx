import { auth } from "@/auth";
import { Bell, Lock, User, Database, Trash2, ChevronRight } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();
  const adminName = session?.user?.name ?? "";
  const adminEmail = session?.user?.email ?? "";

  return (
    <div className="space-y-10 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#e5e5e5]">Settings</h1>
        <p className="text-[#737373] mt-2 font-medium">Configure terminal preferences and security protocols.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
              <User className="w-5 h-5 text-[#d4af37]" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#e5e5e5]">Personnel Profile</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#525252] px-1">Full Designation</label>
              <input type="text" defaultValue={adminName} className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-xs text-[#e5e5e5] focus:outline-none focus:ring-1 focus:ring-[#d4af37]/30 transition-all" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#525252] px-1">Identity Email</label>
              <input type="email" defaultValue={adminEmail} disabled className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-xs text-[#a3a3a3] focus:outline-none transition-all disabled:opacity-60" />
            </div>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
              <Lock className="w-5 h-5 text-[#a3a3a3]" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#e5e5e5]">Security Protocols</h3>
          </div>
          <button className="flex items-center justify-between w-full p-5 bg-[#111]/50 border border-[#2a2a2a] hover:border-[#d4af37]/20 hover:bg-[#d4af37]/5 rounded-xl transition-all group">
            <div className="text-left">
              <p className="text-xs font-bold text-[#e5e5e5] group-hover:text-[#d4af37] transition-colors">Access Key Rotation</p>
              <p className="text-[10px] text-[#525252] mt-1 font-medium">Update your account password regularly</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#404040] group-hover:text-[#d4af37] transition-colors" />
          </button>
        </div>

        <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
              <Database className="w-5 h-5 text-[#a3a3a3]" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#e5e5e5]">System Operations</h3>
          </div>
          <div className="flex items-center justify-between p-5 bg-red-500/5 border border-red-500/10 rounded-xl group">
            <div>
              <p className="text-xs font-bold text-red-500">Purge System Cache</p>
              <p className="text-[10px] text-red-900/60 mt-1 font-medium">Permanently delete all temporary node data</p>
            </div>
            <button className="text-red-500/50 group-hover:text-red-500 p-2.5 hover:bg-red-500/10 rounded-xl transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
