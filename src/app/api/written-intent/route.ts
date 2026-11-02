import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import WrittenIntent from "@/models/WrittenIntent";
import { auth } from "@/auth";
import { getSubmitter, isAdmin } from "@/lib/currentUser";
import { sendOwnerEmail, contactBlock, row, esc } from "@/lib/mailer";

const str = (v: unknown, max = 5000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/* ─── LOGGED-IN USERS: submit a written intent ─── */
export async function POST(req: NextRequest) {
  try {
    const submitter = await getSubmitter();
    if (!submitter) {
      return NextResponse.json({ ok: false, error: "Please register or log in to send a written intent." }, { status: 401 });
    }

    const data = await req.json();

    const doc = await WrittenIntent.create({
      // Contact always comes from the registered account
      userId: submitter.userId,
      name: submitter.name,
      email: submitter.email,
      phone: submitter.phone,

      role: str(data.role, 100),
      organisation: str(data.organisation, 200),
      practice: str(data.practice, 100),
      reading: str(data.reading, 300),
      message: str(data.message),
    });

    await sendOwnerEmail({
      subject: `[Axion] Written Intent — ${doc.name}${doc.organisation ? " · " + doc.organisation : ""}`,
      replyTo: doc.email,
      html: `
        <h2 style="font-family:Georgia,serif">New written intent</h2>
        ${contactBlock(doc)}
        <h3 style="font-family:Georgia,serif;margin:16px 0 6px">Details</h3>
        ${row("Role", doc.role)}
        ${row("Organisation", doc.organisation)}
        ${row("Practice of interest", doc.practice)}
        ${row("Architecture under stress", doc.reading)}
        <h3 style="font-family:Georgia,serif;margin:16px 0 6px">Intent</h3>
        <p style="white-space:pre-wrap">${esc(doc.message) || "-"}</p>
      `,
    });

    return NextResponse.json({ ok: true, id: doc._id });
  } catch (err) {
    console.error("[WRITTEN-INTENT POST]", err);
    return NextResponse.json({ ok: false, error: "Something went wrong" }, { status: 500 });
  }
}

/* ─── ADMIN: list all intents ─── */
export const GET = auth(async (req) => {
  if (!isAdmin(req.auth)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await dbConnect();
    const items = await WrittenIntent.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(items);
  } catch (err: any) {
    console.error("[WRITTEN-INTENT GET]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
});

/* ─── ADMIN: update status ─── */
export const PATCH = auth(async (req) => {
  if (!isAdmin(req.auth)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id, status } = await req.json();
    await dbConnect();
    await WrittenIntent.findByIdAndUpdate(id, { status }, { runValidators: true });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[WRITTEN-INTENT PATCH]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
});
