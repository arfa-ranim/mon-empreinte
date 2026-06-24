import Link from "next/link";
import { 
  Package, Palette, Plus, TrendingUp, 
  Clock, AlertCircle, ChevronRight
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Administration" };

export default async function AdminDashboardPage() {
  const [productCount, workshopCount, messageCount, recentProducts, recentWorkshops] = await Promise.all([
    prisma.product.count(),
    prisma.workshop.count(),
    prisma.contactMessage.count(),
    prisma.product.findMany({ 
      orderBy: { createdAt: "desc" }, 
      take: 5 
    }),
    prisma.workshop.findMany({ 
      orderBy: { createdAt: "desc" }, 
      take: 5 
    }),
  ]);

  const stats = [
    { 
      label: "Produits", 
      value: productCount, 
      icon: Package, 
      href: "/admin/products",
      color: "bg-peach/20 text-peach",
      trend: "+12% ce mois"
    },
    { 
      label: "Ateliers", 
      value: workshopCount, 
      icon: Palette, 
      href: "/admin/workshops",
      color: "bg-mint/20 text-mint",
      trend: "+8% ce mois"
    },
    { 
      label: "Messages", 
      value: messageCount, 
      icon: TrendingUp, 
      href: "/admin",
      color: "bg-lavender/20 text-lavender",
      trend: "3 non lus"
    },
  ];

  return (
    <div className="px-2 sm:px-4 md:px-0">
      {/* Header - Stack on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-800">
            Tableau de bord
          </h1>
          <p className="text-sm sm:text-base text-earth-500 mt-1">
            Bienvenue dans votre espace d{"'"}administration
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-peach text-earth-900 rounded-full text-sm font-medium hover:bg-peach/80 transition-colors shadow-soft"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Nouveau produit</span>
            <span className="sm:hidden">Produit</span>
          </Link>
          <Link
            href="/admin/workshops/new"
            className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-mint text-earth-800 rounded-full text-sm font-medium hover:bg-mint/80 transition-colors shadow-mint"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Nouvel atelier</span>
            <span className="sm:hidden">Atelier</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 active:scale-95"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-earth-500 text-sm">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-earth-800 mt-1">{stat.value}</p>
                  <p className="text-xs text-earth-400 mt-1">{stat.trend}</p>
                </div>
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full ${stat.color} flex items-center justify-center`}>
                  <Icon size={24} className="sm:size-7" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Recent Products */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg sm:text-xl font-semibold text-earth-800">
              Derniers produits
            </h2>
            <Link href="/admin/products" className="text-sm text-earth-500 hover:text-earth-700 flex items-center gap-1">
              Voir tout <ChevronRight size={16} />
            </Link>
          </div>
          {recentProducts.length === 0 ? (
            <p className="text-earth-400 text-sm">Aucun produit récent</p>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {recentProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-2 sm:p-3 rounded-xl hover:bg-cream-50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-earth-800 text-sm sm:text-base truncate">{product.title}</p>
                    <p className="text-sm text-earth-500">{product.price} DT</p>
                  </div>
                  <span className={`text-xs px-2 sm:px-3 py-1 rounded-full whitespace-nowrap ml-2 ${
                    product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {product.inStock ? 'En stock' : 'Rupture'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Workshops */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg sm:text-xl font-semibold text-earth-800">
              Derniers ateliers
            </h2>
            <Link href="/admin/workshops" className="text-sm text-earth-500 hover:text-earth-700 flex items-center gap-1">
              Voir tout <ChevronRight size={16} />
            </Link>
          </div>
          {recentWorkshops.length === 0 ? (
            <p className="text-earth-400 text-sm">Aucun atelier récent</p>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {recentWorkshops.map((workshop) => (
                <div key={workshop.id} className="flex items-center justify-between p-2 sm:p-3 rounded-xl hover:bg-cream-50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-earth-800 text-sm sm:text-base truncate">{workshop.title}</p>
                    <div className="flex items-center gap-2 text-sm text-earth-500">
                      <Clock size={14} className="shrink-0" />
                      <span className="truncate">{workshop.duration || "Durée flexible"}</span>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-earth-700 whitespace-nowrap ml-2">
                    {workshop.price} DT
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-6 sm:mt-8 bg-linear-to-r from-peach-light/30 to-mint-light/30 rounded-2xl p-4 sm:p-6 border border-earth-100">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-earth-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-earth-800 text-sm sm:text-base">Conseils rapides</h3>
            <ul className="mt-2 space-y-1 text-sm text-earth-600">
              <li className="flex items-center gap-2">✨ Ajoutez des images de qualité pour vos produits</li>
              <li className="flex items-center gap-2">📅 Pensez à mettre à jour les disponibilités des ateliers</li>
              <li className="flex items-center gap-2">📱 Répondez rapidement aux messages WhatsApp</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}