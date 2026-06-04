"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarCheck, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const FRANJAS = [
  { value: "manana", label: "Mañana (9–13h)" },
  { value: "tarde", label: "Tarde (14–19h)" },
] as const;

/** Fecha de hoy en formato YYYY-MM-DD según la zona horaria local. */
function hoyISO(): string {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

const schema = z.object({
  nombre: z.string().min(2, "Ingresa tu nombre completo."),
  telefono: z.string().min(9, "Ingresa un teléfono válido."),
  email: z.string().email("Ingresa un correo electrónico válido."),
  fecha: z
    .string()
    .min(1, "Elige una fecha.")
    .refine((v) => v >= hoyISO(), "La fecha no puede ser anterior a hoy."),
  franja: z.enum(["manana", "tarde"]),
  mensaje: z.string().optional(),
  vehicle_id: z.string().optional(),
  // Honeypot anti-spam (debe quedar vacío)
  website: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface AgendarVisitaProps {
  /** Vehículo asociado (opcional). */
  vehicleId?: string;
  /** Etiqueta del vehículo, para prellenar el mensaje. */
  vehicleLabel?: string;
}

export function AgendarVisita({ vehicleId, vehicleLabel }: AgendarVisitaProps) {
  const [enviado, setEnviado] = React.useState(false);
  const [errorEnvio, setErrorEnvio] = React.useState(false);

  const defaults: FormValues = {
    nombre: "",
    telefono: "",
    email: "",
    fecha: "",
    franja: "manana",
    mensaje: "",
    vehicle_id: vehicleId ?? "",
    website: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  async function onSubmit(values: FormValues) {
    setErrorEnvio(false);

    const franjaLabel =
      FRANJAS.find((f) => f.value === values.franja)?.label ?? values.franja;

    // La fecha y la franja viajan dentro de "mensaje" (no alteramos el esquema
    // de leads). Siempre supera el mínimo de 10 caracteres del endpoint.
    let mensaje = `Solicita visita: ${values.fecha}, ${franjaLabel}.`;
    if (vehicleLabel) mensaje += ` Vehículo: ${vehicleLabel}.`;
    if (values.mensaje && values.mensaje.trim()) {
      mensaje += ` Mensaje: ${values.mensaje.trim()}`;
    }

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: values.nombre,
          telefono: values.telefono,
          email: values.email,
          mensaje,
          vehicle_id: values.vehicle_id || undefined,
          origen: "agendamiento",
          website: values.website,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      reset(defaults);
      setEnviado(true);
    } catch {
      setErrorEnvio(true);
    }
  }

  if (enviado) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-background p-8 text-center">
        <CalendarCheck className="size-10 text-primary" aria-hidden />
        <p className="font-display text-lg font-semibold text-foreground">
          ¡Solicitud enviada! Te confirmaremos tu visita pronto.
        </p>
        <Button variant="outline" onClick={() => setEnviado(false)}>
          Agendar otra visita
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {/* Honeypot: oculto para personas, visible para bots */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="av-website">No completar este campo</label>
        <input
          id="av-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="av-nombre" className="text-sm font-medium text-foreground">
            Nombre
          </label>
          <Input id="av-nombre" autoComplete="name" {...register("nombre")} />
          {errors.nombre ? (
            <p className="text-sm text-destructive">{errors.nombre.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="av-telefono" className="text-sm font-medium text-foreground">
            Teléfono
          </label>
          <Input
            id="av-telefono"
            type="tel"
            autoComplete="tel"
            placeholder="+56 9 ..."
            {...register("telefono")}
          />
          {errors.telefono ? (
            <p className="text-sm text-destructive">{errors.telefono.message}</p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="av-email" className="text-sm font-medium text-foreground">
          Correo electrónico
        </label>
        <Input id="av-email" type="email" autoComplete="email" {...register("email")} />
        {errors.email ? (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="av-fecha" className="text-sm font-medium text-foreground">
            Fecha preferida
          </label>
          <Input id="av-fecha" type="date" min={hoyISO()} {...register("fecha")} />
          {errors.fecha ? (
            <p className="text-sm text-destructive">{errors.fecha.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="av-franja" className="text-sm font-medium text-foreground">
            Franja horaria
          </label>
          <select
            id="av-franja"
            {...register("franja")}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {FRANJAS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="av-mensaje" className="text-sm font-medium text-foreground">
          Mensaje <span className="text-muted-foreground">(opcional)</span>
        </label>
        <Textarea
          id="av-mensaje"
          rows={3}
          placeholder="¿Algo que debamos saber para tu visita?"
          {...register("mensaje")}
        />
      </div>

      {errorEnvio ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          No pudimos enviar tu solicitud. Inténtalo nuevamente o escríbenos por
          WhatsApp.
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="gap-2 sm:self-start"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Enviando…
          </>
        ) : (
          <>
            <CalendarCheck className="size-4" aria-hidden />
            Agendar visita
          </>
        )}
      </Button>
    </form>
  );
}
