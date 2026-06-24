import PublicLayout from "@/components/PublicLayout";
import { prisma } from "@/lib/prisma";
import { getBrandSettings } from "@/lib/settings";
import Button from "@/components/Button";
import ProductCard from "@/components/ProductCard";
import WorkshopCard from "@/components/WorkshopCard";
import Logo from "@/components/Logo";
import Link from "next/link";
import { InstagramIcon } from "@/components/SocialIcons";

export const revalidate = 60; 

export default async function HomePage() {
  const [products, workshops, settings] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.workshop.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
    getBrandSettings(),
  ]);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-cream-100 to-cream-50 py-20 sm:py-28 overflow-hidden">
        <div className="floating-shape peach w-48 h-48 top-10 -left-20"></div>
        <div className="floating-shape mint w-64 h-64 bottom-10 -right-20"></div>
        <div className="floating-shape lavender w-32 h-32 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 animate-fade-in">
          <div className="flex justify-center mb-6">
            <Logo size={120} showText={false} logoUrl={settings.logo} />
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-earth-800">
            {settings.brandName}
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-earth-600 max-w-2xl mx-auto leading-relaxed">
            {settings.tagline}
          </p>
          <p className="mt-3 text-earth-500 max-w-xl mx-auto">
            {settings.description}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/produits" variant="primary">
              Nos Produits
            </Button>
            <Button href="/ateliers" variant="outline">
              Nos Ateliers
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4">
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
        <div className="max-w-6xl mx-auto px-4">
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
                date={workshop.date?.toISOString() || null} // <-- convert Date to string
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

      {/* Instagram */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-earth-800 mb-4">
            Suivez-nous sur Instagram
          </h2>
          <p className="text-earth-600 mb-8">
            Découvrez nos coulisses, nos créations et l&apos;ambiance de nos ateliers
          </p>
          <Link
            href={settings.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-earth-700 hover:text-peach font-medium transition-colors"
          >
            <InstagramIcon size={24} />
            @{settings.instagram.split('/').pop() || "mon.empreinte.tn"}
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}