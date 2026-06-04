"use client";

import * as React from "react";

import type { VehicleWithImages } from "@/types/vehicle";
import type { MiniVehicle } from "@/lib/vehicle-mini";

/** Estado expuesto por el comparador (ver CompareProvider). */
export interface CompareContextValue {
  items: MiniVehicle[];
  has: (slug: string) => boolean;
  toggle: (vehicle: VehicleWithImages) => void;
  remove: (slug: string) => void;
  clear: () => void;
  isFull: boolean;
  max: number;
}

export const CompareContext = React.createContext<CompareContextValue | null>(
  null
);

export function useCompare(): CompareContextValue {
  const ctx = React.useContext(CompareContext);
  if (!ctx) {
    throw new Error("useCompare debe usarse dentro de <CompareProvider>");
  }
  return ctx;
}
