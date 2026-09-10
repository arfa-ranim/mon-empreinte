"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, ChevronRight, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";

interface Workshop {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  images: string;
  date: string | null;
  availability: string | null;
  location: string | null;
  maxSpots: number | null;
  skillLevel: string | null;
}

interface UpcomingWorkshopsProps {
  workshops: Workshop[];
}

export default function UpcomingWorkshops({ workshops }: UpcomingWorkshopsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted || workshops.length === 0) {
    return null;
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const getDaysUntil = (dateStr: string | null) => {
    if (!dateStr) return null;
    const workshopDate = new Date(dateStr);
    const diffTime = workshopDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatWorkshopDate = (dateStr: string | null) => {
    if (!dateStr) return "Date à définir";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  return (
    <section className="py-16 sm:py-20 bg-linear-to-b from-cream-50 to-peach-light/20 dark:from-earth-900 dark:to-earth-800/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-peach-light/30 dark:bg-peach/10 px-4 py-2 rounded-full text-sm text-earth-600 dark:text-earth-300 mb-4">
            <Calendar size={16} className="text-peach-dark dark:text-peach" />
            <span>À venir</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-earth-800 dark:text-earth-200">
            Ateliers à venir
          </h2>
          <p className="mt-3 text-earth-600 dark:text-earth-400 max-w-xl mx-auto">
            Réservez votre place pour nos prochains ateliers créatifs
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workshops.slice(0, 3).map((workshop, index) => {
            const daysUntil = getDaysUntil(workshop.date);
            const isThisWeek = daysUntil !== null && daysUntil <= 7;
            const isTomorrow = daysUntil === 1;
            const isAvailable =
              workshop.availability !== "complet" &&
              workshop.availability !== "annulé";

            return (
              <motion.div
                key={workshop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ y: -4 }}
                className="group relative bg-white dark:bg-earth-900 rounded-2xl overflow-hidden shadow-elevation-1 hover:shadow-elevation-3 transition-shadow duration-500 border border-earth-100 dark:border-earth-800"
              >
                {/* "Bientôt" badge */}
                {isThisWeek && (
                  <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-gradient-warm text-earth-900 text-xs font-medium rounded-full shadow-lg flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-earth-900 animate-pulse" />
                    {isTomorrow ? "Demain !" : "Bientôt"}
                  </div>
                )}

                {/* Availability chip — icon + text, colorblind-safe */}
                <div className="absolute top-4 right-4 z-10">
                  <span
                    className={`status-chip shadow-sm ${
                      isAvailable
                        ? "status-chip--available"
                        : "status-chip--unavailable"
                    }`}
                  >
                    {isAvailable ? (
                      <Check size={12} strokeWidth={3} />
                    ) : (
                      <X size={12} strokeWidth={3} />
                    )}
                    {isAvailable ? "Disponible" : "Complet"}
                  </span>
                </div>

                {/* Days count badge — moved below the status chip area, inline in content */}
                <div className="p-6">
                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-earth-500 dark:text-earth-400 mt-2">
                    <Calendar
                      size={14}
                      className="text-peach-dark dark:text-peach"
                    />
                    <span>{formatWorkshopDate(workshop.date)}</span>
                    {daysUntil !== null && daysUntil > 0 && (
                      <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full bg-cream-100 dark:bg-earth-800 text-earth-600 dark:text-earth-300 text-xs font-medium">
                        J-{daysUntil}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <Link
                    href={`/ateliers/${workshop.id}`}
                    className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2 rounded-md"
                  >
                    <h3 className="font-serif text-xl font-semibold text-earth-800 dark:text-earth-200 mt-3 hover:text-peach-dark dark:hover:text-peach transition-colors line-clamp-2">
                      {workshop.title}
                    </h3>
                  </Link>

                  {/* Description */}
                  <p className="mt-2 text-earth-600 dark:text-earth-400 text-sm leading-relaxed line-clamp-2">
                    {workshop.description}
                  </p>

                  {/* Chips */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {workshop.duration && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-mint-light/50 dark:bg-mint/10 rounded-full text-xs text-earth-700 dark:text-earth-300">
                        <Clock size={12} className="text-mint-dark dark:text-mint" />
                        {workshop.duration}
                      </span>
                    )}
                    {workshop.location && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-lavender-light/50 dark:bg-lavender/10 rounded-full text-xs text-earth-700 dark:text-earth-300">
                        <span aria-hidden="true">📍</span>
                        <span className="truncate max-w-30">
                          {workshop.location}
                        </span>
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold-light/50 dark:bg-gold/10 rounded-full text-xs text-earth-700 dark:text-earth-300">
                      {formatPrice(workshop.price)}
                    </span>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/ateliers/${workshop.id}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-peach-dark dark:text-peach hover:text-earth-800 dark:hover:text-earth-200 transition-colors group/link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2 rounded-md"
                  >
                    Voir l&apos;atelier
                    <ChevronRight
                      size={16}
                      className="group-hover/link:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <Link
            href="/ateliers"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-earth-200 dark:border-earth-700 text-earth-700 dark:text-earth-300 rounded-full text-sm font-medium hover:bg-earth-50 dark:hover:bg-earth-800 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2"
          >
            Voir tous les ateliers
            <ChevronRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}