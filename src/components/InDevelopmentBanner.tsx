import Link from "next/link";
import { PRACTICES, PRACTICE_SLUGS, isLive, type PracticeKey } from "@/config/practices";

/**
 * B-23 (Fix Brief Part 8): a practice that is not open yet says so on its own page.
 * Driven by src/config/practices.ts: once a practice is set to "live", the banner (and the
 * noindex tag added in its layout) go away by themselves.
 */
export default function InDevelopmentBanner({ practice }: { practice: PracticeKey }) {
  if (isLive(practice)) return null;
  return (
    <div className="sticky z-[60] w-full" style={{ top: "var(--site-nav-h, 74px)" }} role="note">
      <div className="bg-[#C9A24A] text-[#0A0A0B] px-4 py-2.5 text-center font-mono text-[10.5px] sm:text-[11px] tracking-[0.14em] uppercase leading-relaxed">
        In development · {PRACTICES[practice].name} is not yet open for engagements. Conversations are welcome.{" "}
        <Link href={`/connect?practice=${PRACTICE_SLUGS[practice]}`} className="underline font-semibold whitespace-nowrap">Start a conversation →</Link>
      </div>
    </div>
  );
}
