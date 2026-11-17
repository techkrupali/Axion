import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  // SEO-02 (approved by Nitin, 17 Nov): main search phrase "people architecture"
  title: "People Architecture: succession & decision rights",
  description: "When the organisation depends on who is in the room, not on how it is built. We codify judgment, decision rights and succession into structure that stays.",
  path: "/expertise/people",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
