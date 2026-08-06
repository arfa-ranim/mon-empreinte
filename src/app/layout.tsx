import type { Metadata } from "next";
import { Cormorant_Garamond, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/constants";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import BackToTop from "@/components/BackToTop";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
export const metadataBase = new URL("https://mon-empreinte.vercel.app");

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} — Créations artisanales à Tunis`,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.description,

    appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mon Empreinte",
  },
  formatDetection: {
    telephone: true,
  },
    openGraph: {
    title: `${BRAND.name} — Créations artisanales à Tunis`,
    description: BRAND.description,
    url: "https://mon-empreinte.vercel.app",
    siteName: BRAND.name,
    // Add this line below 👇
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: BRAND.name }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html 
      lang="fr" 
      className={`${cormorant.variable} ${nunito.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased bg-cream-50 dark:bg-earth-900 transition-colors duration-300">
        <ThemeProvider>
          {children}
          <Toaster 
            position="top-center"
            richColors
            closeButton
            toastOptions={{
              style: {
                fontFamily: 'var(--font-nunito)',
              },
            }}
          />
        </ThemeProvider>
        <BackToTop />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}