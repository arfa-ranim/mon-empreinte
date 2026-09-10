"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  href?: string;
  color?: string;
  bgColor?: string;
  delay?: number;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  href,
  color = "text-peach",
  bgColor = "bg-peach/10",
  delay = 0,
}: StatsCardProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={href ? { y: -2 } : undefined}
      className="relative overflow-hidden group"
    >
      <div className="bg-white dark:bg-earth-900 rounded-2xl p-6 border border-earth-100 dark:border-earth-800 shadow-elevation-1 hover:shadow-elevation-3 transition-all duration-300">
        <div
          className={cn(
            "absolute -right-8 -top-8 w-32 h-32 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500",
            bgColor
          )}
        />

        <div className="relative flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-earth-500 dark:text-earth-400 text-sm font-medium">
              {title}
            </p>
            <p className="text-3xl font-bold text-earth-800 dark:text-earth-200">
              {value}
            </p>
          </div>
          <div
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105",
              bgColor,
              color
            )}
          >
            <Icon size={24} />
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}