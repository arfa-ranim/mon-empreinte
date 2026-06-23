import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { parseImages, formatPrice } from "@/lib/utils";
import { buildWhatsAppUrl, productOrderMessage } from "@/lib/whatsapp";
import Button from "./Button";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  images: string;
  category?: string | null;
}

export default function ProductCard({ id, title, price, images, category }: ProductCardProps) {
  const imageList = parseImages(images);
  const imageUrl = imageList[0] || "/placeholder.svg";
  const whatsappUrl = buildWhatsAppUrl(productOrderMessage(title, price));

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-earth-100">
      <Link href={`/produits/${id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-cream-100">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {category && (
            <span className="absolute top-3 left-3 bg-white/90 text-earth-700 text-xs px-3 py-1 rounded-full">
              {category}
            </span>
          )}
        </div>
      </Link>
      <div className="p-5">
        <Link href={`/produits/${id}`}>
          <h3 className="font-serif text-lg font-semibold text-earth-800 hover:text-earth-600 transition-colors">
            {title}
          </h3>
        </Link>
        <p className="mt-1 text-earth-600 font-medium">{formatPrice(price)}</p>
        <div className="mt-4">
          <Button href={whatsappUrl} variant="whatsapp" external className="w-full text-xs py-2.5">
            <MessageCircle size={16} />
            Commander via WhatsApp
          </Button>
        </div>
      </div>
    </article>
  );
}
