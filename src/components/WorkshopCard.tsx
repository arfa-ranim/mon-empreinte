import Image from "next/image";
import { Clock, Calendar, MessageCircle } from "lucide-react";
import { parseImages, formatPrice, formatDate } from "@/lib/utils";
import { buildWhatsAppUrl, workshopBookingMessage } from "@/lib/whatsapp";
import Button from "./Button";

interface WorkshopCardProps {
  title: string;
  description: string;
  price: number;
  duration: string; // "HH:MM - HH:MM"
  images: string;
  date?: string | null;
  availability?: string | null;
}

export default function WorkshopCard({
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
  const whatsappUrl = buildWhatsAppUrl(workshopBookingMessage(title, price, duration));

  // Format date
  const formattedDate = date ? new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : '';

  return (
    <article className="workshop-card group flex flex-col md:flex-row">
      {/* Mint accent strip */}
      <div className="workshop-accent flex-shrink-0 hidden md:block"></div>

      <div className="relative md:w-2/5 aspect-[4/3] md:aspect-auto min-h-[200px] overflow-hidden bg-cream-100">
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
      </div>

      <div className="p-6 md:w-3/5 flex flex-col">
        <div className="flex items-start justify-between">
          <h3 className="font-serif text-xl font-semibold text-earth-800">{title}</h3>
          {availability && (
            <span className="hidden md:inline-block bg-peach-light text-earth-700 text-xs px-3 py-1 rounded-full font-medium shadow-sm">
              {availability}
            </span>
          )}
        </div>
        <p className="mt-2 text-earth-600 text-sm leading-relaxed flex-grow">{description}</p>
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
        <div className="mt-5">
          <Button href={whatsappUrl} variant="whatsapp" external>
            <MessageCircle size={16} />
            Réserver via WhatsApp
          </Button>
        </div>
      </div>
    </article>
  );
}