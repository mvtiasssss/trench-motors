import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/container";
import { VehicleCard } from "@/components/vehicle-card";
import { Button } from "@/components/ui/button";
import { CatalogFilters } from "@/components/catalog/CatalogFilters";
import { CatalogSort } from "@/components/catalog/CatalogSort";
import { CatalogPagination } from "@/components/catalog/CatalogPagination";
import { getBrands, getVehicles, type VehicleOrden } from "@/lib/vehicles";
import type { Brand, VehicleCondition, VehicleType, VehicleWithImages } from "@/types/vehicle";
import { CONDICIONES, ORDENES, TIPOS } from "@/lib/vehicle-options";

export const metadata: Metadata = {
  title: "Catálogo | Trench Motors",
  description:
    "Explora vehículos nuevos y usados en Trench Motors. Filtra por marca, tipo, precio y más.",
};

const PER_PAGE = 12;

type SearchParams = { [key: string]: string | string[] | undefined };

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function num(value: string | string[] | undefined): number | undefined {
  const s = first(value);
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // ---- Leer y validar filtros desde la URL (la marca se pasa tal cual) ----
  const marca = first(searchParams.marca) || undefined;

  const tipoRaw = first(searchParams.tipo);
  const tipo = TIPOS.some((t) => t.value === tipoRaw)
    ? (tipoRaw as VehicleType)
    : undefined;

  const condicionRaw = first(searchParams.condicion);
  const condicion = CONDICIONES.some((c) => c.value === condicionRaw)
    ? (condicionRaw as VehicleCondition)
    : undefined;

  const ordenRaw = first(searchParams.orden);
  const orden = ORDENES.some((o) => o.value === ordenRaw)
    ? (ordenRaw as VehicleOrden)
    : undefined;

  const precioMin = num(searchParams.precioMin);
  const precioMax = num(searchParams.precioMax);
  const anioMin = num(searchParams.anioMin);
  const anioMax = num(searchParams.anioMax);
  const kmMax = num(searchParams.kmMax);
  const page = Math.max(1, num(searchParams.page) ?? 1);

  // ---- Cargar datos (tolerante a Supabase no configurado) ----
  let data: VehicleWithImages[] = [];
  let total = 0;
  let brands: Brand[] = [];
  try {
    const result = await getVehicles({
      marca,
      tipo,
      condicion,
      precioMin,
      precioMax,
      anioMin,
      anioMax,
      kmMax,
      orden,
      page,
      perPage: PER_PAGE,
    });
    data = result.data;
    total = result.total;
  } catch {
    data = [];
    total = 0;
  }
  try {
    brands = await getBrands();
  } catch {
    brands = [];
  }

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  // ---- Params (sin "page") para los enlaces de paginación ----
  const linkParams: Record<string, string> = {};
  if (marca) linkParams.marca = marca;
  if (tipo) linkParams.tipo = tipo;
  if (condicion) linkParams.condicion = condicion;
  if (precioMin != null) linkParams.precioMin = String(precioMin);
  if (precioMax != null) linkParams.precioMax = String(precioMax);
  if (anioMin != null) linkParams.anioMin = String(anioMin);
  if (anioMax != null) linkParams.anioMax = String(anioMax);
  if (kmMax != null) linkParams.kmMax = String(kmMax);
  if (orden) linkParams.orden = orden;

  return (
    <Container className="pb-16 pt-28">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
          Catálogo
        </h1>
        <p className="text-muted-foreground">
          Encuentra tu próximo auto entre nuestra selección.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Filtros */}
        <div className="lg:col-span-1">
          <CatalogFilters brands={brands} />
        </div>

        {/* Resultados */}
        <div className="lg:col-span-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {total}{" "}
              {total === 1 ? "vehículo encontrado" : "vehículos encontrados"}
            </p>
            <CatalogSort />
          </div>

          {total > 0 ? (
            <>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {data.map((vehiculo) => (
                  <VehicleCard key={vehiculo.id} vehicle={vehiculo} />
                ))}
              </div>
              <CatalogPagination
                page={page}
                totalPages={totalPages}
                params={linkParams}
              />
            </>
          ) : (
            <div className="mt-8 rounded-lg border border-border bg-card p-10 text-center">
              <p className="text-lg font-medium text-foreground">
                No encontramos vehículos con esos filtros.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Prueba ampliando el rango de precio o quitando algún filtro.
              </p>
              <Button asChild variant="outline" className="mt-6">
                <Link href="/catalogo">Limpiar filtros</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
