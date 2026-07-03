"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Bebas_Neue, DM_Sans, DM_Mono } from "next/font/google";

/* ─── Fonts ─── */
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--aiel-display",
  display: "swap",
});

const dmSans = DM_Sans({
  weight: ["200", "300", "400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--aiel-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--aiel-mono",
  display: "swap",
});

/* ─── Scroll Progress Bar ─── */
function useScrollProgress(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const prog = ref.current;
    if (!prog) return;
    const onScroll = () => {
      const h = document.documentElement;
      const b = document.body;
      const st = h.scrollTop || b.scrollTop;
      const sh = (h.scrollHeight || b.scrollHeight) - h.clientHeight;
      prog.style.width = sh > 0 ? `${(st / sh) * 100}%` : "0%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref]);
}

/* ─── Intersection Observer for .r elements ─── */
function useRevealOnScroll() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".aiel-r");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("aiel-v");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─── Header Component ─── */
function AielHeader() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 200,
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 52px",
        background: "rgba(247,246,243,.94)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(13,13,11,.1)",
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: "var(--aiel-mono),'DM Mono','Courier New',monospace",
          fontSize: 9,
          letterSpacing: ".24em",
          textTransform: "uppercase",
          color: "#0D0D0B",
          textDecoration: "none",
        }}
      >
        AI Edge Lab · Axionindex
      </Link>

      {/* Desktop nav */}
      <nav
        className="aiel-hdr-nav"
        style={{ display: "flex", alignItems: "center", gap: 22 }}
      >
        {/* Individuals dropdown */}
        <HdrDropdown
          label="Individuals"
          links={[
            { label: "Overview", href: "/expertise/ai-edge/individuals" },
            { label: "AAI™ · Aspiring", href: "/expertise/ai-edge/individuals/aai" },
            { label: "ARI™ · Working", href: "/expertise/ai-edge/individuals/ari" },
            { label: "BDI™ · Leaders", href: "/expertise/ai-edge/individuals/bdi" },
          ]}
        />
        {/* Organisations dropdown */}
        <HdrDropdown
          label="Organisations"
          links={[
            { label: "Overview", href: "/expertise/ai-edge/organisations" },
            { label: "Readiness Check", href: "/expertise/ai-edge/organisations/readiness" },
            { label: "Implementation Charter", href: "/expertise/ai-edge/organisations/implementation-charter" },
            { label: "AI Maturity Assessment", href: "/expertise/ai-edge/organisations/maturity" },
            { label: "ORG AI DARS™", href: "/expertise/ai-edge/organisations/org-ai-dars" },
          ]}
        />
        {/* Framework dropdown */}
        <HdrDropdown
          label="Framework"
          links={[
            { label: "Framework Overview", href: "/expertise/ai-edge/framework" },
            { label: "Doctrine", href: "/expertise/ai-edge/framework/doctrine" },
            { label: "E.D.G.E.", href: "/expertise/ai-edge/framework/edge" },
            { label: "Brainpower Density", href: "/expertise/ai-edge/framework/brainpower-density" },
            { label: "Lexicon", href: "/expertise/ai-edge/framework/lexicon" },
          ]}
        />
        {/* Research dropdown */}
        <HdrDropdown
          label="Research"
          links={[
            { label: "Research Overview", href: "/expertise/ai-edge/research" },
            { label: "Evidence Wall", href: "/expertise/ai-edge/research/evidence-wall" },
            { label: "Methodology", href: "/expertise/ai-edge/research/methodology" },
            { label: "Essays", href: "/expertise/ai-edge/research/essays/essay-01" },
          ]}
        />
        <Link href="/about" className="aiel-hdr-link">
          About
        </Link>
        <Link href="/#enterprise-form" className="aiel-hdr-cta">
          Start the Conversation
        </Link>
      </nav>

      <div
        className="aiel-hdr-pg"
        style={{
          fontFamily: "var(--aiel-mono),'DM Mono','Courier New',monospace",
          fontSize: 9,
          color: "#B0AEA8",
          letterSpacing: ".08em",
        }}
      >
        axionindex.org · 2026
      </div>
    </header>
  );
}

/* ─── Dropdown helper (CSS-only hover via group) ─── */
function HdrDropdown({
  label,
  links,
}: {
  label: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div
      style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
      className="aiel-hdr-item"
    >
      <span className="aiel-hdr-link" style={{ cursor: "default" }}>
        {label}
      </span>
      <div className="aiel-hdr-drop">
        {links.map((l, i) => (
          <Link key={l.href} href={l.href} className={i === 0 ? "aiel-drop-first" : undefined}>
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─── 404 Hero ─── */
function NotFoundHero() {
  return (
    <div
      className="subhero"
      style={{
        padding: "64px 52px 52px",
        borderBottom: "1px solid rgba(13,13,11,.1)",
        background: "#EEECEA",
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily: "var(--aiel-mono),'DM Mono','Courier New',monospace",
          fontSize: 9,
          letterSpacing: ".22em",
          textTransform: "uppercase",
          color: "#A07830",
          marginBottom: 18,
        }}
      >
        Error 404 · Structural Gap Detected
      </div>
      <h1
        style={{
          fontFamily: "var(--aiel-display),'Bebas Neue',sans-serif",
          fontSize: "clamp(48px,7vw,92px)",
          lineHeight: 0.94,
          letterSpacing: ".04em",
          color: "#0D0D0B",
          marginBottom: 24,
        }}
      >
        THIS PAGE
        <br />
        <span style={{ color: "#A07830" }}>DOESN&rsquo;T EXIST.</span>
      </h1>
      <p
        style={{
          fontSize: 15,
          color: "#7A7870",
          lineHeight: 1.8,
          fontWeight: 300,
          maxWidth: 620,
        }}
      >
        The page you are looking for has moved, been renamed, or never existed.
        The architecture below is intact — choose where to go.
      </p>
    </div>
  );
}

/* ─── Crosslinks Grid ─── */
function CrosslinksGrid() {
  const items = [
    {
      n: "Start Here",
      h: "The Homepage",
      p: "The work shift, the four actors, and where to begin.",
      go: "Go home",
      href: "/",
    },
    {
      n: "For Individuals",
      h: "Find Your AI Edge",
      p: "AAI™, ARI™, BDI™ — measure your structural position.",
      go: "Diagnostics",
      href: "/expertise/ai-edge/individuals",
    },
    {
      n: "For Organisations",
      h: "The Organisation Layer",
      p: "Readiness, Charter, Maturity, and ORG AI DARS™.",
      go: "Organisations",
      href: "/expertise/ai-edge/organisations",
    },
    {
      n: "The Thinking",
      h: "The Framework",
      p: "The doctrine, E.D.G.E., Brainpower Density, and the lexicon.",
      go: "Framework",
      href: "/expertise/ai-edge/framework",
    },
  ];

  return (
    <section style={{ borderBottom: "none" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 52px",
          borderBottom: "1px solid rgba(13,13,11,.1)",
          background: "#EEECEA",
        }}
      >
        <span
          style={{
            fontFamily: "var(--aiel-mono),'DM Mono','Courier New',monospace",
            fontSize: 8,
            letterSpacing: ".22em",
            textTransform: "uppercase",
            color: "#7A7870",
          }}
        >
          Find Your Way
        </span>
        <span
          style={{
            fontFamily: "var(--aiel-mono),'DM Mono','Courier New',monospace",
            fontSize: 9,
            color: "#B0AEA8",
            letterSpacing: ".08em",
          }}
        >
          —
        </span>
      </div>

      <div
        className="aiel-r"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 1,
          background: "rgba(13,13,11,.1)",
          margin: 1,
        }}
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="aiel-crosslink"
            style={{
              background: "#F7F6F3",
              padding: "28px 24px",
              display: "flex",
              flexDirection: "column",
              textDecoration: "none",
              transition: "background .25s",
            }}
          >
            <div className="cl-n">{item.n}</div>
            <div className="cl-h">{item.h}</div>
            <div className="cl-p">{item.p}</div>
            <div className="cl-go">{item.go} →</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ─── Full Footer ─── */
function AielFooter() {
  return (
    <footer
      className="ft-full"
      style={{
        background: "#0D0D0B",
        color: "#F7F6F3",
        padding: "72px 52px 40px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 3fr",
          gap: 56,
          paddingBottom: 48,
          borderBottom: "1px solid rgba(255,255,255,.1)",
        }}
        className="ftf-top"
      >
        {/* Brand + newsletter */}
        <div>
          <div
            style={{
              fontFamily: "var(--aiel-display),'Bebas Neue',sans-serif",
              fontSize: 26,
              letterSpacing: ".04em",
              color: "#F7F6F3",
              marginBottom: 6,
            }}
          >
            THE AI EDGE LAB
          </div>
          <div
            style={{
              fontFamily: "var(--aiel-mono),'DM Mono','Courier New',monospace",
              fontSize: 9,
              letterSpacing: ".16em",
              textTransform: "uppercase",
              color: "#C49848",
              marginBottom: 28,
            }}
          >
            an Axionindex initiative
          </div>
          <div
            style={{
              fontFamily: "var(--aiel-display),'Bebas Neue',sans-serif",
              fontSize: 20,
              letterSpacing: ".02em",
              color: "#F7F6F3",
              marginBottom: 12,
            }}
          >
            One structural read a month
          </div>
          <p
            style={{
              fontSize: 12,
              color: "rgba(247,246,243,.55)",
              lineHeight: 1.7,
              fontWeight: 300,
              marginBottom: 18,
              maxWidth: 340,
            }}
          >
            A monthly research note on how AI is repricing work, leadership,
            and organisations. Published when there is something to say.
          </p>
          <Link
            href="/#enterprise-form"
            style={{
              display: "inline-block",
              fontFamily: "var(--aiel-mono),'DM Mono','Courier New',monospace",
              fontSize: 9,
              letterSpacing: ".16em",
              textTransform: "uppercase",
              color: "#0D0D0B",
              background: "#C49848",
              padding: "11px 22px",
              textDecoration: "none",
            }}
          >
            Subscribe →
          </Link>
          <div
            style={{
              fontFamily: "var(--aiel-mono),'DM Mono','Courier New',monospace",
              fontSize: 8,
              letterSpacing: ".04em",
              color: "rgba(247,246,243,.35)",
              marginTop: 16,
              lineHeight: 1.6,
            }}
          >
            No marketing. No automation sequences. Unsubscribe in one click.
          </div>
        </div>

        {/* Four link columns */}
        <div
          className="ftf-cols"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 32,
          }}
        >
          {/* For Whom */}
          <div>
            <div className="ftf-col-h">For Whom</div>
            <Link href="/expertise/ai-edge/individuals/aai" className="ftf-col-link">
              Aspiring Professional · AAI™
            </Link>
            <Link href="/expertise/ai-edge/individuals/ari" className="ftf-col-link">
              Working Professional · ARI™
            </Link>
            <Link href="/expertise/ai-edge/individuals/bdi" className="ftf-col-link">
              Leader / CXO · BDI™
            </Link>
            <Link href="/expertise/ai-edge/organisations/org-ai-dars" className="ftf-col-link">
              Organisation · ORG AI DARS™
            </Link>
          </div>

          {/* The Institution */}
          <div>
            <div className="ftf-col-h">The Institution</div>
            <Link href="/expertise/ai-edge/research/evidence-wall" className="ftf-col-link">
              The Evidence Wall · 12 reports
            </Link>
            <Link href="/expertise/ai-edge/framework/doctrine" className="ftf-col-link">
              The Doctrine
            </Link>
            <Link href="/expertise/ai-edge/framework/lexicon" className="ftf-col-link">
              The Lexicon · 19 terms
            </Link>
            <Link href="/expertise/ai-edge/research/methodology" className="ftf-col-link">
              Methodology
            </Link>
            <Link href="/expertise/ai-edge/research" className="ftf-col-link">
              Research · 4 essays
            </Link>
            <Link href="/about" className="ftf-col-link">
              About Nitin Nahata
            </Link>
          </div>

          {/* The Framework */}
          <div>
            <div className="ftf-col-h">The Framework</div>
            <Link href="/expertise/ai-edge/framework/edge" className="ftf-col-link">
              E.D.G.E. Framework
            </Link>
            <Link href="/expertise/ai-edge/framework/edge#worktypes" className="ftf-col-link">
              Six Work Types
            </Link>
            <Link href="/expertise/ai-edge/framework/brainpower-density" className="ftf-col-link">
              Brainpower Density
            </Link>
            <Link href="/expertise/ai-edge/framework/edge#edgescore" className="ftf-col-link">
              Edge Score
            </Link>
            <Link href="/expertise/ai-edge/framework/doctrine#ownership" className="ftf-col-link">
              Judgment Ownership
            </Link>
          </div>

          {/* The Instruments */}
          <div>
            <div className="ftf-col-h">The Instruments</div>
            <Link href="/samples" className="ftf-col-link">
              Sample Reports
            </Link>
            <Link href="/expertise/ai-edge/individuals" className="ftf-col-link">
              Begin a Diagnostic →
            </Link>
            <Link href="/expertise/ai-edge/organisations/org-ai-dars" className="ftf-col-link">
              Request an Engagement →
            </Link>
          </div>
        </div>
      </div>

      <div
        style={{
          fontFamily: "var(--aiel-mono),'DM Mono','Courier New',monospace",
          fontSize: 9,
          letterSpacing: ".1em",
          color: "rgba(247,246,243,.4)",
          paddingTop: 32,
          textAlign: "center",
        }}
      >
        © 2026 AXIONINDEX · AXIONINDEX.ORG · PRIVATE. CONFIDENTIAL.
      </div>
    </footer>
  );
}

/* ─── Main Page ─── */
export default function AIEdgePage() {
  const progRef = useRef<HTMLDivElement>(null);
  useScrollProgress(progRef);
  useRevealOnScroll();

  return (
    <div
      className={`${bebasNeue.variable} ${dmSans.variable} ${dmMono.variable}`}
      style={{
        background: "#F7F6F3",
        color: "#0D0D0B",
        fontFamily: "var(--aiel-sans),'DM Sans',system-ui,sans-serif",
        fontWeight: 300,
        WebkitFontSmoothing: "antialiased",
        overflowX: "hidden",
        minHeight: "100vh",
      }}
    >
      {/* Scroll progress bar */}
      <div
        ref={progRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "#A07830",
          width: "0%",
          zIndex: 9999,
          transition: "width .1s",
        }}
      />

      <AielHeader />
      <NotFoundHero />
      <CrosslinksGrid />
      <AielFooter />

      {/* Scoped styles */}
      <style>{`
        /* ── Variables ── */
        :root {
          --aiel-white:  #F7F6F3;
          --aiel-white2: #EEECEA;
          --aiel-ink:    #0D0D0B;
          --aiel-ink3:   #2E2E2C;
          --aiel-mid:    #7A7870;
          --aiel-dim:    #B0AEA8;
          --aiel-gold:   #A07830;
          --aiel-gold2:  #C49848;
          --aiel-rule:   rgba(13,13,11,.1);
          --aiel-rule2:  rgba(13,13,11,.18);
        }

        /* ── Header nav ── */
        .aiel-hdr-nav {
          display: flex;
          align-items: center;
          gap: 22px;
        }
        @media(max-width:820px) {
          .aiel-hdr-nav { display: none; }
        }

        .aiel-hdr-item {
          position: relative;
          display: inline-flex;
          align-items: center;
        }

        .aiel-hdr-link {
          font-family: var(--aiel-mono),'DM Mono','Courier New',monospace;
          font-size: 8px;
          letter-spacing: .16em;
          text-transform: uppercase;
          color: #7A7870;
          text-decoration: none;
          transition: color .2s;
        }
        .aiel-hdr-link:hover { color: #0D0D0B; }

        .aiel-hdr-cta {
          font-family: var(--aiel-mono),'DM Mono','Courier New',monospace;
          font-size: 8px;
          letter-spacing: .18em;
          text-transform: uppercase;
          background: #0D0D0B;
          color: #F7F6F3;
          padding: 8px 18px;
          text-decoration: none;
          transition: background .2s;
        }
        .aiel-hdr-cta:hover { background: #2E2E2C; }

        .aiel-hdr-pg {
          font-family: var(--aiel-mono),'DM Mono','Courier New',monospace;
          font-size: 9px;
          color: #B0AEA8;
          letter-spacing: .08em;
        }
        @media(max-width:1024px) { .aiel-hdr-pg { display: none; } }

        /* ── Dropdown ── */
        .aiel-hdr-drop {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(6px);
          background: #F7F6F3;
          border: 1px solid rgba(13,13,11,.1);
          min-width: 210px;
          padding: 8px 0;
          opacity: 0;
          visibility: hidden;
          transition: opacity .18s ease, transform .18s ease;
          box-shadow: 0 12px 32px rgba(13,13,11,.08);
          z-index: 60;
          pointer-events: none;
        }
        .aiel-hdr-item:hover .aiel-hdr-drop {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
          pointer-events: auto;
        }
        .aiel-hdr-drop a {
          display: block;
          padding: 9px 20px;
          font-family: var(--aiel-mono),'DM Mono','Courier New',monospace;
          font-size: 10px;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: #2E2E2C;
          text-decoration: none;
          transition: all .15s;
        }
        .aiel-hdr-drop a:hover { background: #0D0D0B; color: #F7F6F3; }
        .aiel-hdr-drop a.aiel-drop-first,
        .aiel-hdr-drop a:first-child {
          color: #A07830;
          border-bottom: 1px solid rgba(13,13,11,.1);
          margin-bottom: 4px;
          padding-bottom: 11px;
        }
        .aiel-hdr-drop a.aiel-drop-first:hover,
        .aiel-hdr-drop a:first-child:hover {
          background: #EEECEA;
          color: #A07830;
        }
        @media(max-width:900px) { .aiel-hdr-drop { display: none; } }

        /* ── Crosslink cards ── */
        .aiel-crosslink { transition: background .25s; }
        .aiel-crosslink:hover { background: #0D0D0B !important; }
        .aiel-crosslink:hover .cl-h,
        .aiel-crosslink:hover .cl-p { color: #F7F6F3 !important; }
        .aiel-crosslink:hover .cl-n { color: #C49848 !important; }
        .aiel-crosslink:hover .cl-go { color: #C49848 !important; gap: 12px !important; }

        .cl-n {
          font-family: var(--aiel-mono),'DM Mono','Courier New',monospace;
          font-size: 8px;
          letter-spacing: .16em;
          text-transform: uppercase;
          color: #A07830;
          margin-bottom: 14px;
        }
        .cl-h {
          font-family: var(--aiel-display),'Bebas Neue',sans-serif;
          font-size: clamp(20px,2.1vw,26px);
          letter-spacing: .02em;
          color: #0D0D0B;
          line-height: 1.04;
          margin-bottom: 10px;
        }
        .cl-p {
          font-size: 12px;
          color: #7A7870;
          line-height: 1.65;
          font-weight: 300;
          margin-bottom: 18px;
        }
        .cl-go {
          font-family: var(--aiel-mono),'DM Mono','Courier New',monospace;
          font-size: 8px;
          letter-spacing: .16em;
          text-transform: uppercase;
          color: #A07830;
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: gap .25s;
        }

        @media(max-width:860px) {
          .aiel-r[style*="grid-template-columns: repeat(2"] {
            grid-template-columns: 1fr !important;
          }
        }

        /* ── Footer link cols ── */
        .ftf-col-h {
          font-family: var(--aiel-mono),'DM Mono','Courier New',monospace;
          font-size: 9px;
          letter-spacing: .16em;
          text-transform: uppercase;
          color: #C49848;
          margin-bottom: 18px;
        }
        .ftf-col-link {
          display: block;
          font-size: 12px;
          color: rgba(247,246,243,.6);
          line-height: 1.5;
          margin-bottom: 11px;
          text-decoration: none;
          font-weight: 300;
          transition: color .18s;
        }
        .ftf-col-link:hover { color: #F7F6F3; }

        @media(max-width:860px) {
          .ftf-top { grid-template-columns: 1fr !important; gap: 40px !important; }
          .ftf-cols { grid-template-columns: 1fr 1fr !important; }
        }
        @media(max-width:480px) {
          .ftf-cols { grid-template-columns: 1fr !important; }
          .ft-full { padding: 48px 28px 32px !important; }
        }

        /* ── Reveal animation ── */
        .aiel-r {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity .7s ease, transform .7s ease;
        }
        .aiel-r.aiel-v {
          opacity: 1;
          transform: translateY(0);
        }

        @media(prefers-reduced-motion: reduce) {
          .aiel-r {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }

        /* ── Subhero responsive ── */
        @media(max-width:768px) {
          .subhero { padding: 48px 32px 40px !important; }
        }
      `}</style>
    </div>
  );
}
