import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

const settingsSchema = z.object({
  brandName: z.string().min(1),
  tagline: z.string(),
  description: z.string(),
  whatsappNumber: z.string().min(1),
  instagram: z.string().url(),
  facebook: z.string().url(),
  address: z.string().optional(),
  email: z.string().email(),
  logo: z.string(),
});

const DEFAULT_SETTINGS = {
  brandName: "Mon Empreinte",
  tagline: "Créations artisanales & ateliers créatifs à Tunis",
  description: "Marque artisanale tunisienne dédiée à la créativité, au fait-main et à l'upcycling. Chaque pièce raconte une histoire unique.",
  whatsappNumber: "21693494954",
  instagram: "https://www.instagram.com/monempreinte.tn",
  facebook: "https://www.facebook.com/share/18YJNytmUb",
  address: "",
  email: "contact@monempreinte.tn",
  logo: "/logo.png",
};

// Define the type for settings data
type SettingsData = z.infer<typeof settingsSchema>;

async function getSettings(): Promise<SettingsData> {
  const record = await prisma.setting.findUnique({
    where: { key: "brand_settings" },
  });
  
  if (!record) {
    // Create default settings if they don't exist
    const newRecord = await prisma.setting.create({
      data: {
        key: "brand_settings",
        value: JSON.stringify(DEFAULT_SETTINGS),
      },
    });
    return JSON.parse(newRecord.value);
  }
  
  return JSON.parse(record.value);
}

async function saveSettings(data: SettingsData) {
  await prisma.setting.upsert({
    where: { key: "brand_settings" },
    update: { value: JSON.stringify(data) },
    create: {
      key: "brand_settings",
      value: JSON.stringify(data),
    },
  });
}

export async function GET() {
  try {
    await requireAuth();
    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const data = settingsSchema.parse(body);
    
    await saveSettings(data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    console.error("Settings save error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}