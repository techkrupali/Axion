import Link from "next/link";
import { FORM_PRIVACY_LINE } from "@/config/contact";

/** The line under every form (Fix Brief Part 4, item 15). */
export default function FormPrivacyNote({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <p className={`text-[12px] leading-relaxed ${light ? "text-[#7A7870]" : "text-[var(--fg-5)]"} ${className}`}>
      {FORM_PRIVACY_LINE}{" "}
      <Link href="/privacy" className={`underline underline-offset-2 ${light ? "hover:text-[#A07830]" : "hover:text-[var(--accent)]"}`}>Privacy policy</Link>.
    </p>
  );
}
