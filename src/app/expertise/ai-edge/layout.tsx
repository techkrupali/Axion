import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Edge Lab",
  description: "AI can now perform parts of the work itself. AI Edge Lab builds the decision layer around the model: where AI accelerates, and where a human must still hold the call.",
  path: "/expertise/ai-edge",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
