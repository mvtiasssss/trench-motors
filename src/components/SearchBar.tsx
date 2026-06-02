"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import type { Brand } from "@/types/vehicle";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TIPOS } from "@/lib/vehicle-options";

interface SearchBarProps {
  brands: Brand[];
  className?: string;
}

/**
 * Búsqueda rápida del hero. Construye los filtros como query params y redirige
 * al catálogo: /catalogo?marca=Toyota&tipo=suv&precioMax=20000000
 */
export function SearchBar({ brands, className }: SearchBarProps) {
  const router = useRouter();
  const [marca, setMarca] = React.useState("");
  const [tipo, setTipo] = React.useState("");
  const [precioMax, setPrecioMax] = React.useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (marca) params.set("marca", marca);
    if (tipo) params.set("tipo", tipo);
    if (precioMax) params.set("precioMax", precioMax);
    const qs = params.toString();
    router.push(qs ? `/catalogo?${qs}` : "/catalogo");
  }

  const fieldClass =
    "h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  const labelClass =
    "text-xs font-medium uppercase tracking-wide text-muted-foreground";

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "rounded-xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur sm:p-5",
        className
      )}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Marca */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="search-marca" className={labelClass}>
            Marca
          </label>
          <select
            id="search-marca"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            className={fieldClass}
          >
            <option value="">Todas las marcas</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.nombre}>
                {brand.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="search-tipo" className={labelClass}>
            Tipo
          </label>
          <select
            id="search-tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
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

        {/* Precio máximo */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="search-precio" className={labelClass}>
            Precio máximo (CLP)
          </label>
          <input
            id="search-precio"
            type="number"
            inputMode="numeric"
            min={0}
            step={500000}
            value={precioMax}
            onChange={(e) => setPrecioMax(e.target.value)}
            placeholder="Ej: 20.000.000"
            className={fieldClass}
          />
        </div>

        {/* Buscar */}
        <div className="flex items-end">
          <Button type="submit" size="lg" className="w-full gap-2">
            <Search className="size-4" aria-hidden />
            Buscar
          </Button>
        </div>
      </div>
    </form>
  );
}
