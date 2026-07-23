import type { Metadata } from "next";
import { Cormorant_Garamond, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/constants";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import BackToTop from "@/components/BackToTop";


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

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} — Créations artisanales à Tunis`,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="fr" 
      className={`${cormorant.variable} ${nunito.variable} h-full`}
      data-scroll-behavior="smooth" 
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased">
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
      </body>
    </html>
  );
}