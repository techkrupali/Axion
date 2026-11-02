/**
 * User panel (/user/*) and admin panel (/admin/*) are switched OFF for now.
 * Registration is only used to attach name / email / mobile to form submissions,
 * which are emailed to the owner. Set NEXT_PUBLIC_PANELS_ENABLED=true (and
 * rebuild) to bring both panels back.
 */
export const PANELS_ENABLED = process.env.NEXT_PUBLIC_PANELS_ENABLED === "true";

/** Where people land after register / login when no callbackUrl was given. */
export const AFTER_LOGIN_PATH = PANELS_ENABLED ? "/user/dashboard" : "/?diagnostic=1";

/** API routes that only exist to serve the panels. */
export const PANEL_API_PREFIXES = ["/api/admin", "/api/user", "/api/razorpay"];
