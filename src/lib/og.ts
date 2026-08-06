// src/lib/og.ts

interface OGImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

export function generateOGImage(
  imageUrl: string,
  title: string,
  siteName: string = "Mon Empreinte"
): OGImage {
  // If no image, use the default logo
  const defaultImage = "/logo.png";
  
  // Use the first image from the product/workshop, or fallback
  const url = imageUrl || defaultImage;
  
  return {
    url,
    width: 1200,
    height: 630,
    alt: `${title} - ${siteName}`,
  };
}

export function generateOGTags(
  title: string,
  description: string,
  imageUrl: string,
  url: string,
  siteName: string = "Mon Empreinte"
) {
  const ogImage = generateOGImage(imageUrl, title, siteName);
  
  return {
    title: `${title} | ${siteName}`,
    description,
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url,
      siteName,
      images: [
        {
          url: ogImage.url,
          width: ogImage.width,
          height: ogImage.height,
          alt: ogImage.alt,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description,
      images: [ogImage.url],
    },
  };
}