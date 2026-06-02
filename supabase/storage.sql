-- =====================================================================
-- Trench Motors — Storage (fotos de vehículos)
-- Ejecutar en: Supabase → SQL Editor, DESPUÉS de schema.sql.
-- Crea el bucket "vehicle-photos" con lectura pública y deja la
-- escritura/borrado solo para usuarios autenticados.
-- Idempotente.
-- =====================================================================

-- Bucket público de lectura
insert into storage.buckets (id, name, public)
values ('vehicle-photos', 'vehicle-photos', true)
on conflict (id) do update set public = excluded.public;

-- RLS de storage.objects ya viene habilitado en Supabase.

-- ---- Lectura pública de los objetos del bucket ----------------------
drop policy if exists "vehicle_photos_public_read" on storage.objects;
create policy "vehicle_photos_public_read"
  on storage.objects for select
  using (bucket_id = 'vehicle-photos');

-- ---- Subida solo para usuarios autenticados -------------------------
drop policy if exists "vehicle_photos_auth_insert" on storage.objects;
create policy "vehicle_photos_auth_insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'vehicle-photos');

-- ---- Actualización solo para usuarios autenticados ------------------
drop policy if exists "vehicle_photos_auth_update" on storage.objects;
create policy "vehicle_photos_auth_update"
  on storage.objects for update to authenticated
  using (bucket_id = 'vehicle-photos')
  with check (bucket_id = 'vehicle-photos');

-- ---- Borrado solo para usuarios autenticados ------------------------
drop policy if exists "vehicle_photos_auth_delete" on storage.objects;
create policy "vehicle_photos_auth_delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'vehicle-photos');
