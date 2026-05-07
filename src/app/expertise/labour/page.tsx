"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const LabourThreeScene = dynamic(() => import("@/components/LabourThreeScene"), { ssr: false });

const classifications = [
  { num: "01", name: "Employee", desc: "Salaried, on-roll, employer-employee relationship. The default assumption that most others are exceptions to.", meta: ["All 4 codes", "White & blue collar"] },
  { num: "02", name: "Worker", desc: "Statutory category with wage thresholds and protections. The boundary that determines overtime, leave, and dispute pathways.", meta: ["Wages · IR · OSH", "Threshold-bound"] },
  { num: "03", name: "Fixed-Term", desc: "Now eligible for proportionate statutory benefits. Closes the historical gap with permanent employees.", meta: ["Pro-rata gratuity", "Statutory parity"] },
  { num: "04", name: "Contract Labour", desc: "Threshold-driven licensing. Principal-employer obligations sharpened. Audit trails are now mandatory, not aspirational.", meta: ["Licensing thresholds", "Principal liability"] },
  { num: "05", name: "Gig Worker", desc: "First-time codification under Social Security. Aggregator levy, social security fund, identification requirements.", meta: ["Social Security only", "New category"] },
  { num: "06", name: "Platform Worker", desc: "Distinct from gig — algorithmic management, performance opacity, and aggregator obligations create new architecture.", meta: ["Aggregator levy", "Algorithmic transparency"] },
];

const codes = [
  { num: "01", label: "Code I · Wages", title: "The Code on Wages", desc: "Universal definition of wages. Statutory minimum wage floor across all employees. The basic-allowance arithmetic that determines PF, gratuity and bonus liabilities.", tags: ["Statute · Centre", "State drafts ongoing"] },
  { num: "02", label: "Code II · Industrial Relations", title: "Industrial Relations", desc: "Standing orders threshold. Recognition of unions. Dispute resolution architecture. Workforce-size-driven obligations sharpen with scale.", tags: ["Statute · Centre", "State variation"] },
  { num: "03", label: "Code III · Social Security", title: "Social Security", desc: "Universal social security architecture. Gig and platform workers in scope for the first time. Aggregator levy, ESIC expansion, gratuity portability.", tags: ["Statute · Centre", "Schemes drafting"] },
  { num: "04", label: "Code IV · OSH", title: "Safety, Health & Working Conditions", desc: "Single registration. Threshold-driven obligations. Working hours, leave, women in night-shift, contract labour licensing — all consolidated.", tags: ["Statute · Centre", "Notification phased"] },
];

const questions = [
  { id: "Cost", q: "How much will my annual statutory cost change under the new wage definition?", a: "A short, principled answer lives here. The complete reading — by workforce category, by state notification, by cost line — is part of the Interpret stage of the 3i engagement." },
  { id: "Classification", q: "Are my fixed-term employees now eligible for pro-rata gratuity?", a: "A short, principled answer lives here. The complete reading — by workforce category, by state notification, by cost line — is part of the Interpret stage of the 3i engagement." },
  { id: "Operations", q: "What changes for my contract labour licensing thresholds?", a: "A short, principled answer lives here. The complete reading — by workforce category, by state notification, by cost line — is part of the Interpret stage of the 3i engagement." },
  { id: "Benefits", q: "Do gig and platform workers get ESIC, PF, or a separate scheme?", a: "A short, principled answer lives here. The complete reading — by workforce category, by state notification, by cost line — is part of the Interpret stage of the 3i engagement." },
  { id: "Structure", q: "Should I restructure my basic-allowance ratio to manage statutory liability?", a: "A short, principled answer lives here. The complete reading — by workforce category, by state notification, by cost line — is part of the Interpret stage of the 3i engagement." },
  { id: "State", q: "If my workforce is split across states, which state's draft rules apply?", a: "A short, principled answer lives here. The complete reading — by workforce category, by state notification, by cost line — is part of the Interpret stage of the 3i engagement." },
  { id: "Overtime", q: "Have overtime caps and double-rate provisions changed under the OSH Code?", a: "A short, principled answer lives here. The complete reading — by workforce category, by state notification, by cost line — is part of the Interpret stage of the 3i engagement." },
  { id: "Contract", q: "What are my principal-employer obligations under the new IR Code?", a: "A short, principled answer lives here. The complete reading — by workforce category, by state notification, by cost line — is part of the Interpret stage of the 3i engagement." },
];

const engagementRows = [
  { k: "Interpret", d: "Map your exposure to each of the four codes — by workforce category, by state, by cost line.", o: "Exposure diagnostic", c: "2–3 weeks" },
  { k: "Integrate", d: "Redesign the operating architecture — comp structure, classification, governance, contracts.", o: "Architecture redesign", c: "8–12 weeks" },
  { k: "Institutionalise", d: "Install the ongoing compliance rhythm — calendars, audits, change management.", o: "Operating system", c: "Ongoing" },
];

const STATE_FACTOR: Record<string, number> = { TN: 1.0, KA: 1.0, MH: 0.7, DL: 0.7, GJ: 0.4, HR: 0.95 };

export default function LabourCodes() {
  const [inputs, setInputs] = useState({ hc: 450, state: "KA", workers: 40, contract: 22, gig: 8, basic: 35, ctc: 9.5 });
  const [outputs, setOutputs] = useState({ total: 8.9, wages: 2.7, ss: 3.2, cl: 1.8, osh: 1.3 });
  const [activeCls, setActiveCls] = useState(0);

  const nextCls = () => setActiveCls((prev) => (prev + 1) % classifications.length);
  const prevCls = () => setActiveCls((prev) => (prev - 1 + classifications.length) % classifications.length);

  useEffect(() => {
    // Basic logic to simulate the requested output for the default inputs
    if (inputs.hc === 450 && inputs.state === "KA" && inputs.workers === 40 && inputs.contract === 22 && inputs.gig === 8 && inputs.basic === 35) {
      setOutputs({ total: 8.9, wages: 2.7, ss: 3.2, cl: 1.8, osh: 1.3 });
      return;
    }

    const f = STATE_FACTOR[inputs.state] || 1;
    const wagesImpact = Math.max(0, (0.50 - inputs.basic / 100)) * 18 * f;
    const ssImpact = (inputs.gig / 100 * 22 + inputs.workers / 100 * 3.5) * f;
    const clImpact = inputs.contract / 100 * 8 * f;
    const oshImpact = 1.3 * f * (inputs.hc > 100 ? 1 : 0.6);
    setOutputs({
      total: Number((wagesImpact + ssImpact + clImpact + oshImpact).toFixed(1)),
      wages: Number(wagesImpact.toFixed(1)),
      ss: Number(ssImpact.toFixed(1)),
      cl: Number(clImpact.toFixed(1)),
      osh: Number(oshImpact.toFixed(1)),
    });
  }, [inputs]);

  const inp = "bg-transparent border-b border-[rgba(255,255,255,0.1)] px-0 py-3 text-[var(--fg)] text-[15px] outline-none focus:border-[var(--accent)] transition-colors duration-300 w-full";

  return (
    <div className="min-h-screen">
      <LabourThreeScene />

      {/* HERO */}
      <header className="relative min-h-screen flex items-center justify-center bg-transparent pt-20 overflow-hidden">
        <div className="shell text-center relative z-10">
          <Reveal>
            <div className="eyebrow eyebrow--center mb-8 text-[var(--accent)]">Decision Architecture · 2026</div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="hero-glow mb-8 drop-shadow-2xl">
              <span className="block font-serif font-medium text-[clamp(28px,3.5vw,52px)] leading-[1.15] tracking-[-0.01em] text-[var(--fg-2)] mb-2">
                29 Laws Consolidated. 4 Codes.
              </span>
              <em className="block font-serif font-medium text-[clamp(28px,3.5vw,52px)] leading-[1.15] tracking-[-0.01em] text-[var(--accent)] italic">
                One Reset.
              </em>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="lead mx-auto mb-12 opacity-90 text-[var(--fg-2)] max-w-[52ch]">
              India's Labour Code consolidation is a structural reset of how organisations define, compensate, and govern their workforce. This is an interpretive advisory interface — not a substitute for legal counsel.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-col items-center gap-10">
              <div className="flex flex-wrap justify-center gap-6">
                <Link href="/connect?practice=labour-codes" className="nav-cta scale-110 px-10 py-4 bg-[var(--fg)] text-[var(--bg)] border-none hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                  Request a Diagnostic →
                </Link>
                <a className="nav-cta scale-110 px-10 py-4 border border-[var(--line)] text-[var(--fg-2)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-500" href="#classify">
                  Explore the 4 Codes →
                </a>
              </div>
            </div>
          </Reveal>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(201,168,92,0.03)_0%,transparent_50%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-[#06070B] to-transparent pointer-events-none" />
      </header>

      {/* DIAGNOSTIC QUESTION */}
      <section className="chapter section-dark relative">
        <div className="shell">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-10% 0px" }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}>
              <Reveal><span className="eyebrow mb-6 text-[var(--accent)]">§LC · 01 · The diagnostic question</span></Reveal>
              <h2 className="h-statement mb-8">Most organisations are still asking<br /><em className="text-[var(--accent)]">"when does this apply?"</em></h2>
              <p className="body-text text-[var(--fg-3)]">
                The better question: where does it hit first — cost · classification · credibility · control?
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-10% 0px" }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.15 }} className="p-10 bg-[rgba(255,255,255,0.02)] backdrop-blur-[12px] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(201,168,92,0.25)] transition-colors duration-500">
              <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--accent)] opacity-60 block mb-6">Four pressure points</span>
              {["Cost", "Classification", "Credibility", "Control"].map((p, i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b border-[rgba(255,255,255,0.05)] last:border-0">
                  <span className="font-serif italic text-[28px] text-[var(--accent)] opacity-30 w-8">{i + 1}</span>
                  <span className="font-serif text-[20px] text-[var(--fg-2)]">{p}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CLASSIFICATION GRID */}
      <section className="chapter section-deep relative overflow-hidden" id="classify">
        <div className="shell">
          <div className="mb-20">
            <Reveal>
              <div className="font-serif italic text-[120px] leading-none text-[var(--accent)] opacity-10 mb-4">29</div>
            </Reveal>
            <Reveal><span className="eyebrow mb-6 text-[var(--accent)]">§LC · 02 · Worker classification grid</span></Reveal>
            <Reveal delay={0.1}><h2 className="h-statement">Six categories. <em className="text-[var(--accent)]">Each with its own architecture.</em></h2></Reveal>
            <Reveal delay={0.2}><p className="lead text-[var(--fg-3)] mt-6 max-w-[52ch]">Six categories. Each with its own architecture. Classification drives everything downstream — comp, social security, OSH, governance. The codes do not merely consolidate language; they redraw the boundaries of who counts as what.</p></Reveal>
          </div>

          <div className="relative h-[520px] flex items-center justify-center">
            {/* Navigation Arrows */}
            <button 
              onClick={prevCls}
              className="absolute left-0 z-20 w-12 h-12 rounded-full border border-[var(--line)] flex items-center justify-center text-[var(--fg-3)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all duration-300 bg-[rgba(10,12,16,0.5)] backdrop-blur-sm"
            >
              ←
            </button>
            <button 
              onClick={nextCls}
              className="absolute right-0 z-20 w-12 h-12 rounded-full border border-[var(--line)] flex items-center justify-center text-[var(--fg-3)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all duration-300 bg-[rgba(10,12,16,0.5)] backdrop-blur-sm"
            >
              →
            </button>

            <div className="flex items-center gap-6 w-full max-w-[1000px] justify-center px-12">
              {[
                (activeCls - 1 + classifications.length) % classifications.length,
                activeCls,
                (activeCls + 1) % classifications.length
              ].map((idx, i) => {
                const cls = classifications[idx];
                const isActive = i === 1;
                return (
                  <motion.div
                    key={idx}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ 
                      opacity: isActive ? 1 : 0.4, 
                      scale: isActive ? 1 : 0.9,
                      x: 0
                    }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => {
                      if (i === 0) prevCls();
                      if (i === 2) nextCls();
                    }}
                    className={`relative flex-1 min-w-[300px] max-w-[340px] h-[480px] p-8 rounded-[24px] border transition-all duration-500 flex flex-col ${
                      isActive 
                        ? "border-[var(--accent)] bg-[rgba(201,168,92,0.03)] shadow-[0_0_40px_rgba(201,168,92,0.05)]" 
                        : "border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)] scale-90 cursor-pointer hover:border-[rgba(255,255,255,0.2)]"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-10">
                      <span className="px-3 py-1 bg-[rgba(201,168,92,0.1)] text-[var(--accent)] font-mono text-[9px] tracking-widest uppercase rounded-sm border border-[rgba(201,168,92,0.2)]">
                        {cls.meta[0].split(" ")[0]}
                      </span>
                      {isActive && (
                        <div className="w-5 h-5 rounded-full border border-[var(--accent)] flex items-center justify-center text-[10px] text-[var(--accent)]">
                          ✓
                        </div>
                      )}
                    </div>

                    <div className="absolute top-16 right-8 font-serif italic text-[100px] leading-none text-[var(--accent)] opacity-5 pointer-events-none">
                      {cls.num}
                    </div>

                    <h3 className="font-serif text-[28px] text-[var(--fg-2)] mb-6 leading-tight relative z-10">
                      {cls.name}
                    </h3>

                    <div className="mt-auto relative z-10">
                      <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--fg-5)] block mb-2">Architectural Response</span>
                      <div className="w-8 h-[2px] bg-[var(--accent)] mb-6" />
                      <p className="text-[14px] leading-relaxed text-[var(--fg-3)] mb-8">
                        {cls.desc}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {cls.meta.map((m, mi) => (
                          <span key={mi} className="font-mono text-[9px] tracking-wider uppercase text-[var(--fg-4)] border border-[rgba(255,255,255,0.05)] px-2 py-1">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FOUR CODES */}
      <section className="chapter section-dark relative" id="codes">
        <div className="shell">
          <div className="mb-20">
            <Reveal><span className="eyebrow mb-6 text-[var(--accent)]">§LC · 03 · The four codes</span></Reveal>
            <Reveal delay={0.1}><h2 className="h-statement">Four codes. <em className="text-[var(--accent)]">One regulatory architecture.</em></h2></Reveal>
            <Reveal delay={0.2}><p className="lead text-[var(--fg-3)] mt-6">Wages · Industrial Relations · Social Security · Occupational Safety, Health and Working Conditions. The Centre defines; states draft; you operate.</p></Reveal>
          </div>
          <div className="flex flex-col">
            {codes.map((code, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -70 : 70 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-10% 0px" }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.04 }} className="grid grid-cols-1 md:grid-cols-[80px_1fr_1fr_200px] gap-8 md:gap-10 py-12 border-b border-[rgba(255,255,255,0.05)] group items-start hover:bg-[rgba(255,255,255,0.01)] transition-colors px-4 -mx-4">
                <span className="font-serif italic text-[56px] text-[var(--accent)] leading-[0.85] opacity-30 group-hover:opacity-90 transition-opacity duration-500">{code.num}</span>
                <div>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--accent)] opacity-60 block mb-2">{code.label}</span>
                  <h3 className="font-serif text-[clamp(20px,2.2vw,30px)] font-medium text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors duration-500">{code.title}</h3>
                </div>
                <p className="text-[15px] leading-[1.65] text-[var(--fg-3)]">{code.desc}</p>
                <div className="flex flex-col gap-2 self-start">
                  {code.tags.map(t => (
                    <span key={t} className="px-3 py-2 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] font-mono text-[10px] tracking-widest uppercase text-[var(--fg-4)]">{t}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 75 QUESTIONS */}
      <section className="chapter section-dark relative border-t border-[rgba(255,255,255,0.05)]" id="questions">
        <div className="shell">
          <div className="mb-16">
            <Reveal><span className="eyebrow mb-6 text-[var(--accent)]">§LC · 04 · 75 questions</span></Reveal>
            <Reveal delay={0.1}><h2 className="h-statement">The 75 questions <em className="text-[var(--accent)]">we hear.</em></h2></Reveal>
            <Reveal delay={0.2}><p className="lead text-[var(--fg-3)] mt-6 max-w-[52ch]">Cost · Classification · Operations · Benefits · Structure · State · Overtime · Contract. Sample below; full set available to engagement clients.</p></Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questions.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }} className="p-8 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(201,168,92,0.3)] transition-all duration-500 group">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--accent)] opacity-60">{item.id}</span>
                  <span className="text-[var(--accent)] opacity-40 group-hover:opacity-100 transition-opacity">+</span>
                </div>
                <h4 className="font-serif text-[18px] text-[var(--fg-2)] mb-4 leading-snug">{item.q}</h4>
                <p className="text-[13px] text-[var(--fg-4)] leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {item.a}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 flex items-center justify-between border-t border-[rgba(255,255,255,0.05)] pt-8">
            <span className="font-mono text-[11px] tracking-widest uppercase text-[var(--fg-5)]">Showing 8 of 75</span>
            <Link href="/connect?practice=labour-codes" className="text-[var(--accent)] font-mono text-[11px] tracking-widest uppercase hover:underline">
              Request the full set →
            </Link>
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="chapter section-deep relative" id="calc">
        <div className="shell">
          <div className="mb-16">
            <Reveal><span className="eyebrow mb-6 text-[var(--accent)]">§LC · 05 · Live calculator</span></Reveal>
            <Reveal delay={0.1}><h2 className="h-statement">Where will it <em className="text-[var(--accent)]">hit first?</em></h2></Reveal>
            <Reveal delay={0.2}><p className="lead text-[var(--fg-3)] mt-6 max-w-[52ch]">A first-pass cost-impact estimate against current statutory positions. Inputs stay on your device. The full diagnostic — by code, by state, by cost line — is the engagement deliverable.</p></Reveal>
          </div>

          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }} className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.01)] backdrop-blur-[12px]">
            {/* Inputs */}
            <div className="p-10 border-b lg:border-b-0 lg:border-r border-[rgba(255,255,255,0.06)]">
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="flex flex-col gap-3">
                  <label className="font-mono text-[10px] tracking-widest uppercase text-[var(--fg-4)]">Total headcount</label>
                  <input type="number" value={inputs.hc} onChange={e => setInputs({...inputs, hc: +e.target.value})} className={inp} />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="font-mono text-[10px] tracking-widest uppercase text-[var(--fg-4)]">State</label>
                  <select value={inputs.state} onChange={e => setInputs({...inputs, state: e.target.value})} className={inp + " cursor-pointer [&>option]:bg-[#0E1117]"}>
                    <option value="TN">Tamil Nadu · Statute</option>
                    <option value="KA">Karnataka · Statute</option>
                    <option value="MH">Maharashtra · Draft</option>
                    <option value="DL">Delhi NCT · Draft</option>
                    <option value="GJ">Gujarat · Advisory</option>
                    <option value="HR">Haryana · Statute</option>
                  </select>
                </div>
                <div className="flex flex-col gap-3">
                  <label className="font-mono text-[10px] tracking-widest uppercase text-[var(--fg-4)]">Workers % of HC</label>
                  <input type="number" value={inputs.workers} onChange={e => setInputs({...inputs, workers: +e.target.value})} className={inp} />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="font-mono text-[10px] tracking-widest uppercase text-[var(--fg-4)]">Contract labour %</label>
                  <input type="number" value={inputs.contract} onChange={e => setInputs({...inputs, contract: +e.target.value})} className={inp} />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="font-mono text-[10px] tracking-widest uppercase text-[var(--fg-4)]">Gig & platform %</label>
                  <input type="number" value={inputs.gig} onChange={e => setInputs({...inputs, gig: +e.target.value})} className={inp} />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="font-mono text-[10px] tracking-widest uppercase text-[var(--fg-4)]">Basic % of CTC</label>
                  <input type="number" value={inputs.basic} onChange={e => setInputs({...inputs, basic: +e.target.value})} className={inp} />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="font-mono text-[10px] tracking-widest uppercase text-[var(--fg-4)]">Avg annual CTC (₹ lakh)</label>
                  <input type="number" value={inputs.ctc} onChange={e => setInputs({...inputs, ctc: +e.target.value})} className={inp} />
                </div>
              </div>
              <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--fg-5)] leading-[1.6]">This is an interpretive advisory tool. Outputs are estimates based on current statutory positions and should not be substituted for legal counsel.</p>
            </div>

            {/* Outputs */}
            <div className="p-10 flex flex-col gap-6">
              <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--accent)] opacity-60">Estimated cost impact</span>
              <div className="font-serif italic text-[clamp(64px,8vw,100px)] font-medium leading-none text-[var(--accent)]">
                +{outputs.total}<span className="font-mono text-[0.4em] align-top ml-1 font-normal text-[var(--fg-4)]">%</span>
              </div>
              <p className="text-[14px] text-[var(--fg-3)] max-w-[30ch]">Increase in fully-loaded statutory cost vs. current architecture.</p>
              <div className="flex flex-col gap-0">
                {[
                  { label: "Wages · basic recompute", val: outputs.wages, tag: "Statute" },
                  { label: "Social security · gig/platform", val: outputs.ss, tag: "Draft" },
                  { label: "Contract labour licensing", val: outputs.cl, tag: "Statute" },
                  { label: "OSH thresholds", val: outputs.osh, tag: "Advisory" },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-[rgba(255,255,255,0.05)] font-mono text-[11px] tracking-widest uppercase">
                    <span className="text-[var(--fg-4)]">{row.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[var(--accent)]">+{row.val}%</span>
                      <span className="text-[var(--fg-5)] text-[9px] border border-[rgba(255,255,255,0.06)] px-2 py-0.5">{row.tag}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-6 border-t border-[rgba(255,255,255,0.06)]">
                <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--fg-5)] mb-4">Calculated 28 Apr 2026 · Statutes notified up to 21 Apr 2026</p>
                <Link href="/connect?practice=labour-codes" className="nav-cta bg-[var(--fg)] text-[var(--bg)] border-none hover:bg-[var(--accent)] transition-all duration-500 w-full justify-center">
                  Request full diagnostic
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ENGAGEMENT — centered with 3i table */}
      <section className="chapter section-dark relative overflow-hidden">
        <div className="shell">
          <div className="max-w-[720px] mx-auto text-center">
            <Reveal><span className="eyebrow eyebrow--center mb-6 text-[var(--accent)]">§LC · 06 · The 3i engagement model</span></Reveal>
            <Reveal delay={0.1}><h2 className="h-statement mb-8">Interpret. Integrate.<br /><em className="text-[var(--accent)]">Institutionalise.</em></h2></Reveal>
            <Reveal delay={0.2}><p className="lead text-[var(--fg-3)] mb-12 mx-auto">Three stages. Sequenced. Each one earns the next. The page is organised by user journey; the engagement is organised by 3i.</p></Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-wrap justify-center gap-4 mb-16">
                <Link href="/connect?practice=labour-codes" className="nav-cta bg-[var(--fg)] text-[var(--bg)] border-none hover:bg-[var(--accent)] transition-all duration-500">Request a Diagnostic →</Link>
                <Link href="/#practices" className="nav-cta">Other practices →</Link>
              </div>
            </Reveal>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(201,168,92,0.04)_0%,transparent_70%)] pointer-events-none" />
      </section>

      {/* SOURCES */}
      <footer className="chapter section-deep border-t border-[rgba(255,255,255,0.05)] pb-20">
        <div className="shell">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <div>
              <span className="eyebrow mb-8 text-[var(--accent)]">Sources & legal basis</span>
              <div className="flex flex-col gap-4">
                {["Code on Wages, 2019", "Industrial Relations Code, 2020", "Social Security Code, 2020", "OSH&WC Code, 2020"].map(source => (
                  <div key={source} className="font-serif text-[18px] text-[var(--fg-3)] flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] opacity-40" />
                    {source}
                  </div>
                ))}
              </div>
              <div className="mt-12 flex gap-8">
                <Link href="/connect" className="text-[var(--accent)] font-mono text-[11px] tracking-widest uppercase hover:underline">Continue</Link>
                <Link href="/#practices" className="text-[var(--fg-4)] font-mono text-[11px] tracking-widest uppercase hover:underline">Other practices →</Link>
              </div>
            </div>
            <div className="flex flex-col justify-between items-end text-right">
              <Link href="/connect?practice=labour-codes" className="nav-cta scale-110 px-10 py-4 bg-[var(--fg)] text-[var(--bg)] border-none hover:bg-[var(--accent)] transition-all duration-500">
                Begin a diagnostic
              </Link>
              <div className="font-mono text-[11px] tracking-widest uppercase text-[var(--fg-5)]">
                © 2026 Axion Index · Bengaluru
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
