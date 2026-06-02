import * as React from "react";
import { cn } from "@/lib/utils";

/*
  Marca de Trench Motors.

  Hoy renderiza el wordmark en texto (plata/cromo + acento rojo, fuente display)
  como fallback. Cuando exista el logo definitivo con fondo transparente en
  `public/logo-trench.png` (o un SVG), reemplazar el contenido por:

    import Image from "next/image";
    <Image src="/logo-trench.png" alt="Trench Motors" width={150} height={40} priority />
*/
interface LogoProps {
  className?: string;
  /** Muestra el subtítulo "MOTORS" debajo de "TRENCH". */
  showSubtitle?: boolean;
}

export function Logo({ className, showSubtitle = true }: LogoProps) {
  return (
    <span
      className={cn("inline-flex flex-col items-start leading-none", className)}
    >
      {/* Acento rojo del emblema */}
      <span className="mb-1 h-[3px] w-6 rounded-sm bg-primary" aria-hidden />
      <span className="font-display text-xl font-extrabold uppercase tracking-[0.18em] text-silver">
        Trench
      </span>
      {showSubtitle ? (
        <span className="mt-0.5 font-display text-[0.6rem] font-semibold uppercase tracking-[0.45em] text-muted-foreground">
          Motors
        </span>
      ) : null}
    </span>
  );
}
