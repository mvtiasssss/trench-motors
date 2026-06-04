"use client";

import * as React from "react";

import type { MiniVehicle } from "@/lib/vehicle-mini";

const STORAGE_KEY = "trench_recent";
const MAX = 8;

/**
 * Registra el vehículo actual en "vistos recientemente" (localStorage), al
 * frente de la lista y sin duplicados, manteniendo como máximo 8. No renderiza
 * nada; va en el detalle del vehículo.
 */
export function TrackRecentView({ item }: { item: MiniVehicle }) {
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: MiniVehicle[] = raw ? JSON.parse(raw) : [];
      const previos = Array.isArray(list)
        ? list.filter((v) => v && v.slug !== item.slug)
        : [];
      const next = [item, ...previos].slice(0, MAX);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* localStorage no disponible */
    }
    // Solo depende del slug: la ficha se monta una vez por vehículo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.slug]);

  return null;
}
