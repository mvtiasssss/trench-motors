import { notFound } from "next/navigation";

import { getVehicleById } from "@/lib/vehicles";
import { VehicleForm } from "@/components/admin/VehicleForm";
import type { VehicleWithImages } from "@/types/vehicle";

export const metadata = { title: "Editar vehículo — Admin" };

export default async function EditarVehiculoPage({
  params,
}: {
  params: { id: string };
}) {
  let vehicle: VehicleWithImages | null = null;
  try {
    vehicle = await getVehicleById(params.id);
  } catch {
    vehicle = null;
  }
  if (!vehicle) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
        Editar vehículo
      </h1>
      <VehicleForm vehicle={vehicle} />
    </div>
  );
}
