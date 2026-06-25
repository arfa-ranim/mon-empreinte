"use client";

import { useState, useEffect } from "react";
import Button from "@/components/Button";
import ImageUpload from "@/components/ImageUpload";
import {
  Building, Mail, Phone, MapPin,
  Globe, MessageCircle, Save, ChevronDown, ChevronUp
} from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/SocialIcons";
import { toast } from "sonner";

interface Settings {
  brandName: string;
  tagline: string;
  description: string;
  whatsappNumber: string;
  instagram: string;
  facebook: string;
  address: string;
  email: string;
  logo: string;
}

const SectionHeader = ({ 
  title, 
  icon, 
  section, 
  isOpen, 
  onToggle 
}: { 
  title: string; 
  icon: React.ReactNode; 
  section: "brand" | "contact" | "social";
  isOpen: boolean;
  onToggle: (section: "brand" | "contact" | "social") => void;
}) => (
  <button
    type="button"
    onClick={() => onToggle(section)}
    className="w-full flex items-center justify-between py-2 hover:bg-cream-50 px-2 -mx-2 rounded-lg transition-colors touch-manipulation"
  >
    <div className="flex items-center gap-2">
      {icon}
      <h2 className="font-serif text-lg sm:text-xl font-semibold text-earth-800">
        {title}
      </h2>
    </div>
    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
  </button>
);

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [sections, setSections] = useState({
    brand: true,
    contact: true,
    social: true,
  });
  
  const [settings, setSettings] = useState<Settings>({
    brandName: "",
    tagline: "",
    description: "",
    whatsappNumber: "",
    instagram: "",
    facebook: "",
    address: "",
    email: "",
    logo: "/logo.png",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, []);

  const toggleSection = (section: "brand" | "contact" | "social") => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    if (res.ok) {
      toast.success("Paramètres enregistrés avec succès ! ✅");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      toast.error("Erreur lors de l'enregistrement");
    }
    setLoading(false);
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-50">
        <p className="text-earth-500">Chargement des paramètres...</p>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-4 md:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-earth-800">
            Paramètres du site
          </h1>
          <p className="text-sm sm:text-base text-earth-500 mt-1">
            Personnalisez l{"'"}identité de votre marque
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
        {/* Brand Identity */}
        <section className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm">
          <SectionHeader 
            title="Identité de la marque" 
            icon={<Building className="text-peach" size={20} />}
            section="brand"
            isOpen={sections.brand}
            onToggle={toggleSection}
          />
          
          {sections.brand && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="brandName" className="block text-sm font-medium text-earth-700 mb-1">
                    Nom de la marque *
                  </label>
                  <input
                    id="brandName"
                    required
                    value={settings.brandName}
                    onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-peach focus:border-transparent text-base sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="tagline" className="block text-sm font-medium text-earth-700 mb-1">
                    Slogan
                  </label>
                  <input
                    id="tagline"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-peach focus:border-transparent text-base sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-earth-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-peach focus:border-transparent resize-none text-base sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">
                  Logo
                </label>
                <ImageUpload 
                  images={[settings.logo]} 
                  onChange={(images) => setSettings({ ...settings, logo: images[0] || "/logo.png" })} 
                />
              </div>
            </div>
          )}
        </section>

        {/* Contact Information */}
        <section className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm">
          <SectionHeader 
            title="Coordonnées" 
            icon={<Phone className="text-mint" size={20} />}
            section="contact"
            isOpen={sections.contact}
            onToggle={toggleSection}
          />
          
          {sections.contact && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="whatsappNumber" className="block text-sm font-medium text-earth-700 mb-1">
                    WhatsApp (numéro) *
                  </label>
                  <div className="relative">
                    <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400" size={18} />
                    <input
                      id="whatsappNumber"
                      required
                      value={settings.whatsappNumber}
                      onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-peach focus:border-transparent text-base sm:text-sm"
                      placeholder="21693494954"
                    />
                  </div>
                  <p className="text-xs text-earth-400 mt-1">Format: sans le + (ex: 21693494954)</p>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-earth-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400" size={18} />
                    <input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-peach focus:border-transparent text-base sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-earth-700 mb-1">
                  Adresse
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400" size={18} />
                  <input
                    id="address"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-peach focus:border-transparent text-base sm:text-sm"
                    placeholder="Adresse physique"
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Social Links */}
        <section className="bg-white rounded-2xl p-4 sm:p-6 border border-earth-100 shadow-sm">
          <SectionHeader 
            title="Réseaux sociaux" 
            icon={<Globe className="text-lavender" size={20} />}
            section="social"
            isOpen={sections.social}
            onToggle={toggleSection}
          />
          
          {sections.social && (
            <div className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium text-earth-700 mb-1">
                    Instagram
                  </label>
                  <div className="relative">
                    <InstagramIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400" />
                    <input
                      id="instagram"
                      value={settings.instagram}
                      onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-peach focus:border-transparent text-base sm:text-sm"
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="facebook" className="block text-sm font-medium text-earth-700 mb-1">
                    Facebook
                  </label>
                  <div className="relative">
                    <FacebookIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400" />
                    <input
                      id="facebook"
                      value={settings.facebook}
                      onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-earth-200 focus:ring-2 focus:ring-peach focus:border-transparent text-base sm:text-sm"
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Save Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pt-2">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto px-6 sm:px-8 py-3 text-base">
            <Save size={18} />
            {loading ? "Enregistrement..." : "Enregistrer"}
          </Button>
          
          {saved && (
            <span className="text-green-600 text-sm font-medium">
              ✅ Modifications enregistrées !
            </span>
          )}
        </div>
      </form>
    </div>
  );
}