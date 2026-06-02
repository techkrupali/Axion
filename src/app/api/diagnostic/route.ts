import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import DiagnosticSignal from "@/models/DiagnosticSignal";
import nodemailer from "nodemailer";

// Practice mapping (same as frontend for consistency)
const ALL_SIGNALS: { text: string; practice: string }[] = [
  { text: "Growth is accelerating. Stability is not.",                       practice: "People Architecture" },
  { text: "The company runs on a few people. None of it is written down.",   practice: "People Architecture" },
  { text: "Lose one person, and a whole function goes quiet.",               practice: "People Architecture" },
  { text: "Everything still routes through me.",                             practice: "People Architecture" },
  { text: "We hired ahead of the structure. Now the structure can't keep up.", practice: "People Architecture" },
  { text: "Costs are climbing. Headcount doesn't explain the part that keeps me up.", practice: "Labour Codes" },
  { text: "I can report the workforce number. I can't govern it.",           practice: "Labour Codes" },
  { text: "Every audit becomes a fire drill.",                               practice: "Labour Codes" },
  { text: "The rules changed retroactively. Our structure didn't.",          practice: "Labour Codes" },
  { text: "We're compliant on paper, exposed in practice.",                  practice: "Labour Codes" },
  { text: "Output is getting faster. Judgment is not.",                      practice: "AI Edge Lab" },
  { text: "AI is making us quicker, not wiser.",                             practice: "AI Edge Lab" },
  { text: "We adopted the tools. We never built the rules.",                 practice: "AI Edge Lab" },
  { text: "No one owns what the AI is allowed to decide.",                  practice: "AI Edge Lab" },
  { text: "Continuity depends on me, not on structure.",                      practice: "Family Business" },
  { text: "Succession is the risk no one at the table will name.",              practice: "Family Business" },
  { text: "Family and business decisions run on the same table.",              practice: "Family Business" },
  { text: "The next generation is ready in name, not in architecture.", practice: "Family Business" },
  { text: "Something else. I'll describe it.",                              practice: "Catch-all → manual triage" },
];

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();
    
    // Map signals to practices (backend only)
    const practices = [...new Set(
      (data.signals || []).map((s: string) => 
        ALL_SIGNALS.find((a) => a.text === s)?.practice
      ).filter((p: string | undefined): p is string => Boolean(p))
    )];
    
    const docData = {
      ...data,
      practices: practices
    };
    
    const doc = await DiagnosticSignal.create(docData);
    
    // Send email if env configured
    if (process.env.SMTP_HOST && process.env.ADMIN_EMAIL) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      const emailHtml = `
        <h1>New diagnostic signal received</h1>
        <h2>Contact</h2>
        <p><strong>Name:</strong> ${doc.name}</p>
        <p><strong>Email:</strong> ${doc.email}</p>
        <p><strong>Phone:</strong> ${doc.phone || "-"}</p>
        <p><strong>Callback:</strong> ${doc.callback || "-"}</p>
        <h2>Context</h2>
        <p><strong>Role:</strong> ${doc.role}</p>
        <p><strong>Company:</strong> ${doc.company}</p>
        <p><strong>Size:</strong> ${doc.size}</p>
        <h2>Signals</h2>
        <ul>${(doc.signals || []).map((s: string) => `<li>${s}</li>`).join("")}</ul>
        <p><strong>Practices:</strong> ${(doc.practices || []).join(", ")}</p>
        ${doc.rankedSignals && doc.rankedSignals.length > 0 ? `<h3>Ranked Signals</h3><ol>${doc.rankedSignals.map((s: string) => `<li>${s}</li>`).join("")}</ol>` : ""}
        ${doc.whyNow ? `<h2>Why Now</h2><p>${doc.whyNow}</p>` : ""}
        ${doc.catchAllDetail ? `<h2>Catch-All Detail</h2><p>${doc.catchAllDetail}</p>` : ""}
      `;

      await transporter.sendMail({
        from: process.env.SMTP_FROM || "no-reply@axion.com",
        to: process.env.ADMIN_EMAIL,
        subject: `[Axion] New Diagnostic Signal - ${doc.company || "Unknown Company"}`,
        html: emailHtml
      });
    }
    
    return NextResponse.json({ ok: true, id: doc._id });
  } catch (err) {
    console.error("[DIAGNOSTIC POST]", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const signals = await DiagnosticSignal.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(signals);
  } catch (err) {
    console.error("[DIAGNOSTIC GET]", err);
    return NextResponse.json([], { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const { id, status } = await req.json();
    await DiagnosticSignal.findByIdAndUpdate(id, { status });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
