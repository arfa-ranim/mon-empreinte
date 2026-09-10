"use client";

import { useState } from "react";
import Image from "next/image";
import { MessageCircle, Heart, Share2, Maximize2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/Button";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useWishlist } from "@/hooks/useWishlist";
import { toast } from "sonner";
import { buildWhatsAppUrl, productOrderMessage } from "@/lib/whatsapp";
import { WHATSAPP_NUMBER } from "@/lib/constants";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string;
  category: string | null;
  inStock: boolean;
  sku: string | null;
}

interface ProductDetailClientProps {
  product: Product;
  images: string[];
}

// ✅ Absolute URL builder — uses env when available, falls back to origin
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "";

function buildAbsoluteUrl(path: string): string {
  const base =
    SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}${path}`;
}

export default function ProductDetailClient({
  product,
  images,
}: ProductDetailClientProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const lightboxSlides = images.map((img: string) => ({ src: img }));

  // ✅ Full absolute URL used both in copy and WhatsApp
  const productUrl = buildAbsoluteUrl(`/produits/${product.id}`);
  const whatsappUrl = buildWhatsAppUrl(
    WHATSAPP_NUMBER,
    productOrderMessage(product.title, product.price, productUrl)
  );

  // ✅ Robust copy with fallback for non-secure contexts
  const handleCopyLink = async () => {
    const url = buildAbsoluteUrl(`/produits/${product.id}`);

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        toast.success("🔗 Lien copié dans le presse-papier !");
        return;
      }
    } catch {
      // fall through to fallback
    }

    try {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      toast.success("🔗 Lien copié dans le presse-papier !");
    } catch {
      toast.error("Impossible de copier le lien");
    }
  };

  const handleShare = async () => {
    const url = buildAbsoluteUrl(`/produits/${product.id}`);

    // Native share sheet on mobile
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Découvrez ${product.title} sur Mon Empreinte !`,
          url,
        });
        return;
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        // Otherwise fall through to copy
      }
    }

    await handleCopyLink();
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product.id);
    toast.success(
      isWishlisted
        ? "Retiré de vos favoris"
        : "Ajouté à vos favoris"
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Image gallery */}
      <div className="space-y-4">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream-100 dark:bg-earth-800 group">
          <Image
            src={images[currentImageIndex] || "/placeholder.svg"}
            alt={product.title}
            fill
            priority
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmMGU4Ii8+PC9zdmc+"
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="absolute bottom-4 right-4 p-3 bg-white/90 dark:bg-earth-800/90 rounded-full shadow-lg hover:scale-110 transition-transform"
            aria-label="Agrandir l'image"
          >
            <Maximize2 size={20} className="text-earth-800 dark:text-earth-200" />
          </button>
        </div>

        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {images.map((img, i) => (
              <button
                key={img}
                onClick={() => setCurrentImageIndex(i)}
                className={`relative aspect-square rounded-lg overflow-hidden bg-cream-100 dark:bg-earth-800 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark ${
                  i === currentImageIndex
                    ? "ring-2 ring-peach-dark"
                    : "hover:ring-2 hover:ring-peach"
                }`}
                aria-label={`Voir l'image ${i + 1}`}
                aria-current={i === currentImageIndex}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="100px"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmMGU4Ii8+PC9zdmc+"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product info */}
      <div>
        {product.category && (
          <span className="text-sm text-earth-500 dark:text-earth-400 uppercase tracking-wider">
            {product.category}
          </span>
        )}
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-earth-800 dark:text-earth-200 mt-2">
          {product.title}
        </h1>
        <p className="mt-4 text-2xl font-semibold text-earth-700 dark:text-earth-300">
          {formatPrice(product.price)}
        </p>

        {!product.inStock && (
          <span className="inline-block mt-2 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-3 py-1 rounded-full">
            Rupture de stock
          </span>
        )}

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleWishlistToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2 ${
              isWishlisted
                ? "bg-red-50 dark:bg-red-900/30 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50"
                : "bg-cream-100 dark:bg-earth-800 text-earth-700 dark:text-earth-300 hover:bg-cream-200 dark:hover:bg-earth-700"
            }`}
            aria-label={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart size={20} className={isWishlisted ? "fill-red-500" : ""} />
            <span className="text-sm">
              {isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
            </span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-cream-100 dark:bg-earth-800 text-earth-700 dark:text-earth-300 rounded-full hover:bg-cream-200 dark:hover:bg-earth-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2"
            aria-label="Partager"
          >
            <Share2 size={20} />
            <span className="text-sm">Partager</span>
          </button>
        </div>

        <div className="mt-8">
          <h3 className="font-semibold text-earth-800 dark:text-earth-200 mb-3">Description</h3>
          <p className="text-earth-600 dark:text-earth-400 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>

        {product.sku && (
          <div className="mt-4 text-sm text-earth-500 dark:text-earth-400">
            Référence: {product.sku}
          </div>
        )}

        <div className="mt-8 space-y-3">
          <Button
            href={whatsappUrl}
            variant="whatsapp"
            external
            className="w-full text-base py-4"
          >
            <MessageCircle size={20} />
            Commander via WhatsApp
          </Button>
        </div>
      </div>

      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        slides={lightboxSlides}
        index={currentImageIndex}
      />
    </div>
  );
}