import PublicLayout from "@/components/PublicLayout";
import { prisma } from "@/lib/prisma";
import WorkshopCard from "@/components/WorkshopCard";
import Pagination from "@/components/Pagination";
import EmptyState from "@/components/EmptyState";
import { WorkshopIcon } from "@/components/icons/EmptyIcons";
import { WorkshopsListSkeleton } from "@/components/Skeleton";
import WorkshopFilters from "@/components/WorkshopFilters";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = { title: "Ateliers" };

function getMonthLabel(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
}

function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export default async function AteliersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; filter?: string }>;
}) {
  const { page, filter } = await searchParams;
  const currentPage = parseInt(page || "1");
  const limit = 10;
  const skip = (currentPage - 1) * limit;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Build where clause based on filter
  const where: Record<string, unknown> = {
    startDate: { gte: today },
    status: { not: "cancelled" },
  };

  if (filter === "week") {
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    where.startDate = { gte: today, lte: nextWeek };
  } else if (filter === "month") {
    const nextMonth = new Date(today);
    nextMonth.setDate(nextMonth.getDate() + 30);
    where.startDate = { gte: today, lte: nextMonth };
  } else if (filter === "débutant" || filter === "intermédiaire" || filter === "avancé") {
    where.skillLevel = filter;
  } else if (filter === "available") {
    where.status = "available";
  }

  const [workshops, total] = await Promise.all([
    prisma.workshop.findMany({
      where,
      orderBy: { startDate: "asc" },
      skip,
      take: limit,
    }),
    prisma.workshop.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  // Group by month
  const grouped = workshops.reduce<Record<string, { label: string; items: typeof workshops }>>(
    (acc, w) => {
      const date = w.startDate || w.date;
      if (!date) {
        const key = "no-date";
        if (!acc[key]) acc[key] = { label: "Date à définir", items: [] };
        acc[key].items.push(w);
        return acc;
      }
      const d = new Date(date);
      const key = getMonthKey(d);
      if (!acc[key]) acc[key] = { label: getMonthLabel(d), items: [] };
      acc[key].items.push(w);
      return acc;
    },
    {}
  );

  const sortedGroups = Object.entries(grouped).sort(([a], [b]) =>
    a === "no-date" ? 1 : b === "no-date" ? -1 : a.localeCompare(b)
  );

  return (
    <PublicLayout>
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-mint-light/50 dark:bg-mint/10 px-4 py-2 rounded-full text-sm text-earth-700 dark:text-earth-300 mb-4">
              <WorkshopIcon size={16} />
              <span>Venez créer avec nous</span>
            </div>
            <h1 className="font-serif text-4xl font-bold text-earth-800 dark:text-earth-200">
              Nos Ateliers
            </h1>
            <p className="mt-3 text-earth-600 dark:text-earth-400 max-w-xl mx-auto">
              Participez à nos ateliers créatifs et repartez avec votre propre création artisanale.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <WorkshopFilters />
          </div>

          {/* Count */}
          {workshops.length > 0 && (
            <div className="flex items-center justify-between mb-6 text-sm">
              <span className="text-earth-500 dark:text-earth-400">
                {total} atelier{total > 1 ? "s" : ""} à venir
              </span>
              <span className="text-earth-500 dark:text-earth-400">
                Trié par date
              </span>
            </div>
          )}

          <Suspense fallback={<WorkshopsListSkeleton />}>
            {workshops.length === 0 ? (
              <EmptyState
                title={
                  filter
                    ? "Aucun atelier ne correspond à ce filtre"
                    : "Aucun atelier programmé"
                }
                description={
                  filter
                    ? "Essayez un autre filtre ou revenez bientôt."
                    : "Nous proposons régulièrement de nouveaux ateliers. Revenez bientôt !"
                }
                icon={<WorkshopIcon size={80} />}
                actionLabel="Découvrir nos créations"
                actionHref="/produits"
                actionVariant="secondary"
              />
            ) : (
              <>
                {sortedGroups.map(([key, group]) => (
                  <div key={key} className="mb-12 last:mb-0">
                    {/* Month header */}
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="font-serif text-2xl font-semibold text-earth-800 dark:text-earth-200 capitalize">
                        {group.label}
                      </h2>
                      <span className="flex-1 h-px bg-earth-200 dark:bg-earth-700" />
                      <span className="text-sm text-earth-500 dark:text-earth-400">
                        {group.items.length} atelier
                        {group.items.length > 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Cards */}
                    <div className="space-y-6">
                      {group.items.map((workshop) => {
                        const displayDate = workshop.startDate || workshop.date;
                        return (
                          <WorkshopCard
                            key={workshop.id}
                            id={workshop.id}
                            title={workshop.title}
                            description={workshop.description}
                            price={workshop.price}
                            duration={workshop.duration}
                            images={workshop.images}
                            date={displayDate?.toISOString() || null}
                            availability={workshop.availability}
                            location={workshop.location}
                            maxSpots={workshop.maxSpots}
                            skillLevel={workshop.skillLevel}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}

                <Pagination currentPage={currentPage} totalPages={totalPages} />
              </>
            )}
          </Suspense>
        </div>
      </section>
    </PublicLayout>
  );
}