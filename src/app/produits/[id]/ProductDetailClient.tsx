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

// Define types
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
  whatsappUrl: string;
}

export default function ProductDetailClient({ 
  product, 
  images, 
  whatsappUrl 
}: ProductDetailClientProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const lightboxSlides = images.map((img: string) => ({ src: img }));

  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: `Découvrez ${product.title} sur Mon Empreinte !`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    // Check if Web Share API is available (mobile)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Share failed:", error);
          // Fallback to clipboard
          await handleCopyLink();
        }
      }
    } else {
      // Desktop fallback - copy to clipboard
      await handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("🔗 Lien copié dans le presse-papier !");
    } catch {
      toast.error("Impossible de copier le lien");
    }
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product.id);
    toast.success(
      isWishlisted 
        ? "❤️ Retiré de vos favoris" 
        : "❤️ Ajouté à vos favoris"
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Image gallery */}
      <div className="space-y-4">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream-100 group">
          <Image
            src={images[0] || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="absolute bottom-4 right-4 p-3 bg-white/90 rounded-full shadow-lg hover:scale-110 transition-transform"
            aria-label="Agrandir l'image"
          >
            <Maximize2 size={20} className="text-earth-800" />
          </button>
        </div>
        
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {images.slice(1).map((img: string, i: number) => (
              <button
                key={img}
                onClick={() => setCurrentImageIndex(i + 1)}
                className="relative aspect-square rounded-lg overflow-hidden bg-cream-100 hover:ring-2 hover:ring-peach transition-all"
                aria-label={`Voir l'image ${i + 2}`}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="100px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product info */}
      <div>
        {product.category && (
          <span className="text-sm text-earth-500 uppercase tracking-wider">
            {product.category}
          </span>
        )}
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-earth-800 mt-2">
          {product.title}
        </h1>
        <p className="mt-4 text-2xl font-semibold text-earth-700">
          {formatPrice(product.price)}
        </p>
        
        {!product.inStock && (
          <span className="inline-block mt-2 text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full">
            Rupture de stock
          </span>
        )}

        {/* Action Buttons - Favorites & Share */}
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleWishlistToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              isWishlisted
                ? "bg-red-50 text-red-500 hover:bg-red-100"
                : "bg-cream-100 text-earth-700 hover:bg-cream-200"
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
            className="flex items-center gap-2 px-4 py-2 bg-cream-100 text-earth-700 rounded-full hover:bg-cream-200 transition-colors"
            aria-label="Partager"
          >
            <Share2 size={20} />
            <span className="text-sm">Partager</span>
          </button>
        </div>

        <div className="mt-8">
          <h3 className="font-semibold text-earth-800 mb-3">Description</h3>
          <p className="text-earth-600 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>

        {product.sku && (
          <div className="mt-4 text-sm text-earth-500">
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

      {/* Lightbox */}
      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        slides={lightboxSlides}
        index={currentImageIndex}
      />
    </div>
  );
}