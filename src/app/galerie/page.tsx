import PublicLayout from "@/components/PublicLayout";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { parseImages } from "@/lib/utils";

export const metadata = { title: "Galerie" };

export default async function GaleriePage() {
  const [products, workshops] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.workshop.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const galleryItems = [
    ...products.flatMap((p) =>
      parseImages(p.images).map((img) => ({ src: img, alt: p.title, type: "product" as const }))
    ),
    ...workshops.flatMap((w) =>
      parseImages(w.images).map((img) => ({ src: img, alt: w.title, type: "workshop" as const }))
    ),
  ];

  return (
    <PublicLayout>
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl font-bold text-earth-800">Galerie</h1>
            <p className="mt-3 text-earth-600">
              Un aperçu de nos créations et de l&apos;ambiance de nos ateliers
            </p>
          </div>

          {galleryItems.length === 0 ? (
            <p className="text-center text-earth-500 py-20">La galerie sera bientôt remplie.</p>
          ) : (
            <div className="masonry-grid">
              {galleryItems.map((item, i) => (
                <div
                  key={`${item.src}-${i}`}
                  className="masonry-item relative rounded-xl overflow-hidden bg-cream-100 group"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={400}
                    height={item.type === "workshop" ? 300 : 400}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-earth-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-sm font-medium">{item.alt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
