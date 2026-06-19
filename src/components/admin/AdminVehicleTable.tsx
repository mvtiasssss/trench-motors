"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Copy } from "lucide-react";

import type { VehicleWithImages } from "@/types/vehicle";
import { cn } from "@/lib/utils";
import { formatCLP } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function fotoPrincipal(v: VehicleWithImages): string | undefined {
  return (v.imagenes.find((i) => i.es_principal) ?? v.imagenes[0])?.url;
}

function Toggle({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50",
        checked ? "bg-primary" : "bg-input"
      )}
    >
      <span
        className={cn(
          "inline-block size-5 transform rounded-full bg-white transition-transform",
          checked ? "translate-x-5" : "translate-x-1"
        )}
      />
    </button>
  );
}

export function AdminVehicleTable({
  vehicles,
}: {
  vehicles: VehicleWithImages[];
}) {
  const router = useRouter();
  const [list, setList] = React.useState(vehicles);
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [target, setTarget] = React.useState<VehicleWithImages | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  /** Crea una copia del vehículo (sin fotos) y abre su edición. */
  async function duplicate(v: VehicleWithImages) {
    setBusyId(v.id);
    try {
      const suffix = Date.now().toString(36).slice(-4);
      const payload = {
        marca: v.marca,
        modelo: v.modelo,
        version: v.version ?? "",
        anio: v.anio,
        precio: v.precio,
        kilometraje: v.kilometraje,
        tipo: v.tipo,
        transmision: v.transmision,
        combustible: v.combustible,
        color: v.color ?? "",
        puertas: v.puertas,
        condicion: v.condicion,
        descripcion: v.descripcion ?? "",
        video_url: v.video_url ?? "",
        destacado: false,
        vendido: false,
        slug: `${v.slug}-copia-${suffix}`,
        imagenes: [],
      };
      const res = await fetch("/api/admin/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => null)) as {
        id?: string;
      } | null;
      if (!res.ok || !data?.id) throw new Error();
      router.push(`/admin/vehiculos/${data.id}/editar?duplicado=1`);
      router.refresh();
    } catch {
      // Mantener la página; el usuario puede reintentar.
    } finally {
      setBusyId(null);
    }
  }

  async function toggle(
    id: string,
    field: "destacado" | "vendido",
    value: boolean
  ) {
    setBusyId(id);
    // Optimista
    setList((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
    try {
      const res = await fetch(`/api/admin/vehicles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) throw new Error();
    } catch {
      // Revertir
      setList((prev) =>
        prev.map((v) => (v.id === id ? { ...v, [field]: !value } : v))
      );
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!target) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/vehicles/${target.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setList((prev) => prev.filter((v) => v.id !== target.id));
      setTarget(null);
    } catch {
      // Mantener el diálogo; el usuario puede reintentar.
    } finally {
      setDeleting(false);
    }
  }

  if (list.length === 0) {
    return (
      <p className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
        Aún no hay vehículos. Publica el primero.
      </p>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="border-b border-border bg-card text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="p-3 font-medium">Foto</th>
              <th className="p-3 font-medium">Vehículo</th>
              <th className="p-3 font-medium">Precio</th>
              <th className="p-3 font-medium">Condición</th>
              <th className="p-3 font-medium">Destacado</th>
              <th className="p-3 font-medium">Vendido</th>
              <th className="p-3 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {list.map((v) => {
              const foto = fotoPrincipal(v);
              return (
                <tr key={v.id} className="bg-background">
                  <td className="p-3">
                    <div className="relative h-10 w-16 overflow-hidden rounded bg-[#0B0B0D]">
                      {foto ? (
                        <Image
                          src={foto}
                          alt={`${v.marca} ${v.modelo}`}
                          fill
                          sizes="64px"
                          className="object-contain"
                        />
                      ) : null}
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="font-medium text-foreground">
                      {v.marca} {v.modelo}
                    </p>
                    <p className="text-xs text-muted-foreground">{v.anio}</p>
                  </td>
                  <td className="p-3 font-medium text-foreground">
                    {formatCLP(v.precio)}
                  </td>
                  <td className="p-3 capitalize text-muted-foreground">
                    {v.condicion}
                  </td>
                  <td className="p-3">
                    <Toggle
                      label="Destacado"
                      checked={v.destacado}
                      disabled={busyId === v.id}
                      onChange={() => toggle(v.id, "destacado", !v.destacado)}
                    />
                  </td>
                  <td className="p-3">
                    <Toggle
                      label="Vendido"
                      checked={v.vendido}
                      disabled={busyId === v.id}
                      onChange={() => toggle(v.id, "vendido", !v.vendido)}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="outline" size="sm" className="gap-1">
                        <Link href={`/admin/vehiculos/${v.id}/editar`}>
                          <Pencil className="size-4" aria-hidden />
                          Editar
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        disabled={busyId === v.id}
                        onClick={() => duplicate(v)}
                      >
                        <Copy className="size-4" aria-hidden />
                        Duplicar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-destructive hover:text-destructive"
                        disabled={busyId === v.id}
                        onClick={() => setTarget(v)}
                      >
                        <Trash2 className="size-4" aria-hidden />
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog
        open={target !== null}
        onOpenChange={(open) => {
          if (!open) setTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar vehículo</DialogTitle>
            <DialogDescription>
              ¿Seguro que quieres eliminar{" "}
              <span className="font-medium text-foreground">
                {target?.marca} {target?.modelo} {target?.anio}
              </span>
              ? Esta acción no se puede deshacer y borra también sus fotos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTarget(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? "Eliminando…" : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
