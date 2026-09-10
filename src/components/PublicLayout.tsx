import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getBrandSettings } from "@/lib/settings";
import PageTransition from "./PageTransition";
import ErrorBoundary from "./ErrorBoundary";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getBrandSettings();

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 dark:bg-earth-900 transition-colors duration-300">
      <Navbar settings={settings} />
      <PageTransition>
        {/* ✅ No max-w wrapper — pages control their own layout.
            Hero can now go edge-to-edge. */}
        <main className="flex-1 pt-16">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </PageTransition>
      <Footer settings={settings} />
    </div>
  );
}