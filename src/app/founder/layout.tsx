import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Founder · Nitin Nahata",
  description: "Nitin Nahata, founder of Axion Index, on the operating doctrine behind the practice: lessons from Wipro, Standard Chartered, HSBC, Tata, Udaan and Gameskraft.",
  path: "/founder",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
