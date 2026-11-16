"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { rememberVisitSource, track } from "@/lib/analytics";
import { useConsent } from "@/lib/consent";

/**
 * Loads the analytics tool chosen in the server's .env (Fix Brief Part 4, item 21):
 *   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=axionindex.org    → Plausible (no cookies)
 *   NEXT_PUBLIC_GA_ID=G-XXXXXXX                   → Google Analytics 4
 * Neither set → nothing loads. Also reports every click on a LinkedIn profile/page link.
 */
export default function Analytics() {
  const inStudio = (usePathname() ?? "").startsWith("/studio"); // editors' visits are not counted
  const { allowed } = useConsent(); // GA4 sets cookies: EU/UK visitors must accept first (G-04)
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const plausibleSrc = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || "https://plausible.io/js/script.js";
  const ga = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    rememberVisitSource();
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href*='linkedin.com']") as HTMLAnchorElement | null;
      if (!a || /share|sharing/i.test(a.href)) return; // share buttons report "Share" themselves
      track("LinkedIn click", { link: /\/company\//.test(a.href) ? "Axion Index page" : "Nitin's profile", page: location.pathname });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <>
      {plausible && !inStudio && (
        <>
          <Script id="plausible-queue" strategy="afterInteractive">
            {`window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}`}
          </Script>
          <Script src={plausibleSrc} data-domain={plausible} strategy="afterInteractive" />
        </>
      )}
      {ga && !inStudio && allowed && /^G-[A-Z0-9]+$/.test(ga) && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${ga}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
    </>
  );
}
