"use client";

import { useEffect, useRef } from "react";
import { TriangleAlert } from "lucide-react";
import { ui } from "./ui";

/** A modal "are you sure?" for actions that cannot be undone. Esc or the backdrop cancels. */
export default function ConfirmDialog({ open, title, children, confirmLabel, busy, error, onConfirm, onCancel }: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  confirmLabel: string;
  busy?: boolean;
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus(); // the safe choice has focus
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !busy) onCancel(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy, onCancel]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center p-4" role="presentation">
      <div className="absolute inset-0 bg-[rgba(5,5,6,0.78)] backdrop-blur-[2px]" onClick={() => !busy && onCancel()} />
      <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" className={`${ui.panel} relative w-full max-w-[480px] p-7 sm:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.6)]`}>
        <div className="flex items-start gap-4">
          <span className="shrink-0 w-10 h-10 flex items-center justify-center border border-[rgba(224,122,110,0.35)] text-[#E8877B]">
            <TriangleAlert size={18} strokeWidth={1.6} aria-hidden />
          </span>
          <div className="min-w-0">
            <h2 id="confirm-title" className="font-display font-medium text-[25px] leading-tight text-[var(--fg)] [overflow-wrap:anywhere]">{title}</h2>
            <div className="text-[14.5px] leading-[1.65] text-[var(--fg-3)] mt-3">{children}</div>
          </div>
        </div>
        {error && <p role="alert" className="mt-5 text-[14px] text-[#E8877B]">{error}</p>}
        <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button ref={cancelRef} type="button" onClick={onCancel} disabled={busy} className={ui.secondary}>Cancel</button>
          <button type="button" onClick={onConfirm} disabled={busy} className={ui.dangerSolid}>{busy ? "Deleting…" : confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
