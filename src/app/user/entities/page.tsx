"use client";

import React, { useState } from "react";
import { Building2, Plus, Search } from "lucide-react";

export default function EntitiesPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight">Entities</h1>
          <p className="text-[#737373] font-medium">Manage your organizational entities and compliance boundaries.</p>
        </div>
        <button className="flex items-center justify-center gap-3 bg-[#1a1a1a] border border-[#d4af37]/20 hover:border-[#d4af37]/50 text-[#d4af37] px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all active:scale-[0.98]">
          <Plus className="w-4 h-4" />
          Add Entity
        </button>
      </div>

      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#525252] group-focus-within:text-[#d4af37] transition-colors" />
        <input
          type="text"
          placeholder="Search entities by name or identifier..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111] border border-[#2a2a2a] rounded-2xl pl-16 pr-6 py-5 text-sm text-[#e5e5e5] placeholder-[#404040] focus:outline-none focus:ring-1 focus:ring-[#d4af37]/30 focus:border-[#d4af37]/30 transition-all"
        />
      </div>

      <div className="bg-[#111] border border-[#2a2a2a] p-10 rounded-[40px] flex flex-col items-center justify-center text-center space-y-6 min-h-[300px]">
        <div className="w-16 h-16 bg-[#1a1a1a] border border-[#2a2a2a] rounded-3xl flex items-center justify-center">
          <Building2 className="w-8 h-8 text-[#2a2a2a]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#e5e5e5]">No Entities Found</h3>
          <p className="text-xs text-[#525252] mt-2 max-w-[240px] mx-auto uppercase tracking-widest font-bold">
            Start by adding your first organizational entity.
          </p>
        </div>
      </div>
    </div>
  );
}
