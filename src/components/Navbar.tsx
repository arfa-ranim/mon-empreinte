"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/produits", label: "Produits" },
  { href: "/ateliers", label: "Ateliers" },
  { href: "/galerie", label: "Galerie" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
  { href: "/favoris", label: "❤️ Favoris" },
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
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle scroll - only update scrolled state, don't close menu
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [open]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-cream-50/95 dark:bg-earth-900/95 backdrop-blur-md shadow-sm' 
        : 'bg-cream-50/80 dark:bg-earth-900/80 backdrop-blur-sm'
    } border-b-2 border-transparent bg-linear-to-r from-peach-light to-gold-light dark:from-earth-800 dark:to-earth-700 bg-clip-border`}>
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Logo size={40} brandName={settings?.brandName} />

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm font-medium transition-colors relative ${
                      isActive
                        ? "text-earth-800 dark:text-earth-200 font-semibold"
                        : "text-earth-600 dark:text-earth-400 hover:text-earth-800 dark:hover:text-earth-200"
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
            <li>
              <ThemeToggle />
            </li>
          </ul>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              ref={buttonRef}
              type="button"
              className="relative z-50 p-2 text-earth-700 dark:text-earth-300 hover:bg-peach-light dark:hover:bg-earth-700 rounded-lg transition-colors touch-manipulation"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
              }}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

{/* Mobile Navigation */}
<div
  ref={menuRef}
  className={`
    md:hidden fixed inset-x-0 top-0 z-40
    bg-cream-50 dark:bg-earth-900
    shadow-lg
    transition-all duration-300 ease-in-out
    ${open ? 'opacity-100 visible' : 'opacity-0 invisible'}
  `}
  style={{
    top: open ? '0' : '-100%',
    height: '100vh',
    paddingTop: '4rem',
  }}
>
  <div className="h-full overflow-y-auto px-4 pb-20">
    <ul className="space-y-2 pt-4">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block py-3 px-4 rounded-xl text-base font-medium transition-colors ${
                isActive
                  ? "bg-lavender-light dark:bg-earth-700 text-earth-800 dark:text-earth-200"
                  : "text-earth-700 dark:text-earth-300 hover:bg-peach-light dark:hover:bg-earth-700"
              }`}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  </div>
</div>
      </nav>
    </header>
  );
}