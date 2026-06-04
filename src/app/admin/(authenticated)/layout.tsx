"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-[#e5e5e5] overflow-hidden font-sans">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-[#0a0a0a] border-b border-[#2a2a2a] flex items-center justify-between px-8">
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-[#a3a3a3]">
            {pathname?.split("/").pop()?.replace("-", " ")}
          </h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-[#e5e5e5]">Admin Account</p>
                <p className="text-[10px] text-[#737373] uppercase tracking-wider">Superuser</p>
              </div>
              <div className="w-9 h-9 rounded-full border border-[#C9A24A]/30 bg-[#1a1a1a] flex items-center justify-center text-[10px] font-bold text-[#C9A24A]">
                AX
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#0a0a0a]">
          {children}
        </div>
      </main>
    </div>
  );
}
