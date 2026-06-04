import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AdminVehicleTable } from "@/components/admin/AdminVehicleTable";
import { getVehicles } from "@/lib/vehicles";
import type { VehicleWithImages } from "@/types/vehicle";

export const metadata = { title: "Vehículos — Admin" };

export default async function AdminVehiclesPage() {
  let vehiculos: VehicleWithImages[] = [];
  try {
    const { data } = await getVehicles({
      incluirVendidos: true,
      perPage: 1000,
      orden: "recientes",
    });
    vehiculos = data;
  } catch {
    vehiculos = [];
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
            Vehículos
          </h1>
          <p className="text-sm text-muted-foreground">
            {vehiculos.length}{" "}
            {vehiculos.length === 1 ? "vehículo" : "vehículos"} en total.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/vehiculos/nuevo">
            <Plus className="size-4" aria-hidden />
            Publicar vehículo
          </Link>
        </Button>
      </div>

      <AdminVehicleTable vehicles={vehiculos} />
    </div>
  );
}
