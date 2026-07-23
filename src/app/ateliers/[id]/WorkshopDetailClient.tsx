"use client";

import Image from "next/image";
import { Calendar, Clock, MapPin, Users, MessageCircle, Tag, Award } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import Button from "@/components/Button";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useState } from "react";

interface Workshop {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  images: string;
  startDate: Date | null;
  endDate: Date | null;
  startTime: string | null;
  endTime: string | null;
  availableSeats: number | null;
  maxSpots: number | null;
  status: string | null;
  location: string | null;
  materials: string | null;
  skillLevel: string | null;
  availability: string | null;
}

interface WorkshopDetailClientProps {
  workshop: Workshop;
  images: string[];
  whatsappUrl: string;
}

const statusColors: Record<string, string> = {
  available: "bg-green-100 text-green-700",
  full: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-700",
  draft: "bg-yellow-100 text-yellow-700",
};

const statusLabels: Record<string, string> = {
  available: "✅ Disponible",
  full: "🔴 Complet",
  cancelled: "❌ Annulé",
  draft: "📝 Brouillon",
};

const skillLevelLabels: Record<string, string> = {
  débutant: "🌱 Débutant",
  intermédiaire: "🌿 Intermédiaire",
  avancé: "🌳 Avancé",
};

export default function WorkshopDetailClient({ 
  workshop, 
  images, 
  whatsappUrl 
}: WorkshopDetailClientProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const lightboxSlides = images.map((img: string) => ({ src: img }));

  const status = workshop.status || "available";
  const skillLevel = workshop.skillLevel || "";
  const startDate = workshop.startDate ? formatDate(workshop.startDate) : null;
  const endDate = workshop.endDate ? formatDate(workshop.endDate) : null;
  const dateRange = startDate && endDate && startDate !== endDate 
    ? `${startDate} - ${endDate}`
    : startDate || "Date à définir";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Image gallery */}
      <div className="space-y-4">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream-100 group">
          <Image
            src={images[0] || "/placeholder.svg"}
            alt={workshop.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="absolute bottom-4 right-4 p-3 bg-white/90 rounded-full shadow-lg hover:scale-110 transition-transform"
            aria-label="Agrandir l'image"
          >
            <span className="text-earth-800">🔍</span>
          </button>
        </div>
        
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {images.slice(1).map((img: string, i: number) => (
              <button
                key={img}
                onClick={() => setCurrentImageIndex(i + 1)}
                className="relative aspect-square rounded-lg overflow-hidden bg-cream-100 hover:ring-2 hover:ring-mint transition-all"
                aria-label={`Voir l'image ${i + 2}`}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="100px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Workshop info */}
      <div>
        <div className="flex items-start justify-between">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-earth-800">
            {workshop.title}
          </h1>
          <span className={`text-sm px-3 py-1 rounded-full font-medium ${statusColors[status]}`}>
            {statusLabels[status]}
          </span>
        </div>

        <p className="mt-4 text-2xl font-semibold text-earth-700">
          {formatPrice(workshop.price)}
        </p>

        {/* Workshop details */}
        <div className="mt-6 space-y-3">
          {/* Date */}
          <div className="flex items-center gap-3 text-earth-600">
            <Calendar size={20} className="text-mint" />
            <span>{dateRange}</span>
          </div>

          {/* Time */}
          {workshop.startTime && workshop.endTime && (
            <div className="flex items-center gap-3 text-earth-600">
              <Clock size={20} className="text-mint" />
              <span>{workshop.startTime} - {workshop.endTime}</span>
            </div>
          )}

          {/* Duration */}
          {workshop.duration && (
            <div className="flex items-center gap-3 text-earth-600">
              <Clock size={20} className="text-mint" />
              <span>Durée: {workshop.duration}</span>
            </div>
          )}

          {/* Location */}
          {workshop.location && (
            <div className="flex items-center gap-3 text-earth-600">
              <MapPin size={20} className="text-mint" />
              <span>{workshop.location}</span>
            </div>
          )}

          {/* Available seats */}
          <div className="flex items-center gap-3 text-earth-600">
            <Users size={20} className="text-mint" />
            <span>
              {workshop.availableSeats !== null && workshop.maxSpots !== null
                ? `${workshop.availableSeats} / ${workshop.maxSpots} places disponibles`
                : workshop.availableSeats !== null
                ? `${workshop.availableSeats} places disponibles`
                : "Places disponibles"}
            </span>
          </div>

          {/* Skill level */}
          {skillLevel && (
            <div className="flex items-center gap-3 text-earth-600">
              <Award size={20} className="text-mint" />
              <span>Niveau: {skillLevelLabels[skillLevel] || skillLevel}</span>
            </div>
          )}

          {/* Materials */}
          {workshop.materials && (
            <div className="flex items-start gap-3 text-earth-600">
              <Tag size={20} className="text-mint mt-1" />
              <span>Matériel fourni: {workshop.materials}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mt-8">
          <h3 className="font-semibold text-earth-800 mb-3">Description</h3>
          <p className="text-earth-600 leading-relaxed whitespace-pre-line">
            {workshop.description}
          </p>
        </div>

        {/* Availability note */}
        {workshop.availability && (
          <div className="mt-4 text-sm text-earth-500 bg-cream-100 p-3 rounded-lg">
            📅 {workshop.availability}
          </div>
        )}

        {/* WhatsApp button */}
        <div className="mt-8">
          <Button 
            href={whatsappUrl} 
            variant="whatsapp" 
            external 
            className="w-full text-base py-4"
          >
            <MessageCircle size={20} />
            Réserver via WhatsApp
          </Button>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        slides={lightboxSlides}
        index={currentImageIndex}
      />
    </div>
  );
}