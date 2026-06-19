import Link from "next/link";
import Image from "next/image";
import {
  Car,
  BadgeCheck,
  Star,
  Wallet,
  Inbox,
  Sparkles,
  BellRing,
  Eye,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { formatCLP } from "@/lib/format";
import { createAdminClient } from "@/lib/supabase/admin";
import { leadEstadoInfo, leadOrigenLabel } from "@/lib/lead-options";

export const metadata = { title: "Dashboard — Admin" };

interface TopVehiculo {
  id: string;
  marca: string;
  modelo: string;
  anio: number;
  vistas: number;
  foto?: string;
}

interface RecentLead {
  id: string;
  nombre: string;
  estado: string;
  origen: string;
  created_at: string;
}

const DIA = 24 * 60 * 60 * 1000;

function formatFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
  });
}

export default async function AdminDashboardPage() {
  let kpis = {
    publicados: 0,
    vendidos: 0,
    destacados: 0,
    valorInv: 0,
    leadsTotal: 0,
    leadsNuevos: 0,
    leads7: 0,
    alertas: 0,
  };
  let topVistos: TopVehiculo[] = [];
  let recientes: RecentLead[] = [];
  let serie: { dia: string; total: number }[] = [];

  try {
    const supabase = createAdminClient();
    const now = Date.now();
    const d7 = new Date(now - 7 * DIA).toISOString();
    const d14 = new Date(now - 13 * DIA).toISOString();

    const headCount = { count: "exact" as const, head: true };

    const [
      publicados,
      vendidos,
      destacados,
      inventario,
      leadsTotal,
      leadsNuevos,
      leads7,
      alertas,
      top,
      recent,
      serieRows,
    ] = await Promise.all([
      supabase.from("vehicles").select("id", headCount).eq("vendido", false),
      supabase.from("vehicles").select("id", headCount).eq("vendido", true),
      supabase.from("vehicles").select("id", headCount).eq("destacado", true),
      supabase.from("vehicles").select("precio").eq("vendido", false),
      supabase.from("leads").select("id", headCount),
      supabase.from("leads").select("id", headCount).eq("estado", "nuevo"),
      supabase.from("leads").select("id", headCount).gte("created_at", d7),
      supabase.from("alertas_busqueda").select("id", headCount),
      supabase
        .from("vehicles")
        .select(
          "id, marca, modelo, anio, vistas, imagenes:vehicle_images(url, es_principal, orden)"
        )
        .order("vistas", { ascending: false })
        .limit(5),
      supabase
        .from("leads")
        .select("id, nombre, estado, origen, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase.from("leads").select("created_at").gte("created_at", d14),
    ]);

    const valorInv = ((inventario.data ?? []) as { precio: number }[]).reduce(
      (sum, r) => sum + (r.precio ?? 0),
      0
    );

    kpis = {
      publicados: publicados.count ?? 0,
      vendidos: vendidos.count ?? 0,
      destacados: destacados.count ?? 0,
      valorInv,
      leadsTotal: leadsTotal.count ?? 0,
      leadsNuevos: leadsNuevos.count ?? 0,
      leads7: leads7.count ?? 0,
      alertas: alertas.count ?? 0,
    };

    topVistos = (
      (top.data ?? []) as {
        id: string;
        marca: string;
        modelo: string;
        anio: number;
        vistas: number | null;
        imagenes: { url: string; es_principal: boolean; orden: number }[];
      }[]
    ).map((v) => {
      const imgs = v.imagenes ?? [];
      const principal = imgs.find((i) => i.es_principal) ?? imgs[0];
      return {
        id: v.id,
        marca: v.marca,
        modelo: v.modelo,
        anio: v.anio,
        vistas: v.vistas ?? 0,
        foto: principal?.url,
      };
    });

    recientes = (recent.data ?? []) as RecentLead[];

    // Serie de leads por día (últimos 14 días, incluido hoy).
    const buckets = new Map<string, number>();
    for (let i = 13; i >= 0; i--) {
      buckets.set(new Date(now - i * DIA).toISOString().slice(0, 10), 0);
    }
    for (const r of (serieRows.data ?? []) as { created_at: string }[]) {
      const key = new Date(r.created_at).toISOString().slice(0, 10);
      if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
    serie = Array.from(buckets, ([dia, total]) => ({ dia, total }));
  } catch {
    // Sin datos (Supabase no configurado): se muestran ceros.
  }

  const maxSerie = Math.max(1, ...serie.map((s) => s.total));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Resumen de tu inventario y tus leads.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi icon={Car} label="Autos publicados" value={kpis.publicados} />
        <Kpi icon={BadgeCheck} label="Vendidos" value={kpis.vendidos} />
        <Kpi icon={Star} label="Destacados" value={kpis.destacados} />
        <Kpi
          icon={Wallet}
          label="Valor del inventario"
          value={formatCLP(kpis.valorInv)}
        />
        <Kpi icon={Inbox} label="Leads totales" value={kpis.leadsTotal} />
        <Kpi
          icon={Sparkles}
          label="Leads nuevos"
          value={kpis.leadsNuevos}
          href="/admin/leads"
        />
        <Kpi icon={Inbox} label="Leads (7 días)" value={kpis.leads7} />
        <Kpi icon={BellRing} label="Alertas guardadas" value={kpis.alertas} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Autos más vistos */}
        <section className="rounded-lg border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Eye className="size-4 text-primary" aria-hidden />
            <h2 className="font-display text-lg font-semibold text-foreground">
              Autos más vistos
            </h2>
          </div>
          {topVistos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aún no hay datos.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {topVistos.map((v) => (
                <li key={v.id}>
                  <Link
                    href={`/admin/vehiculos/${v.id}/editar`}
                    className="flex items-center gap-3 py-2.5 transition-colors hover:text-primary"
                  >
                    <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded bg-[#0B0B0D]">
                      {v.foto ? (
                        <Image
                          src={v.foto}
                          alt={`${v.marca} ${v.modelo}`}
                          fill
                          sizes="64px"
                          className="object-contain"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {v.marca} {v.modelo}
                      </p>
                      <p className="text-xs text-muted-foreground">{v.anio}</p>
                    </div>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Eye className="size-3.5" aria-hidden />
                      {v.vistas}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Leads recientes */}
        <section className="rounded-lg border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Leads recientes
            </h2>
            <Link
              href="/admin/leads"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Ver todos
            </Link>
          </div>
          {recientes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aún no hay leads.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {recientes.map((l) => {
                const info = leadEstadoInfo(l.estado);
                return (
                  <li
                    key={l.id}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {l.nombre}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {leadOrigenLabel(l.origen)} · {formatFecha(l.created_at)}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                        info.badge
                      )}
                    >
                      {info.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {/* Mini-gráfico: leads por día (14 días) */}
      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
          Leads por día (últimos 14 días)
        </h2>
        <div className="flex h-32 items-end gap-1.5">
          {serie.map((s) => (
            <div
              key={s.dia}
              className="flex flex-1 flex-col items-center justify-end gap-1"
              title={`${s.dia}: ${s.total} ${s.total === 1 ? "lead" : "leads"}`}
            >
              <div
                className="w-full rounded-t bg-primary/70"
                style={{ height: `${(s.total / maxSerie) * 100}%` }}
              />
              <span className="text-[10px] text-muted-foreground">
                {s.dia.slice(8, 10)}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  href?: string;
}) {
  const card = (
    <div className="flex h-full flex-col gap-2 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40">
      <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-4" aria-hidden />
      </span>
      <span className="font-display text-2xl font-bold text-foreground">
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
  return href ? (
    <Link href={href} className="block">
      {card}
    </Link>
  ) : (
    card
  );
}
