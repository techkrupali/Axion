import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import DiagnosticSignal from "@/models/DiagnosticSignal";
import { auth } from "@/auth";
import { getSubmitter, isAdmin } from "@/lib/currentUser";
import { sendOwnerEmail, contactBlock, row, esc } from "@/lib/mailer";

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

const str = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const strList = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").map((s) => s.slice(0, 300)).slice(0, 30) : []);

/* ─── LOGGED-IN USERS: submit a diagnostic signal ─── */
export async function POST(req: NextRequest) {
  try {
    const submitter = await getSubmitter();
    if (!submitter) {
      return NextResponse.json({ ok: false, error: "Please register or log in to start the diagnostic." }, { status: 401 });
    }

    const data = await req.json();
    const signals = strList(data.signals);
    if (signals.length === 0) {
      return NextResponse.json({ ok: false, error: "Select at least one signal." }, { status: 400 });
    }

    // Map signals to practices (backend only)
    const practices = [...new Set(
      signals.map((s) => ALL_SIGNALS.find((a) => a.text === s)?.practice).filter((p): p is string => !!p)
    )];

    const doc = await DiagnosticSignal.create({
      // Contact always comes from the registered account
      userId: submitter.userId,
      name: submitter.name,
      email: submitter.email,
      phone: submitter.phone,
      callback: str(data.callback, 200),

      signals,
      rankedSignals: strList(data.rankedSignals).slice(0, 3),
      breaking: signals.join(" | "),
      signal: signals[0],
      catchAllDetail: str(data.catchAllDetail),
      whyNow: str(data.whyNow),
      practices,

      role: str(data.role, 100),
      company: str(data.company, 200),
      size: str(data.size, 50),
    });

    const list = (items: string[], tag: "ul" | "ol") =>
      `<${tag}>${items.map((s) => `<li>${esc(s)}</li>`).join("")}</${tag}>`;

    await sendOwnerEmail({
      subject: `[Axion] New Diagnostic Signal — ${doc.name}${doc.company ? " · " + doc.company : ""}`,
      replyTo: doc.email,
      html: `
        <h2 style="font-family:Georgia,serif">New diagnostic signal</h2>
        ${contactBlock(doc)}
        ${row("Preferred callback", doc.callback)}
        <h3 style="font-family:Georgia,serif;margin:16px 0 6px">Context</h3>
        ${row("Role", doc.role)}
        ${row("Company", doc.company)}
        ${row("Company size", doc.size)}
        <h3 style="font-family:Georgia,serif;margin:16px 0 6px">Signals</h3>
        ${list(doc.signals, "ul")}
        ${row("Practices", doc.practices.join(", "))}
        ${doc.rankedSignals.length ? `<h3 style="font-family:Georgia,serif;margin:16px 0 6px">Ranked top 3</h3>${list(doc.rankedSignals, "ol")}` : ""}
        ${doc.whyNow ? `<h3 style="font-family:Georgia,serif;margin:16px 0 6px">What's loudest — and why now</h3><p style="white-space:pre-wrap">${esc(doc.whyNow)}</p>` : ""}
        ${doc.catchAllDetail ? `<h3 style="font-family:Georgia,serif;margin:16px 0 6px">Something else</h3><p style="white-space:pre-wrap">${esc(doc.catchAllDetail)}</p>` : ""}
      `,
    });

    return NextResponse.json({ ok: true, id: doc._id });
  } catch (err) {
    console.error("[DIAGNOSTIC POST]", err);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

/* ─── ADMIN: list all signals ─── */
export const GET = auth(async (req) => {
  if (!isAdmin(req.auth)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await dbConnect();
    const signals = await DiagnosticSignal.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(signals);
  } catch (err) {
    console.error("[DIAGNOSTIC GET]", err);
    return NextResponse.json([], { status: 500 });
  }
});

/* ─── ADMIN: update status ─── */
export const PATCH = auth(async (req) => {
  if (!isAdmin(req.auth)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await dbConnect();
    const { id, status } = await req.json();
    await DiagnosticSignal.findByIdAndUpdate(id, { status }, { runValidators: true });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DIAGNOSTIC PATCH]", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
});
