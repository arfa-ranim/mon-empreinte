import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import { parseImages, formatPrice } from "@/lib/utils";
import { buildWhatsAppUrl, productOrderMessage } from "@/lib/whatsapp";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import ProductDetailClient from "./ProductDetailClient";

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
  return { title: product?.title || "Produit" };
}

// Server function to fetch product
async function getProduct(id: string): Promise<Product> {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();
  return product as Product;
}

// Main page component (Server Component)
export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  const images = parseImages(product.images);
  const whatsappUrl = buildWhatsAppUrl(
    WHATSAPP_NUMBER,
    productOrderMessage(product.title, product.price)
  );

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

          <ProductDetailClient 
            product={product} 
            images={images} 
            whatsappUrl={whatsappUrl} 
          />
        </div>
      </section>
    </PublicLayout>
  );
}