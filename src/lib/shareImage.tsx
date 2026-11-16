import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * The one share-image template (Fix Brief Part 3 item 13, Part 6 item 35): 1200 × 630,
 * site fonts and gold. Used for library covers (/cover/<slug>) and page images (/share/<page>).
 */
const font = (pkg: string, file: string) => readFile(join(process.cwd(), "node_modules/@fontsource", pkg, "files", file));

type Photo = { src: string; fit?: "cover" | "contain" };

/** With a `photo` (a data: URL), the photo fills the right side and the text keeps the left. */
export async function shareImage({ label, kicker, title, meta, photo }: { label: string; kicker: string; title: string; meta?: string; photo?: Photo | null }) {
  const [serif, serifItalic, mono] = await Promise.all([
    font("cormorant-garamond", "cormorant-garamond-latin-500-normal.woff"),
    font("cormorant-garamond", "cormorant-garamond-latin-500-italic.woff"),
    font("jetbrains-mono", "jetbrains-mono-latin-500-normal.woff"),
  ]);
  const titleSize = photo
    ? (title.length > 70 ? 42 : title.length > 45 ? 50 : title.length > 25 ? 60 : 74)
    : (title.length > 70 ? 54 : title.length > 45 ? 64 : title.length > 25 ? 78 : 96);
  const PHOTO_W = 500;

  const text = (
      <div style={{ width: photo ? 1200 - PHOTO_W : "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: photo ? "56px 56px 56px 68px" : "64px 76px", background: "radial-gradient(120% 140% at 80% 0%, #26251f 0%, #15150f 45%, #0B0B09 100%)", color: "#F7F6F3", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: 6, height: "100%", background: "linear-gradient(#C9A24A, rgba(201,162,74,0))" }} />
        {/* top row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <svg width="54" height="34" viewBox="42 120 428 272">
              <g transform="translate(-78,0)" fill="#C9A24A">
                <polygon points="120,392 234,120 270,120 156,392" />
                <polygon points="270,120 234,120 348,392 384,392" />
                <polygon points="398,120 434,120 548,392 512,392" />
              </g>
            </svg>
            <div style={{ marginLeft: 18, fontFamily: "Mono", fontSize: 17, letterSpacing: 7, color: "#C9A24A" }}>AXION INDEX</div>
          </div>
          <div style={{ fontFamily: "Mono", fontSize: 15, letterSpacing: 5, color: "rgba(247,246,243,0.6)", textTransform: "uppercase" }}>{label}</div>
        </div>
        {/* title */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "Mono", fontSize: 18, letterSpacing: 6, color: "#C9A24A", textTransform: "uppercase", marginBottom: 22 }}>{kicker}</div>
          <div style={{ fontFamily: "Serif", fontSize: titleSize, lineHeight: 1.04, maxWidth: photo ? 560 : 1000 }}>{title}</div>
        </div>
        {/* bottom row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid rgba(247,246,243,0.14)", paddingTop: 24 }}>
          <div style={{ fontFamily: "Mono", fontSize: 15, letterSpacing: 4, color: "rgba(247,246,243,0.55)", textTransform: "uppercase" }}>{meta || "Axion Index"}</div>
          <div style={{ fontFamily: "SerifItalic", fontSize: 26, color: "#C9A24A" }}>axionindex.org</div>
        </div>
      </div>
  );

  return new ImageResponse(
    photo ? (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0B0B09" }}>
        {text}
        <div style={{ width: PHOTO_W, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0B0B09", padding: photo.fit === "contain" ? 36 : 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src={photo.src} width={photo.fit === "contain" ? PHOTO_W - 72 : PHOTO_W} height={photo.fit === "contain" ? 630 - 72 : 630} style={{ objectFit: photo.fit ?? "cover", width: "100%", height: "100%" }} />
        </div>
      </div>
    ) : text,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Serif", data: serif, weight: 500, style: "normal" },
        { name: "SerifItalic", data: serifItalic, weight: 500, style: "italic" },
        { name: "Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}
