import { VehicleForm } from "@/components/admin/VehicleForm";

export const metadata = { title: "Publicar vehículo — Admin" };

export default function NuevoVehiculoPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
        Publicar vehículo
      </h1>
      <VehicleForm />
    </div>
  );
}
