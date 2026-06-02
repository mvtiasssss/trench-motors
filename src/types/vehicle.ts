/** Condición/estado comercial de un vehículo. */
export type VehicleCondition = "nuevo" | "usado" | "oportunidad" | "vendido";

/** Modelo de un vehículo del catálogo de Trench Motors. */
export interface Vehicle {
  /** Identificador para la URL: /vehiculo/[slug] */
  slug: string;
  marca: string;
  modelo: string;
  /** Año del modelo */
  anio: number;
  /** Kilometraje */
  km: number;
  /** Precio en pesos chilenos (CLP), sin decimales */
  precio: number;
  condicion: VehicleCondition;
  /** URL de la foto principal (16:9 recomendado) */
  foto: string;
  /** Si aplica a financiamiento */
  financiable?: boolean;
}
