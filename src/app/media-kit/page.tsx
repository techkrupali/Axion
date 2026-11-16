import Image from "next/image";
import { notFound } from "next/navigation";
import LibraryShell from "@/components/library/LibraryShell";
import { MEDIA_KIT, mediaKitReady } from "@/config/mediaKit";
import { LINKEDIN_NITIN } from "@/config/nav";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Media and speaker kit",
  description: "Nitin Nahata: short and long bio, headshots, talk topics and contact, for podcast hosts, journalists and conference organisers.",
  path: "/media-kit",
});

const LABEL = "font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--accent)]";

/** Media and speaker kit (Fix Brief Part 10, G-06). Shows once the bios and topics are filled in. */
export default function MediaKit() {
  if (!mediaKitReady()) notFound();
  return (
    <LibraryShell eyebrow="AXION  ·  MEDIA KIT" title="Nitin Nahata: media and speaker kit" intro="For podcast hosts, journalists and conference organisers. Everything here may be used with credit.">
      <section className="shell pb-24 flex flex-col gap-14 max-w-[860px]">
        <div>
          <h2 className={LABEL}>Short bio</h2>
          <p className="text-[17px] leading-[1.75] text-[var(--fg-2)] mt-3">{MEDIA_KIT.shortBio}</p>
        </div>
        <div>
          <h2 className={LABEL}>Long bio</h2>
          <div className="mt-3 flex flex-col gap-4">
            {MEDIA_KIT.longBio.split(/\n\s*\n/).map((p, i) => <p key={i} className="text-[16px] leading-[1.75] text-[var(--fg-3)]">{p}</p>)}
          </div>
        </div>
        <div>
          <h2 className={LABEL}>Headshots</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
            {MEDIA_KIT.headshots.map((h) => (
              <figure key={h.src} className="flex flex-col gap-3">
                <Image src={h.src} alt={`Nitin Nahata, ${h.label.toLowerCase()} headshot`} width={1200} height={1600} sizes="(max-width: 640px) 100vw, 420px" className="w-full h-auto rounded-xl border border-[var(--line)]" />
                <figcaption className="flex items-center justify-between font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--fg-4)]">
                  {h.label}
                  <a href={h.download} download className="text-[var(--accent)] underline underline-offset-2">Download full size ↓</a>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
        <div>
          <h2 className={LABEL}>Talk topics</h2>
          <ul className="mt-4 flex flex-col gap-4">
            {MEDIA_KIT.topics.map((t) => (
              <li key={t.title} className="border-l-2 border-[#C9A24A] pl-4">
                <p className="font-serif text-[21px] text-[var(--fg)]">{t.title}</p>
                <p className="text-[15px] leading-[1.6] text-[var(--fg-4)] mt-1">{t.line}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className={LABEL}>Contact</h2>
          <p className="text-[16px] leading-[1.7] text-[var(--fg-3)] mt-3">
            Invitations and interview requests: <a href={`mailto:${MEDIA_KIT.contact}`} className="text-[var(--accent)] underline underline-offset-2">{MEDIA_KIT.contact}</a>.
            Or reach Nitin on <a href={LINKEDIN_NITIN} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] underline underline-offset-2">LinkedIn ↗</a>.
          </p>
        </div>
      </section>
    </LibraryShell>
  );
}
