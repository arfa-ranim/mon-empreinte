"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedBadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "success" | "warning" | "error";
  animate?: boolean;
}

const variants = {
  primary: "bg-peach-light/30 text-earth-700 border-peach/20",
  success: "bg-green-100 text-green-700 border-green-200",
  warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
  error: "bg-red-100 text-red-700 border-red-200",
};

export default function AnimatedBadge({
  children,
  className,
  variant = "primary",
  animate = true,
}: AnimatedBadgeProps) {
  return (
    <motion.span
      initial={animate ? { opacity: 0, scale: 0.9 } : false}
      animate={animate ? { opacity: 1, scale: 1 } : false}
      transition={{ duration: 0.3 }}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {children}
    </motion.span>
  );
}