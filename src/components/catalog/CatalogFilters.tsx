"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

import type { Brand } from "@/types/vehicle";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CONDICIONES, TIPOS } from "@/lib/vehicle-options";

interface CatalogFiltersProps {
  brands: Brand[];
}

const fieldClass =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const labelClass =
  "text-xs font-medium uppercase tracking-wide text-muted-foreground";

/** Campo numérico con estado local que confirma el cambio al salir o con Enter. */
function NumberField({
  id,
  label,
  value,
  placeholder,
  step,
  onCommit,
}: {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  step?: number;
  onCommit: (value: string) => void;
}) {
  const [local, setLocal] = React.useState(value);
  React.useEffect(() => setLocal(value), [value]);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <Input
        id={id}
        type="number"
        inputMode="numeric"
        min={0}
        step={step}
        value={local}
        placeholder={placeholder}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => onCommit(local.trim())}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onCommit(local.trim());
          }
        }}
      />
    </div>
  );
}

/** Controles de filtro (compartidos por el panel de escritorio y el Sheet móvil). */
function FilterControls({ brands }: CatalogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const get = (key: string) => searchParams.get(key) ?? "";

  const updateParams = React.useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      }
      // Cualquier cambio de filtro vuelve a la página 1.
      params.delete("page");
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Marca */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="f-marca" className={labelClass}>
          Marca
        </label>
        <select
          id="f-marca"
          value={get("marca")}
          onChange={(e) => updateParams({ marca: e.target.value || null })}
          className={fieldClass}
        >
          <option value="">Todas las marcas</option>
          {brands.map((b) => (
            <option key={b.id} value={b.nombre}>
              {b.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Tipo */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="f-tipo" className={labelClass}>
          Tipo
        </label>
        <select
          id="f-tipo"
          value={get("tipo")}
          onChange={(e) => updateParams({ tipo: e.target.value || null })}
          className={fieldClass}
        >
          <option value="">Todos los tipos</option>
          {TIPOS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Condición */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="f-condicion" className={labelClass}>
          Condición
        </label>
        <select
          id="f-condicion"
          value={get("condicion")}
          onChange={(e) => updateParams({ condicion: e.target.value || null })}
          className={fieldClass}
        >
          <option value="">Todas</option>
          {CONDICIONES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Precio */}
      <div className="grid grid-cols-2 gap-3">
        <NumberField
          id="f-precio-min"
          label="Precio mín."
          value={get("precioMin")}
          placeholder="0"
          step={500000}
          onCommit={(v) => updateParams({ precioMin: v || null })}
        />
        <NumberField
          id="f-precio-max"
          label="Precio máx."
          value={get("precioMax")}
          placeholder="Sin límite"
          step={500000}
          onCommit={(v) => updateParams({ precioMax: v || null })}
        />
      </div>

      {/* Cuota mensual máxima (en Chile se compra "por cuota") */}
      <NumberField
        id="f-cuota-max"
        label="Cuota mensual máx. (CLP)"
        value={get("cuotaMax")}
        placeholder="Ej: 250.000"
        step={10000}
        onCommit={(v) => updateParams({ cuotaMax: v || null })}
      />

      {/* Año */}
      <div className="grid grid-cols-2 gap-3">
        <NumberField
          id="f-anio-min"
          label="Año desde"
          value={get("anioMin")}
          placeholder="2015"
          onCommit={(v) => updateParams({ anioMin: v || null })}
        />
        <NumberField
          id="f-anio-max"
          label="Año hasta"
          value={get("anioMax")}
          placeholder="2025"
          onCommit={(v) => updateParams({ anioMax: v || null })}
        />
      </div>

      {/* Km máximo */}
      <NumberField
        id="f-km-max"
        label="Kilometraje máximo"
        value={get("kmMax")}
        placeholder="Sin límite"
        step={5000}
        onCommit={(v) => updateParams({ kmMax: v || null })}
      />

      <Button
        type="button"
        variant="ghost"
        className="justify-start px-0 text-muted-foreground hover:text-foreground"
        onClick={() => router.push(pathname)}
      >
        Limpiar filtros
      </Button>
    </div>
  );
}

export function CatalogFilters({ brands }: CatalogFiltersProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* Escritorio: panel fijo a la izquierda */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-lg border border-border bg-card p-5">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
            Filtros
          </h2>
          <FilterControls brands={brands} />
        </div>
      </aside>

      {/* Móvil: botón que abre un Sheet con los mismos controles */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className={cn("gap-2")}>
              <SlidersHorizontal className="size-4" aria-hidden />
              Filtros
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[88%] max-w-sm overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterControls brands={brands} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
