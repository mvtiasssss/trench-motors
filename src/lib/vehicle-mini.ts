import type {
  FuelType,
  Transmission,
  VehicleCondition,
  VehicleType,
  VehicleWithImages,
} from "@/types/vehicle";

/**
 * Versión mínima de un vehículo para persistir en localStorage (vistos
 * recientemente y comparador). Guarda solo lo necesario para mostrar la tarjeta
 * y la tabla de comparación, sin arrastrar todo el registro.
 */
export interface MiniVehicle {
  slug: string;
  marca: string;
  modelo: string;
  version: string | null;
  anio: number;
  precio: number;
  kilometraje: number;
  transmision: Transmission;
  combustible: FuelType;
  tipo: VehicleType;
  condicion: VehicleCondition;
  vendido: boolean;
  foto?: string;
}

/** Extrae los datos mínimos de un vehículo completo. */
export function toMiniVehicle(v: VehicleWithImages): MiniVehicle {
  const principal =
    v.imagenes?.find((i) => i.es_principal) ?? v.imagenes?.[0];
  return {
    slug: v.slug,
    marca: v.marca,
    modelo: v.modelo,
    version: v.version,
    anio: v.anio,
    precio: v.precio,
    kilometraje: v.kilometraje,
    transmision: v.transmision,
    combustible: v.combustible,
    tipo: v.tipo,
    condicion: v.condicion,
    vendido: v.vendido,
    foto: principal?.url,
  };
}

/**
 * Reconstruye un VehicleWithImages "suficiente" para reutilizar <VehicleCard />
 * con datos mínimos (vistos recientemente). Los campos que la tarjeta no usa se
 * rellenan con valores neutros.
 */
export function miniToCardVehicle(m: MiniVehicle): VehicleWithImages {
  return {
    id: m.slug,
    slug: m.slug,
    marca: m.marca,
    modelo: m.modelo,
    version: m.version,
    anio: m.anio,
    precio: m.precio,
    kilometraje: m.kilometraje,
    tipo: m.tipo,
    transmision: m.transmision,
    combustible: m.combustible,
    color: null,
    puertas: null,
    condicion: m.condicion,
    descripcion: null,
    video_url: null,
    vistas: 0,
    destacado: false,
    vendido: m.vendido,
    created_at: "",
    updated_at: "",
    imagenes: m.foto
      ? [
          {
            id: m.slug,
            vehicle_id: m.slug,
            url: m.foto,
            orden: 0,
            es_principal: true,
            created_at: "",
          },
        ]
      : [],
  };
}
