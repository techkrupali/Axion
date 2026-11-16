import { pageMetadata } from "@/lib/seo";
import { isLive } from "@/config/practices";
import InDevelopmentBanner from "@/components/InDevelopmentBanner";

export const metadata = pageMetadata({
  title: "Labour Codes",
  description: "India's four Labour Codes consolidate 29 laws into one structural reset of how organisations define, compensate and govern their workforce.",
  path: "/expertise/labour",
  // B-23: not indexed by search engines while the practice is in development
  noIndex: !isLive("labour"),
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <InDevelopmentBanner practice="labour" />
      {children}
    </>
  );
}
