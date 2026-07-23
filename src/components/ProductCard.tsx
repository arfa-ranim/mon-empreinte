"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Eye, Heart } from "lucide-react";
import { parseImages, formatPrice } from "@/lib/utils";
import { buildWhatsAppUrl, productOrderMessage } from "@/lib/whatsapp";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import Button from "./Button";
import QuickView from "./QuickView";
import AnimatedCard from "./AnimatedCard";
import { useWishlist } from "@/hooks/useWishlist";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  images: string;
  category?: string | null;
  index?: number;
  description?: string;
  inStock?: boolean;
}

export default function ProductCard({ 
  id, 
  title, 
  price, 
  images, 
  category, 
  index = 0,
  description = "",
  inStock = true 
}: ProductCardProps) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(id);
  
  const imageList = parseImages(images);
  const imageUrl = imageList[0] || "/placeholder.svg";
  const whatsappUrl = buildWhatsAppUrl(
    WHATSAPP_NUMBER,
    productOrderMessage(title, price)
  );

  // Mock product data for quick view
  const productData = {
    id,
    title,
    description,
    price,
    images,
    category,
    inStock,
  };

  return (
    <>
      <AnimatedCard delay={index * 0.05}>
        <article className="product-card group relative overflow-hidden">
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
              
              {/* Wishlist heart - always visible */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(id);
                }}
                className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-sm hover:scale-110 transition-transform"
                aria-label={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                <Heart 
                  size={18} 
                  className={isWishlisted ? "fill-red-500 text-red-500" : "text-earth-600"} 
                />
              </button>
              
              {/* Hover overlay with quick actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsQuickViewOpen(true);
                  }}
                  className="p-3 bg-white rounded-full hover:scale-110 transition-transform shadow-lg"
                  aria-label="Aperçu rapide"
                >
                  <Eye size={20} className="text-earth-800" />
                </button>
              </div>
            </div>
          </Link>
          
          <div className="p-5">
            <Link href={`/produits/${id}`}>
              <h3 className="font-serif text-lg font-semibold text-earth-800 hover:text-peach transition-colors line-clamp-2">
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
      </AnimatedCard>

      <QuickView
        product={productData}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}