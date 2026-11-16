import Link from "next/link";
import { CalendarCheck, Clock, ImagePlus, Layers, LifeBuoy, Lightbulb, Newspaper, PenLine, RefreshCw } from "lucide-react";
import { PageHeader, ui } from "../ui";

const SECTIONS = [
  { id: "essay", label: "Add an essay", icon: PenLine, time: "About 5 minutes" },
  { id: "series", label: "Add a series part", icon: Layers, time: "About 5 minutes" },
  { id: "media", label: "Add a media piece", icon: Newspaper, time: "About 3 minutes" },
  { id: "photo", label: "Add a photo", icon: ImagePlus, time: "1 minute" },
  { id: "change", label: "Change or take down", icon: RefreshCw },
  { id: "monday", label: "Every Monday", icon: CalendarCheck, time: "About 20 minutes" },
  { id: "tips", label: "Good to know", icon: Lightbulb },
] as const;

/** A button or field name as it appears in the Studio. */
function B({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2 py-[1px] mx-[1px] border border-[rgba(201,162,74,0.35)] bg-[rgba(201,162,74,0.07)] font-mono text-[11.5px] tracking-[0.04em] text-[var(--fg)] whitespace-nowrap align-baseline">
      {children}
    </span>
  );
}

function Section({ id, children }: { id: (typeof SECTIONS)[number]["id"]; children: React.ReactNode }) {
  const s = SECTIONS.find((x) => x.id === id)!;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`${ui.panel} scroll-mt-36 lg:scroll-mt-10 p-6 sm:p-9`}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <span className="w-11 h-11 shrink-0 flex items-center justify-center border border-[rgba(201,162,74,0.35)] text-[#C9A24A]">
          <s.icon size={19} strokeWidth={1.5} aria-hidden />
        </span>
        <h2 id={`${id}-title`} className="font-display font-medium text-[clamp(24px,2.6vw,30px)] leading-tight text-[var(--fg)] mr-auto">{s.label}</h2>
        {"time" in s && s.time && (
          <span className={`${ui.mono} text-[9.5px] text-[var(--fg-5)] inline-flex items-center gap-1.5`}><Clock size={12} aria-hidden /> {s.time}</span>
        )}
      </div>
      <div className="mt-6 text-[15px] leading-[1.75] text-[var(--fg-3)] [&_p+p]:mt-4">{children}</div>
    </section>
  );
}

/** Numbered steps with gold numbers. */
function Steps({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="flex flex-col">
      {items.map((it, i) => (
        <li key={i} className="grid grid-cols-[36px_minmax(0,1fr)] gap-4 py-3.5 border-t border-[rgba(240,241,245,0.07)] first:border-t-0 first:pt-0">
          <span className="w-9 h-9 flex items-center justify-center border border-[rgba(240,241,245,0.14)] font-display text-[18px] text-[#C9A24A] [font-variant-numeric:lining-nums]">{i + 1}</span>
          <span className="pt-1.5">{it}</span>
        </li>
      ))}
    </ol>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return <p className="mt-5 border-l border-[#C9A24A] pl-4 text-[14px] leading-[1.7] text-[var(--fg-4)]">{children}</p>;
}

/** How to use the Studio, and the weekly routine (Fix Brief Part 7). */
export default function StudioHelp() {
  return (
    <>
      <PageHeader
        eyebrow="Help"
        title="How to use the Studio"
        intro="Everything you need to add, publish and look after Reports and Articles & Publications. Most things take a few minutes, and nothing needs a developer."
        actions={<Link href="/studio/new?category=essay" className={ui.primary}>+ Add an essay</Link>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[210px_minmax(0,1fr)] gap-8 lg:gap-12 items-start">
        {/* On this page */}
        <nav aria-label="On this page" className="lg:sticky lg:top-10">
          <p className={`${ui.mono} text-[9.5px] text-[var(--fg-5)] mb-3`}>On this page</p>
          <ul className="flex lg:flex-col gap-1 overflow-x-auto -mx-1 px-1 pb-1 lg:pb-0">
            {SECTIONS.map((s) => (
              <li key={s.id} className="shrink-0">
                <a href={`#${s.id}`} className="flex items-center gap-2.5 h-10 px-3 lg:px-3.5 text-[13.5px] text-[var(--fg-4)] hover:text-[var(--fg)] hover:bg-[rgba(240,241,245,0.04)] border border-[rgba(240,241,245,0.08)] lg:border-0 whitespace-nowrap transition-colors">
                  <s.icon size={15} strokeWidth={1.5} aria-hidden className="text-[#C9A24A]" /> {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-6 min-w-0 max-w-[860px]">
          <Section id="essay">
            <Steps items={[
              <>In <Link href="/studio" className="text-[var(--accent)] underline underline-offset-2">Library</Link>, click <B>+ Essay</B>.</>,
              <>Paste the title, set the date it was posted, and tick one or two themes.</>,
              <>Write a two-line summary in your own words.</>,
              <>Paste the LinkedIn post&apos;s link under <B>Where it was published</B>. If you have the text, paste it into <B>Full text</B>: a blank line starts a new paragraph.</>,
              <>Click <B>Preview</B>. The page opens in a new tab exactly as visitors will see it, with a gold &ldquo;Preview&rdquo; bar. Only you can see it.</>,
              <>Back in the Studio, click <B>Publish</B>. It is live straight away: on its own page, in Essays, on the Articles &amp; Publications page and in the Founder page&apos;s &ldquo;Writing &amp; media&rdquo;.</>,
            ]} />
            <Note>Without the full text, the page shows a &ldquo;Read it on LinkedIn&rdquo; button. With it, the essay is on the site and still links back to the LinkedIn conversation.</Note>
          </Section>

          <Section id="series">
            <Steps items={[
              <>The series must exist first. Check <Link href="/studio/series" className="text-[var(--accent)] underline underline-offset-2">Series</Link>; if it is not there, add it (name, one line, theme).</>,
              <>In Library, click <B>+ Series part</B> and fill it in like an essay.</>,
              <>Under <B>Series</B>, choose the series and type the <B>Part number</B>. Leave the number empty for a lead-in post.</>,
              <>Preview, then Publish. The parts are listed in order on the series page, with &ldquo;Previous&rdquo; and &ldquo;Next&rdquo; links between them.</>,
            ]} />
          </Section>

          <Section id="media">
            <p>Click <B>+ In the media</B>. Add the title, the date, the publication&apos;s name, the article&apos;s link and a two-line summary in your own words, then <B>Publish</B>. The page sends readers to the publisher&apos;s site.</p>
            <Note>Never copy the publisher&apos;s text or their summary. The article belongs to them.</Note>
          </Section>

          <Section id="photo">
            <Steps items={[
              <>Open the item. Under <B>Photo</B>, click <B>Choose a photo</B> and pick a JPG or PNG from your computer or phone. Large photos are made smaller automatically.</>,
              <>Describe in a few words what it shows (for people using screen readers).</>,
              <>Save. The whole photo becomes the item&apos;s cover: in every list, on its page and when the link is shared on LinkedIn. For the book, use the book cover.</>,
            ]} />
            <p className="mt-4"><B>Replace photo</B> or <B>Remove photo</B> changes it. Without a photo, the cover is made from the title, in gold on black.</p>
            <Note>Use only photos Axion Index owns or has permission to use, and none of clients without their written permission.</Note>
          </Section>

          <Section id="change">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(240,241,245,0.08)] border border-[rgba(240,241,245,0.08)]">
              {[
                { t: "Change it", b: <>Open it from the Library, edit, then <B>Save and update live</B>. The page changes at once.</> },
                { t: "Take it down, keep it", b: <><B>Unpublish</B> takes it off the website and keeps it as a draft. Publish it again any time.</> },
                { t: "Delete it for good", b: <>The bin icon in the Library list, or <B>Delete this item</B> in the editor. It asks once, then its page, every list and the sitemap update straight away.</> },
              ].map((c) => (
                <div key={c.t} className="bg-[#0B0B0D] p-5 sm:p-6">
                  <p className="font-display text-[20px] leading-tight text-[var(--fg)]">{c.t}</p>
                  <p className="mt-2.5 text-[14px] leading-[1.7] text-[var(--fg-4)]">{c.b}</p>
                </div>
              ))}
            </div>
            <Note>A published item&apos;s web address never changes, so links people have shared keep working. Deleting cannot be undone; when unsure, unpublish.</Note>
          </Section>

          <Section id="monday">
            <Steps items={[
              <>Add last week&apos;s LinkedIn essays and media pieces, each in its category. The library should never be more than 7 days behind LinkedIn.</>,
              <>Check the list for anything marked <B>Needs a link</B>: it is published but not showing until its text or link is added.</>,
              <>Post the site link in the first comment of each new LinkedIn essay. The tech team can give you the links with tracking tags.</>,
              <>Once the LinkedIn feed is on the homepage, check it shows the latest posts.</>,
            ]} />
          </Section>

          <Section id="tips">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "An item's web address is made from its title and is fixed once published, so links never break.",
                "Covers and LinkedIn share images are made from the title automatically. Add a photo and the whole photo is used instead.",
                "Drafts are visible only to you, in Preview. Nothing reaches the website until you publish.",
                "Lists are newest first, by the date you set. Set the date the piece was first published.",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-[14.5px] leading-[1.7]">
                  <span aria-hidden className="mt-[9px] w-1.5 h-1.5 shrink-0 rotate-45 bg-[#C9A24A]" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Still stuck */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 border border-[rgba(201,162,74,0.25)] bg-[rgba(201,162,74,0.04)] p-6 sm:p-7">
            <span className="w-11 h-11 shrink-0 flex items-center justify-center border border-[rgba(201,162,74,0.35)] text-[#C9A24A]"><LifeBuoy size={19} strokeWidth={1.5} aria-hidden /></span>
            <div>
              <p className="font-display text-[22px] leading-tight text-[var(--fg)]">Something looks wrong?</p>
              <p className="text-[14px] leading-[1.7] text-[var(--fg-4)] mt-1.5">Add a row to the tracker with what to change and why, or ask the tech team. Templates and the site&apos;s design are changed by them, not in the Studio.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
