import PublicLayout from "@/components/PublicLayout";
import { BRAND } from "@/lib/constants";
import { Heart, Sparkles, Leaf } from "lucide-react";

export const metadata = { title: "À propos" };

const values = [
  {
    icon: Heart,
    title: "Authenticité",
    description:
      "Chaque création est unique et porte l'empreinte de l'artisan. Nous valorisons le travail manuel et la qualité.",
    color: "bg-peach-light",
    iconColor: "text-peach",
  },
  {
    icon: Sparkles,
    title: "Créativité",
    description:
      "Nous encourageons l'expression personnelle à travers nos ateliers et nos créations originales.",
    color: "bg-mint-light",
    iconColor: "text-mint",
  },
  {
    icon: Leaf,
    title: "Durabilité",
    description:
      "L'upcycling et le respect de l'environnement sont au cœur de notre démarche artisanale.",
    color: "bg-lavender-light",
    iconColor: "text-lavender",
  },
];

export default function AProposPage() {
  return (
    <PublicLayout>
      <section className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl font-bold text-earth-800">À propos</h1>
          </div>

          <div className="prose prose-earth max-w-none">
            <p className="text-lg text-earth-700 leading-relaxed text-center mb-10">
              <strong>{BRAND.name}</strong> est une marque artisanale basée à Tunis, dédiée à la
              créativité, au fait-main et à l&apos;upcycling. Nous créons des pièces uniques qui
              racontent une histoire — la vôtre et la nôtre.
            </p>

            <p className="text-earth-600 leading-relaxed mb-6">
              Fondée sur la passion du travail manuel, notre atelier est un espace où la matière
              première trouve une seconde vie. Des sacs en macramé aux bougies naturelles, en passant
              par les textiles upcyclés, chaque produit est conçu avec soin et intention.
            </p>

            <p className="text-earth-600 leading-relaxed mb-12">
              Nos ateliers créatifs vous invitent à découvrir l&apos;artisanat de vos propres mains.
              Que vous soyez débutant ou passionné, nos sessions sont conçues pour être accessibles,
              inspirantes et conviviales.
            </p>
          </div>

          <h2 className="font-serif text-2xl font-bold text-earth-800 text-center mb-8">
            Nos Valeurs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className={`${value.color} rounded-2xl p-6 text-center border border-earth-100 shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-white ${value.iconColor} mb-4`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-earth-800">{value.title}</h3>
                  <p className="mt-2 text-sm text-earth-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}