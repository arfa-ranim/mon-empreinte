import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

const productSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  images: z.array(z.string()).default([]),
  category: z.string().optional(),
  inStock: z.boolean().default(true),
  sku: z.string().optional(),
  weight: z.number().nullable().optional(),
  dimensions: z.string().optional(),
  tags: z.string().optional(),
  featured: z.boolean().default(false),
});

// GET - List products with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count(),
    ]);

    return NextResponse.json({
      data: products,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json({ data: [], meta: { page: 1, limit: 12, total: 0, totalPages: 0 } });
  }
}

// POST - Create product
export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const data = productSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        ...data,
        images: JSON.stringify(data.images),
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides", details: error.issues }, { status: 400 });
    }
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    console.error("Product creation error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}