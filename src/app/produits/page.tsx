import PublicLayout from "@/components/PublicLayout";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import EmptyState from "@/components/EmptyState";
import { ProductIcon } from "@/components/icons/EmptyIcons";
import ProductFilters from "@/components/ProductFilters";
import StaggeredGrid from "@/components/StaggeredGrid";

export const revalidate = 60;
export const metadata = { title: "Produits" };

// Define search params type
interface SearchParams {
  page?: string;
  category?: string;
  search?: string;
  maxPrice?: string;
}

// Define where clause type
interface WhereClause {
  category?: string;
  price?: { lte: number };
  OR?: Array<{ [key: string]: { contains: string; mode: string } }>;
}

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1");
  const limit = 12;
  const skip = (currentPage - 1) * limit;

  // Build where clause with proper typing
  const where: WhereClause = {};
  
  if (params.category && params.category !== "Tous") {
    where.category = params.category;
  }
  
  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }
  
  if (params.maxPrice) {
    where.price = { lte: parseFloat(params.maxPrice) };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
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

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters sidebar */}
            <div className="lg:col-span-1">
              <ProductFilters />
            </div>

            {/* Products grid */}
            <div className="lg:col-span-3">
              {products.length === 0 ? (
                <EmptyState
                  title="Aucun produit trouvé"
                  description="Essayez de modifier vos filtres ou revenez plus tard."
                  icon={<ProductIcon size={80} />}
                />
              ) : (
                <>
                  <div className="text-sm text-earth-500 mb-4">
                    {total} produit{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}
                  </div>
                  <StaggeredGrid columns={3}>
                    {products.map((product, index) => (
                      <ProductCard key={product.id} {...product} index={index} />
                    ))}
                  </StaggeredGrid>
                  <Pagination currentPage={currentPage} totalPages={totalPages} />
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}