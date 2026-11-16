"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, CircleHelp, Layers, LibraryBig, LogOut } from "lucide-react";
import { studioSignOut } from "./actions";

const NAV = [
  { href: "/studio", label: "Library", icon: LibraryBig, match: (p: string) => p === "/studio" || p.startsWith("/studio/edit") || p.startsWith("/studio/new") },
  { href: "/studio/series", label: "Series", icon: Layers, match: (p: string) => p.startsWith("/studio/series") },
  { href: "/studio/help", label: "Help", icon: CircleHelp, match: (p: string) => p.startsWith("/studio/help") },
];

/** Sidebar on desktop, a top bar on phones. */
export default function StudioNav({ user }: { user: { name: string; email: string; role: string } }) {
  const path = usePathname() ?? "/studio";
  const initials = (user.name || user.email).split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("");

  const brand = (
    <Link href="/studio" className="flex items-center gap-3 min-h-0 min-w-0" aria-label="Axion Studio, Library">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/axion-mark-gold-transparent.svg" alt="" width={30} height={30} className="w-[30px] h-[30px]" />
      <span className="flex flex-col leading-none">
        <span className="font-mono text-[11px] tracking-[0.32em] uppercase text-[var(--fg)]">Axion</span>
        <span className="font-display italic text-[17px] text-[#C9A24A] mt-1">Studio</span>
      </span>
    </Link>
  );

  return (
    <>
      {/* Phones and tablets */}
      <div className="lg:hidden sticky top-0 z-50 border-b border-[rgba(240,241,245,0.08)] bg-[rgba(8,8,10,0.96)] backdrop-blur">
        <div className="flex items-center justify-between gap-4 px-4 h-16">
          {brand}
          <form action={studioSignOut}>
            <button className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--fg-4)] hover:text-[var(--fg)]">
              <LogOut size={14} aria-hidden /> Sign out
            </button>
          </form>
        </div>
        <nav aria-label="Studio" className="flex gap-1 px-2 overflow-x-auto">
          {NAV.map((n) => {
            const on = n.match(path);
            return (
              <Link key={n.href} href={n.href} aria-current={on ? "page" : undefined}
                className={`inline-flex items-center gap-2 px-3 h-11 border-b-2 font-mono text-[10.5px] tracking-[0.16em] uppercase whitespace-nowrap ${on ? "border-[#C9A24A] text-[var(--fg)]" : "border-transparent text-[var(--fg-4)]"}`}>
                <n.icon size={15} strokeWidth={1.6} aria-hidden /> {n.label}
              </Link>
            );
          })}
          <a href="/publications" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 h-11 font-mono text-[10.5px] tracking-[0.16em] uppercase whitespace-nowrap text-[var(--fg-4)]">
            Website <ArrowUpRight size={13} aria-hidden />
          </a>
        </nav>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col sticky top-0 h-screen border-r border-[rgba(240,241,245,0.08)] bg-[#0B0B0D]">
        <div className="px-7 pt-8 pb-10">{brand}</div>
        <p className="px-7 font-mono text-[9.5px] tracking-[0.26em] uppercase text-[var(--fg-5)] mb-3">Content</p>
        <nav aria-label="Studio" className="flex flex-col px-3">
          {NAV.map((n) => {
            const on = n.match(path);
            return (
              <Link key={n.href} href={n.href} aria-current={on ? "page" : undefined}
                className={`relative flex items-center gap-3 h-11 px-4 text-[14.5px] transition-colors ${on ? "text-[var(--fg)] bg-[rgba(201,162,74,0.08)]" : "text-[var(--fg-4)] hover:text-[var(--fg)] hover:bg-[rgba(240,241,245,0.03)]"}`}>
                {on && <span aria-hidden className="absolute left-0 top-2 bottom-2 w-[2px] bg-[#C9A24A]" />}
                <n.icon size={17} strokeWidth={1.5} aria-hidden className={on ? "text-[#C9A24A]" : ""} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="mx-7 my-6 h-px bg-[rgba(240,241,245,0.08)]" />
        <a href="/publications" target="_blank" rel="noopener noreferrer" className="mx-3 flex items-center justify-between h-11 px-4 text-[14px] text-[var(--fg-4)] hover:text-[var(--fg)] transition-colors">
          View website <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden />
        </a>

        <div className="mt-auto border-t border-[rgba(240,241,245,0.08)] p-5">
          <div className="flex items-center gap-3">
            <span aria-hidden className="shrink-0 w-10 h-10 rounded-full border border-[rgba(201,162,74,0.4)] flex items-center justify-center font-mono text-[12px] tracking-[0.06em] text-[#C9A24A]">{initials}</span>
            <div className="min-w-0">
              <p className="text-[14px] text-[var(--fg)] truncate">{user.name || user.email}</p>
              <p className="font-mono text-[9.5px] tracking-[0.2em] uppercase text-[var(--fg-5)] mt-1">{user.role === "admin" ? "Admin" : "Editor"}</p>
            </div>
          </div>
          <form action={studioSignOut} className="mt-4">
            <button className="w-full inline-flex items-center justify-center gap-2 h-10 border border-[rgba(240,241,245,0.12)] font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--fg-4)] hover:text-[var(--fg)] hover:border-[rgba(240,241,245,0.28)] transition-colors">
              <LogOut size={14} aria-hidden /> Sign out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
