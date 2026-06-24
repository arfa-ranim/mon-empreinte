"use client";

import PublicLayout from "@/components/PublicLayout";
import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/SocialIcons";
import Button from "@/components/Button";
import { WHATSAPP_DISPLAY, SOCIAL_LINKS } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const whatsappUrl = buildWhatsAppUrl("Bonjour ! Je souhaite vous contacter.");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } else {
      setStatus("error");
    }
  }

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
                WhatsApp — {WHATSAPP_DISPLAY}
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
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-earth-100 shadow-sm space-y-5">
              <h2 className="font-serif text-xl font-semibold text-earth-800">Envoyez-nous un message</h2>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-earth-700 mb-1">
                  Nom
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:outline-none focus:ring-2 focus:ring-mint bg-cream-50"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-earth-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:outline-none focus:ring-2 focus:ring-mint bg-cream-50"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-earth-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:outline-none focus:ring-2 focus:ring-mint bg-cream-50 resize-none"
                />
              </div>

              <Button type="submit" disabled={status === "loading"} className="w-full">
                <Send size={18} />
                {status === "loading" ? "Envoi..." : "Envoyer"}
              </Button>

              {status === "success" && (
                <p className="text-green-600 text-sm text-center">Message envoyé avec succès !</p>
              )}
              {status === "error" && (
                <p className="text-red-600 text-sm text-center">Erreur lors de l&apos;envoi. Réessayez.</p>
              )}
            </form>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
