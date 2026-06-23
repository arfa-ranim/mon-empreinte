"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Palette, LogOut } from "lucide-react";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produits", icon: Package },
  { href: "/admin/workshops", label: "Ateliers", icon: Palette },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <aside className="w-full md:w-64 bg-earth-800 text-cream-100 md:min-h-screen flex flex-col">
      <div className="p-6 border-b border-earth-700">
        <Logo size={40} />
        <p className="text-xs text-cream-300 mt-2">Administration</p>
      </div>

      <nav className="flex-1 p-4 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
        {links.map((link) => {
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-earth-700 text-white"
                  : "text-cream-200 hover:bg-earth-700/50 hover:text-white"
              )}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-earth-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-cream-200 hover:bg-earth-700/50 hover:text-white w-full transition-colors"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
