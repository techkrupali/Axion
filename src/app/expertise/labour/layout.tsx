import { pageMetadata } from "@/lib/seo";
import { isLive } from "@/config/practices";
import InDevelopmentBanner from "@/components/InDevelopmentBanner";

export const metadata = pageMetadata({
  // SEO-02 (approved by Nitin, 17 Nov): "new Labour Codes India"; counts once the page launches (hidden from Google until then)
  title: "New Labour Codes India: pay, cost and compliance",
  description: "India's four Labour Codes took effect on 21 Nov 2025. What changes in pay structure, cost and compliance, and how to rebuild the workforce architecture.",
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
