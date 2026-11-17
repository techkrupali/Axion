import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  // SEO-02 (approved by Nitin, 17 Nov): "Nitin Nahata"; the description uses the approved one-line bio (L-08)
  title: "Nitin Nahata · Founder of Axion Index",
  exactTitle: true,
  description: "Nitin Nahata, founder of Axion Index: HR leadership across Standard Chartered, HSBC, Tata, Udaan and Gameskraft, and the operating doctrine behind the practice.",
  path: "/founder",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
