'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import AxionWordmark from "@/components/AxionWordmark";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExpertiseOpen, setIsExpertiseOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsMobileOpen(false); }, [pathname]);

  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/user") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/founder" ||
    pathname?.startsWith("/expertise/ai-edge")
  ) {
    return null;
  }

  const expertiseLinks = [
    { name: "People Architecture", href: "/expertise/people", desc: "BCR · Structure · Signalling" },
    { name: "AI Edge Lab", href: "/expertise/ai-edge", desc: "Judgement · Architecture · Governance" },
    { name: "Labour Codes", href: "/expertise/labour", desc: "Cost · Classification · Compliance" },
    { name: "Family Business", href: "/expertise/family", desc: "Ownership · Succession · Institution" },
  ];

  const allLinks = [
    { label: "About", href: "/about" },
    { label: "People Architecture", href: "/expertise/people" },
    { label: "AI Edge Lab", href: "/expertise/ai-edge" },
    { label: "Labour Codes", href: "/expertise/labour" },
    { label: "Family Business", href: "/expertise/family" },
    { label: "Founder", href: "/founder" },
    { label: "Research & Journals", href: "/research" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`nav ${isScrolled ? "is-scrolled" : ""}`}
      >
        {/* Brand */}
        <AxionWordmark />

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          <NavLink href="/about" label="About" active={pathname === "/about"} />

          {/* Practice Areas Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsExpertiseOpen(true)}
            onMouseLeave={() => setIsExpertiseOpen(false)}
          >
            <button
              className={`text-[11px] font-mono tracking-[0.24em] uppercase flex items-center gap-2 outline-none transition-colors duration-300 min-h-[44px] ${
                pathname.startsWith("/expertise")
                  ? "text-[#C9A24A]"
                  : "text-[var(--fg-3)] hover:text-[var(--fg)]"
              }`}
            >
              Practice Areas
              <motion.div
                animate={{ rotate: isExpertiseOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <ChevronDown size={12} />
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
                        className={`nav-dropdown-item ${pathname === link.href ? "text-[#C9A24A] bg-[rgba(201,162,74,0.05)]" : ""}`}
                        onClick={() => setIsExpertiseOpen(false)}
                      >
                        <div>
                          <div className="text-[11px] tracking-[0.2em]">{link.name}</div>
                          <div className="text-[10px] text-[var(--fg-5)] tracking-[0.1em] mt-0.5 normal-case font-sans">{link.desc}</div>
                        </div>
                        <span className="text-[var(--accent)] opacity-0 group-hover:opacity-100">→</span>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink href="/founder" label="Founder" active={pathname === "/founder"} />
          <NavLink href="/research" label="Research & Journals" active={pathname === "/research"} />

          <Link
            href="/connect"
            className="ml-1 px-5 py-3 font-mono text-[11px] tracking-[0.22em] uppercase font-semibold rounded-full transition-all duration-300 active:scale-[0.97] inline-flex items-center gap-2 min-h-[44px] bg-[#C9A24A] text-[#0A0A0B]"
          >
            Reach Us <ArrowRight size={12} />
          </Link>
          <Link
            href="/admin/login"
            className="ml-1 px-4 py-3 font-mono text-[11px] tracking-[0.22em] uppercase rounded-full border border-[rgba(201,162,74,0.25)] text-[var(--fg-4)] hover:text-[#C9A24A] hover:border-[rgba(201,162,74,0.5)] transition-all duration-300 min-h-[44px]"
          >
            Login
          </Link>
        </div>

        {/* Mobile: Hamburger only */}
        <div className="flex lg:hidden items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-3 text-[var(--fg-3)] hover:text-[var(--fg)] transition-colors min-h-[44px] min-w-[44px]"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[72px] left-0 right-0 z-[79] flex flex-col"
            style={{
              background: "#0A0A0B",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              maxHeight: "calc(100vh - 72px)",
              overflowY: "auto",
            }}
          >
            <div className="px-5 sm:px-6 py-6 flex flex-col gap-1">
              {allLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    className={`block py-4 font-mono text-[12px] tracking-[0.24em] uppercase border-b transition-colors duration-200 min-h-[48px] ${
                      pathname === link.href
                        ? "text-[#C9A24A] border-[rgba(201,162,74,0.15)]"
                        : "text-[var(--fg-3)] border-[rgba(255,255,255,0.05)] hover:text-[var(--fg)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: allLinks.length * 0.04 + 0.1 }}
                className="pt-4 flex flex-col gap-3"
              >
                <Link
                  href="/connect"
                  className="block w-full text-center py-4 font-mono text-[12px] tracking-[0.24em] uppercase border border-[rgba(201,162,74,0.25)] text-[#0A0A0B] bg-[#C9A24A] hover:bg-[rgba(201,162,74,0.9)] transition-colors rounded-lg min-h-[48px]"
                >
                  Reach Us →
                </Link>
                <Link
                  href="/admin/login"
                  className="block w-full text-center py-4 font-mono text-[12px] tracking-[0.24em] uppercase border border-[rgba(255,255,255,0.08)] text-[var(--fg-4)] hover:text-[var(--fg)] transition-colors rounded-lg min-h-[48px]"
                >
                  Login
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`text-[11px] font-mono tracking-[0.24em] uppercase transition-colors duration-300 relative group whitespace-nowrap min-h-[44px] inline-flex items-center ${
        active ? "text-[#C9A24A]" : "text-[var(--fg-3)] hover:text-[var(--fg)]"
      }`}
    >
      {label}
      <span
        className="absolute -bottom-1 left-0 h-[1px] bg-[#C9A24A] transition-all duration-400 origin-left"
        style={{ width: active ? "100%" : "0%", transform: "scaleX(1)" }}
      />
    </Link>
  );
}

export default Navbar;
