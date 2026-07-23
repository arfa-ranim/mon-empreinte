"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/EmptyState";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string;
  category: string | null;
  inStock: boolean;
}

interface WishlistContentProps {
  initialProducts: Product[];
}

export default function WishlistContent({ initialProducts }: WishlistContentProps) {
  const { wishlist, clearWishlist } = useWishlist();
  const [mounted, setMounted] = useState(false);
  const isMountedRef = useRef(false);

  // Use a ref to avoid the ESLint warning
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      setMounted(true);
    }
  }, []);

  // During SSR, show loading state
  if (!mounted) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-earth-800">
              Mes favoris
            </h1>
            <p className="text-earth-500 mt-1">Chargement...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Show loading skeletons */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-cream-100 dark:bg-earth-800 rounded-2xl aspect-square"></div>
              <div className="mt-4 h-6 bg-cream-100 dark:bg-earth-800 rounded w-3/4"></div>
              <div className="mt-2 h-5 bg-cream-100 dark:bg-earth-800 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Filter products to only those in the wishlist
  const products = initialProducts.filter((product) => wishlist.includes(product.id));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-earth-800">
            Mes favoris
          </h1>
          <p className="text-earth-500 mt-1">
            {products.length} produit{products.length > 1 ? "s" : ""} dans vos favoris
          </p>
        </div>
        {products.length > 0 && (
          <button
            onClick={clearWishlist}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 size={16} />
            Tout supprimer
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <EmptyState
          title="Aucun favori"
          description="Commencez à ajouter des produits que vous aimez en cliquant sur le cœur ❤️"
          icon={<Heart size={80} className="text-peach" />}
          actionLabel="Découvrir nos produits"
          actionHref="/produits"
          actionVariant="primary"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} {...product} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}