import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getBrandSettings } from "@/lib/settings";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getBrandSettings();
  
  return (
    <>
      <Navbar settings={settings} />
      <main className="grow">{children}</main>
      <Footer settings={settings} />
    </>
  );
}