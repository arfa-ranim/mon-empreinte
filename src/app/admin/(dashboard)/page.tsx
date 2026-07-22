import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Administration",
};

export default function AdminDashboardPage() {
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

      <DashboardClient />
    </div>
  );
}