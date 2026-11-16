"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { setConsent, useConsent } from "@/lib/consent";

/** The consent banner for visitors in the EU and UK (Fix Brief Part 10, G-04). */
export default function CookieBanner() {
  const { needsChoice } = useConsent();
  const pathname = usePathname() ?? "";
  if (!needsChoice || pathname.startsWith("/studio")) return null;
  return (
    <div role="dialog" aria-label="Cookies" className="fixed inset-x-0 bottom-0 z-[350] p-3 sm:p-4" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
      <div className="mx-auto max-w-[920px] flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 bg-[#0D0D0B] border border-[rgba(201,162,74,0.45)] shadow-2xl">
        <p className="flex-1 text-[14px] leading-relaxed text-[#D9D6CE]">
          We use cookies to count visits and to show our latest LinkedIn posts. Nothing is used for advertising.{" "}
          <Link href="/privacy#cookies" className="underline text-[#C9A24A]">Privacy policy</Link>
        </p>
        <div className="flex gap-3 shrink-0">
          <button type="button" onClick={() => setConsent("denied")} className="px-5 py-3 border border-[rgba(247,246,243,0.25)] text-[#F7F6F3] font-mono text-[11px] tracking-[0.16em] uppercase">
            Decline
          </button>
          <button type="button" onClick={() => setConsent("granted")} className="px-5 py-3 bg-[#C9A24A] text-[#0A0A0B] font-mono text-[11px] tracking-[0.16em] uppercase font-semibold">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

/** Footer link to change the choice later. */
export function CookieSettingsLink({ className = "" }: { className?: string }) {
  return (
    <button type="button" onClick={() => setConsent(null)} className={className}>
      Cookie settings
    </button>
  );
}
