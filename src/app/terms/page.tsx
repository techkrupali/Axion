import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { PUBLIC_EMAIL } from "@/config/contact";

export const metadata = pageMetadata({
  title: "Terms",
  description: "The terms for using axionindex.org: information on the site, our content, external links and contact.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Axion Index · Terms"
      title="Terms of use"
      updated="20 November 2026"
      intro={<p>These terms apply to your use of axionindex.org, run by Axion Index (Bengaluru, India). By using the site you agree to them. Questions: <a href={`mailto:${PUBLIC_EMAIL}`}>{PUBLIC_EMAIL}</a>.</p>}
      glance={[
        "The site is general information, not advice for your situation.",
        "Link to any page, and quote short passages with credit.",
        "Ask us before republishing anything else.",
      ]}
      related={{ label: "Privacy policy", href: "/privacy" }}
      sections={[
        {
          id: "information", title: "Information, not advice",
          content: <p>The website explains how Axion Index thinks. It is general information, not legal, tax, HR or financial advice for your situation. Tools on the site, such as the Labour Codes estimate, give indicative results based on working models; they are a starting point for a conversation, not a measured finding about you or your organisation. Frameworks marked as illustrative models have not yet been validated.</p>,
        },
        {
          id: "content", title: "Our content",
          content: <p>The text, frameworks, index names, designs and images on this site belong to Axion Index unless stated otherwise. You are welcome to link to any page and to quote short passages with credit. Please ask us before republishing anything else.</p>,
        },
        {
          id: "forms", title: "Forms",
          content: <p>Please give accurate details when you use a form. How we handle what you send is explained in our <a href="/privacy">privacy policy</a>.</p>,
        },
        {
          id: "links", title: "Links to other websites",
          content: <p>Some pages link to articles and profiles on other websites. We are not responsible for their content or how they handle your information.</p>,
        },
        {
          id: "changes", title: "Changes",
          content: <p>If we change these terms, we will update the date at the top of this page.</p>,
        },
      ]}
    />
  );
}
