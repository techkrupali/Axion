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
 * Body: name, email, organisation, role, country, assessments (one or more of AAI | ARI | LLI |
 * ORG AI DARS; a single "assessment" also works), consent (must be true), sourcePage. Saved to the
 * separate AI Edge Lab list and the "AI Edge Lab" sheet tab, never the Axion leads.
 * Each assessment is its own record and its own sheet row (Nitin, 16 Nov). Registering again for
 * the same assessment updates that record; a new assessment adds a record and alerts Nitin.
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
    const asked: unknown[] = Array.isArray(data.assessments) ? data.assessments.slice(0, 10) : [data.assessment];
    const assessments = [...new Set(asked.filter(isAssessmentCode))];
    const sourcePage = cleanSourcePage(data.sourcePage);
    const cameFrom = cleanCameFrom(data.cameFrom);
    if (name.length < 2) return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 400 });
    if (!isEmail(email)) return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
    if (country.length < 2) return NextResponse.json({ ok: false, error: "Please enter your country." }, { status: 400 });
    if (assessments.length === 0) return NextResponse.json({ ok: false, error: "Please choose at least one assessment." }, { status: 400 });
    if (data.consent !== true) return NextResponse.json({ ok: false, error: "Please tick the consent box." }, { status: 400 });

    await dbConnect();
    const fields = { name, organisation, role, country, consentAt: new Date() };
    const before = (await AiEdgeInterest.find({ email }, { assessment: 1 }).lean<{ assessment: string }[]>()).map((r) => r.assessment);

    // One record per assessment: update the ones they already had, add the new ones
    const added: string[] = [];
    for (const assessment of assessments) {
      if (before.includes(assessment)) {
        await AiEdgeInterest.updateOne({ email, assessment }, fields);
        continue;
      }
      try {
        await AiEdgeInterest.create({ email, assessment, sourcePage, ...fields });
        added.push(assessment);
      } catch (e) {
        if ((e as { code?: number }).code !== 11000) throw e; // sent twice at once: already saved
      }
    }
    if (added.length === 0) return NextResponse.json({ ok: true, already: true });

    const labels = added.map(assessmentName);
    const earlier = before.map(assessmentName);
    after(() => Promise.all([
      sendOwnerEmail({
        subject: `[Axion] AI Edge Lab early-bird — ${name} · ${added.join(", ")}`,
        replyTo: email,
        email: {
          badge: "AI Edge Lab",
          heading: "New AI Edge Lab early-bird registration",
          subheading: [name, organisation].filter(Boolean).join(" · "),
          preheader: `${labels.join(", ")} · ${country} (separate AI Edge Lab list)`,
          contact: { name, email, phone: "" },
          sections: [{
            type: "fields", title: "Registration",
            rows: [
              [added.length > 1 ? "Assessments" : "Assessment", labels.join(", ")],
              ["Registered earlier for", earlier.join(", ")],
              ["Organisation", organisation], ["Role", role], ["Country", country], ["Consent", "Ticked"],
              ["Page", sourcePage], ["Came from", cameFrom], ["List", "AI Edge Lab (not the Axion leads)"],
            ],
          }],
        },
      }),
      ackAiEdgeInterest(email, name, labels),
      // One sheet row per assessment, so each assessment's list can be filtered on its own
      ...added.map((code) => addAiEdgeRow({
        form: "AI Edge Lab early-bird",
        name, email, organisation, role, sourcePage, cameFrom,
        extra: { Country: country, Assessment: assessmentName(code) },
      })),
    ]));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[AI-EDGE-INTEREST POST]", err);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
