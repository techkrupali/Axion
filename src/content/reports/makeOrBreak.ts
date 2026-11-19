import { REPORT } from "@/config/report";

/**
 * Make or Break: everything on its report page, in Nitin's words
 * ("Make or Break: Report Page Layout, Content and Download Flow", 19 Nov 2026).
 * Edit the text here; the page (src/components/reports/MakeOrBreakPage.tsx) only lays it out.
 */
export const MAKE_OR_BREAK = {
  seo: {
    title: "Make or Break: The Weakest Link in the Big AI Bet | Axion Index",
    description: "Why AI's value isn't reaching the bottom line, and why organisations are the weakest link.",
  },
  coverAlt: "Make or Break report cover, Axion Index Journal Special Report No. 01",

  hero: {
    label: "Axion Index Journal · Special Report No. 01",
    headline: "Make or Break: The Weakest Link in the Big AI Bet",
    standfirst:
      "Capital is moving at the speed of markets. Value is moving at the speed of organisations. This report reads twelve research sources and 2026 market data, phase by phase, to show where AI value is being created, where it is stalling, and why delivery inside organisations is now the weakest link.",
    badge: "Out now",
    readOnline: "Read online",
    download: "Download the PDF",
    meta: ["By Nitin Nahata", "Published 20 November 2026", "48 pages"],
  },

  keyFindings: [
    { figure: "56%", finding: "of 4,454 CEOs report no significant financial benefit from AI to date", source: "PwC Global CEO Survey, January 2026" },
    { figure: "80% vs 37%", finding: "report better individual productivity, but only 37% an impact on enterprise EBIT", source: "McKinsey, The State of AI, August 2026" },
    { figure: "1.7% to 3.3%", finding: "AI spending as a share of revenue", source: "BCG, September 2026" },
    { figure: "44%", finding: "cite savings from earlier automation as a source of AI funding", source: "Bain, June 2026" },
    { figure: "120,136", finding: "announced US job cuts citing AI, January to September 2026", source: "Challenger, Gray & Christmas, October 2026" },
  ],

  inside: [
    { title: "The Investment Cycle", text: "the five phases of the AI bet, from business case to delivery, and why they don't move at the same speed." },
    { title: "The Three Laws of AI", text: "three conversions between adoption and value, and where value stalls at each one." },
    { title: "The India Test", text: "what the AI economy means for the market closest to delivery." },
    { title: "Four questions for leaders, and a worked example", text: "what CEOs, CFOs and CHROs should ask before the next AI budget, and what changes when the work is redesigned before the tool is deployed." },
  ],

  roles: {
    heading: "Read it in twenty minutes, by role",
    paths: [
      { role: "CEO", sections: ["Key findings", "1.3", "2.7", "4.1", "The verdict"] },
      { role: "CFO", sections: ["2.1", "2.2", "3.1", "4.3", "4.5"] },
      { role: "CHRO", sections: ["2.5", "2.6", "2.7", "3.4", "4.1", "4.2"] },
      { role: "Board and investors", sections: ["1.1", "1.2", "2.4", "3.2", "4.4"] },
    ],
  },

  form: {
    heading: "Get the full report",
    text: "Enter your details and we'll send the 48-page PDF to your inbox, and start the download now.",
    optIn: "Send me The Architecture Gap (January 2027) and the monthly Axion Index Journal",
    button: "Send me the report",
    smallPrint: "We'll use your email to send this report and, if you tick the box, future Axion Index research. No spam.",
    thanksHeading: "Your report is on its way.",
    thanksText: "The download has started, and a copy is in your inbox. If you find it useful, share it with a colleague who owns an AI budget.",
  },

  method: {
    heading: "How this report was built",
    text: "A synthesis of twelve core research sources, including McKinsey, PwC, BCG, Bain, MIT NANDA, Forrester and Challenger, Gray & Christmas, read alongside 2026 market data. Every figure is labelled Measured, Survey, Reported or Axion view, so readers can see how much weight it will bear. The report was not commissioned and received no funding or sponsorship. No company named in it reviewed it before publication.",
  },

  author: {
    heading: "About the author",
    text: "Nitin Nahata is the founder of Axion Index. He has spent 23 years in HR leadership at Standard Chartered, HSBC, Tata Global Beverages and Udaan.",
    photo: "/nitin-nahata-founder.jpg",
  },

  cite: {
    heading: "How to cite",
    text: "Nahata, N. (2026). Make or Break: The Weakest Link in the Big AI Bet. Axion Index Journal, Special Report No. 01. Bengaluru: Axion Index.",
  },

  /** Share buttons: this text, then the page link */
  shareText: "Make or Break: why AI's value isn't reaching the bottom line, and why organisations are now the weakest link. A report from Axion Index:",

  comingNext: {
    label: "Coming next",
    title: "The Architecture Gap · January 2027",
    text: "Why organisations struggle to respond, and what is missing inside them.",
  },

  /** The visitor's email after the download form (from "Nitin Nahata, Axion Index", support@) */
  email: {
    fromName: "Nitin Nahata, Axion Index",
    subject: "Your copy of Make or Break",
  },

  pdf: REPORT.pdfPath,
  pdfFileName: REPORT.pdfFileName,
  cover: REPORT.coverImage,
} as const;
