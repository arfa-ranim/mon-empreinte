import { prisma } from "@/lib/prisma";

export default async function sitemap() {
  const baseUrl = "https://mon-empreinte.vercel.app";

  const [products, workshops] = await Promise.all([
    prisma.product.findMany({ select: { id: true, updatedAt: true } }),
    prisma.workshop.findMany({ select: { id: true, updatedAt: true } }),
  ]);

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/produits/${product.id}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const workshopUrls = workshops.map((workshop) => ({
    url: `${baseUrl}/ateliers/${workshop.id}`,
    lastModified: workshop.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      // ✅ Static pages: no lastModified — signals "this changes rarely"
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/produits`,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ateliers`,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/galerie`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/a-propos`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    ...productUrls,
    ...workshopUrls,
  ];
}