"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  nombre: z.string().min(2, "Ingresa tu nombre completo."),
  telefono: z.string().min(8, "Ingresa un teléfono válido."),
  email: z.string().email("Ingresa un correo electrónico válido."),
  mensaje: z.string().min(1, "Escribe un mensaje."),
  // Campos ocultos
  vehicle_id: z.string(),
  origen: z.literal("cotizacion"),
});

type FormValues = z.infer<typeof schema>;

interface QuoteFormProps {
  vehicleId: string;
  /** Mensaje prellenado (incluye marca/modelo/año del vehículo). */
  defaultMensaje: string;
}

export function QuoteForm({ vehicleId, defaultMensaje }: QuoteFormProps) {
  const [enviado, setEnviado] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: "",
      telefono: "",
      email: "",
      mensaje: defaultMensaje,
      vehicle_id: vehicleId,
      origen: "cotizacion",
    },
  });

  function onSubmit(values: FormValues) {
    // El envío real (Resend + guardar el lead) se conecta en la Parte 8.
    // Por ahora solo validamos y mostramos confirmación.
    console.log("Cotización validada (pendiente de envío):", values);
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-background p-8 text-center">
        <CheckCircle2 className="size-10 text-primary" aria-hidden />
        <p className="font-display text-lg font-semibold text-foreground">
          ¡Gracias por tu interés!
        </p>
        <p className="text-sm text-muted-foreground">
          Recibimos tus datos y te contactaremos a la brevedad.
        </p>
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

      <Button type="submit" size="lg" disabled={isSubmitting} className="sm:self-start">
        Enviar cotización
      </Button>
    </form>
  );
}
