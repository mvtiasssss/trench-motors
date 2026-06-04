import { createAdminClient } from "@/lib/supabase/admin";
import { LeadsTable, type AdminLead } from "@/components/admin/LeadsTable";

export const metadata = { title: "Leads — Admin" };

export default async function AdminLeadsPage() {
  let leads: AdminLead[] = [];
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("leads")
      .select(
        "id, created_at, updated_at, nombre, telefono, email, mensaje, origen, estado, notas, vehiculo:vehicles(id, marca, modelo, anio)"
      )
      .order("created_at", { ascending: false });
    leads = (data ?? []) as unknown as AdminLead[];
  } catch {
    leads = [];
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
          Leads
        </h1>
        <p className="text-sm text-muted-foreground">
          {leads.length} {leads.length === 1 ? "solicitud" : "solicitudes"}.
        </p>
      </div>
      <LeadsTable leads={leads} />
    </div>
  );
}
