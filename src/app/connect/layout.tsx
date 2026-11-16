import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Reach Us",
  description: "Start a conversation with Axion Index: share the signals you are seeing and what concerns you. Nitin reads every note personally and replies within 48 hours.",
  path: "/connect",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
