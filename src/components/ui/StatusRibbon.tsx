"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatusRibbonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "success" | "warning" | "error" | "info";
}

const variants = {
  success: "bg-green-500 text-white",
  warning: "bg-yellow-500 text-white",
  error: "bg-red-500 text-white",
  info: "bg-blue-500 text-white",
};

export default function StatusRibbon({
  children,
  className,
  variant = "info",
}: StatusRibbonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full text-xs font-medium shadow-lg",
        variants[variant],
        className
      )}
    >
      {children}
    </motion.div>
  );
}