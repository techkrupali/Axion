import { REPORT } from "@/config/report";
import { formatDate, isUpcoming, type LibraryItem } from "@/content/library";

/**
 * Where a report stands right now. The Global AI Report follows the launch-day
 * switch (NEXT_PUBLIC_REPORT_PUBLISHED); other reports follow their date.
 */
export function reportState(item: LibraryItem) {
  const isGlobal = item.slug === REPORT.slug;
  const released = isGlobal ? REPORT.published : !!item.date && !isUpcoming(item);
  const readHref = isGlobal && REPORT.published ? REPORT.readPath : undefined;
  const when = item.date ? formatDate(item.date) : "";
  const status = released
    ? (when ? `Published ${when}` : "Published")
    : item.date
      ? `Releasing ${formatDate(item.date, "short").replace(/ \d{4}$/, "")}`
      : item.owner === "ai-edge-lab" ? "Launches with the AI Edge Lab site" : "Date to be announced";
  return { released, readHref, when, status };
}

/** The report's PDF as a full address (for emails and the thank-you page), once it is out. */
export const pdfUrl = (item: LibraryItem) =>
  item.pdf ? (item.pdf.startsWith("/") ? `https://axionindex.org${item.pdf}` : item.pdf) : "";

/** Sign-ups are stored per report. The Global AI Report keeps its original key so earlier sign-ups still count. */
export const signupKey = (slug: string) => (slug === REPORT.slug ? REPORT.edition : slug);
