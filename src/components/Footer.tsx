'use client';
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Button from "./Button";
import AxionWordmark from "./AxionWordmark";

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

        {/* ── Main body ── */}
        <div className="pt-16 sm:pt-20 pb-12 sm:pb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10 sm:gap-12 lg:gap-8 border-b border-[rgba(240,241,245,0.1)]">

          {/* Brand + tagline + follow capture */}
          <div className="flex flex-col gap-8 sm:col-span-2 lg:col-span-1">
            <div>
              <AxionWordmark className="mb-3" />
              <p className="font-serif italic text-[clamp(16px,2vw,17px)] text-[#B8BDCE] leading-relaxed max-w-[32ch]">
                Codifying the operating patterns of the unfinished organisation.
              </p>
            </div>

            {/* Follow capture */}
            <div>
              <p className="font-mono text-[11px] tracking-[0.45em] uppercase mb-4" style={{ color: "#EDEBE3" }}>Follow the work</p>
              <a
                href="https://linkedin.com/company/axionindex"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 font-mono text-[12px] tracking-[0.22em] uppercase hover:text-[var(--accent)] transition-colors duration-300 min-h-[44px]"
                style={{ color: "#EDEBE3" }}
              >
                <span
                  className="w-10 h-10 rounded-full border border-[rgba(240,241,245,0.1)] group-hover:border-[#C9A24A] flex items-center justify-center transition-colors duration-300"
                  style={{ background: "rgba(12,14,20,0.8)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#6B7280] group-hover:text-[var(--accent)] transition-colors duration-300">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </span>
                LinkedIn
              </a>
            </div>
          </div>

          {/* Practices */}
          <div>
            <p className="font-mono text-[11px] tracking-[0.5em] uppercase text-[var(--accent)] opacity-50 mb-6">Practices</p>
              <ul className="flex flex-col gap-3">
                {[
                    { href: "/expertise/people", label: "People Architecture" },
                    { href: "/expertise/labour", label: "Labour Codes" },
                    { href: "/expertise/ai-edge", label: "AI Edge Lab" },
                    { href: "/expertise/family", label: "Family Business" },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="font-mono text-[12px] tracking-[0.18em] uppercase hover:text-[var(--accent)] transition-colors duration-300 inline-flex min-h-[40px] items-center"
                        style={{ color: "#EDEBE3" }}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Index */}
            <div>
              <p className="font-mono text-[11px] tracking-[0.5em] uppercase text-[var(--accent)] opacity-50 mb-6">Index</p>
              <ul className="flex flex-col gap-3">
                {[
                    { href: "/", label: "Axion Index" },
                    { href: "/patterns", label: "Operating Patterns" },
                    { href: "/founder", label: "Story" },
                    { href: "/about", label: "About" },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="font-mono text-[12px] tracking-[0.18em] uppercase hover:text-[var(--accent)] transition-colors duration-300 inline-flex min-h-[40px] items-center"
                        style={{ color: "#EDEBE3" }}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="font-mono text-[11px] tracking-[0.5em] uppercase text-[var(--accent)] opacity-50 mb-6">Contact</p>
              <div className="flex flex-col gap-4">
                <span className="font-mono text-[12px] tracking-[0.18em] uppercase" style={{ color: "#EDEBE3" }}>Bengaluru, India</span>
                <a
                  href="mailto:office@axionindex.org"
                  className="font-mono text-[13px] tracking-[0.1em] hover:text-[var(--accent)] transition-colors duration-300 normal-case break-words"
                  style={{ color: "#EDEBE3" }}
                >
                  office@axionindex.org
                </a>
              <Button href="/connect" variant="primary" showArrow={true} className="w-full sm:w-auto mt-2">Reach Us</Button>
            </div>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="font-mono text-[11px] tracking-[0.4em] uppercase" style={{ color: "#9DA3B6" }}>
            &copy; 2026 Axion Index. All rights reserved.
          </span>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {[
                    { href: "https://linkedin.com/company/axionindex", label: "LinkedIn", external: true },
                    { href: "/", label: "Axion Index", external: false },
                    { href: "/patterns", label: "Operating Patterns", external: false },
                    { href: "/founder", label: "Story", external: false },
                  ].map((l) => (
                    <Link
                      key={l.label}
                      href={l.href}
                      target={l.external ? "_blank" : undefined}
                      rel={l.external ? "noopener noreferrer" : undefined}
                      className="font-mono text-[11px] tracking-[0.3em] uppercase hover:text-[var(--accent)] transition-colors duration-300 min-h-[40px] inline-flex items-center"
                      style={{ color: "#9DA3B6" }}
                    >
                      {l.label}
                    </Link>
                  ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
