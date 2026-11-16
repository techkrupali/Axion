import Link from "next/link";
import Footer from "@/components/Footer";
import { pageMetadata } from "@/lib/seo";
import { findItem, type Library } from "@/content/library";
import { getLibrary } from "@/content/store";
import { pdfUrl, reportState } from "@/content/reportState";
import { nextRead } from "@/content/nextRead";
import { JOURNAL, LINKEDIN_FOLLOW, PUBLIC_EMAIL } from "@/config/contact";
import { EARLY_BIRD } from "@/config/aiEdgeLab";

export const metadata = pageMetadata({ title: "Thank you", description: "Thank you for getting in touch with Axion Index.", path: "/thank-you", noIndex: true });

type Props = { searchParams: Promise<{ form?: string; report?: string }> };

/** What each form's thank-you says (Fix Brief Part 4, item 18). */
function message(lib: Library, form: string | undefined, reportSlug: string | undefined): { eyebrow: string; title: string; lines: string[]; download?: string } {
  switch (form) {
    case "conversation":
      return {
        eyebrow: "Conversation",
        title: "Thank you. We have your note.",
        lines: ["Nitin reads every note personally. You will hear back within 48 hours.", "A confirmation is on its way to your inbox."],
      };
    case "report": {
      const item = reportSlug ? findItem(lib, reportSlug) : undefined;
      if (item && item.category === "report") {
        const { released, when } = reportState(item);
        const pdf = released ? pdfUrl(item) : "";
        if (pdf) {
          return {
            eyebrow: "Report",
            title: `Your copy of ${item.title}.`,
            lines: ["It is free to share. A copy is also on its way to your inbox."],
            download: pdf,
          };
        }
        return {
          eyebrow: "Report",
          title: `You are on the list for ${item.title}.`,
          lines: [
            released ? "We will email the report to you shortly." : `We will email it to you on release day${when ? `, ${when}` : ""}.`,
            "A confirmation is on its way to your inbox.",
          ],
        };
      }
      return { eyebrow: "Report", title: "You are on the list.", lines: ["We will email the report to you on release day."] };
    }
    case "journal":
      return {
        eyebrow: "Journal",
        title: `Welcome to the ${JOURNAL.name}.`,
        lines: [`One email, ${JOURNAL.cadence}. A welcome note is on its way to your inbox.`],
      };
    case "ai-edge":
      return {
        eyebrow: "AI Edge Lab",
        title: "You are on the early-bird list.",
        lines: [EARLY_BIRD.offer, "We will send you a note when the AI Edge Lab site opens."],
      };
    default:
      return { eyebrow: "Axion Index", title: "Thank you.", lines: [`If you need us before then, write to ${PUBLIC_EMAIL}.`] };
  }
}

export default async function ThankYouPage({ searchParams }: Props) {
  const { form, report } = await searchParams;
  const m = message(await getLibrary(), form, report);
  const read = await nextRead();

  return (
    <div className="min-h-screen">
      <section className="shell pt-36 sm:pt-44 pb-24">
        <div className="max-w-[720px]">
          <div className="eyebrow mb-8 text-[var(--accent)]">THANK YOU&nbsp;&nbsp;·&nbsp;&nbsp;{m.eyebrow.toUpperCase()}</div>
          <h1 className="font-serif font-normal text-[clamp(34px,5vw,60px)] leading-[1.08] tracking-[-0.01em] text-[var(--fg)]">{m.title}</h1>
          <div className="mt-6 flex flex-col gap-3">
            {m.lines.map((l) => <p key={l} className="lead text-[var(--fg-3)]">{l}</p>)}
          </div>

          {m.download && (
            <a href={m.download} target="_blank" rel="noopener noreferrer" className="mt-10 inline-flex items-center gap-3 px-8 py-5 bg-[#C9A24A] text-[#0A0A0B] font-mono text-[12px] tracking-[0.22em] uppercase font-semibold">
              Download the report (PDF) <span aria-hidden>↓</span>
            </a>
          )}

          {/* The next step on the ladder */}
          <div className="mt-14 rounded-2xl border border-[var(--line-gold)] bg-[rgba(201,162,74,0.04)] p-7 sm:p-9">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--accent)]">Next</span>
            <p className="font-serif text-[clamp(22px,2.6vw,28px)] leading-snug text-[var(--fg)] mt-3">{read.line}</p>
            <Link href={read.path} className="mt-6 inline-flex items-center gap-3 px-7 py-4 bg-[#C9A24A] text-[#0A0A0B] font-mono text-[11px] tracking-[0.22em] uppercase font-semibold">
              {read.label} <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[11px] tracking-[0.18em] uppercase">
            <a href={LINKEDIN_FOLLOW.href} target="_blank" rel="noopener noreferrer" className="text-[var(--fg-3)] hover:text-[var(--accent)]">{LINKEDIN_FOLLOW.label} ↗</a>
            {form !== "journal" && <Link href="/newsletter" className="text-[var(--fg-3)] hover:text-[var(--accent)]">Join the {JOURNAL.name} →</Link>}
            <Link href="/" className="text-[var(--fg-5)] hover:text-[var(--accent)]">Home</Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
