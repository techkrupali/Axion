import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Reach Us",
  description: "Begin with a written intent: a short note on where the architecture is under stress and what change is being considered. Axion Index responds within 48 hours.",
  path: "/connect",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
