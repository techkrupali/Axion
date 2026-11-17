import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  // SEO-02 (approved by Nitin, 17 Nov): "operating architecture of work"
  title: "About Axion Index · The operating architecture of work",
  exactTitle: true,
  description: "Axion Index diagnoses and redesigns the operating architecture of work: the structure that decides whether an organisation can carry what it is becoming.",
  path: "/about",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
