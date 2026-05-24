"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExpertiseOpen, setIsExpertiseOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/user") ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return null;
  }

  const expertiseLinks = [
    { name: "People Architecture", href: "/expertise/people", desc: "BCR · Structure · Signalling" },
    { name: "AI Edge Lab", href: "/expertise/ai-edge", desc: "Judgment · Architecture · Governance" },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`nav ${isScrolled ? "is-scrolled" : ""}`}
    >
      {/* Brand */}
      <Link href="/" className="brand group">
        Ax<em>ion</em>
        <span className="domain">INDEX</span>
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-8">
        <NavLink href="/about" label="About" active={pathname === "/about"} />

        {/* Expertise Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setIsExpertiseOpen(true)}
          onMouseLeave={() => setIsExpertiseOpen(false)}
        >
          <button
            className={`text-[10.5px] font-mono tracking-[0.24em] uppercase flex items-center gap-2 outline-none transition-colors duration-300 ${
              pathname.startsWith("/expertise")
                ? "text-[var(--accent)]"
                : "text-[var(--fg-3)] hover:text-[var(--fg)]"
            }`}
          >
            Practice Areas
            <motion.div
              animate={{ rotate: isExpertiseOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <ChevronDown size={11} />
            </motion.div>
          </button>

          <AnimatePresence>
            {isExpertiseOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="nav-dropdown"
              >
                {expertiseLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      className={`nav-dropdown-item ${pathname === link.href ? "text-[var(--accent)] bg-[var(--accent-soft)]" : ""}`}
                      onClick={() => setIsExpertiseOpen(false)}
                    >
                      <div>
                        <div className="text-[10.5px] tracking-[0.2em]">{link.name}</div>
                        <div className="text-[9px] text-[var(--fg-5)] tracking-[0.1em] mt-0.5 normal-case font-sans">{link.desc}</div>
                      </div>
                      <span className="text-[var(--accent)] opacity-0 group-hover:opacity-100">→</span>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <NavLink href="/expertise/labour" label="Labour Codes" active={pathname === "/expertise/labour"} />
        <NavLink href="/expertise/family" label="Family Business" active={pathname === "/expertise/family"} />
        <NavLink href="/founder" label="Founder" active={pathname === "/founder"} />
        <NavLink href="/research" label="Research & Journals" active={pathname === "/research"} />

        <Link href="/connect" className="nav-cta">
          Reach us
        </Link>

        <Link
          href="/login"
          className="ml-2 px-5 py-2 font-mono text-[9.5px] tracking-[0.22em] uppercase font-semibold rounded-full transition-all duration-300 active:scale-[0.97]"
          style={{
            background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)",
            color: "#080A0F",
          }}
        >
          Login
        </Link>
      </div>
    </motion.nav>
  );
};

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`text-[10.5px] font-mono tracking-[0.24em] uppercase transition-colors duration-300 relative group ${
        active ? "text-[var(--accent)]" : "text-[var(--fg-3)] hover:text-[var(--fg)]"
      }`}
    >
      {label}
      <span
        className="absolute -bottom-1 left-0 h-[1px] bg-[var(--accent)] transition-all duration-400 origin-left"
        style={{ width: active ? "100%" : "0%", transform: "scaleX(1)" }}
      />
    </Link>
  );
}

export default Navbar;
