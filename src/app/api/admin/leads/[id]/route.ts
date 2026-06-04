import { NextResponse } from "next/server";
import { z } from "zod";

import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { LEAD_ESTADO_VALUES } from "@/lib/lead-options";

export const runtime = "nodejs";

// Solo estado y notas son editables desde aquí (no se tocan otros campos).
const patchSchema = z
  .object({
    estado: z
      .enum(LEAD_ESTADO_VALUES as [string, ...string[]])
      .optional(),
    notas: z.string().max(5000).nullable().optional(),
  })
  .refine((d) => d.estado !== undefined || d.notas !== undefined, {
    message: "Nada que actualizar.",
  });

/** PATCH — actualiza estado y/o notas de un lead (solo admin autenticado). */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  // Construye el update solo con los campos presentes (whitelist).
  const updates: Record<string, unknown> = {};
  if (parsed.data.estado !== undefined) updates.estado = parsed.data.estado;
  if (parsed.data.notas !== undefined) {
    updates.notas = parsed.data.notas?.trim() ? parsed.data.notas : null;
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("leads")
    .update(updates) // el trigger actualiza updated_at
    .eq("id", params.id);

  if (error) {
    console.error("[admin/leads PATCH]", error);
    return NextResponse.json(
      { error: "No se pudo actualizar el lead." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
