import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import WrittenIntent from "@/models/WrittenIntent";
import { auth } from "@/auth";
import nodemailer from "nodemailer";

const esc = (s: unknown) =>
  String(s ?? "-").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

/* ─── PUBLIC: submit a written intent ─── */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email } = data;

    if (!name || !email) {
      return NextResponse.json({ ok: false, error: "Name and email are required" }, { status: 400 });
    }

    await dbConnect();

    const doc = await WrittenIntent.create({
      name: data.name,
      role: data.role || "",
      organisation: data.organisation || "",
      email: data.email,
      practice: data.practice || "",
      reading: data.reading || "",
      message: data.message || "",
    });

    // Email the founder (SMTP configured in .env.local)
    if (process.env.SMTP_HOST) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: process.env.SMTP_SECURE === "true",
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
        });

        const html = `
          <h2 style="font-family:Georgia,serif">New Written Intent</h2>
          <p><strong>Name:</strong> ${esc(doc.name)}</p>
          <p><strong>Role:</strong> ${esc(doc.role)}</p>
          <p><strong>Organisation:</strong> ${esc(doc.organisation)}</p>
          <p><strong>Email:</strong> ${esc(doc.email)}</p>
          <p><strong>Practice of interest:</strong> ${esc(doc.practice)}</p>
          <p><strong>Architecture under stress:</strong> ${esc(doc.reading)}</p>
          <h3>Intent</h3>
          <p style="white-space:pre-wrap">${esc(doc.message)}</p>
          <hr/>
          <p style="color:#888;font-size:12px">Submitted ${new Date(doc.createdAt).toLocaleString()} · Axion Index</p>
        `;

        await transporter.sendMail({
          from: process.env.SMTP_FROM || "nitin@axionindex.org",
          to: process.env.ADMIN_EMAIL || "nitin@axionindex.org",
          replyTo: doc.email,
          subject: `[Axion] Written Intent — ${doc.name}${doc.organisation ? " · " + doc.organisation : ""}`,
          html,
        });
      } catch (mailErr) {
        // Don't fail the submission if email hiccups — it's already saved for the admin panel
        console.error("[WRITTEN-INTENT] email failed:", mailErr);
      }
    }

    return NextResponse.json({ ok: true, id: doc._id });
  } catch (err) {
    console.error("[WRITTEN-INTENT POST]", err);
    return NextResponse.json({ ok: false, error: "Something went wrong" }, { status: 500 });
  }
}

/* ─── ADMIN: list all intents ─── */
export const GET = auth(async (req) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id, status } = await req.json();
    await dbConnect();
    await WrittenIntent.findByIdAndUpdate(id, { status });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[WRITTEN-INTENT PATCH]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
});
