"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardData() {
  try {
    const [productCount, workshopCount, messageCount, recentProducts, recentWorkshops] = await Promise.all([
      prisma.product.count(),
      prisma.workshop.count(),
      prisma.contactMessage.count(),
      prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.workshop.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

    return {
      stats: { productCount, workshopCount, messageCount },
      recentProducts,
      recentWorkshops,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      stats: { productCount: 0, workshopCount: 0, messageCount: 0 },
      recentProducts: [],
      recentWorkshops: [],
    };
  }
}