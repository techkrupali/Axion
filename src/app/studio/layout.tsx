import Link from "next/link";
import { auth } from "@/auth";
import { studioSignOut } from "./actions";

export const metadata = { title: { absolute: "Studio · Axion Index" }, robots: { index: false, follow: false } };

/** The content Studio (Fix Brief Part 7): add, preview and publish Reports and Articles & Publications. */
export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const signedIn = !!session?.user && (role === "editor" || role === "admin");
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(10,10,11,0.95)] backdrop-blur">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/studio" className="font-mono text-[12px] tracking-[0.3em] uppercase text-[#C9A24A]">Axion Studio</Link>
          {signedIn && (
            <nav className="flex items-center gap-4 sm:gap-6 font-mono text-[10.5px] tracking-[0.16em] uppercase text-[var(--fg-4)]">
              <Link href="/studio" className="hover:text-[var(--fg)]">Library</Link>
              <Link href="/studio/series" className="hover:text-[var(--fg)]">Series</Link>
              <Link href="/studio/help" className="hover:text-[var(--fg)]">Help</Link>
              <a href="/publications" target="_blank" rel="noopener noreferrer" className="hidden sm:inline hover:text-[var(--fg)]">View site ↗</a>
              <form action={studioSignOut}><button className="uppercase tracking-[0.16em] hover:text-[var(--fg)]">Sign out</button></form>
            </nav>
          )}
        </div>
      </header>
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 sm:py-10">{children}</div>
    </div>
  );
}
