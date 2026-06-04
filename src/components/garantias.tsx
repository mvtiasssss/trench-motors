import {
  ShieldCheck,
  Wrench,
  Gauge,
  Handshake,
  Banknote,
  FileCheck,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { garantias, type GarantiaIcono } from "@/lib/garantias";

const ICONOS: Record<GarantiaIcono, LucideIcon> = {
  shield: ShieldCheck,
  wrench: Wrench,
  gauge: Gauge,
  handshake: Handshake,
  banknote: Banknote,
  file: FileCheck,
};

interface GarantiasProps {
  /**
   * "grid" (por defecto): tarjetas grandes para la home.
   * "compact": fila densa con íconos pequeños para la ficha del vehículo.
   */
  variant?: "grid" | "compact";
  className?: string;
}

/**
 * Sellos de confianza de Trench Motors. Texto editable en src/lib/garantias.ts.
 * Estética oscura/metálica; el rojo se usa solo como acento en los íconos.
 */
export function Garantias({ variant = "grid", className }: GarantiasProps) {
  if (variant === "compact") {
    return (
      <ul
        className={cn(
          "grid grid-cols-1 gap-3 sm:grid-cols-2",
          className
        )}
      >
        {garantias.map((g) => {
          const Icon = ICONOS[g.icon];
          return (
            <li
              key={g.title}
              className="flex items-start gap-3 rounded-md border border-border bg-card p-3"
            >
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-4" aria-hidden />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">
                  {g.title}
                </span>
                <span className="text-xs text-muted-foreground">{g.desc}</span>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {garantias.map((g) => {
        const Icon = ICONOS[g.icon];
        return (
          <div
            key={g.title}
            className="flex flex-col items-center gap-4 rounded-lg border border-border bg-background p-6 text-center transition-colors hover:border-primary/40"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="size-6" aria-hidden />
            </span>
            <h3 className="font-display text-lg font-semibold text-foreground">
              {g.title}
            </h3>
            <p className="text-sm text-muted-foreground">{g.desc}</p>
          </div>
        );
      })}
    </div>
  );
}
