"use client";

import { motion } from "framer-motion";

interface StaggeredGridProps {
  children: React.ReactNode[];
  className?: string;
  columns?: 2 | 3 | 4;
}

export default function StaggeredGrid({ 
  children, 
  className = "",
  columns = 3
}: StaggeredGridProps) {
  const colClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <motion.div 
      className={`grid gap-6 ${colClasses[columns]} ${className}`}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}