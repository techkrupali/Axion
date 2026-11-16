import { NextRequest, NextResponse, after } from "next/server";
import dbConnect from "@/lib/db";
import AiEdgeInterest from "@/models/AiEdgeInterest";
import AiEdgeOrganisation from "@/models/AiEdgeOrganisation";
import { cleanStr, isEmail, isBot } from "@/lib/contact";
import { isRateLimited } from "@/lib/rateLimit";
import { ackAiEdgeInterest } from "@/lib/acknowledge";
import { cleanCameFrom, cleanSourcePage, sheetTime, upsertIndividualRow } from "@/lib/leadsSheet";
import { signEmail } from "@/lib/signedToken";
import { LEADER_TRACK, assessmentName, isTrackCode } from "@/config/aiEdgeLab";

type Individual = {
  email: string; name: string; organisation: string; role: string; country: string; track: string;
  previousTrack?: string; trackChangedAt?: Date; consentAt?: Date; createdAt: Date;
  sourcePage?: string; cameFrom?: string;
};

/**
 * PUBLIC: AI Edge Lab early access, Step 1 (Nitin, 16 Nov). The same form for everyone: one track by
 * career stage (AAI, ARI or LLI), name, email, organisation, role, country, consent. No login.
 * One record per person: registering again updates it, and a new track is noted with its date.
 * Nitin gets a daily summary of individuals (scripts/ai-edge-daily-summary.mjs), not an email each.
 * Leaders get a signed token for Step 2 (/api/ai-edge-interest/organisation).
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
    const track: unknown = data.track ?? data.assessment;
    const sourcePage = cleanSourcePage(data.sourcePage);
    const cameFrom = cleanCameFrom(data.cameFrom);
    if (!isTrackCode(track)) return NextResponse.json({ ok: false, error: "Please choose which describes you." }, { status: 400 });
    if (name.length < 2) return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 400 });
    if (!isEmail(email)) return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
    if (country.length < 2) return NextResponse.json({ ok: false, error: "Please enter your country." }, { status: 400 });
    if (data.consent !== true) return NextResponse.json({ ok: false, error: "Please tick the consent box." }, { status: 400 });

    await dbConnect();
    const now = new Date();
    const before = await AiEdgeInterest.findOne({ email }).lean<Individual>();
    const changed = !!before && before.track !== track;
    let saved: Individual;

    if (!before) {
      try {
        saved = (await AiEdgeInterest.create({
          name, email, organisation, role, country, track, consentAt: now, sourcePage, cameFrom, summaryPendingSince: now,
        })).toObject() as Individual;
      } catch (e) {
        if ((e as { code?: number }).code !== 11000) throw e;
        return NextResponse.json({ ok: true, track, already: true }); // sent twice at once
      }
    } else {
      const set: Record<string, unknown> = {
        name, role, country, consentAt: now,
        ...(organisation ? { organisation } : {}), // a blank field never wipes what they gave before
        ...(changed ? { track, previousTrack: before.track, trackChangedAt: now, summaryPendingSince: now } : {}),
      };
      saved = (await AiEdgeInterest.findOneAndUpdate({ email }, { $set: set }, { new: true }).lean<Individual>())!;
    }

    const trackName = assessmentName(track);
    const leader = track === LEADER_TRACK;
    const orgRegistered = leader && !!(await AiEdgeOrganisation.exists({ $or: [{ leaderEmail: email }, { alsoRequestedBy: email }] }));

    // The sheet's "Individuals" tab: update the row in place; the team keeps Status and Invited there
    const consent = `Yes · ${sheetTime(now)}`;
    const row: Record<string, string> = {
      Name: saved.name, Email: email, Track: track, Organisation: saved.organisation, Role: saved.role, Country: saved.country,
      "Consent given": consent,
      ...(changed ? { "Track changed at": sheetTime(now), "Previous track": before!.track } : {}),
    };
    const insert: Record<string, string> = {
      "Registered at": sheetTime(before?.createdAt ? new Date(before.createdAt) : now),
      Name: saved.name, Email: email, Track: track, Organisation: saved.organisation, Role: saved.role, Country: saved.country,
      "Consent given": consent,
      Source: [saved.sourcePage || sourcePage, saved.cameFrom || cameFrom].filter(Boolean).join(" · "),
      "Invited for complimentary": "No",
      Status: "Registered",
      ...(changed ? { "Track changed at": sheetTime(now), "Previous track": before!.track } : {}),
    };
    after(() => Promise.all([
      upsertIndividualRow(row, insert),
      // A thank-you by email when they join, or move to another assessment
      ...(!before || changed ? [ackAiEdgeInterest(email, name, trackName)] : []),
    ]));

    return NextResponse.json({
      ok: true,
      track,
      trackName,
      leader,
      ...(leader ? { orgToken: signEmail(email), needsOrganisation: !saved.organisation, orgRegistered } : {}),
    });
  } catch (err) {
    console.error("[AI-EDGE-INTEREST POST]", err);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
