import Link from "next/link";
import { Package, Palette, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Administration" };

export default async function AdminDashboardPage() {
  const [productCount, workshopCount, messageCount] = await Promise.all([
    prisma.product.count(),
    prisma.workshop.count(),
    prisma.contactMessage.count(),
  ]);

  const stats = [
    { label: "Produits", value: productCount, icon: Package, href: "/admin/products" },
    { label: "Ateliers", value: workshopCount, icon: Palette, href: "/admin/workshops" },
    { label: "Messages", value: messageCount, icon: Package, href: "/admin" },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-earth-800 mb-8">Tableau de bord</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white rounded-2xl p-6 border border-earth-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-earth-500 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-earth-800 mt-1">{stat.value}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-cream-200 flex items-center justify-center text-earth-700">
                  <Icon size={24} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <h2 className="font-serif text-xl font-semibold text-earth-800 mb-4">Actions rapides</h2>
      <div className="flex flex-wrap gap-4">
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-earth-700 text-white rounded-full text-sm font-medium hover:bg-earth-800 transition-colors"
        >
          <Plus size={18} />
          Ajouter un produit
        </Link>
        <Link
          href="/admin/workshops/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-earth-700 text-white rounded-full text-sm font-medium hover:bg-earth-800 transition-colors"
        >
          <Plus size={18} />
          Ajouter un atelier
        </Link>
      </div>
    </div>
  );
}
