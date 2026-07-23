import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import { parseImages } from "@/lib/utils";
import { buildWhatsAppUrl, workshopBookingMessage } from "@/lib/whatsapp";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import WorkshopDetailClient from "./WorkshopDetailClient";

// Define types
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
  return { title: workshop?.title || "Atelier" };
}

// Server function to fetch workshop
async function getWorkshop(id: string): Promise<Workshop> {
  const workshop = await prisma.workshop.findUnique({ where: { id } });
  if (!workshop) notFound();
  return workshop as Workshop;
}

// Main page component (Server Component)
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
            className="text-earth-600 hover:text-earth-800 text-sm mb-6 inline-block"
          >
            ← Retour aux ateliers
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