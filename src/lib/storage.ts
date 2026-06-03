export const VEHICLE_PHOTOS_BUCKET = "vehicle-photos";

/**
 * Extrae el path del objeto dentro del bucket a partir de una URL pública de
 * Supabase Storage. Devuelve null si la URL no pertenece al bucket indicado.
 *
 * Ej: https://x.supabase.co/storage/v1/object/public/vehicle-photos/abc/foto.jpg
 *      -> "abc/foto.jpg"
 */
export function storagePathFromPublicUrl(
  url: string,
  bucket: string = VEHICLE_PHOTOS_BUCKET
): string | null {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
}
