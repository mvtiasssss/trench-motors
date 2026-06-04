import type { LeadEstado, LeadOrigen } from "@/types/vehicle";

/** Estados del pipeline con etiqueta y clases de color para el badge (tema oscuro). */
export const LEAD_ESTADOS: {
  value: LeadEstado;
  label: string;
  badge: string;
}[] = [
  {
    value: "nuevo",
    label: "Nuevo",
    badge: "border-sky-500/40 bg-sky-500/15 text-sky-300",
  },
  {
    value: "contactado",
    label: "Contactado",
    badge: "border-amber-500/40 bg-amber-500/15 text-amber-300",
  },
  {
    value: "negociacion",
    label: "Negociación",
    badge: "border-purple-500/40 bg-purple-500/15 text-purple-300",
  },
  {
    value: "cerrado",
    label: "Cerrado",
    badge: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
  },
  {
    value: "perdido",
    label: "Perdido",
    badge: "border-red-500/30 bg-red-500/10 text-red-300/80",
  },
];

export const LEAD_ESTADO_VALUES = LEAD_ESTADOS.map((e) => e.value);

export function leadEstadoInfo(estado: string) {
  return LEAD_ESTADOS.find((e) => e.value === estado) ?? LEAD_ESTADOS[0];
}

/** Orígenes con etiqueta legible. */
export const LEAD_ORIGENES: { value: LeadOrigen; label: string }[] = [
  { value: "contacto", label: "Contacto" },
  { value: "cotizacion", label: "Cotización" },
  { value: "precalificacion", label: "Precalificación" },
  { value: "agendamiento", label: "Agendamiento" },
];

export function leadOrigenLabel(origen: string): string {
  return LEAD_ORIGENES.find((o) => o.value === origen)?.label ?? origen;
}
