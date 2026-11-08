import nodemailer from "nodemailer";
import { renderOwnerEmail, type OwnerEmail } from "@/lib/emailTemplate";

/** Every form submission on the site is emailed here. Override with ADMIN_EMAIL. */
export const OWNER_EMAIL = process.env.ADMIN_EMAIL || "office@axionindex.org";

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
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    });

    const { html, text } = renderOwnerEmail(opts.email);
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER || OWNER_EMAIL,
      to: OWNER_EMAIL,
      replyTo: opts.replyTo,
      subject: opts.subject,
      html,
      text,
    });
    return true;
  } catch (err) {
    console.error(`[MAILER] failed to send "${opts.subject}":`, err);
    return false;
  }
}
