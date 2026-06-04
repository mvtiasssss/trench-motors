"use client";

import * as React from "react";

/**
 * Beacon de "vista registrada": al montar la ficha, avisa al servidor para
 * sumar 1 a las vistas del vehículo. El dedup real (cookie httpOnly por slug)
 * vive en POST /api/views, así que aquí solo disparamos y olvidamos.
 *
 * No renderiza nada. Vive solo en el detalle público (nunca en /admin).
 */
export function RegisterView({ slug }: { slug: string }) {
  React.useEffect(() => {
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
      keepalive: true,
    }).catch(() => {
      /* sin conexión / bloqueado: no es crítico */
    });
  }, [slug]);

  return null;
}
