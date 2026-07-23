"use client";

import { motion } from "framer-motion";

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function AnimatedCard({ 
  children, 
  delay = 0, 
  className = "" 
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}