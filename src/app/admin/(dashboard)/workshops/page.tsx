// app/admin/workshops/page.tsx
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { parseImages, formatPrice } from "@/lib/utils";
import DeleteButton from "@/components/DeleteButton";
import Pagination from "@/components/Pagination";

export const metadata = { title: "Gestion des ateliers" };

export default async function AdminWorkshopsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");
  const limit = 10;
  const skip = (currentPage - 1) * limit;

  const [workshops, total] = await Promise.all([
    prisma.workshop.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.workshop.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="px-2 sm:px-4 md:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-800">
          Ateliers
        </h1>
        <Link
          href="/admin/workshops/new"
          className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-earth-700 text-white rounded-full text-sm font-medium hover:bg-earth-800 transition-colors"
        >
          <Plus size={18} />
          Nouvel atelier
        </Link>
      </div>

      {workshops.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-earth-500 mb-4">Aucun atelier pour le moment.</p>
          <Link
            href="/admin/workshops/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-earth-700 text-white rounded-full text-sm font-medium hover:bg-earth-800 transition-colors"
          >
            <Plus size={18} />
            Créer votre premier atelier
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-earth-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-cream-100 text-earth-700">
                <tr>
                  <th className="text-left p-4 font-medium">Image</th>
                  <th className="text-left p-4 font-medium">Titre</th>
                  <th className="text-left p-4 font-medium hidden sm:table-cell">Durée</th>
                  <th className="text-left p-4 font-medium">Prix</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-100">
                {workshops.map((workshop) => {
                  const images = parseImages(workshop.images);
                  return (
                    <tr key={workshop.id} className="hover:bg-cream-50">
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
                      <td className="p-4 font-medium text-earth-800">{workshop.title}</td>
                      <td className="p-4 text-earth-600 hidden sm:table-cell">{workshop.duration}</td>
                      <td className="p-4 text-earth-700">{formatPrice(workshop.price)}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/workshops/${workshop.id}/edit`}
                            className="p-2 text-earth-600 hover:text-earth-800 hover:bg-cream-200 rounded-lg transition-colors"
                          >
                            <Pencil size={16} />
                          </Link>
                          <DeleteButton endpoint={`/api/workshops/${workshop.id}`} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}