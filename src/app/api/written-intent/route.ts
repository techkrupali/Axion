import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import WrittenIntent from "@/models/WrittenIntent";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/currentUser";
import { readContact, isBot } from "@/lib/contact";
import { isRateLimited } from "@/lib/rateLimit";
import { sendOwnerEmail } from "@/lib/mailer";

const str = (v: unknown, max = 5000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/* ─── PUBLIC: submit a written intent (name / email / mobile entered on the form) ─── */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (isBot(data)) return NextResponse.json({ ok: true }); // honeypot: silently drop
    if (isRateLimited(req, "written-intent")) {
      return NextResponse.json({ ok: false, error: "Too many submissions. Please try again in a few minutes." }, { status: 429 });
    }

    const parsed = readContact(data);
    if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
    const contact = parsed.contact;

    await dbConnect();
    const doc = await WrittenIntent.create({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,

      role: str(data.role, 100),
      organisation: str(data.organisation, 200),
      practice: str(data.practice, 100),
      reading: str(data.reading, 300),
      message: str(data.message),
    });

    await sendOwnerEmail({
      subject: `[Axion] Written Intent — ${doc.name}${doc.organisation ? " · " + doc.organisation : ""}`,
      replyTo: doc.email,
      email: {
        badge: "Written intent",
        heading: "New written intent",
        subheading: [doc.name, doc.organisation].filter(Boolean).join(" · "),
        preheader: [doc.role && doc.organisation ? `${doc.role} at ${doc.organisation}` : doc.role || doc.organisation, doc.practice, doc.message.slice(0, 90)]
          .filter(Boolean).join(" · "),
        contact: { name: doc.name, email: doc.email, phone: doc.phone },
        sections: [
          { type: "tags", title: "Practice of interest", tags: doc.practice ? [doc.practice] : [] },
          { type: "quote", title: "Their intent", text: doc.message },
          { type: "quote", title: "Where the architecture is under stress", text: doc.reading },
          { type: "fields", title: "Context", rows: [["Role", doc.role], ["Organisation", doc.organisation]] },
        ],
      },
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
