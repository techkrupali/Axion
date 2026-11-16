import Link from "next/link";

/** How to use the Studio, and the weekly routine (Fix Brief Part 7). */
export default function StudioHelp() {
  const h = "font-serif text-[24px] text-[var(--fg)] mt-10 mb-3";
  const li = "mb-2";
  return (
    <div className="max-w-[720px] text-[15.5px] leading-[1.75] text-[var(--fg-3)]">
      <h1 className="font-serif text-[36px] leading-tight text-[var(--fg)]">How to use the Studio</h1>

      <h2 className={h}>Add a LinkedIn essay (about 5 minutes)</h2>
      <ol className="list-decimal pl-6">
        <li className={li}>In <Link href="/studio" className="text-[var(--accent)] underline">Library</Link>, click <b>+ Essay</b> (or <b>+ Series</b> for a part of a series).</li>
        <li className={li}>Paste the title, set the date it was posted, and tick one or two themes.</li>
        <li className={li}>Write a two-line summary in your own words.</li>
        <li className={li}>Paste the LinkedIn post&apos;s link, then paste the post&apos;s text into <b>Full text</b>. A blank line starts a new paragraph.</li>
        <li className={li}>Click <b>Preview</b>. The page opens in a new tab exactly as visitors will see it, with a gold &ldquo;Preview&rdquo; bar. Only you can see it.</li>
        <li className={li}>Back in the Studio, click <b>Publish</b>. It is live straight away, on its page, in its category, on the hub and in the Founder page&apos;s &ldquo;Writing &amp; media&rdquo;.</li>
      </ol>

      <h2 className={h}>Add a media piece</h2>
      <p>Click <b>+ In the media</b>. Add the title, date, publication name, the article&apos;s link and a two-line summary in your own words. Never copy the publisher&apos;s text. Publish.</p>

      <h2 className={h}>Add a photo</h2>
      <p>Every item can have a photo: an essay, a series part, a media piece, a podcast, a report or the book. In the item, under <b>Photo</b>, click <b>Choose a photo</b> and pick a JPG or PNG from your computer or phone. Large photos are made smaller automatically. Then describe in a few words what it shows (for people using screen readers) and save. The photo appears beside the title on the item&apos;s cover: in every list, on its page and when the link is shared on LinkedIn. For the book, use the book cover; it is shown whole. <b>Replace photo</b> or <b>Remove photo</b> changes it; without a photo, the cover shows the title only.</p>
      <p>Use only photos Axion Index owns or has permission to use, and none of clients without their written permission.</p>

      <h2 className={h}>Change or take down something</h2>
      <p>Open it from the Library. For a live item, <b>Save and update live</b> changes the page at once. <b>Unpublish</b> takes it off the site and keeps it as a draft. <b>Delete</b> removes it for good.</p>

      <h2 className={h}>Every Monday</h2>
      <ul className="list-disc pl-6">
        <li className={li}>Add last week&apos;s LinkedIn essays and media pieces, each in its category. The library should never be more than 7 days behind LinkedIn.</li>
        <li className={li}>Check the live LinkedIn feed on the homepage shows the latest posts.</li>
        <li className={li}>Then post the site link in the first comment of each LinkedIn essay. <code className="text-[var(--fg-2)]">node scripts/linkedin-links.mjs</code> prints them with tracking tags; or ask the tech team.</li>
      </ul>

      <h2 className={h}>Good to know</h2>
      <ul className="list-disc pl-6">
        <li className={li}>An item&apos;s web address is made from its title and is fixed once published, so links never break.</li>
        <li className={li}>Covers and share images are made automatically from the title.</li>
        <li className={li}>Something looks wrong? Add a row to the tracker with what to change and why (see the change-request flow).</li>
      </ul>
    </div>
  );
}
