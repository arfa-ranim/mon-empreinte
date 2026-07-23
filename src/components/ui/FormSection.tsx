"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
  description?: string;
}

export default function FormSection({
  title,
  icon,
  isOpen,
  onToggle,
  children,
  className,
  description,
}: FormSectionProps) {
  return (
    <section className={cn(
      "bg-white dark:bg-earth-900 rounded-2xl p-4 sm:p-6 border border-earth-100 dark:border-earth-800 shadow-elevation-1 hover:shadow-elevation-2 transition-shadow",
      className
    )}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2 hover:bg-cream-50 dark:hover:bg-earth-800 px-2 -mx-2 rounded-lg transition-colors touch-manipulation group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-peach-light/20 dark:bg-peach/10 flex items-center justify-center text-peach group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <div className="text-left">
            <h2 className="font-serif text-lg sm:text-xl font-semibold text-earth-800 dark:text-earth-200">
              {title}
            </h2>
            {description && (
              <p className="text-xs text-earth-500 dark:text-earth-400 mt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-earth-400 dark:text-earth-500 bg-cream-100 dark:bg-earth-800 px-2 py-0.5 rounded-full">
            {isOpen ? "Ouvert" : "Fermé"}
          </span>
          {isOpen ? <ChevronUp size={20} className="text-earth-400" /> : <ChevronDown size={20} className="text-earth-400" />}
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-4 space-y-4 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}