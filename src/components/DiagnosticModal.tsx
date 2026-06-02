"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, GripVertical, ChevronDown } from "lucide-react";

// ── Signal list with backend routing metadata (never shown to visitor) ──
const ALL_SIGNALS: { text: string; practice: string }[] = [
  { text: "Growth is accelerating. Stability is not.",                       practice: "People Architecture" },
  { text: "The company runs on a few people. None of it is written down.",   practice: "People Architecture" },
  { text: "Lose one person, and a whole function goes quiet.",               practice: "People Architecture" },
  { text: "Everything still routes through me.",                             practice: "People Architecture" },
  { text: "We hired ahead of the structure. Now the structure can't keep up.", practice: "People Architecture" },
  { text: "Costs are climbing. Headcount doesn't explain the part that keeps me up.", practice: "Labour Codes" },
  { text: "I can report the workforce number. I can't govern it.",           practice: "Labour Codes" },
  { text: "Every audit becomes a fire drill.",                               practice: "Labour Codes" },
  { text: "The rules changed retroactively. Our structure didn't.",          practice: "Labour Codes" },
  { text: "We're compliant on paper, exposed in practice.",                  practice: "Labour Codes" },
  { text: "Output is getting faster. Judgment is not.",                      practice: "AI Edge Lab" },
  { text: "AI is making us quicker, not wiser.",                             practice: "AI Edge Lab" },
  { text: "We adopted the tools. We never built the rules.",                 practice: "AI Edge Lab" },
  { text: "No one owns what the AI is allowed to decide.",                   practice: "AI Edge Lab" },
  { text: "Continuity depends on me, not on structure.",                     practice: "Family Business" },
  { text: "Succession is the risk no one at the table will name.",           practice: "Family Business" },
  { text: "Family and business decisions run on the same table.",            practice: "Family Business" },
  { text: "The next generation is ready in name, not in architecture.",      practice: "Family Business" },
  { text: "Something else. I'll describe it.",                               practice: "Catch-all" },
];

const ROLES = ["Founder / CEO", "CFO", "CHRO", "Investor / Board", "Other"];
const SIZES = ["1–50", "51–200", "201–500", "501–2000", "2000+"];

type FormData = {
  signals: string[];
  rankedSignals: string[];
  catchAllDetail: string;
  whyNow: string;
  role: string;
  company: string;
  size: string;
  name: string;
  email: string;
  phone: string;
  callback: string;
};

const empty: FormData = {
  signals: [],
  rankedSignals: [],
  catchAllDetail: '',
  whyNow: '',
  role: '',
  company: '',
  size: '',
  name: '',
  email: '',
  phone: '',
  callback: '',
};

// ── Custom dropdown (kept for role / size) ──
function CustomSelect({
  value, onChange, options, placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropPos({ top: rect.bottom + 6, left: rect.left, width: rect.width });
    }
    setOpen(o => !o);
  };

  return (
    <div ref={ref} className="relative w-full mb-5">
      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="w-full rounded-[12px] px-4 py-3 text-[14px] text-left flex items-center justify-between outline-none transition-colors"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${open ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.08)"}`,
          color: value ? "var(--fg)" : "var(--fg-5)",
        }}
      >
        <span className="truncate">{value || placeholder}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} style={{ color: "var(--fg-4)", flexShrink: 0 }} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              top: dropPos.top,
              left: dropPos.left,
              width: dropPos.width,
              zIndex: 9999,
              background: "rgba(14,16,24,0.99)",
              border: "1px solid rgba(201,168,76,0.25)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.8), 0 0 0 1px rgba(201,168,76,0.08)",
              backdropFilter: "blur(20px)",
              borderRadius: "14px",
              maxHeight: "240px",
              overflowY: "auto",
            }}
          >
            {options.map((opt, i) => (
              <button
                key={opt}
                type="button"
                onMouseDown={() => { onChange(opt); setOpen(false); }}
                className="w-full text-left px-4 py-3 text-[13.5px] transition-colors"
                style={{
                  color: value === opt ? "#C9A84C" : "rgba(237,235,227,0.75)",
                  background: value === opt ? "rgba(201,168,76,0.08)" : "transparent",
                  borderBottom: i < options.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.07)";
                  (e.currentTarget as HTMLElement).style.color = "#EDEBE3";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = value === opt ? "rgba(201,168,76,0.08)" : "transparent";
                  (e.currentTarget as HTMLElement).style.color = value === opt ? "#C9A84C" : "rgba(237,235,227,0.75)";
                }}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Drag-to-rank top 3 ──
function RankList({
  ranked,
  onReorder,
}: {
  ranked: string[];
  onReorder: (items: string[]) => void;
}) {
  const dragIndex = useRef<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  const handleDragStart = (i: number) => { dragIndex.current = i; };
  const handleDragEnter = (i: number) => { dragOverIndex.current = i; };
  const handleDrop = () => {
    if (dragIndex.current === null || dragOverIndex.current === null) return;
    if (dragIndex.current === dragOverIndex.current) return;
    const updated = [...ranked];
    const [moved] = updated.splice(dragIndex.current, 1);
    updated.splice(dragOverIndex.current, 0, moved);
    onReorder(updated);
    dragIndex.current = null;
    dragOverIndex.current = null;
  };

  return (
    <div className="mt-6 space-y-2">
      <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-[var(--accent)] mb-3">
        Drag to rank your top 3 <span className="opacity-50 normal-case">(optional)</span>
      </p>
      {ranked.map((sig, i) => (
        <div
          key={sig}
          draggable
          onDragStart={() => handleDragStart(i)}
          onDragEnter={() => handleDragEnter(i)}
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          className="flex items-center gap-3 rounded-[12px] px-4 py-3 cursor-grab active:cursor-grabbing select-none"
          style={{
            background: "rgba(201,168,76,0.06)",
            border: "1px solid rgba(201,168,76,0.2)",
          }}
        >
          <span className="font-mono text-[11px] text-[var(--accent)] opacity-60 w-4 shrink-0">{i + 1}</span>
          <GripVertical size={12} className="text-[var(--fg-5)] shrink-0" />
          <span className="text-[13px] text-[var(--fg-3)] leading-snug">{sig}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main modal ──
export default function DiagnosticModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(empty);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = useCallback(<K extends keyof FormData>(k: K, v: FormData[K]) =>
    setForm(f => ({ ...f, [k]: v })), []);

  // Toggle signal selection
  const toggleSignal = (text: string) => {
    setForm(f => {
      const already = f.signals.includes(text);
      const signals = already
        ? f.signals.filter(s => s !== text)
        : [...f.signals, text];
      // If deselecting, remove from ranked too
      const rankedSignals = already
        ? f.rankedSignals.filter(s => s !== text)
        : f.rankedSignals;
      return { ...f, signals, rankedSignals };
    });
  };

  // When ranking: if <3 selected, auto-populate ranked from selected; else let user manage
  const handleRankToggle = (text: string) => {
    setForm(f => {
      const inRank = f.rankedSignals.includes(text);
      if (inRank) {
        return { ...f, rankedSignals: f.rankedSignals.filter(s => s !== text) };
      }
      if (f.rankedSignals.length >= 3) return f; // max 3
      return { ...f, rankedSignals: [...f.rankedSignals, text] };
    });
  };

  async function submit() {
    setLoading(true);
    // Derive practice routing from selected signals (backend use only)
    const practices = [...new Set(
      form.signals
        .map(s => ALL_SIGNALS.find(a => a.text === s)?.practice)
        .filter(Boolean)
    )];

    await fetch("/api/diagnostic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        breaking: form.signals.join(" | ") || "—",
        signal: form.signals[0] || "",
        signals: form.signals,
        rankedSignals: form.rankedSignals,
        catchAllDetail: form.catchAllDetail,
        whyNow: form.whyNow,
        practices,
        role: form.role,
        company: form.company,
        size: form.size,
        name: form.name,
        email: form.email,
        phone: form.phone,
        callback: form.callback,
      }),
    });
    setLoading(false);
    setSubmitted(true);
  }

  const hasCatchAll = form.signals.includes("Something else. I'll describe it.");
  const canNext1 = form.signals.length > 0 && (!hasCatchAll || form.catchAllDetail.trim().length > 0);
  const canNext2 = form.role && form.company.trim().length > 0;
  const canSubmit = form.name.trim().length > 0 && form.email.includes("@");

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{ background: "rgba(4,5,8,0.88)", backdropFilter: "blur(20px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-[580px] rounded-[28px] flex flex-col"
          style={{
            background: "rgba(10,12,18,0.98)",
            border: "1px solid rgba(201,168,76,0.35)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(201,168,76,0.08)",
            maxHeight: "85vh",
            height: "auto",
          }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-10 text-[var(--fg-5)] hover:text-[var(--fg)] transition-colors"
          >
            <X size={18} />
          </button>

          {/* Scrollable content area */}
          <div className="overflow-y-scroll p-8 md:p-10 pb-4 scrollable-content" style={{ 
            maxHeight: "70vh", 
            scrollbarWidth: "thin", 
            scrollbarColor: "rgba(201,168,76,0.7) rgba(201,168,76,0.15)",
            WebkitOverflowScrolling: "touch"
          }}>
            <style>{`
              /* Always show scrollbar */
              .scrollable-content::-webkit-scrollbar {
                width: 10px;
                display: block !important;
                opacity: 1 !important;
              }
              .scrollable-content::-webkit-scrollbar-track {
                background: rgba(201,168,76,0.15);
                border-radius: 5px;
              }
              .scrollable-content::-webkit-scrollbar-thumb {
                background: rgba(201,168,76,0.7);
                border-radius: 5px;
                display: block !important;
                opacity: 1 !important;
                visibility: visible !important;
              }
              .scrollable-content::-webkit-scrollbar-thumb:hover {
                background: rgba(201,168,76,0.9);
              }
              /* For Firefox */
              .scrollable-content {
                scrollbar-width: thin;
                scrollbar-color: rgba(201,168,76,0.7) rgba(201,168,76,0.15);
                overflow-y: scroll !important;
              }
            `}</style>
            {!submitted ? (
              <>
                {/* Progress bar */}
                <div className="flex items-center gap-2 mb-8">
                  {[1, 2, 3].map(n => (
                    <div
                      key={n}
                      className="h-[2px] flex-1 rounded-full transition-all duration-500"
                      style={{ background: n <= step ? "#C9A84C" : "rgba(201,168,76,0.15)" }}
                    />
                  ))}
                  <span className="font-mono text-[9px] tracking-[0.3em] text-[var(--fg-5)] ml-2 shrink-0">{step} OF 3</span>
                </div>

                {/* ── STEP 1: Signal selection ── */}
                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
                    {/* Header copy */}
                    <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-[var(--accent)] mb-2">
                      Your Signal
                    </p>
                    <h3 className="font-serif text-[28px] text-[var(--fg)] leading-tight mb-1">
                      Bring your signal.
                    </h3>
                    <p className="text-[13px] text-[var(--fg-4)] mb-6 leading-relaxed">
                      Don't pick a service. Pick what you're feeling — we'll read the architecture producing it.
                    </p>

                    {/* Select instruction */}
                    <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--fg-4)] mb-4">
                      Which signals are you feeling? Select all that apply — then drag your top 3 in order if you want.
                    </p>

                    {/* Signal checklist — visitor only sees signal text */}
                    <div className="space-y-2">
                      {ALL_SIGNALS.map(({ text }) => {
                        const selected = form.signals.includes(text);
                        return (
                          <button
                            key={text}
                            type="button"
                            onClick={() => toggleSignal(text)}
                            className="w-full text-left flex items-start gap-3 rounded-[12px] px-4 py-3 transition-all duration-200 group"
                            style={{
                              background: selected ? "rgba(201,168,76,0.09)" : "rgba(255,255,255,0.03)",
                              border: `1px solid ${selected ? "rgba(201,168,76,0.45)" : "rgba(255,255,255,0.07)"}`,
                            }}
                          >
                            {/* Checkbox */}
                            <span
                              className="mt-[2px] shrink-0 w-[16px] h-[16px] rounded-[4px] flex items-center justify-center transition-all duration-200"
                              style={{
                                background: selected ? "#C9A84C" : "transparent",
                                border: `1.5px solid ${selected ? "#C9A84C" : "rgba(255,255,255,0.2)"}`,
                              }}
                            >
                              {selected && (
                                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                  <path d="M1 3.5L3.5 6L8 1" stroke="#080A0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </span>
                            <span
                              className="text-[13.5px] leading-snug transition-colors duration-200"
                              style={{ color: selected ? "var(--fg)" : "rgba(237,235,227,0.55)" }}
                            >
                              {text}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Catch-all detail box */}
                    <AnimatePresence>
                      {hasCatchAll && (
                        <motion.div
                          key="catch-all"
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          style={{ overflow: "hidden" }}
                        >
                          <label className="block mb-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--fg-4)]">
                            Describe it
                          </label>
                          <textarea
                            rows={3}
                            value={form.catchAllDetail}
                            onChange={e => set("catchAllDetail", e.target.value)}
                            placeholder="Describe the signal in your own words…"
                            className="w-full rounded-[12px] px-4 py-3 text-[14px] text-[var(--fg)] placeholder:text-[var(--fg-5)] resize-none outline-none"
                            style={{
                              background: "rgba(201,168,76,0.04)",
                              border: "1px solid rgba(201,168,76,0.25)",
                            }}
                            autoFocus
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Optional drag-to-rank top 3 (only shown when ≥2 selected) */}
                    {form.signals.length >= 2 && (
                      <div className="mt-6">
                        <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-[var(--accent)] mb-3">
                          Drag to rank your top 3{" "}
                          <span className="opacity-50 normal-case">(optional)</span>
                        </p>
                        <p className="text-[12px] text-[var(--fg-5)] mb-3 leading-relaxed">
                          Click to add to your ranking, then drag to reorder.
                        </p>

                        {/* Rank slots */}
                        {form.rankedSignals.length > 0 && (
                          <RankList
                            ranked={form.rankedSignals}
                            onReorder={items => set("rankedSignals", items)}
                          />
                        )}

                        {/* Add to rank — show selected signals not yet ranked */}
                        {form.signals
                          .filter(s => !form.rankedSignals.includes(s))
                          .slice(0, 6).length > 0 && form.rankedSignals.length < 3 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {form.signals
                              .filter(s => !form.rankedSignals.includes(s))
                              .map(s => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => handleRankToggle(s)}
                                  className="text-[11px] font-mono px-3 py-1.5 rounded-full transition-all duration-200"
                                  style={{
                                    background: "rgba(201,168,76,0.07)",
                                    border: "1px solid rgba(201,168,76,0.2)",
                                    color: "rgba(201,168,76,0.7)",
                                  }}
                                >
                                  + {s.length > 40 ? s.slice(0, 40) + "…" : s}
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Why Now field */}
                    <div className="mt-8">
                      <label className="block mb-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--fg-4)]">
                        What’s loudest — and why now?
                      </label>
                      <textarea
                        rows={2}
                        value={form.whyNow}
                        onChange={e => set("whyNow", e.target.value)}
                        placeholder="One line on what’s breaking. One line on why it surfaced now."
                        className="w-full rounded-[12px] px-4 py-3 text-[14px] text-[var(--fg)] placeholder:text-[var(--fg-5)] resize-none outline-none"
                        style={{
                          background: "rgba(201,168,76,0.04)",
                          border: "1px solid rgba(201,168,76,0.25)",
                        }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 2: Context ── */}
                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
                    <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-[var(--accent)] mb-2">Where You Sit</p>
                    <h3 className="font-serif text-[26px] text-[var(--fg)] mb-8 leading-tight">Your context.</h3>

                    <label className="block mb-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--fg-4)]">Your role</label>
                    <CustomSelect
                      value={form.role}
                      onChange={v => set("role", v)}
                      options={ROLES}
                      placeholder="Select your role…"
                    />

                    <label className="block mb-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--fg-4)]">Company</label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={e => set("company", e.target.value)}
                      placeholder="Company name"
                      className="w-full rounded-[12px] px-4 py-3 text-[14px] text-[var(--fg)] placeholder:text-[var(--fg-5)] mb-5 outline-none"
                      style={inputStyle}
                    />

                    <label className="block mb-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--fg-4)]">Company size</label>
                    <CustomSelect
                      value={form.size}
                      onChange={v => set("size", v)}
                      options={SIZES}
                      placeholder="Select size…"
                    />
                  </motion.div>
                )}

                {/* ── STEP 3: Contact ── */}
                {step === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
                    <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-[var(--accent)] mb-2">Where We Reach You</p>
                    <h3 className="font-serif text-[26px] text-[var(--fg)] mb-8 leading-tight">Almost done.</h3>

                    <div className="flex gap-3 mb-5">
                      <div className="flex-1">
                        <label className="block mb-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--fg-4)]">Name</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={e => set("name", e.target.value)}
                          placeholder="Your name"
                          className="w-full rounded-[12px] px-4 py-3 text-[14px] text-[var(--fg)] placeholder:text-[var(--fg-5)] outline-none"
                          style={inputStyle}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block mb-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--fg-4)]">Email</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={e => set("email", e.target.value)}
                          placeholder="you@company.com"
                          className="w-full rounded-[12px] px-4 py-3 text-[14px] text-[var(--fg)] placeholder:text-[var(--fg-5)] outline-none"
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    <label className="block mb-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--fg-4)]">Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => set("phone", e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-[12px] px-4 py-3 text-[14px] text-[var(--fg)] placeholder:text-[var(--fg-5)] mb-5 outline-none"
                      style={inputStyle}
                    />

                    <label className="block mb-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--fg-4)]">
                      Preferred callback window{" "}
                      <span className="opacity-50 normal-case">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={form.callback}
                      onChange={e => set("callback", e.target.value)}
                      placeholder="e.g. Weekday mornings, after 6pm…"
                      className="w-full rounded-[12px] px-4 py-3 text-[14px] text-[var(--fg)] placeholder:text-[var(--fg-5)] outline-none"
                      style={inputStyle}
                    />
                  </motion.div>
                )}
              </>
            ) : (
              /* ── Success ── */
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ border: "1px solid rgba(201,168,76,0.5)", background: "rgba(201,168,76,0.08)" }}
                >
                  <span className="text-[var(--accent)] text-[22px]">✦</span>
                </div>
                <h3 className="font-serif text-[28px] text-[var(--fg)] mb-4">Signal received.</h3>
                <p className="font-serif italic text-[16px] text-[var(--fg-3)] leading-relaxed max-w-[34ch] mx-auto">
                  We'll read the architecture behind it and come back to you within 48 hours.
                </p>
              </motion.div>
            )}
          </div>

          {/* Fixed footer for buttons */}
          {!submitted && (
            <div className="p-8 md:px-10 md:pb-10 pt-4 border-t border-transparent" style={{ borderTop: "1px solid rgba(201,168,76,0.1)" }}>
              {step === 1 && (
                <button
                  onClick={() => setStep(2)}
                  disabled={!canNext1}
                  className="w-full py-4 rounded-full font-mono text-[11px] tracking-[0.28em] uppercase font-semibold flex items-center justify-center gap-2 transition-opacity disabled:opacity-30"
                  style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)", color: "#080A0F" }}
                >
                  Continue <ArrowRight size={12} />
                </button>
              )}
              {step === 2 && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 rounded-full font-mono text-[11px] tracking-[0.28em] uppercase transition-colors"
                    style={{ border: "1px solid rgba(201,168,76,0.25)", color: "var(--fg-4)" }}
                  >Back</button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!canNext2}
                    className="flex-[2] py-4 rounded-full font-mono text-[11px] tracking-[0.28em] uppercase font-semibold flex items-center justify-center gap-2 transition-opacity disabled:opacity-30"
                    style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)", color: "#080A0F" }}
                  >
                    Continue <ArrowRight size={12} />
                  </button>
                </div>
              )}
              {step === 3 && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 rounded-full font-mono text-[11px] tracking-[0.28em] uppercase transition-colors"
                    style={{ border: "1px solid rgba(201,168,76,0.25)", color: "var(--fg-4)" }}
                  >Back</button>
                  <button
                    onClick={submit}
                    disabled={!canSubmit || loading}
                    className="flex-[2] py-4 rounded-full font-mono text-[11px] tracking-[0.28em] uppercase font-semibold flex items-center justify-center gap-2 transition-opacity disabled:opacity-30"
                    style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)", color: "#080A0F" }}
                  >
                    {loading ? "Sending…" : <><span>Send Signal</span> <ArrowRight size={12} /></>}
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
