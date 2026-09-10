import Link from "next/link";
import { Package, Palette, ArrowRight } from "lucide-react";

export default function TwoPathSection() {
  return (
    <section className="py-16 sm:py-20 bg-cream-50 dark:bg-earth-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-earth-800 dark:text-earth-200">
            Des créations à adopter.
            <span className="block mt-1 text-earth-600 dark:text-earth-400 font-normal italic text-2xl sm:text-3xl">
              Des ateliers à vivre.
            </span>
          </h2>
        </div>

        {/* Two cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Créations */}
          <Link
            href="/produits"
            className="group relative bg-white dark:bg-earth-800 rounded-3xl p-8 sm:p-10 border border-earth-100 dark:border-earth-700 shadow-elevation-1 hover:shadow-elevation-3 transition-all duration-500 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2"
          >
            {/* Soft peach corner glow */}
            <div
              className="absolute -top-16 -right-16 w-48 h-48 bg-peach rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"
              aria-hidden="true"
            />

            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-peach/20 flex items-center justify-center text-peach-dark mb-6 group-hover:scale-110 transition-transform duration-300">
                <Package size={26} />
              </div>

              <h3 className="font-serif text-2xl font-semibold text-earth-800 dark:text-earth-200 mb-3">
                Découvrir nos créations
              </h3>

              <p className="text-earth-600 dark:text-earth-400 leading-relaxed mb-8">
                Des pièces uniques, faites main en Tunisie. Macramé, bougies,
                textiles upcyclés — chaque création porte notre empreinte.
              </p>

              <span className="inline-flex items-center gap-2 text-peach-dark dark:text-peach font-medium text-sm">
                Voir la collection
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </div>
          </Link>

          {/* Ateliers */}
          <Link
            href="/ateliers"
            className="group relative bg-white dark:bg-earth-800 rounded-3xl p-8 sm:p-10 border border-earth-100 dark:border-earth-700 shadow-elevation-1 hover:shadow-elevation-3 transition-all duration-500 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2"
          >
            {/* Soft mint corner glow */}
            <div
              className="absolute -top-16 -right-16 w-48 h-48 bg-mint rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"
              aria-hidden="true"
            />

            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-mint/20 flex items-center justify-center text-mint-dark mb-6 group-hover:scale-110 transition-transform duration-300">
                <Palette size={26} />
              </div>

              <h3 className="font-serif text-2xl font-semibold text-earth-800 dark:text-earth-200 mb-3">
                Créer avec nous
              </h3>

              <p className="text-earth-600 dark:text-earth-400 leading-relaxed mb-8">
                Des ateliers créatifs en petit groupe, à Tunis. Apprenez,
                expérimentez et repartez avec votre propre empreinte.
              </p>

              <span className="inline-flex items-center gap-2 text-mint-dark dark:text-mint font-medium text-sm">
                Voir les ateliers
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}