"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  nombre: z.string().min(2, "Ingresa tu nombre completo."),
  telefono: z.string().min(9, "Ingresa un teléfono válido."),
  email: z.string().email("Ingresa un correo electrónico válido."),
  mensaje: z.string().min(10, "Cuéntanos un poco más (mínimo 10 caracteres)."),
  // Campos ocultos
  vehicle_id: z.string().optional(),
  origen: z.enum(["cotizacion", "precalificacion", "contacto"]),
  // Honeypot anti-spam (debe quedar vacío)
  website: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface QuoteFormProps {
  /** Vehículo asociado (solo para cotizaciones). */
  vehicleId?: string;
  /** Tipo de lead que genera el formulario. */
  origen?: "cotizacion" | "precalificacion" | "contacto";
  /** Mensaje prellenado. */
  defaultMensaje?: string;
  /** Texto del botón de envío. */
  submitLabel?: string;
}

function defaultSubmitLabel(origen: QuoteFormProps["origen"]): string {
  if (origen === "precalificacion") return "Solicitar precalificación";
  if (origen === "contacto") return "Enviar mensaje";
  return "Enviar cotización";
}

export function QuoteForm({
  vehicleId,
  origen = "cotizacion",
  defaultMensaje = "",
  submitLabel,
}: QuoteFormProps) {
  const [enviado, setEnviado] = React.useState(false);
  const [errorEnvio, setErrorEnvio] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: "",
      telefono: "",
      email: "",
      mensaje: defaultMensaje,
      vehicle_id: vehicleId ?? "",
      origen,
      website: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setErrorEnvio(false);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Request failed");
      reset({
        nombre: "",
        telefono: "",
        email: "",
        mensaje: defaultMensaje,
        vehicle_id: vehicleId ?? "",
        origen,
        website: "",
      });
      setEnviado(true);
    } catch {
      setErrorEnvio(true);
    }
  }

  if (enviado) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-background p-8 text-center">
        <CheckCircle2 className="size-10 text-primary" aria-hidden />
        <p className="font-display text-lg font-semibold text-foreground">
          ¡Mensaje enviado! Te contactaremos pronto.
        </p>
        <Button variant="outline" onClick={() => setEnviado(false)}>
          Enviar otro mensaje
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      <input type="hidden" {...register("vehicle_id")} />
      <input type="hidden" {...register("origen")} />

      {/* Honeypot: oculto para personas, visible para bots */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="website">No completar este campo</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="nombre" className="text-sm font-medium text-foreground">
            Nombre
          </label>
          <Input id="nombre" autoComplete="name" {...register("nombre")} />
          {errors.nombre ? (
            <p className="text-sm text-destructive">{errors.nombre.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="telefono" className="text-sm font-medium text-foreground">
            Teléfono
          </label>
          <Input
            id="telefono"
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
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Correo electrónico
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="mensaje" className="text-sm font-medium text-foreground">
          Mensaje
        </label>
        <Textarea id="mensaje" rows={4} {...register("mensaje")} />
        {errors.mensaje ? (
          <p className="text-sm text-destructive">{errors.mensaje.message}</p>
        ) : null}
      </div>

      {errorEnvio ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          No pudimos enviar tu mensaje. Inténtalo nuevamente o escríbenos por
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
          submitLabel ?? defaultSubmitLabel(origen)
        )}
      </Button>
    </form>
  );
}
