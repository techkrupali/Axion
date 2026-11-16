import { auth } from "@/auth";
import StudioNav from "./StudioNav";

export const metadata = { title: { absolute: "Studio · Axion Index" }, robots: { index: false, follow: false } };

/** The content Studio (Fix Brief Part 7): add, preview and publish Reports and Articles & Publications. */
export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user as { name?: string | null; email?: string | null; role?: string } | undefined;
  const signedIn = !!user && (user.role === "editor" || user.role === "admin");

  // Sign-in page: nothing but the form
  if (!signedIn) return <div className="min-h-screen bg-[#08080A]">{children}</div>;

  return (
    <div className="min-h-screen bg-[#08080A] lg:grid lg:grid-cols-[256px_minmax(0,1fr)]">
      <StudioNav user={{ name: user.name ?? "", email: user.email ?? "", role: user.role ?? "editor" }} />
      <main className="min-w-0">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12">{children}</div>
      </main>
    </div>
  );
}
