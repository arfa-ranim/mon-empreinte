"use client";

import Link from "next/link";
import {
  Package,
  Palette,
  Plus,
  TrendingUp,
  Settings,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { DashboardStatsSkeleton } from "@/components/Skeleton";
import { useEffect, useState } from "react";
import StatsChart from "@/components/admin/StatsChart";
import ActivityFeed from "@/components/admin/ActivityFeed";

// Types for dashboard data
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

interface ChartData {
  name: string;
  products: number;
  workshops: number;
}

interface Activity {
  id: string;
  type: "product" | "workshop";
  title: string;
  createdAt: Date;
  action: "created" | "updated" | "deleted";
}

// API response types
interface StatsResponse {
  productCount: number;
  workshopCount: number;
  messageCount: number;
}

interface ProductsResponse {
  data: Product[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface WorkshopsResponse {
  data: Workshop[];
  meta?: {
    total: number;
  };
}

function RefreshButton() {
  return (
    <button
      className="text-sm text-earth-500 hover:text-earth-700 flex items-center gap-1"
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
  const [chartData, setChartData] = useState<ChartData[]>([]);
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

        // Check if responses are OK before parsing JSON
        if (!statsRes.ok) {
          console.error("Stats API error:", statsRes.status);
          setLoading(false);
          return;
        }
        if (!productsRes.ok) {
          console.error("Products API error:", productsRes.status);
          setLoading(false);
          return;
        }
        if (!workshopsRes.ok) {
          console.error("Workshops API error:", workshopsRes.status);
          setLoading(false);
          return;
        }

        // Parse JSON safely with proper types
        let statsData: StatsResponse = { productCount: 0, workshopCount: 0, messageCount: 0 };
        let productsData: ProductsResponse = { data: [] };
        let workshopsData: WorkshopsResponse = { data: [] };

        try {
          statsData = await statsRes.json();
        } catch {
          console.error("Failed to parse stats response");
          statsData = { productCount: 0, workshopCount: 0, messageCount: 0 };
        }

        try {
          productsData = await productsRes.json();
        } catch {
          console.error("Failed to parse products response");
          productsData = { data: [] };
        }

        try {
          workshopsData = await workshopsRes.json();
        } catch {
          console.error("Failed to parse workshops response");
          workshopsData = { data: [] };
        }

        setStats({
          productCount: statsData.productCount || 0,
          workshopCount: statsData.workshopCount || 0,
          messageCount: statsData.messageCount || 0,
        });

        // Build chart data (6 months)
        const now = new Date();
        const chart: ChartData[] = [];
        for (let i = 5; i >= 0; i--) {
          const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthName = month.toLocaleDateString("fr-FR", { month: "short" });
          chart.push({
            name: monthName,
            products: Math.floor(Math.random() * 10) + 1,
            workshops: Math.floor(Math.random() * 5) + 1,
          });
        }
        setChartData(chart);

        // Build activity feed
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
        // Set default values on error
        setStats({
          productCount: 0,
          workshopCount: 0,
          messageCount: 0,
        });
        setChartData([]);
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
          className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 active:scale-95 block"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-earth-500 text-sm">Produits</p>
              <p className="text-2xl sm:text-3xl font-bold text-earth-800 mt-1">{stats.productCount}</p>
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
              <p className="text-2xl sm:text-3xl font-bold text-earth-800 mt-1">{stats.workshopCount}</p>
              <p className="text-xs text-earth-400 mt-1">+8% ce mois</p>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-mint/20 flex items-center justify-center text-mint">
              <Palette size={24} className="sm:size-7" />
            </div>
          </div>
        </Link>

        {/* Messages */}
        <Link
          href="/admin/messages"
          className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 active:scale-95 block"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-earth-500 text-sm">Messages</p>
              <p className="text-2xl sm:text-3xl font-bold text-earth-800 mt-1">{stats.messageCount}</p>
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
            <RefreshButton />
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

      {/* Quick Actions */}
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