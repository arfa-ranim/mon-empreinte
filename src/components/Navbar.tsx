"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Heart } from "lucide-react";
import Logo from "./Logo";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { useWishlist } from "@/hooks/useWishlist";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/produits", label: "Produits" },
  { href: "/ateliers", label: "Ateliers" },
  { href: "/galerie", label: "Galerie" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

interface NavbarProps {
  settings?: {
    brandName: string;
    logo?: string;
  };
}

export default function Navbar({ settings }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { wishlist } = useWishlist();

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${
          scrolled
            ? "bg-white/95 dark:bg-earth-900/95 backdrop-blur-lg shadow-elevation-1"
            : "bg-white/80 dark:bg-earth-900/80 backdrop-blur-sm"
        }
        border-b border-earth-100/50 dark:border-earth-800/50
      `}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Logo size={40} brandName={settings?.brandName} />

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`
                      relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg
                      ${
                        isActive
                          ? "text-earth-800 dark:text-earth-200 bg-peach-light/20 dark:bg-earth-700/30"
                          : "text-earth-600 dark:text-earth-400 hover:text-earth-800 dark:hover:text-earth-200 hover:bg-cream-100 dark:hover:bg-earth-800"
                      }
                    `}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="active-nav"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-warm rounded-full"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button - placeholder */}
            <button
              className="hidden md:flex p-2 rounded-lg hover:bg-cream-100 dark:hover:bg-earth-800 transition-colors text-earth-600 dark:text-earth-400"
              aria-label="Rechercher"
            >
              <Search size={20} />
            </button>

            {/* Wishlist with counter */}
            <Link
              href="/favoris"
              className="relative p-2 rounded-lg hover:bg-cream-100 dark:hover:bg-earth-800 transition-colors text-earth-600 dark:text-earth-400"
              aria-label="Favoris"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1"
                >
                  {wishlist.length > 9 ? "9+" : wishlist.length}
                </motion.span>
              )}
            </Link>

            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              ref={buttonRef}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-cream-100 dark:hover:bg-earth-800 transition-colors text-earth-600 dark:text-earth-400"
              aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="md:hidden overflow-hidden border-t border-earth-100 dark:border-earth-800"
            >
              <ul className="py-4 space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`
                          block px-4 py-3 rounded-xl text-base font-medium transition-colors
                          ${
                            isActive
                              ? "bg-peach-light/30 dark:bg-earth-700/30 text-earth-800 dark:text-earth-200"
                              : "text-earth-700 dark:text-earth-300 hover:bg-cream-100 dark:hover:bg-earth-800"
                          }
                        `}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
                {/* Mobile only - Favorites with counter */}
                <li>
                  <Link
                    href="/favoris"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-earth-700 dark:text-earth-300 hover:bg-cream-100 dark:hover:bg-earth-800 transition-colors"
                  >
                    <span>❤️ Favoris</span>
                    {wishlist.length > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {wishlist.length}
                      </span>
                    )}
                  </Link>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}