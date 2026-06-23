import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { parseImages, formatPrice } from "@/lib/utils";
import DeleteButton from "@/components/DeleteButton";

export const metadata = { title: "Gestion des produits" };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold text-earth-800">Produits</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-earth-700 text-white rounded-full text-sm font-medium hover:bg-earth-800 transition-colors"
        >
          <Plus size={18} />
          Nouveau produit
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-earth-500">Aucun produit. Créez votre premier produit.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-earth-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 text-earth-700">
              <tr>
                <th className="text-left p-4 font-medium">Image</th>
                <th className="text-left p-4 font-medium">Titre</th>
                <th className="text-left p-4 font-medium hidden sm:table-cell">Catégorie</th>
                <th className="text-left p-4 font-medium">Prix</th>
                <th className="text-left p-4 font-medium hidden sm:table-cell">Stock</th>
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
                    <td className="p-4 hidden sm:table-cell">
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
      )}
    </div>
  );
}
