import nodemailer from "nodemailer";
import { renderOwnerEmail, type OwnerEmail } from "@/lib/emailTemplate";
import { renderVisitorEmail, type VisitorEmail } from "@/lib/visitorEmail";
import { PUBLIC_EMAIL } from "@/config/contact";

/** Form alerts go here, and only here (Fix Brief Part 4, item 19). Override with ADMIN_EMAIL. */
export const OWNER_EMAIL = process.env.ADMIN_EMAIL || "nitin@axionindex.org";

/**
 * Sender for every email (item 17: "sent from the Axion Index address"). Replies always go to
 * PUBLIC_EMAIL (support@). To show support@ as the sender too, add it as a "Send mail as" address
 * in the SMTP_USER mailbox, then set SMTP_FROM="Axion Index <support@axionindex.org>" in the server .env.
 */
const fromLine = () => process.env.SMTP_FROM || `"Axion Index" <${process.env.SMTP_USER || PUBLIC_EMAIL}>`;

function transport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
}

/**
 * Send a branded notification to the site owner. Never throws: the submission
 * is already saved in MongoDB, so a mail failure must not turn into a failed
 * request. Returns true when the mail was handed to the SMTP server.
 */
export async function sendOwnerEmail(opts: { subject: string; replyTo?: string; email: OwnerEmail }): Promise<boolean> {
  if (!process.env.SMTP_HOST) {
    console.warn(`[MAILER] SMTP_HOST not set — skipped email "${opts.subject}" to ${OWNER_EMAIL}`);
    return false;
  }
  try {
    const { html, text } = renderOwnerEmail(opts.email);
    await transport().sendMail({ from: fromLine(), to: OWNER_EMAIL, replyTo: opts.replyTo, subject: opts.subject, html, text });
    return true;
  } catch (err) {
    console.error(`[MAILER] failed to send "${opts.subject}":`, err);
    return false;
  }
}

/**
 * Acknowledgement to the visitor (item 17). Replies go to the public address.
 * Never throws, for the same reason as above.
 */
export async function sendVisitorEmail(opts: { to: string; subject: string; email: VisitorEmail }): Promise<boolean> {
  if (!process.env.SMTP_HOST) {
    console.warn(`[MAILER] SMTP_HOST not set — skipped acknowledgement "${opts.subject}"`);
    return false;
  }
  try {
    const { html, text } = renderVisitorEmail(opts.email);
    await transport().sendMail({ from: fromLine(), to: opts.to, replyTo: PUBLIC_EMAIL, subject: opts.subject, html, text });
    return true;
  } catch (err) {
    console.error(`[MAILER] failed to send acknowledgement "${opts.subject}":`, err);
    return false;
  }
}
