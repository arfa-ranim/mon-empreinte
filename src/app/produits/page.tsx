import PublicLayout from "@/components/PublicLayout";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { ProductsGridSkeleton } from "@/components/Skeleton";
import { Suspense } from "react";
import EmptyState from "@/components/EmptyState";
import { ProductIcon } from "@/components/icons/EmptyIcons";

export const revalidate = 60;
export const metadata = { title: "Produits" };

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");
  const limit = 12;
  const skip = (currentPage - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.product.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

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
            <EmptyState
              title="Aucun produit disponible"
              description="Revenez bientôt pour découvrir nos nouvelles créations artisanales."
              icon={<ProductIcon size={80} />}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            </>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}