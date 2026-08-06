import PublicLayout from "@/components/PublicLayout";
import { MessageCircle } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/SocialIcons";
import Button from "@/components/Button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { WHATSAPP_NUMBER, SOCIAL_LINKS } from "@/lib/constants";
import ContactForm from "./ContactForm"; // ✅ Import the new separated form

export default function ContactPage() {
  const whatsappUrl = buildWhatsAppUrl(
    WHATSAPP_NUMBER,
    "Bonjour ! Je souhaite vous contacter."
  );

  return (
    <PublicLayout>
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl font-bold text-earth-800">Contact</h1>
            <p className="mt-3 text-earth-600">
              Une question ? N&apos;hésitez pas à nous contacter
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-semibold text-earth-800">Nous joindre</h2>

              <Button href={whatsappUrl} variant="primary" external className="w-full sm:w-auto">
                <MessageCircle size={20} />
                WhatsApp — +216 93 494 954
              </Button>

              <div className="space-y-3">
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-earth-700 hover:text-earth-900 transition-colors"
                >
                  <InstagramIcon size={22} />
                  Instagram — @mon.empreinte.tn
                </a>
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-earth-700 hover:text-earth-900 transition-colors"
                >
                  <FacebookIcon size={22} />
                  Facebook — Mon Empreinte
                </a>
                <a
                  href="mailto:contact@monempreinte.tn"
                  className="flex items-center gap-3 text-earth-700 hover:text-earth-900 transition-colors"
                >
                  ✉️ contact@monempreinte.tn
                </a>
              </div>
            </div>

            {/* Render the client form here */}
            <ContactForm />
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}