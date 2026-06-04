-- =====================================================================
-- Migración 0003 — tabla alertas_busqueda (búsquedas guardadas / alertas)
-- Captura de leads: el usuario deja su email + los filtros activos del
-- catálogo. El envío del email cuando llega un auto que calza es un proceso
-- aparte (cron/trigger) que se hará después.
-- Idempotente.
-- =====================================================================

create extension if not exists pgcrypto;

create table if not exists public.alertas_busqueda (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  filtros    jsonb not null default '{}'::jsonb,  -- { marca, tipo, precio_max, cuota_max, ... }
  created_at timestamptz not null default now()
);

create index if not exists idx_alertas_busqueda_email      on public.alertas_busqueda (email);
create index if not exists idx_alertas_busqueda_created_at on public.alertas_busqueda (created_at);

-- ---------------------------------------------------------------------
-- Row Level Security
--   INSERT: público (anon + authenticated) → capturamos el lead desde la web.
--   SELECT: solo authenticated (el dueño revisa las alertas en el panel).
--   Sin políticas de UPDATE/DELETE → no editable/borrable salvo service_role.
-- ---------------------------------------------------------------------
alter table public.alertas_busqueda enable row level security;

drop policy if exists "alertas_busqueda_insert_public" on public.alertas_busqueda;
create policy "alertas_busqueda_insert_public"
  on public.alertas_busqueda for insert to anon, authenticated with check (true);

drop policy if exists "alertas_busqueda_select_auth" on public.alertas_busqueda;
create policy "alertas_busqueda_select_auth"
  on public.alertas_busqueda for select to authenticated using (true);
