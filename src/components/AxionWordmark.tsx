import Link from "next/link";

export default function AxionWordmark({ href = "/", className = "", color = "default" }: { href?: string; className?: string; color?: "default" | "white" | "gold" }) {
  const svgSrc = color === "white" ? "/axion-index-wordmark-white.svg" : "/axion-index-wordmark-gold.svg";
  
  return (
    <Link href={href} aria-label="Axion Index — home" className={`inline-flex items-center ${className}`}>
      <img
        src={svgSrc}
        alt="Axion Index"
        className="object-contain"
        style={{
          width: "clamp(105px, 14vw, 155px)",
        }}
      />
    </Link>
  );
}
