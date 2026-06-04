// Opciones de UI para filtros de vehículos (etiquetas en español).
// Los `value` coinciden con los enums almacenados en la base de datos.

export const TIPOS = [
  { value: "sedan", label: "Sedán" },
  { value: "suv", label: "SUV" },
  { value: "pickup", label: "Camioneta" },
  { value: "hatchback", label: "Hatchback" },
  { value: "coupe", label: "Coupé" },
  { value: "furgon", label: "Furgón" },
] as const;

export const CONDICIONES = [
  { value: "nuevo", label: "Nuevo" },
  { value: "usado", label: "Usado" },
] as const;

export const TRANSMISIONES = [
  { value: "manual", label: "Manual" },
  { value: "automatica", label: "Automática" },
] as const;

export const COMBUSTIBLES = [
  { value: "bencina", label: "Bencina" },
  { value: "diesel", label: "Diésel" },
  { value: "hibrido", label: "Híbrido" },
  { value: "electrico", label: "Eléctrico" },
] as const;

export const ORDENES = [
  { value: "recientes", label: "Más recientes" },
  { value: "precio_asc", label: "Menor precio" },
  { value: "precio_desc", label: "Mayor precio" },
  { value: "cuota_asc", label: "Menor cuota mensual" },
  { value: "cuota_desc", label: "Mayor cuota mensual" },
  { value: "anio_desc", label: "Año: nuevo a antiguo" },
] as const;
