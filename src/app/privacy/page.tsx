import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { JOURNAL, PUBLIC_EMAIL } from "@/config/contact";

export const metadata = pageMetadata({
  title: "Privacy policy",
  description: "What Axion Index collects through this website, why, where it is kept, and how to ask for it to be corrected or deleted.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="AXION  ·  PRIVACY" title="Privacy policy" updated="20 November 2026">
      <section>
        <p>
          Axion Index (Bengaluru, India) runs axionindex.org. This policy explains what we collect through the website,
          why, and what you can ask us to do with it. Questions: <a href={`mailto:${PUBLIC_EMAIL}`}>{PUBLIC_EMAIL}</a>.
        </p>
      </section>

      <section>
        <h2>What we collect</h2>
        <p>Only what you type into a form on this site, and the page you sent it from:</p>
        <ul>
          <li><strong>Start a conversation</strong> (also on the Reach us page): name, email, phone number if you give one, role, company, company size, the signals you choose, any notes you add and a preferred callback time.</li>
          <li><strong>Report requests:</strong> name, email, organisation, and whether you also asked for the {JOURNAL.name}.</li>
          <li><strong>{JOURNAL.name}:</strong> name and email, and when you ticked the box to receive it.</li>
          <li><strong>The earlier AI Edge diagnostic</strong> (no longer offered): results already submitted (name, email, phone number if given, role, answers and score) are kept securely and are not shared with the AI Edge Lab institute. Write to us to have yours deleted.</li>
          <li><strong>AI Edge Lab early-bird registration:</strong> name, email, country, the assessment you chose and, if you give them, your organisation and role. This is kept on a separate AI Edge Lab list. With your consent, it is passed to the AI Edge Lab institute when its own website opens.</li>
        </ul>
        <p>
          Like most websites, our web server also keeps standard technical logs (such as IP address and browser type) for security
          and to keep the site running.
        </p>
      </section>

      <section>
        <h2>Why we use it</h2>
        <ul>
          <li>To read what you sent, reply to you, and prepare for a conversation you asked for.</li>
          <li>To send you an email confirming we received your form.</li>
          <li>To send you the report, the {JOURNAL.name} or the AI Edge Lab launch note you asked for. The Journal goes only to people who ticked the box for it.</li>
        </ul>
        <p>We do not sell your details, and we do not use them for advertising.</p>
      </section>

      <section>
        <h2>Where it is kept</h2>
        <p>
          Form submissions are stored in our database (MongoDB Atlas, AWS Mumbai region), emailed to the Axion Index team and listed in a
          spreadsheet the team uses to follow up (both Google Workspace). The website is hosted on servers we rent from Hostinger.
          Only the Axion Index team reads submissions.
        </p>
      </section>

      <section id="cookies">
        <h2>Analytics and cookies</h2>
        <p>
          We use an analytics service to count visits, see which pages are read, and see when a form is started or sent. It does not
          receive what you type into forms. We do not use advertising cookies.
        </p>
        <p>
          Some features set cookies: analytics (if our analytics service uses cookies) and the feed of our latest LinkedIn posts, which is
          provided by a third-party service. Visitors in the EU and UK are asked first, and these load only after you accept. You can change
          your choice at any time with &ldquo;Cookie settings&rdquo; at the bottom of every page. Some pages load images from third-party
          services, which may see your IP address when your browser fetches them.
        </p>
      </section>

      <section>
        <h2>How long we keep it, and your choices</h2>
        <p>
          We keep submissions for as long as we need them to respond to you and to stay in touch, unless you ask us to delete them.
          Write to <a href={`mailto:${PUBLIC_EMAIL}`}>{PUBLIC_EMAIL}</a> to see what we hold about you, correct it or delete it.
          To stop the {JOURNAL.name}, reply to any issue with the word unsubscribe, or write to us.
        </p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>If we change this policy, we will update the date at the top of this page.</p>
      </section>
    </LegalPage>
  );
}
