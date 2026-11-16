"use client";

import React from "react";
import { UserSidebar } from "@/components/UserSidebar";
import { usePathname } from "next/navigation";
import { LogOut, User, Bell } from "lucide-react";
import { signOut } from "next-auth/react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Don't show sidebar on login/register pages (though they aren't under /user usually)
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-[#e5e5e5] font-sans selection:bg-[#C9A24A]/30 selection:text-[#C9A24A]">
      <UserSidebar />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-[#0a0a0a] border-b border-[#2a2a2a] flex items-center justify-between px-10 sticky top-0 z-40 backdrop-blur-md bg-[#0a0a0a]/80">
          <div className="flex items-center gap-4">
            <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#737373]">
              Location / <span className="text-[#e5e5e5]">{pathname.split("/").pop()?.replace("-", " ")}</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-8">
            <button className="relative p-2 text-[#525252] hover:text-[#e5e5e5] transition-colors">
              <Bell className="w-5 h-5" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C9A24A] rounded-full border-2 border-[#0a0a0a]" />
            </button>

            <div className="h-8 w-[1px] bg-[#2a2a2a]" />

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-bold text-[#e5e5e5] uppercase tracking-wider">Account Node</p>
                  <p className="text-[9px] text-[#737373] uppercase tracking-[0.2em] mt-0.5">Verified Identity</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[11px] font-bold text-[#C9A24A] shadow-[0_0_20px_rgba(201,162,74,0.05)]">
                  AX
                </div>
              </div>
              
              <button 
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-[#737373] hover:text-red-500 hover:border-red-500/20 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
