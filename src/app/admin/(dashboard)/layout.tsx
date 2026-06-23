import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-cream-50">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">{children}</main>
    </div>
  );
}
