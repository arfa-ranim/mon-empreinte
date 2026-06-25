"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Package, Palette, 
  LogOut, Settings, Plus, Menu, X, Mail
} from "lucide-react";
import Logo from "./Logo";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const links = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produits", icon: Package },
  { href: "/admin/workshops", label: "Ateliers", icon: Palette },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
];

const quickActions = [
  { href: "/admin/products/new", label: "Nouveau produit", icon: Plus },
  { href: "/admin/workshops/new", label: "Nouvel atelier", icon: Plus },
];

// Move MobileToggle outside
const MobileToggle = ({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-lg border border-earth-100 hover:bg-cream-50 transition-colors"
    aria-label="Toggle menu"
  >
    {isOpen ? <X size={24} /> : <Menu size={24} />}
  </button>
);

// Move SidebarContent outside
const SidebarContent = ({ 
  onItemClick 
}: { 
  onItemClick?: () => void 
}) => {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <>
      <div className="p-4 sm:p-6 border-b border-earth-700">
        <Logo size={36} />
        <p className="text-xs text-cream-300 mt-2">Administration</p>
      </div>

      <nav className="flex-1 p-3 sm:p-4 space-y-4 sm:space-y-6 overflow-y-auto">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-cream-400/60 font-medium px-2">
            Navigation
          </p>
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
                  "flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-earth-700 text-white"
                    : "text-cream-200 hover:bg-earth-700/50 hover:text-white"
                )}
                onClick={onItemClick}
              >
                <Icon size={18} className="shrink-0" />
                <span className="truncate">{link.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-cream-400/60 font-medium px-2">
            Actions rapides
          </p>
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm text-cream-200 hover:bg-earth-700/50 hover:text-white transition-colors"
                onClick={onItemClick}
              >
                <Icon size={18} className="shrink-0" />
                <span className="truncate">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-3 sm:p-4 border-t border-earth-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm text-cream-200 hover:bg-earth-700/50 hover:text-white w-full transition-colors"
        >
          <LogOut size={18} className="shrink-0" />
          Déconnexion
        </button>
      </div>
    </>
  );
};

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu on route change – but we already have onItemClick closing it,
  // we can keep this effect but with a condition to avoid cascading renders.
useEffect(() => {
  if (isMobile) {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileOpen(false);
  }
}, [pathname, isMobile]);

  return (
    <>
      <MobileToggle 
        isOpen={isMobileOpen} 
        onToggle={() => setIsMobileOpen(!isMobileOpen)} 
      />
      
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed md:sticky top-0 left-0 z-40",
        "w-64 h-screen bg-earth-800 text-cream-100",
        "flex flex-col transition-transform duration-300 ease-in-out",
        isMobile && !isMobileOpen && "-translate-x-full",
        isMobile && isMobileOpen && "translate-x-0",
        "md:translate-x-0"
      )}>
        <SidebarContent onItemClick={() => isMobile && setIsMobileOpen(false)} />
      </aside>
    </>
  );
}