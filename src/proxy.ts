import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Next 16 "proxy" (formerly middleware): runs auth checks before these routes render.
// Rules live in authConfig.callbacks.authorized.
const { auth } = NextAuth(authConfig);
export default auth;

export const config = {
  matcher: [
    "/admin/:path*",
    "/user/:path*",
    "/login",
    "/register",
    // account / panel-only APIs (blocked while panels are switched off — see src/config/features.ts)
    "/api/admin/:path*",
    "/api/user/:path*",
    "/api/razorpay/:path*",
    "/api/auth/register",
  ],
};
