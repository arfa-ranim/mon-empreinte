import PublicLayout from "@/components/PublicLayout";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export const metadata = { title: "Produits" };

export default async function ProduitsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <PublicLayout>
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl font-bold text-earth-800">Nos Produits</h1>
            <p className="mt-3 text-earth-600 max-w-xl mx-auto">
              Chaque pièce est unique, fabriquée à la main avec amour et attention aux détails.
            </p>
          </div>

          {products.length === 0 ? (
            <p className="text-center text-earth-500 py-20">Aucun produit pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
