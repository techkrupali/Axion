import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

/**
 * T-03: the address the uptime monitor checks every few minutes (docs/monitoring.md).
 * 200 when the site and its database answer; 503 otherwise, so the monitor sends an alert.
 * Says nothing about the set-up beyond ok / not ok.
 */
export async function GET() {
  try {
    const conn = await Promise.race([
      dbConnect(),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), 5000)),
    ]);
    await conn.connection.db?.admin().ping();
    return NextResponse.json({ ok: true }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503, headers: NO_STORE });
  }
}
