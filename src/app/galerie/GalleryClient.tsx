"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Palette } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import { GalleryIcon } from "@/components/icons/EmptyIcons";

interface GalleryItem {
  src: string;
  alt: string;
  href: string;
  category: string;
}

interface GalleryClientProps {
  productItems: GalleryItem[];
  workshopItems: GalleryItem[];
}

type Tab = "creations" | "ateliers";

export default function GalleryClient({
  productItems,
  workshopItems,
}: GalleryClientProps) {
  const [tab, setTab] = useState<Tab>("creations");

  const total = productItems.length + workshopItems.length;

  if (total === 0) {
    return (
      <EmptyState
        title="Galerie vide"
        description="Ajoutez des images à vos produits et ateliers pour remplir la galerie."
        icon={<GalleryIcon size={80} />}
      />
    );
  }

  const tabs: {
    id: Tab;
    label: string;
    count: number;
    icon: React.ElementType;
  }[] = [
    {
      id: "creations",
      label: "Nos créations",
      count: productItems.length,
      icon: Package,
    },
    {
      id: "ateliers",
      label: "Nos ateliers",
      count: workshopItems.length,
      icon: Palette,
    },
  ];

  const items = tab === "creations" ? productItems : workshopItems;

  return (
    <div>
      {/* Tab bar */}
      <div className="flex justify-center mb-10">
        <div
          className="inline-flex bg-cream-100 dark:bg-earth-800 rounded-full p-1.5 shadow-sm"
          role="tablist"
          aria-label="Choisir la catégorie"
        >
          {tabs.map(({ id, label, count, icon: Icon }) => {
            const isActive = tab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${id}`}
                onClick={() => setTab(id)}
                className={`relative inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2 ${
                  isActive
                    ? "text-earth-900"
                    : "text-earth-600 dark:text-earth-400 hover:text-earth-800 dark:hover:text-earth-200"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="gallery-tab-bg"
                    className="absolute inset-0 bg-peach rounded-full shadow-soft"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={16} className="relative z-10" />
                <span className="relative z-10">{label}</span>
                <span
                  className={`relative z-10 text-xs px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-earth-900/15 text-earth-900"
                      : "bg-cream-200 dark:bg-earth-700 text-earth-500 dark:text-earth-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Items */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          id={`panel-${tab}`}
          role="tabpanel"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {items.length === 0 ? (
            <EmptyState
              title={
                tab === "creations"
                  ? "Aucune création pour le moment"
                  : "Aucun atelier pour le moment"
              }
              description="Revenez bientôt pour découvrir nos nouveautés."
              icon={<GalleryIcon size={80} />}
            />
          ) : (
            <div className="masonry-grid">
              {items.map((item, i) => (
                <Link
                  key={`${item.src}-${i}`}
                  href={item.href}
                  className="masonry-item group block relative rounded-xl overflow-hidden bg-cream-100 dark:bg-earth-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={400}
                    height={tab === "ateliers" ? 300 : 400}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Overlay with title + category */}
                  <div className="absolute inset-0 bg-linear-to-t from-earth-900/70 via-earth-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <span className="text-[10px] uppercase tracking-wider text-peach-light font-semibold mb-1">
                      {item.category}
                    </span>
                    <span className="text-white text-sm font-medium line-clamp-2">
                      {item.alt}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}