// Tipos del dominio de Trench Motors. Reflejan el esquema de Supabase
// (ver supabase/schema.sql).

/** Carrocería del vehículo. */
export type VehicleType =
  | "sedan"
  | "suv"
  | "pickup"
  | "hatchback"
  | "coupe"
  | "furgon";

/** Tipo de transmisión. */
export type Transmission = "manual" | "automatica";

/** Tipo de combustible. */
export type FuelType = "bencina" | "diesel" | "hibrido" | "electrico";

/** Condición comercial del vehículo. */
export type VehicleCondition = "nuevo" | "usado";

/** Origen de un lead (formulario que lo generó). */
export type LeadOrigen = "contacto" | "cotizacion" | "precalificacion";

/** Vehículo del catálogo (tabla `vehicles`). */
export interface Vehicle {
  id: string;
  /** Identificador para la URL: /vehiculo/[slug] */
  slug: string;
  marca: string;
  modelo: string;
  /** Versión / nivel de equipamiento (puede no existir) */
  version: string | null;
  anio: number;
  /** Precio en pesos chilenos (CLP), sin decimales */
  precio: number;
  kilometraje: number;
  tipo: VehicleType;
  transmision: Transmission;
  combustible: FuelType;
  color: string | null;
  puertas: number | null;
  condicion: VehicleCondition;
  descripcion: string | null;
  destacado: boolean;
  vendido: boolean;
  created_at: string;
  updated_at: string;
}

/** Imagen asociada a un vehículo (tabla `vehicle_images`). */
export interface VehicleImage {
  id: string;
  vehicle_id: string;
  url: string;
  orden: number;
  es_principal: boolean;
  created_at: string;
}

/** Marca (tabla `brands`). */
export interface Brand {
  id: string;
  nombre: string;
  logo_url: string | null;
  created_at: string;
}

/** Contacto/lead generado por un formulario (tabla `leads`). */
export interface Lead {
  id: string;
  nombre: string;
  telefono: string | null;
  email: string | null;
  mensaje: string | null;
  vehicle_id: string | null;
  origen: LeadOrigen;
  created_at: string;
}

/** Vehículo junto con sus imágenes (consulta con join). */
export interface VehicleWithImages extends Vehicle {
  imagenes: VehicleImage[];
}
