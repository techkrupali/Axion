import { NextRequest, NextResponse } from "next/server";
import EdgeAssessment from "@/models/EdgeAssessment";
import { getSubmitter } from "@/lib/currentUser";
import { sendOwnerEmail } from "@/lib/mailer";

// Same colours as the result screen on the site
const BAND_COLOR: Record<string, string> = {
  "Edge Thinning": "#E05252",
  "Edge Holding": "#C9A24A",
  "Edge Accelerating": "#52C8A8",
};
import { INDEX_DEFINITIONS, IndexType, QUESTIONS } from "@/config/diagnosticConfig";
import { Answers, Profile, scoreDiagnostic } from "@/engine/scoring";

const BANDS: NonNullable<Profile["experienceBand"]>[] = ["0-3", "4-7", "8-12", "13-20", "20+"];
const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Keep only known questions / options so the stored answers match the scoring config. */
function cleanAnswers(raw: unknown): Answers {
  const input = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const out: Answers = {};
  for (const q of QUESTIONS) {
    const v = input[q.id];
    const optionIds = q.options.map((o) => o.id);
    if (q.type === "single" && typeof v === "string" && optionIds.includes(v)) {
      out[q.id] = v;
    } else if (q.type === "split" && v && typeof v === "object") {
      const split: Record<string, number> = {};
      for (const id of optionIds) {
        const n = Number((v as Record<string, unknown>)[id]);
        split[id] = Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0;
      }
      out[q.id] = split;
    }
  }
  return out;
}

/* ─── LOGGED-IN USERS: record a completed AI Edge Lab diagnostic ─── */
export async function POST(req: NextRequest) {
  try {
    const submitter = await getSubmitter();
    if (!submitter) {
      return NextResponse.json({ ok: false, error: "Please register or log in to take the diagnostic." }, { status: 401 });
    }

    const data = await req.json();
    const indexType = data.indexType as IndexType;
    if (!(indexType in INDEX_DEFINITIONS)) {
      return NextResponse.json({ ok: false, error: "Unknown diagnostic track." }, { status: 400 });
    }

    const profile: Profile = {
      name: str(data.profile?.name),
      role: str(data.profile?.role),
      experienceBand: BANDS.includes(data.profile?.experienceBand) ? data.profile.experienceBand : "8-12",
    };
    const answers = cleanAnswers(data.answers);

    // Score on the server — the browser's numbers are never trusted
    const result = scoreDiagnostic(indexType, answers, profile);
    const def = INDEX_DEFINITIONS[indexType];

    const doc = await EdgeAssessment.create({
      userId: submitter.userId,
      name: submitter.name,
      email: submitter.email,
      phone: submitter.phone,

      indexType,
      indexName: def.name,
      profileName: profile.name,
      profileRole: profile.role,
      experienceBand: profile.experienceBand,
      answers,

      score: result.score,
      range: result.range,
      band: result.band,
      archetype: result.archetype,
      components: result.components,
    });

    const c = result.components;
    await sendOwnerEmail({
      subject: `[Axion] AI Edge Diagnostic — ${doc.name} · ${def.name} · ${result.score}/100`,
      replyTo: doc.email,
      email: {
        badge: "AI Edge Lab",
        heading: "AI Edge diagnostic completed",
        subheading: `${doc.name} · ${def.name}`,
        preheader: `Edge score ${result.score}/100 · ${result.band} · ${result.archetype}${profile.role ? ` · ${profile.role}` : ""}`,
        contact: { name: doc.name, email: doc.email, phone: doc.phone },
        sections: [
          {
            type: "score", title: "Result", score: result.score, outOf: 100, range: result.range,
            band: result.band, bandColor: BAND_COLOR[result.band] ?? "#C9A24A", caption: result.archetype,
          },
          {
            type: "bars", title: "Component scores",
            bars: [
              { label: "Judgment Density", value: c.judgmentDensity },
              { label: "Output Exposure", value: c.outputExposure },
              { label: "Consequence Signal", value: c.consequenceSignal },
              { label: "Impact Score", value: c.impactScore },
              { label: "Growth Signal", value: c.growthSignal },
            ],
          },
          { type: "list", title: "Cross-signal read", items: [result.crossSignals.stoWork, result.crossSignals.judgmentThinking] },
          {
            type: "fields", title: "Profile",
            rows: [
              ["Track", `${def.name} (${def.audience})`],
              ["Name entered", profile.name && profile.name !== doc.name ? profile.name : ""],
              ["Role / title", profile.role],
              ["Experience", `${profile.experienceBand} years`],
            ],
          },
        ],
      },
    });

    return NextResponse.json({ ok: true, id: doc._id });
  } catch (err) {
    console.error("[AI-EDGE-RESULT POST]", err);
    return NextResponse.json({ ok: false, error: "Something went wrong" }, { status: 500 });
  }
}
