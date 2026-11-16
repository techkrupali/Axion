"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/** After a page change, scrolling resumes once the wheel has been quiet this long (the glide has ended)… */
const QUIET_MS = 160;
/** …and in any case after this long. */
const MAX_HOLD_MS = 2500;

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const firstPath = useRef(true);
  const backOrForward = useRef(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    let frame = 0;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    const onPop = () => { backOrForward.current = true; };
    window.addEventListener("popstate", onPop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("popstate", onPop);
      lenis.destroy();
    };
  }, []);

  /*
   * A new page opens at its top. Without this, a scroll still gliding from the last page (a trackpad
   * keeps sending scroll for a moment after the fingers lift, and Lenis smooths it) carried on into
   * the new page and slid it down to the footer. Back/forward keeps the browser's own position.
   */
  useEffect(() => {
    const lenis = lenisRef.current;
    if (firstPath.current || !lenis) { firstPath.current = false; return; }
    const wasBackOrForward = backOrForward.current;
    backOrForward.current = false;

    lenis.stop(); // drop the glide from the last page
    // A link to a section (#id): Next.js scrolls to it; only the glide is dropped
    if (!wasBackOrForward && window.location.hash.length < 2) {
      lenis.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    }
    // Wheel events that keep coming are the old glide (they are blocked while Lenis is stopped);
    // a short pause means it has ended, and the next scroll is the visitor's own.
    let quiet = setTimeout(release, QUIET_MS);
    const cap = setTimeout(release, MAX_HOLD_MS);
    function onWheel() { clearTimeout(quiet); quiet = setTimeout(release, QUIET_MS); }
    function done() { clearTimeout(quiet); clearTimeout(cap); window.removeEventListener("wheel", onWheel); }
    function release() { done(); lenis!.resize(); lenis!.start(); }
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => { done(); lenis.start(); };
  }, [pathname]);

  return <>{children}</>;
}
