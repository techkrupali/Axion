import type { Session } from "next-auth";

export const isAdmin = (session: Session | null | undefined) =>
  (session?.user as { role?: string } | undefined)?.role === "admin";
