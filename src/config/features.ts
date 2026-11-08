/**
 * Accounts are switched OFF for now: no registration or login, no user panel
 * (/user/*) and no admin panel (/admin/*). Every form asks for name / email /
 * mobile directly and is emailed to the owner.
 *
 * Set NEXT_PUBLIC_PANELS_ENABLED=true (and rebuild) to bring back the panels
 * together with login and registration.
 */
export const PANELS_ENABLED = process.env.NEXT_PUBLIC_PANELS_ENABLED === "true";

/** Where people land after register / login when no callbackUrl was given (panels on only). */
export const AFTER_LOGIN_PATH = "/user/dashboard";

/** Pages that only exist for accounts — hidden (redirect home) while panels are off. */
export const ACCOUNT_PAGE_PREFIXES = ["/admin", "/user", "/login", "/register"];

/** API routes that only exist for accounts / panels — 404 while panels are off. */
export const PANEL_API_PREFIXES = ["/api/admin", "/api/user", "/api/razorpay", "/api/auth/register"];
