"use client";

import Script from "next/script";
import { setConsent, useConsent } from "@/lib/consent";
import { LINKEDIN_AXION, LINKEDIN_NITIN } from "@/config/nav";

/**
 * Live LinkedIn feed (Fix Brief Part 6, item 33): a paid widget that follows Nitin's profile and
 * the Axion Index company page. LinkedIn has no feed embed of its own and its API is closed, so
 * nothing is built here beyond a slot. Shows nothing until the widget is set in the server .env:
 *
 *   NEXT_PUBLIC_LINKEDIN_FEED_HOME=elfsight:<widget id>        (homepage, set to 3 posts)
 *   NEXT_PUBLIC_LINKEDIN_FEED_FOUNDER=curator:<feed id>        (Founder page, set to 6 posts)
 *
 * Supported: elfsight:<id>, curator:<feed id>[:<container id>]. Fonts, gold and "no branding"
 * are set in the widget's own dashboard (see docs/linkedin.md).
 */
type Feed = { provider: "elfsight" | "curator"; id: string; container: string };

function parse(raw: string | undefined): Feed | null {
  if (!raw) return null;
  const [provider, id, container] = raw.split(":");
  if (!id || !/^[\w-]+$/.test(id) || (container && !/^[\w-]+$/.test(container))) return null;
  if (provider === "elfsight") return { provider, id, container: "" };
  if (provider === "curator") return { provider, id, container: container || "curator-feed-default-feed-layout" };
  return null;
}

// Literal names so Next can inline them at build time
const feedFor = (placement: "home" | "founder") =>
  parse(placement === "home" ? process.env.NEXT_PUBLIC_LINKEDIN_FEED_HOME : process.env.NEXT_PUBLIC_LINKEDIN_FEED_FOUNDER);

/** The homepage version: its own section, or nothing at all until the feed is set up. */
export function LinkedInFeedSection() {
  if (!feedFor("home")) return null;
  return (
    <section style={{ borderBottom: "1px solid rgba(13,13,11,0.10)" }}>
      <div className="max-w-[1280px] mx-auto px-6 sm:px-12 pt-4 pb-16">
        <LinkedInFeed placement="home" light />
      </div>
    </section>
  );
}

export default function LinkedInFeed({ placement, light = false }: { placement: "home" | "founder"; light?: boolean }) {
  const feed = feedFor(placement);
  const { allowed, ready } = useConsent();
  if (!feed) return null;

  const ink = light ? "#0D0D0B" : "#F7F6F3";
  const gold = light ? "#A07830" : "#C9A24A";
  const link = { fontFamily: "var(--font-geist-mono), ui-monospace, monospace", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase" as const, color: gold };

  return (
    <div className="mt-12" aria-label="Latest on LinkedIn">
      <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6" style={{ borderBottom: `1px solid ${light ? "rgba(13,13,11,0.12)" : "rgba(247,246,243,0.12)"}`, paddingBottom: 14 }}>
        <span style={{ fontFamily: "var(--font-cormorant-garamond), Georgia, serif", fontSize: 26, color: ink }}>Latest on LinkedIn</span>
        <span className="flex flex-wrap gap-5">
          <a href={LINKEDIN_NITIN} target="_blank" rel="noopener noreferrer" style={link}>Nitin on LinkedIn ↗</a>
          <a href={LINKEDIN_AXION} target="_blank" rel="noopener noreferrer" style={link}>Axion Index on LinkedIn ↗</a>
        </span>
      </div>
      {!ready ? null : !allowed ? (
        // G-04: the widget sets cookies, so EU/UK visitors choose first
        <p style={{ fontSize: 14, color: light ? "#4A463C" : "#C9C4B8" }}>
          The LinkedIn feed uses third-party cookies.{" "}
          <button type="button" onClick={() => setConsent("granted")} style={{ ...link, textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}>
            Show LinkedIn posts
          </button>
        </p>
      ) : feed.provider === "elfsight" ? (
        <>
          <Script src="https://static.elfsight.com/platform/platform.js" strategy="lazyOnload" />
          <div className={`elfsight-app-${feed.id}`} data-elfsight-app-lazy />
        </>
      ) : (
        <>
          <div id={feed.container} />
          <Script src={`https://cdn.curator.io/published/${feed.id}.js`} strategy="lazyOnload" />
        </>
      )}
    </div>
  );
}
