import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await dbConnect();
        
        // Try to find in Admin first (for /admin login)
        let account = await Admin.findOne({ email: credentials.email });
        
        // If not found in Admin, try User
        if (!account) {
          account = await User.findOne({ email: credentials.email });
        }

        if (!account || !account.password) return null;

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          account.password
        );

        if (!isPasswordCorrect) return null;

        return {
          id: account._id.toString(),
          email: account.email,
          name: account.name,
          phone: (account as { phone?: string }).phone || '',
          role: account.role || 'user',
        };
      },
    }),
  ],
});
