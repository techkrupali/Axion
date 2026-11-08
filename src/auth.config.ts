import type { NextAuthConfig } from "next-auth";
import { PANELS_ENABLED, PANEL_API_PREFIXES, ACCOUNT_PAGE_PREFIXES } from "@/config/features";

const under = (pathname: string, prefix: string) => pathname === prefix || pathname.startsWith(prefix + "/");

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: PANELS_ENABLED ? "/admin/login" : "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = (auth?.user as { role?: string } | undefined)?.role;
      const { pathname, search } = nextUrl;
      const isAdminRoute = under(pathname, "/admin");
      const isUserRoute = under(pathname, "/user");
      const isAdminLogin = pathname === "/admin/login";
      const back = encodeURIComponent(pathname + search);

      // Accounts switched off: hide panels, login and registration, and the APIs behind them
      if (!PANELS_ENABLED) {
        if (PANEL_API_PREFIXES.some((p) => under(pathname, p))) {
          return Response.json({ error: "Not found" }, { status: 404 });
        }
        if (ACCOUNT_PAGE_PREFIXES.some((p) => under(pathname, p))) {
          return Response.redirect(new URL("/", nextUrl));
        }
      }

      if (isAdminRoute) {
        if (isAdminLogin) {
          return isLoggedIn && role === "admin" ? Response.redirect(new URL("/admin/dashboard", nextUrl)) : true;
        }
        if (!isLoggedIn) return false; // -> /admin/login
        if (role !== "admin") return Response.redirect(new URL("/user/dashboard", nextUrl));
        return true;
      }

      if (isUserRoute && !isLoggedIn) {
        return Response.redirect(new URL(`/login?callbackUrl=${back}`, nextUrl));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.phone = (user as { phone?: string }).phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as { phone?: unknown }).phone = token.phone;
      }
      return session;
    },
  },
  providers: [], // Add providers in auth.ts
} satisfies NextAuthConfig;
