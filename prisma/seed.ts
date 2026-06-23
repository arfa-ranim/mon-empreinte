import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@monempreinte.tn";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: await hashPassword(password),
      name: "Administrateur",
    },
  });

  const productCount = await prisma.product.count();
  if (productCount === 0) {
    await prisma.product.createMany({
      data: [
        {
          title: "Sac en macramé naturel",
          description:
            "Sac artisanal tissé à la main en coton naturel. Parfait pour un style bohème et éco-responsable.",
          price: 85,
          category: "Accessoires",
          inStock: true,
          images: JSON.stringify(["/placeholder.svg"]),
        },
        {
          title: "Bougie parfumée artisanale",
          description:
            "Bougie coulée à la main avec des cires végétales et des huiles essentielles naturelles.",
          price: 35,
          category: "Décoration",
          inStock: true,
          images: JSON.stringify(["/placeholder.svg"]),
        },
        {
          title: "Coussin upcyclé patchwork",
          description:
            "Coussin unique créé à partir de tissus récupérés, chaque pièce est une œuvre originale.",
          price: 55,
          category: "Textile",
          inStock: true,
          images: JSON.stringify(["/placeholder.svg"]),
        },
        {
          title: "Porte-clés en cuir recyclé",
          description:
            "Petit accessoire fait main à partir de chutes de cuir, gravé avec soin.",
          price: 20,
          category: "Accessoires",
          inStock: true,
          images: JSON.stringify(["/placeholder.svg"]),
        },
      ],
    });
  }

  const workshopCount = await prisma.workshop.count();
  if (workshopCount === 0) {
    await prisma.workshop.createMany({
      data: [
        {
          title: "Atelier Macramé Débutant",
          description:
            "Apprenez les bases du macramé et repartez avec votre propre suspension murale.",
          price: 60,
          duration: "3 heures",
          availability: "Samedis",
          images: JSON.stringify(["/placeholder.svg"]),
        },
        {
          title: "Atelier Bougies Naturelles",
          description:
            "Découvrez l'art de la bougie artisanale avec des matériaux naturels et des parfums doux.",
          price: 50,
          duration: "2 heures",
          availability: "Dimanches",
          images: JSON.stringify(["/placeholder.svg"]),
        },
        {
          title: "Atelier Upcycling Textile",
          description:
            "Transformez vos vieux tissus en objets déco uniques grâce aux techniques d'upcycling.",
          price: 45,
          duration: "2h30",
          availability: "Sur demande",
          images: JSON.stringify(["/placeholder.svg"]),
        },
      ],
    });
  }

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
