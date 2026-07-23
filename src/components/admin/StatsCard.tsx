"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  href?: string;
  color?: string;
  bgColor?: string;
  trend?: string;
  trendUp?: boolean;
  delay?: number;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  href,
  color = "text-peach",
  bgColor = "bg-peach/10",
  trend,
  trendUp = true,
  delay = 0,
}: StatsCardProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={href ? { y: -4 } : undefined}
      className="relative overflow-hidden group"
    >
      <div className="bg-white dark:bg-earth-900 rounded-2xl p-6 border border-earth-100 dark:border-earth-800 shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-300">
        {/* Decorative gradient background */}
        <div
          className={cn(
            "absolute -right-8 -top-8 w-32 h-32 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500",
            bgColor
          )}
        />

        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-earth-500 dark:text-earth-400 text-sm font-medium">
                {title}
              </p>
              <p className="text-3xl font-bold text-earth-800 dark:text-earth-200">
                {value}
              </p>
              {trend && (
                <div className="flex items-center gap-1.5">
                  {trendUp ? (
                    <ArrowUpRight size={16} className="text-green-500" />
                  ) : (
                    <ArrowDownRight size={16} className="text-red-500" />
                  )}
                  <span
                    className={cn(
                      "text-xs font-medium",
                      trendUp ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {trend}
                  </span>
                  <span className="text-xs text-earth-400 dark:text-earth-500">
                    vs mois dernier
                  </span>
                </div>
              )}
            </div>
            <div
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center",
                bgColor,
                color
              )}
            >
              <Icon size={24} />
            </div>
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