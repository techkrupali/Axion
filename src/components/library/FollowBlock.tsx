import NewsletterForm from "@/components/NewsletterForm";
import { JOURNAL, LINKEDIN_FOLLOW } from "@/config/contact";

/** Ladder step 2 at the end of a reading page: follow Nitin on LinkedIn, or join the Journal. */
export default function FollowBlock() {
  return (
    <aside className="mt-16 rounded-2xl border border-[var(--line-gold)] bg-[rgba(201,162,74,0.03)] p-6 sm:p-9" aria-label="Follow">
      <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--accent)]">Keep reading</span>
      <h2 className="font-serif text-[clamp(24px,3vw,30px)] leading-tight text-[var(--fg)] mt-3">
        The {JOURNAL.name}, {JOURNAL.cadence}.
      </h2>
      <p className="text-[15px] leading-[1.7] text-[var(--fg-4)] mt-3 max-w-[56ch]">
        New reports, essays and field notes in one email. Or{" "}
        <a href={LINKEDIN_FOLLOW.href} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] underline underline-offset-2">
          follow Nitin on LinkedIn ↗
        </a>
      </p>
      <div className="mt-7">
        <NewsletterForm compact />
      </div>
    </aside>
  );
}
