"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Calendar, MessageCircle, ChevronRight, Users, MapPin, Award } from "lucide-react";
import { parseImages, formatPrice } from "@/lib/utils";
import { buildWhatsAppUrl, workshopBookingMessage } from "@/lib/whatsapp";
import Button from "./Button";
import { WHATSAPP_NUMBER } from "@/lib/constants";

interface WorkshopCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  images: string;
  date?: string | null;
  availability?: string | null;
  location?: string | null;
  maxSpots?: number | null;
  skillLevel?: string | null;
}

const skillLevelLabels: Record<string, string> = {
  débutant: "🌱 Débutant",
  intermédiaire: "🌿 Intermédiaire",
  avancé: "🌳 Avancé",
};

function isSoon(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const workshopDate = new Date(dateStr);
  const diffTime = workshopDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 7;
}

export default function WorkshopCard({
  id,
  title,
  description,
  price,
  duration,
  images,
  date,
  availability,
  location,
  maxSpots,
  skillLevel,
}: WorkshopCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageList = parseImages(images);
  const imageUrl = imageList[0] || "/placeholder.svg";
  const whatsappUrl = buildWhatsAppUrl(
    WHATSAPP_NUMBER,
    workshopBookingMessage(title, price, duration || "")
  );

  const isAvailable = availability !== "complet" && availability !== "annulé";
  const formattedDate = date
    ? new Date(date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const day = date ? new Date(date).getDate() : null;
  const month = date
    ? new Date(date).toLocaleString("fr-FR", { month: "short" })
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative bg-white dark:bg-earth-900 rounded-2xl overflow-hidden shadow-elevation-1 hover:shadow-elevation-3 transition-all duration-500 border border-earth-100 dark:border-earth-800 flex flex-col md:flex-row"
    >
      <div
        className={`absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full text-xs font-medium shadow-lg ${
          isAvailable ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}
      >
        {isAvailable ? "✅ Disponible" : "🔴 Complet"}
      </div>

      <div className="relative md:w-2/5 aspect-4/3 md:aspect-auto min-h-60 overflow-hidden bg-cream-100 dark:bg-earth-800">
        {!imageLoaded && <div className="absolute inset-0 skeleton-shimmer" />}

        <Image
          src={imageUrl}
          alt={title}
          fill
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmMGU4Ii8+PC9zdmc+"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
          className={`object-cover transition-all duration-700 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          } group-hover:scale-105`}
          onLoad={() => setImageLoaded(true)}
        />

        <div className="absolute inset-0 bg-earth-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {day && month && (
          <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-earth-800/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-earth-100 dark:border-earth-700">
            <div className="text-center">
              <span className="block text-2xl font-bold text-earth-800 dark:text-earth-200 leading-none">
                {day}
              </span>
              <span className="block text-xs text-earth-500 dark:text-earth-400 uppercase tracking-wider">
                {month}
              </span>
            </div>
          </div>
        )}

        {location && (
          <div className="absolute bottom-4 right-4 md:hidden flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
            <MapPin size={14} />
            <span className="truncate max-w-25">{location}</span>
          </div>
        )}
      </div>

      <div className="flex-1 p-6 flex flex-col">
        <div className="flex items-start justify-between gap-4">
          <Link href={`/ateliers/${id}`} className="flex-1">
            <h3 className="font-serif text-xl font-semibold text-earth-800 dark:text-earth-200 hover:text-mint dark:hover:text-mint transition-colors">
              {title}
            </h3>
          </Link>
          <span className="text-xl font-bold text-earth-800 dark:text-earth-200 whitespace-nowrap">
            {formatPrice(price)}
          </span>
        </div>

        <p className="mt-2 text-earth-600 dark:text-earth-400 text-sm leading-relaxed line-clamp-2">
          {description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {duration && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-mint-light/50 dark:bg-mint/10 rounded-full text-xs text-earth-700 dark:text-earth-300">
              <Clock size={14} className="text-mint dark:text-mint" />
              {duration}
            </span>
          )}
          {availability && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-peach-light/50 dark:bg-peach/10 rounded-full text-xs text-earth-700 dark:text-earth-300">
              <Calendar size={14} className="text-peach dark:text-peach" />
              {availability}
            </span>
          )}
          {maxSpots && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-lavender-light/50 dark:bg-lavender/10 rounded-full text-xs text-earth-700 dark:text-earth-300">
              <Users size={14} className="text-lavender dark:text-lavender" />
              {maxSpots} places
            </span>
          )}
          {skillLevel && skillLevel in skillLevelLabels && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold-light/50 dark:bg-gold/10 rounded-full text-xs text-earth-700 dark:text-earth-300">
              <Award size={14} className="text-gold dark:text-gold" />
              {skillLevelLabels[skillLevel]}
            </span>
          )}
        </div>

        {location && (
          <div className="mt-3 flex items-center gap-1.5 text-sm text-earth-500 dark:text-earth-400">
            <MapPin size={16} />
            <span className="truncate">{location}</span>
          </div>
        )}

        {formattedDate && (
          <div className="mt-1 flex items-center gap-2 text-sm text-earth-500 dark:text-earth-400">
            <Calendar size={16} className="text-mint" />
            <span>{formattedDate}</span>
            {date && isSoon(date) && (
              <span className="text-xs bg-peach-light/30 dark:bg-peach/10 text-earth-700 dark:text-earth-300 px-2 py-0.5 rounded-full">
                Bientôt
              </span>
            )}
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            href={whatsappUrl}
            variant="whatsapp"
            external
            className="text-sm px-6 py-2.5 group/btn"
          >
            <MessageCircle size={16} className="group-hover/btn:scale-110 transition-transform" />
            Réserver
          </Button>
          <Link
            href={`/ateliers/${id}`}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full border-2 border-earth-200 dark:border-earth-700 text-earth-700 dark:text-earth-300 text-sm font-medium hover:bg-earth-50 dark:hover:bg-earth-800 hover:border-earth-300 dark:hover:border-earth-600 transition-all group/link"
          >
            En savoir plus
            <ChevronRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}