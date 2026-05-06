"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  x?: number;
  y?: number;
  scale?: number;
}

export const Reveal = ({ children, delay = 0, className = "", x = 0, y, scale }: RevealProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: y ?? (x ? 0 : 12), x, scale: scale ?? 1 }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
