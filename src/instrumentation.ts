/**
 * Runs once when the server starts (Next.js instrumentation).
 * Node.js only: prefer IPv4 for outgoing connections (see src/lib/preferIpv4.ts).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { preferIpv4 } = await import("./lib/preferIpv4");
    preferIpv4();
  }
}
