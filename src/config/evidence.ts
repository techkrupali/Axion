/**
 * The three figures on the homepage, and where they come from (Fix Brief Part 8, B-16).
 * The homepage tiles link to the evidence block on /reports#evidence. Each label says no more
 * than its source does (Part 5, item 26).
 */
export const HOME_EVIDENCE = [
  {
    val: "70%",
    key: "Transformations miss their objectives",
    src: "McKinsey",
    finding: "About 70% of transformations do not achieve their objectives.",
    note: "A figure McKinsey has cited for years. It means missed goals, not necessarily outright collapse.",
    source: "McKinsey & Company, “Why do most transformations fail? A conversation with Harry Robinson”",
    url: "https://www.mckinsey.com/~/media/McKinsey/Business%20Functions/Transformation/Our%20Insights/Why%20do%20most%20transformations%20fail%20A%20conversation%20with%20Harry%20Robinson/Why-do-most-transformations-fail-a-conversation-with-Harry-Robinson.pdf",
  },
  {
    val: "95%",
    key: "GenAI pilots show no P&L impact",
    src: "MIT NANDA",
    finding: "Only about 5% of integrated generative-AI pilots were extracting measurable value; the rest showed no measurable P&L impact.",
    note: "From MIT NANDA's The GenAI Divide: State of AI in Business 2025. A preliminary study of its own sample (interviews, a survey and public deployments), and its method has been publicly questioned, so read it as an early signal rather than a measured rate.",
    source: "MIT NANDA, The GenAI Divide: State of AI in Business 2025 (reported by Fortune, August 2025)",
    url: "https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/",
  },
  {
    val: "39%",
    key: "Core skills change by 2030",
    src: "WEF",
    finding: "Employers expect 39% of workers' core skills to change by 2030.",
    note: "An employer-survey expectation, not a measured change. Down from 44% in the 2023 edition.",
    source: "World Economic Forum, Future of Jobs Report 2025, Skills Outlook",
    url: "https://www.weforum.org/publications/the-future-of-jobs-report-2025/in-full/3-skills-outlook/",
  },
] as const;
