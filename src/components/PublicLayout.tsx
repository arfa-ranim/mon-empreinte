import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getBrandSettings } from "@/lib/settings";
import PageTransition from "./PageTransition";
import ErrorBoundary from "./ErrorBoundary";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getBrandSettings();
  
  return (
    <div className="min-h-screen flex flex-col bg-cream-50 dark:bg-earth-900 transition-colors duration-300">
      <Navbar settings={settings} />
      <PageTransition>
        <main className="flex-1 pt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <Breadcrumbs />
            {/* ✅ Wrap with ErrorBoundary */}
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
        </main>
      </PageTransition>
      <Footer settings={settings} />
    </div>
  );
}