"use client";

import { useRef, useState } from "react";
import Link from "next/link";

export default function AIEdgeLab() {
  const heroRef = useRef<HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ background: "#F7F6F3", color: "#0D0D0B", fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 300, overflowX: "hidden" }}>

      {/* ── HEADER ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 200, minHeight: "44px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", background: "rgba(247,246,243,0.94)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(13,13,11,0.1)" }} className="px-4 md:px-[52px]">
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.24em", textTransform: "uppercase" }}>
          AI Edge Lab · <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Axionindex</Link>
        </div>
        <nav className="hidden md:flex" style={{ alignItems: "center", gap: "28px" }}>
          {["#actors","#doctrine","#framework","#diagnostic","#about"].map((href, i) => (
            <a key={href} href={href} style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#7A7870", textDecoration: "none" }}>
              {["Workplace","Doctrine","Framework","Diagnostic","About"][i]}
            </a>
          ))}
          <a href="#diagnostic" style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", background: "#0D0D0B", color: "#F7F6F3", padding: "8px 18px", textDecoration: "none" }}>Take Diagnostic</a>
        </nav>
        <div className="flex md:hidden" style={{ alignItems: "center", gap: "12px" }}>
          <a href="#diagnostic" style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", background: "#0D0D0B", color: "#F7F6F3", padding: "6px 14px", textDecoration: "none" }}>Diagnostic</a>
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "#0D0D0B", padding: "4px", lineHeight: 1 }} aria-label="Toggle menu">
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
        {mobileOpen && (
          <div className="flex md:hidden" style={{ width: "100%", flexDirection: "column", borderTop: "1px solid rgba(13,13,11,0.1)", background: "rgba(247,246,243,0.98)", paddingBottom: "12px" }}>
            {["#actors","#doctrine","#framework","#diagnostic","#about"].map((href, i) => (
              <a key={href} href={href} onClick={() => setMobileOpen(false)} style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#7A7870", textDecoration: "none", padding: "12px 16px", borderBottom: "1px solid rgba(13,13,11,0.06)" }}>
                {["Workplace","Doctrine","Framework","Diagnostic","About"][i]}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section ref={heroRef}>
        <div style={{ width: "100%", height: "clamp(280px,50vw,480px)", position: "relative", overflow: "hidden", background: "linear-gradient(160deg,#1A1C20 0%,#282C32 35%,#353830 65%,#1E1E1A 100%)" }}>
          <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg,transparent 0px,transparent 2px,rgba(255,255,255,0.008) 2px,rgba(255,255,255,0.008) 4px)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "52%", background: "#1A1A18", clipPath: "polygon(0% 100%,0% 65%,2% 65%,2% 45%,3% 45%,3% 35%,4% 35%,4% 45%,5% 45%,5% 65%,6% 65%,6% 50%,7% 50%,7% 30%,7.5% 30%,7.5% 28%,8% 28%,8% 30%,8.5% 30%,8.5% 50%,9% 50%,9% 65%,10% 65%,10% 40%,11% 40%,11% 20%,11.5% 20%,11.5% 15%,12% 15%,12% 20%,12.5% 20%,12.5% 40%,13% 40%,13% 65%,14% 65%,14% 50%,14.5% 50%,14.5% 42%,15% 42%,15% 50%,15.5% 50%,15.5% 65%,16% 65%,16% 35%,17% 35%,17% 20%,17.5% 20%,17.5% 10%,18% 10%,18.5% 10%,18.5% 20%,19% 20%,19% 35%,20% 35%,20% 65%,21% 65%,21% 45%,21.5% 45%,21.5% 38%,22% 38%,22% 45%,22.5% 45%,22.5% 65%,24% 65%,24% 42%,25% 42%,25% 28%,25.5% 28%,25.5% 22%,26% 22%,26% 28%,26.5% 28%,26.5% 42%,27% 42%,27% 65%,29% 65%,29% 48%,30% 48%,30% 35%,31% 35%,31% 48%,32% 48%,32% 65%,35% 65%,35% 52%,36% 52%,36% 40%,37% 40%,37% 25%,37.5% 25%,37.5% 18%,38% 18%,38% 25%,38.5% 25%,38.5% 40%,39% 40%,39% 52%,40% 52%,40% 65%,42% 65%,42% 55%,43% 55%,43% 45%,43.5% 45%,43.5% 38%,44% 38%,44% 45%,44.5% 45%,44.5% 55%,45% 55%,45% 65%,48% 65%,48% 48%,49% 48%,49% 32%,50% 32%,50% 20%,50.5% 20%,50.5% 14%,51% 14%,51% 20%,51.5% 20%,51.5% 32%,52% 32%,52% 48%,53% 48%,53% 65%,55% 65%,55% 52%,56% 52%,56% 44%,57% 44%,57% 52%,58% 52%,58% 65%,60% 65%,60% 42%,61% 42%,61% 30%,62% 30%,62% 42%,63% 42%,63% 65%,65% 65%,65% 55%,66% 55%,66% 48%,66.5% 48%,66.5% 42%,67% 42%,67% 48%,67.5% 48%,67.5% 55%,68% 55%,68% 65%,70% 65%,70% 40%,71% 40%,71% 28%,72% 28%,72% 40%,73% 40%,73% 65%,75% 65%,75% 52%,76% 52%,76% 44%,77% 44%,77% 52%,78% 52%,78% 65%,80% 65%,80% 48%,81% 48%,81% 36%,82% 36%,82% 48%,83% 48%,83% 65%,85% 65%,85% 56%,86% 56%,86% 50%,87% 50%,87% 56%,88% 56%,88% 65%,90% 65%,90% 44%,91% 44%,91% 32%,92% 32%,92% 44%,93% 44%,93% 65%,95% 65%,95% 55%,96% 55%,96% 65%,100% 65%,100% 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right,rgba(10,11,14,0.6) 0%,rgba(10,11,14,0.1) 50%,transparent 100%)" }} />
          <div className="hidden md:block" style={{ position: "absolute", right: "44px", top: "50%", transform: "translateY(-50%) rotate(90deg)", transformOrigin: "center center", fontFamily: "'Bebas Neue','DM Sans',sans-serif", fontSize: "48px", letterSpacing: "0.12em", color: "rgba(247,246,243,0.12)", whiteSpace: "nowrap" }}>AI EDGE LAB</div>
          <div style={{ position: "absolute", bottom: "32px", left: "clamp(16px,4vw,52px)", fontFamily: "'DM Mono',monospace", fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(247,246,243,0.35)" }}>The Architecture of Work in the Post-AI Era · 2026</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ borderBottom: "1px solid rgba(13,13,11,0.1)" }}>
          <div className="p-6 md:p-10 lg:p-[52px] md:border-r" style={{ borderColor: "rgba(13,13,11,0.1)" }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "8px", letterSpacing: "0.24em", textTransform: "uppercase", color: "#7A7870", marginBottom: "20px" }}>AI Edge Lab · Four Actors · One Transformation</div>
            <h1 style={{ fontFamily: "'Bebas Neue','DM Sans',sans-serif", fontSize: "clamp(64px,9vw,110px)", lineHeight: 0.95, letterSpacing: "0.01em", color: "#0D0D0B" }}>THE<br />WORK<br /><span style={{ color: "#A07830" }}>SHIFT.</span></h1>
          </div>
          <div className="p-6 md:p-10 lg:p-[52px]">
            <p style={{ fontSize: "13px", color: "#7A7870", lineHeight: 1.9, fontWeight: 300, marginBottom: "32px" }}>The workplace now has four actors: the Employee, the CXO, the Organisation — and AI. Each faces a different structural challenge. The AI Edge Lab is the framework that maps what that means for all four.</p>
            <div style={{ display: "flex", gap: "32px", marginBottom: "32px", flexWrap: "wrap" }}>
              {[{ n: "23%", l: "Scaled AI · McKinsey" },{ n: "90%", l: "Fail to exit pilot" },{ n: "78%", l: "Governance lags · EY" }].map((s, i) => (
                <div key={i} style={{ borderLeft: "1px solid rgba(13,13,11,0.18)", paddingLeft: "16px" }}>
                  <div style={{ fontFamily: "'Bebas Neue','DM Sans',sans-serif", fontSize: "32px", color: "#0D0D0B", lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "7px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#7A7870", marginTop: "4px" }}>{s.l}</div>
                </div>
              ))}
            </div>
            <a href="#diagnostic" style={{ display: "inline-flex", alignItems: "center", gap: "10px", fontFamily: "'DM Mono',monospace", fontSize: "8px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#0D0D0B", borderBottom: "1px solid rgba(13,13,11,0.18)", paddingBottom: "6px", textDecoration: "none" }}>Take the Diagnostic <span style={{ fontSize: "14px", fontWeight: 200 }}>+</span></a>
          </div>
        </div>
      </section>

      {/* ── FOUR ACTORS ── */}
      <section id="actors" style={{ borderBottom: "1px solid rgba(13,13,11,0.1)" }}>
        <div className="flex items-center justify-between px-6 md:px-[52px] py-4" style={{ borderBottom: "1px solid rgba(13,13,11,0.1)", background: "#EEECEA" }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#7A7870" }}>The Four Actors of the AI Workplace</span>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "9px", color: "#B0AEA8" }}>02 / 06</span>
        </div>
        <div className="p-6 md:p-10 lg:p-[52px]">
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ marginBottom: "48px" }}>
            <div className="md:border-r pr-0 md:pr-6 lg:pr-[52px] pb-6 md:pb-0" style={{ borderColor: "rgba(13,13,11,0.1)" }}>
              <h2 style={{ fontFamily: "'Bebas Neue','DM Sans',sans-serif", fontSize: "clamp(52px,7vw,88px)", lineHeight: 0.95, color: "#0D0D0B", marginBottom: "28px" }}>THE<br /><span style={{ color: "#A07830" }}>FOUR</span><br />ACTORS.</h2>
            </div>
            <div className="pl-0 md:pl-6 lg:pl-[52px]" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <p style={{ fontSize: "13px", color: "#7A7870", lineHeight: 1.9, fontWeight: 300 }}>For decades, three actors shaped work: the employee, the leader, and the organisation. AI has entered as a fourth — not as a tool in the org chart, but as an actor that absorbs work, reprices what humans do, and forces every other actor to reckon with their structural position.</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "1px", background: "rgba(13,13,11,0.1)" }}>
          {[
            { num: "01", badge: "Individual", name: ["THE ","STUDENTS."], q: '"I am entering a workforce that AI is already reshaping. Am I building skills that will compound — or ones that will compress?"', body: "Most students are preparing for a version of work that is already changing. The roles they are training for are being repriced in real time. The question is not whether AI will affect their career — it is whether they understand the structure of that effect before they enter.", sigs: ["Which of your core skills are AI-compressible on day one?","Are you building toward judgment-heavy roles or execution-heavy ones?","Does your degree or training build decision authority — or just output?"], cta: "ARI™ Diagnostic" },
            { num: "02", badge: "Leadership", name: ["COMPANY ","LEADER."], q: '"My team is using AI. My competitors are using AI. But our decisions are not getting faster or better. What is actually broken?"', body: "Most company leaders have deployed AI at the tool level. Very few have redesigned the decision architecture underneath it. The result is AI investment without AI advantage — faster outputs, same structural bottlenecks, and a leadership layer that is still running on an information-era model.", sigs: ["Have you redesigned decision rights — or only deployed tools?","Where in your organisation does judgment actually live?","Is your leadership layer compressing value or creating it?"], cta: "BDI™ for Leaders" },
            { num: "03", badge: "The New Entrant", name: ["ARTIFICIAL ","INTELLIGENCE."], q: '"AI is not a tool in the org chart. It is an actor that absorbs work. Which work does it absorb — and where does it stop?"', body: "AI compresses work in a predictable sequence: execution and analysis first, judgment last. Organisations that understand where AI stops design architecture that compounds.", sigs: ["Executing & coordinating — ~85% compression","Researching & analysing — ~75% compression","Framing & deciding — ~5–8% compression"], cta: "Compression Framework" },
            { num: "04", badge: "The System", name: ["THE ","ORGANISATION."], q: '"We are investing in AI at scale. Why aren\'t outcomes matching investment — and what are we measuring wrong?"', body: "Organisations fail because they run organisation design projects inside a technology frame. Two questions never get answered: why should employees support this, and what should they do differently?", sigs: ["What is our maturity stage? AI Leveraged, Enabled, First, or Born?","Have we redesigned decision architecture — or only deployed tools?","What is our Brainpower Density by function?"], cta: "ORG AI DARS™" },
          ].map((actor, i) => (
            <div key={i} style={{ background: "#F7F6F3", padding: "clamp(28px,4vw,44px) clamp(20px,3vw,40px)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
                <div style={{ fontFamily: "'Bebas Neue','DM Sans',sans-serif", fontSize: "56px", lineHeight: 0.9, color: "rgba(13,13,11,0.07)" }}>{actor.num}</div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "7px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7A7870", border: "1px solid rgba(13,13,11,0.18)", padding: "4px 10px" }}>{actor.badge}</div>
              </div>
              <div style={{ fontFamily: "'Bebas Neue','DM Sans',sans-serif", fontSize: "clamp(28px,3vw,38px)", letterSpacing: "0.02em", color: "#0D0D0B", marginBottom: "12px", lineHeight: 1 }}>{actor.name[0]}<span style={{ color: "#A07830" }}>{actor.name[1]}</span></div>
              <div style={{ fontSize: "11px", fontStyle: "italic", color: "#7A7870", lineHeight: 1.75, borderLeft: "2px solid rgba(13,13,11,0.18)", paddingLeft: "14px", marginBottom: "20px", fontWeight: 300 }}>{actor.q}</div>
              <p style={{ fontSize: "12px", color: "#7A7870", lineHeight: 1.85, marginBottom: "22px", fontWeight: 300 }}>{actor.body}</p>
              <div style={{ marginBottom: "24px" }}>
                {actor.sigs.map((sig, j) => (
                  <div key={j} style={{ fontFamily: "'DM Mono',monospace", fontSize: "8px", letterSpacing: "0.04em", color: "#2E2E2C", padding: "7px 0", borderBottom: "1px solid rgba(13,13,11,0.1)", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "#A07830" }}>→</span>{sig}
                  </div>
                ))}
              </div>
              <a href="#diagnostic" style={{ fontFamily: "'DM Mono',monospace", fontSize: "8px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#0D0D0B", display: "inline-flex", alignItems: "center", gap: "8px", borderBottom: "1px solid rgba(13,13,11,0.1)", paddingBottom: "4px", textDecoration: "none" }}>
                {actor.cta} <span style={{ color: "#A07830" }}>→</span>
              </a>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
