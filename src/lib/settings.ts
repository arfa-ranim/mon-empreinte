import { prisma } from "@/lib/prisma";

const DEFAULT_SETTINGS = {
  brandName: "Mon Empreinte",
  tagline: "Créations artisanales & ateliers créatifs à Tunis",
  description: "Marque artisanale tunisienne dédiée à la créativité, au fait-main et à l'upcycling. Chaque pièce raconte une histoire unique.",
  whatsappNumber: "21693494954",
  instagram: "https://www.instagram.com/monempreinte.tn?igsh=YXk2Z294ZzQwMjQ5",
  facebook: "https://www.facebook.com/share/18YJNytmUb/?mibextid=wwXIfr",
  address: "",
  email: "contact@monempreinte.tn",
  logo: "/logo.png",
};

export async function getBrandSettings() {
  try {
    const record = await prisma.setting.findUnique({
      where: { key: "brand_settings" },
    });
    
    if (!record) {
      return DEFAULT_SETTINGS;
    }
    
    return { ...DEFAULT_SETTINGS, ...JSON.parse(record.value) };
  } catch (error) {
    console.error("Error fetching settings:", error);
    return DEFAULT_SETTINGS;
  }
}

// For client-side usage
export async function getBrandSettingsClient() {
  const res = await fetch("/api/settings");
  if (!res.ok) {
    return DEFAULT_SETTINGS;
  }
  return res.json();
}