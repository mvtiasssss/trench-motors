"use client";

import * as React from "react";
import { Download, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface AdminLead {
  id: string;
  created_at: string;
  nombre: string;
  telefono: string | null;
  email: string | null;
  mensaje: string | null;
  origen: string;
  vehiculo: { marca: string; modelo: string; anio: number } | null;
}

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

function csvCell(value: string | number | null): string {
  const s = value == null ? "" : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

export function LeadsTable({ leads }: { leads: AdminLead[] }) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  function exportCSV() {
    const header = [
      "Fecha",
      "Nombre",
      "Teléfono",
      "Email",
      "Origen",
      "Vehículo",
      "Mensaje",
    ];
    const rows = leads.map((l) =>
      [
        formatFecha(l.created_at),
        l.nombre,
        l.telefono,
        l.email,
        l.origen,
        l.vehiculo ? vehiculoLabel(l) : "",
        l.mensaje,
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

  if (leads.length === 0) {
    return (
      <p className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
        Aún no hay leads.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button variant="outline" className="gap-2" onClick={exportCSV}>
          <Download className="size-4" aria-hidden />
          Exportar CSV
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="border-b border-border bg-card text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="p-3 font-medium">Fecha</th>
              <th className="p-3 font-medium">Nombre</th>
              <th className="p-3 font-medium">Teléfono</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Origen</th>
              <th className="p-3 font-medium">Vehículo</th>
              <th className="p-3 font-medium" aria-label="Expandir" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.map((lead) => {
              const expanded = expandedId === lead.id;
              return (
                <React.Fragment key={lead.id}>
                  <tr
                    className="cursor-pointer bg-background hover:bg-card"
                    onClick={() =>
                      setExpandedId(expanded ? null : lead.id)
                    }
                  >
                    <td className="whitespace-nowrap p-3 text-muted-foreground">
                      {formatFecha(lead.created_at)}
                    </td>
                    <td className="p-3 font-medium text-foreground">
                      {lead.nombre}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {lead.telefono ?? "—"}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {lead.email ?? "—"}
                    </td>
                    <td className="p-3 capitalize text-muted-foreground">
                      {lead.origen}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {vehiculoLabel(lead)}
                    </td>
                    <td className="p-3 text-right">
                      <ChevronDown
                        className={cn(
                          "ml-auto size-4 text-muted-foreground transition-transform",
                          expanded && "rotate-180"
                        )}
                        aria-hidden
                      />
                    </td>
                  </tr>
                  {expanded ? (
                    <tr className="bg-card">
                      <td colSpan={7} className="p-4">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          Mensaje
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-foreground">
                          {lead.mensaje || "—"}
                        </p>
                      </td>
                    </tr>
                  ) : null}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
