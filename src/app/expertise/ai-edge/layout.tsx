import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  // SEO-02 (approved by Nitin, 17 Nov): "AI readiness assessment"; moves to the AI Edge Lab site when it launches
  title: "AI Edge Lab · AI readiness assessments, early access",
  exactTitle: true,
  description: "Four AI Edge Lab assessments (AAI, ARI, LLI, ORG AI DARS), designed to show where AI accelerates your work and where your judgment still holds. Early access.",
  path: "/expertise/ai-edge",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
