import { pageMetadata } from "@/lib/seo";
import Home from "./HomePage";

// The homepage itself is a client component (HomePage.tsx); its title, description and canonical tag
// are set here. SEO-02 (approved by Nitin, 17 Nov): main search phrase "organisation design consulting India".
// Canonical (Nitin's review, 17 Nov): Next writes it as https://axionindex.org, the same address as
// https://axionindex.org/ (an empty path is "/").
export const metadata = pageMetadata({
  title: "Axion Index · Organisation design consulting in India",
  description: "Organisation design consulting in India: Axion Index designs how organisations decide, govern and grow their people, so the structure holds as you scale.",
  path: "/",
});

export default function Page() {
  return <Home />;
}
