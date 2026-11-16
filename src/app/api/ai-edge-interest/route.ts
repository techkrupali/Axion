import { NextRequest, NextResponse, after } from "next/server";
import dbConnect from "@/lib/db";
import AiEdgeInterest from "@/models/AiEdgeInterest";
import { sendOwnerEmail } from "@/lib/mailer";
import { cleanStr, isEmail, isBot } from "@/lib/contact";
import { isRateLimited } from "@/lib/rateLimit";
import { ackAiEdgeInterest } from "@/lib/acknowledge";
import { addAiEdgeRow, cleanCameFrom, cleanSourcePage } from "@/lib/leadsSheet";
import { assessmentName, isAssessmentCode } from "@/config/aiEdgeLab";

/**
 * PUBLIC: AI Edge Lab early-bird registration (Fix Brief Part 5, item 23). No login.
 * Body: name, email, organisation, role, country, assessment (AAI | ARI | LLI | ORG AI DARS),
 * consent (must be true), sourcePage. Saved to the separate AI Edge Lab list and the
 * "AI Edge Lab" sheet tab, never the Axion leads.
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (isBot(data)) return NextResponse.json({ ok: true }); // honeypot: silently drop
    if (isRateLimited(req, "ai-edge-interest")) {
      return NextResponse.json({ ok: false, error: "Too many submissions. Please try again in a few minutes." }, { status: 429 });
    }

    const name = cleanStr(data.name, 120);
    const email = cleanStr(data.email, 200).toLowerCase();
    const organisation = cleanStr(data.organisation, 200);
    const role = cleanStr(data.role, 100);
    const country = cleanStr(data.country, 80);
    const assessment: unknown = data.assessment;
    const sourcePage = cleanSourcePage(data.sourcePage);
    const cameFrom = cleanCameFrom(data.cameFrom);
    if (name.length < 2) return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 400 });
    if (!isEmail(email)) return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
    if (country.length < 2) return NextResponse.json({ ok: false, error: "Please enter your country." }, { status: 400 });
    if (!isAssessmentCode(assessment)) return NextResponse.json({ ok: false, error: "Please choose an assessment." }, { status: 400 });
    if (data.consent !== true) return NextResponse.json({ ok: false, error: "Please tick the consent box." }, { status: 400 });
    const assessmentLabel = assessmentName(assessment);

    await dbConnect();
    const fields = { name, organisation, role, country, assessment, consentAt: new Date() };
    const existing = await AiEdgeInterest.findOneAndUpdate({ email }, fields);
    if (existing) return NextResponse.json({ ok: true, already: true });

    try {
      await AiEdgeInterest.create({ email, sourcePage, ...fields });
    } catch (e) {
      if ((e as { code?: number }).code === 11000) return NextResponse.json({ ok: true, already: true });
      throw e;
    }

    after(() => Promise.all([
      sendOwnerEmail({
        subject: `[Axion] AI Edge Lab early-bird — ${name} · ${assessment}`,
        replyTo: email,
        email: {
          badge: "AI Edge Lab",
          heading: "New AI Edge Lab early-bird registration",
          subheading: [name, organisation].filter(Boolean).join(" · "),
          preheader: `${assessmentLabel} · ${country} (separate AI Edge Lab list)`,
          contact: { name, email, phone: "" },
          sections: [{
            type: "fields", title: "Registration",
            rows: [["Assessment", assessmentLabel], ["Organisation", organisation], ["Role", role], ["Country", country], ["Consent", "Ticked"], ["Page", sourcePage], ["Came from", cameFrom], ["List", "AI Edge Lab (not the Axion leads)"]],
          }],
        },
      }),
      ackAiEdgeInterest(email, name, assessmentLabel),
      addAiEdgeRow({
        form: "AI Edge Lab early-bird",
        name, email, organisation, role, sourcePage, cameFrom,
        extra: { Country: country, Assessment: assessmentLabel },
      }),
    ]));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[AI-EDGE-INTEREST POST]", err);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
