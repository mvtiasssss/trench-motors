import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        /** Vehículo nuevo — acento plateado/cromo */
        nuevo: "border-transparent bg-silver text-background",
        /** Oportunidad — acento rojo Trench */
        oportunidad: "border-transparent bg-primary text-primary-foreground",
        /** Financiable — contorno discreto */
        financiable: "border-border bg-transparent text-foreground",
        /** Vendido — apagado */
        vendido: "border-transparent bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "financiable",
    },
  }
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
