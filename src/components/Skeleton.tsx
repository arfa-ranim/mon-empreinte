// src/components/Skeleton.tsx
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  count?: number;
}

// Base skeleton with pulse animation
export function Skeleton({ className, count = 1 }: SkeletonProps) {
  if (count > 1) {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "animate-pulse bg-cream-100 rounded-lg",
              className
            )}
          />
        ))}
      </>
    );
  }

  return (
    <div className={cn("animate-pulse bg-cream-100 rounded-lg", className)} />
  );
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="product-card group">
      <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-cream-100">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-3 left-3">
          <Skeleton className="w-20 h-6 rounded-full" />
        </div>
      </div>
      <div className="p-5 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-10 w-full rounded-full" />
      </div>
    </div>
  );
}

// Workshop Card Skeleton
export function WorkshopCardSkeleton() {
  return (
    <article className="workshop-card group flex flex-col md:flex-row">
      <div className="workshop-accent shrink-0 hidden md:block"></div>
      <div className="relative md:w-2/5 aspect-4/3 md:aspect-auto min-h-[200px] overflow-hidden bg-cream-100">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-6 md:w-3/5 flex flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-6 w-24 rounded-full hidden md:block" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
        <Skeleton className="h-10 w-48 rounded-full" />
      </div>
    </article>
  );
}

// Dashboard Stats Skeleton
export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-12 mt-2" />
              <Skeleton className="h-3 w-16 mt-1" />
            </div>
            <Skeleton className="w-12 h-12 sm:w-14 sm:h-14 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Dashboard Recent Items Skeleton
export function DashboardRecentSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="flex items-center justify-between p-2 sm:p-3">
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/3 mt-1" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Product Detail Skeleton
export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="space-y-4">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream-100">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-8 w-1/3" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-12 w-64 rounded-full" />
      </div>
    </div>
  );
}

// Products Grid Skeleton
export function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Workshops List Skeleton
export function WorkshopsListSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <WorkshopCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Loading text fallback (for simple cases)
export function LoadingText({ message = "Chargement..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-peach border-t-transparent rounded-full animate-spin" />
        <p className="text-earth-500 text-sm">{message}</p>
      </div>
    </div>
  );
}