"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  BarChart3, 
  Shield,
  CreditCard,
  Package
} from "lucide-react";
import { signOut } from "next-auth/react";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-[#2a2a2a] hidden md:flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3 px-2">
          <div className="p-2 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-lg">
            <Shield className="w-5 h-5 text-[#d4af37]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#e5e5e5]">Axion <span className="text-[#d4af37]">Admin</span></span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        <NavItem 
          href="/admin/dashboard" 
          icon={<LayoutDashboard className="w-5 h-5" />} 
          label="Dashboard" 
          active={pathname === "/admin/dashboard"} 
        />
        <NavItem 
          href="/admin/users" 
          icon={<Users className="w-5 h-5" />} 
          label="Users" 
          active={pathname === "/admin/users"} 
        />
        {/* <NavItem 
          href="/admin/subscriptions" 
          icon={<CreditCard className="w-5 h-5" />} 
          label="Subscribers" 
          active={pathname === "/admin/subscriptions"} 
        /> */}
        <NavItem 
          href="/admin/subscription-plans" 
          icon={<Package className="w-5 h-5" />} 
          label="Plan Tiers" 
          active={pathname === "/admin/subscription-plans"} 
        />
        <NavItem 
          href="/admin/analytics" 
          icon={<BarChart3 className="w-5 h-5" />} 
          label="Analytics" 
          active={pathname === "/admin/analytics"} 
        />
        <NavItem 
          href="/admin/settings" 
          icon={<Settings className="w-5 h-5" />} 
          label="Settings" 
          active={pathname === "/admin/settings"} 
        />
      </nav>

      <div className="p-4 border-t border-[#2a2a2a]">
        <button 
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 w-full px-4 py-3 text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#d4af37]/5 hover:rounded-xl transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:text-[#d4af37]" />
          <span className="font-medium group-hover:text-[#d4af37]">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

function NavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link 
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
        active 
          ? "bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20" 
          : "text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]"
      }`}
    >
      <span className={active ? "text-[#d4af37]" : "text-[#737373] group-hover:text-[#e5e5e5]"}>
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}
