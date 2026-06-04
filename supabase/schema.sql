-- =====================================================================
-- Trench Motors — Esquema de base de datos
-- Ejecutar en: Supabase → SQL Editor (ver instrucciones en el chat / README).
-- Es idempotente: puede ejecutarse más de una vez sin error.
-- =====================================================================

-- gen_random_uuid() (disponible en Supabase; pgcrypto por si acaso)
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Tabla: vehicles
-- ---------------------------------------------------------------------
create table if not exists public.vehicles (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,                 -- índice único implícito
  marca       text not null,
  modelo      text not null,
  version     text,
  anio        int  not null,
  precio      bigint not null,                       -- CLP, sin decimales
  kilometraje int  not null default 0,
  tipo        text not null check (tipo in ('sedan','suv','pickup','hatchback','coupe','furgon')),
  transmision text not null check (transmision in ('manual','automatica')),
  combustible text not null check (combustible in ('bencina','diesel','hibrido','electrico')),
  color       text,
  puertas     int,
  condicion   text not null check (condicion in ('nuevo','usado')),
  descripcion text,
  video_url   text,                                  -- YouTube/Vimeo o MP4 (galería)
  vistas      bigint not null default 0,             -- visitas reales a la ficha
  destacado   boolean not null default false,
  vendido     boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Por si la tabla ya existía antes de añadir estas columnas (idempotente).
alter table public.vehicles add column if not exists video_url text;
alter table public.vehicles add column if not exists vistas bigint not null default 0;

-- ---------------------------------------------------------------------
-- Tabla: vehicle_images
-- ---------------------------------------------------------------------
create table if not exists public.vehicle_images (
  id           uuid primary key default gen_random_uuid(),
  vehicle_id   uuid not null references public.vehicles(id) on delete cascade,
  url          text not null,
  orden        int  not null default 0,
  es_principal boolean not null default false,
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Tabla: brands
-- ---------------------------------------------------------------------
create table if not exists public.brands (
  id         uuid primary key default gen_random_uuid(),
  nombre     text not null unique,
  logo_url   text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Tabla: leads
-- ---------------------------------------------------------------------
create table if not exists public.leads (
  id         uuid primary key default gen_random_uuid(),
  nombre     text not null,
  telefono   text,
  email      text,
  mensaje    text,
  vehicle_id uuid references public.vehicles(id) on delete set null,  -- nullable
  origen     text not null check (origen in ('contacto','cotizacion','precalificacion','agendamiento')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Tabla: alertas_busqueda (búsquedas guardadas / alertas)
-- ---------------------------------------------------------------------
create table if not exists public.alertas_busqueda (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  filtros    jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Índices (campos que se filtran / ordenan)
-- ---------------------------------------------------------------------
create index if not exists idx_vehicles_marca     on public.vehicles (marca);
create index if not exists idx_vehicles_precio     on public.vehicles (precio);
create index if not exists idx_vehicles_anio       on public.vehicles (anio);
create index if not exists idx_vehicles_condicion  on public.vehicles (condicion);
create index if not exists idx_vehicles_tipo       on public.vehicles (tipo);
create index if not exists idx_vehicles_destacado  on public.vehicles (destacado);
create index if not exists idx_vehicles_vendido    on public.vehicles (vendido);
-- El índice único de slug lo provee la restricción UNIQUE de la columna.
create index if not exists idx_vehicle_images_vehicle_id on public.vehicle_images (vehicle_id);
create index if not exists idx_leads_vehicle_id          on public.leads (vehicle_id);
create index if not exists idx_alertas_busqueda_email     on public.alertas_busqueda (email);
create index if not exists idx_alertas_busqueda_created_at on public.alertas_busqueda (created_at);

-- ---------------------------------------------------------------------
-- Trigger: mantener updated_at en cada UPDATE de vehicles
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_vehicles_updated_at on public.vehicles;
create trigger trg_vehicles_updated_at
  before update on public.vehicles
  for each row
  execute function public.set_updated_at();

-- =====================================================================
-- Row Level Security (RLS)
-- =====================================================================
alter table public.vehicles         enable row level security;
alter table public.vehicle_images   enable row level security;
alter table public.brands           enable row level security;
alter table public.leads            enable row level security;
alter table public.alertas_busqueda enable row level security;

-- ---- vehicles: SELECT público; escritura solo authenticated --------
drop policy if exists "vehicles_select_public" on public.vehicles;
create policy "vehicles_select_public"
  on public.vehicles for select using (true);

drop policy if exists "vehicles_insert_auth" on public.vehicles;
create policy "vehicles_insert_auth"
  on public.vehicles for insert to authenticated with check (true);

drop policy if exists "vehicles_update_auth" on public.vehicles;
create policy "vehicles_update_auth"
  on public.vehicles for update to authenticated using (true) with check (true);

drop policy if exists "vehicles_delete_auth" on public.vehicles;
create policy "vehicles_delete_auth"
  on public.vehicles for delete to authenticated using (true);

-- ---- vehicle_images: SELECT público; escritura solo authenticated --
drop policy if exists "vehicle_images_select_public" on public.vehicle_images;
create policy "vehicle_images_select_public"
  on public.vehicle_images for select using (true);

drop policy if exists "vehicle_images_insert_auth" on public.vehicle_images;
create policy "vehicle_images_insert_auth"
  on public.vehicle_images for insert to authenticated with check (true);

drop policy if exists "vehicle_images_update_auth" on public.vehicle_images;
create policy "vehicle_images_update_auth"
  on public.vehicle_images for update to authenticated using (true) with check (true);

drop policy if exists "vehicle_images_delete_auth" on public.vehicle_images;
create policy "vehicle_images_delete_auth"
  on public.vehicle_images for delete to authenticated using (true);

-- ---- brands: SELECT público; escritura solo authenticated ----------
drop policy if exists "brands_select_public" on public.brands;
create policy "brands_select_public"
  on public.brands for select using (true);

drop policy if exists "brands_insert_auth" on public.brands;
create policy "brands_insert_auth"
  on public.brands for insert to authenticated with check (true);

drop policy if exists "brands_update_auth" on public.brands;
create policy "brands_update_auth"
  on public.brands for update to authenticated using (true) with check (true);

drop policy if exists "brands_delete_auth" on public.brands;
create policy "brands_delete_auth"
  on public.brands for delete to authenticated using (true);

-- ---- leads: INSERT público (anon); SELECT solo authenticated; -------
-- ----        sin políticas de UPDATE/DELETE (no editable/borrable    --
-- ----        salvo service_role, que omite RLS).                     --
drop policy if exists "leads_insert_public" on public.leads;
create policy "leads_insert_public"
  on public.leads for insert to anon, authenticated with check (true);

drop policy if exists "leads_select_auth" on public.leads;
create policy "leads_select_auth"
  on public.leads for select to authenticated using (true);

-- ---- alertas_busqueda: INSERT público; SELECT solo authenticated ----
drop policy if exists "alertas_busqueda_insert_public" on public.alertas_busqueda;
create policy "alertas_busqueda_insert_public"
  on public.alertas_busqueda for insert to anon, authenticated with check (true);

drop policy if exists "alertas_busqueda_select_auth" on public.alertas_busqueda;
create policy "alertas_busqueda_select_auth"
  on public.alertas_busqueda for select to authenticated using (true);

-- =====================================================================
-- RPC: increment_vehicle_view(p_slug) — suma 1 a "vistas" (SECURITY DEFINER)
-- =====================================================================
create or replace function public.increment_vehicle_view(p_slug text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.vehicles set vistas = vistas + 1 where slug = p_slug;
$$;

revoke all on function public.increment_vehicle_view(text) from public;
grant execute on function public.increment_vehicle_view(text) to anon, authenticated;
