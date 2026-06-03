import { NextResponse } from "next/server";

import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createVehicleSchema } from "@/lib/vehicle-schema";

export const runtime = "nodejs";

/** GET — lista todos los vehículos (incluye vendidos) con sus imágenes. */
export async function GET() {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*, imagenes:vehicle_images(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin/vehicles GET]", error);
    return NextResponse.json({ error: "Error al listar." }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [] });
}

/** POST — crea un vehículo y sus imágenes. */
export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createVehicleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Revisa los datos del vehículo." },
      { status: 400 }
    );
  }

  const { imagenes, ...fields } = parsed.data;
  const supabase = createAdminClient();

  const { data: vehiculo, error } = await supabase
    .from("vehicles")
    .insert({
      ...fields,
      version: fields.version || null,
      color: fields.color || null,
      descripcion: fields.descripcion || null,
      puertas: fields.puertas ?? null,
    })
    .select("id, slug")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Ya existe un vehículo con ese slug." },
        { status: 409 }
      );
    }
    console.error("[admin/vehicles POST]", error);
    return NextResponse.json(
      { error: "No se pudo crear el vehículo." },
      { status: 500 }
    );
  }

  if (imagenes.length > 0) {
    const rows = imagenes.map((img) => ({
      vehicle_id: vehiculo.id,
      url: img.url,
      orden: img.orden,
      es_principal: img.es_principal,
    }));
    const { error: imgError } = await supabase
      .from("vehicle_images")
      .insert(rows);
    if (imgError) console.error("[admin/vehicles POST images]", imgError);
  }

  return NextResponse.json({ ok: true, id: vehiculo.id, slug: vehiculo.slug });
}
