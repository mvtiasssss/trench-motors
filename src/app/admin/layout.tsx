import { getAdminUser } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin — Trench Motors",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();

  // Sin sesión (p. ej. /admin/login): se muestra el contenido sin el shell.
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background md:grid md:grid-cols-[260px_1fr]">
      <AdminSidebar userEmail={user.email ?? "Administrador"} />
      <div className="flex min-w-0 flex-col">
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <span className="text-sm text-muted-foreground">
            Panel de administración
          </span>
          <span className="text-sm font-medium text-foreground">
            {user.email}
          </span>
        </header>
        <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
