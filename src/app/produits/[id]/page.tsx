// app/produits/[id]/page.tsx
import PublicLayout from "@/components/PublicLayout";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { parseImages, formatPrice } from "@/lib/utils";
import { buildWhatsAppUrl, productOrderMessage } from "@/lib/whatsapp";
import { WHATSAPP_NUMBER } from "@/lib/constants"; // ← ADD THIS
import Button from "@/components/Button";
import Link from "next/link";
import { ProductDetailSkeleton } from "@/components/Skeleton";
import { Suspense } from "react";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  return { title: product?.title || "Produit" };
}

async function ProductDetail({ id }: { id: string }) {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) notFound();

  const images = parseImages(product.images);
  const whatsappUrl = buildWhatsAppUrl(
    WHATSAPP_NUMBER, // ← Pass the number first
    productOrderMessage(product.title, product.price)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="space-y-4">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream-100">
          <Image
            src={images[0] || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {images.slice(1).map((img) => (
              <div key={img} className="relative aspect-square rounded-lg overflow-hidden bg-cream-100">
                <Image src={img} alt="" fill className="object-cover" sizes="100px" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        {product.category && (
          <span className="text-sm text-earth-500 uppercase tracking-wider">{product.category}</span>
        )}
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-earth-800 mt-2">
          {product.title}
        </h1>
        <p className="mt-4 text-2xl font-semibold text-earth-700">{formatPrice(product.price)}</p>
        {!product.inStock && (
          <span className="inline-block mt-2 text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full">
            Rupture de stock
          </span>
        )}
        <p className="mt-6 text-earth-600 leading-relaxed whitespace-pre-line">
          {product.description}
        </p>
        <div className="mt-8">
          <Button href={whatsappUrl} variant="whatsapp" external className="text-base px-8 py-4">
            <MessageCircle size={20} />
            Commander via WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <PublicLayout>
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <Link href="/produits" className="text-earth-600 hover:text-earth-800 text-sm mb-6 inline-block">
            ← Retour aux produits
          </Link>

          <Suspense fallback={<ProductDetailSkeleton />}>
            <ProductDetail id={id} />
          </Suspense>
        </div>
      </section>
    </PublicLayout>
  );
}