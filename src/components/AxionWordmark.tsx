import Link from "next/link";

export default function AxionWordmark({ href = "/", className = "" }: { href?: string; className?: string }) {
  return (
    <Link href={href} aria-label="Axion Index — home" className={`inline-flex items-center ${className}`}>
      <svg
        width="148"
        height="28"
        viewBox="0 0 148 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* AXION — serif display */}
        <text
          x="0"
          y="22"
          fontFamily="var(--font-cormorant-garamond), 'Cormorant Garamond', Georgia, serif"
          fontWeight="500"
          fontSize="22"
          letterSpacing="-0.2"
          fill="#F7F6F3"
        >
          Ax
        </text>
        <text
          x="22"
          y="22"
          fontFamily="var(--font-cormorant-garamond), 'Cormorant Garamond', Georgia, serif"
          fontWeight="400"
          fontStyle="italic"
          fontSize="22"
          letterSpacing="-0.2"
          fill="#F7F6F3"
        >
          ion
        </text>
        {/* INDEX — mono label */}
        <text
          x="58"
          y="19"
          fontFamily="var(--font-geist-mono), 'JetBrains Mono', ui-monospace, monospace"
          fontWeight="400"
          fontSize="8"
          letterSpacing="3"
          fill="#C9A24A"
          opacity="0.85"
        >
          INDEX
        </text>
      </svg>
    </Link>
  );
}
