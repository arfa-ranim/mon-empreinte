"use client";

import { useState, useEffect, useRef } from "react";
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
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // ✅ Reset image when the modal opens — "adjust state during render"
  // pattern (React-recommended, avoids setState-in-effect).
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen && currentImage !== 0) {
      setCurrentImage(0);
    }
  }

  // Build the WhatsApp URL with the correct product URL
  const productUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/produits/${product.id}`
      : "";
  const whatsappUrl = buildWhatsAppUrl(
    WHATSAPP_NUMBER,
    productOrderMessage(product.title, product.price, productUrl)
  );

  // Escape key + focus trap + body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    // Focus the close button on open
    const t = setTimeout(() => closeButtonRef.current?.focus(), 50);

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "unset";
      clearTimeout(t);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, onClose]);

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
            className="fixed inset-0 bg-earth-900/50 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Aperçu de ${product.title}`}
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-3 sm:inset-6 md:inset-10 z-50 bg-white dark:bg-earth-900 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-elevation-4"
          >
            {/* Close button */}
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="absolute top-3 right-3 z-10 p-2.5 bg-white/95 dark:bg-earth-800/95 hover:bg-white dark:hover:bg-earth-700 rounded-full shadow-lg transition-colors text-earth-700 dark:text-earth-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2"
              aria-label="Fermer"
            >
              <X size={20} />
            </button>

            {/* Image section */}
            <div className="md:w-1/2 bg-cream-50 dark:bg-earth-800/50 p-4 sm:p-6 flex items-center justify-center relative min-h-[40vh] md:min-h-0">
              <div className="relative w-full aspect-square max-h-[50vh] md:max-h-full">
                <Image
                  src={images[currentImage] || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark ${
                        i === currentImage
                          ? "border-peach-dark"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                      aria-label={`Voir l'image ${i + 1}`}
                      aria-current={i === currentImage}
                    >
                      <Image
                        src={img}
                        alt=""
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content section */}
            <div className="md:w-1/2 p-5 sm:p-6 md:p-8 overflow-y-auto flex flex-col">
              {product.category && (
                <span className="text-xs text-earth-500 dark:text-earth-400 uppercase tracking-wider font-semibold">
                  {product.category}
                </span>
              )}

              <h2 className="font-serif text-2xl md:text-3xl font-bold text-earth-800 dark:text-earth-200 mt-2">
                {product.title}
              </h2>

              <p className="text-2xl font-semibold text-earth-700 dark:text-earth-300 mt-2">
                {formatPrice(product.price)}
              </p>

              {!product.inStock && (
                <span className="status-chip status-chip--unavailable mt-2 w-fit">
                  <X size={12} strokeWidth={3} /> Épuisé
                </span>
              )}

              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  className="p-2 hover:bg-cream-100 dark:hover:bg-earth-800 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark"
                  aria-label="Ajouter aux favoris"
                >
                  <Heart size={22} className="text-earth-500 dark:text-earth-400" />
                </button>
                <button
                  type="button"
                  className="p-2 hover:bg-cream-100 dark:hover:bg-earth-800 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark"
                  aria-label="Partager"
                >
                  <Share2 size={22} className="text-earth-500 dark:text-earth-400" />
                </button>
              </div>

              <div className="mt-6 flex-1">
                <h3 className="font-medium text-earth-800 dark:text-earth-200 mb-2">
                  Description
                </h3>
                <p className="text-earth-600 dark:text-earth-400 leading-relaxed whitespace-pre-line text-sm">
                  {product.description}
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  href={`/produits/${product.id}`}
                  variant="secondary"
                  className="w-full"
                >
                  Voir le détail
                </Button>
                <Button
                  href={whatsappUrl}
                  variant="whatsapp"
                  external
                  className="w-full"
                >
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