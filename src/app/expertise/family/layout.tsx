import { pageMetadata } from "@/lib/seo";
import { isLive } from "@/config/practices";
import InDevelopmentBanner from "@/components/InDevelopmentBanner";

export const metadata = pageMetadata({
  // SEO-02 (approved by Nitin, 17 Nov): "family business succession planning"; counts once the page launches
  title: "Family business succession: five architectures",
  description: "Ownership, family, institution, succession and operator: the five architectures an Indian family enterprise needs to survive the generational handover.",
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
