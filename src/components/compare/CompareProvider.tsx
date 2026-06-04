"use client";

import * as React from "react";

import type { VehicleWithImages } from "@/types/vehicle";
import { toMiniVehicle, type MiniVehicle } from "@/lib/vehicle-mini";
import {
  CompareContext,
  type CompareContextValue,
} from "@/components/compare/compare-context";
import { CompareBar } from "@/components/compare/CompareBar";

const STORAGE_KEY = "trench_compare";
const MAX = 3;

/**
 * Estado global del comparador (máx. 3 autos), persistido en localStorage.
 * Renderiza la barra flotante <CompareBar /> para que esté disponible en todo
 * el sitio público.
 */
export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<MiniVehicle[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  // Carga inicial desde localStorage.
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) setItems(parsed.slice(0, MAX));
    } catch {
      /* localStorage no disponible o corrupto */
    }
    setHydrated(true);
  }, []);

  // Persiste cualquier cambio (después de hidratar, para no pisar lo guardado).
  React.useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  const has = React.useCallback(
    (slug: string) => items.some((i) => i.slug === slug),
    [items]
  );

  const toggle = React.useCallback((vehicle: VehicleWithImages) => {
    setItems((prev) => {
      if (prev.some((i) => i.slug === vehicle.slug)) {
        return prev.filter((i) => i.slug !== vehicle.slug);
      }
      if (prev.length >= MAX) return prev; // lleno: no agrega
      return [...prev, toMiniVehicle(vehicle)];
    });
  }, []);

  const remove = React.useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const clear = React.useCallback(() => setItems([]), []);

  const value = React.useMemo<CompareContextValue>(
    () => ({
      items,
      has,
      toggle,
      remove,
      clear,
      isFull: items.length >= MAX,
      max: MAX,
    }),
    [items, has, toggle, remove, clear]
  );

  return (
    <CompareContext.Provider value={value}>
      {children}
      <CompareBar />
    </CompareContext.Provider>
  );
}
