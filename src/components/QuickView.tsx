"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, MessageCircle, Heart, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { parseImages, formatPrice } from "@/lib/utils";
import { buildWhatsAppUrl, productOrderMessage } from "@/lib/whatsapp";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import Button from "./Button";

interface QuickViewProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    images: string;
    category?: string | null;
    inStock: boolean;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickView({ product, isOpen, onClose }: QuickViewProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const images = parseImages(product.images);
  const whatsappUrl = buildWhatsAppUrl(
    WHATSAPP_NUMBER,
    productOrderMessage(product.title, product.price)
  );

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-10 z-50 bg-white rounded-3xl overflow-hidden flex flex-col md:flex-row"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
            >
              <X size={24} />
            </button>

            {/* Image section */}
            <div className="md:w-1/2 bg-cream-50 p-6 flex items-center justify-center relative">
              <div className="relative w-full aspect-square max-h-[60vh] md:max-h-full">
                <Image
                  src={images[currentImage] || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                        i === currentImage ? "border-peach" : "border-transparent opacity-60"
                      }`}
                    >
                      <Image src={img} alt="" width={48} height={48} className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content section */}
            <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col">
              {product.category && (
                <span className="text-sm text-earth-500 uppercase tracking-wider">
                  {product.category}
                </span>
              )}
              
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-earth-800 mt-2">
                {product.title}
              </h2>
              
              <p className="text-2xl font-semibold text-earth-700 mt-2">
                {formatPrice(product.price)}
              </p>
              
              {!product.inStock && (
                <span className="inline-block mt-2 text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full w-fit">
                  Rupture de stock
                </span>
              )}
              
              <div className="mt-4 flex items-center gap-4">
                <button className="p-2 hover:bg-cream-50 rounded-full transition-colors">
                  <Heart size={24} className="text-earth-400 hover:text-red-500" />
                </button>
                <button className="p-2 hover:bg-cream-50 rounded-full transition-colors">
                  <Share2 size={24} className="text-earth-400" />
                </button>
              </div>

              <div className="mt-6 flex-1">
                <h3 className="font-medium text-earth-800 mb-2">Description</h3>
                <p className="text-earth-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <Button href={`/produits/${product.id}`} variant="secondary" className="w-full">
                  Voir le détail
                </Button>
                <Button href={whatsappUrl} variant="whatsapp" external className="w-full">
                  <MessageCircle size={18} />
                  Commander via WhatsApp
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}