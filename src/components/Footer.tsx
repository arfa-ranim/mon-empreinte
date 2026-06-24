import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "./SocialIcons";
import Logo from "./Logo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

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
  const description = settings?.description || "Marque artisanale tunisienne dédiée à la créativité, au fait-main et à l'upcycling.";
  const instagram = settings?.instagram || "https://www.instagram.com/monempreinte.tn";
  const facebook = settings?.facebook || "https://www.facebook.com/share/18YJNytmUb";

  return (
    <footer className="bg-earth-800 text-cream-100 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Logo size={52} showText brandName={brandName} />
            <p className="mt-4 text-cream-200 text-sm leading-relaxed">
              {description}
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
                {settings?.whatsappNumber ? `+216 ${settings.whatsappNumber.slice(3)}` : "+216 93 494 954"}
              </a>
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-cream-200 hover:text-white transition-colors"
              >
                <InstagramIcon size={18} />
                Instagram
              </a>
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-cream-200 hover:text-white transition-colors"
              >
                <FacebookIcon size={18} />
                Facebook
              </a>
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2 text-cream-200 hover:text-white transition-colors"
                >
                  {settings.email}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-earth-700 text-center text-sm text-cream-300">
          © {new Date().getFullYear()} {brandName}. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}