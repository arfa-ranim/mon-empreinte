import Image from "next/image";
import { Clock, MessageCircle } from "lucide-react";
import { parseImages, formatPrice } from "@/lib/utils";
import { buildWhatsAppUrl, workshopBookingMessage } from "@/lib/whatsapp";
import Button from "./Button";

interface WorkshopCardProps {
  title: string;
  description: string;
  price: number;
  duration: string;
  images: string;
  availability?: string | null;
}

export default function WorkshopCard({
  title,
  description,
  price,
  duration,
  images,
  availability,
}: WorkshopCardProps) {
  const imageList = parseImages(images);
  const imageUrl = imageList[0] || "/placeholder.svg";
  const whatsappUrl = buildWhatsAppUrl(workshopBookingMessage(title, price, duration));

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-earth-100 flex flex-col md:flex-row">
      <div className="relative md:w-2/5 aspect-[4/3] md:aspect-auto min-h-[200px] overflow-hidden bg-cream-100">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 40vw"
        />
      </div>
      <div className="p-6 md:w-3/5 flex flex-col">
        <h3 className="font-serif text-xl font-semibold text-earth-800">{title}</h3>
        <p className="mt-2 text-earth-600 text-sm leading-relaxed flex-grow">{description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-earth-600">
          <span className="flex items-center gap-1.5">
            <Clock size={16} className="text-earth-500" />
            {duration}
          </span>
          <span className="font-semibold text-earth-800">{formatPrice(price)}</span>
          {availability && (
            <span className="bg-cream-200 text-earth-700 px-3 py-0.5 rounded-full text-xs">
              {availability}
            </span>
          )}
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
