import Link from "next/link";

export default function AxionWordmark({
  href = "/",
  className = "",
  color = "gold",
}: {
  href?: string;
  className?: string;
  color?: "gold" | "white";
}) {
  const svgSrc =
    color === "white"
      ? "/axion-index-wordmark-white.svg"
      : "/axion-index-wordmark-gold.svg";

  return (
    <Link href={href} aria-label="Axion Index — home" className={`inline-flex items-center ${className}`}>
      <img
        src={svgSrc}
        alt="Axion Index"
        className="object-contain"
        style={{
          width: "clamp(130px, 15vw, 190px)",
          height: "auto",
          display: "block",
        }}
      />
    </Link>
  );
}
