"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, Eye, Heart, Star, ShoppingBag, Check, X } from "lucide-react";
import { parseImages, formatPrice } from "@/lib/utils";
import { buildWhatsAppUrl, productOrderMessage } from "@/lib/whatsapp";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import Button from "./Button";
import QuickView from "./QuickView";
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
  featured?: boolean;
}

// ✅ Hydration-safe — same value on server AND client.
// Set NEXT_PUBLIC_SITE_URL in .env.local and Vercel env vars.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "";

export default function ProductCard({
  id,
  title,
  price,
  images,
  category,
  index = 0,
  description = "",
  inStock = true,
  featured = false,
}: ProductCardProps) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(id);

  const imageList = parseImages(images);
  const imageUrl = imageList[0] || "/placeholder.svg";

  // ✅ No window branch — safe during SSR
  const productUrl = `${SITE_URL}/produits/${id}`;
  const whatsappUrl = buildWhatsAppUrl(
    WHATSAPP_NUMBER,
    productOrderMessage(title, price, productUrl)
  );

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: index * 0.05,
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        whileHover={{ y: -4 }}
        className="group relative bg-white dark:bg-earth-900 rounded-2xl overflow-hidden shadow-elevation-1 hover:shadow-elevation-3 transition-shadow duration-500 border border-earth-100 dark:border-earth-800"
      >
        {featured && (
          <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-gradient-warm text-earth-900 text-xs font-medium rounded-full shadow-lg flex items-center gap-1.5">
            <Star size={12} className="fill-earth-900" />
            À la une
          </div>
        )}

        <div className="relative aspect-square overflow-hidden bg-cream-100 dark:bg-earth-800">
          {!imageLoaded && <div className="absolute inset-0 skeleton-shimmer" />}

          <Image
            src={imageUrl}
            alt={title}
            fill
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmMGU4Ii8+PC9zdmc+"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-all duration-700 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            } group-hover:scale-105`}
            onLoad={() => setImageLoaded(true)}
            priority={index < 3}
          />

          <div className="absolute inset-0 bg-linear-to-t from-earth-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {category && (
            <span className="absolute bottom-4 left-4 bg-white/95 dark:bg-earth-800/95 backdrop-blur-sm text-earth-700 dark:text-earth-300 text-xs px-3 py-1.5 rounded-full font-medium shadow-sm flex items-center gap-1.5 transition-opacity duration-300 group-hover:opacity-0">
              <span className="w-1.5 h-1.5 rounded-full bg-peach" />
              {category}
            </span>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(id);
            }}
            className={`absolute top-4 right-4 p-2.5 rounded-full shadow-md transition-all duration-300 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2 ${
              isWishlisted
                ? "bg-red-500 text-white hover:bg-red-600 scale-105"
                : "bg-white/95 dark:bg-earth-800/95 text-earth-600 dark:text-earth-400 hover:bg-white dark:hover:bg-earth-700 hover:scale-105"
            }`}
            aria-label={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart size={18} className={isWishlisted ? "fill-white" : ""} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0 group-focus-within:translate-y-0 z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              className="px-5 py-2.5 bg-white/95 dark:bg-earth-800/95 backdrop-blur-sm rounded-full text-sm font-medium text-earth-800 dark:text-earth-200 shadow-lg hover:bg-white dark:hover:bg-earth-700 transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2"
            >
              <Eye size={16} />
              Aperçu rapide
            </button>
          </div>

          <div className="absolute bottom-4 right-4">
            <span
              className={`status-chip ${
                inStock ? "status-chip--available" : "status-chip--unavailable"
              } shadow-sm`}
            >
              {inStock ? (
                <Check size={12} strokeWidth={3} />
              ) : (
                <X size={12} strokeWidth={3} />
              )}
              {inStock ? "Disponible" : "Épuisé"}
            </span>
          </div>
        </div>

        <div className="p-5 space-y-3">
          <Link
            href={`/produits/${id}`}
            className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2 rounded-md"
          >
            <h3 className="font-serif text-lg font-semibold text-earth-800 dark:text-earth-200 hover:text-peach-dark dark:hover:text-peach transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>

          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-earth-800 dark:text-earth-200">
              {formatPrice(price)}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button
              href={whatsappUrl}
              variant="whatsapp"
              external
              className="flex-1 text-sm py-2.5 group/btn"
            >
              <MessageCircle
                size={16}
                className="group-hover/btn:scale-110 transition-transform"
              />
              Commander
            </Button>

            <Link
              href={`/produits/${id}`}
              className="p-2.5 rounded-full border border-earth-200 dark:border-earth-700 text-earth-600 dark:text-earth-400 hover:bg-earth-50 dark:hover:bg-earth-800 hover:border-peach dark:hover:border-peach transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2"
              aria-label={`Voir le détail de ${title}`}
            >
              <ShoppingBag size={18} />
            </Link>
          </div>
        </div>
      </motion.div>

      <QuickView
        product={productData}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}