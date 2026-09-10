import PublicLayout from "@/components/PublicLayout";
import { prisma } from "@/lib/prisma";
import { parseImages } from "@/lib/utils";
import GalleryClient from "./GalleryClient";

export const metadata = { title: "Galerie" };

export default async function GaleriePage() {
  const [products, workshops] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.workshop.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const productItems = products.flatMap((p) =>
    parseImages(p.images).map((img) => ({
      src: img,
      alt: p.title,
      href: `/produits/${p.id}`,
      category: p.category || "Création",
    }))
  );

  const workshopItems = workshops.flatMap((w) =>
    parseImages(w.images).map((img) => ({
      src: img,
      alt: w.title,
      href: `/ateliers/${w.id}`,
      category: "Atelier",
    }))
  );

  return (
    <PublicLayout>
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl font-bold text-earth-800 dark:text-earth-200">
              Galerie
            </h1>
            <p className="mt-3 text-earth-600 dark:text-earth-400">
              Un aperçu de nos créations et de l&apos;ambiance de nos ateliers
            </p>
          </div>

          <GalleryClient
            productItems={productItems}
            workshopItems={workshopItems}
          />
        </div>
      </section>
    </PublicLayout>
  );
}