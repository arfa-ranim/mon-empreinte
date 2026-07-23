import { prisma } from "@/lib/prisma";
import PublicLayout from "@/components/PublicLayout";
import WishlistContent from "@/components/WishlistContent";

export const metadata = {
  title: "Mes favoris",
};

// This is a Server Component
export default async function FavorisPage() {
  // Fetch all products (or a reasonable limit)
  const products = await prisma.product.findMany({
    take: 100, // Get enough products for the wishlist
    orderBy: { createdAt: "desc" },
  });

  return (
    <PublicLayout>
      <div className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <WishlistContent initialProducts={products} />
        </div>
      </div>
    </PublicLayout>
  );
}