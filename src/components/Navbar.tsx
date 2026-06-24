"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { usePathname } from "next/navigation";

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
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-cream-50/95 backdrop-blur-md shadow-sm' 
        : 'bg-cream-50/80 backdrop-blur-sm'
    } border-b-2 border-transparent bg-gradient-to-r from-peach-light to-gold-light bg-clip-border`}>
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Logo size={40} brandName={settings?.brandName} />

          <ul className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm font-medium transition-colors relative ${
                      isActive
                        ? "text-earth-800 font-semibold"
                        : "text-earth-600 hover:text-earth-800"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-mint rounded-full"></span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            className="md:hidden p-2 text-earth-700 hover:bg-peach-light rounded-lg transition-colors touch-manipulation"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu with animation */}
        <div className={`
          md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${open ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <ul className="pb-4 space-y-1 border-t border-earth-200 pt-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block py-2.5 px-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-lavender-light text-earth-800 font-medium"
                        : "text-earth-700 hover:bg-peach-light"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}