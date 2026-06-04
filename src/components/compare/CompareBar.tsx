"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GitCompare, X, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatCLP, formatKm } from "@/lib/format";
import { cuotaDesde } from "@/lib/finance";
import { BLUR_DATA_URL } from "@/lib/image";
import { TIPOS } from "@/lib/vehicle-options";
import type { MiniVehicle } from "@/lib/vehicle-mini";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCompare } from "@/components/compare/compare-context";

const transmisionLabel: Record<string, string> = {
  manual: "Manual",
  automatica: "Automática",
};
const combustibleLabel: Record<string, string> = {
  bencina: "Bencina",
  diesel: "Diésel",
  hibrido: "Híbrido",
  electrico: "Eléctrico",
};
const condicionLabel: Record<string, string> = {
  nuevo: "Nuevo",
  usado: "Usado",
};
function tipoLabel(tipo: string): string {
  return TIPOS.find((t) => t.value === tipo)?.label ?? tipo;
}

const FILAS: { label: string; value: (it: MiniVehicle) => React.ReactNode }[] = [
  { label: "Precio", value: (it) => formatCLP(it.precio) },
  {
    label: "Cuota desde",
    value: (it) => `${formatCLP(cuotaDesde(it.precio))}/mes`,
  },
  { label: "Año", value: (it) => it.anio },
  { label: "Kilometraje", value: (it) => formatKm(it.kilometraje) },
  {
    label: "Transmisión",
    value: (it) => transmisionLabel[it.transmision] ?? it.transmision,
  },
  {
    label: "Combustible",
    value: (it) => combustibleLabel[it.combustible] ?? it.combustible,
  },
  { label: "Tipo", value: (it) => tipoLabel(it.tipo) },
  {
    label: "Condición",
    value: (it) => condicionLabel[it.condicion] ?? it.condicion,
  },
];

/**
 * Barra flotante del comparador + diálogo de comparación lado a lado.
 * No aparece en /admin ni cuando no hay autos seleccionados.
 */
export function CompareBar() {
  const pathname = usePathname();
  const { items, remove, clear } = useCompare();
  const [open, setOpen] = React.useState(false);

  if (pathname?.startsWith("/admin")) return null;
  if (items.length === 0) return null;

  const cols = `7rem repeat(${items.length}, minmax(0, 1fr))`;

  return (
    <>
      {/* Barra fija inferior */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          <span className="hidden text-sm font-semibold text-foreground sm:inline">
            Comparar
          </span>
          <ul className="flex flex-1 items-center gap-3 overflow-x-auto">
            {items.map((it) => (
              <li key={it.slug} className="relative shrink-0">
                <div className="relative h-12 w-16 overflow-hidden rounded border border-border bg-muted">
                  {it.foto ? (
                    <Image
                      src={it.foto}
                      alt={`${it.marca} ${it.modelo}`}
                      fill
                      sizes="64px"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => remove(it.slug)}
                  aria-label={`Quitar ${it.marca} ${it.modelo}`}
                  className="absolute -right-1.5 -top-1.5 inline-flex size-5 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="size-3" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
          <Button
            size="sm"
            onClick={() => setOpen(true)}
            className="shrink-0 gap-1.5"
          >
            <GitCompare className="size-4" aria-hidden />
            <span className="hidden sm:inline">Comparar</span> ({items.length})
          </Button>
          <button
            type="button"
            onClick={clear}
            aria-label="Limpiar comparación"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            <Trash2 className="size-4" aria-hidden />
          </button>
        </div>
      </div>

      {/* Diálogo de comparación */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Comparar vehículos</DialogTitle>
          </DialogHeader>

          {items.length === 1 ? (
            <p className="text-sm text-muted-foreground">
              Agrega otro auto para compararlo lado a lado.
            </p>
          ) : null}

          <div className="overflow-x-auto">
            <div className="min-w-[28rem]">
              {/* Fila de fotos + nombre */}
              <div className="grid" style={{ gridTemplateColumns: cols }}>
                <div aria-hidden />
                {items.map((it) => (
                  <div key={it.slug} className="p-2">
                    <Link
                      href={`/vehiculo/${it.slug}`}
                      onClick={() => setOpen(false)}
                      className="group block"
                    >
                      <div className="relative aspect-video w-full overflow-hidden rounded-md border border-border bg-muted">
                        {it.foto ? (
                          <Image
                            src={it.foto}
                            alt={`${it.marca} ${it.modelo}`}
                            fill
                            sizes="(max-width: 640px) 45vw, 200px"
                            placeholder="blur"
                            blurDataURL={BLUR_DATA_URL}
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      <p className="mt-2 text-sm font-semibold leading-tight text-foreground group-hover:text-primary">
                        {it.marca} {it.modelo}
                        {it.version ? ` ${it.version}` : ""}
                      </p>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Filas de atributos */}
              {FILAS.map((fila, idx) => (
                <div
                  key={fila.label}
                  className={cn(
                    "grid border-t border-border",
                    idx % 2 === 1 && "bg-card/40"
                  )}
                  style={{ gridTemplateColumns: cols }}
                >
                  <div className="p-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {fila.label}
                  </div>
                  {items.map((it) => (
                    <div
                      key={it.slug}
                      className="p-2 text-sm font-medium text-foreground"
                    >
                      {fila.value(it)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={clear} className="gap-1.5">
              <Trash2 className="size-4" aria-hidden />
              Limpiar todo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
