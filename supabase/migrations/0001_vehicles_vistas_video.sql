-- =====================================================================
-- Migración 0001 — vehicles: columnas "vistas" y "video_url"
-- Ejecutar en: Supabase → SQL Editor.
-- Idempotente: puede ejecutarse más de una vez sin error.
-- =====================================================================

-- Contador de visitas reales a la ficha del vehículo (prueba social honesta).
alter table public.vehicles
  add column if not exists vistas bigint not null default 0;

-- URL de video opcional (YouTube/Vimeo o MP4) para la galería del detalle.
alter table public.vehicles
  add column if not exists video_url text;
