import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="pt-14 pl-48 min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </>
  );
}
