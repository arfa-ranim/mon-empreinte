"use client";

import Link from "next/link";
import { MessageCircle, Mail, MapPin, Heart } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "./SocialIcons";
import Logo from "./Logo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import Newsletter from "./Newsletter";
import { motion } from "framer-motion";

interface FooterProps {
  settings?: {
    brandName: string;
    description: string;
    whatsappNumber: string;
    instagram: string;
    facebook: string;
    email: string;
    address?: string;
    logo?: string;
  };
}

export default function Footer({ settings }: FooterProps) {
  const whatsappUrl = buildWhatsAppUrl(
    settings?.whatsappNumber || "21693494954",
    "Bonjour ! Je souhaite vous contacter."
  );

  const brandName = settings?.brandName || "Mon Empreinte";
  const description =
    settings?.description ||
    "Marque artisanale tunisienne dédiée à la créativité, au fait-main et à l'upcycling.";
  const instagram = settings?.instagram || "https://www.instagram.com/monempreinte.tn";
  const facebook = settings?.facebook || "https://www.facebook.com/share/18YJNytmUb";

  const navLinks = [
    { href: "/produits", label: "Produits" },
    { href: "/ateliers", label: "Ateliers" },
    { href: "/galerie", label: "Galerie" },
    { href: "/a-propos", label: "À propos" },
    { href: "/contact", label: "Contact" },
  ];

  const socialLinks = [
    {
      href: instagram,
      icon: InstagramIcon,
      label: "Instagram",
      color: "hover:text-pink-500",
    },
    {
      href: facebook,
      icon: FacebookIcon,
      label: "Facebook",
      color: "hover:text-blue-500",
    },
    {
      href: whatsappUrl,
      icon: MessageCircle,
      label: "WhatsApp",
      color: "hover:text-green-400",
    },
  ];

  return (
    <footer className="relative bg-earth-900 text-cream-100 mt-auto overflow-hidden">
      {/* Decorative top border with gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-peach via-mint to-lavender" />

      {/* Decorative background shapes */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-peach/5 rounded-full blur-3xl" />
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-mint/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1"
          >
            <Logo size={52} showText brandName={brandName} />
            <p className="mt-4 text-cream-200 text-sm leading-relaxed">{description}</p>

            {/* Social Icons */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full bg-earth-800 flex items-center justify-center text-cream-200 transition-all duration-300 hover:scale-110 ${social.color}`}
                    aria-label={social.label}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-serif text-lg font-semibold text-cream-100 mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream-200 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cream-200/30 group-hover:bg-peach transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-serif text-lg font-semibold text-cream-100 mb-4">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-cream-200 hover:text-white transition-colors group"
                >
                  <MessageCircle
                    size={18}
                    className="text-green-400 group-hover:scale-110 transition-transform"
                  />
                  {settings?.whatsappNumber
                    ? `+216 ${settings.whatsappNumber.slice(3)}`
                    : "+216 93 494 954"}
                </a>
              </li>
              {settings?.email && (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-center gap-3 text-cream-200 hover:text-white transition-colors group"
                  >
                    <Mail
                      size={18}
                      className="text-cream-400 group-hover:scale-110 transition-transform"
                    />
                    {settings.email}
                  </a>
                </li>
              )}
              {settings?.address && (
                <li className="flex items-start gap-3 text-cream-200">
                  <MapPin size={18} className="text-cream-400 mt-0.5" />
                  <span>{settings.address}</span>
                </li>
              )}
            </ul>
          </motion.div>

          {/* Newsletter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="font-serif text-lg font-semibold text-cream-100 mb-4">
              Newsletter
            </h3>
            <p className="text-cream-200 text-sm mb-4">
              Recevez nos nouveautés et offres exclusives
            </p>
            <Newsletter />
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t border-earth-800 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-cream-300 text-center sm:text-left">
            © {new Date().getFullYear()} {brandName}. Tous droits réservés.
          </p>
          <div className="flex items-center gap-2 text-sm text-cream-300">
            <span>Fait avec</span>
            <Heart size={14} className="text-red-400 animate-pulse" />
            <span>en Tunisie</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}