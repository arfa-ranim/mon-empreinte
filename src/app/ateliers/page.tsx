import PublicLayout from "@/components/PublicLayout";
import { prisma } from "@/lib/prisma";
import WorkshopCard from "@/components/WorkshopCard";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = { title: "Ateliers" };

export default async function AteliersPage() {
  const workshops = await prisma.workshop.findMany({ 
    orderBy: { date: "asc" },
  });

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
            <p className="text-center text-earth-500 py-20">Aucun atelier pour le moment.</p>
          ) : (
            <div className="space-y-6">
              {workshops.map((workshop) => (
                <WorkshopCard key={workshop.id} {...workshop} />
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}