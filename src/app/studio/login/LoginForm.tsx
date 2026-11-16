"use client";

import { useActionState, useState } from "react";
import { studioSignIn } from "../actions";
import { ui } from "../ui";

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [error, action, pending] = useActionState(studioSignIn, undefined);
  // Kept in state so a failed attempt doesn't clear the email (React resets uncontrolled form fields)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const input = ui.input;
  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <label className="flex flex-col gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--fg-4)]">
        Email
        <input name="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
      </label>
      <label className="flex flex-col gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--fg-4)]">
        Password
        <input name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
      </label>
      {error && <p role="alert" className="text-[14px] text-[#E8877B]">{error}</p>}
      <button disabled={pending} className={`${ui.primary} mt-3 h-12 w-full`}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
