/**
 * Garantías / sellos de confianza de Trench Motors.
 *
 * EDITABLE por el dueño: cambia los títulos y descripciones libremente. Son
 * compromisos REALES de la automotora — no inventes certificaciones ni cifras.
 *
 * `icon` es una de las claves soportadas por el componente <Garantias />
 * (ver el mapa ICONOS en src/components/garantias.tsx). Así este archivo queda
 * solo con texto, fácil de tocar sin saber de React.
 */
export type GarantiaIcono =
  | "shield"
  | "wrench"
  | "gauge"
  | "handshake"
  | "banknote"
  | "file";

export interface Garantia {
  icon: GarantiaIcono;
  title: string;
  desc: string;
}

export const garantias: Garantia[] = [
  {
    icon: "shield",
    title: "Garantía en cada vehículo",
    desc: "Todos nuestros autos cuentan con respaldo y control de calidad.",
  },
  {
    icon: "wrench",
    title: "Revisión técnica al día",
    desc: "Entregamos cada vehículo revisado y con su documentación en regla.",
  },
  {
    icon: "gauge",
    title: "Kilometraje verificado",
    desc: "El kilometraje que ves es el real, comprobado antes de publicar.",
  },
  {
    icon: "handshake",
    title: "Acompañamiento en la transferencia",
    desc: "Te guiamos en todo el proceso de transferencia, sin letra chica.",
  },
];
