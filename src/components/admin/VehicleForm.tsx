"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Star, Trash2, Upload, GripVertical } from "lucide-react";

import { cn } from "@/lib/utils";
import { slugify } from "@/lib/slug";
import { createClient } from "@/lib/supabase/client";
import { VEHICLE_PHOTOS_BUCKET } from "@/lib/storage";
import { vehicleFieldsSchema, type VehicleFields } from "@/lib/vehicle-schema";
import {
  TIPOS,
  CONDICIONES,
  TRANSMISIONES,
  COMBUSTIBLES,
} from "@/lib/vehicle-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { VehicleWithImages } from "@/types/vehicle";

interface VehicleFormProps {
  vehicle?: VehicleWithImages;
}

type ImageItem = {
  key: string;
  url: string;
  es_principal: boolean;
  status: "uploading" | "ready" | "error";
};

const labelClass = "text-sm font-medium text-foreground";
const fieldClass =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function VehicleForm({ vehicle }: VehicleFormProps) {
  const router = useRouter();
  const supabase = React.useMemo(() => createClient(), []);
  const isEdit = Boolean(vehicle);

  const [images, setImages] = React.useState<ImageItem[]>(
    () =>
      vehicle?.imagenes.map((img) => ({
        key: img.id,
        url: img.url,
        es_principal: img.es_principal,
        status: "ready" as const,
      })) ?? []
  );
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const dragIndex = React.useRef<number | null>(null);
  const slugManual = React.useRef<boolean>(isEdit);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFields>({
    resolver: zodResolver(vehicleFieldsSchema),
    defaultValues: {
      marca: vehicle?.marca ?? "",
      modelo: vehicle?.modelo ?? "",
      version: vehicle?.version ?? "",
      anio: vehicle?.anio ?? new Date().getFullYear(),
      precio: vehicle?.precio ?? 0,
      kilometraje: vehicle?.kilometraje ?? 0,
      tipo: vehicle?.tipo ?? "sedan",
      transmision: vehicle?.transmision ?? "automatica",
      combustible: vehicle?.combustible ?? "bencina",
      color: vehicle?.color ?? "",
      puertas: vehicle?.puertas ?? 4,
      condicion: vehicle?.condicion ?? "usado",
      descripcion: vehicle?.descripcion ?? "",
      destacado: vehicle?.destacado ?? false,
      vendido: vehicle?.vendido ?? false,
      slug: vehicle?.slug ?? "",
    },
  });

  // Slug automático desde marca + modelo + año (si no se editó a mano).
  const marca = watch("marca");
  const modelo = watch("modelo");
  const anio = watch("anio");
  React.useEffect(() => {
    if (slugManual.current) return;
    setValue("slug", slugify(`${marca ?? ""} ${modelo ?? ""} ${anio ?? ""}`));
  }, [marca, modelo, anio, setValue]);

  const uploading = images.some((i) => i.status === "uploading");

  async function uploadFiles(files: FileList) {
    for (const file of Array.from(files)) {
      const key =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;
      setImages((prev) => [
        ...prev,
        { key, url: "", es_principal: prev.length === 0, status: "uploading" },
      ]);
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${key}.${ext}`;
      const { error } = await supabase.storage
        .from(VEHICLE_PHOTOS_BUCKET)
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) {
        setImages((prev) =>
          prev.map((it) => (it.key === key ? { ...it, status: "error" } : it))
        );
        continue;
      }
      const { data } = supabase.storage
        .from(VEHICLE_PHOTOS_BUCKET)
        .getPublicUrl(path);
      setImages((prev) =>
        prev.map((it) =>
          it.key === key
            ? { ...it, url: data.publicUrl, status: "ready" }
            : it
        )
      );
    }
  }

  function setPrincipal(key: string) {
    setImages((prev) =>
      prev.map((it) => ({ ...it, es_principal: it.key === key }))
    );
  }

  function removeImage(key: string) {
    setImages((prev) => {
      const filtered = prev.filter((it) => it.key !== key);
      if (filtered.length > 0 && !filtered.some((it) => it.es_principal)) {
        filtered[0] = { ...filtered[0], es_principal: true };
      }
      return filtered;
    });
  }

  function onDrop(targetIndex: number) {
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from === null || from === targetIndex) return;
    setImages((prev) => {
      const arr = [...prev];
      const [moved] = arr.splice(from, 1);
      arr.splice(targetIndex, 0, moved);
      return arr;
    });
  }

  async function onValid(values: VehicleFields) {
    setSubmitError(null);
    const ready = images.filter((it) => it.status === "ready");
    const hasPrincipal = ready.some((it) => it.es_principal);
    const imagenes = ready.map((it, i) => ({
      url: it.url,
      orden: i,
      es_principal: hasPrincipal ? it.es_principal : i === 0,
    }));

    const url = isEdit
      ? `/api/admin/vehicles/${vehicle!.id}`
      : "/api/admin/vehicles";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, imagenes }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setSubmitError(data?.error ?? "No se pudo guardar el vehículo.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setSubmitError("No se pudo guardar el vehículo. Inténtalo nuevamente.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="flex flex-col gap-8" noValidate>
      {/* Datos principales */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Marca" error={errors.marca?.message}>
          <Input {...register("marca")} />
        </Field>
        <Field label="Modelo" error={errors.modelo?.message}>
          <Input {...register("modelo")} />
        </Field>
        <Field label="Versión" error={errors.version?.message}>
          <Input {...register("version")} placeholder="Opcional" />
        </Field>
        <Field label="Año" error={errors.anio?.message}>
          <Input type="number" {...register("anio", { valueAsNumber: true })} />
        </Field>
        <Field label="Precio (CLP)" error={errors.precio?.message}>
          <Input
            type="number"
            step={100000}
            {...register("precio", { valueAsNumber: true })}
          />
        </Field>
        <Field label="Kilometraje" error={errors.kilometraje?.message}>
          <Input
            type="number"
            step={1000}
            {...register("kilometraje", { valueAsNumber: true })}
          />
        </Field>
      </section>

      {/* Características */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Tipo" error={errors.tipo?.message}>
          <select className={fieldClass} {...register("tipo")}>
            {TIPOS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Transmisión" error={errors.transmision?.message}>
          <select className={fieldClass} {...register("transmision")}>
            {TRANSMISIONES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Combustible" error={errors.combustible?.message}>
          <select className={fieldClass} {...register("combustible")}>
            {COMBUSTIBLES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Color" error={errors.color?.message}>
          <Input {...register("color")} placeholder="Opcional" />
        </Field>
        <Field label="Puertas" error={errors.puertas?.message}>
          <Input
            type="number"
            {...register("puertas", { valueAsNumber: true })}
          />
        </Field>
        <Field label="Condición" error={errors.condicion?.message}>
          <select className={fieldClass} {...register("condicion")}>
            {CONDICIONES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
      </section>

      {/* Slug */}
      <Field
        label="Slug (URL)"
        error={errors.slug?.message}
        hint="Se genera automáticamente; puedes editarlo."
      >
        <Input
          {...register("slug", {
            onChange: () => {
              slugManual.current = true;
            },
          })}
        />
      </Field>

      {/* Descripción */}
      <Field label="Descripción" error={errors.descripcion?.message}>
        <Textarea rows={4} {...register("descripcion")} placeholder="Opcional" />
      </Field>

      {/* Flags */}
      <section className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" className="size-4 accent-primary" {...register("destacado")} />
          Destacado
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" className="size-4 accent-primary" {...register("vendido")} />
          Vendido
        </label>
      </section>

      {/* Imágenes */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className={labelClass}>Fotos</span>
          <label className={cn("cursor-pointer", "inline-flex")}>
            <span className="inline-flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground hover:bg-secondary">
              <Upload className="size-4" aria-hidden />
              Subir fotos
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) uploadFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        </div>
        <p className="text-xs text-muted-foreground">
          Arrastra para reordenar. Marca una como principal (★).
        </p>

        {images.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Aún no has agregado fotos.
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((img, index) => (
              <li
                key={img.key}
                draggable
                onDragStart={() => {
                  dragIndex.current = index;
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(index)}
                className={cn(
                  "group relative overflow-hidden rounded-lg border bg-muted",
                  img.es_principal ? "border-primary" : "border-border"
                )}
              >
                <div className="relative aspect-video w-full">
                  {img.status === "ready" && img.url ? (
                    <Image
                      src={img.url}
                      alt=""
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                      {img.status === "uploading" ? (
                        <Loader2 className="size-5 animate-spin" aria-hidden />
                      ) : (
                        "Error"
                      )}
                    </div>
                  )}
                </div>
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-1.5">
                  <span className="rounded bg-black/50 p-1 text-white">
                    <GripVertical className="size-3.5" aria-hidden />
                  </span>
                  {img.es_principal ? (
                    <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary-foreground">
                      Principal
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center justify-between gap-1 p-1.5">
                  <button
                    type="button"
                    onClick={() => setPrincipal(img.key)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded px-1.5 py-1 text-xs",
                      img.es_principal
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    aria-label="Marcar como principal"
                  >
                    <Star
                      className={cn("size-4", img.es_principal && "fill-current")}
                      aria-hidden
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(img.key)}
                    className="inline-flex items-center rounded px-1.5 py-1 text-xs text-muted-foreground hover:text-destructive"
                    aria-label="Eliminar foto"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {submitError ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {submitError}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={isSubmitting || uploading} className="gap-2">
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Guardando…
            </>
          ) : isEdit ? (
            "Guardar cambios"
          ) : (
            "Publicar vehículo"
          )}
        </Button>
        {uploading ? (
          <span className="text-sm text-muted-foreground">Subiendo fotos…</span>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelClass}>{label}</label>
      {children}
      {hint && !error ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
