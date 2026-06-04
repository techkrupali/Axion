"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Mail, Lock, Loader2, User } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/user/dashboard");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0A0A0B] font-sans selection:bg-[#C9A24A]/30 selection:text-[#C9A24A]">
      <div className="w-full max-w-md p-10 space-y-10 bg-[#0A0A0B] rounded-3xl border border-[rgba(240,241,245,0.1)] relative overflow-hidden group">
        {/* Background removed — flat only */}
        
        <div className="text-center relative">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-[#1a1a1a] border border-[#C9A24A]/20 rounded-2xl group-hover:border-[#C9A24A]/40 transition-colors">
              <User className="w-8 h-8 text-[#C9A24A]" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#e5e5e5]">Welcome Back</h1>
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-[#737373]">Access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6 relative">
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#737373] mb-2 px-1">Email Address</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Mail className="w-4 h-4 text-[#525252] group-focus-within/input:text-[#C9A24A] transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-[#111] border border-[rgba(240,241,245,0.1)] rounded-xl text-[#e5e5e5] text-sm placeholder-[#404040] focus:outline-none focus:ring-1 focus:ring-[#C9A24A]/30 focus:border-[#C9A24A]/30 transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#737373] mb-2 px-1">Password</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Lock className="w-4 h-4 text-[#525252] group-focus-within/input:text-[#C9A24A] transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-[#111] border border-[rgba(240,241,245,0.1)] rounded-xl text-[#e5e5e5] text-sm placeholder-[#404040] focus:outline-none focus:ring-1 focus:ring-[#C9A24A]/30 focus:border-[#C9A24A]/30 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-500/5 border border-red-500/10 rounded-xl text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-[#C9A24A] hover:bg-[#8A7338] text-[#0A0A0B] font-bold py-4 px-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 text-[10px] uppercase tracking-[0.2em]"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Secure Login
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-[10px] text-[#737373] uppercase tracking-widest">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#C9A24A] hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
