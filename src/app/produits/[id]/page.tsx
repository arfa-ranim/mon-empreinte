import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import { parseImages } from "@/lib/utils";
import ProductDetailClient from "./ProductDetailClient";
import { generateOGTags } from "@/lib/og";
import { BRAND } from "@/lib/constants";

// Define types
interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string;
  category: string | null;
  inStock: boolean;
  sku: string | null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  
  if (!product) {
    return { title: "Produit non trouvé" };
  }

  const images = parseImages(product.images);
  const imageUrl = images[0] || "/logo.png";
  
  const ogTags = generateOGTags(
    product.title,
    product.description,
    imageUrl,
    `/produits/${id}`,
    BRAND.name
  );

  return {
    title: ogTags.title,
    description: ogTags.description,
    openGraph: ogTags.openGraph,
    twitter: ogTags.twitter,
  };
}

// Server function to fetch product
async function getProduct(id: string): Promise<Product> {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();
  return product as Product;
}

// Main page component
export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  const images = parseImages(product.images);

  return (
    <PublicLayout>
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <Link 
            href="/produits" 
            className="text-earth-600 hover:text-earth-800 text-sm mb-6 inline-block"
          >
            ← Retour aux produits
          </Link>

          {/* ✅ Only pass product and images */}
          <ProductDetailClient 
            product={product} 
            images={images} 
          />
        </div>
      </section>
    </PublicLayout>
  );
}