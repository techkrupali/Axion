import Link from "next/link";

/**
 * The gold Axion mark, cropped tight to the glyph (the source SVG has a lot of
 * empty space around it) so it sits neatly next to text.
 */
export function AxionMark({ color = "#C9A24A", height = "clamp(19px, 2vw, 26px)" }: { color?: string; height?: string }) {
  return (
    <svg
      viewBox="42 120 428 272"
      aria-hidden="true"
      focusable="false"
      style={{ height, width: "auto", aspectRatio: "428 / 272", display: "block", flexShrink: 0 }}
    >
      <g transform="translate(-78,0)" fill={color}>
        <polygon points="120,392 234,120 270,120 156,392" />
        <polygon points="270,120 234,120 348,392 384,392" />
        <polygon points="398,120 434,120 548,392 512,392" />
      </g>
    </svg>
  );
}

export default function AxionWordmark({
  href = "/",
  className = "",
  color = "gold",
  showMark = true,
}: {
  href?: string;
  className?: string;
  color?: "gold" | "white";
  /** Small Axion mark to the left of the "AXION INDEX" wordmark */
  showMark?: boolean;
}) {
  const svgSrc =
    color === "white"
      ? "/axion-index-wordmark-white.svg"
      : "/axion-index-wordmark-gold.svg";

  return (
    <Link href={href} aria-label="Axion Index — home" className={`inline-flex items-center gap-1.5 ${className}`}>
      {showMark && <AxionMark color={color === "white" ? "#FFFFFF" : "#C9A24A"} />}
      <img
        src={svgSrc}
        alt="Axion Index"
        className="object-contain"
        style={{
          width: "clamp(130px, 15vw, 190px)",
          height: "auto",
          display: "block",
          // the wordmark SVG starts with ~10% empty space; pull it closer to the mark
          marginLeft: showMark ? "calc(clamp(130px, 15vw, 190px) * -0.07)" : undefined,
        }}
      />
    </Link>
  );
}
