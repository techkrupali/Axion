import SeriesEditor from "./SeriesEditor";
import { studioLibrary } from "../data";
import { PageHeader, ui } from "../ui";

export const dynamic = "force-dynamic";

export default async function StudioSeries() {
  const { lib } = await studioLibrary();
  return (
    <>
      <PageHeader
        eyebrow="Articles & Publications"
        title="Series"
        intro="Add a series before adding its first part. A series shows on the website once one of its parts is published."
      />
      <section aria-labelledby="add-series" className="mb-12">
        <h2 id="add-series" className={`${ui.mono} text-[var(--fg-5)] mb-4`}>Add a series</h2>
        <SeriesEditor />
      </section>
      <section aria-labelledby="existing-series">
        <h2 id="existing-series" className="font-display font-medium text-[28px] leading-none text-[var(--fg)] mb-5">
          Existing series <span className="font-mono text-[12px] text-[#C9A24A] align-middle ml-1">{lib.series.length}</span>
        </h2>
        <div className="flex flex-col gap-4">
          {lib.series.map((s) => (
            <SeriesEditor key={s.slug} series={s} parts={lib.items.filter((i) => i.series === s.slug).length} />
          ))}
          {lib.series.length === 0 && <p className={`${ui.panel} px-6 py-10 text-center text-[15px] text-[var(--fg-5)]`}>No series yet.</p>}
        </div>
      </section>
    </>
  );
}
