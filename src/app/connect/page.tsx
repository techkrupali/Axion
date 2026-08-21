"use client";

import { Reveal } from "@/components/Reveal";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Footer from "@/components/Footer";
import Button from "@/components/Button";

const practices = ["People Architecture", "Labour Codes", "AI Edge Lab", "Family Business", "Not sure yet"];

const readings = [
  "Growth is accelerating. Stability is not.",
  "The organisation behaves differently depending on who is in the room.",
  "AI is increasing output. Decision quality is dropping.",
  "Cost is rising. I don't know why.",
  "The business is stable. The future is not.",
  "I have strong people. I do not have a strong system.",
];

const sidebarItems = [
  { label: "Direct: nitin@axionindex.org", content: <a href="mailto:nitin@axionindex.org" className="font-serif text-[18px] text-[var(--fg)] hover:text-[var(--accent)] transition-colors duration-300 block">nitin@axionindex.org</a> },
  { label: "Calendar", content: <p className="text-[14px] leading-[1.65] text-[var(--fg-4)]">Calls are arranged after the written intent — not before.</p> },
  { label: "Press & speaking", content: <p className="text-[14px] leading-[1.65] text-[var(--fg-4)]">Press, speaking and editorial requests via the same channel — please mark the subject line accordingly.</p> },
  { label: "On discretion", content: <p className="text-[14px] leading-[1.65] text-[var(--fg-4)]">Axion Index works with founders, boards and CHROs in regulated and family-held contexts. References, case material, and engagement details are not published on the website. They are shared on request, where relevant.</p> },
  { label: "What we don't do", content: <p className="text-[14px] leading-[1.65] text-[var(--fg-4)]">Recruiting · payroll · vendor management · executive coaching · culture surveys · &ldquo;engagement&rdquo; programs.</p> },
];

export default function Connect() {
  const [selectedPractice, setSelectedPractice] = useState<string | null>(null);
  const [selectedReading, setSelectedReading] = useState<string>("");
  const [form, setForm] = useState({ name: "", role: "", organisation: "", email: "", message: "" });
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!form.name.trim() || !form.email.trim()) {
      setErrorMsg("Name and email are required.");
      setSubmitState("error");
      return;
    }
    setSubmitState("sending");
    try {
      const res = await fetch("/api/written-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, practice: selectedPractice || "", reading: selectedReading || "" }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to send");
      setSubmitState("sent");
      setForm({ name: "", role: "", organisation: "", email: "", message: "" });
      setSelectedPractice(null);
      setSelectedReading("");
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setSubmitState("error");
    }
  };

  const inputClass = "bg-transparent border-b border-[var(--line-strong)] px-0 py-3 text-[var(--fg)] text-[16px] outline-none focus:border-[var(--accent)] transition-colors duration-300 placeholder:text-[var(--fg-5)] w-full";

  return (
    <div className="min-h-screen">

      {/* SUCCESS POPUP */}
      <AnimatePresence>
        {submitState === "sent" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
            style={{ background: "rgba(6,7,10,0.78)", backdropFilter: "blur(6px)" }}
            onClick={() => setSubmitState("idle")}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[440px] bg-[#0C0E14] border border-[#C9A24A]/25 rounded-[28px] p-10 text-center shadow-2xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#C9A24A]/10 border border-[#C9A24A]/25 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-[#C9A24A]" />
              </div>
              <h3 className="font-serif text-[26px] leading-tight text-[var(--fg)] mb-3">
                Intent submitted
              </h3>
              <p className="text-[15px] leading-[1.7] text-[var(--fg-4)] mb-8">
                Your written intent has been submitted successfully. Our team will connect with you within <span className="text-[#C9A24A]">24–48 hours</span>.
              </p>
              <button
                type="button"
                onClick={() => setSubmitState("idle")}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 font-mono text-[11px] tracking-[0.24em] uppercase rounded-full font-semibold bg-[#C9A24A] text-[#0A0A0B] transition-transform active:scale-[0.97]"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-connect" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(201,168,76,1)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-connect)" />
          </svg>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_30%,var(--bg)_100%)]" />
        </div>
        <div className="absolute top-[20%] right-[20%] w-[500px] h-[500px] rounded-full opacity-[0.04] pointer-events-none"
          style={{ background: "radial-gradient(circle, #C9A24A 0%, transparent 70%)", animation: "float 14s ease-in-out infinite" }} />

        <div className="shell text-center relative z-10 pt-20">
          <Reveal>
            <div className="eyebrow eyebrow--center mb-10 text-[var(--accent)]">AXION&nbsp;&nbsp;·&nbsp;&nbsp;CONNECT</div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="hero-glow mb-8">
              <span className="block font-serif font-normal text-[clamp(28px,3.5vw,52px)] leading-[1.15] tracking-[-0.01em] text-[var(--fg-2)] mb-2">
                Begin a conversation.
              </span>
              <em className="block font-serif font-medium text-[clamp(28px,3.5vw,52px)] leading-[1.15] tracking-[-0.01em] text-[var(--accent)] italic">
                From ambiguity to architecture.
              </em>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="lead mx-auto mb-14 text-[var(--fg-3)] max-w-[50ch]">
              Axion Index does not start with discovery calls. Every engagement begins with a written intent — a short note about where the architecture is under stress and what change is being considered. We respond within 48 hours.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <a className="kbd-arrow text-[var(--fg-4)] hover:text-[var(--accent)]" href="#form">
              Write your intent
            </a>
          </Reveal>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[35vh] bg-gradient-to-t from-[var(--bg)] to-transparent pointer-events-none" />
      </header>

      {/* FORM + SIDEBAR */}
      <section className="chapter section-dark relative" id="form">
        <div className="shell">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-16 lg:gap-24">

            {/* FORM */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-10">
                <span className="eyebrow mb-4 text-[var(--accent)]">Written intent</span>
                <p className="text-[15px] text-[var(--fg-4)] mt-3 leading-relaxed">
                  Five fields. Most filled in 4–6 minutes. The form is not screened by anyone other than the founder.
                </p>
              </div>

              <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                {[
                  { label: "Name", k: "name", type: "text", placeholder: "Your name" },
                  { label: "Role", k: "role", type: "text", placeholder: "e.g. Founder, CFO, CHRO" },
                  { label: "Organisation", k: "organisation", type: "text", placeholder: "Your organisation" },
                  { label: "Email", k: "email", type: "email", placeholder: "your@email.com" },
                ].map((field) => (
                  <div key={field.label} className="flex flex-col gap-3">
                    <label className="font-mono text-[10px] tracking-widest uppercase text-[var(--fg-4)]">{field.label}</label>
                    <input
                      type={field.type}
                      className={inputClass}
                      placeholder={field.placeholder}
                      value={(form as any)[field.k]}
                      onChange={(e) => setForm((f) => ({ ...f, [field.k]: e.target.value }))}
                    />
                  </div>
                ))}

                {/* Practice */}
                <div className="flex flex-col gap-4">
                  <label className="font-mono text-[10px] tracking-widest uppercase text-[var(--fg-4)]">Practice of interest: People Architecture · Labour Codes · AI Edge Lab · Family Business · Not sure yet</label>
                  <div className="flex flex-wrap gap-3">
                    {practices.map((p) => (
                      <motion.button
                        key={p}
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedPractice(p)}
                        className={`px-5 py-3 font-mono text-[10px] tracking-widest uppercase transition-all duration-300 border rounded-full ${
                          selectedPractice === p
                            ? "bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)]"
                            : "bg-transparent border-[var(--line-strong)] text-[var(--fg-4)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                        }`}
                      >
                        {p}
                      </motion.button>
                    ))}
                  </div>
                  <p className="font-mono text-[10px] tracking-wide text-[var(--fg-5)]">
                    Select one. The diagnostic re-routes if the architecture under stress is elsewhere.
                  </p>
                </div>

                {/* Reading */}
                <div className="flex flex-col gap-3">
                  <label className="font-mono text-[10px] tracking-widest uppercase text-[var(--fg-4)]">Where is the architecture under stress?</label>
                  <div className="relative">
                    <select
                      value={selectedReading}
                      onChange={(e) => setSelectedReading(e.target.value)}
                      className="w-full bg-transparent border-b border-[var(--line-strong)] px-0 py-3 text-[16px] outline-none focus:border-[var(--accent)] transition-colors duration-300 appearance-none cursor-pointer text-[var(--fg-4)] [&>option]:bg-[#0C0E14] [&>option]:text-[var(--fg)]"
                    >
                      <option value="" disabled>Select a reading…</option>
                      {readings.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[var(--accent)] pointer-events-none text-[12px]">↓</span>
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-3">
                  <label className="font-mono text-[10px] tracking-widest uppercase text-[var(--fg-4)]">A few sentences on what is being considered</label>
                  <textarea
                    className="bg-transparent border-b border-[var(--line-strong)] px-0 py-3 text-[var(--fg)] text-[16px] outline-none focus:border-[var(--accent)] transition-colors duration-300 min-h-[120px] resize-none placeholder:text-[var(--fg-5)]"
                    placeholder="What is the architecture being asked to do that it currently can't? What event or pressure is making this urgent?"
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  />
                </div>

                <div className="flex flex-col gap-4 pt-4">
                  <div className="flex items-center gap-8">
                    <motion.button
                      type="submit"
                      disabled={submitState === "sending" || submitState === "sent"}
                      whileHover={submitState === "idle" || submitState === "error" ? { scale: 1.03 } : {}}
                      whileTap={submitState === "idle" || submitState === "error" ? { scale: 0.97 } : {}}
                      className="inline-flex items-center gap-3 px-10 py-4 font-mono text-[11px] tracking-[0.28em] uppercase rounded-full font-semibold bg-[#C9A24A] text-[#0A0A0B] disabled:opacity-60"
                    >
                      {submitState === "sending" ? "Sending…" : submitState === "sent" ? "Intent sent" : "Send written intent"}
                      {submitState !== "sent" && <ArrowRight size={13} />}
                    </motion.button>
                    <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--fg-5)]">Response within 48 hours</span>
                  </div>

                  {submitState === "error" && errorMsg && (
                    <p className="font-mono text-[11px] tracking-wide text-red-400">{errorMsg}</p>
                  )}
                </div>
              </form>
            </motion.div>

            {/* SIDEBAR */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="flex flex-col gap-4"
            >
              {sidebarItems.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ borderColor: "var(--line-gold)" }}
                  transition={{ duration: 0.3 }}
                  className="p-7 glass-card"
                >
                  <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--accent)] opacity-60 block mb-3">{item.label}</span>
                  {item.content}
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
