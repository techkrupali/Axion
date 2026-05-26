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
          <div className="hidden md:block" style={{ position: "absolute", right: "-20px", top: "50%", transform: "translateY(-50%) rotate(90deg)", transformOrigin: "center center", fontFamily: "'Bebas Neue','DM Sans',sans-serif", fontSize: "28px", letterSpacing: "0.12em", color: "rgba(247,246,243,0.12)", whiteSpace: "nowrap" }}>AI EDGE LAB</div>
          <div style={{ position: "absolute", bottom: "32px", left: "clamp(16px,4vw,52px)", fontFamily: "'DM Mono',monospace", fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(247,246,243,0.35)" }}>The Architecture of Work in the Post-AI Era · 2026</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ borderBottom: "1px solid rgba(13,13,11,0.1)" }}>
          <div className="p-6 md:p-10 lg:p-[52px] md:border-r" style={{ borderColor: "rgba(13,13,11,0.1)" }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", letterSpacing: "0.24em", textTransform: "uppercase", color: "#7A7870", marginBottom: "20px" }}>AI Edge Lab · Four Actors · One Transformation</div>
            <h1 style={{ fontFamily: "'Bebas Neue','DM Sans',sans-serif", fontSize: "clamp(64px,9vw,110px)", lineHeight: 0.95, letterSpacing: "0.01em", color: "#0D0D0B" }}>THE<br />WORK<br /><span style={{ color: "#A07830" }}>SHIFT.</span></h1>
          </div>
          <div className="p-6 md:p-10 lg:p-[52px]" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p style={{ fontSize: "15px", color: "#7A7870", lineHeight: 1.9, fontWeight: 300, marginBottom: "32px" }}>The workplace now has four actors: the Employee, the CXO, the Organisation — and AI. Each faces a different structural challenge. The AI Edge Lab is the framework that maps what that means for all four.</p>
            <div style={{ display: "flex", gap: "32px", marginBottom: "32px", flexWrap: "wrap" }}>
              {[{ n: "23%", l: "Scaled AI · McKinsey" },{ n: "90%", l: "Fail to exit pilot" },{ n: "78%", l: "Governance lags · EY" }].map((s, i) => (
                <div key={i} style={{ borderLeft: "1px solid rgba(13,13,11,0.18)", paddingLeft: "16px" }}>
                  <div style={{ fontFamily: "'Bebas Neue','DM Sans',sans-serif", fontSize: "32px", color: "#0D0D0B", lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#7A7870", marginTop: "4px" }}>{s.l}</div>
                </div>
              ))}
            </div>
            <a href="#diagnostic" style={{ display: "inline-flex", alignItems: "center", gap: "10px", fontFamily: "'DM Mono',monospace", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#0D0D0B", borderBottom: "1px solid rgba(13,13,11,0.18)", paddingBottom: "6px", textDecoration: "none" }}>Take the Diagnostic <span style={{ fontSize: "14px", fontWeight: 200 }}>+</span></a>
          </div>
        </div>
      </section>

      {/* ── FOUR ACTORS ── */}
      <section id="actors" style={{ borderBottom: "1px solid rgba(13,13,11,0.1)" }}>
        <div className="flex items-center justify-between px-6 md:px-[52px] py-4" style={{ borderBottom: "1px solid rgba(13,13,11,0.1)", background: "#EEECEA" }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "14px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#7A7870" }}>The Four Actors of the AI Workplace</span>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: "#B0AEA8" }}>02 / 06</span>
        </div>
        <div className="p-6 md:p-10 lg:p-[52px]">
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ marginBottom: "48px" }}>
            <div className="md:border-r pr-0 md:pr-6 lg:pr-[52px] pb-6 md:pb-0" style={{ borderColor: "rgba(13,13,11,0.1)" }}>
              <h2 style={{ fontFamily: "'Bebas Neue','DM Sans',sans-serif", fontSize: "clamp(52px,7vw,88px)", lineHeight: 0.95, color: "#0D0D0B", marginBottom: "28px" }}>THE<br /><span style={{ color: "#A07830" }}>FOUR</span><br />ACTORS.</h2>
            </div>
            <div className="pl-0 md:pl-6 lg:pl-[52px]" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <p style={{ fontSize: "15px", color: "#7A7870", lineHeight: 1.9, fontWeight: 300 }}>For decades, three actors shaped work: the employee, the leader, and the organisation. AI has entered as a fourth — not as a tool in the org chart, but as an actor that absorbs work, reprices what humans do, and forces every other actor to reckon with their structural position.</p>
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
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7A7870", border: "1px solid rgba(13,13,11,0.18)", padding: "4px 10px" }}>{actor.badge}</div>
              </div>
              <div style={{ fontFamily: "'Bebas Neue','DM Sans',sans-serif", fontSize: "clamp(28px,3vw,38px)", letterSpacing: "0.02em", color: "#0D0D0B", marginBottom: "12px", lineHeight: 1 }}>{actor.name[0]}<span style={{ color: "#A07830" }}>{actor.name[1]}</span></div>
              <div style={{ fontSize: "13px", fontStyle: "italic", color: "#7A7870", lineHeight: 1.75, borderLeft: "2px solid rgba(13,13,11,0.18)", paddingLeft: "14px", marginBottom: "20px", fontWeight: 300 }}>{actor.q}</div>
              <p style={{ fontSize: "14px", color: "#7A7870", lineHeight: 1.85, marginBottom: "22px", fontWeight: 300 }}>{actor.body}</p>
              <div style={{ marginBottom: "24px" }}>
                {actor.sigs.map((sig, j) => (
                  <div key={j} style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", letterSpacing: "0.04em", color: "#2E2E2C", padding: "7px 0", borderBottom: "1px solid rgba(13,13,11,0.1)", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "#A07830" }}>→</span>{sig}
                  </div>
                ))}
              </div>
              <a href="#diagnostic" style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#0D0D0B", display: "inline-flex", alignItems: "center", gap: "8px", borderBottom: "1px solid rgba(13,13,11,0.1)", paddingBottom: "4px", textDecoration: "none" }}>
                {actor.cta} <span style={{ color: "#A07830" }}>→</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── DOCTRINE ── */}
      <section id="doctrine" style={{ borderBottom: "1px solid rgba(13,13,11,0.1)" }}>
        <div className="flex items-center justify-between px-6 md:px-[52px] py-4" style={{ borderBottom: "1px solid rgba(13,13,11,0.1)", background: "#EEECEA" }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#7A7870" }}>The AI Edge Doctrine — Three Laws</span>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: "#B0AEA8" }}>03 / 06</span>
        </div>
        <div className="p-6 md:p-10 lg:p-[52px]">
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ marginBottom: "40px" }}>
            <div className="md:border-r pr-0 md:pr-6 lg:pr-[52px] pb-6 md:pb-0" style={{ borderColor: "rgba(13,13,11,0.1)" }}>
              <h2 style={{ fontFamily: "'Bebas Neue','DM Sans',sans-serif", fontSize: "clamp(52px,7vw,88px)", lineHeight: 0.95, color: "#0D0D0B", marginBottom: "28px" }}>THE<br />THREE<br /><span style={{ color: "#A07830" }}>LAWS.</span></h2>
            </div>
            <div className="pl-0 md:pl-6 lg:pl-[52px]" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <p style={{ fontSize: "15px", color: "#7A7870", lineHeight: 1.9, fontWeight: 300 }}>These are not predictions. They are structural observations about what is already happening — in the data, in organisations, in the careers of professionals who feel the compression without yet having a name for it.</p>
            </div>
          </div>
        </div>
        {/* Law cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 px-6 md:px-[52px] pb-6 md:pb-[52px]" style={{ gap: "16px", marginTop: "0" }}>
          {[
            { num: "Law I · Intelligence Abundance", title: "AS INTELLIGENCE APPROACHES ZERO COST, ITS VALUE IN WORK DECLINES.", body: "Research synthesis, data modelling, report generation — now accessible at marginal cost. Roles that derived value from producing structured intelligence face direct structural repricing. This is not a future risk. It is a present economic condition." },
            { num: "Law II · Judgment Scarcity", title: "AS INTELLIGENCE BECOMES CHEAP, JUDGMENT BECOMES THE SCARCE RESOURCE.", body: "Judgment operates where inputs are ambiguous, stakes are high, and consequences are owned by a person. AI can be directed by judgment. It cannot exercise it. The economic premium migrates from intelligence to judgment." },
            { num: "Law III · The Compression Curve", title: "AI COMPRESSES WORK FROM EXECUTION UPWARD UNTIL JUDGMENT BECOMES THE BOUNDARY.", body: "Compression moves in predictable sequence: execution first, analysis next, insight partially, judgment last. This creates a structural line: above it, human value compounds; below it, it compresses." },
          ].map((law, i) => (
            <div key={i} style={{ background: "#FFFFFF", border: "1px solid rgba(13,13,11,0.12)", borderTop: "3px solid #A07830", padding: "32px 28px", boxShadow: "0 2px 12px rgba(13,13,11,0.06)" }}>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#A07830", marginBottom: "16px" }}>{law.num}</div>
              <div style={{ fontFamily: "'Bebas Neue','DM Sans',sans-serif", fontSize: "20px", lineHeight: 1.2, color: "#0D0D0B", marginBottom: "16px", letterSpacing: "0.02em" }}>{law.title}</div>
              <p style={{ fontSize: "13px", color: "#7A7870", lineHeight: 1.85, fontWeight: 300 }}>{law.body}</p>
            </div>
          ))}
        </div>

        {/* Era cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 px-6 md:px-[52px] pb-[52px]" style={{ gap: "16px" }}>
          {[
            { label: "Industrial Age", resource: "Physical Labour", desc: "Organisations built for efficiency of physical execution. Headcount = capacity. Management = coordination of effort.", now: false },
            { label: "Knowledge Economy", resource: "Analytical Intelligence", desc: "Organisations built for production of structured thinking. Talent = premium intelligence. Management = analysis to decisions.", now: false },
            { label: "AI Era · Present", resource: "Judgment", desc: "Organisations built for consequence-bearing decision ownership. Advantage = framing, deciding, being accountable. Architecture = concentration of judgment.", now: true },
          ].map((era, i) => (
            <div key={i} style={{ background: "#FFFFFF", border: "1px solid rgba(13,13,11,0.12)", borderTop: "3px solid #A07830", padding: "32px 28px", position: "relative", boxShadow: "0 2px 12px rgba(13,13,11,0.06)" }}>
              {era.now && (
                <div style={{ position: "absolute", top: "16px", right: "16px", fontFamily: "'DM Mono',monospace", fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", background: "#A07830", color: "#F7F6F3", padding: "3px 8px" }}>Now</div>
              )}
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#B0AEA8", marginBottom: "16px" }}>{era.label}</div>
              <div style={{ fontFamily: "'Bebas Neue','DM Sans',sans-serif", fontSize: "clamp(24px,2.5vw,32px)", letterSpacing: "0.02em", color: "#0D0D0B", marginBottom: "12px" }}>{era.resource}</div>
              <p style={{ fontSize: "13px", color: "#7A7870", lineHeight: 1.75, fontWeight: 300 }}>{era.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PULLQUOTE ── */}
      <div style={{ padding: "52px", background: "#0D0D0B", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }} className="px-6 md:px-[52px]">
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "10px", letterSpacing: "0.26em", textTransform: "uppercase", color: "#A07830", marginBottom: "32px" }}>The Doctrine in One Sentence · AI Edge Lab · 2026</div>
        <div style={{ fontFamily: "'Bebas Neue','DM Sans',sans-serif", fontSize: "clamp(28px,4.5vw,54px)", lineHeight: 1.1, letterSpacing: "0.02em", color: "#F7F6F3", width: "100%" }}>
          <div>AI DOES NOT ELIMINATE WORK FIRST.</div>
          <div>IT ELIMINATES THE <span style={{ color: "#C49848" }}>STRUCTURAL PREMIUM</span> ON INTELLIGENCE INSIDE WORK.</div>
        </div>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: "#A07830", marginTop: "32px", letterSpacing: "0.12em", textTransform: "uppercase" }}>Nitin Nahata · CHRO, Gameskraft · Founder, Axionindex</div>
      </div>

      {/* ── FRAMEWORK ── */}
      <section id="framework" style={{ borderBottom: "1px solid rgba(13,13,11,0.1)" }}>
        <div className="flex items-center justify-between px-6 md:px-[52px] py-4" style={{ borderBottom: "1px solid rgba(13,13,11,0.1)", background: "#EEECEA" }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#7A7870" }}>The E.D.G.E. Framework — The Six Work Types</span>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: "#B0AEA8" }}>04 / 06</span>
        </div>
        <div className="p-6 md:p-10 lg:p-[52px]">
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "0" }}>
            {/* Left: E.D.G.E. */}
            <div className="md:border-r pr-0 md:pr-6 lg:pr-[52px] pb-8 md:pb-0" style={{ borderColor: "rgba(13,13,11,0.1)" }}>
              <h2 style={{ fontFamily: "'Bebas Neue','DM Sans',sans-serif", fontSize: "clamp(44px,6vw,72px)", lineHeight: 0.95, color: "#0D0D0B", marginBottom: "20px" }}>YOUR<br /><span style={{ color: "#A07830" }}>STRUCTURAL</span><br />POSITION.</h2>
              <p style={{ fontSize: "14px", color: "#7A7870", lineHeight: 1.9, fontWeight: 300, marginBottom: "28px" }}>Four dimensions that make your structural position visible. The measurement architecture behind the AI Edge Diagnostic.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "rgba(13,13,11,0.1)" }}>
                {[
                  { letter: "E", name: "Exposure", desc: "Proportion of work that is AI-compressible.", dir: "Lower = structurally stronger" },
                  { letter: "D", name: "Decision Density", desc: "Consequence-bearing judgment owned per unit of work.", dir: "Higher = compounding position" },
                  { letter: "G", name: "Growth of Boundary", desc: "Whether decision authority is expanding or contracting over 24 months.", dir: "Expanding = widening advantage" },
                  { letter: "E", name: "Economic Anchoring", desc: "Whether compensation is tied to scarce contribution.", dir: "Anchored = salary structurally durable" },
                ].map((item, i) => (
                  <div key={i} style={{ background: "#F7F6F3", padding: "20px 24px", display: "grid", gridTemplateColumns: "36px 1fr", gap: "0", alignItems: "start" }}>
                    <div style={{ fontFamily: "'Bebas Neue','DM Sans',sans-serif", fontSize: "28px", color: "#A07830", lineHeight: 1, marginTop: "2px" }}>{item.letter}</div>
                    <div style={{ paddingLeft: "12px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 500, color: "#0D0D0B", marginBottom: "4px", letterSpacing: "0.01em" }}>{item.name}</div>
                      <div style={{ fontSize: "12px", color: "#7A7870", lineHeight: 1.6, fontWeight: 300 }}>{item.desc}</div>
                      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "10px", color: "#A07830", marginTop: "5px", letterSpacing: "0.06em" }}>{item.dir}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right: Six Work Types */}
            <div className="pl-0 md:pl-6 lg:pl-[52px]">
              <h3 style={{ fontFamily: "'Bebas Neue','DM Sans',sans-serif", fontSize: "22px", letterSpacing: "0.03em", color: "#0D0D0B", marginBottom: "6px" }}>THE SIX WORK TYPES.</h3>
              <p style={{ fontFamily: "'DM Mono',monospace", fontSize: "10px", letterSpacing: "0.1em", color: "#B0AEA8", marginBottom: "0", textTransform: "uppercase" }}>AI compression coefficients by work type</p>
              <div style={{ marginTop: "0" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 60px", padding: "8px 0", borderBottom: "1px solid rgba(13,13,11,0.18)" }}>
                  {["Work Type","Compression","%"].map((h, i) => (
                    <span key={i} style={{ fontFamily: "'DM Mono',monospace", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#B0AEA8", textAlign: i === 2 ? "right" : "left" }}>{h}</span>
                  ))}
                </div>
                {[
                  { name: "Framing & Problem Definition", pct: 5, color: "#5A9E7A" },
                  { name: "Deciding & Directing", pct: 8, color: "#5A9E7A" },
                  { name: "Influencing & Convening", pct: 20, color: "#A07830", divider: true },
                  { name: "Synthesising & Interpreting", pct: 45, color: "#A07830" },
                  { name: "Researching & Analysing", pct: 75, color: "#B84040", divider: true },
                  { name: "Executing & Coordinating", pct: 85, color: "#B84040" },
                ].map((row, i, arr) => (
                  <div key={i}>
                    {row.divider && <div style={{ height: "1px", background: "#A07830", opacity: 0.2, margin: "2px 0" }} />}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 60px", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(13,13,11,0.1)" }}>
                      <div style={{ fontSize: "13px", color: "#0D0D0B", fontWeight: 300 }}>{row.name}</div>
                      <div style={{ position: "relative", height: "3px", background: "#E2E0DC", borderRadius: "2px", overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: "2px", background: row.color, width: `${row.pct}%` }} />
                      </div>
                      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", textAlign: "right", color: row.color }}>~{row.pct}%</div>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ fontFamily: "'DM Mono',monospace", fontSize: "10px", color: "#B0AEA8", marginTop: "12px", letterSpacing: "0.06em" }}>AI Edge Lab methodology, 2026. Coefficients represent the proportion of work type deliverables that AI can produce at comparable quality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── DIAGNOSTIC ── */}
      <section id="diagnostic" style={{ borderBottom: "1px solid rgba(13,13,11,0.1)" }}>
        <div className="flex items-center justify-between px-6 md:px-[52px] py-4" style={{ borderBottom: "1px solid rgba(13,13,11,0.1)", background: "#EEECEA" }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#7A7870" }}>Assessment Suite — ARI™ · BDI™ · ORG AI DARS™</span>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: "#B0AEA8" }}>05 / 06</span>
        </div>
        <div className="p-6 md:p-10 lg:p-[52px]">
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ marginBottom: "40px" }}>
            <div className="md:border-r pr-0 md:pr-6 lg:pr-[52px] pb-6 md:pb-0" style={{ borderColor: "rgba(13,13,11,0.1)" }}>
              <h2 style={{ fontFamily: "'Bebas Neue','DM Sans',sans-serif", fontSize: "clamp(44px,6vw,72px)", lineHeight: 0.95, color: "#0D0D0B" }}>MEASURE<br />YOUR<br /><span style={{ color: "#A07830" }}>POSITION.</span></h2>
            </div>
            <div className="pl-0 md:pl-6 lg:pl-[52px]" style={{ display: "flex", alignItems: "center" }}>
              <p style={{ fontSize: "15px", color: "#7A7870", lineHeight: 1.9, fontWeight: 300 }}>You cannot redesign what you cannot see. The AI Edge assessment suite makes structural position visible — for individuals, leaders, and organisations.</p>
            </div>
          </div>
          {/* Two diagnostic cards */}
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "1px", background: "rgba(13,13,11,0.1)", marginBottom: "1px" }}>
            <div style={{ background: "#F7F6F3", padding: "48px 40px" }}>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#7A7870", marginBottom: "16px" }}>For Individuals · Free</div>
              <div style={{ fontFamily: "'Bebas Neue','DM Sans',sans-serif", fontSize: "36px", letterSpacing: "0.02em", color: "#0D0D0B", marginBottom: "10px" }}>Quick Mirror™</div>
              <div style={{ fontFamily: "'Bebas Neue','DM Sans',sans-serif", fontSize: "44px", color: "#A07830", lineHeight: 1, marginBottom: "4px" }}>Free</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: "#7A7870", letterSpacing: "0.1em", marginBottom: "24px" }}>Under 3 minutes · Immediate result · No registration</div>
              <p style={{ fontSize: "13px", color: "#7A7870", lineHeight: 1.85, marginBottom: "28px", fontWeight: 300 }}>A rapid structural position check. Nine targeted questions that reveal your AI compression zone, primary work type, and initial Edge Score.</p>
              <div style={{ display: "flex", flexDirection: "column", marginBottom: "36px" }}>
                {["Initial Edge Score (0–100)","Primary compression zone","Dominant work type","One structural recommendation"].map((f, i) => (
                  <div key={i} style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", letterSpacing: "0.04em", color: "#7A7870", padding: "8px 0", borderBottom: "1px solid rgba(13,13,11,0.1)", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ color: "#A07830" }}>—</span>{f}
                  </div>
                ))}
              </div>
              <a href="#" style={{ display: "inline-block", fontFamily: "'DM Mono',monospace", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", padding: "12px 24px", background: "#A07830", color: "#F7F6F3", textDecoration: "none" }}>Start Quick Mirror →</a>
            </div>
            <div style={{ background: "#0D0D0B", padding: "48px 40px" }}>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(247,246,243,0.4)", marginBottom: "16px" }}>AI Replaceability Index™</div>
              <div style={{ fontFamily: "'Bebas Neue','DM Sans',sans-serif", fontSize: "36px", letterSpacing: "0.02em", color: "#F7F6F3", marginBottom: "10px" }}>Full ARI™ Diagnostic</div>
              <div style={{ fontFamily: "'Bebas Neue','DM Sans',sans-serif", fontSize: "44px", color: "#A07830", lineHeight: 1, marginBottom: "4px" }}>₹400</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: "rgba(247,246,243,0.4)", letterSpacing: "0.1em", marginBottom: "24px" }}>Under 12 minutes · Full structural report</div>
              <p style={{ fontSize: "13px", color: "rgba(247,246,243,0.6)", lineHeight: 1.85, marginBottom: "28px", fontWeight: 300 }}>Complete structural position assessment across all four E.D.G.E. dimensions. Produces a full report with Edge Score, band classification, and personalised structural roadmap.</p>
              <div style={{ display: "flex", flexDirection: "column", marginBottom: "36px" }}>
                {["Full E.D.G.E. score — all four dimensions","Edge band: Accelerating / Holding / Thinning","Role Composition Map — six work types","Salary Sustainability Index (SSI)","Personalised structural roadmap"].map((f, i) => (
                  <div key={i} style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", letterSpacing: "0.04em", color: "rgba(247,246,243,0.45)", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ color: "#A07830" }}>—</span>{f}
                  </div>
                ))}
              </div>
              <a href="#" style={{ display: "inline-block", fontFamily: "'DM Mono',monospace", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", padding: "12px 24px", background: "#F7F6F3", color: "#0D0D0B", textDecoration: "none" }}>Take Full Diagnostic →</a>
            </div>
          </div>
          {/* Org products */}
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "1px", background: "rgba(13,13,11,0.1)" }}>
            {[
              { tag: "For Leaders", name: "BDI™ — Brainpower Density Index", body: "What is the ratio of judgment work to intelligence work across your leadership layer? Measures whether your senior people are in AI-compressible territory.", status: "Waitlist Open" },
              { tag: "For CHROs · Enterprise", name: "ORG AI DARS™", body: "Organisational Decision Architecture Realignment System. Redesigns roles, decision rights, and leadership layers using Brainpower Density data at population scale.", status: "Enterprise Engagement" },
              { tag: "Coming · 2026", name: "8-Signal Org Diagnostic", body: "Places your organisation on the Four-Stage Maturity Model — AI Leveraged, AI Enabled, AI First, or AI Born — using eight structural signals.", status: "In Development" },
            ].map((card, i) => (
              <div key={i} style={{ background: "#EEECEA", padding: "32px 28px" }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#A07830", marginBottom: "12px" }}>{card.tag}</div>
                <div style={{ fontFamily: "'Bebas Neue','DM Sans',sans-serif", fontSize: "20px", letterSpacing: "0.02em", color: "#0D0D0B", marginBottom: "10px" }}>{card.name}</div>
                <p style={{ fontSize: "13px", color: "#7A7870", lineHeight: 1.8, marginBottom: "14px", fontWeight: 300 }}>{card.body}</p>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "10px", letterSpacing: "0.14em", color: "#B0AEA8", textTransform: "uppercase" }}>{card.status}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EVIDENCE ── */}
      <section id="evidence" style={{ borderBottom: "1px solid rgba(13,13,11,0.1)" }}>
        <div className="flex items-center justify-between px-6 md:px-[52px] py-4" style={{ borderBottom: "1px solid rgba(13,13,11,0.1)", background: "#EEECEA" }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#7A7870" }}>The Evidence — 12 Reports · 6 Months</span>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: "#B0AEA8" }}>05.5 / 06</span>
        </div>
        <div className="p-6 md:p-10 lg:p-[52px]" style={{ paddingBottom: 0 }}>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ marginBottom: "40px" }}>
            <div className="md:border-r pr-0 md:pr-6 lg:pr-[52px] pb-6 md:pb-0" style={{ borderColor: "rgba(13,13,11,0.1)" }}>
              <h2 style={{ fontFamily: "'Bebas Neue','DM Sans',sans-serif", fontSize: "clamp(44px,6vw,72px)", lineHeight: 0.95, color: "#0D0D0B" }}>NOT A<br />PREDICTION.<br /><span style={{ color: "#A07830" }}>A PATTERN.</span></h2>
            </div>
            <div className="pl-0 md:pl-6 lg:pl-[52px]" style={{ display: "flex", alignItems: "center" }}>
              <p style={{ fontSize: "15px", color: "#7A7870", lineHeight: 1.9, fontWeight: 300 }}>Twelve major reports published in the last six months confirm what the AI Edge doctrine has been mapping. The convergence is now unmistakable.</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: "1px", background: "rgba(13,13,11,0.1)" }}>
          {[
            { stat: "23%", label: "Have actually scaled AI", body: "Everyone is experimenting. Only 23% have scaled. Investment and experimentation are not structural transformation.", src: "McKinsey · State of AI 2025" },
            { stat: "90%", label: "Best use cases fail to exit pilot", body: "Nine in ten best agentic use cases never scale. The technology works. The architecture hasn't changed.", src: "McKinsey · Agentic AI Advantage, 2026" },
            { stat: "78%", label: "Governance can't keep up", body: "Most leaders admit governance lags their own AI rollout. The two unanswered questions made visible.", src: "EY · AI Pulse Survey Wave 3, 2026" },
            { stat: "HR", label: "Primary agentic AI landing zone", body: "Finance and HR are where agentic AI lands first — ahead of IT and all other functions.", src: "PwC · 2026 AI Business Predictions" },
            { stat: "CEO", label: "Calling AI shots — not CTO", body: "AI budgets doubling. The governance of AI has moved from engineering to executive. New buyer confirmed.", src: "BCG · AI Radar 2026" },
            { stat: "$200B", label: "Value available — uncaptured", body: "There is $200 billion in new AI-driven value available. Most organisations are not positioned to capture it.", src: "BCG · The $200B Opportunity, 2026" },
          ].map((ev, i) => (
            <div key={i} style={{ background: "#F7F6F3", padding: "36px 28px" }}>
              <div style={{ fontFamily: "'Bebas Neue','DM Sans',sans-serif", fontSize: "clamp(44px,5vw,64px)", color: "#0D0D0B", lineHeight: 0.9, marginBottom: "12px", letterSpacing: "0.01em" }}>{ev.stat}</div>
              <div style={{ fontSize: "13px", fontWeight: 500, color: "#0D0D0B", marginBottom: "8px", lineHeight: 1.35 }}>{ev.label}</div>
              <p style={{ fontSize: "12px", color: "#7A7870", lineHeight: 1.75, marginBottom: "12px", fontWeight: 300 }}>{ev.body}</p>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "10px", color: "#B0AEA8", letterSpacing: "0.08em" }}>{ev.src}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ borderBottom: "1px solid rgba(13,13,11,0.1)" }}>
        <div className="flex items-center justify-between px-6 md:px-[52px] py-4" style={{ borderBottom: "1px solid rgba(13,13,11,0.1)", background: "#EEECEA" }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#7A7870" }}>About the AI Edge Lab — Nitin Nahata</span>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: "#B0AEA8" }}>06 / 06</span>
        </div>
        <div className="p-6 md:p-10 lg:p-[52px]">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]" style={{ gap: "0" }}>
            <div className="md:border-r pr-0 md:pr-[52px] pb-8 md:pb-0" style={{ borderColor: "rgba(13,13,11,0.1)" }}>
              <div style={{ width: "100%", aspectRatio: "3/4", marginBottom: "24px", overflow: "hidden" }}>
                <img src="/nitishhh.png" alt="Nitin Nahata" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 39%", display: "block" }} />
              </div>
              <div style={{ fontFamily: "'Bebas Neue','DM Sans',sans-serif", fontSize: "32px", letterSpacing: "0.02em", color: "#0D0D0B", marginBottom: "4px" }}>NITIN NAHATA</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "10px", letterSpacing: "0.18em", color: "#A07830", textTransform: "uppercase", marginBottom: "20px" }}>CHRO · Organisational Architect · Founder</div>
              {[["CHRO","Gameskraft"],["Founder","Axionindex"],["Creator","AI Edge Diagnostic™"],["Founder","HROS"]].map(([role, org], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: "'DM Mono',monospace", fontSize: "11px", color: "#7A7870", padding: "8px 0", borderBottom: "1px solid rgba(13,13,11,0.1)", letterSpacing: "0.04em" }}>
                  <span>{role}</span><span>{org}</span>
                </div>
              ))}
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "11px", color: "#A07830", marginTop: "16px", letterSpacing: "0.06em" }}>nitin@axionindex.org</div>
            </div>
            <div className="pl-0 md:pl-[52px]">
              <div style={{ marginBottom: "8px" }}>
                {[
                  "Nitin Nahata is a CHRO and organisational architect whose work centres on a single structural question: how do organisations and the people inside them evolve when intelligence becomes abundant?",
                  "Two decades across institutions and high-growth companies have shaped his thinking on the architecture of decision-making, the future structure of work, and how organisations redesign talent systems in the AI era.",
                  "As CHRO of Gameskraft, he sees firsthand how AI is changing the structure of work inside a fast-scaling organisation. As Founder of Axionindex, he is building the frameworks and instruments to measure and redesign those changes at scale.",
                ].map((para, i) => (
                  <p key={i} style={{ fontSize: "14px", color: "#7A7870", lineHeight: 1.9, marginBottom: "14px", fontWeight: 300 }}>{para}</p>
                ))}
              </div>
              <div style={{ background: "#EEECEA", padding: "28px 32px", marginTop: "8px", borderLeft: "2px solid #A07830" }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#7A7870", marginBottom: "14px" }}>The Conviction</div>
                <div style={{ fontFamily: "'Bebas Neue','DM Sans',sans-serif", fontSize: "clamp(18px,2.5vw,26px)", lineHeight: 1.1, letterSpacing: "0.02em", color: "#0D0D0B" }}>
                  "THE QUESTION IS NOT WHETHER AI WILL CHANGE YOUR WORK. IT IS WHETHER YOU UNDERSTAND THE <span style={{ color: "#A07830" }}>STRUCTURE</span> OF THAT CHANGE."
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section style={{ background: "#0D0D0B", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Skyline image */}
        <div style={{ width: "100%", height: "220px", background: "linear-gradient(160deg,#1C1E24 0%,#252821 50%,#1E1E1A 100%)", position: "relative", overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60%", background: "rgba(0,0,0,0.7)", clipPath: "polygon(0% 100%,0% 40%,2% 40%,2% 20%,3% 20%,3% 10%,4% 10%,4% 20%,5% 20%,5% 40%,8% 40%,8% 25%,9% 25%,9% 15%,10% 15%,10% 25%,11% 25%,11% 40%,14% 40%,14% 30%,15% 30%,15% 18%,16% 18%,16% 30%,17% 30%,17% 40%,20% 40%,20% 22%,21% 22%,21% 12%,22% 12%,22% 22%,23% 22%,23% 40%,26% 40%,26% 32%,27% 32%,27% 24%,28% 24%,28% 32%,29% 32%,29% 40%,33% 40%,33% 18%,34% 18%,34% 8%,35% 8%,35% 18%,36% 18%,36% 40%,40% 40%,40% 28%,41% 28%,41% 18%,42% 18%,42% 28%,43% 28%,43% 40%,48% 40%,48% 20%,49% 20%,49% 10%,50% 10%,50% 20%,51% 20%,51% 40%,55% 40%,55% 30%,56% 30%,56% 22%,57% 22%,57% 30%,58% 30%,58% 40%,63% 40%,63% 24%,64% 24%,64% 14%,65% 14%,65% 24%,66% 24%,66% 40%,70% 40%,70% 32%,71% 32%,71% 24%,72% 24%,72% 32%,73% 32%,73% 40%,78% 40%,78% 20%,79% 20%,79% 12%,80% 12%,80% 20%,81% 20%,81% 40%,85% 40%,85% 30%,86% 30%,86% 40%,90% 40%,90% 24%,91% 24%,91% 16%,92% 16%,92% 24%,93% 24%,93% 40%,97% 40%,97% 32%,98% 32%,98% 40%,100% 40%,100% 100%)" }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 md:p-10 lg:p-[52px] md:border-r" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "10px", letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(247,246,243,0.3)", marginBottom: "24px" }}>AI Edge Diagnostic™ · Available Now · axionindex.org</div>
            <h2 style={{ fontFamily: "'Bebas Neue','DM Sans',sans-serif", fontSize: "clamp(52px,7vw,84px)", lineHeight: 0.95, letterSpacing: "0.01em", color: "#F7F6F3" }}>
              WHERE IS<br />YOUR<br /><span style={{ color: "#C49848" }}>STRUCTURAL</span><br />POSITION<br />TODAY?
            </h2>
          </div>
          <div className="p-6 md:p-10 lg:p-[52px]" style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <p style={{ fontSize: "14px", color: "rgba(247,246,243,0.5)", lineHeight: 1.9, marginBottom: "32px", fontWeight: 300 }}>The AI Edge Diagnostic measures your position relative to the compression line — across six work types, four E.D.G.E. dimensions, and two ownership signals. Under twelve minutes. Private. Immediate result.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-start" }}>
              <a href="#" style={{ display: "inline-block", fontFamily: "'DM Mono',monospace", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", padding: "13px 24px", background: "#F7F6F3", color: "#0D0D0B", textDecoration: "none" }}>Free Quick Mirror →</a>
              <a href="#" style={{ display: "inline-block", fontFamily: "'DM Mono',monospace", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", padding: "13px 24px", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(247,246,243,0.6)", textDecoration: "none" }}>Full ARI™ Diagnostic — ₹400</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: "28px 52px", background: "#0D0D0B", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "14px", borderTop: "1px solid rgba(255,255,255,0.06)" }} className="px-6 md:px-[52px]">
        <div style={{ fontFamily: "'Bebas Neue','DM Sans',sans-serif", fontSize: "16px", letterSpacing: "0.04em", color: "#F7F6F3" }}>AI EDGE LAB · AXIONINDEX · 2026</div>
        <div style={{ display: "flex", gap: "20px" }}>
          {[["#doctrine","Doctrine"],["#framework","Framework"],["#diagnostic","Diagnostic"],["#about","About"],["mailto:nitin@axionindex.org","Contact"]].map(([href, label]) => (
            <a key={href} href={href} style={{ fontFamily: "'DM Mono',monospace", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#F7F6F3", textDecoration: "none" }}>{label}</a>
          ))}
        </div>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "10px", color: "#F7F6F3", letterSpacing: "0.06em" }}>© 2026 AI Edge Lab · axionindex.org</div>
      </footer>

    </div>
  );
}
