"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Building2, 
  ClipboardCheck, 
  Activity, 
  FileText, 
  Settings, 
  ShieldAlert,
  Zap,
  Lock,
  MessageSquare,
  BarChart3,
  Bell
} from "lucide-react";

interface IMenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
  gated?: boolean;
}

interface IMenuSection {
  title: string;
  items: IMenuItem[];
}

const menuItems: IMenuSection[] = [
  {
    title: "Intelligence",
    items: [
      { name: "Dashboard", href: "/user/dashboard", icon: LayoutDashboard },
      { name: "Posture", href: "/user/posture", icon: Activity },
    ]
  },
  {
    title: "Management",
    items: [
      { name: "Entities", href: "/user/entities", icon: Building2 },
      { name: "Assessments", href: "/user/assessments", icon: ClipboardCheck },
    ]
  },
  {
    title: "Prescription (Gated)",
    items: [
      { name: "Templates", href: "/user/templates", icon: MessageSquare, gated: true },
      { name: "Wage Analysis", href: "/user/wage-analysis", icon: BarChart3, gated: true },
      { name: "Amendment Alerts", href: "/user/alerts", icon: Bell, gated: true },
    ]
  },
  {
    title: "System",
    items: [
      { name: "Settings", href: "/user/settings", icon: Settings },
      { name: "Plan & Billing", href: "/user/billing", icon: Zap },
    ]
  }
];

export function UserSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-[#0a0a0a] border-r border-[#2a2a2a] flex flex-col h-screen sticky top-0">
      <div className="p-8 border-b border-[#2a2a2a]">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-sm font-bold tracking-[0.4em] uppercase">
            Axion <span className="text-[#C9A24A]">User</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {menuItems.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#525252] px-4">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                      isActive 
                        ? "bg-[#1a1a1a] text-[#C9A24A] border border-[#C9A24A]/20" 
                        : "text-[#a3a3a3] hover:bg-[#111] hover:text-[#e5e5e5]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {React.createElement(item.icon as React.ComponentType<{className?: string}>, { 
                        className: `w-4 h-4 ${isActive ? "text-[#C9A24A]" : "text-[#525252] group-hover:text-[#a3a3a3]"}` 
                      })}
                      <span className="text-[11px] font-bold uppercase tracking-widest">{item.name}</span>
                    </div>
                    {item.gated && !isActive && (
                      <Lock className="w-3 h-3 text-[#C9A24A]/40" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-6 border-t border-[#2a2a2a] bg-[#111]/30">
        <div className="flex items-center gap-3 p-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#737373]">
            System Operational
          </p>
        </div>
      </div>
    </aside>
  );
}
