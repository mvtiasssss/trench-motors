-- =====================================================================
-- Migración 0004 — leads.origen: permitir 'agendamiento'
-- Necesaria para el Módulo G (Agendar visita / test drive): el endpoint
-- /api/leads inserta leads con origen='agendamiento', pero el CHECK original
-- solo permitía ('contacto','cotizacion','precalificacion'). Sin esta
-- migración el INSERT de agendamiento falla.
-- Idempotente.
-- =====================================================================

alter table public.leads drop constraint if exists leads_origen_check;
alter table public.leads
  add constraint leads_origen_check
  check (origen in ('contacto', 'cotizacion', 'precalificacion', 'agendamiento'));
