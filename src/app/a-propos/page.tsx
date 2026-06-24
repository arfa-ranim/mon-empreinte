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
            {/* Quote / tagline */}
            <div className="bg-peach-light/20 p-6 rounded-2xl mb-10 text-center">
              <p className="text-lg text-earth-700 leading-relaxed italic font-serif">
                Chaque création est une empreinte — la nôtre, que nous partageons avec vous.
              </p>
            </div>

            <p className="text-earth-600 leading-relaxed mb-6">
              <strong>{BRAND.name}</strong> est bien plus qu&apos;une marque — c&apos;est un atelier vivant, 
              un espace de création où chaque pièce raconte une histoire. Basée à Tunis, notre 
              aventure a commencé avec une simple conviction : <strong>redonner vie aux matières 
              et célébrer le travail manuel</strong>.
            </p>

            <p className="text-earth-600 leading-relaxed mb-6">
              Nous transformons des matières premières en objets uniques : des 
              <strong> sacs en macramé</strong> tissés avec soin, des 
              <strong> bougies naturelles</strong> aux parfums envoûtants, des 
              <strong> textiles upcyclés</strong> qui deviennent des pièces déco originales. 
              Chaque création naît dans notre atelier, entre nos mains, avec une attention 
              particulière pour chaque détail.
            </p>

            <p className="text-earth-600 leading-relaxed mb-6">
              Mais {BRAND.name}, c&apos;est aussi des <strong>ateliers créatifs</strong> où vous êtes 
              invités à mettre la main à la pâte. Que vous soyez débutant ou passionné, nos sessions 
              sont conçues pour vous inspirer, vous surprendre et vous permettre de repartir avec 
              votre propre création.
            </p>

            <p className="text-earth-600 leading-relaxed mb-12">
              Chaque pièce que vous trouverez ici est une invitation à ralentir, à apprécier 
              l&apos;artisanat et à porter des objets qui ont une âme. Parce que derrière chaque création, 
              il y a une histoire — la vôtre et la nôtre.
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