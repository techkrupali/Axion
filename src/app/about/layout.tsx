import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About",
  description: "Axion Index diagnoses, quantifies and redesigns the operating architecture of work: the structure that decides whether an organisation can carry what it is becoming.",
  path: "/about",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
