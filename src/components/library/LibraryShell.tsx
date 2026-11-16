import Link from "next/link";
import { draftMode } from "next/headers";
import Footer from "@/components/Footer";
import { JsonLd, breadcrumbLd } from "@/lib/jsonLd";

/** Page frame shared by the library hub, category pages and item pages. */
export default async function LibraryShell({
  eyebrow,
  title,
  intro,
  crumbs,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  crumbs?: { label: string; href: string }[];
  children: React.ReactNode;
}) {
  const preview = (await draftMode()).isEnabled;
  return (
    <div className="min-h-screen">
      {/* Studio preview (Fix Brief Part 7): drafts are visible only in this browser */}
      {preview && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[300] flex flex-wrap items-center justify-center gap-3 px-5 py-3 bg-[#C9A24A] text-[#0A0A0B] font-mono text-[11px] tracking-[0.14em] uppercase shadow-2xl max-w-[calc(100vw-32px)]">
          <span>Preview: drafts are showing</span>
          <a href="/api/studio/exit-preview?path=/studio" className="underline font-semibold">Back to Studio</a>
          <a href="/api/studio/exit-preview" className="underline font-semibold">Exit preview</a>
        </div>
      )}
      {crumbs && crumbs.length > 0 && <JsonLd data={breadcrumbLd(crumbs)} />}
      <header className="relative overflow-hidden pt-36 sm:pt-44 pb-12">
        <div className="shell relative z-10">
          {crumbs && crumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--fg-5)] mb-6">
              {crumbs.map((c, i) => (
                <span key={c.href} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden>/</span>}
                  <Link href={c.href} className="hover:text-[var(--accent)] transition-colors">{c.label}</Link>
                </span>
              ))}
            </nav>
          )}
          <div className="eyebrow mb-8 text-[var(--accent)]">{eyebrow}</div>
          <h1 className="font-serif font-normal text-[clamp(34px,5vw,68px)] leading-[1.06] tracking-[-0.01em] text-[var(--fg)] max-w-[22ch]">{title}</h1>
          {intro && <div className="lead text-[var(--fg-3)] max-w-[58ch] mt-6">{intro}</div>}
        </div>
      </header>
      {children}
      <Footer />
    </div>
  );
}
