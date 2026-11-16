"use client";

import { useActionState, useState } from "react";
import { studioSignIn } from "../actions";

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [error, action, pending] = useActionState(studioSignIn, undefined);
  // Kept in state so a failed attempt doesn't clear the email (React resets uncontrolled form fields)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const input = "w-full rounded-lg px-3.5 py-3 text-[15px] text-[var(--fg)] bg-[rgba(255,255,255,0.04)] border border-[var(--line-strong)] outline-none focus:border-[#C9A24A]";
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <label className="flex flex-col gap-1.5 font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--fg-4)]">
        Email
        <input name="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
      </label>
      <label className="flex flex-col gap-1.5 font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--fg-4)]">
        Password
        <input name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
      </label>
      {error && <p role="alert" className="text-[14px] text-red-400">{error}</p>}
      <button disabled={pending} className="mt-2 py-3.5 bg-[#C9A24A] text-[#0A0A0B] font-mono text-[11px] tracking-[0.2em] uppercase font-semibold disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
