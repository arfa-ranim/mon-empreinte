// src/components/Pagination.tsx
"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string; // optional, defaults to current path
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

  // Build URL with page parameter
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${base}?${params.toString()}`;
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const delta = 2; // show 2 pages before and after current
    const range = [];
    const rangeWithDots = [];
    let l;

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
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className={`flex items-center justify-center gap-1 sm:gap-2 mt-8 ${className}`}>
      {/* Previous */}
      <Link
        href={createPageUrl(Math.max(1, currentPage - 1))}
        className={`p-2 rounded-lg border border-earth-200 hover:bg-cream-50 transition-colors ${
          currentPage === 1 ? "opacity-50 pointer-events-none" : ""
        }`}
        aria-label="Page précédente"
      >
        <ChevronLeft size={18} />
      </Link>

      {/* Page numbers */}
      {getPageNumbers().map((page, index) =>
        typeof page === "number" ? (
          <Link
            key={index}
            href={createPageUrl(page)}
            className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg border transition-colors text-sm font-medium ${
              page === currentPage
                ? "bg-peach text-earth-900 border-peach shadow-soft"
                : "border-earth-200 hover:bg-cream-50"
            }`}
          >
            {page}
          </Link>
        ) : (
          <span key={index} className="px-2 text-earth-400">
            …
          </span>
        )
      )}

      {/* Next */}
      <Link
        href={createPageUrl(Math.min(totalPages, currentPage + 1))}
        className={`p-2 rounded-lg border border-earth-200 hover:bg-cream-50 transition-colors ${
          currentPage === totalPages ? "opacity-50 pointer-events-none" : ""
        }`}
        aria-label="Page suivante"
      >
        <ChevronRight size={18} />
      </Link>
    </nav>
  );
}