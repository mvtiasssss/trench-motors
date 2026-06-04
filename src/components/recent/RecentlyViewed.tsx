"use client";

import * as React from "react";

import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { VehicleCard } from "@/components/vehicle-card";
import { miniToCardVehicle, type MiniVehicle } from "@/lib/vehicle-mini";

const STORAGE_KEY = "trench_recent";

interface RecentlyViewedProps {
  /** Slug a excluir (p. ej. el auto que se está viendo). */
  excludeSlug?: string;
}

/**
 * Franja "Vistos recientemente": lee localStorage y muestra hasta 8 autos como
 * carrusel horizontal de <VehicleCard />. No renderiza nada si la lista está
 * vacía (visitante nuevo) o si todos están filtrados.
 */
export function RecentlyViewed({ excludeSlug }: RecentlyViewedProps) {
  const [items, setItems] = React.useState<MiniVehicle[]>([]);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      if (Array.isArray(list)) {
        setItems(
          list.filter(
            (v: MiniVehicle) => v && !v.vendido && v.slug !== excludeSlug
          )
        );
      }
    } catch {
      /* ignore */
    }
  }, [excludeSlug]);

  if (items.length === 0) return null;

  return (
    <section className="border-t border-border bg-card py-12 sm:py-16">
      <Container>
        <SectionHeading eyebrow="Tu actividad" title="Vistos recientemente" />
        <div className="mt-8 flex gap-5 overflow-x-auto pb-2">
          {items.map((m) => (
            <div key={m.slug} className="w-72 shrink-0">
              <VehicleCard vehicle={miniToCardVehicle(m)} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
