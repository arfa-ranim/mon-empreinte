// src/components/Pagination.tsx
"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  className = "",
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const base = baseUrl || pathname;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${base}?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) rangeWithDots.push(l + 1);
        else if (i - l !== 1) rangeWithDots.push("...");
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const baseLinkClasses =
    "p-2 rounded-lg border border-earth-200 dark:border-earth-700 text-earth-700 dark:text-earth-300 hover:bg-cream-50 dark:hover:bg-earth-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2";

  return (
    <nav
      className={`flex items-center justify-center gap-1 sm:gap-2 mt-8 ${className}`}
      aria-label="Pagination"
    >
      <Link
        href={createPageUrl(Math.max(1, currentPage - 1))}
        className={`${baseLinkClasses} ${currentPage === 1 ? "opacity-50 pointer-events-none" : ""}`}
        aria-label="Page précédente"
        aria-disabled={currentPage === 1}
      >
        <ChevronLeft size={18} />
      </Link>

      {getPageNumbers().map((page, index) =>
        typeof page === "number" ? (
          <Link
            key={index}
            href={createPageUrl(page)}
            className={`min-w-10 h-10 flex items-center justify-center rounded-lg border transition-colors text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2 ${
              page === currentPage
                ? "bg-peach text-earth-900 border-peach shadow-soft"
                : "border-earth-200 dark:border-earth-700 text-earth-700 dark:text-earth-300 hover:bg-cream-50 dark:hover:bg-earth-800"
            }`}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Link>
        ) : (
          <span key={index} className="px-2 text-earth-400 dark:text-earth-500" aria-hidden="true">
            …
          </span>
        )
      )}

      <Link
        href={createPageUrl(Math.min(totalPages, currentPage + 1))}
        className={`${baseLinkClasses} ${currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}`}
        aria-label="Page suivante"
        aria-disabled={currentPage === totalPages}
      >
        <ChevronRight size={18} />
      </Link>
    </nav>
  );
}