"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const ThreeScene = dynamic(() => import("@/components/ThreeScene"), { ssr: false });

export default function ConditionalThreeScene() {
  const pathname = usePathname();
  if (pathname === "/about" || pathname === "/expertise/ai-edge" || pathname === "/expertise/family" || pathname === "/expertise/people") return null;
  return <ThreeScene />;
}
