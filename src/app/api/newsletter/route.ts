import { NextRequest, NextResponse, after } from "next/server";
import dbConnect from "@/lib/db";
import { sendOwnerEmail } from "@/lib/mailer";
import { cleanStr, isEmail, isBot } from "@/lib/contact";
import { isRateLimited } from "@/lib/rateLimit";
import { JOURNAL } from "@/config/contact";
import { ackJournal } from "@/lib/acknowledge";
import { addLeadRow, cleanCameFrom, cleanSourcePage } from "@/lib/leadsSheet";
import { joinJournal } from "@/lib/journal";

/**
 * PUBLIC: join the Axion Index Journal, once a month (Fix Brief Part 4, step 2). No login.
 * The email is added only when the consent box was ticked (`consent: true`).
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (isBot(data)) return NextResponse.json({ ok: true }); // honeypot: silently drop
    if (isRateLimited(req, "newsletter")) {
      return NextResponse.json({ ok: false, error: "Too many submissions. Please try again in a few minutes." }, { status: 429 });
    }

    const name = cleanStr(data.name, 120);
    const email = cleanStr(data.email, 200).toLowerCase();
    if (name.length < 2) return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 400 });
    if (!isEmail(email)) return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
    if (data.consent !== true) {
      return NextResponse.json({ ok: false, error: `Please tick the box to receive the ${JOURNAL.name}.` }, { status: 400 });
    }
    const sourcePage = cleanSourcePage(data.sourcePage);
    const cameFrom = cleanCameFrom(data.cameFrom);

    await dbConnect();
    // Already on the list → keep it quiet, don't alert the owner again
    if ((await joinJournal({ name, email, source: "journal", sourcePage })) === "already") {
      return NextResponse.json({ ok: true, already: true });
    }

    after(() => Promise.all([
      sendOwnerEmail({
        subject: `[Axion] Journal sign-up — ${name}`,
        replyTo: email,
        email: {
          badge: "Journal",
          heading: `New ${JOURNAL.name} sign-up`,
          subheading: name,
          preheader: `${name} joined the ${JOURNAL.name}`,
          contact: { name, email, phone: "" },
          sections: [{ type: "fields", title: "Sign-up", rows: [["Consent", "Ticked"], ["Page", sourcePage], ["Came from", cameFrom]] }],
        },
      }),
      ackJournal(email, name),
      addLeadRow({ form: "Journal sign-up", name, email, sourcePage, cameFrom }),
    ]));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[NEWSLETTER POST]", err);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
