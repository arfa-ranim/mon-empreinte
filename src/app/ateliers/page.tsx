import PublicLayout from "@/components/PublicLayout";
import { prisma } from "@/lib/prisma";
import WorkshopCard from "@/components/WorkshopCard";
import Pagination from "@/components/Pagination";
import { WorkshopsListSkeleton } from "@/components/Skeleton";
import { Suspense } from "react";
import EmptyState from "@/components/EmptyState";
import { WorkshopIcon } from "@/components/icons/EmptyIcons";

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata = { title: "Ateliers" };

export default async function AteliersPage({
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
      orderBy: { date: "asc" },
      skip,
      take: limit,
    }),
    prisma.workshop.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <PublicLayout>
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl font-bold text-earth-800">Nos Ateliers</h1>
            <p className="mt-3 text-earth-600 max-w-xl mx-auto">
              Participez à nos ateliers créatifs et repartez avec votre propre création artisanale.
            </p>
          </div>

          {workshops.length === 0 ? (
            <EmptyState
              title="Aucun atelier programmé"
              description="Nous proposons régulièrement de nouveaux ateliers. Revenez bientôt !"
              icon={<WorkshopIcon size={80} />}
            />
          ) : (
            <>
              <div className="space-y-6">
                {workshops.map((workshop) => (
                  <WorkshopCard
                    key={workshop.id}
                    {...workshop}
                    date={workshop.date?.toISOString() || null}
                  />
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