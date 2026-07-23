import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getBrandSettings } from "@/lib/settings";
import PageTransition from "./PageTransition";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getBrandSettings();
  
  return (
    <>
      <Navbar settings={settings} />
      <PageTransition>
        <main className="grow">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <Breadcrumbs />
            {children}
          </div>
        </main>
      </PageTransition>
      <Footer settings={settings} />
    </>
  );
}