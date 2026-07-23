import PublicLayout from "@/components/PublicLayout";
import { prisma } from "@/lib/prisma";
import { getBrandSettings } from "@/lib/settings";
import Button from "@/components/Button";
import ProductCard from "@/components/ProductCard";
import WorkshopCard from "@/components/WorkshopCard";
import Link from "next/link";
import { InstagramIcon } from "@/components/SocialIcons";
import HeroSection from "@/components/sections/HeroSection";

export const revalidate = 60;

export default async function HomePage() {
  const [products, workshops, settings] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.workshop.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
    getBrandSettings(),
  ]);

  return (
    <PublicLayout>
      <HeroSection settings={settings} />

      {/* Featured Products */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-earth-800">
              Nos Créations
            </h2>
            <p className="mt-3 text-earth-600">Découvrez nos dernières pièces artisanales</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          {products.length > 0 && (
            <div className="text-center mt-10">
              <Button href="/produits" variant="secondary">
                Voir tous les produits
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Featured Workshops */}
      <section className="py-16 sm:py-20 bg-cream-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-earth-800">
              Nos Ateliers
            </h2>
            <p className="mt-3 text-earth-600">Venez créer avec nous lors de nos ateliers créatifs</p>
          </div>
          <div className="space-y-6">
            {workshops.map((workshop) => (
              <WorkshopCard
                key={workshop.id}
                {...workshop}
                date={workshop.date?.toISOString() || null}
              />
            ))}
          </div>
          {workshops.length > 0 && (
            <div className="text-center mt-10">
              <Button href="/ateliers" variant="secondary">
                Voir tous les ateliers
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-peach-light/30 px-4 py-2 rounded-full text-sm text-earth-600 mb-4">
              <InstagramIcon size={18} />
              <span>Suivez-nous</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-earth-800 mb-4">
              Sur Instagram
            </h2>
            <p className="text-earth-600 mb-8 leading-relaxed">
              Découvrez nos coulisses, nos créations et l&apos;ambiance de nos ateliers
            </p>
            <Link
              href={settings.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-earth-700 hover:text-peach font-medium transition-colors group"
            >
              <span className="w-12 h-12 rounded-full bg-peach-light/30 flex items-center justify-center group-hover:bg-peach-light/50 transition-colors">
                <InstagramIcon size={24} className="text-peach" />
              </span>
              <span className="text-lg">
                @{settings.instagram.split("/").pop() || "mon.empreinte.tn"}
              </span>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}