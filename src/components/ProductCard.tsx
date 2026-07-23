import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { parseImages, formatPrice } from "@/lib/utils";
import { buildWhatsAppUrl, productOrderMessage } from "@/lib/whatsapp";
import Button from "./Button";
import { WHATSAPP_NUMBER } from "@/lib/constants"; // ← ADD THIS

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
  // ✅ Fix: Pass both number and message
  const whatsappUrl = buildWhatsAppUrl(
    WHATSAPP_NUMBER,
    productOrderMessage(title, price)
  );

  return (
    <article className="product-card group">
      <Link href={`/produits/${id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-cream-100">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {category && (
            <span className="absolute top-3 left-3 bg-lavender-light text-earth-700 text-xs px-3 py-1 rounded-full font-medium shadow-sm">
              {category}
            </span>
          )}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs bg-white/80 px-2 py-1 rounded-full text-earth-500">
              ✨ Détail
            </span>
          </div>
        </div>
      </Link>
      <div className="p-5">
        <Link href={`/produits/${id}`}>
          <h3 className="font-serif text-lg font-semibold text-earth-800 hover:text-peach transition-colors">
            {title}
          </h3>
        </Link>
        <p className="mt-1 text-earth-600 font-medium">
          <span className="text-gold-800">✨</span> {formatPrice(price)}
        </p>
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