import NewsletterSignup from "@/models/NewsletterSignup";

/**
 * Add someone to the Axion Index Journal list (Fix Brief Part 4, step 2). Call ONLY after the
 * visitor ticked the consent box. Returns "added", or "already" when the email was on the list.
 * Expects an open database connection.
 */
export async function joinJournal(p: { name: string; email: string; source: string; sourcePage?: string }): Promise<"added" | "already"> {
  const existing = await NewsletterSignup.findOneAndUpdate({ email: p.email }, { name: p.name });
  if (existing) return "already";
  try {
    await NewsletterSignup.create({ name: p.name, email: p.email, consentAt: new Date(), source: p.source, sourcePage: p.sourcePage ?? "" });
    return "added";
  } catch (e) {
    if ((e as { code?: number }).code === 11000) return "already"; // same email at the same moment
    throw e;
  }
}
