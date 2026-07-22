import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    await requireAuth();
    const [productCount, workshopCount, messageCount] = await Promise.all([
      prisma.product.count(),
      prisma.workshop.count(),
      prisma.contactMessage.count(),
    ]);

    return NextResponse.json({ productCount, workshopCount, messageCount });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    console.error("Stats error:", error);
    return NextResponse.json({ 
      productCount: 0, 
      workshopCount: 0, 
      messageCount: 0 
    }, { status: 200 });
  }
}
