import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ReportSignup from "@/models/ReportSignup";
import { sendOwnerEmail } from "@/lib/mailer";
import { cleanStr, isEmail, isBot } from "@/lib/contact";
import { isRateLimited } from "@/lib/rateLimit";
import { REPORT } from "@/config/report";

/* ─── PUBLIC: sign up to receive the Global AI Report (no login) ─── */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (isBot(data)) return NextResponse.json({ ok: true }); // honeypot: silently drop
    if (isRateLimited(req, "report-signup")) {
      return NextResponse.json({ ok: false, error: "Too many submissions. Please try again in a few minutes." }, { status: 429 });
    }

    const name = cleanStr(data.name, 120);
    const email = cleanStr(data.email, 200).toLowerCase();
    const organisation = cleanStr(data.organisation, 200);
    if (name.length < 2) return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 400 });
    if (!isEmail(email)) return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
    if (organisation.length < 2) return NextResponse.json({ ok: false, error: "Please enter your organisation." }, { status: 400 });

    await dbConnect();
    const edition = REPORT.edition;

    // Already signed up for this edition → update details, don't email the owner again
    const existing = await ReportSignup.findOneAndUpdate({ edition, email }, { name, organisation });
    if (existing) return NextResponse.json({ ok: true, already: true });

    let doc;
    try {
      doc = await ReportSignup.create({ edition, name, email, organisation });
    } catch (e) {
      // Same email submitted twice at the same moment → unique index already holds it
      if ((e as { code?: number }).code === 11000) return NextResponse.json({ ok: true, already: true });
      throw e;
    }

    await sendOwnerEmail({
      subject: `[Axion] ${REPORT.name} sign-up — ${doc.name} · ${doc.organisation}`,
      replyTo: doc.email,
      email: {
        badge: "Report sign-up",
        heading: `New ${REPORT.name} sign-up`,
        subheading: `${doc.name} · ${doc.organisation}`,
        preheader: `${doc.organisation} · ${REPORT.edition} · releasing ${REPORT.releaseLong}`,
        contact: { name: doc.name, email: doc.email, phone: "" },
        sections: [
          {
            type: "fields",
            title: "Sign-up",
            rows: [
              ["Organisation", doc.organisation],
              ["Report", `${REPORT.name} · ${REPORT.edition}`],
              ["Release", REPORT.releaseLong],
            ],
          },
        ],
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[REPORT-SIGNUP POST]", err);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
