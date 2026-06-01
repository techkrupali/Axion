"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ChevronDown } from "lucide-react";

const SIGNALS = [
  "Growth is accelerating — stability is not",
  "The organisation behaves differently depending on who is in the room",
  "AI is increasing output — decision quality is dropping",
  "Cost is rising — I don't know why",
  "The business is stable — the future is not",
  "I have strong people — I don't have a strong system",
  "If not Mentioned",
];

const ROLES = ["Founder / CEO", "CFO", "CHRO", "Investor / Board", "Other"];
const SIZES = ["1–50", "51–200", "201–500", "501–2000", "2000+"];

type FormData = {
  breaking: string; whyNow: string; signal: string; shareThoughts: string;
  role: string; company: string; size: string;
  name: string; email: string; phone: string; callback: string;
};

const empty: FormData = {
  breaking: "", whyNow: "", signal: "", shareThoughts: "",
  role: "", company: "", size: "",
  name: "", email: "", phone: "", callback: "",
};

/* ── Custom Dropdown ── */
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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
                onClick={() => { onChange(opt); setOpen(false); }}
                className="w-full text-left px-4 py-3 text-[13.5px] transition-colors"
                style={{
                  color: value === opt ? "#C9A84C" : "rgba(237,235,227,0.75)",
                  background: value === opt ? "rgba(201,168,76,0.08)" : "transparent",
                  borderBottom: i < options.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.07)"; (e.currentTarget as HTMLElement).style.color = "#EDEBE3"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = value === opt ? "rgba(201,168,76,0.08)" : "transparent"; (e.currentTarget as HTMLElement).style.color = value === opt ? "#C9A84C" : "rgba(237,235,227,0.75)"; }}
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

export default function DiagnosticModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(empty);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof FormData, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function submit() {
    setLoading(true);
    await fetch("/api/diagnostic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    setSubmitted(true);
  }

  const canNext1 = form.breaking.trim().length > 0;
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
        style={{ background: "rgba(4,5,8,0.85)", backdropFilter: "blur(20px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-[560px] rounded-[28px] p-8 md:p-10"
          style={{
            background: "rgba(10,12,18,0.98)",
            border: "1px solid rgba(201,168,76,0.35)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(201,168,76,0.08)",
          }}
        >
          {/* Close */}
          <button onClick={onClose} className="absolute top-5 right-5 text-[var(--fg-5)] hover:text-[var(--fg)] transition-colors">
            <X size={18} />
          </button>

          {!submitted ? (
            <>
              {/* Progress */}
              <div className="flex items-center gap-2 mb-8">
                {[1, 2, 3].map(n => (
                  <div key={n} className="h-[2px] flex-1 rounded-full transition-all duration-500"
                    style={{ background: n <= step ? "#C9A84C" : "rgba(201,168,76,0.15)" }} />
                ))}
                <span className="font-mono text-[9px] tracking-[0.3em] text-[var(--fg-5)] ml-2 shrink-0">{step} OF 3</span>
              </div>

              {/* Step 1 */}
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                  <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-[var(--accent)] mb-2">Your Signal</p>
                  <h3 className="font-serif text-[26px] text-[var(--fg)] mb-8 leading-tight">What's breaking?</h3>

                  <label className="block mb-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--fg-4)]">Describe it in one line</label>
                  <textarea
                    rows={3}
                    value={form.breaking}
                    onChange={e => set("breaking", e.target.value)}
                    placeholder="e.g. We're growing fast but decisions keep stalling at the top…"
                    className="w-full rounded-[12px] px-4 py-3 text-[14px] text-[var(--fg)] placeholder:text-[var(--fg-5)] resize-none mb-5 outline-none focus:border-[var(--accent)]"
                    style={inputStyle}
                    autoFocus
                  />

                  <label className="block mb-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--fg-4)]">Why now?</label>
                  <input
                    type="text"
                    value={form.whyNow}
                    onChange={e => set("whyNow", e.target.value)}
                    placeholder="What's changed or accelerating?"
                    className="w-full rounded-[12px] px-4 py-3 text-[14px] text-[var(--fg)] placeholder:text-[var(--fg-5)] mb-5 outline-none focus:border-[var(--accent)]"
                    style={inputStyle}
                  />

                  <label className="block mb-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--fg-4)]">Which signal is loudest?</label>
                  <CustomSelect
                    value={form.signal}
                    onChange={v => { set("signal", v); if (v !== "If not Mentioned") set("shareThoughts", ""); }}
                    options={SIGNALS}
                    placeholder="Select a signal…"
                  />

                  <AnimatePresence>
                    {form.signal === "If not Mentioned" && (
                      <motion.div
                        key="share-thoughts"
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 0 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <label className="block mb-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--fg-4)]">
                          Share Your Thoughts
                        </label>
                        <textarea
                          rows={3}
                          value={form.shareThoughts}
                          onChange={e => set("shareThoughts", e.target.value)}
                          placeholder="Describe the signal in your own words…"
                          className="w-full rounded-[12px] px-4 py-3 text-[14px] text-[var(--fg)] placeholder:text-[var(--fg-5)] resize-none mb-5 outline-none"
                          style={{
                            background: "rgba(201,168,76,0.04)",
                            border: "1px solid rgba(201,168,76,0.25)",
                          }}
                          autoFocus
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!canNext1}
                    className="w-full py-4 rounded-full font-mono text-[11px] tracking-[0.28em] uppercase font-semibold flex items-center justify-center gap-2 transition-opacity disabled:opacity-30 mt-3"
                    style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)", color: "#080A0F" }}
                  >
                    Continue <ArrowRight size={12} />
                  </button>
                </motion.div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
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

                  <div className="flex gap-3 mt-3">
                    <button onClick={() => setStep(1)} className="flex-1 py-4 rounded-full font-mono text-[11px] tracking-[0.28em] uppercase transition-colors"
                      style={{ border: "1px solid rgba(201,168,76,0.25)", color: "var(--fg-4)" }}>Back</button>
                    <button onClick={() => setStep(3)} disabled={!canNext2}
                      className="flex-[2] py-4 rounded-full font-mono text-[11px] tracking-[0.28em] uppercase font-semibold flex items-center justify-center gap-2 transition-opacity disabled:opacity-30"
                      style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)", color: "#080A0F" }}>
                      Continue <ArrowRight size={12} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                  <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-[var(--accent)] mb-2">Where We Reach You</p>
                  <h3 className="font-serif text-[26px] text-[var(--fg)] mb-8 leading-tight">Almost done.</h3>

                  <div className="flex gap-3 mb-5">
                    <div className="flex-1">
                      <label className="block mb-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--fg-4)]">Name</label>
                      <input type="text" value={form.name} onChange={e => set("name", e.target.value)} placeholder="Your name"
                        className="w-full rounded-[12px] px-4 py-3 text-[14px] text-[var(--fg)] placeholder:text-[var(--fg-5)] outline-none" style={inputStyle} />
                    </div>
                    <div className="flex-1">
                      <label className="block mb-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--fg-4)]">Email</label>
                      <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@company.com"
                        className="w-full rounded-[12px] px-4 py-3 text-[14px] text-[var(--fg)] placeholder:text-[var(--fg-5)] outline-none" style={inputStyle} />
                    </div>
                  </div>

                  <label className="block mb-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--fg-4)]">Phone</label>
                  <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+91 98765 43210"
                    className="w-full rounded-[12px] px-4 py-3 text-[14px] text-[var(--fg)] placeholder:text-[var(--fg-5)] mb-5 outline-none" style={inputStyle} />

                  <label className="block mb-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--fg-4)]">
                    Preferred callback window <span className="opacity-50 normal-case">(optional)</span>
                  </label>
                  <input type="text" value={form.callback} onChange={e => set("callback", e.target.value)} placeholder="e.g. Weekday mornings, after 6pm…"
                    className="w-full rounded-[12px] px-4 py-3 text-[14px] text-[var(--fg)] placeholder:text-[var(--fg-5)] mb-8 outline-none" style={inputStyle} />

                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="flex-1 py-4 rounded-full font-mono text-[11px] tracking-[0.28em] uppercase transition-colors"
                      style={{ border: "1px solid rgba(201,168,76,0.25)", color: "var(--fg-4)" }}>Back</button>
                    <button onClick={submit} disabled={!canSubmit || loading}
                      className="flex-[2] py-4 rounded-full font-mono text-[11px] tracking-[0.28em] uppercase font-semibold flex items-center justify-center gap-2 transition-opacity disabled:opacity-30"
                      style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)", color: "#080A0F" }}>
                      {loading ? "Sending…" : <><span>Send Signal</span> <ArrowRight size={12} /></>}
                    </button>
                  </div>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ border: "1px solid rgba(201,168,76,0.5)", background: "rgba(201,168,76,0.08)" }}>
                <span className="text-[var(--accent)] text-[22px]">✦</span>
              </div>
              <h3 className="font-serif text-[28px] text-[var(--fg)] mb-4">Signal received.</h3>
              <p className="font-serif italic text-[16px] text-[var(--fg-3)] leading-relaxed max-w-[34ch] mx-auto">
                We'll read the architecture behind it and come back to you within 48 hours.
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
