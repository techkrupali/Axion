"use client";

import { useEffect, useState } from "react";
import DiagnosticModal, { useReopenDiagnostic } from "@/components/DiagnosticModal";
import { practiceFromPath, practiceFromSlug, type PracticeKey } from "@/config/practices";

/**
 * The one "Start a conversation" form for the whole site (Fix Brief Part 4, item 14).
 * Mounted once in the root layout. It opens:
 *  • from any button calling openDiagnostic() (src/lib/openDiagnostic.ts),
 *  • from `?diagnostic=1` in a URL,
 *  • from any link to /connect?practice=… (the practice pages' "Begin a diagnostic",
 *    "Request a diagnostic", "Begin a conversation" buttons): the click opens the form in
 *    place instead. Without JavaScript those links still reach Reach Us, which embeds the same form.
 * Practice pages pre-select their practice silently: from the link, else from the page address.
 */
export default function ConversationForm() {
  const [open, setOpen] = useState(false);
  const [practice, setPractice] = useState<PracticeKey | undefined>();

  const show = (p?: PracticeKey) => {
    setPractice(p ?? practiceFromPath(window.location.pathname));
    setOpen(true);
  };
  useReopenDiagnostic(show);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== "/connect" || !url.searchParams.has("practice")) return;
      e.preventDefault();
      e.stopPropagation(); // keep Next's <Link> from navigating
      show(practiceFromSlug(url.searchParams.get("practice")));
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return open ? <DiagnosticModal practice={practice} onClose={() => setOpen(false)} /> : null;
}
