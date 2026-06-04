'use client';
import { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
  showArrow?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Button({ 
  href, 
  onClick, 
  variant = "primary", 
  children, 
  className = "", 
  showArrow = false,
  size = "md"
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center gap-3 font-mono text-[12px] sm:text-[11px] tracking-[0.28em] uppercase rounded-full font-semibold transition-all duration-500 min-h-[44px]";
  
  const sizeClasses = {
    sm: "px-6 py-3 min-h-[44px]",
    md: "px-8 py-4 min-h-[48px]",
    lg: "px-10 py-5 min-h-[52px]"
  };

  const variantClasses = {
    primary: "bg-[#C9A24A] text-[#0A0A0B] hover:scale-105",
    secondary: "border border-[rgba(201,162,74,0.2)] text-[#C9A24A] hover:border-[#C9A24A] hover:scale-105"
  };

  const content = (
    <>
      {children}
      {showArrow && <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className} group`}>
        {content}
      </Link>
    );
  }

  return (
    <motion.button 
      onClick={onClick} 
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className} group`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {content}
    </motion.button>
  );
}
