import * as React from "react";
import { cn } from "@/lib/utils";

type Align = "left" | "center" | "right";

interface SectionHeadingProps {
  /** Título principal (se renderiza con la fuente display) */
  title: string;
  /** Subtítulo opcional */
  subtitle?: string;
  /** Alineación del bloque */
  align?: Align;
  /** Texto pequeño sobre el título (eyebrow) */
  eyebrow?: string;
  className?: string;
}

const alignClasses: Record<Align, string> = {
  left: "text-left items-start",
  center: "text-center items-center",
  right: "text-right items-end",
};

export function SectionHeading({
  title,
  subtitle,
  align = "left",
  eyebrow,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-3", alignClasses[align], className)}>
      {eyebrow ? (
        <span className="text-sm font-medium uppercase tracking-widest text-primary">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
