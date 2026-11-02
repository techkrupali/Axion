"use client";

import { SessionProvider } from "next-auth/react";

/** Client-side context shared by every page (login state for forms, etc.). */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
