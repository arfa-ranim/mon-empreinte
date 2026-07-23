"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Package, Palette, 
  LogOut, Settings, Plus, Menu, X, Mail,
  ChevronRight, Sparkles
} from "lucide-react";
import Logo from "./Logo";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, color: "text-peach" },
  { href: "/admin/products", label: "Produits", icon: Package, color: "text-mint" },
  { href: "/admin/workshops", label: "Ateliers", icon: Palette, color: "text-lavender" },
  { href: "/admin/messages", label: "Messages", icon: Mail, color: "text-gold" },
  { href: "/admin/settings", label: "Paramètres", icon: Settings, color: "text-earth-400" },
];

const quickActions = [
  { href: "/admin/products/new", label: "Nouveau produit", icon: Plus },
  { href: "/admin/workshops/new", label: "Nouvel atelier", icon: Plus },
];

// Mobile Toggle
const MobileToggle = ({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-white dark:bg-earth-900 rounded-xl shadow-elevation-2 border border-earth-100 dark:border-earth-800 hover:bg-cream-50 dark:hover:bg-earth-800 transition-colors"
    aria-label="Toggle menu"
  >
    {isOpen ? <X size={22} className="text-earth-700 dark:text-earth-200" /> : <Menu size={22} className="text-earth-700 dark:text-earth-200" />}
  </button>
);

// Sidebar Content
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
      <div className="p-4 sm:p-6 border-b border-earth-700/50 bg-linear-to-b from-earth-800 to-earth-900">
        <Logo size={40} showText={false} />
        <p className="text-xs text-cream-300/60 mt-2 font-medium tracking-wider uppercase">
          Administration
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs text-cream-300/40">
          <Sparkles size={12} />
          <span>Version 2.0</span>
        </div>
      </div>

      <nav className="flex-1 p-3 sm:p-4 space-y-4 sm:space-y-6 overflow-y-auto">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-cream-400/40 font-semibold px-2">
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
                  "flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm transition-all duration-200 group relative",
                  isActive
                    ? "bg-earth-700/80 text-white shadow-lg shadow-earth-900/20"
                    : "text-cream-200/70 hover:bg-earth-700/40 hover:text-white hover:translate-x-1"
                )}
                onClick={onItemClick}
              >
                <Icon 
                  size={18} 
                  className={cn(
                    "shrink-0 transition-colors",
                    isActive ? link.color : "text-cream-300/50 group-hover:text-cream-200"
                  )} 
                />
                <span className="truncate">{link.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="admin-active"
                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-peach"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-cream-400/40 font-semibold px-2">
            Actions rapides
          </p>
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm text-cream-200/70 hover:bg-earth-700/40 hover:text-white hover:translate-x-1 transition-all duration-200 group"
                onClick={onItemClick}
              >
                <Icon size={18} className="shrink-0 text-cream-300/50 group-hover:text-cream-200" />
                <span className="truncate">{action.label}</span>
                <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-3 sm:p-4 border-t border-earth-700/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm text-cream-200/70 hover:bg-red-500/20 hover:text-red-400 w-full transition-all duration-200 group"
        >
          <LogOut size={18} className="shrink-0 text-cream-300/50 group-hover:text-red-400" />
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

  // Check if mobile on mount and resize
  useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

  requestAnimationFrame(checkMobile);

  window.addEventListener("resize", checkMobile);

  return () => {
    window.removeEventListener("resize", checkMobile);
  };
}, []);

  // Close mobile menu when route changes (only on mobile) 
  // Using a separate effect with a flag to avoid the setState warning
  useEffect(() => {
  if (window.innerWidth < 768) {
    requestAnimationFrame(() => {
      setIsMobileOpen(false);
    });
  }
}, [pathname]);
  // Handle closing menu when switching to desktop
  useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth >= 768) {
      setIsMobileOpen(false);
    }
  };

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);

  return (
    <>
      <MobileToggle 
        isOpen={isMobileOpen} 
        onToggle={() => setIsMobileOpen(!isMobileOpen)} 
      />
      
      <AnimatePresence>
        {isMobile && isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "fixed md:sticky top-0 left-0 z-40",
        "w-64 h-screen bg-earth-800/95 backdrop-blur-sm text-cream-100",
        "flex flex-col transition-transform duration-300 ease-in-out shadow-elevation-4",
        isMobile && !isMobileOpen && "-translate-x-full",
        isMobile && isMobileOpen && "translate-x-0",
        "md:translate-x-0"
      )}>
        <SidebarContent onItemClick={() => isMobile && setIsMobileOpen(false)} />
      </aside>
    </>
  );
}