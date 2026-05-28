"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ─── Persona Router Modal ─── */
const INST: Record<string, {
  tag: string; name: string; body: string;
  tiers: { n: string; d: string; p: string; u: string; wait?: boolean; enq?: boolean }[];
  note: string;
}> = {
  aspiring: {
    tag: "AAI© · AI Alignment Index", name: "AI Alignment Index",
    body: "For those entering the workforce. Maps whether the foundations you're building stay relevant as AI absorbs executional and analytical work — and where to concentrate so your edge compounds from the start.",
    tiers: [
      { n: "AAI© Report", d: "Full alignment report, delivered within 48h", p: "₹499", u: "$15", wait: true },
      { n: "AAI© + Consultation", d: "Report plus a foundation-building session", p: "₹2,499", u: "$69", wait: true },
    ],
    note: "AAI© is on waitlist — join and you'll be notified at launch. Report delivered within 48 hours of completion.",
  },
  working: {
    tag: "ARI© · AI Replaceability Index", name: "AI Replaceability Index",
    body: "For working professionals. A complete structural position assessment across all four E.D.G.E. dimensions — Edge Score, band, Role Composition Map, Salary Sustainability Index, and a personalised structural roadmap.",
    tiers: [
      { n: "ARI© Report", d: "Full structural report, delivered within 48h", p: "₹999", u: "$29" },
      { n: "ARI© + Consultation", d: "The report plus a 45-min structural debrief", p: "₹3,999", u: "$129" },
    ],
    note: "Payment is taken before the diagnostic begins. Your report is prepared and delivered within 48 hours.",
  },
  leader: {
    tag: "BDI© · Brainpower Density Index", name: "Brainpower Density Index",
    body: "For leaders and CXOs. Measures the ratio of judgment work to intelligence work across your leadership layer — whether your senior people sit in AI-compressible territory, and where to redesign decision architecture.",
    tiers: [
      { n: "BDI© Report", d: "Brainpower Density report for your layer", p: "₹4,999", u: "$149", wait: true },
      { n: "BDI© + Consultation", d: "The report plus a 60-min leadership debrief", p: "₹9,999", u: "$299", wait: true },
    ],
    note: "BDI© is on waitlist — join and you'll be notified at launch.",
  },
  org: {
    tag: "ORG AI DARS© · Enterprise", name: "ORG AI DARS",
    body: "For organisations. The Organisational Decision Architecture Realignment System redesigns roles, decision rights, and leadership layers using Brainpower Density data at population scale. An enterprise engagement, scoped to your organisation.",
    tiers: [{ n: "Enterprise engagement", d: "Scoped to your organisation", p: "Enquiry", u: "", enq: true }],
    note: "Enterprise engagements begin with a scoping conversation. Contact nitin@axionindex.org.",
  },
};

function PersonaModal({ open, onClose, initialKey }: { open: boolean; onClose: () => void; initialKey?: string }) {
  const [view, setView] = useState<"gate" | "detail">("gate");
  const [key, setKey] = useState<string>(initialKey || "");
  const [cur, setCur] = useState<"inr" | "usd">("inr");

  useEffect(() => {
    if (open) { setView(initialKey ? "detail" : "gate"); setKey(initialKey || ""); }
  }, [open, initialKey]);

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      setCur(tz.includes("Kolkata") || tz.includes("Calcutta") || tz.includes("Asia") ? "inr" : "usd");
    } catch { setCur("inr"); }
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;
  const I = key ? INST[key] : null;

  const handleCta = (t: typeof INST[string]["tiers"][number]) => {
    if (t.enq) {
      window.location.href = "mailto:nitin@axionindex.org?subject=ORG%20AI%20DARS%20enquiry";
    } else {
      alert(`${I?.name} — ${t.n} ${cur === "inr" ? t.p : t.u}\n\nSecure checkout opens here. Payment is taken before the diagnostic begins; report delivered within 48 hours.`);
    }
  };

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(13,13,11,0.55)", backdropFilter: "blur(6px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px", overflowY: "auto" }}>
      <div style={{ background: "#F7F6F3", width: "100%", maxWidth: "680px", border: "1px solid rgba(13,13,11,0.18)", animation: "prUp .5s cubic-bezier(.2,.7,.2,1)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px", borderBottom: "1px solid rgba(13,13,11,0.1)", background: "#EEECEA" }}>
          <span style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#7A7870" }}>AI Edge Diagnostic · Find where your edge is measured</span>
          <button onClick={onClose} style={{ fontFamily: "monospace", fontSize: "14px", color: "#7A7870", cursor: "pointer", background: "none", border: "none" }}>✕ Close</button>
        </div>
        <div style={{ padding: "44px 40px 40px" }}>
          {view === "gate" && (
            <>
              <div style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.24em", textTransform: "uppercase", color: "#A07830", marginBottom: "16px" }}>Step 01 · Who are you in the AI economy?</div>
              <div style={{ fontFamily: "serif", fontSize: "clamp(30px,5vw,46px)", lineHeight: 1, color: "#0D0D0B", marginBottom: "10px" }}>Where is your edge?</div>
              <p style={{ fontSize: "13px", color: "#7A7870", lineHeight: 1.7, marginBottom: "34px" }}>Each actor in the AI workplace faces a different structural challenge — and a different instrument. Choose where you stand.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {(["aspiring","working","leader","org"] as const).map((p, i) => (
                  <button key={p} onClick={() => { setKey(p); setView("detail"); }}
                    style={{ textAlign: "left", width: "100%", border: "1px solid rgba(13,13,11,0.18)", background: "#F7F6F3", padding: "22px 24px", cursor: "pointer", display: "flex", alignItems: "center", gap: "22px" }}>
                    <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#A07830", letterSpacing: "0.1em", flexShrink: 0, width: "22px" }}>0{i+1}</span>
                    <span style={{ flex: 1 }}>
                      <span style={{ display: "block", fontFamily: "serif", fontSize: "26px", color: "#0D0D0B", lineHeight: 1, marginBottom: "7px" }}>
                        {["Aspiring Professional","Working Professional","Leader · CXO","Organisation"][i]}
                      </span>
                      <span style={{ display: "block", fontSize: "12.5px", color: "#7A7870", lineHeight: 1.6, fontStyle: "italic" }}>
                        {['"Am I building the right foundations — or skills AI has already absorbed?"','"Am I structurally positioned — or in the compression zone without knowing it?"','"My advantage was informational. AI eliminated it. What is my new structural role?"','"We invest in AI at scale. Why don\'t outcomes match — and what are we measuring wrong?"'][i]}
                      </span>
                    </span>
                    <span style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#B0AEA8", textAlign: "right", lineHeight: 1.5, flexShrink: 0 }}>
                      {["AAI©\nAlignment Index","ARI©\nReplaceability Index","BDI©\nBrainpower Density","ORG AI DARS©\nEnterprise"][i]}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
          {view === "detail" && I && (
            <>
              <button onClick={() => setView("gate")} style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#7A7870", cursor: "pointer", background: "none", border: "none", marginBottom: "24px" }}>← All actors</button>
              <div style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#A07830", marginBottom: "12px" }}>{I.tag}</div>
              <div style={{ fontFamily: "serif", fontSize: "clamp(34px,6vw,54px)", lineHeight: 0.95, color: "#0D0D0B", marginBottom: "14px" }}>{I.name}</div>
              <p style={{ fontSize: "13.5px", color: "#1A1A18", lineHeight: 1.7, marginBottom: "26px", maxWidth: "560px" }}>{I.body}</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
                {["01 · Choose tier","02 · Secure payment","03 · Complete diagnostic","04 · Report within 48h"].map((s, i) => (
                  <span key={i} style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: i === 0 ? "#A07830" : "#7A7870", border: `1px solid ${i === 0 ? "#A07830" : "rgba(13,13,11,0.1)"}`, padding: "6px 10px" }}>{s}</span>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "rgba(13,13,11,0.1)", border: "1px solid rgba(13,13,11,0.1)", marginBottom: "24px" }}>
                {I.tiers.map((t, i) => (
                  <div key={i} style={{ background: "#F7F6F3", padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                    <span style={{ flex: 1, minWidth: "180px" }}>
                      <span style={{ display: "block", fontSize: "14px", color: "#0D0D0B", marginBottom: "4px" }}>{t.n}</span>
                      <span style={{ display: "block", fontSize: "11.5px", color: "#7A7870", lineHeight: 1.5 }}>{t.d}</span>
                    </span>
                    <span style={{ fontFamily: "serif", fontSize: "26px", color: "#0D0D0B", lineHeight: 1 }}>{cur === "inr" ? t.p : t.u || t.p}{t.u && cur === "inr" ? <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#7A7870" }}> · {t.u}</span> : null}</span>
                    {t.enq ? (
                      <button onClick={() => handleCta(t)} style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", padding: "13px 22px", background: "#0D0D0B", color: "#F7F6F3", border: "1px solid #0D0D0B", cursor: "pointer" }}>Enquire →</button>
                    ) : t.wait ? (
                      <button disabled style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", padding: "13px 22px", background: "none", color: "#0D0D0B", border: "1px solid rgba(13,13,11,0.18)", cursor: "default" }}>Waitlist</button>
                    ) : (
                      <button onClick={() => handleCta(t)} style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", padding: "13px 22px", background: "#0D0D0B", color: "#F7F6F3", border: "1px solid #0D0D0B", cursor: "pointer" }}>Begin · {cur === "inr" ? t.p : t.u} →</button>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ fontFamily: "monospace", fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#A07830", padding: "14px 0", borderTop: "1px solid rgba(13,13,11,0.1)", borderBottom: "1px solid rgba(13,13,11,0.1)", textAlign: "center" }}>
                Private · Confidential · Not shared with your employer
              </div>
              <p style={{ fontFamily: "monospace", fontSize: "11px", color: "#B0AEA8", letterSpacing: "0.06em", marginTop: "20px", lineHeight: 1.8 }}>{I.note}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AIEdgeLab() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState<string | undefined>(undefined);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cur, setCur] = useState<"inr" | "usd">("inr");
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      setCur(tz.includes("Kolkata") || tz.includes("Calcutta") || tz.includes("Asia") ? "inr" : "usd");
    } catch { setCur("inr"); }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      setScrollPct(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openModal = (key?: string) => { setModalKey(key); setModalOpen(true); };

  const price = (inr: string, usd: string) => cur === "inr" ? inr : usd;

  const S = {
    white: "#F7F6F3", white2: "#EEECEA", white3: "#E2E0DC",
    ink: "#0D0D0B", ink2: "#1A1A18", ink3: "#2E2E2C",
    mid: "#7A7870", dim: "#B0AEA8", gold: "#A07830", gold2: "#C49848",
    rule: "rgba(13,13,11,0.1)", rule2: "rgba(13,13,11,0.18)",
    mono: "'DM Mono','Courier New',monospace",
    display: "'Bebas Neue',sans-serif",
    sans: "'DM Sans',system-ui,sans-serif",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,200;0,300;0,400;0,500;1,300&family=DM+Mono:wght@300;400&display=swap');
        @keyframes prUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes edgeRuleDraw { from { transform:scaleX(0); } to { transform:scaleX(1); } }
        .law-row:hover { background:${S.white2}; padding-left:62px; }
        .law-row:hover .law-body { max-height:200px; opacity:1; margin-top:18px; }
        .law-row:hover .law-arrow { opacity:1; transform:translateX(0); }
        .law-row:hover::before { width:3px; }
        .jcard:hover { background:${S.ink}; }
        .jcard:hover .jcard-who { color:${S.white}; }
        .jcard:hover .jcard-n { color:${S.gold2}; }
        .jcard:hover .jcard-inst { color:${S.dim}; }
        .jcard:hover .jcard-price { color:${S.white}; }
        .jcard:hover .jcard-from { color:${S.dim}; }
        .jcard:hover .jcard-go { color:${S.gold2}; gap:12px; }
        .actor:hover { background:${S.white2}; }
        .explore-link:hover { gap:18px; color:${S.gold}; border-color:${S.gold}; }
        .framework-link:hover { gap:18px; color:${S.gold}; border-color:${S.gold}; }
        .ev:hover .ev-stat { color:${S.gold}; }
        .ev:hover .ev-src { color:${S.gold}; }
        .ev:nth-child(even) { background:${S.ink}; }
        .ev:nth-child(even) .ev-stat { color:${S.white}; }
        .ev:nth-child(even) .ev-label { color:${S.white2}; }
        .ev:nth-child(even) .ev-body { color:rgba(247,246,243,0.55); }
        .ev:nth-child(even) .ev-src { color:rgba(247,246,243,0.4); }
        .ev:nth-child(even):hover { background:${S.ink2}; }
        .ev:nth-child(even):hover .ev-stat { color:${S.gold2}; }
        .ev:nth-child(even):hover .ev-src { color:${S.gold2}; }
        .closing-btn-inv:hover { background:${S.white2}; }
        .closing-btn-out:hover { border-color:rgba(247,246,243,0.5); color:${S.white}; }
        .ft-link:hover { color:${S.gold2}; }
        .hdr-link:hover { color:${S.ink}; }
        .pr-persona:hover { border-color:${S.ink}; background:${S.white2}; }
        @media(max-width:768px){
          .law-row { padding:28px 32px; }
          .law-row:hover { padding-left:38px; }
          .law-body { max-height:none !important; opacity:1 !important; margin-top:14px !important; }
        }
      `}</style>

      {/* Progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "2px", background: S.gold, width: `${scrollPct}%`, zIndex: 9999, transition: "width 0.1s" }} />

      <PersonaModal open={modalOpen} onClose={() => setModalOpen(false)} initialKey={modalKey} />

      <div style={{ background: S.white, color: S.ink, fontFamily: S.sans, fontWeight: 300, overflowX: "hidden" }}>

        {/* ── HEADER ── */}
        <header style={{ position: "sticky", top: 0, zIndex: 200, height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 52px", background: "rgba(247,246,243,0.94)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${S.rule}` }}>
          <div style={{ fontFamily: S.mono, fontSize: "13px", letterSpacing: "0.24em", textTransform: "uppercase" }}>AI Edge Lab · <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Axionindex</Link></div>
          <nav className="hidden md:flex" style={{ alignItems: "center", gap: "28px" }}>
            {(["#actors","#doctrine","#framework","#diagnostic","#evidence","#about"] as const).map((href, i) => (
              <a key={href} href={href} className="hdr-link" style={{ fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase", color: S.mid, textDecoration: "none", transition: "color .2s" }}>
                {["Workplace","Doctrine","Framework","Diagnostic","Research","About"][i]}
              </a>
            ))}
            <button onClick={() => openModal("working")} style={{ fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase", background: S.ink, color: S.white, padding: "9px 20px", border: "none", cursor: "pointer" }}>Find My AI Edge</button>
          </nav>
          <div className="hidden md:block" style={{ fontFamily: S.mono, fontSize: "12px", color: S.dim, letterSpacing: "0.08em" }}>axionindex.org · 2026</div>
          <button className="flex md:hidden" onClick={() => setMobileOpen(!mobileOpen)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: S.ink }}>
            {mobileOpen ? "✕" : "☰"}
          </button>
        </header>
        {mobileOpen && (
          <div style={{ background: "rgba(247,246,243,0.98)", borderBottom: `1px solid ${S.rule}`, zIndex: 199, position: "sticky", top: "44px" }}>
            {(["#actors","#doctrine","#framework","#diagnostic","#evidence","#about"] as const).map((href, i) => (
              <a key={href} href={href} onClick={() => setMobileOpen(false)} style={{ display: "block", fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: S.mid, textDecoration: "none", padding: "12px 32px", borderBottom: `1px solid ${S.rule}` }}>
                {["Workplace","Doctrine","Framework","Diagnostic","Research","About"][i]}
              </a>
            ))}
          </div>
        )}

        {/* ── HERO ── */}
        <section>
          <div style={{ width: "100%", height: "300px", background: "linear-gradient(160deg,#1A1C20 0%,#282C32 35%,#353830 65%,#1E1E1A 100%)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg,transparent 0px,transparent 2px,rgba(255,255,255,0.008) 2px,rgba(255,255,255,0.008) 4px)" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "55%", background: "linear-gradient(to top,#0A0B0E 0%,#0E1014 20%,transparent 100%)" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "52%", background: S.ink2, clipPath: "polygon(0% 100%,0% 65%,2% 65%,2% 45%,3% 45%,3% 35%,4% 35%,4% 45%,5% 45%,5% 65%,6% 65%,6% 50%,7% 50%,7% 30%,7.5% 30%,7.5% 28%,8% 28%,8% 30%,8.5% 30%,8.5% 50%,9% 50%,9% 65%,10% 65%,10% 40%,11% 40%,11% 20%,11.5% 20%,11.5% 15%,12% 15%,12% 20%,12.5% 20%,12.5% 40%,13% 40%,13% 65%,14% 65%,14% 50%,14.5% 50%,14.5% 42%,15% 42%,15% 50%,15.5% 50%,15.5% 65%,16% 65%,16% 35%,17% 35%,17% 20%,17.5% 20%,17.5% 10%,18% 10%,18.5% 10%,18.5% 20%,19% 20%,19% 35%,20% 35%,20% 65%,21% 65%,21% 45%,21.5% 45%,21.5% 38%,22% 38%,22% 45%,22.5% 45%,22.5% 65%,24% 65%,24% 42%,25% 42%,25% 28%,25.5% 28%,25.5% 22%,26% 22%,26% 28%,26.5% 28%,26.5% 42%,27% 42%,27% 65%,29% 65%,29% 48%,30% 48%,30% 35%,31% 35%,31% 48%,32% 48%,32% 65%,35% 65%,35% 52%,36% 52%,36% 40%,37% 40%,37% 25%,37.5% 25%,37.5% 18%,38% 18%,38% 25%,38.5% 25%,38.5% 40%,39% 40%,39% 52%,40% 52%,40% 65%,42% 65%,42% 55%,43% 55%,43% 45%,43.5% 45%,43.5% 38%,44% 38%,44% 45%,44.5% 45%,44.5% 55%,45% 55%,45% 65%,48% 65%,48% 48%,49% 48%,49% 32%,50% 32%,50% 20%,50.5% 20%,50.5% 14%,51% 14%,51% 20%,51.5% 20%,51.5% 32%,52% 32%,52% 48%,53% 48%,53% 65%,55% 65%,55% 52%,56% 52%,56% 44%,57% 44%,57% 52%,58% 52%,58% 65%,60% 65%,60% 42%,61% 42%,61% 30%,62% 30%,62% 42%,63% 42%,63% 65%,65% 65%,65% 55%,66% 55%,66% 48%,66.5% 48%,66.5% 42%,67% 42%,67% 48%,67.5% 48%,67.5% 55%,68% 55%,68% 65%,70% 65%,70% 40%,71% 40%,71% 28%,72% 28%,72% 40%,73% 40%,73% 65%,75% 65%,75% 52%,76% 52%,76% 44%,77% 44%,77% 52%,78% 52%,78% 65%,80% 65%,80% 48%,81% 48%,81% 36%,82% 36%,82% 48%,83% 48%,83% 65%,85% 65%,85% 56%,86% 56%,86% 50%,87% 50%,87% 56%,88% 56%,88% 65%,90% 65%,90% 44%,91% 44%,91% 32%,92% 32%,92% 44%,93% 44%,93% 65%,95% 65%,95% 55%,96% 55%,96% 65%,100% 65%,100% 100%)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right,rgba(10,11,14,0.6) 0%,rgba(10,11,14,0.1) 50%,transparent 100%)" }} />
            <div className="hidden md:block" style={{ position: "absolute", right: "44px", top: "50%", transform: "translateY(-50%) rotate(90deg)", transformOrigin: "center center", fontFamily: S.display, fontSize: "48px", letterSpacing: "0.12em", color: "#FFFFFF", whiteSpace: "nowrap" }}>AI EDGE LAB</div>
            <div style={{ position: "absolute", bottom: "32px", left: "52px", fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#FFFFFF" }}>The Architecture of Work in the Post-AI Era · 2026</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ borderBottom: `1px solid ${S.rule}` }}>
            <div style={{ padding: "52px", borderRight: `1px solid ${S.rule}` }} className="p-6 md:p-[52px]">
              <div style={{ fontFamily: S.mono, fontSize: "13px", letterSpacing: "0.24em", textTransform: "uppercase", color: S.mid, marginBottom: "20px" }}>AI Edge Lab · Four Actors · One Transformation</div>
              <h1 style={{ fontFamily: S.display, fontSize: "clamp(64px,9vw,110px)", lineHeight: 0.95, letterSpacing: "0.01em", color: S.ink }}>THE<br />WORK<br /><span style={{ color: S.gold }}>SHIFT.</span></h1>
              <p style={{ fontFamily: S.display, fontSize: "clamp(20px,2.2vw,30px)", color: S.ink, lineHeight: 1.15, letterSpacing: "0.015em", textTransform: "uppercase", marginTop: "28px", maxWidth: "520px" }}>
                Measure where you stand in the AI Era — and how long your <span style={{ color: S.gold }}>edge will hold.</span>
              </p>
              <button onClick={() => openModal("working")} className="explore-link" style={{ display: "inline-flex", alignItems: "center", gap: "12px", fontFamily: S.mono, fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.ink, paddingBottom: "10px", transition: "gap .25s ease,color .25s ease,border-color .25s ease", marginTop: "36px", background: "none", border: "none", borderBottom: `1px solid ${S.ink}`, cursor: "pointer" }}>
                Find My AI Edge <span style={{ fontSize: "18px", fontFamily: S.display }}>→</span>
              </button>
            </div>
            <div style={{ padding: "52px", display: "flex", flexDirection: "column", justifyContent: "space-between" }} className="p-6 md:p-[52px]">
              <div>
                <p style={{ fontSize: "16px", color: S.mid, lineHeight: 1.9, fontWeight: 300, marginBottom: "32px", maxWidth: "400px" }}>The workplace now has four actors: the Employee, the CXO, the Organisation — and AI. Each is being reshaped by a different kind of pressure. AI Edge Lab maps that pressure, measures your exposure, and shows where judgment still creates advantage.</p>
                <div style={{ display: "flex", gap: "32px", marginBottom: "0", flexWrap: "wrap" }}>
                  {[{ n: "39%", l: "Skills change by 2030 · WEF" },{ n: "23%", l: "Scaled AI · McKinsey" },{ n: "95%", l: "No P&L impact · MIT NANDA" }].map((s, i) => (
                    <div key={i} style={{ borderLeft: `1px solid ${S.rule2}`, paddingLeft: "16px" }}>
                      <div style={{ fontFamily: S.display, fontSize: "36px", color: S.ink, lineHeight: 1 }}>{s.n}</div>
                      <div style={{ fontFamily: S.mono, fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: S.mid, marginTop: "4px" }}>{s.l}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => openModal()} className="framework-link" style={{ display: "inline-flex", alignItems: "center", gap: "12px", fontFamily: S.mono, fontSize: "14px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.ink, paddingBottom: "10px", transition: "gap .25s ease,color .25s ease,border-color .25s ease", marginTop: "36px", background: "none", border: "none", borderBottom: `1px solid ${S.ink}`, cursor: "pointer" }}>
                  Explore the Framework <span style={{ fontSize: "20px", fontFamily: S.display }}>→</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── AUDIENCE JOURNEY ── */}
        <section id="start" style={{ borderTop: `1px solid ${S.rule}`, borderBottom: `1px solid ${S.rule}`, background: S.white2 }}>
          <div style={{ padding: "56px 52px 0" }} className="px-6 md:px-[52px] pt-10 md:pt-[56px]">
            <div style={{ fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", color: S.gold, marginBottom: "16px" }}>START HERE · WHERE DO YOU STAND?</div>
            <h2 style={{ fontFamily: S.display, fontSize: "clamp(48px,7vw,96px)", letterSpacing: "0.01em", color: S.ink, lineHeight: 0.95, marginBottom: "14px", textTransform: "uppercase" }}>FIND YOUR <span style={{ color: S.gold }}>EDGE.</span></h2>
            <p style={{ fontSize: "14px", color: S.mid, lineHeight: 1.65, maxWidth: "620px" }}>Four actors, four instruments. Choose where you stand — your assessment is built for it, and your report lands within 48 hours.</p>
          </div>
          {/* E.D.G.E. Fan */}
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ margin: "48px 52px 0", borderTop: `1px solid ${S.rule}`, borderBottom: `1px solid ${S.rule}`, background: S.rule, gap: "1px" }}>
            {[["E","Exposure"],["D","Decision\nDensity"],["G","Growth of\nBoundary"],["E","Economic\nAnchoring"]].map(([letter, term], i) => (
              <div key={i} style={{ background: S.white2, padding: "30px 26px", display: "flex", alignItems: "baseline", gap: "14px" }}>
                <span style={{ fontFamily: S.display, fontSize: "60px", lineHeight: 0.82, color: S.gold, flexShrink: 0 }}>{letter}</span>
                <span style={{ fontFamily: S.mono, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: S.ink3, lineHeight: 1.55, whiteSpace: "pre-line" }}>{term}</span>
              </div>
            ))}
          </div>
          {/* Declare */}
          <div style={{ margin: "56px 52px 0" }} className="mx-6 md:mx-[52px] mt-10 md:mt-[56px]">
            <div style={{ fontFamily: S.display, fontSize: "clamp(28px,3.6vw,52px)", lineHeight: 1, letterSpacing: "0.015em", color: S.ink, marginBottom: "18px" }}>MEASURE YOUR HUMAN ADVANTAGE IN THE <span style={{ color: S.gold }}>AI ERA.</span></div>
            <div style={{ height: "1px", background: S.gold, width: "100%", animation: "edgeRuleDraw 1.3s 0.35s cubic-bezier(.2,.7,.2,1) both", transformOrigin: "left" }} />
          </div>
          {/* Journey Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4" style={{ gap: "1px", background: S.rule, marginTop: "40px" }}>
            {[
              { key: "aspiring", n: "01 · Student", who: "Aspiring Professional", inst: "AI Alignment Index©", inr: "₹499", usd: "$15", go: "See where I'm building →" },
              { key: "working", n: "02 · Professional", who: "Working Professional", inst: "AI Replaceability Index©", inr: "₹999", usd: "$29", go: "See my compression risk →" },
              { key: "leader", n: "03 · Leader · CXO", who: "Leader", inst: "Brainpower Density Index©", inr: "₹4,999", usd: "$149", go: "Measure my leadership edge →" },
              { key: "org", n: "04 · Organisation", who: "Organisation", inst: "ORG AI DARS©", inr: "Invite", usd: "Invite", go: "Map our AI decision architecture →" },
            ].map((c) => (
              <button key={c.key} onClick={() => openModal(c.key)} className="jcard" style={{ background: S.white, padding: "32px 26px", display: "flex", flexDirection: "column", cursor: "pointer", transition: "background .25s ease", border: "none", textAlign: "left" }}>
                <div className="jcard-n" style={{ fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.18em", textTransform: "uppercase", color: S.gold, marginBottom: "18px", transition: "color .25s" }}>{c.n}</div>
                <div className="jcard-who" style={{ fontFamily: S.display, fontSize: "clamp(20px,2vw,26px)", letterSpacing: "0.02em", color: S.ink, lineHeight: 1.04, marginBottom: "10px", transition: "color .25s" }}>{c.who}</div>
                <div className="jcard-inst" style={{ fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.1em", textTransform: "uppercase", color: S.mid, marginBottom: "18px", lineHeight: 1.5, transition: "color .25s" }}>{c.inst}</div>
                <div className="jcard-price" style={{ fontFamily: S.display, fontSize: "34px", color: S.ink, lineHeight: 1, marginTop: "auto", transition: "color .25s" }}>
                  {c.inr !== "Invite" && <span className="jcard-from" style={{ fontFamily: S.mono, fontSize: "9px", color: S.mid, letterSpacing: "0.06em", display: "block", marginBottom: "4px", transition: "color .25s" }}>From</span>}
                  {price(c.inr, c.usd)}
                </div>
                <div className="jcard-go" style={{ fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.16em", textTransform: "uppercase", color: S.gold, marginTop: "16px", display: "flex", alignItems: "center", gap: "6px", transition: "gap .25s ease,color .25s" }}>{c.go}</div>
              </button>
            ))}
          </div>
        </section>

        {/* ── DIAGNOSTIC JOURNEY ── */}
        <section style={{ borderBottom: `1px solid ${S.rule}` }}>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ padding: "56px 52px 36px", gap: 0 }}>
            <div style={{ borderRight: `1px solid ${S.rule}`, paddingRight: "52px" }} className="pr-0 md:pr-[52px] pb-6 md:pb-0">
              <div style={{ fontFamily: S.mono, fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.gold, marginBottom: "12px" }}>The Diagnostic Journey · 12 minutes · 48 hours</div>
              <h2 style={{ fontFamily: S.display, fontSize: "clamp(36px,5vw,60px)", letterSpacing: "0.02em", color: S.ink, lineHeight: 1 }}>Measure. <span style={{ color: S.gold }}>Decode.</span><br />Reposition.</h2>
            </div>
            <div style={{ paddingLeft: "52px", display: "flex", alignItems: "center" }} className="pl-0 md:pl-[52px]">
              <p style={{ fontSize: "14px", color: S.ink2, lineHeight: 1.7, maxWidth: "480px" }}>What happens between choosing your instrument and acting on the result. Three steps. One report. A practical direction for what to do next.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 0, background: S.rule }}>
            {[
              { n: "§ 01 · Measure", verb: "Measure", body: "Understand your AI exposure, your work compression risk, and your judgment density. The starting position — measured, not guessed.", bg: S.white, verbColor: S.ink, bodyColor: S.mid },
              { n: "§ 02 · Decode", verb: "Decode", body: "See which parts of your work are AI-dominant, AI-assisted, or AI-resistant. The structural read across all four E.D.G.E. dimensions.", bg: "#8C8983", verbColor: S.white, bodyColor: "rgba(247,246,243,0.88)" },
              { n: "§ 03 · Reposition", verb: "Reposition", body: "A practical 12-month direction — what to protect, what to shift, what to build. The action, not just the diagnosis.", bg: S.ink, verbColor: S.gold, bodyColor: "rgba(247,246,243,0.65)" },
            ].map((step, i) => (
              <div key={i} style={{ padding: "44px 36px", position: "relative", minHeight: "240px", display: "flex", flexDirection: "column", background: step.bg }}>
                <div style={{ fontFamily: S.mono, fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.gold2, marginBottom: "22px" }}>{step.n}</div>
                <div style={{ fontFamily: S.display, fontSize: "clamp(38px,4.5vw,56px)", letterSpacing: "0.02em", lineHeight: 0.95, marginBottom: "18px", color: step.verbColor }}>{step.verb}</div>
                <p style={{ fontSize: "13px", lineHeight: 1.7, marginTop: "auto", color: step.bodyColor }}>{step.body}</p>
                {i < 2 && <span style={{ position: "absolute", right: "-10px", top: "50%", transform: "translateY(-50%)", fontSize: "18px", color: S.gold, zIndex: 2 }} className="hidden md:block">→</span>}
              </div>
            ))}
          </div>
        </section>

        {/* ── FOUR ACTORS ── */}
        <section id="actors" style={{ borderBottom: `1px solid ${S.rule}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 52px", borderBottom: `1px solid ${S.rule}`, background: S.white2 }}>
            <span style={{ fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.mid }}>The Four Actors of the AI Workplace</span>
            <span style={{ fontFamily: S.mono, fontSize: "9px", color: S.dim }}>02 / 06</span>
          </div>
          <div style={{ padding: "52px" }} className="p-6 md:p-[52px]">
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ marginBottom: "48px" }}>
              <div style={{ borderRight: `1px solid ${S.rule}`, paddingRight: "52px" }} className="pr-0 md:pr-[52px] pb-6 md:pb-0">
                <h2 style={{ fontFamily: S.display, fontSize: "clamp(52px,7vw,88px)", lineHeight: 0.95, letterSpacing: "0.01em", color: S.ink, marginBottom: "28px" }}>THE<br />FOUR<br /><span style={{ color: S.gold }}>ACTORS.</span></h2>
              </div>
              <div style={{ paddingLeft: "52px", display: "flex", flexDirection: "column", justifyContent: "center" }} className="pl-0 md:pl-[52px]">
                <p style={{ fontSize: "13px", color: S.mid, lineHeight: 1.9, fontWeight: 300, maxWidth: "460px" }}>For decades, three actors shaped work: the employee, the leader, and the organisation. AI has entered as a fourth — not as a tool in the org chart, but as an actor that absorbs work, reprices what humans do, and forces every other actor to reckon with their structural position.</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "1px", background: S.rule }}>
            {[
              { num: "01", badge: "Individual", name: "THE ", nameAccent: "EMPLOYEE.", q: '"Am I structurally positioned for the AI era — or am I in the compression zone without knowing it?"', body: "Structural risk: the value of specific work types is being compressed silently. Most professionals do not know which zone they occupy until the correction arrives.", sigs: ["Is your decision authority expanding or contracting?"], cta: "ARI© Diagnostic", ctaKey: "working" },
              { num: "02", badge: "Leadership", name: "THE ", nameAccent: "CXO.", q: '"My model was built on informational advantage. AI has eliminated that advantage. What is my new structural role?"', body: "Structural risk: the CXO who controlled information had structural authority. That model is broken. The leadership premium must migrate to judgment architecture and consequence ownership.", sigs: ["Do you know your organisation's Brainpower Density?"], cta: "BDI© for Leaders", ctaKey: "leader" },
              { num: "03", badge: "The New Entrant", name: "", nameAccent: "ARTIFICIAL\nINTELLIGENCE.", q: '"AI is not a tool in the org chart. It is an actor that absorbs work. Which work does it absorb — and where does it stop?"', body: "Structural risk: AI compresses work in a predictable sequence — execution and analysis first, judgment last. Organisations that understand where AI stops design architecture that compounds.", sigs: ["Executing & coordinating ~85%, framing & deciding ~5–8%."], cta: "Compression Framework", ctaKey: "working" },
              { num: "04", badge: "The System", name: "THE ", nameAccent: "ORGANISATION.", q: '"We are investing in AI at scale. Why aren\'t outcomes matching investment — and what are we measuring wrong?"', body: "Structural risk: organisations run AI projects inside a technology frame and never answer the two structural questions — why should employees support this, and what should they actually do differently?", sigs: ["Have you redesigned decision architecture — or only deployed tools?"], cta: "ORG AI DARS©", ctaKey: "org" },
            ].map((actor, i) => (
              <div key={i} className="actor" style={{ background: S.white, padding: "44px 40px", position: "relative", transition: "background .25s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
                  <div style={{ fontFamily: S.display, fontSize: "56px", lineHeight: 0.9, color: "rgba(13,13,11,0.07)", letterSpacing: "0.01em" }}>{actor.num}</div>
                  <div style={{ fontFamily: S.mono, fontSize: "7px", letterSpacing: "0.2em", textTransform: "uppercase", color: S.mid, border: `1px solid ${S.rule2}`, padding: "4px 10px" }}>{actor.badge}</div>
                </div>
                <div style={{ fontFamily: S.display, fontSize: "clamp(28px,3vw,38px)", letterSpacing: "0.02em", color: S.ink, marginBottom: "12px", lineHeight: 1, whiteSpace: "pre-line" }}>{actor.name}<span style={{ color: S.gold }}>{actor.nameAccent}</span></div>
                <div style={{ fontSize: "11px", fontStyle: "italic", color: S.mid, lineHeight: 1.75, borderLeft: `2px solid ${S.rule2}`, paddingLeft: "14px", marginBottom: "20px", fontWeight: 300 }}>{actor.q}</div>
                <p style={{ fontSize: "12px", color: S.mid, lineHeight: 1.85, marginBottom: "22px", fontWeight: 300 }}>{actor.body}</p>
                <div style={{ marginBottom: "24px" }}>
                  {actor.sigs.map((sig, j) => (
                    <div key={j} style={{ fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.04em", color: S.ink3, padding: "7px 0", borderBottom: `1px solid ${S.rule}`, display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: S.gold }}>→</span>{sig}
                    </div>
                  ))}
                </div>
                <button onClick={() => openModal(actor.ctaKey)} style={{ fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.16em", textTransform: "uppercase", color: S.ink, display: "inline-flex", alignItems: "center", gap: "8px", borderBottom: `1px solid ${S.rule}`, paddingBottom: "4px", background: "none", border: "none", borderBottom: `1px solid ${S.rule}`, cursor: "pointer", transition: "all .2s" }}>
                  {actor.cta} <span style={{ color: S.gold }}>→</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── DOCTRINE ── */}
        <section id="doctrine" style={{ borderBottom: `1px solid ${S.rule}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 52px", borderBottom: `1px solid ${S.rule}`, background: S.white2 }}>
            <span style={{ fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.mid }}>The AI Edge Doctrine — Three Laws</span>
            <span style={{ fontFamily: S.mono, fontSize: "9px", color: S.dim }}>03 / 06</span>
          </div>
          <div style={{ padding: "52px" }} className="p-6 md:p-[52px]">
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ marginBottom: "40px" }}>
              <div style={{ borderRight: `1px solid ${S.rule}`, paddingRight: "52px" }} className="pr-0 md:pr-[52px] pb-6 md:pb-0">
                <h2 style={{ fontFamily: S.display, fontSize: "clamp(52px,7vw,88px)", lineHeight: 0.95, color: S.ink, marginBottom: "28px" }}>THE<br />THREE<br /><span style={{ color: S.gold }}>LAWS.</span></h2>
              </div>
              <div style={{ paddingLeft: "52px", display: "flex", flexDirection: "column", justifyContent: "center" }} className="pl-0 md:pl-[52px]">
                <p style={{ fontSize: "13px", color: S.mid, lineHeight: 1.9, fontWeight: 300, maxWidth: "460px" }}>These are not predictions. They are structural observations about what is already happening — in the data, in organisations, in the careers of professionals who feel the compression without yet having a name for it.</p>
              </div>
            </div>
          </div>
          {/* Laws */}
          <div style={{ borderTop: `1px solid ${S.rule}` }}>
            {[
              { num: "Law I · Intelligence Abundance", title: <>As intelligence approaches <em style={{ fontStyle: "normal", color: S.gold }}>zero cost</em>, its value in work declines.</>, body: "Research synthesis, data modelling, report generation — now accessible at marginal cost. Roles that derived value from producing structured intelligence face direct structural repricing. This is not a future risk. It is a present economic condition." },
              { num: "Law II · Judgment Scarcity", title: <>As intelligence becomes cheap, <em style={{ fontStyle: "normal", color: S.gold }}>judgment</em> becomes the scarce resource.</>, body: "Judgment operates where inputs are ambiguous, stakes are high, and consequences are owned by a person. AI can be directed by judgment. It cannot exercise it. The economic premium migrates from intelligence to judgment." },
              { num: "Law III · The Compression Curve", title: <>AI compresses work from execution upward until <em style={{ fontStyle: "normal", color: S.gold }}>judgment becomes the boundary</em>.</>, body: "Compression moves in predictable sequence: execution first, analysis next, insight partially, judgment last. This creates a structural line: above it, human value compounds; below it, it compresses." },
            ].map((law, i) => (
              <div key={i} className="law-row" style={{ borderBottom: `1px solid ${S.rule}`, padding: "38px 52px", cursor: "default", position: "relative", transition: "background .3s ease,padding-left .3s ease", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 0, background: S.gold, transition: "width .3s ease" }} className="law-before" />
                <div style={{ display: "flex", alignItems: "baseline", gap: "20px", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.gold, flexShrink: 0, width: "160px" }}>{law.num}</span>
                  <span className="law-arrow" style={{ fontFamily: S.sans, fontSize: "18px", color: S.gold, opacity: 0, transform: "translateX(-8px)", transition: "opacity .3s ease,transform .3s ease", marginLeft: "auto" }}>→</span>
                </div>
                <div style={{ fontFamily: S.display, fontSize: "clamp(26px,3vw,40px)", lineHeight: 1.05, color: S.ink, letterSpacing: "0.02em", marginTop: "8px" }}>{law.title}</div>
                <div className="law-body" style={{ fontSize: "13px", color: S.mid, lineHeight: 1.85, fontWeight: 300, maxWidth: "760px", marginTop: 0, maxHeight: 0, opacity: 0, transition: "max-height .45s ease,opacity .4s ease,margin-top .4s ease", overflow: "hidden" }}>{law.body}</div>
              </div>
            ))}
          </div>
          {/* Eras */}
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 0, background: S.rule, marginTop: "1px" }}>
            {[
              { label: "Industrial Age", resource: "Physical Labour", desc: "Organisations built for efficiency of physical execution. Headcount = capacity. Management = coordination of effort.", bg: S.white, resourceColor: S.ink, descColor: S.mid, labelColor: S.dim },
              { label: "Knowledge Economy", resource: "Analytical Intelligence", desc: "Organisations built for production of structured thinking. Talent = premium intelligence. Management = analysis to decisions.", bg: "#8C8983", resourceColor: S.white, descColor: "rgba(247,246,243,0.85)", labelColor: "rgba(247,246,243,0.65)" },
              { label: "AI Era · Present", resource: "Judgment", desc: "Organisations built for consequence-bearing decision ownership. Advantage = framing, deciding, being accountable. Architecture = concentration of judgment.", bg: S.ink, resourceColor: S.gold2, descColor: "rgba(247,246,243,0.55)", labelColor: "rgba(247,246,243,0.4)", now: true },
            ].map((era, i) => (
              <div key={i} style={{ padding: "36px 28px", position: "relative", background: era.bg }}>
                {era.now && <div style={{ position: "absolute", top: "16px", right: "16px", fontFamily: S.mono, fontSize: "7px", letterSpacing: "0.14em", textTransform: "uppercase", background: S.gold, color: S.white, padding: "3px 8px" }}>Now</div>}
                <div style={{ fontFamily: S.mono, fontSize: "7px", letterSpacing: "0.2em", textTransform: "uppercase", color: era.labelColor, marginBottom: "16px" }}>{era.label}</div>
                <div style={{ fontFamily: S.display, fontSize: "clamp(24px,2.5vw,32px)", letterSpacing: "0.02em", color: era.resourceColor, marginBottom: "10px" }}>{era.resource}</div>
                <p style={{ fontSize: "11px", color: era.descColor, lineHeight: 1.75, fontWeight: 300 }}>{era.desc}</p>
              </div>
            ))}
          </div>
          {/* Logic Table */}
          <div style={{ marginTop: "1px", borderTop: `1px solid ${S.rule}`, background: S.white }}>
            <div className="grid" style={{ gridTemplateColumns: "1fr 60px 1fr", padding: "18px 52px", borderBottom: `1px solid ${S.rule}`, background: S.white2 }}>
              <span style={{ fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.mid }}>The old career logic</span>
              <span />
              <span style={{ fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.gold }}>The AI-era career logic</span>
            </div>
            {[["Skill accumulation","Judgment density"],["More output","Better decisions"],["Role security","Work defensibility"],["Experience years","Consequence ownership"],["Functional expertise","Decision architecture"]].map(([old, neo], i) => (
              <div key={i} className="grid" style={{ gridTemplateColumns: "1fr 60px 1fr", padding: "20px 52px", borderBottom: i < 4 ? `1px solid ${S.rule}` : "none", alignItems: "center" }}>
                <div style={{ fontFamily: S.display, fontSize: "clamp(20px,2.4vw,28px)", letterSpacing: "0.02em", color: S.mid, lineHeight: 1.1 }}>{old}</div>
                <div style={{ fontFamily: S.sans, fontSize: "18px", color: S.gold, textAlign: "center", fontWeight: 300 }}>→</div>
                <div style={{ fontFamily: S.display, fontSize: "clamp(22px,2.6vw,30px)", letterSpacing: "0.02em", color: S.ink, lineHeight: 1.1 }}>{neo}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PULLQUOTE ── */}
        <div style={{ padding: "52px", background: S.ink, borderBottom: "1px solid rgba(255,255,255,0.08)" }} className="px-6 md:px-[52px]">
          <div style={{ fontFamily: S.mono, fontSize: "7px", letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(247,246,243,0.3)", marginBottom: "24px" }}>The Doctrine in One Sentence · AI Edge Lab · 2026</div>
          <div style={{ fontFamily: S.display, fontSize: "clamp(28px,4.5vw,54px)", lineHeight: 1.05, letterSpacing: "0.02em", color: S.white, maxWidth: "900px" }}>
            AI DOES NOT ELIMINATE WORK FIRST. IT ELIMINATES THE <span style={{ color: S.gold2 }}>STRUCTURAL PREMIUM</span> ON INTELLIGENCE INSIDE WORK.
          </div>
          <div style={{ fontFamily: S.mono, fontSize: "8px", color: "rgba(247,246,243,0.3)", marginTop: "24px", letterSpacing: "0.12em", textTransform: "uppercase" }}>Nitin Nahata · CHRO, Gameskraft · Founder, Axionindex</div>
        </div>

        {/* ── FRAMEWORK ── */}
        <section id="framework" style={{ borderBottom: `1px solid ${S.rule}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 52px", borderBottom: `1px solid ${S.rule}`, background: S.white2 }}>
            <span style={{ fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.mid }}>The E.D.G.E. Framework — The Six Work Types</span>
            <span style={{ fontFamily: S.mono, fontSize: "9px", color: S.dim }}>04 / 06</span>
          </div>
          <div style={{ padding: "52px" }} className="p-6 md:p-[52px]">
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 0 }}>
              <div style={{ borderRight: `1px solid ${S.rule}`, paddingRight: "52px" }} className="pr-0 md:pr-[52px] pb-8 md:pb-0">
                <h3 style={{ fontFamily: S.display, fontSize: "clamp(28px,3vw,38px)", letterSpacing: "0.02em", color: S.ink, lineHeight: 1, marginBottom: "8px" }}>Your structural position.</h3>
                <p style={{ fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.1em", color: S.dim, marginBottom: 0, textTransform: "uppercase" }}>Four dimensions · the measurement architecture</p>
                <p style={{ fontSize: "13px", color: S.mid, lineHeight: 1.9, fontWeight: 300, maxWidth: "460px", marginTop: "22px", marginBottom: "8px" }}>Four dimensions that make your structural position visible — the measurement architecture behind the AI Edge Diagnostic.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: S.rule, marginTop: "24px" }}>
                  {[
                    { letter: "E", name: "Exposure", desc: "Proportion of work that is AI-compressible.", dir: "Lower = structurally stronger" },
                    { letter: "D", name: "Decision Density", desc: "Consequence-bearing judgment owned per unit of work.", dir: "Higher = compounding position" },
                    { letter: "G", name: "Growth of Boundary", desc: "Whether decision authority is expanding or contracting over 24 months.", dir: "Expanding = widening advantage" },
                    { letter: "E", name: "Economic Anchoring", desc: "Whether compensation is tied to scarce contribution.", dir: "Anchored = salary structurally durable" },
                  ].map((item, i) => (
                    <div key={i} style={{ background: S.white, padding: "20px 24px", display: "grid", gridTemplateColumns: "36px 1fr", gap: 0, alignItems: "start" }}>
                      <div style={{ fontFamily: S.display, fontSize: "28px", color: S.gold, lineHeight: 1, marginTop: "2px" }}>{item.letter}</div>
                      <div style={{ paddingLeft: "12px" }}>
                        <div style={{ fontSize: "12px", fontWeight: 500, color: S.ink, marginBottom: "4px", letterSpacing: "0.01em" }}>{item.name}</div>
                        <div style={{ fontSize: "11px", color: S.mid, lineHeight: 1.6, fontWeight: 300 }}>{item.desc}</div>
                        <div style={{ fontFamily: S.mono, fontSize: "8px", color: S.gold, marginTop: "5px", letterSpacing: "0.06em" }}>{item.dir}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ paddingLeft: "52px" }} className="pl-0 md:pl-[52px]">
                <h3 style={{ fontFamily: S.display, fontSize: "clamp(28px,3vw,38px)", letterSpacing: "0.02em", color: S.ink, lineHeight: 1, marginBottom: "8px" }}>The six work types.</h3>
                <p style={{ fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.1em", color: S.dim, marginBottom: 0, textTransform: "uppercase" }}>AI compression coefficients by work type</p>
                <div style={{ marginTop: "22px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 60px", padding: "8px 0", borderBottom: `1px solid ${S.rule2}` }}>
                    {["Work Type","Compression","%"].map((h, i) => (
                      <span key={i} style={{ fontFamily: S.mono, fontSize: "7px", letterSpacing: "0.16em", textTransform: "uppercase", color: S.dim, textAlign: i === 2 ? "right" : "left" }}>{h}</span>
                    ))}
                  </div>
                  {[
                    { name: "Framing & Problem Definition", pct: 5, color: "#5A9E7A", divider: false },
                    { name: "Deciding & Directing", pct: 8, color: "#5A9E7A", divider: false },
                    { name: "Influencing & Convening", pct: 20, color: S.gold, divider: true },
                    { name: "Synthesising & Interpreting", pct: 45, color: S.gold, divider: false },
                    { name: "Researching & Analysing", pct: 75, color: "#B84040", divider: true },
                    { name: "Executing & Coordinating", pct: 85, color: "#B84040", divider: false },
                  ].map((row, i) => (
                    <div key={i}>
                      {row.divider && <div style={{ height: "1px", background: S.gold, opacity: 0.2, margin: "2px 0" }} />}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 60px", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${S.rule}` }}>
                        <div style={{ fontSize: "12px", color: S.ink, fontWeight: 300 }}>{row.name}</div>
                        <div style={{ position: "relative", height: "3px", background: S.white3, borderRadius: "2px", overflow: "hidden" }}>
                          <div style={{ height: "100%", borderRadius: "2px", background: row.color, width: `${row.pct}%` }} />
                        </div>
                        <div style={{ fontFamily: S.mono, fontSize: "9px", textAlign: "right", color: row.color }}>~{row.pct}%</div>
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ fontFamily: S.mono, fontSize: "7px", color: S.dim, marginTop: "12px", letterSpacing: "0.06em" }}>AI Edge Lab methodology, 2026. Coefficients represent the proportion of work type deliverables that AI can produce at comparable quality.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── DIAGNOSTIC ── */}
        <section id="diagnostic" style={{ borderBottom: `1px solid ${S.rule}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 52px", borderBottom: `1px solid ${S.rule}`, background: S.white2 }}>
            <span style={{ fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.mid }}>Assessment Suite — ARI© · BDI© · ORG AI DARS©</span>
            <span style={{ fontFamily: S.mono, fontSize: "9px", color: S.dim }}>05 / 06</span>
          </div>
          <div style={{ padding: "52px" }} className="p-6 md:p-[52px]">
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ marginBottom: "40px" }}>
              <div style={{ borderRight: `1px solid ${S.rule}`, paddingRight: "52px" }} className="pr-0 md:pr-[52px] pb-6 md:pb-0">
                <h2 style={{ fontFamily: S.display, fontSize: "clamp(44px,6vw,72px)", lineHeight: 0.95, color: S.ink }}>MEASURE<br />YOUR<br /><span style={{ color: S.gold }}>POSITION.</span></h2>
              </div>
              <div style={{ paddingLeft: "52px", display: "flex", alignItems: "center" }} className="pl-0 md:pl-[52px]">
                <p style={{ fontSize: "13px", color: S.mid, lineHeight: 1.9, fontWeight: 300, maxWidth: "460px" }}>You cannot redesign what you cannot see. The AI Edge assessment suite makes structural position visible — for individuals, leaders, and organisations.</p>
              </div>
            </div>
            {/* Currency toggle */}
            <div style={{ display: "inline-flex", border: `1px solid ${S.rule2}`, marginBottom: "8px", overflow: "hidden" }}>
              {(["inr","usd"] as const).map((c) => (
                <button key={c} onClick={() => setCur(c)} style={{ fontFamily: S.mono, fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", padding: "9px 18px", background: cur === c ? S.ink : S.white, color: cur === c ? S.white : S.mid, border: "none", cursor: "pointer", transition: "background .2s,color .2s" }}>
                  {c === "inr" ? "₹ India (INR)" : "$ Global (USD)"}
                </button>
              ))}
            </div>
            <div style={{ fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.06em", color: S.dim, marginBottom: "24px" }}>
              {cur === "inr" ? "Showing INR — India pricing. Tap to switch." : "Showing USD — global pricing. Tap to switch."}
            </div>

            {/* ARI */}
            <div style={{ marginBottom: "22px" }}>
              <div style={{ fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.mid, marginBottom: "8px" }}>For Working Professionals</div>
              <div style={{ fontFamily: S.display, fontSize: "clamp(28px,3.4vw,44px)", letterSpacing: "0.02em", color: S.gold, lineHeight: 1.02 }}>AI Replaceability Index©<span style={{ color: S.ink, display: "block", fontSize: "0.62em", marginTop: "4px" }}>Where am I structurally positioned?</span></div>
            </div>
            <DiagCards cur={cur} tiers={[
              { tier: "Pure Report", name: "ARI© Report", inr: "₹999", usd: "$29", time: "Full structural report · delivered within 48 hours", feats: ["Full E.D.G.E. score — all four dimensions","Edge band: Accelerating / Holding / Thinning","Role Composition Map — six work types","Salary Sustainability Index (SSI)","Personalised structural roadmap"], dark: false, onCta: () => openModal("working") },
              { tier: "With Consultation", name: "ARI© + Consultation", inr: "₹3,999", usd: "$129", time: "The full report plus a 45-minute structural debrief", feats: ["Everything in the Report","Analyst validation pass","45-minute structural debrief","Personalised action sequencing"], dark: true, onCta: () => openModal("working") },
            ]} S={S} />

            {/* AAI */}
            <div style={{ marginTop: "64px", marginBottom: "22px" }}>
              <div style={{ fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.mid, marginBottom: "8px" }}>For Aspiring Professionals</div>
              <div style={{ fontFamily: S.display, fontSize: "clamp(28px,3.4vw,44px)", letterSpacing: "0.02em", color: S.gold, lineHeight: 1.02 }}>AI Alignment Index©<span style={{ color: S.ink, display: "block", fontSize: "0.62em", marginTop: "4px" }}>Am I building the right foundations?</span></div>
            </div>
            <DiagCards cur={cur} tiers={[
              { tier: "Pure Report", name: "AAI© Report", inr: "₹499", usd: "$15", time: "Full alignment report · delivered within 48 hours", feats: ["Foundation alignment across four E.D.G.E. dimensions","Which skills stay relevant vs compressible","Dominant work-type signal","Personalised development roadmap"], dark: false, onCta: () => openModal("aspiring") },
              { tier: "With Consultation", name: "AAI© + Consultation", inr: "₹2,499", usd: "$69", time: "The full report plus a foundation-building session", feats: ["Everything in the Report","Analyst validation pass","30-minute mentoring session","Skill-sequencing plan"], dark: true, onCta: () => openModal("aspiring") },
            ]} S={S} />

            {/* BDI */}
            <div style={{ marginTop: "64px", marginBottom: "22px" }}>
              <div style={{ fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.mid, marginBottom: "8px" }}>For Leaders · CXO</div>
              <div style={{ fontFamily: S.display, fontSize: "clamp(28px,3.4vw,44px)", letterSpacing: "0.02em", color: S.gold, lineHeight: 1.02 }}>Brainpower Density Index©<span style={{ color: S.ink, display: "block", fontSize: "0.62em", marginTop: "4px" }}>What is my new structural role?</span></div>
            </div>
            <DiagCards cur={cur} tiers={[
              { tier: "Pure Report", name: "BDI© Report", inr: "₹4,999", usd: "$149", time: "Brainpower Density report for your leadership layer", feats: ["Judgment-to-intelligence ratio by layer","Compression exposure of senior roles","Decision-velocity-per-head read","Layer redesign signals"], dark: false, waitlist: true, onCta: () => {} },
              { tier: "With Consultation", name: "BDI© + Consultation", inr: "₹9,999", usd: "$299", time: "The full report plus a 60-minute leadership debrief", feats: ["Everything in the Report","Analyst validation pass","60-minute leadership debrief","Decision-architecture redesign notes"], dark: true, waitlist: true, onCta: () => {} },
            ]} S={S} />
          </div>
        </section>

        {/* ── WHAT YOU GET ── */}
        <section id="whatyouget" style={{ borderBottom: `1px solid ${S.rule}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 52px", borderBottom: `1px solid ${S.rule}`, background: S.white2 }}>
            <span style={{ fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.mid }}>What Your Report Gives You</span>
            <span style={{ fontFamily: S.mono, fontSize: "9px", color: S.dim }}>05.3 / 06</span>
          </div>
          <div style={{ padding: "52px 52px 0" }} className="p-6 md:p-[52px] pb-0">
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ marginBottom: "36px" }}>
              <div style={{ borderRight: `1px solid ${S.rule}`, paddingRight: "52px" }} className="pr-0 md:pr-[52px] pb-6 md:pb-0">
                <h2 style={{ fontFamily: S.display, fontSize: "clamp(40px,5.5vw,64px)", lineHeight: 0.95, color: S.ink, marginBottom: "28px" }}>NOT A<br />SCORE.<br /><span style={{ color: S.gold }}>A MAP.</span></h2>
              </div>
              <div style={{ paddingLeft: "52px", display: "flex", alignItems: "center" }} className="pl-0 md:pl-[52px]">
                <p style={{ fontSize: "13px", color: S.mid, lineHeight: 1.9, fontWeight: 300, maxWidth: "460px" }}>Every diagnostic produces a structural report, not a number. Here is what lands in your inbox within 48 hours — built for who you are.</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "1px", background: S.rule, marginTop: "8px" }}>
            {[
              { aud: "For Individuals · ARI© / AAI©", inst: "Your structural position", items: ["Your AI exposure profile — what share of your work is compressible","Your work compression risk, by the six work types","Your judgment density score","Your AI-proof / AI-assisted / AI-dominant work map","Your 12-month repositioning plan"] },
              { aud: "For Leaders · BDI©", inst: "Your leadership architecture", items: ["Your Brainpower Density score","Your decision-leverage profile","Your AI-era leadership risk","Where your leadership value is expanding — or eroding","Decision-architecture redesign signals"] },
              { aud: "For Organisations · ORG AI DARS©", inst: "Your organisational readiness", items: ["Your AI maturity stage (Leveraged → Born)","Your decision-architecture gaps","Your talent heat map","Function-level redesign priorities","The two unanswered questions, answered"] },
            ].map((col, i) => (
              <div key={i} style={{ background: S.white, padding: "36px 30px" }}>
                <div style={{ fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.18em", textTransform: "uppercase", color: S.gold, marginBottom: "8px" }}>{col.aud}</div>
                <div style={{ fontFamily: S.display, fontSize: "22px", letterSpacing: "0.02em", color: S.ink, lineHeight: 1, marginBottom: "22px" }}>{col.inst}</div>
                {col.items.map((item, j) => (
                  <div key={j} style={{ display: "flex", gap: "10px", fontSize: "13px", color: S.ink2, lineHeight: 1.55, padding: "11px 0", borderBottom: j < col.items.length - 1 ? `1px solid ${S.rule}` : "none" }}>
                    <span style={{ width: "5px", height: "5px", background: S.gold, borderRadius: "50%", flexShrink: 0, marginTop: "7px" }} />
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ── EVIDENCE ── */}
        <section id="evidence" style={{ borderBottom: `1px solid ${S.rule}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 52px", borderBottom: `1px solid ${S.rule}`, background: S.white2 }}>
            <span style={{ fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.mid }}>The Evidence — 12 Reports · 6 Months</span>
            <span style={{ fontFamily: S.mono, fontSize: "9px", color: S.dim }}>05.5 / 06</span>
          </div>
          <div style={{ padding: "52px 52px 0" }} className="p-6 md:p-[52px] pb-0">
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ paddingBottom: "40px" }}>
              <div style={{ borderRight: `1px solid ${S.rule}`, paddingRight: "52px" }} className="pr-0 md:pr-[52px] pb-6 md:pb-0">
                <h2 style={{ fontFamily: S.display, fontSize: "clamp(44px,6vw,72px)", lineHeight: 0.95, color: S.ink, marginBottom: "28px" }}>NOT A<br />PREDICTION.<br /><span style={{ color: S.gold }}>A PATTERN.</span></h2>
              </div>
              <div style={{ paddingLeft: "52px", display: "flex", alignItems: "center" }} className="pl-0 md:pl-[52px]">
                <p style={{ fontSize: "13px", color: S.mid, lineHeight: 1.9, fontWeight: 300, maxWidth: "460px" }}>Six anchor reports — published in the last six months by McKinsey, MIT, WEF, BCG, PwC and EY — confirm what the AI Edge doctrine has been mapping. The convergence is now unmistakable.</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3" style={{ gap: 0, background: S.rule }}>
            {[
              { stat: "95%", label: "Of GenAI pilots show no P&L impact", body: "After $30–40B invested, the vast majority of enterprise GenAI initiatives deliver no measurable return. The gap is structural, not technical.", src: "MIT · NANDA, State of AI in Business 2025 ↗", href: "https://mlq.ai/media/quarterly_decks/v0.1_State_of_AI_in_Business_2025_Report.pdf" },
              { stat: "23%", label: "Have actually scaled AI", body: "88% of organisations now use AI somewhere. Only 23% have scaled it. Investment is not transformation — and the gap is widening.", src: "McKinsey · The State of AI, 2025 ↗", href: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai" },
              { stat: "39%", label: "Of skills will change by 2030", body: "Core skills churn accelerates as AI reshapes roles. Judgment-weighted skills hold; executional skills compress.", src: "WEF · Future of Jobs Report 2025 ↗", href: "https://www.weforum.org/publications/the-future-of-jobs-report-2025/" },
              { stat: "CEO", label: "Now leads AI — not CTO", body: "72% of CEOs are now the primary AI decision-maker. AI investment doubling in 2026. The governance of AI has moved from engineering to executive.", src: "BCG · AI Radar 2026 ↗", href: "https://www.prnewswire.com/news-releases/as-ai-investments-surge-ceos-take-the-lead-on-decision-making-and-upskilling-themselves-302661849.html" },
              { stat: "HR", label: "Primary agentic AI landing zone", body: "Finance and HR are where agentic AI lands first — ahead of IT and all other functions. The work redesign question gets answered here or nowhere.", src: "PwC · 2026 AI Business Predictions ↗", href: "https://www.pwc.com/gx/en/issues/technology/ai-predictions.html" },
              { stat: "96%", label: "Report productivity gains — fewer scale impact", body: "Productivity from AI is now widespread; transformational impact is not. Governance, structure, and judgment architecture remain the bottleneck.", src: "EY · AI Pulse Survey 2025 ↗", href: "https://www.ey.com/en_us/insights/emerging-technologies/pulse-ai-survey" },
            ].map((ev, i) => (
              <a key={i} href={ev.href} target="_blank" rel="noopener" className="ev" style={{ display: "block", padding: "32px 28px", textDecoration: "none", transition: "background .3s ease" }}>
                <div className="ev-stat" style={{ fontFamily: S.display, fontSize: "clamp(44px,5vw,64px)", color: S.ink, lineHeight: 0.9, marginBottom: "12px", letterSpacing: "0.01em", transition: "color .2s" }}>{ev.stat}</div>
                <div className="ev-label" style={{ fontSize: "12px", fontWeight: 500, color: S.ink, marginBottom: "8px", lineHeight: 1.35 }}>{ev.label}</div>
                <div className="ev-body" style={{ fontSize: "11px", color: S.mid, lineHeight: 1.75, marginBottom: "12px", fontWeight: 300 }}>{ev.body}</div>
                <div className="ev-src" style={{ fontFamily: S.mono, fontSize: "7px", color: S.dim, letterSpacing: "0.08em", transition: "color .2s" }}>{ev.src}</div>
              </a>
            ))}
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section id="about" style={{ borderBottom: `1px solid ${S.rule}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 52px", borderBottom: `1px solid ${S.rule}`, background: S.white2 }}>
            <span style={{ fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: S.mid }}>About the AI Edge Lab — Nitin Nahata</span>
            <span style={{ fontFamily: S.mono, fontSize: "9px", color: S.dim }}>06 / 06</span>
          </div>
          <div style={{ padding: "52px" }} className="p-6 md:p-[52px]">
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]" style={{ gap: 0 }}>
              <div style={{ borderRight: `1px solid ${S.rule}`, paddingRight: "52px" }} className="pr-0 md:pr-[52px] pb-8 md:pb-0">
                <div style={{ width: "100%", aspectRatio: "3/4", background: "linear-gradient(145deg,#2A2C30 0%,#1A1C1F 100%)", marginBottom: "24px", display: "flex", alignItems: "flex-end", padding: "20px" }}>
                  <span style={{ fontFamily: S.mono, fontSize: "7px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(247,246,243,0.35)" }}>Nitin Nahata · CHRO · Founder</span>
                </div>
                <div style={{ fontFamily: S.display, fontSize: "32px", letterSpacing: "0.02em", color: S.ink, marginBottom: "4px" }}>NITIN NAHATA</div>
                <div style={{ fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.18em", color: S.gold, textTransform: "uppercase", marginBottom: "20px" }}>CHRO · Organisational Architect · Founder</div>
                {[["CHRO","Gameskraft"],["Founder","Axionindex"],["Creator","AI Edge Diagnostic©"],["Founder","HROS"]].map(([role, org], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: S.mono, fontSize: "8px", color: S.mid, padding: "8px 0", borderBottom: `1px solid ${S.rule}`, letterSpacing: "0.04em" }}>
                    <span>{role}</span><span>{org}</span>
                  </div>
                ))}
                <div style={{ fontFamily: S.mono, fontSize: "9px", color: S.gold, marginTop: "16px", letterSpacing: "0.06em" }}>nitin@axionindex.org</div>
              </div>
              <div style={{ paddingLeft: "52px" }} className="pl-0 md:pl-[52px]">
                <div>
                  {["Nitin Nahata is a CHRO and organisational architect whose work centres on a single structural question: how do organisations and the people inside them evolve when intelligence becomes abundant?","Two decades across institutions and high-growth companies have shaped his thinking on the architecture of decision-making, the future structure of work, and how organisations redesign talent systems in the AI era.","As CHRO of Gameskraft, he sees firsthand how AI is changing the structure of work inside a fast-scaling organisation. As Founder of Axionindex, he is building the frameworks and instruments to measure and redesign those changes at scale."].map((p, i) => (
                    <p key={i} style={{ fontSize: "12px", color: S.mid, lineHeight: 1.9, marginBottom: "14px", fontWeight: 300 }}>{p}</p>
                  ))}
                </div>
                <div style={{ background: S.white2, padding: "28px 32px", marginTop: "8px", borderLeft: `2px solid ${S.gold}` }}>
                  <div style={{ fontFamily: S.mono, fontSize: "7px", letterSpacing: "0.2em", textTransform: "uppercase", color: S.mid, marginBottom: "14px" }}>The Conviction</div>
                  <div style={{ fontFamily: S.display, fontSize: "clamp(18px,2.5vw,26px)", lineHeight: 1.1, letterSpacing: "0.02em", color: S.ink }}>
                    "THE QUESTION IS NOT WHETHER AI WILL CHANGE YOUR WORK. IT IS WHETHER YOU UNDERSTAND THE <span style={{ color: S.gold }}>STRUCTURE</span> OF THAT CHANGE."
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CLOSING ── */}
        <section style={{ background: S.ink, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ width: "100%", height: "220px", background: "linear-gradient(160deg,#1C1E24 0%,#252821 50%,#1E1E1A 100%)", position: "relative", overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60%", background: "rgba(0,0,0,0.7)", clipPath: "polygon(0% 100%,0% 40%,2% 40%,2% 20%,3% 20%,3% 10%,4% 10%,4% 20%,5% 20%,5% 40%,8% 40%,8% 25%,9% 25%,9% 15%,10% 15%,10% 25%,11% 25%,11% 40%,14% 40%,14% 30%,15% 30%,15% 18%,16% 18%,16% 30%,17% 30%,17% 40%,20% 40%,20% 22%,21% 22%,21% 12%,22% 12%,22% 22%,23% 22%,23% 40%,26% 40%,26% 32%,27% 32%,27% 24%,28% 24%,28% 32%,29% 32%,29% 40%,33% 40%,33% 18%,34% 18%,34% 8%,35% 8%,35% 18%,36% 18%,36% 40%,40% 40%,40% 28%,41% 28%,41% 18%,42% 18%,42% 28%,43% 28%,43% 40%,48% 40%,48% 20%,49% 20%,49% 10%,50% 10%,50% 20%,51% 20%,51% 40%,55% 40%,55% 30%,56% 30%,56% 22%,57% 22%,57% 30%,58% 30%,58% 40%,63% 40%,63% 24%,64% 24%,64% 14%,65% 14%,65% 24%,66% 24%,66% 40%,70% 40%,70% 32%,71% 32%,71% 24%,72% 24%,72% 32%,73% 32%,73% 40%,78% 40%,78% 20%,79% 20%,79% 12%,80% 12%,80% 20%,81% 20%,81% 40%,85% 40%,85% 30%,86% 30%,86% 40%,90% 40%,90% 24%,91% 24%,91% 16%,92% 16%,92% 24%,93% 24%,93% 40%,97% 40%,97% 32%,98% 32%,98% 40%,100% 40%,100% 100%)" }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 0 }}>
            <div style={{ padding: "52px", borderRight: "1px solid rgba(255,255,255,0.06)" }} className="p-6 md:p-[52px]">
              <div style={{ fontFamily: S.mono, fontSize: "7px", letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(247,246,243,0.3)", marginBottom: "24px" }}>AI Edge Diagnostic© · Available Now · axionindex.org</div>
              <h2 style={{ fontFamily: S.display, fontSize: "clamp(52px,7vw,84px)", lineHeight: 0.95, letterSpacing: "0.01em", color: S.white }}>WHERE IS<br />YOUR<br /><span style={{ color: S.gold2 }}>STRUCTURAL</span><br />POSITION<br />TODAY?</h2>
            </div>
            <div style={{ padding: "52px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }} className="p-6 md:p-[52px]">
              <p style={{ fontSize: "12px", color: "rgba(247,246,243,0.5)", lineHeight: 1.9, marginBottom: "32px", fontWeight: 300 }}>The AI Edge Diagnostic measures your position relative to the compression line — across six work types, four E.D.G.E. dimensions, and two ownership signals. A full structural report, prepared and delivered within 48 hours. Private.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-start" }}>
                <button onClick={() => openModal("working")} className="closing-btn-inv" style={{ fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.18em", textTransform: "uppercase", padding: "13px 24px", background: S.white, color: S.ink, border: "none", cursor: "pointer", transition: "all .2s" }}>Find my AI Edge →</button>
                <button onClick={() => openModal()} className="closing-btn-out" style={{ fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.18em", textTransform: "uppercase", padding: "13px 24px", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(247,246,243,0.6)", background: "none", cursor: "pointer", transition: "all .2s" }}>See all assessments →</button>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ padding: "28px 52px", background: S.ink, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "14px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontFamily: S.display, fontSize: "16px", letterSpacing: "0.04em", color: "rgba(247,246,243,0.25)" }}>AI EDGE LAB · AXIONINDEX · 2026</div>
          <div style={{ display: "flex", gap: "20px" }}>
            {[["#doctrine","Doctrine"],["#framework","Framework"],["#diagnostic","Diagnostic"],["#about","About"],["mailto:nitin@axionindex.org","Contact"]].map(([href, label]) => (
              <a key={href} href={href} className="ft-link" style={{ fontFamily: S.mono, fontSize: "7px", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(247,246,243,0.25)", textDecoration: "none", transition: "color .2s" }}>{label}</a>
            ))}
          </div>
          <div style={{ fontFamily: S.mono, fontSize: "7px", color: "rgba(247,246,243,0.2)", letterSpacing: "0.06em" }}>© 2026 AI Edge Lab · axionindex.org</div>
        </footer>

      </div>
    </>
  );
}

/* ─── DiagCards helper ─── */
function DiagCards({ cur, tiers, S }: {
  cur: "inr" | "usd";
  tiers: { tier: string; name: string; inr: string; usd: string; time: string; feats: string[]; dark: boolean; waitlist?: boolean; onCta: () => void }[];
  S: Record<string, string>;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "1px", background: S.rule }}>
      {tiers.map((t, i) => (
        <div key={i} style={{ background: t.dark ? S.ink : S.white, padding: "30px 26px", display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.18em", textTransform: "uppercase", color: t.dark ? S.gold2 : S.mid, marginBottom: "14px" }}>{t.tier}</div>
          <div style={{ fontFamily: S.display, fontSize: "26px", letterSpacing: "0.02em", color: t.dark ? S.white : S.ink, lineHeight: 1, marginBottom: "10px" }}>{t.name}</div>
          <div style={{ fontFamily: S.display, fontSize: "34px", color: t.dark ? S.white : S.ink, lineHeight: 1, marginBottom: "5px" }}>{cur === "inr" ? t.inr : t.usd}</div>
          <div style={{ fontSize: "11.5px", color: t.dark ? S.dim : S.mid, lineHeight: 1.6, marginBottom: "16px", minHeight: "34px" }}>{t.time}</div>
          <div style={{ marginBottom: "26px", flex: 1 }}>
            {t.feats.map((f, j) => (
              <div key={j} style={{ fontSize: "12.5px", color: t.dark ? S.white2 : S.ink2, padding: "7px 0", borderBottom: `1px solid ${t.dark ? "rgba(247,246,243,0.12)" : S.rule}`, lineHeight: 1.5, display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: S.gold, flexShrink: 0 }}>—</span>{f}
              </div>
            ))}
          </div>
          {t.waitlist ? (
            <button disabled style={{ fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.18em", textTransform: "uppercase", padding: "12px 24px", background: "none", color: t.dark ? S.white : S.ink, border: `1px solid ${t.dark ? "rgba(247,246,243,0.2)" : S.rule2}`, cursor: "default", opacity: 0.5 }}>Waitlist</button>
          ) : (
            <button onClick={t.onCta} style={{ fontFamily: S.mono, fontSize: "8px", letterSpacing: "0.18em", textTransform: "uppercase", padding: "12px 24px", background: t.dark ? S.white : "none", color: t.dark ? S.ink : S.ink, border: `1px solid ${t.dark ? "none" : S.rule2}`, cursor: "pointer", transition: "all .2s" }}>Begin my assessment →</button>
          )}
        </div>
      ))}
    </div>
  );
}
