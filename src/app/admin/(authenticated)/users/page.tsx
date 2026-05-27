"use client";

import React, { useEffect, useState } from "react";
import { Users, Search, ShieldCheck, Calendar, Loader2 } from "lucide-react";

interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setUsers(d); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#e5e5e5]">Users</h1>
          <p className="text-[#737373] mt-2 font-medium">Manage personnel access and permission levels.</p>
        </div>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#525252] group-focus-within:text-[#d4af37] transition-colors" />
        <input
          type="text"
          placeholder="Search records..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl pl-12 pr-4 py-3.5 text-xs text-[#e5e5e5] placeholder-[#404040] focus:outline-none focus:ring-1 focus:ring-[#d4af37]/30 focus:border-[#d4af37]/30 transition-all"
        />
      </div>

      <div className="bg-[#0a0a0a] rounded-2xl border border-[#2a2a2a] overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-20 flex justify-center">
            <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-20 text-center">
            <Users className="w-10 h-10 text-[#2a2a2a] mx-auto mb-4" />
            <p className="text-[#525252] text-sm uppercase tracking-widest font-bold">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#111]/50 border-b border-[#2a2a2a]">
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#525252]">Personnel</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#525252]">Role</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#525252]">Enrolled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {filtered.map((user) => (
                  <tr key={user._id} className="hover:bg-[#1a1a1a]/40 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#d4af37] font-bold text-sm group-hover:border-[#d4af37]/30 transition-colors">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-[#e5e5e5] text-sm">{user.name}</p>
                          <p className="text-[10px] text-[#525252] mt-0.5 font-mono">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-[#737373]" />
                        <span className="text-xs font-medium text-[#a3a3a3] capitalize">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2.5 text-[#737373]">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs font-mono uppercase">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
