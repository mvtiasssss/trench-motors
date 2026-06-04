import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/** Ventana anti-recuento: un visitante suma como máximo 1 vista cada 12 horas. */
const COOKIE_MAX_AGE = 60 * 60 * 12; // 12 h en segundos

/**
 * Registra UNA visita a la ficha de un vehículo.
 *
 * Lo dispara un beacon desde el detalle público (<RegisterView />), nunca el
 * panel admin, así que las vistas de /admin no se cuentan. El anti-recuento se
 * hace con una cookie httpOnly por slug: si ya existe, no se vuelve a sumar.
 */
export async function POST(request: Request) {
  let slug: unknown;
  try {
    ({ slug } = await request.json());
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (typeof slug !== "string" || slug.length === 0 || slug.length > 200) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const cookieName = `viewed_${slug}`;
  const jar = cookies();
  if (jar.get(cookieName)) {
    // Ya contado en esta ventana: respondemos OK sin volver a sumar.
    return NextResponse.json({ ok: true, counted: false });
  }

  // Incremento atómico vía RPC (SECURITY DEFINER). Si falla, no rompemos nada.
  try {
    const supabase = createAdminClient();
    await supabase.rpc("increment_vehicle_view", { p_slug: slug });
  } catch (error) {
    console.error("[views] error al incrementar vistas:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true, counted: true });
  res.cookies.set(cookieName, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}
