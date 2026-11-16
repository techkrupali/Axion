import { NextRequest, NextResponse, after } from "next/server";
import dbConnect from "@/lib/db";
import DiagnosticSignal from "@/models/DiagnosticSignal";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/currentUser";
import { readContact, isBot } from "@/lib/contact";
import { isRateLimited } from "@/lib/rateLimit";
import { sendOwnerEmail } from "@/lib/mailer";
import { ackConversation } from "@/lib/acknowledge";
import { addLeadRow, cleanCameFrom, cleanSourcePage } from "@/lib/leadsSheet";
import { PRACTICES, isPracticeKey } from "@/config/practices";

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

/* ─── PUBLIC: "Start a conversation" (Fix Brief Part 4, step 5). One form behind every conversation button. ─── */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (isBot(data)) return NextResponse.json({ ok: true }); // honeypot: silently drop
    if (isRateLimited(req, "diagnostic")) {
      return NextResponse.json({ ok: false, error: "Too many submissions. Please try again in a few minutes." }, { status: 429 });
    }

    const parsed = readContact(data);
    if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
    const contact = parsed.contact;

    const signals = strList(data.signals);
    if (signals.length === 0) {
      return NextResponse.json({ ok: false, error: "Select at least one signal." }, { status: 400 });
    }

    // Map signals to practices (backend only)
    const practices = [...new Set(
      signals.map((s) => ALL_SIGNALS.find((a) => a.text === s)?.practice).filter((p): p is string => !!p)
    )];

    // The practice page it was started from (pre-selected silently) and the page path
    const practiceKey: unknown = data.practice;
    const practiceFromPage = isPracticeKey(practiceKey) ? PRACTICES[practiceKey].name : "";
    const sourcePage = cleanSourcePage(data.sourcePage);
    const cameFrom = cleanCameFrom(data.cameFrom);

    await dbConnect();
    // T-02: a double click or a resend of the same request within 10 minutes keeps one record (and one email).
    // A changed message or different signals count as a new request.
    const sameAs = (r: { signals?: string[]; whyNow?: string; catchAllDetail?: string }) =>
      [...(r.signals ?? [])].sort().join("|") === [...signals].sort().join("|")
      && (r.whyNow ?? "") === str(data.whyNow) && (r.catchAllDetail ?? "") === str(data.catchAllDetail);
    const recent = await DiagnosticSignal.findOne({ email: contact.email, createdAt: { $gte: new Date(Date.now() - 10 * 60_000) } })
      .sort({ createdAt: -1 }).select({ signals: 1, whyNow: 1, catchAllDetail: 1 }).lean<{ signals?: string[]; whyNow?: string; catchAllDetail?: string }>();
    if (recent && sameAs(recent)) return NextResponse.json({ ok: true, duplicate: true });
    const doc = await DiagnosticSignal.create({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
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

      practiceFromPage,
      sourcePage,
    });

    const signalCount = `${doc.signals.length} signal${doc.signals.length === 1 ? "" : "s"}`;
    const message = [doc.whyNow, doc.catchAllDetail ? `Something else: ${doc.catchAllDetail}` : ""].filter(Boolean).join("\n");

    // Alert to Nitin, acknowledgement to the visitor, row in the leads sheet: after the response
    after(() => Promise.all([
      sendOwnerEmail({
        subject: `[Axion] New conversation — ${doc.name}${doc.company ? " · " + doc.company : ""}`,
        replyTo: doc.email,
        email: {
          badge: "Conversation",
          heading: "New conversation request",
          subheading: [doc.name, doc.company].filter(Boolean).join(" · "),
          preheader: [doc.role && doc.company ? `${doc.role} at ${doc.company}` : doc.role || doc.company, signalCount, doc.practices.join(", ")]
            .filter(Boolean).join(" · "),
          contact: { name: doc.name, email: doc.email, phone: doc.phone },
          contactExtra: [["Callback", doc.callback]],
          sections: [
            { type: "tags", title: "Practice routing", tags: doc.practices },
            { type: "list", title: `Signals they selected (${doc.signals.length})`, items: doc.signals },
            { type: "list", title: "Their top priorities, ranked", items: doc.rankedSignals, ordered: true },
            { type: "quote", title: "What's loudest — and why now", text: doc.whyNow },
            { type: "quote", title: "Something else, in their words", text: doc.catchAllDetail },
            { type: "fields", title: "Context", rows: [["Role", doc.role], ["Company", doc.company], ["Company size", doc.size ? `${doc.size} people` : ""]] },
            { type: "fields", title: "Where it started", rows: [["Practice page", doc.practiceFromPage], ["Page", doc.sourcePage], ["Came from", cameFrom]] },
            // G-09: the 30-minute slot is booked from the reply, never shown publicly
            ...(process.env.BOOKING_URL ? [{ type: "fields" as const, title: "Booking link to paste into your reply", rows: [["Link", process.env.BOOKING_URL] as [string, string]] }] : []),
          ],
        },
      }),
      ackConversation(doc.email, doc.name, doc.signals),
      addLeadRow({
        form: "Conversation",
        name: doc.name,
        email: doc.email,
        phone: doc.phone,
        organisation: doc.company,
        role: doc.role,
        practice: doc.practiceFromPage || doc.practices.join(", "),
        signals: doc.signals,
        message,
        sourcePage: doc.sourcePage,
        cameFrom,
      }),
    ]));

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
