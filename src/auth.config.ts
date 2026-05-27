import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isUserRoute = nextUrl.pathname.startsWith("/user");
      const isLoginPage = nextUrl.pathname === "/admin/login" || nextUrl.pathname === "/login";

      if (isAdminRoute) {
        if (!isLoginPage && !isLoggedIn) {
          return false; // Redirect to login
        }
        if (isLoginPage && isLoggedIn) {
          return Response.redirect(new URL("/admin/dashboard", nextUrl));
        }
      }

      if (isUserRoute) {
        if (!isLoggedIn) {
          return false; // Redirect to /login
        }
        if (isLoginPage && isLoggedIn) {
          return Response.redirect(new URL("/user/dashboard", nextUrl));
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  providers: [], // Add providers in auth.ts
} satisfies NextAuthConfig;
