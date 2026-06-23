import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "./SocialIcons";
import Logo from "./Logo";
import { BRAND, SOCIAL_LINKS, WHATSAPP_DISPLAY } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function Footer() {
  const whatsappUrl = buildWhatsAppUrl("Bonjour ! Je souhaite vous contacter.");

  return (
    <footer className="bg-earth-800 text-cream-100 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Logo size={52} showText />
            <p className="mt-4 text-cream-200 text-sm leading-relaxed">
              {BRAND.description}
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/produits" className="text-cream-200 hover:text-white transition-colors">Produits</Link></li>
              <li><Link href="/ateliers" className="text-cream-200 hover:text-white transition-colors">Ateliers</Link></li>
              <li><Link href="/galerie" className="text-cream-200 hover:text-white transition-colors">Galerie</Link></li>
              <li><Link href="/a-propos" className="text-cream-200 hover:text-white transition-colors">À propos</Link></li>
              <li><Link href="/contact" className="text-cream-200 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-sm">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-cream-200 hover:text-white transition-colors"
              >
                <MessageCircle size={18} />
                {WHATSAPP_DISPLAY}
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-cream-200 hover:text-white transition-colors"
              >
                <InstagramIcon size={18} />
                Instagram
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-cream-200 hover:text-white transition-colors"
              >
                <FacebookIcon size={18} />
                Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-earth-700 text-center text-sm text-cream-300">
          © {new Date().getFullYear()} {BRAND.name}. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
