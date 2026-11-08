import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Labour Codes",
  description: "India's four Labour Codes consolidate 29 laws into one structural reset of how organisations define, compensate and govern their workforce.",
  path: "/expertise/labour",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
