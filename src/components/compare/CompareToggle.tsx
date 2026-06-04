"use client";

import { GitCompare, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { VehicleWithImages } from "@/types/vehicle";
import { useCompare } from "@/components/compare/compare-context";

/**
 * Control "Comparar" para la tarjeta de vehículo. Agrega/quita el auto de la
 * selección global (máx. 3). Se deshabilita si la selección está llena y este
 * auto no está incluido.
 */
export function CompareToggle({
  vehicle,
  className,
}: {
  vehicle: VehicleWithImages;
  className?: string;
}) {
  const { has, toggle, isFull } = useCompare();
  const selected = has(vehicle.slug);
  const disabled = !selected && isFull;

  return (
    <button
      type="button"
      onClick={() => toggle(vehicle)}
      disabled={disabled}
      aria-pressed={selected}
      title={
        disabled
          ? "Máximo 3 autos para comparar"
          : selected
            ? "Quitar de la comparación"
            : "Agregar a la comparación"
      }
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium backdrop-blur transition-colors",
        selected
          ? "border-primary bg-primary/15 text-primary"
          : "border-border bg-background/70 text-muted-foreground hover:text-foreground",
        disabled && "cursor-not-allowed opacity-50 hover:text-muted-foreground",
        className
      )}
    >
      {selected ? (
        <Check className="size-3.5" aria-hidden />
      ) : (
        <GitCompare className="size-3.5" aria-hidden />
      )}
      {selected ? "Comparando" : "Comparar"}
    </button>
  );
}
