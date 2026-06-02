import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import type { Vehicle, VehicleCondition } from "@/types/vehicle";
import { cn } from "@/lib/utils";
import { formatCLP, formatKm } from "@/lib/format";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

interface VehicleCardProps {
  vehicle: Vehicle;
  className?: string;
}

/** Mapea la condición del vehículo a la variante y etiqueta del badge. */
const conditionBadge: Record<
  VehicleCondition,
  { variant: NonNullable<BadgeProps["variant"]>; label: string }
> = {
  nuevo: { variant: "nuevo", label: "Nuevo" },
  usado: { variant: "financiable", label: "Usado" },
  oportunidad: { variant: "oportunidad", label: "Oportunidad" },
  vendido: { variant: "vendido", label: "Vendido" },
};

export function VehicleCard({ vehicle, className }: VehicleCardProps) {
  const { slug, marca, modelo, anio, km, precio, condicion, foto, financiable } =
    vehicle;
  const badge = conditionBadge[condicion];
  const isSold = condicion === "vendido";

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border bg-card text-card-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10",
        className
      )}
    >
      {/* Imagen 16:9 */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={foto}
          alt={`${marca} ${modelo} ${anio}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={cn(
            "object-cover transition-transform duration-500 group-hover:scale-105",
            isSold && "opacity-60 grayscale"
          )}
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge variant={badge.variant}>{badge.label}</Badge>
          {financiable && !isSold ? (
            <Badge variant="financiable">Financiable</Badge>
          ) : null}
        </div>
      </div>

      {/* Contenido */}
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {marca}
          </p>
          <h3 className="font-display text-lg font-semibold leading-tight text-foreground">
            {modelo}
          </h3>
          <p className="text-sm text-muted-foreground">
            {anio} · {formatKm(km)}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Precio</span>
            <span className="font-display text-xl font-bold text-foreground">
              {formatCLP(precio)}
            </span>
          </div>
          <Link
            href={`/vehiculo/${slug}`}
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "shrink-0"
            )}
            aria-disabled={isSold}
          >
            Ver detalle
          </Link>
        </div>
      </div>
    </article>
  );
}
