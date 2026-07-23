// src/components/Breadcrumbs.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const routeMap: Record<string, string> = {
  "produits": "Produits",
  "ateliers": "Ateliers",
  "galerie": "Galerie",
  "a-propos": "À propos",
  "contact": "Contact",
  "favoris": "Favoris",
  "admin": "Administration",
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0 || segments[0] === "admin") return null;

  return (
    <nav className="text-sm text-earth-500 dark:text-earth-400 mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 flex-wrap">
        <li>
          <Link href="/" className="hover:text-earth-700 dark:hover:text-earth-200 transition-colors">
            <Home size={16} className="inline" />
          </Link>
        </li>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const href = "/" + segments.slice(0, index + 1).join("/");
          const label = routeMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

          return (
            <li key={href} className="flex items-center gap-2">
              <ChevronRight size={14} />
              {isLast ? (
                <span className="text-earth-800 dark:text-earth-200 font-medium">{label}</span>
              ) : (
                <Link href={href} className="hover:text-earth-700 dark:hover:text-earth-200 transition-colors">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}