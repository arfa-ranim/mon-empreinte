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

// Define the type for the where clause
interface WhereClause {
  id?: {
    in: string[];
  };
  category?: string;
  price?: {
    lte: number;
  };
  OR?: Array<{
    [key: string]: {
      contains: string;
      mode: string;
    };
  }>;
}

// GET - List products with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;
    const ids = searchParams.get("ids");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const maxPrice = searchParams.get("maxPrice");

    // Build where clause with proper typing
    const where: WhereClause = {};
    
    // If ids parameter is provided, fetch specific products
    if (ids) {
      const idArray = ids.split(",");
      where.id = { in: idArray };
    }
    
    // Category filter
    if (category && category !== "Tous") {
      where.category = category;
    }
    
    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    
    // Price filter
    if (maxPrice) {
      where.price = { lte: parseFloat(maxPrice) };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: ids ? 0 : skip,
        take: ids ? undefined : limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      data: products,
      meta: {
        page: ids ? 1 : page,
        limit: ids ? products.length : limit,
        total,
        totalPages: ids ? 1 : Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json({ 
      data: [], 
      meta: { 
        page: 1, 
        limit: 12, 
        total: 0, 
        totalPages: 0 
      } 
    });
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
      return NextResponse.json({ 
        error: "Données invalides", 
        details: error.issues 
      }, { status: 400 });
    }
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    console.error("Product creation error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}