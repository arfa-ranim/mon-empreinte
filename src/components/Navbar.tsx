"use client";

import Link from "next/link";
import { useState } from "react";
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

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-cream-50/95 backdrop-blur-sm border-b-2 border-transparent bg-gradient-to-r from-peach-light to-gold-light bg-clip-border">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo size={44} />

          <ul className="hidden md:flex items-center gap-8">
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
            className="md:hidden p-2 text-earth-700 hover:bg-peach-light rounded-lg transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <ul className="md:hidden pb-4 space-y-2 border-t border-earth-200 pt-4 bg-peach-light/20 rounded-b-xl">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block py-2 px-3 rounded-lg ${
                      isActive
                        ? "bg-lavender-light text-earth-800 font-medium"
                        : "text-earth-700 hover:bg-peach-light"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
    </header>
  );
}