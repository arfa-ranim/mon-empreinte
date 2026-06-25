// app/admin/page.tsx
import Link from "next/link";
import {
  Package,
  Palette,
  Plus,
  TrendingUp,
  Settings,
  AlertCircle,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DashboardStatsSkeleton } from "@/components/Skeleton";
import { Suspense } from "react";
import StatsChart from "@/components/admin/StatsChart";
import ActivityFeed from "@/components/admin/ActivityFeed";

export const metadata = { title: "Administration" };

// Revalidate every 60 seconds
export const revalidate = 60;

async function DashboardStats() {
  const [productCount, workshopCount, messageCount, recentProducts, recentWorkshops] = await Promise.all([
    prisma.product.count(),
    prisma.workshop.count(),
    prisma.contactMessage.count(),
    prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.workshop.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  // Prepare chart data: last 6 months
  const now = new Date();
  const chartData = [];
  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = month.toLocaleDateString("fr-FR", { month: "short" });
    const start = new Date(month.getFullYear(), month.getMonth(), 1);
    const end = new Date(month.getFullYear(), month.getMonth() + 1, 1);
    const productsCount = await prisma.product.count({
      where: { createdAt: { gte: start, lt: end } },
    });
    const workshopsCount = await prisma.workshop.count({
      where: { createdAt: { gte: start, lt: end } },
    });
    chartData.push({ name: monthName, products: productsCount, workshops: workshopsCount });
  }

  // Build activity feed
  const activities = [
    ...recentProducts.map((p) => ({
      id: p.id,
      type: "product" as const,
      title: p.title,
      createdAt: p.createdAt,
      action: "created" as const,
    })),
    ...recentWorkshops.map((w) => ({
      id: w.id,
      type: "workshop" as const,
      title: w.title,
      createdAt: w.createdAt,
      action: "created" as const,
    })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
        {/* Products */}
        <Link
          href="/admin/products"
          className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 active:scale-95 block"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-earth-500 text-sm">Produits</p>
              <p className="text-2xl sm:text-3xl font-bold text-earth-800 mt-1">{productCount}</p>
              <p className="text-xs text-earth-400 mt-1">+12% ce mois</p>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-peach/20 flex items-center justify-center text-peach">
              <Package size={24} className="sm:size-7" />
            </div>
          </div>
        </Link>

        {/* Workshops */}
        <Link
          href="/admin/workshops"
          className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 active:scale-95 block"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-earth-500 text-sm">Ateliers</p>
              <p className="text-2xl sm:text-3xl font-bold text-earth-800 mt-1">{workshopCount}</p>
              <p className="text-xs text-earth-400 mt-1">+8% ce mois</p>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-mint/20 flex items-center justify-center text-mint">
              <Palette size={24} className="sm:size-7" />
            </div>
          </div>
        </Link>

        {/* Messages - updated link to /admin/messages */}
        <Link
          href="/admin/messages"
          className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 active:scale-95 block"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-earth-500 text-sm">Messages</p>
              <p className="text-2xl sm:text-3xl font-bold text-earth-800 mt-1">{messageCount}</p>
              <p className="text-xs text-earth-400 mt-1">3 non lus</p>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-lavender/20 flex items-center justify-center text-lavender">
              <TrendingUp size={24} className="sm:size-7" />
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
        {/* Chart */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg sm:text-xl font-semibold text-earth-800">
              Créations (6 derniers mois)
            </h2>
            <button
              className="text-sm text-earth-500 hover:text-earth-700 flex items-center gap-1"
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={14} />
              Rafraîchir
            </button>
          </div>
          <StatsChart data={chartData} />
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg sm:text-xl font-semibold text-earth-800">
              Activité récente
            </h2>
            <Link href="/admin" className="text-sm text-earth-500 hover:text-earth-700 flex items-center gap-1">
              Voir tout <ChevronRight size={16} />
            </Link>
          </div>
          <ActivityFeed activities={activities.slice(0, 5)} />
        </div>
      </div>

      {/* Quick Actions – enhanced */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg sm:text-xl font-semibold text-earth-800">
            Actions rapides
          </h2>
          <span className="text-xs text-earth-400">⚡</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-5 py-3 bg-peach text-earth-900 rounded-full text-sm font-medium hover:bg-peach/80 transition-colors shadow-soft"
          >
            <Plus size={18} />
            Nouveau produit
          </Link>
          <Link
            href="/admin/workshops/new"
            className="inline-flex items-center gap-2 px-5 py-3 bg-mint text-earth-800 rounded-full text-sm font-medium hover:bg-mint/80 transition-colors shadow-mint"
          >
            <Plus size={18} />
            Nouvel atelier
          </Link>
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-2 px-5 py-3 bg-earth-100 text-earth-700 rounded-full text-sm font-medium hover:bg-earth-200 transition-colors"
          >
            <Settings size={18} />
            Paramètres
          </Link>
        </div>
      </div>
    </>
  );
}

export default async function AdminDashboardPage() {
  return (
    <div className="px-2 sm:px-4 md:px-0">
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

      <Suspense fallback={<DashboardStatsSkeleton />}>
        <DashboardStats />
      </Suspense>

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