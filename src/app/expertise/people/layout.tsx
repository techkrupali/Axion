import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "People Architecture",
  description: "The architecture that lets the organisation survive the person: judgment, decision rights and succession codified into structure the company keeps after people leave.",
  path: "/expertise/people",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
