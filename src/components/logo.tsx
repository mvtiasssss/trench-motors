import * as React from "react";
import { cn } from "@/lib/utils";

/*
  Logo de Trench Motors recreado como SVG vectorial (aproximación estilizada del
  emblema original: escudo cromado + silueta de auto deportivo + wordmark con
  acento rojo). Fondo transparente, escalable y con los colores del tema.

  - <LogoMark/>: solo el escudo + auto (sin texto).
  - <Logo variant="full"/>: emblema completo con el texto dentro del escudo.
  - <Logo variant="horizontal"/>: escudo + wordmark al costado (ideal en headers).
*/

/** Degradado "cromo" reutilizable. `id` debe ser único por instancia. */
function ChromeGradient({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#f5f6f8" />
      <stop offset="0.45" stopColor="#bcc1c9" />
      <stop offset="0.5" stopColor="#868c96" />
      <stop offset="0.56" stopColor="#d2d6dc" />
      <stop offset="1" stopColor="#7c828b" />
    </linearGradient>
  );
}

const SHIELD_OUTER =
  "M34,58 Q34,40 52,40 H188 Q206,40 206,58 V150 Q206,176 184,193 L130,244 Q120,252 110,244 L56,193 Q34,176 34,150 Z";
const SHIELD_INNER =
  "M50,68 Q50,52 64,52 H176 Q190,52 190,68 V146 Q190,168 172,183 L128,225 Q120,231 112,225 L68,183 Q50,168 50,146 Z";

/** Escudo + silueta del auto (sin texto). */
export function LogoMark({ className }: { className?: string }) {
  const gid = React.useId();
  return (
    <svg
      viewBox="0 0 240 168"
      className={className}
      role="img"
      aria-label="Trench Motors"
    >
      <title>Trench Motors</title>
      <defs>
        <ChromeGradient id={gid} />
      </defs>
      <g
        fill="none"
        stroke={`url(#${gid})`}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Escudo */}
        <path d={SHIELD_OUTER} strokeWidth={7} />
        <path d={SHIELD_INNER} strokeWidth={3} />
        {/* Carrocería (líneas fluidas) */}
        <path
          d="M62,150 C60,140 66,134 76,132 C96,127 106,124 118,114 C126,107 134,103 146,104 C158,105 167,111 173,122 C177,129 180,138 182,147"
          strokeWidth={5}
        />
        <path
          d="M86,150 C100,146 150,146 168,150"
          strokeWidth={4}
        />
        {/* Ruedas */}
        <circle cx="92" cy="150" r="14" strokeWidth={5} />
        <circle cx="160" cy="150" r="14" strokeWidth={5} />
      </g>
      <g fill={`url(#${gid})`}>
        <circle cx="92" cy="150" r="4" />
        <circle cx="160" cy="150" r="4" />
      </g>
    </svg>
  );
}

/** Emblema completo con el texto dentro del escudo. */
function Emblem({ className }: { className?: string }) {
  const gid = React.useId();
  return (
    <svg
      viewBox="0 0 240 268"
      className={className}
      role="img"
      aria-label="Trench Motors"
    >
      <title>Trench Motors</title>
      <defs>
        <ChromeGradient id={gid} />
      </defs>
      <g
        fill="none"
        stroke={`url(#${gid})`}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={SHIELD_OUTER} strokeWidth={7} />
        <path d={SHIELD_INNER} strokeWidth={3} />
        <path
          d="M62,150 C60,140 66,134 76,132 C96,127 106,124 118,114 C126,107 134,103 146,104 C158,105 167,111 173,122 C177,129 180,138 182,147"
          strokeWidth={5}
        />
        <path d="M86,150 C100,146 150,146 168,150" strokeWidth={4} />
        <circle cx="92" cy="150" r="14" strokeWidth={5} />
        <circle cx="160" cy="150" r="14" strokeWidth={5} />
      </g>
      <g fill={`url(#${gid})`}>
        <circle cx="92" cy="150" r="4" />
        <circle cx="160" cy="150" r="4" />
      </g>
      {/* Acento rojo */}
      <rect
        x="104"
        y="170"
        width="32"
        height="7"
        rx="2"
        style={{ fill: "hsl(var(--primary))" }}
      />
      {/* Wordmark */}
      <text
        x="120"
        y="206"
        textAnchor="middle"
        fontSize="38"
        fontWeight={800}
        letterSpacing="2"
        fill={`url(#${gid})`}
        style={{ fontFamily: "var(--font-display), sans-serif" }}
      >
        TRENCH
      </text>
      <text
        x="120"
        y="230"
        textAnchor="middle"
        fontSize="16"
        fontWeight={600}
        letterSpacing="9"
        style={{
          fontFamily: "var(--font-display), sans-serif",
          fill: "hsl(var(--silver))",
        }}
      >
        MOTORS
      </text>
    </svg>
  );
}

interface LogoProps {
  className?: string;
  variant?: "full" | "horizontal";
}

export function Logo({ className, variant = "full" }: LogoProps) {
  if (variant === "horizontal") {
    return (
      <span className={cn("inline-flex items-center gap-3", className)}>
        <LogoMark className="h-10 w-auto shrink-0" />
        <span className="flex flex-col items-start leading-none">
          <span className="mb-1 h-[3px] w-5 rounded-sm bg-primary" aria-hidden />
          <span className="font-display text-xl font-extrabold uppercase tracking-[0.16em] text-silver">
            Trench
          </span>
          <span className="mt-0.5 font-display text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-muted-foreground">
            Motors
          </span>
        </span>
      </span>
    );
  }

  return <Emblem className={cn("h-auto w-auto", className)} />;
}
