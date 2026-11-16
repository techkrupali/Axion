'use client';
import Link from "next/link";
import { FOOTER_COLUMNS, FOOTER_BOTTOM_LINE } from "@/config/nav";
import { CookieSettingsLink } from "@/components/CookieBanner";
import { mediaKitReady } from "@/config/mediaKit";
import NewsletterForm from "@/components/NewsletterForm";
import { JOURNAL, PUBLIC_EMAIL } from "@/config/contact";

/** The one site footer (Fix Brief Part 1 D-02 + Part 2): same links on every page. */
export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[rgba(240,241,245,0.1)]" style={{ background: "#0A0A0B" }}>

      {/* Ghost wordmark — deep background */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[10%] font-serif italic font-bold leading-none pointer-events-none select-none whitespace-nowrap"
        style={{ fontSize: "20vw", color: "rgba(240,241,245,0.018)", letterSpacing: "-0.02em" }}
      >
        AXION
      </div>

      <div className="shell relative z-10">
        <div className="pt-16 sm:pt-20 pb-12 sm:pb-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1.3fr_0.9fr_1.1fr] gap-10 sm:gap-12 lg:gap-8 border-b border-[rgba(240,241,245,0.1)]">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col items-start">
            <Link href="/" aria-label="Axion Index — home" className="inline-block">
              <img
                src="/axion-index-lockup-gold-transparent.svg"
                alt="Axion Index"
                className="object-contain"
                style={{ width: "clamp(180px, 20vw, 260px)", height: "auto" }}
              />
            </Link>
            {/* Nitin, 16 Nov: support@ is the one public address, in the footer too */}
            <a href={`mailto:${PUBLIC_EMAIL}`} className="mt-5 inline-flex min-h-[36px] items-center text-[14px] hover:text-[#C9A24A] transition-colors duration-300 break-all" style={{ color: "#EDEBE3" }}>
              {PUBLIC_EMAIL}
            </a>
          </div>

          {FOOTER_COLUMNS.map((c) => (c.title === "Firm" && mediaKitReady() ? { ...c, links: [...c.links, { label: "Media kit", href: "/media-kit" }] } : c)).map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="font-mono text-[11px] tracking-[0.32em] uppercase text-[#C9A24A] opacity-70 mb-5">{col.title}</p>
              <ul className="flex flex-col gap-1.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.status ? (
                      <span className="inline-flex flex-wrap items-center gap-x-2 min-h-[36px] text-[14px] cursor-default" style={{ color: "#6B7280" }}>
                        {l.label}
                        <span className="font-mono text-[10px] tracking-[0.14em] uppercase">· {l.status}</span>
                      </span>
                    ) : l.external ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[36px] items-center text-[14px] hover:text-[#C9A24A] transition-colors duration-300"
                        style={{ color: "#EDEBE3" }}
                      >
                        {l.label} <span aria-hidden className="ml-1.5 text-[11px] opacity-60">↗</span>
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        className="inline-flex min-h-[36px] items-center text-[14px] hover:text-[#C9A24A] transition-colors duration-300"
                        style={{ color: "#EDEBE3" }}
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* E-09: Journal sign-up on every page */}
        <section aria-labelledby="footer-journal" className="py-12 sm:py-14 grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 lg:gap-16 border-b border-[rgba(240,241,245,0.1)]">
          <div>
            <p className="font-mono text-[11px] tracking-[0.32em] uppercase text-[#C9A24A] opacity-70">Journal</p>
            <h2 id="footer-journal" className="font-serif text-[clamp(24px,2.6vw,30px)] leading-tight text-[#F7F6F3] mt-4">
              The {JOURNAL.name}, {JOURNAL.cadence}.
            </h2>
            <p className="text-[14px] leading-[1.7] text-[#9DA3B6] mt-3 max-w-[44ch]">New reports, essays and field notes in one email.</p>
          </div>
          <NewsletterForm compact />
        </section>

        {/* ── Bottom line: identical on every page ── */}
        <div className="py-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <p className="font-mono text-[11px] sm:text-[12px] tracking-[0.2em] uppercase" style={{ color: "#9DA3B6" }}>
            {FOOTER_BOTTOM_LINE}
          </p>
          {/* G-04: change the cookie choice */}
          <CookieSettingsLink className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#9DA3B6] hover:text-[#C9A24A]" />
        </div>
      </div>
    </footer>
  );
}
