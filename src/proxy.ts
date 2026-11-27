import NextAuth from "next-auth";
import { NextResponse, type NextFetchEvent, type NextMiddleware, type NextRequest } from "next/server";
import { authConfig } from "./auth.config";
import { SITE_LOCK_HTML } from "@/config/siteLock";

// Next 16 "proxy" (formerly middleware): runs before these routes render.
// Auth rules live in authConfig.callbacks.authorized.
const { auth } = NextAuth(authConfig);
const authProxy = auth as unknown as NextMiddleware;

/**
 * Site pause. With SITE_LOCKED=true in the server's .env every address answers with one notice
 * (src/config/siteLock.ts) and status 503 "temporarily unavailable", so search engines treat it as
 * a pause and keep the pages in their index. Remove the line (or set it to false) and rebuild to
 * bring the site back; nothing else changes.
 *
 * The Studio and its sign-in stay open, so the content can still be managed while the site is paused.
 */
const LOCKED = process.env.SITE_LOCKED === "true";
const OPEN_WHILE_LOCKED = /^\/(?:studio|uploads|api\/(?:studio|auth))(?:\/|$)/;

/** The routes that have auth rules; everything else needs no session check. */
const AUTH_ROUTES =
  /^\/(?:admin|user|login|register|studio)(?:\/|$)|^\/api\/(?:admin|user|razorpay|studio)(?:\/|$)|^\/api\/auth\/register$/;

export default function proxy(req: NextRequest, ctx: NextFetchEvent) {
  const { pathname } = req.nextUrl;

  if (LOCKED && !OPEN_WHILE_LOCKED.test(pathname)) {
    return new NextResponse(SITE_LOCK_HTML, {
      status: 503,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "retry-after": "86400",
        "cache-control": "no-store, must-revalidate",
      },
    });
  }

  if (!AUTH_ROUTES.test(pathname)) return NextResponse.next();
  return authProxy(req, ctx);
}

export const config = {
  // Every address, so the pause notice can answer any of them. Next's own build files are left alone;
  // when the site is not paused, anything outside AUTH_ROUTES passes straight through.
  matcher: ["/((?!_next/static|_next/image).*)"],
};
