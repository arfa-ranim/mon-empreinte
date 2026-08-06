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
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/produits`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ateliers`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    ...productUrls,
    ...workshopUrls,
  ];
}