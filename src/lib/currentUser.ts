import type { Session } from "next-auth";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Admin from "@/models/Admin";

export type Submitter = {
  userId: string;
  name: string;
  email: string;
  phone: string;
};

/**
 * The logged-in person submitting a form, read fresh from the database so the
 * name / email / mobile on a submission always come from their registered
 * account — never from what the browser sends. Returns null when logged out.
 */
export async function getSubmitter(): Promise<Submitter | null> {
  const session = await auth();
  const id = (session?.user as { id?: string } | undefined)?.id;
  const email = session?.user?.email;
  if (!session?.user || (!id && !email)) return null;

  await dbConnect();
  const account =
    (id && (await User.findById(id).lean().catch(() => null))) ||
    (email && (await User.findOne({ email }).lean())) ||
    (email && (await Admin.findOne({ email }).lean()));

  if (!account) return null;
  const a = account as { _id: unknown; name?: string; email: string; phone?: string };
  return {
    userId: String(a._id),
    name: a.name || "",
    email: a.email,
    phone: a.phone || "",
  };
}

export const isAdmin = (session: Session | null | undefined) =>
  (session?.user as { role?: string } | undefined)?.role === "admin";
