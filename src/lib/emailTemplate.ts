/**
 * Branded HTML email for owner notifications (diagnostic, written intent, AI Edge).
 *
 * Email clients (Gmail especially) ignore <style> blocks and flexbox, so the
 * layout is built from tables with inline styles only. Every user-supplied
 * value goes through esc().
 */

export const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

const nl2br = (s: string) => s.replace(/\r?\n/g, "<br>");
const filled = (v: unknown) => v !== undefined && v !== null && String(v).trim() !== "";

// ── Brand palette (mirrors the site: ink / gold / cream) ──
const C = {
  page: "#F3F1EC",
  card: "#FFFFFF",
  ink: "#0D0D0B",
  gold: "#C9A24A",
  goldDeep: "#9A7429",
  goldSoft: "#F7F0DD",
  goldLine: "#E9DAB2",
  cream: "#F7F6F3",
  muted: "#8A8578",
  text: "#1F1E1B",
  line: "#ECE8DF",
  panel: "#FAF8F3",
  good: "#2F9E80",
  mid: "#C9A24A",
  poor: "#D04A4A",
};
const SERIF = "Georgia,'Times New Roman',serif";
const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

// ── Types ──
export type Contact = { name: string; email: string; phone: string };

export type EmailSection =
  | { type: "fields"; title: string; rows: [label: string, value: unknown][] }
  | { type: "list"; title: string; items: string[]; ordered?: boolean }
  | { type: "tags"; title: string; tags: string[] }
  | { type: "quote"; title: string; text: string }
  | { type: "score"; title: string; score: number; outOf: number; range: string; band: string; bandColor: string; caption: string }
  | { type: "bars"; title: string; bars: { label: string; value: number }[] };

export type OwnerEmail = {
  /** Short label in the header pill, e.g. "Diagnostic" */
  badge: string;
  /** Big header line, e.g. "New diagnostic signal" */
  heading: string;
  /** Line under the heading, e.g. "Krupali Vekariya · Marvel Ai Company" */
  subheading?: string;
  /** Inbox preview text shown next to the subject */
  preheader?: string;
  contact: Contact;
  /** Extra rows inside the contact card, e.g. preferred callback */
  contactExtra?: [label: string, value: unknown][];
  sections: EmailSection[];
};

// ── Helpers ──
export function istTimestamp(d = new Date()) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short",
      year: "numeric", hour: "numeric", minute: "2-digit", hour12: true,
    }).formatToParts(d).map((x) => [x.type, x.value]),
  );
  return `${p.weekday}, ${p.day} ${p.month} ${p.year} · ${p.hour}:${p.minute} ${String(p.dayPeriod).toUpperCase()} IST`;
}

const telHref = (phone: string) => "tel:" + phone.replace(/[^\d+]/g, "");

/** wa.me needs the country code; bare 10-digit numbers are treated as Indian (+91). */
function whatsappHref(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length === 10) digits = "91" + digits;
  return digits.length >= 11 ? `https://wa.me/${digits}` : null;
}

const scoreColor = (v: number) => (v >= 65 ? C.good : v >= 40 ? C.mid : C.poor);

// ── Building blocks ──
const sectionTitle = (t: string) =>
  `<div style="font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${C.goldDeep};margin:0 0 12px;">${esc(t)}</div>`;

const block = (inner: string) => `<tr><td style="padding:26px 32px 0;">${inner}</td></tr>`;

const button = (label: string, href: string, solid: boolean) =>
  `<a href="${esc(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:10px 18px;border-radius:999px;font-family:${SANS};font-size:12px;font-weight:700;letter-spacing:0.5px;text-decoration:none;${
    solid ? `background:${C.ink};color:${C.gold};border:1px solid ${C.ink};` : `background:${C.card};color:${C.ink};border:1px solid #D9D3C4;`
  }">${esc(label)}</a>`;

function renderContact(c: Contact, extra: [string, unknown][] = []) {
  const rows: [string, string][] = [];
  if (filled(c.email)) rows.push(["Email", `<a href="mailto:${esc(c.email)}" style="color:${C.goldDeep};text-decoration:none;">${esc(c.email)}</a>`]);
  if (filled(c.phone)) rows.push(["Mobile", `<a href="${esc(telHref(c.phone))}" style="color:${C.goldDeep};text-decoration:none;">${esc(c.phone)}</a>`]);
  for (const [l, v] of extra) if (filled(v)) rows.push([l, esc(v)]);

  const wa = filled(c.phone) ? whatsappHref(c.phone) : null;
  const buttons = [
    filled(c.email) ? button("Reply by email", `mailto:${c.email}`, true) : "",
    filled(c.phone) ? button("Call", telHref(c.phone), false) : "",
    wa ? button("WhatsApp", wa, false) : "",
  ].join("");

  return block(`
    ${sectionTitle("Contact details")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.panel};border:1px solid ${C.line};border-radius:12px;">
      <tr><td style="padding:20px 22px 14px;">
        <div style="font-family:${SERIF};font-size:21px;line-height:1.3;color:${C.text};">${esc(c.name)}</div>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:10px;">
          ${rows.map(([l, v]) => `<tr>
            <td valign="top" style="padding:4px 18px 4px 0;font-family:${SANS};font-size:12px;color:${C.muted};white-space:nowrap;">${esc(l)}</td>
            <td valign="top" style="padding:4px 0;font-family:${SANS};font-size:14px;line-height:1.5;color:${C.text};">${v}</td>
          </tr>`).join("")}
        </table>
        ${buttons ? `<div style="margin-top:16px;">${buttons}</div>` : ""}
      </td></tr>
    </table>`);
}

function renderSection(s: EmailSection): string {
  switch (s.type) {
    case "fields": {
      const rows = s.rows.filter(([, v]) => filled(v));
      if (!rows.length) return "";
      return block(`${sectionTitle(s.title)}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          ${rows.map(([l, v], i) => {
            const bd = i < rows.length - 1 ? `border-bottom:1px solid ${C.line};` : "";
            return `<tr>
              <td valign="top" width="38%" style="padding:11px 14px 11px 0;${bd}font-family:${SANS};font-size:13px;color:${C.muted};">${esc(l)}</td>
              <td valign="top" style="padding:11px 0;${bd}font-family:${SANS};font-size:14px;line-height:1.5;color:${C.text};">${esc(v)}</td>
            </tr>`;
          }).join("")}
        </table>`);
    }
    case "list": {
      const items = s.items.filter(filled);
      if (!items.length) return "";
      return block(`${sectionTitle(s.title)}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${C.line};border-radius:12px;">
          ${items.map((it, i) => {
            const bd = i < items.length - 1 ? `border-bottom:1px solid ${C.line};` : "";
            const mark = s.ordered ? String(i + 1).padStart(2, "0") : "&#9670;";
            return `<tr>
              <td valign="top" width="34" style="padding:13px 0 13px 16px;${bd}font-family:${SANS};font-size:${s.ordered ? 12 : 10}px;font-weight:700;color:${C.gold};">${mark}</td>
              <td valign="top" style="padding:12px 16px 12px 8px;${bd}font-family:${SANS};font-size:14px;line-height:1.5;color:${C.text};">${esc(it)}</td>
            </tr>`;
          }).join("")}
        </table>`);
    }
    case "tags": {
      const tags = s.tags.filter(filled);
      if (!tags.length) return "";
      return block(`${sectionTitle(s.title)}<div>${tags.map((t) =>
        `<span style="display:inline-block;margin:0 6px 6px 0;padding:6px 13px;border-radius:999px;background:${C.goldSoft};border:1px solid ${C.goldLine};font-family:${SANS};font-size:12px;font-weight:600;color:#7A5B1E;">${esc(t)}</span>`,
      ).join("")}</div>`);
    }
    case "quote": {
      if (!filled(s.text)) return "";
      return block(`${sectionTitle(s.title)}
        <div style="border-left:3px solid ${C.gold};background:${C.panel};border-radius:0 10px 10px 0;padding:15px 18px;font-family:${SANS};font-size:14px;line-height:1.65;color:${C.text};">${nl2br(esc(s.text))}</div>`);
    }
    case "score": {
      return block(`${sectionTitle(s.title)}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.ink};border-radius:12px;">
          <tr>
            <td valign="middle" style="padding:22px 24px;">
              <div style="font-family:${SANS};font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${C.muted};">Edge score</div>
              <div style="font-family:${SERIF};font-size:46px;line-height:1.1;color:${esc(s.bandColor)};margin-top:6px;">${esc(s.score)}<span style="font-size:18px;color:${C.muted};"> / ${esc(s.outOf)}</span></div>
              <div style="font-family:${SANS};font-size:12px;color:${C.muted};margin-top:4px;">Range ${esc(s.range)}</div>
            </td>
            <td valign="middle" align="right" style="padding:22px 24px;">
              <span style="display:inline-block;padding:7px 14px;border-radius:999px;border:1px solid ${esc(s.bandColor)};font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${esc(s.bandColor)};">${esc(s.band)}</span>
              <div style="font-family:${SERIF};font-size:17px;color:${C.cream};margin-top:12px;">${esc(s.caption)}</div>
            </td>
          </tr>
        </table>`);
    }
    case "bars": {
      if (!s.bars.length) return "";
      return block(`${sectionTitle(s.title)}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          ${s.bars.map((b) => {
            const pct = Math.max(0, Math.min(100, Math.round(b.value)));
            const col = scoreColor(b.value);
            const cell = (w: string, bg: string) =>
              `<td${w ? ` width="${w}"` : ""} style="height:6px;background:${bg};border-radius:3px;font-size:0;line-height:0;">&nbsp;</td>`;
            return `<tr><td style="padding:7px 0 9px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                <td style="font-family:${SANS};font-size:13px;color:${C.text};">${esc(b.label)}</td>
                <td align="right" style="font-family:${SANS};font-size:13px;font-weight:700;color:${col};">${esc(b.value)}</td>
              </tr></table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:6px;"><tr>
                ${pct > 0 ? cell(`${pct}%`, col) : ""}${pct < 100 ? cell("", "#EFEBE2") : ""}
              </tr></table>
            </td></tr>`;
          }).join("")}
        </table>`);
    }
  }
}

// ── Plain-text twin (better deliverability, readable in any client) ──
function renderText(e: OwnerEmail, when: string) {
  const out: string[] = [`AXION INDEX — ${e.heading.toUpperCase()}`, e.subheading ?? "", ""];
  out.push("CONTACT DETAILS", `Name:   ${e.contact.name}`, `Email:  ${e.contact.email}`, `Mobile: ${e.contact.phone || "-"}`);
  for (const [l, v] of e.contactExtra ?? []) if (filled(v)) out.push(`${l}: ${v}`);
  for (const s of e.sections) {
    const lines: string[] = [];
    if (s.type === "fields") s.rows.filter(([, v]) => filled(v)).forEach(([l, v]) => lines.push(`${l}: ${v}`));
    if (s.type === "list") s.items.filter(filled).forEach((it, i) => lines.push(`${s.ordered ? `${i + 1}.` : "-"} ${it}`));
    if (s.type === "tags" && s.tags.length) lines.push(s.tags.join(", "));
    if (s.type === "quote" && filled(s.text)) lines.push(s.text);
    if (s.type === "score") lines.push(`${s.score} / ${s.outOf} (range ${s.range}) — ${s.band}, ${s.caption}`);
    if (s.type === "bars") s.bars.forEach((b) => lines.push(`${b.label}: ${b.value}`));
    if (lines.length) out.push("", s.title.toUpperCase(), ...lines);
  }
  out.push("", `Submitted ${when} via axionindex.org`, `Reply to this email to answer ${e.contact.name} directly.`);
  return out.join("\n");
}

// ── Full document ──
export function renderOwnerEmail(e: OwnerEmail): { html: string; text: string } {
  const when = istTimestamp();
  const firstName = e.contact.name.split(/\s+/)[0] || e.contact.name;

  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light only">
<title>${esc(e.heading)}</title>
</head>
<body style="margin:0;padding:0;background:${C.page};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(e.preheader ?? e.subheading ?? "")}&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.page};">
  <tr><td align="center" style="padding:32px 14px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:${C.card};border:1px solid #E5E0D4;border-radius:16px;overflow:hidden;">

      <!-- Header -->
      <tr><td style="background:${C.ink};padding:26px 32px 30px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="font-family:${SANS};font-size:12px;font-weight:700;letter-spacing:4px;color:${C.gold};">AXION&nbsp;INDEX</td>
          <td align="right"><span style="display:inline-block;padding:6px 12px;border:1px solid ${C.gold};border-radius:999px;font-family:${SANS};font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${C.gold};">${esc(e.badge)}</span></td>
        </tr></table>
        <div style="font-family:${SERIF};font-size:28px;line-height:1.25;color:${C.cream};margin-top:26px;">${esc(e.heading)}</div>
        ${e.subheading ? `<div style="font-family:${SANS};font-size:14px;line-height:1.5;color:#A8A397;margin-top:6px;">${esc(e.subheading)}</div>` : ""}
      </td></tr>
      <tr><td style="height:3px;line-height:3px;font-size:0;background:${C.gold};">&nbsp;</td></tr>

      ${renderContact(e.contact, e.contactExtra)}
      ${e.sections.map(renderSection).join("")}

      <!-- Footer -->
      <tr><td style="padding:30px 32px 0;font-size:0;line-height:0;">&nbsp;</td></tr>
      <tr><td style="padding:18px 32px 22px;background:${C.panel};border-top:1px solid ${C.line};font-family:${SANS};font-size:12px;line-height:1.7;color:${C.muted};">
        Submitted <span style="color:${C.text};">${esc(when)}</span> via axionindex.org<br>
        Just hit reply to answer ${esc(firstName)} directly.
      </td></tr>
    </table>
    <div style="font-family:${SANS};font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#B3AC9C;margin-top:18px;">Axion Index &nbsp;·&nbsp; From ambiguity to architecture</div>
  </td></tr>
</table>
</body></html>`;

  return { html, text: renderText(e, when) };
}
