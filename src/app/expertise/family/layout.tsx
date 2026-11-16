import { pageMetadata } from "@/lib/seo";
import { isLive } from "@/config/practices";
import InDevelopmentBanner from "@/components/InDevelopmentBanner";

export const metadata = pageMetadata({
  title: "Family Business",
  description: "Family enterprises don't fail at strategy. They fail at architecture. Ownership, authority and succession built to survive the generational handover.",
  path: "/expertise/family",
  // B-23: not indexed by search engines while the practice is in development
  noIndex: !isLive("family"),
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <InDevelopmentBanner practice="family" />
      {children}
    </>
  );
}
