import nodemailer from "nodemailer";

/** Every form submission on the site is emailed here. Override with ADMIN_EMAIL. */
export const OWNER_EMAIL = process.env.ADMIN_EMAIL || "nitin@axionindex.org";

/** Escape user-supplied text before putting it into an HTML email. */
export const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

/** One labelled row; empty values render as "-". */
export const row = (label: string, value: unknown) =>
  `<p style="margin:4px 0"><strong>${esc(label)}:</strong> ${esc(value) || "-"}</p>`;

/** Contact block shown at the top of every owner email. */
export const contactBlock = (c: { name: string; email: string; phone: string }) => `
  <h3 style="font-family:Georgia,serif;margin:16px 0 6px">Registered contact</h3>
  ${row("Name", c.name)}
  ${row("Email", c.email)}
  ${row("Mobile", c.phone)}
`;

/**
 * Send a notification to the site owner. Never throws: the submission is already
 * saved in MongoDB, so a mail failure must not turn into a failed request.
 * Returns true when the mail was handed to the SMTP server.
 */
export async function sendOwnerEmail(opts: { subject: string; html: string; replyTo?: string }): Promise<boolean> {
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

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER || OWNER_EMAIL,
      to: OWNER_EMAIL,
      replyTo: opts.replyTo,
      subject: opts.subject,
      html: `<div style="font-family:Arial,sans-serif;font-size:14px;color:#111">${opts.html}
        <hr style="margin-top:24px"/>
        <p style="color:#888;font-size:12px">Submitted ${esc(new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }))} IST · Axion Index</p>
      </div>`,
    });
    return true;
  } catch (err) {
    console.error(`[MAILER] failed to send "${opts.subject}":`, err);
    return false;
  }
}
