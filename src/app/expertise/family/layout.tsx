import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Family Business",
  description: "Family enterprises don't fail at strategy. They fail at architecture. Ownership, authority and succession built to survive the generational handover.",
  path: "/expertise/family",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
