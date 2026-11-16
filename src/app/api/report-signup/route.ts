import { NextRequest, NextResponse, after } from "next/server";
import dbConnect from "@/lib/db";
import ReportSignup from "@/models/ReportSignup";
import { sendOwnerEmail } from "@/lib/mailer";
import { cleanStr, isEmail, isBot } from "@/lib/contact";
import { isRateLimited } from "@/lib/rateLimit";
import { REPORT } from "@/config/report";
import { JOURNAL } from "@/config/contact";
import { findItem, formatDate } from "@/content/library";
import { getLibrary } from "@/content/store";
import { pdfUrl, reportState, signupKey } from "@/content/reportState";
import { ackReport } from "@/lib/acknowledge";
import { addLeadRow, cleanCameFrom, cleanSourcePage } from "@/lib/leadsSheet";
import { joinJournal } from "@/lib/journal";

/**
 * PUBLIC: ask for a report (Fix Brief Part 4, step 3), no login.
 * Body: name, email, organisation, report (slug), journal (the unticked "Also send me the
 * monthly Journal" box), sourcePage.
 */
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
    const journal = data.journal === true;
    const sourcePage = cleanSourcePage(data.sourcePage);
    const cameFrom = cleanCameFrom(data.cameFrom);

    // Which report: a library report's slug (older pages sent none → the Global AI Report)
    const slug = cleanStr(data.report, 120) || REPORT.slug;
    const item = findItem(await getLibrary(), slug);
    if (!item || item.category !== "report" || item.draft) {
      return NextResponse.json({ ok: false, error: "That report was not found." }, { status: 400 });
    }
    // AI Edge Lab's reports are requested through its own early-bird list (Fix Brief Part 5, item 27)
    if (item.owner === "ai-edge-lab") {
      return NextResponse.json({ ok: false, error: "This report belongs to AI Edge Lab. Please register on the AI Edge Lab page." }, { status: 400 });
    }
    const reportName = item.kicker ? `${item.title} (${item.kicker})` : item.title;
    const release = item.date ? formatDate(item.date) : "Date to be announced";
    const { released, when } = reportState(item);

    await dbConnect();
    const edition = signupKey(item.slug);

    // The Journal only when the box was ticked
    const journalResult = journal ? await joinJournal({ name, email, source: `report:${item.slug}`, sourcePage }) : null;

    // Already signed up for this report → update details, don't alert the owner again
    const existing = await ReportSignup.findOneAndUpdate({ edition, email }, { name, organisation, ...(journal ? { journal: true } : {}) });
    if (existing) return NextResponse.json({ ok: true, already: true });

    let doc;
    try {
      doc = await ReportSignup.create({ edition, name, email, organisation, journal, sourcePage });
    } catch (e) {
      // Same email submitted twice at the same moment → unique index already holds it
      if ((e as { code?: number }).code === 11000) return NextResponse.json({ ok: true, already: true });
      throw e;
    }

    after(() => Promise.all([
      sendOwnerEmail({
        subject: `[Axion] Report request: ${item.title} — ${doc.name} · ${doc.organisation}`,
        replyTo: doc.email,
        email: {
          badge: "Report request",
          heading: `New request: ${item.title}`,
          subheading: `${doc.name} · ${doc.organisation}`,
          preheader: `${doc.organisation} · ${reportName} · ${released ? "published" : `release: ${release}`}`,
          contact: { name: doc.name, email: doc.email, phone: "" },
          sections: [
            {
              type: "fields",
              title: "Request",
              rows: [
                ["Organisation", doc.organisation],
                ["Report", reportName],
                ["Release", release],
                ["Status", released ? "Published: send the report" : "Upcoming: send it on release day"],
                [JOURNAL.name, journal ? (journalResult === "already" ? "Ticked (already on the list)" : "Ticked: added to the list") : "Not ticked"],
                ["Page", doc.sourcePage],
                ["Came from", cameFrom],
              ],
            },
          ],
        },
      }),
      ackReport(doc.email, doc.name, { title: item.title, released, when, pdf: pdfUrl(item) }, journal),
      addLeadRow({
        form: `Report: ${item.title}`,
        name: doc.name,
        email: doc.email,
        organisation: doc.organisation,
        message: journal ? `Also asked for the ${JOURNAL.name}` : "",
        sourcePage: doc.sourcePage,
        cameFrom,
      }),
    ]));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[REPORT-SIGNUP POST]", err);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
