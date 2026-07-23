import PublicLayout from "@/components/PublicLayout";
import { MessageCircle, Send } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/SocialIcons";
import Button from "@/components/Button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { getBrandSettings } from "@/lib/settings";

export default async function ContactPage() {
  const settings = await getBrandSettings();

  const whatsappUrl = buildWhatsAppUrl(
    settings?.whatsappNumber || "21693494954",
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
                WhatsApp — {settings?.whatsappNumber ? `+216 ${settings.whatsappNumber.slice(3)}` : "+216 93 494 954"}
              </Button>

              <div className="space-y-3">
                <a
                  href={settings?.instagram || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-earth-700 hover:text-earth-900 transition-colors"
                >
                  <InstagramIcon size={22} />
                  Instagram — @mon.empreinte.tn
                </a>
                <a
                  href={settings?.facebook || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-earth-700 hover:text-earth-900 transition-colors"
                >
                  <FacebookIcon size={22} />
                  Facebook — Mon Empreinte
                </a>
                {settings?.email && (
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-center gap-3 text-earth-700 hover:text-earth-900 transition-colors"
                  >
                    ✉️ {settings.email}
                  </a>
                )}
              </div>
            </div>

            <form action="/api/contact" method="POST" className="bg-white rounded-2xl p-6 sm:p-8 border border-earth-100 shadow-sm space-y-5">
              <h2 className="font-serif text-xl font-semibold text-earth-800">Envoyez-nous un message</h2>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-earth-700 mb-1">
                  Nom
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:outline-none focus:ring-2 focus:ring-mint bg-cream-50"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-earth-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:outline-none focus:ring-2 focus:ring-mint bg-cream-50"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-earth-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:outline-none focus:ring-2 focus:ring-mint bg-cream-50 resize-none"
                />
              </div>

              <Button type="submit" className="w-full">
                <Send size={18} />
                Envoyer
              </Button>
            </form>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}