// app/admin/products/page.tsx
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { parseImages, formatPrice } from "@/lib/utils";
import DeleteButton from "@/components/DeleteButton";
import Pagination from "@/components/Pagination";
import { ProductsGridSkeleton } from "@/components/Skeleton";
import { Suspense } from "react";

export const metadata = { title: "Gestion des produits" };

// We'll make this a server component and read searchParams
export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");
  const limit = 10;
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
    <div className="px-2 sm:px-4 md:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-800">
          Produits
        </h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-earth-700 text-white rounded-full text-sm font-medium hover:bg-earth-800 transition-colors"
        >
          <Plus size={18} />
          Nouveau produit
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-earth-500 mb-4">Aucun produit pour le moment.</p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-earth-700 text-white rounded-full text-sm font-medium hover:bg-earth-800 transition-colors"
          >
            <Plus size={18} />
            Créer votre premier produit
          </Link>
        </div>
      ) : (
        <>
          <div className="hidden sm:block bg-white rounded-2xl border border-earth-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-cream-100 text-earth-700">
                <tr>
                  <th className="text-left p-4 font-medium">Image</th>
                  <th className="text-left p-4 font-medium">Titre</th>
                  <th className="text-left p-4 font-medium hidden sm:table-cell">Catégorie</th>
                  <th className="text-left p-4 font-medium">Prix</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell">Stock</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-100">
                {products.map((product) => {
                  const images = parseImages(product.images);
                  return (
                    <tr key={product.id} className="hover:bg-cream-50">
                      <td className="p-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-cream-100">
                          <Image
                            src={images[0] || "/placeholder.svg"}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-4 font-medium text-earth-800">{product.title}</td>
                      <td className="p-4 text-earth-600 hidden sm:table-cell">{product.category || "—"}</td>
                      <td className="p-4 text-earth-700">{formatPrice(product.price)}</td>
                      <td className="p-4 hidden md:table-cell">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            product.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.inStock ? "En stock" : "Rupture"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-2 text-earth-600 hover:text-earth-800 hover:bg-cream-200 rounded-lg transition-colors"
                          >
                            <Pencil size={16} />
                          </Link>
                          <DeleteButton endpoint={`/api/products/${product.id}`} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards – also paginated */}
          <div className="sm:hidden space-y-4">
            {products.map((product) => {
              const images = parseImages(product.images);
              return (
                <div key={product.id} className="bg-white rounded-2xl p-4 border border-earth-100 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-cream-100 shrink-0">
                      <Image
                        src={images[0] || "/placeholder.svg"}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-earth-800 truncate">{product.title}</h3>
                      <p className="text-sm text-earth-600">{product.category || "Sans catégorie"}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-semibold text-earth-700">{formatPrice(product.price)}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            product.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.inStock ? "En stock" : "Rupture"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-2 text-earth-600 hover:text-earth-800 hover:bg-cream-200 rounded-lg transition-colors"
                      >
                        <Pencil size={16} />
                      </Link>
                      <DeleteButton endpoint={`/api/products/${product.id}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}