import { useSyncExternalStore } from "react";
import { AFTER_LOGIN_PATH } from "@/config/features";

/**
 * Only allow same-site relative paths as post-login redirects, so
 * `/register?callbackUrl=https://evil.example` can't bounce users off-site.
 */
export function safeCallbackUrl(raw: string | null | undefined, fallback = AFTER_LOGIN_PATH): string {
  if (!raw) return fallback;
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return fallback;
  return raw;
}

const noSubscribe = () => () => {};

/**
 * Read one query-string value in a client component. Returns null during
 * server render / hydration, then the real value — without needing a
 * <Suspense> boundary like next/navigation's useSearchParams does.
 */
export function useSearchParam(name: string): string | null {
  return useSyncExternalStore(
    noSubscribe,
    () => new URLSearchParams(window.location.search).get(name),
    () => null,
  );
}

/** The validated ?callbackUrl= of the current page, or "" when absent. */
export function useCallbackUrl(): string {
  return safeCallbackUrl(useSearchParam("callbackUrl"), "");
}
