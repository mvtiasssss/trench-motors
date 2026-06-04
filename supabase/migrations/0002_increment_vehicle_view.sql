-- =====================================================================
-- Migración 0002 — RPC increment_vehicle_view(p_slug text)
-- Suma 1 a "vistas" del vehículo con ese slug.
-- SECURITY DEFINER: corre con los privilegios del dueño de la función, por
-- lo que NO necesitamos abrir UPDATE en la RLS de vehicles a anon. La web
-- pública puede contar visitas llamando a esta RPC sin exponer escritura.
-- Idempotente: create or replace + grants repetibles.
-- =====================================================================

create or replace function public.increment_vehicle_view(p_slug text)
returns void
language sql
security definer
-- search_path acotado: evita secuestro de funciones por search_path.
set search_path = public
as $$
  update public.vehicles
     set vistas = vistas + 1
   where slug = p_slug;
$$;

-- Sin EXECUTE para el rol genérico public; solo los roles del proyecto.
revoke all on function public.increment_vehicle_view(text) from public;
grant execute on function public.increment_vehicle_view(text) to anon, authenticated;
