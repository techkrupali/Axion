import { NextRequest, NextResponse, after } from "next/server";
import dbConnect from "@/lib/db";
import AiEdgeInterest from "@/models/AiEdgeInterest";
import AiEdgeOrganisation from "@/models/AiEdgeOrganisation";
import { cleanStr } from "@/lib/contact";
import { isRateLimited } from "@/lib/rateLimit";
import { sendOwnerEmail } from "@/lib/mailer";
import { sheetTime, upsertIndividualRow, upsertOrganisationRow } from "@/lib/leadsSheet";
import { verifyEmail } from "@/lib/signedToken";
import { LEADER_TRACK, ORG_ASSESSMENT, assessmentName, emailDomain, isHeadcountBand, isPersonalEmail, orgNameKey } from "@/config/aiEdgeLab";

type Leader = { name: string; email: string; organisation: string; role: string; country: string; track: string; consentAt?: Date; sourcePage?: string; cameFrom?: string };
type Org = { orgKey: string; domain: string; toCheck: boolean; organisation: string; leaderEmail: string; leaderName: string; headcount: string; question: string; alsoRequestedBy: string[]; createdAt: Date; consentAt?: Date; sourcePage?: string; cameFrom?: string };

/**
 * PUBLIC: AI Edge Lab early access, Step 2, leaders only (Nitin, 16 Nov). Optional: early access to
 * ORG AI DARS for their organisation. Needs the token from Step 1, so only the person who just
 * registered as a leader can do this. One record per organisation; Nitin gets an email at once.
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (isRateLimited(req, "ai-edge-organisation")) {
      return NextResponse.json({ ok: false, error: "Too many submissions. Please try again in a few minutes." }, { status: 429 });
    }
    const email = verifyEmail(data.token);
    if (!email) return NextResponse.json({ ok: false, error: "This page has expired. Please register again." }, { status: 401 });
    const headcount: unknown = data.headcount;
    const question = cleanStr(data.question, 1000);
    if (!isHeadcountBand(headcount)) return NextResponse.json({ ok: false, error: "Please choose your organisation's headcount." }, { status: 400 });
    if (question.length < 3) return NextResponse.json({ ok: false, error: "Please tell us the main question for your organisation." }, { status: 400 });

    await dbConnect();
    const leader = await AiEdgeInterest.findOne({ email }).lean<Leader>();
    if (!leader || leader.track !== LEADER_TRACK) {
      return NextResponse.json({ ok: false, error: "This question is for leaders who registered for the Leadership Leverage Index." }, { status: 400 });
    }
    // The organisation's name comes from Step 1; asked here only if it was left blank there
    const organisation = leader.organisation || cleanStr(data.organisation, 200);
    if (organisation.length < 2) return NextResponse.json({ ok: false, error: "Please enter your organisation's name." }, { status: 400 });
    if (!leader.organisation) await AiEdgeInterest.updateOne({ email }, { $set: { organisation } });

    // Which organisation (Nitin, 17 Nov): by work-email domain; with a personal email, by name, marked to check
    const personal = isPersonalEmail(email);
    const domain = personal ? "" : emailDomain(email);
    const nameKey = orgNameKey(organisation) || organisation.toLowerCase();
    const now = new Date();
    const existing = personal
      ? await AiEdgeOrganisation.findOne({ nameKey }).sort({ createdAt: 1 }).lean<Org>()
      : await AiEdgeOrganisation.findOne({ orgKey: `domain:${domain}` }).lean<Org>();
    let org: Org;
    if (!existing) {
      try {
        org = (await AiEdgeOrganisation.create({
          orgKey: personal ? `name:${nameKey}` : `domain:${domain}`, domain, nameKey, toCheck: personal,
          organisation, leaderEmail: email, leaderName: leader.name, headcount, question,
          consentAt: leader.consentAt ?? now, sourcePage: leader.sourcePage ?? "", cameFrom: leader.cameFrom ?? "",
        })).toObject() as Org;
      } catch (e) {
        if ((e as { code?: number }).code !== 11000) throw e;
        return NextResponse.json({ ok: true, organisation }); // sent twice at once
      }
    } else if (existing.leaderEmail === email) {
      org = (await AiEdgeOrganisation.findOneAndUpdate({ orgKey: existing.orgKey }, { $set: { headcount, question, leaderName: leader.name } }, { new: true }).lean<Org>())!;
    } else {
      // Another leader from the same organisation: noted on the same row (a match by name is checked by Nitin)
      org = (await AiEdgeOrganisation.findOneAndUpdate({ orgKey: existing.orgKey },
        { $addToSet: { alsoRequestedBy: email }, ...(personal ? { $set: { toCheck: true } } : {}) }, { new: true }).lean<Org>())!;
    }
    const checkNote = org.toCheck ? "Yes: personal email, matched by name" : "";

    const isNew = !existing;
    const otherLeader = !!existing && existing.leaderEmail !== email;
    const row: Record<string, string> = {
      "Org ID": org.orgKey, Organisation: org.organisation, Domain: org.domain, "To check": checkNote,
      "Leader name": org.leaderName, "Leader email": org.leaderEmail,
      Headcount: org.headcount, "Main question": org.question, "Also requested by": (org.alsoRequestedBy ?? []).join(", "),
    };
    const insert: Record<string, string> = {
      "Registered at": sheetTime(existing?.createdAt ? new Date(existing.createdAt) : now),
      ...row,
      "Consent given": `Yes · ${sheetTime(org.consentAt ? new Date(org.consentAt) : now)}`,
      Source: [org.sourcePage, org.cameFrom].filter(Boolean).join(" · "),
      "Invited for complimentary": "No",
      Status: "Registered",
    };

    after(() => Promise.all([
      upsertOrganisationRow(row, insert),
      upsertIndividualRow({ Email: email, ...(!leader.organisation ? { Organisation: organisation } : {}), [ORG_ASSESSMENT.code]: org.organisation }, {
        "Registered at": sheetTime(now), Name: leader.name, Email: email, Track: leader.track, Organisation: organisation,
        Role: leader.role, Country: leader.country, [ORG_ASSESSMENT.code]: org.organisation, "Invited for complimentary": "No", Status: "Registered",
      }),
      // Every organisation registration: an email to Nitin straight away
      sendOwnerEmail({
        subject: `[Axion] ORG AI DARS early access — ${org.organisation}${otherLeader ? " (another leader)" : isNew ? "" : " (updated)"}${personal ? " · to check" : ""}`,
        replyTo: email,
        email: {
          badge: "AI Edge Lab",
          heading: isNew ? "New organisation for ORG AI DARS" : otherLeader ? "Another leader asked for ORG AI DARS" : "Organisation details updated",
          subheading: [org.organisation, headcount].filter(Boolean).join(" · "),
          preheader: `${leader.name} · ${leader.role || assessmentName(LEADER_TRACK)} (separate AI Edge Lab list)`,
          contact: { name: leader.name, email, phone: "" },
          sections: [
            { type: "fields", title: "Organisation", rows: [["Organisation", org.organisation], ["Email domain", org.domain || "None (personal email)"], ["To check", personal ? "Yes: personal email, so matched by name. Please review." : ""], ["Headcount", headcount], ["Leader", `${leader.name}${leader.role ? `, ${leader.role}` : ""}`], ["Country", leader.country], ["Also requested by", (org.alsoRequestedBy ?? []).join(", ")]] },
            { type: "quote", title: "Their main question for the organisation", text: question },
            { type: "fields", title: "List", rows: [["List", "AI Edge Lab (not the Axion leads)"], ["First leader", org.leaderEmail]] },
          ],
        },
      }),
    ]));

    return NextResponse.json({ ok: true, organisation: org.organisation });
  } catch (err) {
    console.error("[AI-EDGE-ORGANISATION POST]", err);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
