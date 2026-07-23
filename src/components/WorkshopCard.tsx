import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar, MessageCircle, ChevronRight } from "lucide-react";
import { parseImages, formatPrice } from "@/lib/utils";
import { buildWhatsAppUrl, workshopBookingMessage } from "@/lib/whatsapp";
import Button from "./Button";
import { WHATSAPP_NUMBER } from "@/lib/constants";

interface WorkshopCardProps {
  id: string; // Add id prop
  title: string;
  description: string;
  price: number;
  duration: string;
  images: string;
  date?: string | null;
  availability?: string | null;
}

export default function WorkshopCard({
  id, // Add id parameter
  title,
  description,
  price,
  duration,
  images,
  date,
  availability,
}: WorkshopCardProps) {
  const imageList = parseImages(images);
  const imageUrl = imageList[0] || "/placeholder.svg";
  const whatsappUrl = buildWhatsAppUrl(
    WHATSAPP_NUMBER,
    workshopBookingMessage(title, price, duration)
  );

  const formattedDate = date ? new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : '';

  return (
    <article className="workshop-card group flex flex-col md:flex-row">
      {/* Mint accent strip */}
      <div className="workshop-accent shrink-0 hidden md:block"></div>

      {/* Image with link to detail */}
      <Link href={`/ateliers/${id}`} className="relative md:w-2/5 aspect-4/3 md:aspect-auto min-h-50 overflow-hidden bg-cream-100 block">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 40vw"
        />
        {availability && (
          <span className="absolute top-3 right-3 bg-peach-light text-earth-700 text-xs px-3 py-1 rounded-full font-medium shadow-sm md:hidden">
            {availability}
          </span>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/90 text-earth-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
            Voir détails <ChevronRight size={16} />
          </span>
        </div>
      </Link>

      <div className="p-6 md:w-3/5 flex flex-col">
        <div className="flex items-start justify-between">
          <Link href={`/ateliers/${id}`}>
            <h3 className="font-serif text-xl font-semibold text-earth-800 hover:text-mint transition-colors">
              {title}
            </h3>
          </Link>
          {availability && (
            <span className="hidden md:inline-block bg-peach-light text-earth-700 text-xs px-3 py-1 rounded-full font-medium shadow-sm">
              {availability}
            </span>
          )}
        </div>
        <p className="mt-2 text-earth-600 text-sm leading-relaxed grow">{description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-earth-600">
          {formattedDate && (
            <span className="flex items-center gap-1.5 bg-lavender-light px-3 py-1 rounded-full">
              <Calendar size={16} className="text-lavender" />
              {formattedDate}
            </span>
          )}
          <span className="flex items-center gap-1.5 bg-mint-light px-3 py-1 rounded-full">
            <Clock size={16} className="text-mint" />
            {duration || "Durée flexible"}
          </span>
          <span className="font-semibold text-earth-800 text-lg">✨ {formatPrice(price)}</span>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button href={whatsappUrl} variant="whatsapp" external>
            <MessageCircle size={16} />
            Réserver
          </Button>
          <Button href={`/ateliers/${id}`} variant="outline" className="text-sm">
            En savoir plus
          </Button>
        </div>
      </div>
    </article>
  );
}