"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  "Tous",
  "Accessoires",
  "Bijoux",
  "Décoration",
  "Textile",
  "Bougies",
  "Sac",
  "Art mural",
  "Vêtements",
];

interface Filters {
  category?: string;
  search?: string;
  maxPrice?: number;
}

interface ProductFiltersProps {
  onFilterChange?: (filters: Filters) => void;
}

export default function ProductFilters({ onFilterChange }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "Tous"
  );
  // canonical value from URL (used for comparison)
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  // local input value (debounced before pushing to URL)
  const [localSearch, setLocalSearch] = useState(
    searchParams.get("search") || ""
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);

  const handleFilterChange = useCallback(
    (key: string, value: string | number) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value && value !== "Tous") {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }

      params.set("page", "1");
      router.push(`/produits?${params.toString()}`);

      onFilterChange?.({ [key]: value });
    },
    [router, searchParams, onFilterChange]
  );

  // Debounced search — only pushes to the URL 300ms after the user stops typing
  useEffect(() => {
    const t = setTimeout(() => {
      if (localSearch !== searchQuery) {
        setSearchQuery(localSearch);
        handleFilterChange("search", localSearch);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [localSearch, searchQuery, handleFilterChange]);

  const clearFilters = () => {
    setSelectedCategory("Tous");
    setSearchQuery("");
    setLocalSearch("");
    setPriceRange([0, 200]);
    router.push("/produits");
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 p-4 bg-peach rounded-full shadow-lg text-earth-900 hover:scale-105 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2"
        aria-label="Ouvrir les filtres"
      >
        <SlidersHorizontal size={24} />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-earth-900/50 backdrop-blur-sm z-50 lg:hidden"
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed right-0 top-0 h-full w-80 max-w-[90vw] bg-white dark:bg-earth-900 z-50 lg:hidden p-6 overflow-y-auto shadow-elevation-4"
              role="dialog"
              aria-modal="true"
              aria-label="Filtres"
            >
              <button
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-cream-50 dark:hover:bg-earth-800 rounded-lg text-earth-700 dark:text-earth-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2"
                aria-label="Fermer les filtres"
              >
                <X size={24} />
              </button>

              <h3 className="font-serif text-xl font-semibold text-earth-800 dark:text-earth-200 mb-6">
                Filtres
              </h3>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label
                    htmlFor="mobile-search"
                    className="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-2"
                  >
                    Rechercher
                  </label>
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400"
                      size={18}
                    />
                    <input
                      id="mobile-search"
                      type="text"
                      value={localSearch}
                      onChange={(e) => setLocalSearch(e.target.value)}
                      placeholder="Rechercher un produit..."
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-earth-200 dark:border-earth-700 focus:ring-2 focus:ring-peach focus:border-transparent dark:bg-earth-800 dark:text-earth-200 dark:placeholder:text-earth-500"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <span className="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-2">
                    Catégories
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          handleFilterChange("category", cat);
                        }}
                        className={`px-4 py-2 rounded-full text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2 ${
                          selectedCategory === cat
                            ? "bg-peach text-earth-900 font-medium shadow-soft"
                            : "bg-cream-100 dark:bg-earth-800 text-earth-600 dark:text-earth-400 hover:bg-cream-200 dark:hover:bg-earth-700"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label
                    htmlFor="mobile-price"
                    className="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-2"
                  >
                    Prix maximum : {priceRange[1]} DT
                  </label>
                  <input
                    id="mobile-price"
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[1]}
                    onChange={(e) => {
                      const newMax = parseInt(e.target.value);
                      setPriceRange([0, newMax]);
                      handleFilterChange("maxPrice", newMax);
                    }}
                    className="w-full accent-peach focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2"
                  />
                </div>

                <button
                  onClick={clearFilters}
                  className="w-full py-3 bg-earth-100 dark:bg-earth-800 text-earth-700 dark:text-earth-300 rounded-lg hover:bg-earth-200 dark:hover:bg-earth-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop filters */}
      <div className="hidden lg:block sticky top-24">
        <div className="bg-white dark:bg-earth-900 rounded-2xl p-6 border border-earth-100 dark:border-earth-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-semibold text-earth-800 dark:text-earth-200">
              Filtres
            </h3>
            <button
              onClick={clearFilters}
              className="text-sm text-earth-500 dark:text-earth-400 hover:text-earth-700 dark:hover:text-earth-200 transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2"
            >
              Réinitialiser
            </button>
          </div>

          {/* Search */}
          <div>
            <label
              htmlFor="desktop-search"
              className="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-2"
            >
              Rechercher
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400"
                size={18}
              />
              <input
                id="desktop-search"
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Rechercher un produit..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-earth-200 dark:border-earth-700 focus:ring-2 focus:ring-peach focus:border-transparent dark:bg-earth-800 dark:text-earth-200 dark:placeholder:text-earth-500"
              />
            </div>
          </div>

          {/* Categories */}
          <div>
            <span className="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-2">
              Catégories
            </span>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    handleFilterChange("category", cat);
                  }}
                  className={`px-4 py-2 rounded-full text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2 ${
                    selectedCategory === cat
                      ? "bg-peach text-earth-900 font-medium shadow-soft"
                      : "bg-cream-100 dark:bg-earth-800 text-earth-600 dark:text-earth-400 hover:bg-cream-200 dark:hover:bg-earth-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label
              htmlFor="desktop-price"
              className="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-2"
            >
              Prix maximum : {priceRange[1]} DT
            </label>
            <input
              id="desktop-price"
              type="range"
              min="0"
              max="200"
              value={priceRange[1]}
              onChange={(e) => {
                const newMax = parseInt(e.target.value);
                setPriceRange([0, newMax]);
                handleFilterChange("maxPrice", newMax);
              }}
              className="w-full accent-peach focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2"
            />
          </div>
        </div>
      </div>
    </>
  );
}