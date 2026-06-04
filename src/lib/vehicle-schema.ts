import { z } from "zod";

export const imagenSchema = z.object({
  url: z.string().url(),
  orden: z.number().int().min(0),
  es_principal: z.boolean(),
});

/** Campos escalares de un vehículo (compartido por API y formulario). */
export const vehicleFieldsSchema = z.object({
  marca: z.string().min(1, "Ingresa la marca."),
  modelo: z.string().min(1, "Ingresa el modelo."),
  version: z.string().nullable().optional(),
  anio: z.number().int().min(1950, "Año inválido.").max(2100, "Año inválido."),
  precio: z.number().int().min(0, "Ingresa un precio válido."),
  kilometraje: z.number().int().min(0, "Ingresa el kilometraje."),
  tipo: z.enum(["sedan", "suv", "pickup", "hatchback", "coupe", "furgon"]),
  transmision: z.enum(["manual", "automatica"]),
  combustible: z.enum(["bencina", "diesel", "hibrido", "electrico"]),
  color: z.string().nullable().optional(),
  puertas: z.number().int().min(0).max(12).nullable().optional(),
  condicion: z.enum(["nuevo", "usado"]),
  descripcion: z.string().nullable().optional(),
  // URL de video (YouTube/Vimeo/MP4) o cadena vacía; se normaliza a null en la API.
  video_url: z
    .union([z.string().url("URL de video inválida"), z.literal("")])
    .nullable()
    .optional(),
  destacado: z.boolean(),
  vendido: z.boolean(),
  slug: z.string().min(1, "Ingresa un slug."),
});

export type VehicleFields = z.infer<typeof vehicleFieldsSchema>;

/** Payload para crear: campos + imágenes. */
export const createVehicleSchema = vehicleFieldsSchema.extend({
  imagenes: z.array(imagenSchema).default([]),
});

/** Payload para actualizar: todo opcional (sirve para toggles y edición completa). */
export const updateVehicleSchema = vehicleFieldsSchema.partial().extend({
  imagenes: z.array(imagenSchema).optional(),
});
