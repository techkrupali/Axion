/**
 * The acknowledgement each visitor gets after a form (Fix Brief Part 4, item 17).
 * All the wording lives here so Nitin can approve or change it in one place.
 */
import { sendVisitorEmail } from "@/lib/mailer";
import { nextRead } from "@/content/nextRead";
import { JOURNAL } from "@/config/contact";
import { EARLY_BIRD } from "@/config/aiEdgeLab";

const first = (name: string) => name.trim().split(/\s+/)[0] || name;

/** Step 5, Talk: "Start a conversation". */
export async function ackConversation(to: string, name: string, signals: string[]) {
  const read = await nextRead();
  return sendVisitorEmail({
    to,
    subject: "We have your note · Axion Index",
    email: {
      preheader: "Nitin reads every note personally. You will hear back within 48 hours.",
      heading: `Thank you, ${first(name)}.`,
      paragraphs: [
        "We have your note.",
        "Nitin reads every note personally. You will hear back within 48 hours.",
      ],
      list: { title: "The signals you shared", items: signals },
      cta: { intro: read.line, label: read.label, href: read.url },
      reason: "You are receiving this because you started a conversation on axionindex.org.",
    },
  });
}

/** Step 3, Download: a report sign-up. */
export async function ackReport(to: string, name: string, report: { title: string; released: boolean; when: string; pdf?: string }, journal: boolean) {
  const read = await nextRead();
  // Out and downloadable (D7): the email carries the PDF, free to share
  if (report.released && report.pdf) {
    return sendVisitorEmail({
      to,
      subject: `${report.title} · your copy`,
      email: {
        preheader: "Your copy of the report. It is free to share.",
        heading: `Thank you, ${first(name)}.`,
        paragraphs: [
          `Here is your copy of ${report.title}. It is free to share with your colleagues.`,
          ...(journal ? [`You will also receive the ${JOURNAL.name}, ${JOURNAL.cadence}.`] : []),
        ],
        cta: { label: "Download the report", href: report.pdf },
        reason: `You are receiving this because you asked for ${report.title} on axionindex.org.`,
      },
    });
  }
  const deliver = report.released
    ? `We will email ${report.title} to you shortly.`
    : report.when
      ? `We will email ${report.title} to you on release day, ${report.when}.`
      : `We will email ${report.title} to you on release day.`;
  return sendVisitorEmail({
    to,
    subject: `${report.title}: you are on the list · Axion Index`,
    email: {
      preheader: deliver,
      heading: `Thank you, ${first(name)}.`,
      paragraphs: [
        `You are on the list for ${report.title}.`,
        deliver,
        ...(journal ? [`You will also receive the ${JOURNAL.name}, ${JOURNAL.cadence}.`] : []),
      ],
      cta: { intro: read.line, label: read.label, href: read.url },
      reason: `You are receiving this because you asked for ${report.title} on axionindex.org.`,
    },
  });
}

/** Step 2, Follow: the monthly Journal. */
export async function ackJournal(to: string, name: string) {
  const read = await nextRead();
  return sendVisitorEmail({
    to,
    subject: `Welcome to the ${JOURNAL.name}`,
    email: {
      preheader: `One email, ${JOURNAL.cadence}.`,
      heading: `Welcome, ${first(name)}.`,
      paragraphs: [
        `You are signed up for the ${JOURNAL.name}: one email, ${JOURNAL.cadence}, with new reports, essays and field notes.`,
        "To stop at any time, reply to any issue with the word unsubscribe.",
      ],
      cta: { intro: read.line, label: read.label, href: read.url },
      reason: `You are receiving this because you signed up for the ${JOURNAL.name} on axionindex.org.`,
    },
  });
}

/** Step 4, Register: AI Edge Lab early-bird registration (Fix Brief Part 5, item 23). */
export function ackAiEdgeInterest(to: string, name: string, assessment: string) {
  return sendVisitorEmail({
    to,
    subject: "AI Edge Lab: you are on the early-bird list",
    email: {
      preheader: "A note when the institute's site opens.",
      heading: `Thank you, ${first(name)}.`,
      paragraphs: [
        `You are on the AI Edge Lab early-bird list for the ${assessment}.`,
        EARLY_BIRD.offer,
        "We will send you a note when the institute's site opens.",
      ],
      reason: "You are receiving this because you registered for AI Edge Lab early-bird access on axionindex.org.",
    },
  });
}
