import { NextResponse } from "next/server";
import { z } from "zod";

import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const alertaSchema = z.object({
  email: z.string().email(),
  // Filtros del catálogo (marca, tipo, precio_max, cuota_max, etc.).
  filtros: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  // Honeypot anti-spam: si un bot rellena "website", respondemos OK sin guardar.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const parsed = alertaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Ingresa un correo válido." },
      { status: 400 }
    );
  }

  const { email, filtros } = parsed.data;

  const supabase = createAdminClient();
  const { error } = await supabase.from("alertas_busqueda").insert({
    email,
    filtros: filtros ?? {},
  });

  if (error) {
    console.error("[alertas] error al guardar en Supabase:", error);
    return NextResponse.json(
      { error: "No se pudo guardar tu alerta." },
      { status: 500 }
    );
  }

  // TODO: cron/trigger para notificar alertas — cuando ingrese un auto que
  // calce con `filtros`, enviar email a `email`. Aquí solo capturamos el lead.

  return NextResponse.json({ ok: true });
}
