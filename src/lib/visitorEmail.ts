/**
 * Acknowledgement email to the visitor after any form (Fix Brief Part 4, item 17),
 * in the same style as the owner alerts: tables + inline styles, every value escaped.
 */
import { esc } from "@/lib/emailTemplate";
import { PUBLIC_EMAIL } from "@/config/contact";
import { SITE_URL } from "@/lib/seo";

export type VisitorEmail = {
  preheader: string;
  heading: string;
  paragraphs: string[];
  /** Optional recap, e.g. the signals they chose */
  list?: { title: string; items: string[] };
  /** Main link, e.g. the next read */
  cta?: { label: string; href: string; intro?: string };
  /** Why they got this email */
  reason: string;
};

const C = { page: "#F3F1EC", card: "#FFFFFF", ink: "#0D0D0B", gold: "#C9A24A", goldDeep: "#9A7429", cream: "#F7F6F3", muted: "#8A8578", text: "#1F1E1B", line: "#ECE8DF", panel: "#FAF8F3" };
const SERIF = "Georgia,'Times New Roman',serif";
const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

export function renderVisitorEmail(e: VisitorEmail): { html: string; text: string } {
  const paras = e.paragraphs
    .map((p) => `<p style="margin:0 0 14px;font-family:${SANS};font-size:15px;line-height:1.7;color:${C.text};">${esc(p)}</p>`)
    .join("");

  const list = e.list && e.list.items.length
    ? `<tr><td style="padding:6px 32px 0;">
        <div style="font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${C.goldDeep};margin:0 0 10px;">${esc(e.list.title)}</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.panel};border:1px solid ${C.line};border-radius:12px;">
          ${e.list.items.map((it, i) => `<tr><td style="padding:11px 16px;${i < e.list!.items.length - 1 ? `border-bottom:1px solid ${C.line};` : ""}font-family:${SANS};font-size:14px;line-height:1.5;color:${C.text};">${esc(it)}</td></tr>`).join("")}
        </table>
      </td></tr>`
    : "";

  const cta = e.cta
    ? `<tr><td style="padding:26px 32px 0;">
        ${e.cta.intro ? `<p style="margin:0 0 12px;font-family:${SANS};font-size:14px;line-height:1.6;color:${C.muted};">${esc(e.cta.intro)}</p>` : ""}
        <a href="${esc(e.cta.href)}" style="display:inline-block;padding:13px 22px;background:${C.ink};color:${C.gold};font-family:${SANS};font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;text-decoration:none;">${esc(e.cta.label)} &rarr;</a>
      </td></tr>`
    : "";

  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light only">
<title>${esc(e.heading)}</title>
</head>
<body style="margin:0;padding:0;background:${C.page};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(e.preheader)}&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.page};">
  <tr><td align="center" style="padding:32px 14px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:${C.card};border:1px solid #E5E0D4;border-radius:16px;overflow:hidden;">
      <tr><td style="background:${C.ink};padding:26px 32px 30px;">
        <div style="font-family:${SANS};font-size:12px;font-weight:700;letter-spacing:4px;color:${C.gold};">AXION&nbsp;INDEX</div>
        <div style="font-family:${SERIF};font-size:28px;line-height:1.25;color:${C.cream};margin-top:26px;">${esc(e.heading)}</div>
      </td></tr>
      <tr><td style="height:3px;line-height:3px;font-size:0;background:${C.gold};">&nbsp;</td></tr>
      <tr><td style="padding:28px 32px 4px;">${paras}</td></tr>
      ${list}
      ${cta}
      <tr><td style="padding:30px 32px 0;font-size:0;line-height:0;">&nbsp;</td></tr>
      <tr><td style="padding:18px 32px 22px;background:${C.panel};border-top:1px solid ${C.line};font-family:${SANS};font-size:12px;line-height:1.7;color:${C.muted};">
        ${esc(e.reason)}<br>
        Questions? Reply to this email or write to <a href="mailto:${PUBLIC_EMAIL}" style="color:${C.goldDeep};text-decoration:none;">${PUBLIC_EMAIL}</a>.
      </td></tr>
    </table>
    <div style="font-family:${SANS};font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#B3AC9C;margin-top:18px;">
      <a href="${SITE_URL}" style="color:#B3AC9C;text-decoration:none;">axionindex.org</a> &nbsp;·&nbsp; From ambiguity to architecture
    </div>
  </td></tr>
</table>
</body></html>`;

  const text = [
    "AXION INDEX",
    "",
    e.heading,
    "",
    ...e.paragraphs.flatMap((p) => [p, ""]),
    ...(e.list && e.list.items.length ? [e.list.title.toUpperCase(), ...e.list.items.map((i) => `- ${i}`), ""] : []),
    ...(e.cta ? [...(e.cta.intro ? [e.cta.intro] : []), `${e.cta.label}: ${e.cta.href}`, ""] : []),
    "--",
    e.reason,
    `Questions? Reply to this email or write to ${PUBLIC_EMAIL}.`,
    SITE_URL,
  ].join("\n");

  return { html, text };
}
