/**
 * The Studio's look in one place: field, button and panel styles, the page header and status badges.
 * No hooks here, so server and client components can both use it.
 */

const BTN = "inline-flex items-center justify-center gap-2 h-11 px-5 font-mono text-[10.5px] tracking-[0.18em] uppercase whitespace-nowrap transition-colors disabled:opacity-50 disabled:pointer-events-none";

export const ui = {
  label: "block mb-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--fg-4)]",
  input:
    "w-full px-4 py-3 text-[15px] text-[var(--fg)] bg-[#111113] border border-[rgba(240,241,245,0.12)] outline-none transition-colors " +
    "hover:border-[rgba(240,241,245,0.22)] focus:border-[#C9A24A] focus:bg-[#141416] placeholder:text-[var(--fg-5)] disabled:opacity-60",
  hint: "mt-2 text-[12.5px] leading-snug text-[var(--fg-5)]",
  panel: "border border-[rgba(240,241,245,0.08)] bg-[#0E0E10]",
  primary: `${BTN} bg-[#C9A24A] text-[#0A0A0B] font-semibold hover:bg-[#D6B35E]`,
  secondary: `${BTN} border border-[rgba(240,241,245,0.16)] text-[var(--fg-2)] hover:border-[#C9A24A] hover:text-[var(--fg)]`,
  quiet: `${BTN} text-[var(--fg-4)] hover:text-[var(--fg)]`,
  danger: `${BTN} border border-[rgba(224,122,110,0.35)] text-[#E8877B] hover:bg-[rgba(224,122,110,0.08)] hover:border-[#E8877B]`,
  dangerSolid: `${BTN} bg-[#C4574B] text-white font-semibold hover:bg-[#D26457]`,
  mono: "font-mono text-[10.5px] tracking-[0.18em] uppercase",
  chip: (on: boolean) =>
    `cursor-pointer inline-flex items-center px-3.5 py-2 border text-[13px] transition-colors ${on ? "border-[#C9A24A] bg-[rgba(201,162,74,0.12)] text-[var(--fg)]" : "border-[rgba(240,241,245,0.12)] text-[var(--fg-4)] hover:text-[var(--fg-2)] hover:border-[rgba(240,241,245,0.24)]"}`,
} as const;

/** Page title block: small gold line, serif title, one line of help, actions on the right. */
export function PageHeader({ eyebrow, title, intro, actions, crumbs }: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  actions?: React.ReactNode;
  crumbs?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-5 pb-8 mb-8 border-b border-[rgba(240,241,245,0.08)]">
      {crumbs && <div className={`${ui.mono} text-[var(--fg-5)]`}>{crumbs}</div>}
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
        <div className="min-w-0 max-w-[760px]">
          {eyebrow && <p className={`${ui.mono} text-[#C9A24A]`}>{eyebrow}</p>}
          <h1 className="font-display font-medium text-[clamp(32px,4vw,46px)] leading-[1.08] text-[var(--fg)] mt-2 [text-wrap:balance]">{title}</h1>
          {intro && <p className="text-[15px] leading-[1.65] text-[var(--fg-4)] mt-3">{intro}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
      </div>
    </header>
  );
}

export type Status = "live" | "draft" | "hidden";

/** Live (on the site), Draft (only in preview), or published but missing what it needs to show. */
export function StatusBadge({ status }: { status: Status }) {
  const s = {
    live: { text: "Live", dot: "bg-[#6FCF9F]", cls: "text-[#8FDDB6] border-[rgba(111,207,159,0.28)] bg-[rgba(111,207,159,0.07)]" },
    draft: { text: "Draft", dot: "bg-[#8A8F9E]", cls: "text-[var(--fg-3)] border-[rgba(240,241,245,0.14)] bg-[rgba(240,241,245,0.04)]" },
    hidden: { text: "Needs a link", dot: "bg-[#E0B25A]", cls: "text-[#E8C27A] border-[rgba(224,178,90,0.3)] bg-[rgba(224,178,90,0.07)]" },
  }[status];
  return (
    <span className={`inline-flex items-center gap-2 h-7 px-2.5 border font-mono text-[10px] tracking-[0.16em] uppercase whitespace-nowrap ${s.cls}`}
      title={status === "hidden" ? "Published, but not on the site yet: it still needs its text or link" : undefined}>
      <span aria-hidden className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.text}
    </span>
  );
}

/** "16 Nov 2026" from an ISO date-time. */
export const shortDate = (iso?: string) =>
  iso ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date(iso)) : "";

/** Who saved it, in plain words. */
export const savedBy = (by?: string) => (!by ? "" : by === "starting data" ? "Imported" : by);
