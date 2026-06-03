"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { formatCLP } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PLAZOS = [12, 24, 36, 48, 60] as const;
const PIE_MAX_PCT = 80;
const TASA_DEFAULT = 14;

interface SimuladorCuotaProps {
  /** Precio del vehículo. Si no viene, el usuario lo ingresa. */
  precio?: number;
  /** Modo compacto (p. ej. dentro de la caja de precio del detalle). */
  compact?: boolean;
  className?: string;
}

const labelClass = "text-xs font-medium uppercase tracking-wide text-muted-foreground";

export function SimuladorCuota({
  precio: precioProp,
  compact = false,
  className,
}: SimuladorCuotaProps) {
  const [precio, setPrecio] = React.useState<number>(precioProp ?? 0);
  const [pie, setPie] = React.useState<number>(
    precioProp ? Math.round(precioProp * 0.2) : 0
  );
  const [plazo, setPlazo] = React.useState<number>(36);
  const [tasa, setTasa] = React.useState<number>(TASA_DEFAULT);

  // Si cambia el precio recibido por prop, re-sincroniza.
  React.useEffect(() => {
    if (precioProp == null) return;
    setPrecio(precioProp);
    setPie(Math.round(precioProp * 0.2));
  }, [precioProp]);

  const pieMax = Math.floor(precio * (PIE_MAX_PCT / 100));
  const piePct = precio > 0 ? Math.min(PIE_MAX_PCT, Math.round((pie / precio) * 100)) : 0;

  function handlePrecio(value: string) {
    const v = Math.max(0, Math.round(Number(value) || 0));
    setPrecio(v);
    setPie((prev) => Math.min(prev, Math.floor(v * (PIE_MAX_PCT / 100))));
  }

  function handlePieMonto(value: string) {
    const v = Math.min(Math.max(0, Math.round(Number(value) || 0)), pieMax);
    setPie(v);
  }

  function handlePieSlider(pct: number) {
    setPie(Math.round((precio * pct) / 100));
  }

  function handleTasa(value: string) {
    setTasa(Math.max(0, Number(value) || 0));
  }

  // --- Cálculo (amortización francesa) ---
  const montoFinanciado = Math.max(0, precio - pie);
  const i = tasa / 12 / 100;
  const n = plazo;
  let cuotaRaw = 0;
  if (montoFinanciado > 0 && n > 0) {
    if (i === 0) {
      cuotaRaw = montoFinanciado / n;
    } else {
      const factor = Math.pow(1 + i, n);
      cuotaRaw = (montoFinanciado * (i * factor)) / (factor - 1);
    }
  }
  const cuota = Math.round(cuotaRaw);
  const totalAPagar = cuota * n + pie;

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card",
        compact ? "p-4" : "p-5 sm:p-6",
        className
      )}
    >
      {!compact ? (
        <h3 className="mb-5 font-display text-xl font-bold uppercase tracking-tight text-foreground">
          Simulador de cuota
        </h3>
      ) : (
        <p className={cn(labelClass, "mb-3")}>Simula tu cuota</p>
      )}

      <div className="flex flex-col gap-4">
        {/* Precio */}
        {compact ? (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Precio</span>
            <span className="font-medium text-foreground">
              {formatCLP(precio)}
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sim-precio" className={labelClass}>
              Precio del vehículo (CLP)
            </label>
            <Input
              id="sim-precio"
              type="number"
              inputMode="numeric"
              min={0}
              step={500000}
              value={precio || ""}
              placeholder="Ej: 15.000.000"
              onChange={(e) => handlePrecio(e.target.value)}
            />
          </div>
        )}

        {/* Pie: slider + monto sincronizado */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="sim-pie" className={labelClass}>
              Pie ({piePct}%)
            </label>
            <Input
              id="sim-pie"
              type="number"
              inputMode="numeric"
              min={0}
              max={pieMax}
              step={100000}
              value={pie || ""}
              placeholder="0"
              onChange={(e) => handlePieMonto(e.target.value)}
              className="h-9 w-40 text-right"
            />
          </div>
          <input
            type="range"
            aria-label="Porcentaje de pie"
            min={0}
            max={PIE_MAX_PCT}
            step={1}
            value={piePct}
            disabled={precio <= 0}
            onChange={(e) => handlePieSlider(Number(e.target.value))}
            className="w-full accent-primary disabled:opacity-50"
          />
        </div>

        {/* Plazo */}
        <div className="flex flex-col gap-2">
          <span className={labelClass}>Plazo (meses)</span>
          <div className="flex flex-wrap gap-2">
            {PLAZOS.map((p) => (
              <Button
                key={p}
                type="button"
                size="sm"
                variant={plazo === p ? "default" : "outline"}
                onClick={() => setPlazo(p)}
                className="min-w-12"
              >
                {p}
              </Button>
            ))}
          </div>
        </div>

        {/* Tasa (editable; oculta en compacto) */}
        {!compact ? (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sim-tasa" className={labelClass}>
              Tasa de interés anual (%)
            </label>
            <Input
              id="sim-tasa"
              type="number"
              inputMode="decimal"
              min={0}
              step={0.1}
              value={tasa}
              onChange={(e) => handleTasa(e.target.value)}
              className="sm:w-40"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tasa anual</span>
            <span className="font-medium text-foreground">{tasa}%</span>
          </div>
        )}

        {/* Resultado */}
        <div className="rounded-md border border-border bg-background p-4">
          <p className={labelClass}>Cuota mensual</p>
          <p className="font-display text-3xl font-bold text-primary">
            {formatCLP(cuota)}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">
                Monto financiado
              </span>
              <span className="font-medium text-foreground">
                {formatCLP(montoFinanciado)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Total a pagar</span>
              <span className="font-medium text-foreground">
                {formatCLP(totalAPagar)}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Valores estimados y referenciales, sujetos a evaluación crediticia.
        </p>
      </div>
    </div>
  );
}
