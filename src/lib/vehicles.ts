import { createClient } from "@/lib/supabase/server";
import type {
  Brand,
  VehicleCondition,
  VehicleType,
  VehicleWithImages,
} from "@/types/vehicle";

/** Criterios de ordenamiento del catálogo. */
export type VehicleOrden =
  | "precio_asc"
  | "precio_desc"
  | "anio_desc"
  | "recientes";

/** Filtros aceptados por {@link getVehicles}. */
export interface VehicleFilters {
  marca?: string;
  tipo?: VehicleType;
  condicion?: VehicleCondition;
  precioMin?: number;
  precioMax?: number;
  anioMin?: number;
  anioMax?: number;
  kmMax?: number;
  orden?: VehicleOrden;
  page?: number;
  perPage?: number;
  /** Por defecto los vendidos se excluyen. */
  incluirVendidos?: boolean;
}

/** Resultado paginado del catálogo. */
export interface VehiclesResult {
  data: VehicleWithImages[];
  total: number;
}

/** Selección de vehículo con sus imágenes embebidas. */
const VEHICLE_WITH_IMAGES = "*, imagenes:vehicle_images(*)";

/** Ordena las imágenes: principal primero, luego por `orden`. */
function ordenarImagenes(vehiculo: VehicleWithImages): VehicleWithImages {
  const imagenes = [...(vehiculo.imagenes ?? [])].sort(
    (a, b) =>
      Number(b.es_principal) - Number(a.es_principal) || a.orden - b.orden
  );
  return { ...vehiculo, imagenes };
}

/**
 * Lista vehículos del catálogo aplicando filtros, orden y paginación.
 * Excluye los vendidos salvo que `incluirVendidos` sea true.
 */
export async function getVehicles(
  filtros: VehicleFilters = {}
): Promise<VehiclesResult> {
  const {
    marca,
    tipo,
    condicion,
    precioMin,
    precioMax,
    anioMin,
    anioMax,
    kmMax,
    orden = "recientes",
    page = 1,
    perPage = 12,
    incluirVendidos = false,
  } = filtros;

  const supabase = createClient();
  let query = supabase
    .from("vehicles")
    .select(VEHICLE_WITH_IMAGES, { count: "exact" });

  if (!incluirVendidos) query = query.eq("vendido", false);
  if (marca) query = query.eq("marca", marca);
  if (tipo) query = query.eq("tipo", tipo);
  if (condicion) query = query.eq("condicion", condicion);
  if (precioMin != null) query = query.gte("precio", precioMin);
  if (precioMax != null) query = query.lte("precio", precioMax);
  if (anioMin != null) query = query.gte("anio", anioMin);
  if (anioMax != null) query = query.lte("anio", anioMax);
  if (kmMax != null) query = query.lte("kilometraje", kmMax);

  switch (orden) {
    case "precio_asc":
      query = query.order("precio", { ascending: true });
      break;
    case "precio_desc":
      query = query.order("precio", { ascending: false });
      break;
    case "anio_desc":
      query = query.order("anio", { ascending: false });
      break;
    case "recientes":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  const vehiculos = ((data ?? []) as VehicleWithImages[]).map(ordenarImagenes);
  return { data: vehiculos, total: count ?? 0 };
}

/**
 * Vehículos similares (misma marca o mismo tipo), no vendidos, excluyendo el
 * vehículo dado. Útil para la sección "Vehículos similares" del detalle.
 */
export async function getSimilarVehicles(
  vehiculo: Pick<VehicleWithImages, "id" | "marca" | "tipo">,
  limit = 4
): Promise<VehicleWithImages[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select(VEHICLE_WITH_IMAGES)
    .neq("id", vehiculo.id)
    .eq("vendido", false)
    .or(`marca.eq.${vehiculo.marca},tipo.eq.${vehiculo.tipo}`)
    .order("destacado", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return ((data ?? []) as VehicleWithImages[]).map(ordenarImagenes);
}

/** Obtiene un vehículo por slug junto con sus imágenes, o null si no existe. */
export async function getVehicleBySlug(
  slug: string
): Promise<VehicleWithImages | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select(VEHICLE_WITH_IMAGES)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return ordenarImagenes(data as VehicleWithImages);
}

/** Obtiene un vehículo por id junto con sus imágenes, o null si no existe. */
export async function getVehicleById(
  id: string
): Promise<VehicleWithImages | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select(VEHICLE_WITH_IMAGES)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return ordenarImagenes(data as VehicleWithImages);
}

/** Vehículos destacados (no vendidos), con sus imágenes. */
export async function getFeaturedVehicles(
  limit = 6
): Promise<VehicleWithImages[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select(VEHICLE_WITH_IMAGES)
    .eq("destacado", true)
    .eq("vendido", false)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return ((data ?? []) as VehicleWithImages[]).map(ordenarImagenes);
}

/** Lista todas las marcas ordenadas alfabéticamente. */
export async function getBrands(): Promise<Brand[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) throw error;

  return (data ?? []) as Brand[];
}
