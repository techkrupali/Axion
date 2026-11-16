import SeriesEditor from "./SeriesEditor";
import { studioLibrary } from "../data";

export const dynamic = "force-dynamic";

export default async function StudioSeries() {
  const { lib } = await studioLibrary();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-[36px] leading-tight text-[var(--fg)]">Series</h1>
        <p className="text-[14.5px] text-[var(--fg-4)] mt-1">Add a series before adding its first part. A series shows on the site once one part is published.</p>
      </div>
      <h2 className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--accent)]">Add a series</h2>
      <SeriesEditor />
      <h2 className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--accent)] mt-4">Existing series ({lib.series.length})</h2>
      {lib.series.map((s) => (
        <SeriesEditor key={s.slug} series={s} parts={lib.items.filter((i) => i.series === s.slug).length} />
      ))}
    </div>
  );
}
