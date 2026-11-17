import type { CSSProperties, ElementType, HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  /** Start this many px lower (y) or to the side (x), then settle in place */
  y?: number;
  x?: number;
  duration?: number;
  delay?: number;
};

/**
 * A fade-and-rise for the first screen of a page, done in CSS (the "rise" class in globals.css).
 * Same look as the framer-motion entrance it replaces, but it starts as soon as the page is drawn,
 * so the main headline or photo is not hidden until the JavaScript has loaded.
 * Use framer-motion / Reveal for anything further down the page.
 */
export function Rise({ as = "div", y = 0, x = 0, duration = 0.8, delay = 0, className, style, ...rest }: Props) {
  const Tag = as as "div"; // any element; typed as one so its props check
  const vars = { "--rise-y": `${y}px`, "--rise-x": `${x}px`, "--rise-dur": `${duration}s`, "--rise-delay": `${delay}s` } as CSSProperties;
  return <Tag className={className ? `rise ${className}` : "rise"} style={{ ...vars, ...style }} {...rest} />;
}
