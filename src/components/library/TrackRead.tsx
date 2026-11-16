"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** Records the read (Fix Brief Part 4, step 1). */
export default function TrackRead({ slug, category }: { slug: string; category: string }) {
  useEffect(() => { track("Read", { item: slug, category }); }, [slug, category]);
  return null;
}
