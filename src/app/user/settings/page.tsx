import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { User, Shield, Key, Bell } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userName = session.user?.name ?? "";
  const userEmail = session.user?.email ?? "";

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight">System Settings</h1>
        <p className="text-[#737373] font-medium">Manage your verified identity and architectural preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-4">
          {[
            { icon: User, label: "Profile Information", active: true },
            { icon: Shield, label: "Privacy & Data" },
            { icon: Key, label: "Security & Access" },
            { icon: Bell, label: "Notification Nodes" },
          ].map((item, idx) => (
            <button
              key={idx}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all ${
                item.active
                  ? "bg-[#111] border-[#d4af37]/30 text-[#e5e5e5]"
                  : "bg-transparent border-transparent text-[#525252] hover:text-[#a3a3a3]"
              }`}
            >
              <item.icon className={`w-4 h-4 ${item.active ? "text-[#d4af37]" : ""}`} />
              <span className="text-[11px] font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#111] border border-[#2a2a2a] rounded-[40px] p-10 space-y-10">
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Profile Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#525252] px-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-5 py-4 text-sm text-[#a3a3a3]"
                    disabled
                    defaultValue={userName}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#525252] px-1">Email Node</label>
                  <input
                    type="text"
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-5 py-4 text-sm text-[#a3a3a3]"
                    disabled
                    defaultValue={userEmail}
                  />
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-[#2a2a2a] space-y-6">
              <h3 className="text-xl font-bold text-red-500/80">Danger Zone</h3>
              <button className="px-8 py-4 border border-red-500/20 rounded-xl text-[10px] font-bold uppercase tracking-widest text-red-500/50 hover:bg-red-500/5 hover:text-red-500 transition-all">
                Deactivate Node
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
