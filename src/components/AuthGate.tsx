"use client";

import Link from "next/link";
import { UserPlus, LogIn, Lock } from "lucide-react";

/**
 * Shown in place of a form when the visitor is not logged in.
 * Both buttons carry `returnTo`, so after registering / logging in the visitor
 * lands back on the form they were trying to fill.
 */
export function AuthGate({
  title = "Register to continue.",
  message = "Create a free account first. Your name, email and mobile number are attached to what you submit, so we can come back to you.",
  returnTo,
  tone = "dark",
}: {
  title?: string;
  message?: string;
  returnTo: string;
  tone?: "dark" | "plain";
}) {
  const q = `?callbackUrl=${encodeURIComponent(returnTo)}`;

  return (
    <div
      className={tone === "dark" ? "rounded-[20px] p-8 text-center" : "text-center py-4"}
      style={tone === "dark" ? { background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.25)" } : undefined}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5"
        style={{ border: "1px solid rgba(201,168,76,0.45)", background: "rgba(201,168,76,0.08)" }}
      >
        <Lock size={18} className="text-[#C9A24A]" />
      </div>
      <h3 className="font-serif text-[26px] leading-tight text-[var(--fg)] mb-3">{title}</h3>
      <p className="text-[14px] leading-[1.65] text-[var(--fg-4)] max-w-[40ch] mx-auto mb-7">{message}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href={`/register${q}`}
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-mono text-[11px] tracking-[0.24em] uppercase font-semibold"
          style={{ background: "#C9A24A", color: "#080A0F" }}
        >
          <UserPlus size={13} /> Register
        </Link>
        <Link
          href={`/login${q}`}
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-mono text-[11px] tracking-[0.24em] uppercase"
          style={{ border: "1px solid rgba(201,168,76,0.35)", color: "#C9A24A" }}
        >
          <LogIn size={13} /> I have an account
        </Link>
      </div>
    </div>
  );
}

/** Read-only card showing the account details a submission will be sent with. */
export function SubmittingAs({ name, email, phone }: { name?: string | null; email?: string | null; phone?: string | null }) {
  return (
    <div className="rounded-[14px] px-5 py-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.2)" }}>
      <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-[var(--accent)] mb-3">Submitting as</p>
      <div className="grid gap-1.5 text-[14px]">
        <p className="text-[var(--fg)]">{name || "—"}</p>
        <p className="text-[var(--fg-3)]">{email || "—"}</p>
        <p className="text-[var(--fg-3)]">{phone || "Mobile number from your account"}</p>
      </div>
      <p className="text-[11px] text-[var(--fg-5)] mt-3">From your registered account.</p>
    </div>
  );
}
