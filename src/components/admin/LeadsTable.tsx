"use client";

import * as React from "react";
import Link from "next/link";
import { Download, Search, Phone, Mail, Loader2, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { WhatsAppButton } from "@/components/whatsapp-button";
import {
  LEAD_ESTADOS,
  LEAD_ORIGENES,
  leadEstadoInfo,
  leadOrigenLabel,
} from "@/lib/lead-options";
import type { LeadEstado } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface AdminLead {
  id: string;
  created_at: string;
  updated_at: string;
  nombre: string;
  telefono: string | null;
  email: string | null;
  mensaje: string | null;
  origen: string;
  estado: string;
  notas: string | null;
  vehiculo: { id: string; marca: string; modelo: string; anio: number } | null;
}

const fieldClass =
  "h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function formatFecha(iso: string): string {
  return new Date(iso).toLocaleString("es-CL", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function vehiculoLabel(lead: AdminLead): string {
  return lead.vehiculo
    ? `${lead.vehiculo.marca} ${lead.vehiculo.modelo} ${lead.vehiculo.anio}`
    : "—";
}

/** Número listo para wa.me (solo dígitos, con código de país de Chile). */
function waNumber(tel: string): string {
  const digits = tel.replace(/\D/g, "").replace(/^0+/, "");
  return digits.startsWith("56") ? digits : `56${digits}`;
}

function csvCell(value: string | number | null): string {
  const s = value == null ? "" : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

function EstadoBadge({ estado }: { estado: string }) {
  const info = leadEstadoInfo(estado);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        info.badge
      )}
    >
      {info.label}
    </span>
  );
}

export function LeadsTable({ leads }: { leads: AdminLead[] }) {
  const [list, setList] = React.useState<AdminLead[]>(leads);
  const [estadoFilter, setEstadoFilter] = React.useState("");
  const [origenFilter, setOrigenFilter] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter((l) => {
      if (estadoFilter && l.estado !== estadoFilter) return false;
      if (origenFilter && l.origen !== origenFilter) return false;
      if (q) {
        const hay = `${l.nombre} ${l.telefono ?? ""} ${l.email ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [list, estadoFilter, origenFilter, query]);

  const selected = list.find((l) => l.id === selectedId) ?? null;

  function updateLocal(id: string, patch: Partial<AdminLead>) {
    setList((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }

  function exportCSV() {
    const header = [
      "Fecha",
      "Nombre",
      "Teléfono",
      "Email",
      "Origen",
      "Estado",
      "Vehículo",
      "Mensaje",
      "Notas",
    ];
    const rows = filtered.map((l) =>
      [
        formatFecha(l.created_at),
        l.nombre,
        l.telefono,
        l.email,
        leadOrigenLabel(l.origen),
        leadEstadoInfo(l.estado).label,
        l.vehiculo ? vehiculoLabel(l) : "",
        l.mensaje,
        l.notas,
      ]
        .map(csvCell)
        .join(",")
    );
    const csv = [header.map(csvCell).join(","), ...rows].join("\r\n");
    const blob = new Blob(["﻿" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-trench-motors-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filtros + búsqueda + export */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, teléfono o email"
              className="pl-9 sm:w-72"
              aria-label="Buscar leads"
            />
          </div>
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className={fieldClass}
            aria-label="Filtrar por estado"
          >
            <option value="">Todos los estados</option>
            {LEAD_ESTADOS.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
          </select>
          <select
            value={origenFilter}
            onChange={(e) => setOrigenFilter(e.target.value)}
            className={fieldClass}
            aria-label="Filtrar por origen"
          >
            <option value="">Todos los orígenes</option>
            {LEAD_ORIGENES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <Button
          variant="outline"
          className="gap-2 sm:self-start"
          onClick={exportCSV}
          disabled={filtered.length === 0}
        >
          <Download className="size-4" aria-hidden />
          Exportar CSV
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "lead" : "leads"}
        {filtered.length !== list.length ? ` de ${list.length}` : ""}.
      </p>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
          No hay leads que coincidan con los filtros.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="border-b border-border bg-card text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="p-3 font-medium">Fecha</th>
                <th className="p-3 font-medium">Nombre</th>
                <th className="p-3 font-medium">Contacto</th>
                <th className="p-3 font-medium">Origen</th>
                <th className="p-3 font-medium">Estado</th>
                <th className="p-3 font-medium">Vehículo</th>
                <th className="p-3 text-right font-medium">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((lead) => (
                <tr key={lead.id} className="bg-background hover:bg-card">
                  <td className="whitespace-nowrap p-3 text-muted-foreground">
                    {formatFecha(lead.created_at)}
                  </td>
                  <td className="p-3 font-medium text-foreground">
                    {lead.nombre}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    <div className="flex flex-col">
                      <span>{lead.telefono ?? "—"}</span>
                      <span className="text-xs">{lead.email ?? ""}</span>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {leadOrigenLabel(lead.origen)}
                  </td>
                  <td className="p-3">
                    <EstadoBadge estado={lead.estado} />
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {lead.vehiculo ? (
                      <Link
                        href={`/admin/vehiculos/${lead.vehiculo.id}/editar`}
                        className="text-foreground underline-offset-2 hover:text-primary hover:underline"
                      >
                        {vehiculoLabel(lead)}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedId(lead.id)}
                    >
                      Ver / gestionar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <LeadDialog
        lead={selected}
        onClose={() => setSelectedId(null)}
        onSaved={updateLocal}
      />
    </div>
  );
}

function LeadDialog({
  lead,
  onClose,
  onSaved,
}: {
  lead: AdminLead | null;
  onClose: () => void;
  onSaved: (id: string, patch: Partial<AdminLead>) => void;
}) {
  const [estado, setEstado] = React.useState<LeadEstado>("nuevo");
  const [notas, setNotas] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [savedOk, setSavedOk] = React.useState(false);
  const [error, setError] = React.useState(false);

  // Sincroniza el formulario cuando se abre/cambia el lead seleccionado.
  React.useEffect(() => {
    if (!lead) return;
    setEstado(lead.estado as LeadEstado);
    setNotas(lead.notas ?? "");
    setSavedOk(false);
    setError(false);
  }, [lead]);

  if (!lead) return null;

  async function guardar() {
    if (!lead) return;
    setSaving(true);
    setError(false);
    setSavedOk(false);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado, notas }),
      });
      if (!res.ok) throw new Error();
      onSaved(lead.id, {
        estado,
        notas: notas.trim() ? notas : null,
        updated_at: new Date().toISOString(),
      });
      setSavedOk(true);
    } catch {
      setError(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={lead !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-2">
            {lead.nombre}
            <EstadoBadge estado={lead.estado} />
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Datos */}
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <Dato label="Teléfono" value={lead.telefono ?? "—"} />
            <Dato label="Email" value={lead.email ?? "—"} />
            <Dato label="Origen" value={leadOrigenLabel(lead.origen)} />
            <Dato label="Recibido" value={formatFecha(lead.created_at)} />
            <Dato
              label="Vehículo"
              value={vehiculoLabel(lead)}
              href={
                lead.vehiculo
                  ? `/admin/vehiculos/${lead.vehiculo.id}/editar`
                  : undefined
              }
            />
            <Dato label="Última act." value={formatFecha(lead.updated_at)} />
          </dl>

          {/* Mensaje */}
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Mensaje
            </p>
            <p className="mt-1 whitespace-pre-wrap rounded-md border border-border bg-background p-3 text-sm text-foreground">
              {lead.mensaje || "—"}
            </p>
          </div>

          {/* Acciones de contacto */}
          <div className="flex flex-wrap gap-2">
            {lead.telefono ? (
              <WhatsAppButton
                phone={waNumber(lead.telefono)}
                message={`Hola ${lead.nombre}, te contactamos de ${siteConfig.nombre} por tu consulta.`}
                label="WhatsApp"
                size="sm"
              />
            ) : null}
            {lead.telefono ? (
              <Button asChild variant="outline" size="sm" className="gap-1.5">
                <a href={`tel:${lead.telefono}`}>
                  <Phone className="size-4" aria-hidden />
                  Llamar
                </a>
              </Button>
            ) : null}
            {lead.email ? (
              <Button asChild variant="outline" size="sm" className="gap-1.5">
                <a href={`mailto:${lead.email}`}>
                  <Mail className="size-4" aria-hidden />
                  Email
                </a>
              </Button>
            ) : null}
          </div>

          {/* Estado + notas */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="lead-estado"
              className="text-sm font-medium text-foreground"
            >
              Estado
            </label>
            <select
              id="lead-estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value as LeadEstado)}
              className={fieldClass}
            >
              {LEAD_ESTADOS.map((e) => (
                <option key={e.value} value={e.value}>
                  {e.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="lead-notas"
              className="text-sm font-medium text-foreground"
            >
              Notas de seguimiento
            </label>
            <Textarea
              id="lead-notas"
              rows={4}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Registra el seguimiento de este lead…"
            />
          </div>

          {error ? (
            <p className="text-sm text-destructive">
              No se pudo guardar. Inténtalo nuevamente.
            </p>
          ) : null}

          <div className="flex items-center justify-end gap-3">
            {savedOk ? (
              <span className="flex items-center gap-1 text-sm text-emerald-400">
                <Check className="size-4" aria-hidden />
                Guardado
              </span>
            ) : null}
            <Button onClick={guardar} disabled={saving} className="gap-2">
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Guardando…
                </>
              ) : (
                "Guardar cambios"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Dato({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex flex-col">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-foreground">
        {href ? (
          <Link
            href={href}
            className="underline-offset-2 hover:text-primary hover:underline"
          >
            {value}
          </Link>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
