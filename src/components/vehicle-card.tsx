import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import type { VehicleWithImages } from "@/types/vehicle";
import { cn } from "@/lib/utils";
import { formatCLP, formatKm } from "@/lib/format";
import { cuotaDesde } from "@/lib/finance";
import { BLUR_DATA_URL } from "@/lib/image";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

interface VehicleCardProps {
  vehicle: VehicleWithImages;
  className?: string;
}

export function VehicleCard({ vehicle, className }: VehicleCardProps) {
  const {
    slug,
    marca,
    modelo,
    version,
    anio,
    kilometraje,
    precio,
    condicion,
    destacado,
    vendido,
    imagenes,
  } = vehicle;

  const principal = imagenes.find((img) => img.es_principal) ?? imagenes[0];
  const foto = principal?.url;

  // Cuota estimada con supuestos por defecto (misma fórmula que el simulador).
  const cuota = cuotaDesde(precio);

  // Badge de estado: si está vendido prima sobre la condición.
  const estado: { variant: NonNullable<BadgeProps["variant"]>; label: string } =
    vendido
      ? { variant: "vendido", label: "Vendido" }
      : condicion === "nuevo"
        ? { variant: "nuevo", label: "Nuevo" }
        : { variant: "financiable", label: "Usado" };

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border bg-card text-card-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10",
        className
      )}
    >
      {/* Imagen 16:9 */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {foto ? (
          <Image
            src={foto}
            alt={`${marca} ${modelo} ${anio}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className={cn(
              "object-cover transition-transform duration-500 group-hover:scale-105",
              vendido && "opacity-60 grayscale"
            )}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            Sin imagen
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge variant={estado.variant}>{estado.label}</Badge>
          {destacado && !vendido ? (
            <Badge variant="oportunidad">Destacado</Badge>
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
            {version ? ` ${version}` : ""}
          </h3>
          <p className="text-sm text-muted-foreground">
            {anio} · {formatKm(kilometraje)}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Precio</span>
            <span className="font-display text-xl font-bold text-foreground">
              {formatCLP(precio)}
            </span>
            {!vendido && cuota > 0 ? (
              <span className="mt-0.5 text-xs text-muted-foreground">
                Cuota desde{" "}
                <span className="font-medium text-primary">
                  {formatCLP(cuota)}
                </span>
                /mes
              </span>
            ) : null}
          </div>
          <Link
            href={`/vehiculo/${slug}`}
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "shrink-0"
            )}
            aria-disabled={vendido}
          >
            Ver detalle
          </Link>
        </div>
      </div>
    </article>
  );
}
