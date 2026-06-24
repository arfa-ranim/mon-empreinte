import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

const workshopSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  duration: z.string().min(1),
  images: z.array(z.string()).default([]),
  availability: z.string().optional(),
  date: z.string().nullable().optional(),
});

export async function GET() {
  const workshops = await prisma.workshop.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(workshops);
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const data = workshopSchema.parse(body);

    const workshop = await prisma.workshop.create({
      data: {
        ...data,
        images: JSON.stringify(data.images),
      },
    });

    return NextResponse.json(workshop, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides", details: error.issues }, { status: 400 });
    }
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
