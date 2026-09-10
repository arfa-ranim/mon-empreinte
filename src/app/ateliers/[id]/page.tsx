import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import { parseImages } from "@/lib/utils";
import { buildWhatsAppUrl, workshopBookingMessage } from "@/lib/whatsapp";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import WorkshopDetailClient from "./WorkshopDetailClient";
import { generateOGTags } from "@/lib/og";
import { BRAND } from "@/lib/constants";

interface Workshop {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  images: string;
  startDate: Date | null;
  endDate: Date | null;
  startTime: string | null;
  endTime: string | null;
  availableSeats: number | null;
  maxSpots: number | null;
  status: string | null;
  location: string | null;
  materials: string | null;
  skillLevel: string | null;
  availability: string | null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workshop = await prisma.workshop.findUnique({ where: { id } });

  if (!workshop) {
    return { title: "Atelier non trouvé" };
  }

  const images = parseImages(workshop.images);
  const imageUrl = images[0] || "/logo.png";

  const ogTags = generateOGTags(
    workshop.title,
    workshop.description,
    imageUrl,
    `/ateliers/${id}`,
    BRAND.name
  );

  return {
    title: ogTags.title,
    description: ogTags.description,
    openGraph: ogTags.openGraph,
    twitter: ogTags.twitter,
  };
}

async function getWorkshop(id: string): Promise<Workshop> {
  const workshop = await prisma.workshop.findUnique({ where: { id } });
  if (!workshop) notFound();
  return workshop as Workshop;
}

export default async function WorkshopDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workshop = await getWorkshop(id);
  const images = parseImages(workshop.images);
  const whatsappUrl = buildWhatsAppUrl(
    WHATSAPP_NUMBER,
    workshopBookingMessage(workshop.title, workshop.price, workshop.duration || "")
  );

  return (
    <PublicLayout>
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <Link
            href="/ateliers"
            className="inline-flex items-center gap-1.5 text-earth-600 dark:text-earth-400 hover:text-earth-800 dark:hover:text-earth-200 text-sm mb-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-dark focus-visible:ring-offset-2 rounded-md px-1 py-0.5"
          >
            <ChevronLeft size={16} />
            Retour aux ateliers
          </Link>

          <WorkshopDetailClient
            workshop={workshop}
            images={images}
            whatsappUrl={whatsappUrl}
          />
        </div>
      </section>
    </PublicLayout>
  );
}