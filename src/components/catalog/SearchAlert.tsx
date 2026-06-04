"use client";

import * as React from "react";
import { BellRing, CheckCircle2, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchAlertProps {
  /** Filtros activos del catálogo, que se guardan junto al email. */
  filtros: Record<string, string>;
  /** Texto del encabezado (cambia entre banner y estado vacío). */
  title?: string;
  description?: string;
  className?: string;
}

/**
 * Captura de leads: "Avísame cuando llegue un auto así". Guarda el email + los
 * filtros activos en alertas_busqueda (vía POST /api/alertas). El envío del
 * email cuando llega un auto que calza es un proceso aparte (ver TODO en la API).
 */
export function SearchAlert({
  filtros,
  title = "Avísame cuando llegue un auto así",
  description = "Te escribimos cuando ingrese un vehículo que calce con tu búsqueda.",
  className,
}: SearchAlertProps) {
  const [email, setEmail] = React.useState("");
  const [website, setWebsite] = React.useState(""); // honeypot
  const [estado, setEstado] = React.useState<
    "idle" | "enviando" | "ok" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (estado === "enviando") return;
    setEstado("enviando");
    try {
      const res = await fetch("/api/alertas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, filtros, website }),
      });
      if (!res.ok) throw new Error("Request failed");
      setEstado("ok");
      setEmail("");
    } catch {
      setEstado("error");
    }
  }

  if (estado === "ok") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-sm",
          className
        )}
      >
        <CheckCircle2 className="size-5 shrink-0 text-primary" aria-hidden />
        <p className="text-foreground">
          ¡Listo! Te avisaremos cuando tengamos un auto que calce con tu
          búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-5 sm:p-6",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <BellRing className="size-4" aria-hidden />
        </span>
        <div>
          <h3 className="font-display text-base font-semibold text-foreground">
            {title}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-4 flex flex-col gap-3 sm:flex-row"
        noValidate
      >
        {/* Honeypot oculto */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden"
        >
          <label htmlFor="alerta-website">No completar</label>
          <input
            id="alerta-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <Input
          type="email"
          required
          autoComplete="email"
          placeholder="tu@correo.cl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Correo electrónico para la alerta"
          className="sm:flex-1"
        />
        <Button type="submit" disabled={estado === "enviando"} className="gap-2">
          {estado === "enviando" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Enviando…
            </>
          ) : (
            "Avísame"
          )}
        </Button>
      </form>

      {estado === "error" ? (
        <p className="mt-2 text-sm text-destructive">
          No pudimos guardar tu alerta. Inténtalo nuevamente.
        </p>
      ) : null}
    </div>
  );
}
