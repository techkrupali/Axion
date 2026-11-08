import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Edge Diagnostic",
  description: "Ten questions, instant results: see where you stand on AI replaceability, AI alignment, brainpower density or organisation decision architecture.",
  path: "/expertise/ai-edge/diagnostic",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
