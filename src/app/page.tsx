import PublicLayout from "@/components/PublicLayout";
import { prisma } from "@/lib/prisma";
import { getBrandSettings } from "@/lib/settings";
import Button from "@/components/Button";
import ProductCard from "@/components/ProductCard";
import WorkshopCard from "@/components/WorkshopCard";
import Link from "next/link";
import { InstagramIcon } from "@/components/SocialIcons";
import HeroSection from "@/components/sections/HeroSection";
import UpcomingWorkshops from "@/components/sections/UpcomingWorkshops";
import TwoPathSection from "@/components/sections/TwoPathSection";
import { ProductsGridSkeleton, WorkshopsListSkeleton } from "@/components/Skeleton";
import { Suspense } from "react";

export const revalidate = 60;

export default async function HomePage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const [products, workshops, upcomingWorkshopsRaw, settings] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.workshop.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.workshop.findMany({
      where: {
        startDate: { gte: today, lte: nextWeek },
        status: { not: "cancelled" },
      },
      orderBy: { startDate: "asc" },
      take: 3,
    }),
    getBrandSettings(),
  ]);

  return (
    <PublicLayout>
      {/* ✅ Hero — FULL WIDTH, no container */}
      <HeroSection settings={settings} />

      {/* ✅ Two-path section — the brand's dual identity */}
      <TwoPathSection />

      {/* ✅ Everything below — inside container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="h-64 skeleton-shimmer rounded-2xl mx-4" />}>
          <UpcomingWorkshops
            workshops={upcomingWorkshopsRaw.map((w) => ({
              ...w,
              date: (w.startDate || w.date)?.toISOString() || null,
            }))}
          />
        </Suspense>

        {/* Featured Products */}
        <section className="py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-earth-800 dark:text-earth-200">
              Nos Créations
            </h2>
            <p className="mt-3 text-earth-600 dark:text-earth-400">
              Découvrez nos dernières pièces artisanales
            </p>
          </div>
          <Suspense fallback={<ProductsGridSkeleton />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </Suspense>
          {products.length > 0 && (
            <div className="text-center mt-10">
              <Button href="/produits" variant="secondary">
                Voir tous les produits
              </Button>
            </div>
          )}
        </section>

        {/* Featured Workshops */}
        <section className="py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-earth-800 dark:text-earth-200">
              Nos Ateliers
            </h2>
            <p className="mt-3 text-earth-600 dark:text-earth-400">
              Venez créer avec nous lors de nos ateliers créatifs
            </p>
          </div>
          <Suspense fallback={<WorkshopsListSkeleton />}>
            <div className="space-y-6">
              {workshops.map((workshop) => (
                <WorkshopCard
                  key={workshop.id}
                  {...workshop}
                  date={workshop.date?.toISOString() || null}
                />
              ))}
            </div>
          </Suspense>
          {workshops.length > 0 && (
            <div className="text-center mt-10">
              <Button href="/ateliers" variant="secondary">
                Voir tous les ateliers
              </Button>
            </div>
          )}
        </section>

        {/* Instagram Section */}
        <section className="py-16 sm:py-20">
          <div className="text-center">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-peach-light/30 dark:bg-peach/10 px-4 py-2 rounded-full text-sm text-earth-600 dark:text-earth-300 mb-4">
                <InstagramIcon size={18} />
                <span>Suivez-nous</span>
              </div>
              <h2 className="font-serif text-3xl font-bold text-earth-800 dark:text-earth-200 mb-4">
                Sur Instagram
              </h2>
              <p className="text-earth-600 dark:text-earth-400 mb-8 leading-relaxed">
                Découvrez nos coulisses, nos créations et l&apos;ambiance de nos ateliers
              </p>
              <Link
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-earth-700 dark:text-earth-300 hover:text-peach-dark dark:hover:text-peach font-medium transition-colors group"
              >
                <span className="w-12 h-12 rounded-full bg-peach-light/30 dark:bg-peach/10 flex items-center justify-center group-hover:bg-peach-light/50 dark:group-hover:bg-peach/20 transition-colors">
                  <InstagramIcon size={24} className="text-peach-dark dark:text-peach" />
                </span>
                <span className="text-lg">
                  @{settings.instagram.split("/").pop() || "mon.empreinte.tn"}
                </span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}