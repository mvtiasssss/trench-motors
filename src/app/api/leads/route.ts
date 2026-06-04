import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const leadSchema = z.object({
  nombre: z.string().min(2),
  telefono: z.string().min(9),
  email: z.string().email(),
  mensaje: z.string().min(10),
  vehicle_id: z.string().uuid().optional(),
  origen: z.enum([
    "cotizacion",
    "precalificacion",
    "contacto",
    "agendamiento",
  ]),
});

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  // Honeypot anti-spam: si un bot rellena "website", respondemos OK sin procesar.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  // Normaliza vehicle_id: "" o falsy -> ausente (para la validación uuid opcional).
  if (!body.vehicle_id) delete body.vehicle_id;

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Revisa los datos del formulario." },
      { status: 400 }
    );
  }

  const { nombre, telefono, email, mensaje, vehicle_id, origen } = parsed.data;

  // --- Guardar el lead (cliente service-role, omite RLS) ---
  const supabase = createAdminClient();
  const { error: dbError } = await supabase.from("leads").insert({
    nombre,
    telefono,
    email,
    mensaje,
    vehicle_id: vehicle_id ?? null,
    origen,
  });

  if (dbError) {
    console.error("[leads] error al guardar en Supabase:", dbError);
    return NextResponse.json(
      { error: "No se pudo registrar tu solicitud." },
      { status: 500 }
    );
  }

  // --- Notificar por email (Resend). Si falla, el lead ya quedó guardado. ---
  if (process.env.RESEND_API_KEY && process.env.RESEND_TO_EMAIL) {
    try {
      // Etiqueta del vehículo (si aplica).
      let vehiculoLinea = "";
      if (vehicle_id) {
        let etiqueta = vehicle_id;
        const { data: v } = await supabase
          .from("vehicles")
          .select("marca, modelo, anio")
          .eq("id", vehicle_id)
          .maybeSingle();
        if (v) etiqueta = `${v.marca} ${v.modelo} ${v.anio}`;
        vehiculoLinea = `<p><strong>Vehículo:</strong> ${escapeHtml(etiqueta)}</p>`;
      }

      const fecha = new Date().toLocaleString("es-CL", {
        timeZone: "America/Santiago",
      });

      const html = `
        <h2>Nuevo lead — ${escapeHtml(origen)}</h2>
        <p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
        <p><strong>Teléfono:</strong> ${escapeHtml(telefono)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Mensaje:</strong><br/>${escapeHtml(mensaje).replace(/\n/g, "<br/>")}</p>
        ${vehiculoLinea}
        <p><strong>Fecha:</strong> ${escapeHtml(fecha)}</p>
      `;

      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
        to: process.env.RESEND_TO_EMAIL,
        subject: `Nuevo lead [${origen}] — ${nombre}`,
        html,
      });
    } catch (emailError) {
      // No interrumpe el flujo: el lead ya está guardado.
      console.error("[leads] error al enviar email con Resend:", emailError);
    }
  }

  return NextResponse.json({ ok: true });
}
