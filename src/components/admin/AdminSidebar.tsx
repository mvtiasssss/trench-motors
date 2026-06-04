"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Car, Inbox, LogOut } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  const dashboardActive = pathname === "/admin";
  const vehiculosActive = pathname.startsWith("/admin/vehiculos");
  const leadsActive = pathname.startsWith("/admin/leads");

  const linkClass = (active: boolean) =>
    cn(
      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
      active
        ? "bg-primary text-primary-foreground"
        : "text-foreground/80 hover:bg-secondary hover:text-foreground"
    );

  return (
    <aside className="flex flex-col gap-6 border-b border-border bg-card p-4 md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r">
      <Link
        href="/admin"
        className="font-display text-lg font-extrabold uppercase tracking-wide text-foreground"
      >
        Trench <span className="text-primary">Admin</span>
      </Link>

      <nav className="flex flex-1 flex-row gap-1 md:flex-col">
        <Link href="/admin" className={linkClass(dashboardActive)}>
          <LayoutDashboard className="size-4" aria-hidden />
          Dashboard
        </Link>
        <Link href="/admin/vehiculos" className={linkClass(vehiculosActive)}>
          <Car className="size-4" aria-hidden />
          Vehículos
        </Link>
        <Link href="/admin/leads" className={linkClass(leadsActive)}>
          <Inbox className="size-4" aria-hidden />
          Leads
        </Link>
      </nav>

      <form action="/api/admin/logout" method="post" className="md:mt-auto">
        <p className="mb-2 truncate text-xs text-muted-foreground" title={userEmail}>
          {userEmail}
        </p>
        <Button type="submit" variant="outline" className="w-full gap-2">
          <LogOut className="size-4" aria-hidden />
          Cerrar sesión
        </Button>
      </form>
    </aside>
  );
}
