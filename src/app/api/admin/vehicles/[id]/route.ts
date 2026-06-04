import { NextResponse } from "next/server";

import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { updateVehicleSchema } from "@/lib/vehicle-schema";
import { storagePathFromPublicUrl, VEHICLE_PHOTOS_BUCKET } from "@/lib/storage";

export const runtime = "nodejs";

/** PATCH — actualiza campos (incluye toggles destacado/vendido) y/o imágenes. */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateVehicleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const { imagenes, ...fields } = parsed.data;
  const supabase = createAdminClient();

  const updates: Record<string, unknown> = { ...fields };
  if ("version" in updates) updates.version = fields.version || null;
  if ("color" in updates) updates.color = fields.color || null;
  if ("descripcion" in updates) updates.descripcion = fields.descripcion || null;
  if ("video_url" in updates) updates.video_url = fields.video_url || null;
  if ("puertas" in updates) updates.puertas = fields.puertas ?? null;

  if (Object.keys(updates).length > 0) {
    const { error } = await supabase
      .from("vehicles")
      .update(updates)
      .eq("id", params.id);
    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Ya existe un vehículo con ese slug." },
          { status: 409 }
        );
      }
      console.error("[admin/vehicles PATCH]", error);
      return NextResponse.json(
        { error: "No se pudo actualizar el vehículo." },
        { status: 500 }
      );
    }
  }

  // Si se envían imágenes, se reemplazan por completo.
  if (imagenes) {
    // Limpieza de huérfanos: borra del Storage las fotos que ya no están en la
    // nueva lista (las que se quitaron al editar).
    const { data: previas } = await supabase
      .from("vehicle_images")
      .select("url")
      .eq("vehicle_id", params.id);

    const nuevasUrls = new Set(imagenes.map((img) => img.url));
    const huerfanas = (previas ?? [])
      .map((row: { url: string }) => row.url)
      .filter((url) => !nuevasUrls.has(url));
    const paths = huerfanas
      .map((url) => storagePathFromPublicUrl(url))
      .filter((p): p is string => Boolean(p));

    if (paths.length > 0) {
      const { error: rmError } = await supabase.storage
        .from(VEHICLE_PHOTOS_BUCKET)
        .remove(paths);
      if (rmError) console.error("[admin/vehicles PATCH storage]", rmError);
    }

    await supabase.from("vehicle_images").delete().eq("vehicle_id", params.id);
    if (imagenes.length > 0) {
      const rows = imagenes.map((img) => ({
        vehicle_id: params.id,
        url: img.url,
        orden: img.orden,
        es_principal: img.es_principal,
      }));
      const { error: imgError } = await supabase
        .from("vehicle_images")
        .insert(rows);
      if (imgError) console.error("[admin/vehicles PATCH images]", imgError);
    }
  }

  return NextResponse.json({ ok: true });
}

/** DELETE — elimina el vehículo y sus imágenes del Storage. */
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Borrar archivos del Storage (las filas de vehicle_images caen por CASCADE).
  const { data: imgs } = await supabase
    .from("vehicle_images")
    .select("url")
    .eq("vehicle_id", params.id);

  const paths = (imgs ?? [])
    .map((row: { url: string }) => storagePathFromPublicUrl(row.url))
    .filter((p): p is string => Boolean(p));

  if (paths.length > 0) {
    const { error: rmError } = await supabase.storage
      .from(VEHICLE_PHOTOS_BUCKET)
      .remove(paths);
    if (rmError) console.error("[admin/vehicles DELETE storage]", rmError);
  }

  const { error } = await supabase.from("vehicles").delete().eq("id", params.id);
  if (error) {
    console.error("[admin/vehicles DELETE]", error);
    return NextResponse.json(
      { error: "No se pudo eliminar el vehículo." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
