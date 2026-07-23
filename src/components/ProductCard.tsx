"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, Eye, Heart, Star, ShoppingBag } from "lucide-react";
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
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: index * 0.05,
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        whileHover={{ y: -6 }}
        className="group relative bg-white dark:bg-earth-900 rounded-2xl overflow-hidden shadow-elevation-1 hover:shadow-elevation-3 transition-all duration-500 border border-earth-100 dark:border-earth-800"
      >
        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-gradient-warm text-earth-900 text-xs font-medium rounded-full shadow-lg flex items-center gap-1.5">
            <Star size={12} className="fill-earth-900" />
            À la une
          </div>
        )}

        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-cream-100 dark:bg-earth-800">
          {/* Skeleton loader */}
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton-shimmer" />
          )}

          <Image
            src={imageUrl}
            alt={title}
            fill
            className={`object-cover transition-all duration-700 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            } group-hover:scale-110`}
            sizes="(max-width: 768px) 100vw, 33vw"
            onLoad={() => setImageLoaded(true)}
            priority={index < 3}
          />

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-linear-to-t from-earth-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Category Badge - bottom left on image */}
          {category && (
            <span className="absolute bottom-4 left-4 bg-white/95 dark:bg-earth-800/95 backdrop-blur-sm text-earth-700 dark:text-earth-300 text-xs px-3 py-1.5 rounded-full font-medium shadow-sm flex items-center gap-1.5 transition-opacity duration-300 group-hover:opacity-0">
              <span className="w-1.5 h-1.5 rounded-full bg-peach" />
              {category}
            </span>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(id);
            }}
            className={`absolute top-4 right-4 p-2.5 rounded-full shadow-md transition-all duration-300 z-10 ${
              isWishlisted
                ? "bg-red-500 text-white hover:bg-red-600 scale-110"
                : "bg-white/95 dark:bg-earth-800/95 text-earth-600 dark:text-earth-400 hover:bg-white dark:hover:bg-earth-700 hover:scale-110"
            }`}
            aria-label={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart
              size={18}
              className={isWishlisted ? "fill-white" : ""}
            />
          </button>

          {/* Quick View - appears on hover */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              className="px-5 py-2.5 bg-white/95 dark:bg-earth-800/95 backdrop-blur-sm rounded-full text-sm font-medium text-earth-800 dark:text-earth-200 shadow-lg hover:bg-white dark:hover:bg-earth-700 transition-colors flex items-center gap-2"
            >
              <Eye size={16} />
              Aperçu rapide
            </button>
          </div>

          {/* Stock status - bottom right */}
          <div className="absolute bottom-4 right-4">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium shadow-sm ${
                inStock
                  ? "bg-green-500/90 text-white"
                  : "bg-red-500/90 text-white"
              }`}
            >
              {inStock ? "En stock" : "Rupture"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <Link href={`/produits/${id}`} className="block">
            <h3 className="font-serif text-lg font-semibold text-earth-800 dark:text-earth-200 hover:text-peach dark:hover:text-peach transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>

          {/* Price with currency */}
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-earth-800 dark:text-earth-200">
              {formatPrice(price)}
            </span>
            {price > 50 && (
              <span className="text-xs text-earth-400 dark:text-earth-500 line-through">
                {formatPrice(price + 15)}
              </span>
            )}
          </div>

          {/* Rating placeholder - for visual appeal */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={`${
                    i < 4
                      ? "fill-gold text-gold"
                      : "fill-earth-200 text-earth-200 dark:fill-earth-700 dark:text-earth-700"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-earth-400 dark:text-earth-500 ml-1">
              (24 avis)
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              href={whatsappUrl}
              variant="whatsapp"
              external
              className="flex-1 text-sm py-2.5 group/btn"
            >
              <MessageCircle size={16} className="group-hover/btn:scale-110 transition-transform" />
              Commander
            </Button>

            <Link
              href={`/produits/${id}`}
              className="p-2.5 rounded-full border border-earth-200 dark:border-earth-700 text-earth-600 dark:text-earth-400 hover:bg-earth-50 dark:hover:bg-earth-800 hover:border-peach dark:hover:border-peach transition-all"
              aria-label="Voir le détail"
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