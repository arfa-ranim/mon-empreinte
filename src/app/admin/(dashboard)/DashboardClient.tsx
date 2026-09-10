"use client";

import Link from "next/link";
import {
  Package,
  Palette,
  Plus,
  TrendingUp,
  Settings,
  RefreshCw,
} from "lucide-react";
import { DashboardStatsSkeleton } from "@/components/Skeleton";
import { useEffect, useState } from "react";
import ActivityFeed from "@/components/admin/ActivityFeed";

interface Product {
  id: string;
  title: string;
  createdAt: string;
}

interface Workshop {
  id: string;
  title: string;
  createdAt: string;
}

interface Activity {
  id: string;
  type: "product" | "workshop";
  title: string;
  createdAt: Date;
  action: "created" | "updated" | "deleted";
}

interface StatsResponse {
  productCount: number;
  workshopCount: number;
  messageCount: number;
}

interface ProductsResponse {
  data: Product[];
}

interface WorkshopsResponse {
  data: Workshop[];
}

function RefreshButton() {
  return (
    <button
      type="button"
      className="text-sm text-earth-500 dark:text-earth-400 hover:text-earth-700 dark:hover:text-earth-200 flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2 rounded-md"
      onClick={() => window.location.reload()}
    >
      <RefreshCw size={14} />
      Rafraîchir
    </button>
  );
}

export default function DashboardClient() {
  const [stats, setStats] = useState({
    productCount: 0,
    workshopCount: 0,
    messageCount: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, productsRes, workshopsRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/products?limit=5"),
          fetch("/api/workshops?limit=5"),
        ]);

        const statsData: StatsResponse = statsRes.ok
          ? await statsRes.json().catch(() => ({
              productCount: 0,
              workshopCount: 0,
              messageCount: 0,
            }))
          : { productCount: 0, workshopCount: 0, messageCount: 0 };

        const productsData: ProductsResponse = productsRes.ok
          ? await productsRes.json().catch(() => ({ data: [] }))
          : { data: [] };

        const workshopsData: WorkshopsResponse = workshopsRes.ok
          ? await workshopsRes.json().catch(() => ({ data: [] }))
          : { data: [] };

        setStats({
          productCount: statsData.productCount || 0,
          workshopCount: statsData.workshopCount || 0,
          messageCount: statsData.messageCount || 0,
        });

        const recentProducts: Product[] = productsData.data || [];
        const recentWorkshops: Workshop[] = workshopsData.data || [];
        const feed: Activity[] = [
          ...recentProducts.map((p) => ({
            id: p.id,
            type: "product" as const,
            title: p.title,
            createdAt: new Date(p.createdAt),
            action: "created" as const,
          })),
          ...recentWorkshops.map((w) => ({
            id: w.id,
            type: "workshop" as const,
            title: w.title,
            createdAt: new Date(w.createdAt),
            action: "created" as const,
          })),
        ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setActivities(feed);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setStats({ productCount: 0, workshopCount: 0, messageCount: 0 });
        setActivities([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <DashboardStatsSkeleton />;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
        {/* Products */}
        <Link
          href="/admin/products"
          className="bg-white dark:bg-earth-900 rounded-2xl p-4 sm:p-6 border border-earth-100 dark:border-earth-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-earth-500 dark:text-earth-400 text-sm">Produits</p>
              <p className="text-2xl sm:text-3xl font-bold text-earth-800 dark:text-earth-200 mt-1">
                {stats.productCount}
              </p>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-peach/20 flex items-center justify-center text-peach-dark dark:text-peach">
              <Package size={24} className="sm:size-7" />
            </div>
          </div>
        </Link>

        {/* Workshops */}
        <Link
          href="/admin/workshops"
          className="bg-white dark:bg-earth-900 rounded-2xl p-4 sm:p-6 border border-earth-100 dark:border-earth-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-earth-500 dark:text-earth-400 text-sm">Ateliers</p>
              <p className="text-2xl sm:text-3xl font-bold text-earth-800 dark:text-earth-200 mt-1">
                {stats.workshopCount}
              </p>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-mint/20 flex items-center justify-center text-mint-dark dark:text-mint">
              <Palette size={24} className="sm:size-7" />
            </div>
          </div>
        </Link>

        {/* Messages */}
        <Link
          href="/admin/messages"
          className="bg-white dark:bg-earth-900 rounded-2xl p-4 sm:p-6 border border-earth-100 dark:border-earth-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-earth-500 dark:text-earth-400 text-sm">Messages</p>
              <p className="text-2xl sm:text-3xl font-bold text-earth-800 dark:text-earth-200 mt-1">
                {stats.messageCount}
              </p>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-lavender/20 flex items-center justify-center text-lavender-dark dark:text-lavender">
              <TrendingUp size={24} className="sm:size-7" />
            </div>
          </div>
        </Link>
      </div>

      {/* Activity Feed only — chart removed, was using random data */}
      <div className="bg-white dark:bg-earth-900 rounded-2xl p-4 sm:p-6 border border-earth-100 dark:border-earth-800 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg sm:text-xl font-semibold text-earth-800 dark:text-earth-200">
            Activité récente
          </h2>
          <RefreshButton />
        </div>
        <ActivityFeed activities={activities.slice(0, 8)} />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-earth-900 rounded-2xl p-4 sm:p-6 border border-earth-100 dark:border-earth-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg sm:text-xl font-semibold text-earth-800 dark:text-earth-200">
            Actions rapides
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-5 py-3 bg-peach text-earth-900 rounded-full text-sm font-medium hover:bg-peach/80 transition-colors shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2"
          >
            <Plus size={18} />
            Nouveau produit
          </Link>
          <Link
            href="/admin/workshops/new"
            className="inline-flex items-center gap-2 px-5 py-3 bg-mint text-earth-800 rounded-full text-sm font-medium hover:bg-mint/80 transition-colors shadow-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2"
          >
            <Plus size={18} />
            Nouvel atelier
          </Link>
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-2 px-5 py-3 bg-earth-100 dark:bg-earth-800 text-earth-700 dark:text-earth-300 rounded-full text-sm font-medium hover:bg-earth-200 dark:hover:bg-earth-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2"
          >
            <Settings size={18} />
            Paramètres
          </Link>
        </div>
      </div>
    </>
  );
}